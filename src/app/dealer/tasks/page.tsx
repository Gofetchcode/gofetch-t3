"use client";

import { useState } from "react";

const mockTasks = [
  { id: "1", title: "Follow up with John Smith", customer: "John Smith", dueDate: "2026-04-02", priority: "high", status: "open" },
  { id: "2", title: "Send offer to Sarah Johnson", customer: "Sarah Johnson", dueDate: "2026-04-02", priority: "urgent", status: "in_progress" },
  { id: "3", title: "Review Mike Davis documents", customer: "Mike Davis", dueDate: "2026-04-03", priority: "normal", status: "open" },
  { id: "4", title: "Schedule delivery for Lisa Wang", customer: "Lisa Wang", dueDate: "2026-04-04", priority: "normal", status: "completed" },
  { id: "5", title: "Call Robert Brown — trade-in appraisal", customer: "Robert Brown", dueDate: "2026-04-01", priority: "high", status: "overdue" },
];

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
  overdue: "bg-red-500/20 text-red-400",
};

export default function TasksPage() {
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = filter === "all" ? mockTasks : mockTasks.filter(t => t.status === filter);
  const overdue = mockTasks.filter(t => t.status === "overdue").length;
  const open = mockTasks.filter(t => t.status === "open" || t.status === "in_progress").length;

  return (
    <div className="text-white p-6">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Tasks</h2>
            <p className="text-sm text-white/30">{open} open &bull; {overdue} overdue</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber-light transition">+ New Task</button>
        </div>

        {/* Filters */}
        <div className="flex gap-1 mb-6">
          {["all", "open", "in_progress", "completed", "overdue"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition ${filter === f ? "bg-amber text-navy" : "bg-white/5 text-white/40 hover:text-white"}`}>
              {f === "in_progress" ? "In Progress" : f}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:bg-white/[0.05] transition">
              <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${t.status === "completed" ? "border-green-400 bg-green-400/20" : "border-white/20"}`}>
                {t.status === "completed" && <span className="text-green-400 text-xs">✓</span>}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${t.status === "completed" ? "line-through text-white/30" : "text-white"}`}>{t.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-white/30">{t.customer}</span>
                  <span className="text-xs text-white/20">Due: {t.dueDate}</span>
                </div>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[t.status]}`}>{t.status.replace("_", " ")}</span>
            </div>
          ))}
        </div>

        {/* Add Task Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-navy-light border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">New Task</h3>
              <div className="space-y-3">
                <input placeholder="Task title" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none" />
                <input placeholder="Customer name" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none" />
                  <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none">
                    <option>Normal</option><option>Low</option><option>High</option><option>Urgent</option>
                  </select>
                </div>
                <textarea placeholder="Description..." rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none resize-none" />
                <div className="flex gap-3">
                  <button onClick={() => setShowAdd(false)} className="flex-1 bg-amber text-navy font-bold py-3 rounded-lg hover:bg-amber-light transition">Create Task</button>
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
