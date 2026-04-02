"use client";

import { getScoreBadge } from "@/lib/ai-engine";

interface FocusCustomer {
  id: string;
  firstName: string;
  lastName: string;
  vehicleSpecific?: string | null;
  leadScore: number;
  step: number;
}

export function FocusList({ customers, onSelect }: { customers: FocusCustomer[]; onSelect: (id: string) => void }) {
  const top5 = [...customers].sort((a, b) => b.leadScore - a.leadScore).slice(0, 5);

  if (top5.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber/10 to-transparent border border-amber/20 rounded-xl p-4 mb-6">
      <h3 className="text-sm font-bold text-amber uppercase tracking-wider mb-3">🔥 Today&rsquo;s Focus List — Top 5 Leads</h3>
      <div className="space-y-2">
        {top5.map((c, i) => {
          const badge = getScoreBadge(c.leadScore);
          return (
            <button key={c.id} onClick={() => onSelect(c.id)} className="w-full flex items-center gap-3 bg-white/[0.03] rounded-lg p-2.5 hover:bg-white/[0.06] transition text-left">
              <span className="text-lg font-bold text-amber/40 w-5">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{c.firstName} {c.lastName}</p>
                <p className="text-xs text-white/30 truncate">{c.vehicleSpecific || "No vehicle"}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge.color}`}>{badge.emoji} {c.leadScore}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
