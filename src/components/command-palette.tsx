"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const commands = [
  { label: "Go to Dashboard", action: "/dealer", icon: "📊" },
  { label: "Go to Pipeline", action: "/dealer", icon: "🔄" },
  { label: "Go to Analytics", action: "/dealer/analytics", icon: "📈" },
  { label: "Go to Settings", action: "/dealer/settings", icon: "⚙️" },
  { label: "Import Leads", action: "/dealer/import", icon: "📄" },
  { label: "Go to Portal", action: "/portal", icon: "🏠" },
  { label: "Go to Fleet", action: "/fleet", icon: "🚛" },
  { label: "Go to Car Finder", action: "/car-finder", icon: "🔍" },
  { label: "Go to Home", action: "/", icon: "🏡" },
  { label: "Go to FAQ", action: "/faq", icon: "❓" },
  { label: "Go to Contact", action: "/contact", icon: "📞" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  const filtered = commands.filter(c => c.label.toLowerCase().includes(search.toLowerCase()));

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen(o => !o);
      setSearch("");
      setSelected(0);
    }
    if (!open) return;
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && filtered[selected]) { router.push(filtered[selected].action); setOpen(false); }
  }, [open, filtered, selected, router]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-navy-light border border-white/10 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 border-b border-white/5">
          <span className="text-white/30 text-sm">🔍</span>
          <input
            autoFocus
            value={search}
            onChange={e => { setSearch(e.target.value); setSelected(0); }}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-white py-4 text-sm outline-none placeholder-white/30"
          />
          <kbd className="text-[10px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded">ESC</kbd>
        </div>
        <div className="max-h-64 overflow-y-auto py-2">
          {filtered.map((c, i) => (
            <button
              key={c.label}
              onClick={() => { router.push(c.action); setOpen(false); }}
              onMouseEnter={() => setSelected(i)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition ${selected === i ? "bg-amber/10 text-amber" : "text-white/60 hover:bg-white/5"}`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
          {filtered.length === 0 && <p className="text-white/20 text-sm text-center py-4">No results</p>}
        </div>
        <div className="border-t border-white/5 px-4 py-2 flex gap-3 text-[10px] text-white/15">
          <span>↑↓ Navigate</span><span>↵ Select</span><span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
