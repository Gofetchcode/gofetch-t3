"use client";

import { getNextBestAction, getScoreBadge, calculateDealHealth } from "@/lib/ai-engine";

interface Customer {
  id: string; firstName: string; lastName: string; step: number; leadScore: number;
  contractSigned: boolean; paid: boolean; createdAt: string | Date;
  documents?: { length: number }; messages?: { sender: string; createdAt: string | Date }[];
  deskingOffers?: { status: string }[];
}

export function NextBestActionBadge({ customer }: { customer: Customer }) {
  const action = getNextBestAction(customer);
  const score = getScoreBadge(customer.leadScore);
  const health = calculateDealHealth(customer);

  return (
    <div className="space-y-1.5">
      {/* Lead Score Badge */}
      <div className="flex items-center gap-1.5">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${score.color}`}>{score.emoji} {customer.leadScore}</span>
        <span className="text-[10px]" title={`Deal Health: ${health.label}`}>{health.icon}</span>
      </div>
      {/* AI Suggestion */}
      <div className="bg-amber/10 border border-amber/20 rounded-lg px-2 py-1.5">
        <p className="text-[10px] text-amber font-semibold">AI Suggests:</p>
        <p className="text-[10px] text-white/60">{action.icon} {action.action}</p>
        <p className="text-[9px] text-white/20">{action.reason}</p>
      </div>
    </div>
  );
}

export function FocusActions({ customers }: { customers: Customer[] }) {
  const actions = customers
    .filter(c => c.step < 8)
    .map(c => ({ customer: c, ...getNextBestAction(c), score: c.leadScore }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="bg-gradient-to-r from-amber/10 to-transparent border border-amber/20 rounded-xl p-4">
      <h3 className="text-sm font-bold text-amber uppercase tracking-wider mb-3">🎯 Today&rsquo;s Recommended Actions</h3>
      <div className="space-y-2">
        {actions.map((a, i) => (
          <div key={a.customer.id} className="flex items-center gap-3 bg-white/[0.02] rounded-lg p-2">
            <span className="text-lg">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white">{a.customer.firstName} {a.customer.lastName}</p>
              <p className="text-[10px] text-white/40">{a.action}</p>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${getScoreBadge(a.score).color}`}>{a.score}</span>
          </div>
        ))}
        {actions.length === 0 && <p className="text-xs text-white/20 text-center py-2">No active deals</p>}
      </div>
    </div>
  );
}
