"use client";

import { useState } from "react";

const workspaces = [
  { id: "manager", label: "Manager", icon: "👔", desc: "Team stats, escalations, pipeline health" },
  { id: "advocate", label: "Advocate", icon: "🧑", desc: "My leads, tasks, focus list, messages" },
  { id: "desk", label: "Desk", icon: "💰", desc: "Simplified desking for building offers" },
  { id: "analytics", label: "Analytics", icon: "📊", desc: "Full-screen charts and reports" },
  { id: "comms", label: "Comms", icon: "💬", desc: "Unified inbox for all conversations" },
];

export function WorkspaceSwitcher({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm hover:bg-white/10 transition"
      >
        <span>{workspaces.find(w => w.id === current)?.icon || "👔"}</span>
        <span className="text-white/60">{workspaces.find(w => w.id === current)?.label || "Manager"}</span>
        <span className="text-white/20 text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-navy-light border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-2 border-b border-white/5">
            <p className="text-[10px] text-white/20 uppercase tracking-wider px-2">Workspace Mode</p>
          </div>
          {workspaces.map(w => (
            <button
              key={w.id}
              onClick={() => { onChange(w.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition ${current === w.id ? "bg-amber/10 text-amber" : "text-white/60 hover:bg-white/5"}`}
            >
              <span className="text-lg">{w.icon}</span>
              <div>
                <p className="text-sm font-medium">{w.label}</p>
                <p className="text-[10px] text-white/30">{w.desc}</p>
              </div>
              {current === w.id && <span className="ml-auto text-amber text-xs">●</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
