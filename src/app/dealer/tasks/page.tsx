"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-red-500/20 text-red-400",
  high: "bg-amber/20 text-amber",
  normal: "bg-blue-500/20 text-blue-400",
  low: "bg-white/10 text-white/40",
};

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-500/20 text-blue-400",
  in_progress: "bg-amber/20 text-amber",
  completed: "bg-green-500/20 text-green-400",
};

export default function TasksPage() {
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", priority: "normal" });

  const utils = trpc.useUtils();

  const tasksQuery = trpc.tasks.list.useQuery(
    filter !== "all" ? { status: filter } : undefined,
    { retry: false }
  );

  const overdueQuery = trpc.tasks.getOverdue.useQuery(undefined, { retry: false });

  const createTask = trpc.tasks.create.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      utils.tasks.getOverdue.invalidate();
      setShowAdd(false);
      setNewTask({ title: "", description: "", dueDate: "", priority: "normal" });
    },
  });

  const completeTask = trpc.tasks.complete.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      utils.tasks.getOverdue.invalidate();
    },
  });

  const updateTask = trpc.tasks.update.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      utils.tasks.getOverdue.invalidate();
    },
  });

  const tasks = tasksQuery.data ?? [];
  const overdueCount = overdueQuery.data?.length ?? 0;
  const openCount = tasks.filter((t: any) => t.status === "open" || t.status === "in_progress").length;

  const isOverdue = (t: any) => t.status !== "completed" && t.dueDate && new Date(t.dueDate) < new Date();

  const handleCreate = () => {
    if (!newTask.title.trim()) return;
    createTask.mutate({
      userId: "system",
      title: newTask.title,
      description: newTask.description || undefined,
      dueDate: newTask.dueDate || undefined,
      priority: newTask.priority,
    });
  };

  return (
    <div className="text-white p-6">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Tasks</h2>
            <p className="text-sm text-white/30">
              {openCount} open
              {overdueCount > 0 && <span className="text-red-400"> &bull; {overdueCount} overdue</span>}
            </p>
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber-light transition">+ New Task</button>
        </div>

        {/* Filters */}
        <div className="flex gap-1 mb-6">
          {["all", "open", "in_progress", "completed"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition ${filter === f ? "bg-amber text-navy" : "bg-white/5 text-white/40 hover:text-white"}`}>
              {f === "in_progress" ? "In Progress" : f}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {tasksQuery.isLoading && (
          <div className="text-center py-12 text-white/20 text-sm">Loading tasks...</div>
        )}

        {/* Error state */}
        {tasksQuery.isError && (
          <div className="text-center py-12">
            <p className="text-white/30 text-sm mb-2">Could not load tasks.</p>
            <p className="text-white/15 text-xs">Make sure you are logged in to the CRM dashboard first.</p>
          </div>
        )}

        {/* Tasks List */}
        {tasksQuery.isSuccess && (
          <div className="space-y-2">
            {tasks.length === 0 && (
              <div className="text-center py-12 text-white/20 text-sm">
                {filter === "all" ? "No tasks yet. Create your first task above." : `No ${filter.replace("_", " ")} tasks.`}
              </div>
            )}
            {tasks.map((t: any) => (
              <div key={t.id} className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:bg-white/[0.05] transition group">
                <button
                  onClick={() => {
                    if (t.status === "completed") {
                      updateTask.mutate({ id: t.id, status: "open" });
                    } else {
                      completeTask.mutate({ id: t.id });
                    }
                  }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                    t.status === "completed" ? "border-green-400 bg-green-400/20" : "border-white/20 hover:border-amber"
                  }`}
                >
                  {t.status === "completed" && <span className="text-green-400 text-xs">&#10003;</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${t.status === "completed" ? "line-through text-white/30" : "text-white"}`}>{t.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {t.description && <span className="text-xs text-white/20 truncate max-w-[200px]">{t.description}</span>}
                    {t.dueDate && (
                      <span className={`text-xs ${isOverdue(t) ? "text-red-400" : "text-white/20"}`}>
                        Due: {new Date(t.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[t.priority] || PRIORITY_COLORS.normal}`}>{t.priority}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[t.status] || STATUS_COLORS.open}`}>{(t.status || "open").replace("_", " ")}</span>
                {t.status !== "completed" && t.status !== "in_progress" && (
                  <button
                    onClick={() => updateTask.mutate({ id: t.id, status: "in_progress" })}
                    className="text-[10px] text-white/20 hover:text-amber transition opacity-0 group-hover:opacity-100"
                  >
                    Start
                  </button>
                )}
                {isOverdue(t) && (
                  <span className="text-[9px] text-red-400 font-medium">OVERDUE</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Task Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-navy-light border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">New Task</h3>
              <div className="space-y-3">
                <input
                  value={newTask.title}
                  onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))}
                  placeholder="Task title *"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none"
                />
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(p => ({ ...p, description: e.target.value }))}
                  placeholder="Description (optional)"
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none resize-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(p => ({ ...p, dueDate: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none"
                  />
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(p => ({ ...p, priority: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreate}
                    disabled={createTask.isPending || !newTask.title.trim()}
                    className="flex-1 bg-amber text-navy font-bold py-3 rounded-lg hover:bg-amber-light transition disabled:opacity-50"
                  >
                    {createTask.isPending ? "Creating..." : "Create Task"}
                  </button>
                  <button onClick={() => setShowAdd(false)} className="px-6 py-3 border border-white/10 rounded-lg text-white/40 hover:text-white transition">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
