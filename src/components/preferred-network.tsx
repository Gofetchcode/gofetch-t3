"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

const TIER_COLORS: Record<string, { bg: string; text: string }> = {
  platinum: { bg: "bg-purple-500/20", text: "text-purple-400" },
  gold: { bg: "bg-amber/20", text: "text-amber" },
  standard: { bg: "bg-blue-500/20", text: "text-blue-400" },
};

export function PreferredNetworkManager() {
  const [showAddDealer, setShowAddDealer] = useState(false);
  const [newDealer, setNewDealer] = useState({ name: "", email: "", phone: "", brand: "", city: "", state: "" });

  const utils = trpc.useUtils();
  const preferred = trpc.outreach.getPreferredNetwork.useQuery(undefined, { retry: false });
  const allDealers = trpc.outreach.getDealerships.useQuery(undefined, { retry: false });
  const updateTier = trpc.outreach.updateDealerTier.useMutation({
    onSuccess: () => {
      utils.outreach.getPreferredNetwork.invalidate();
      utils.outreach.getDealerships.invalidate();
    },
  });
  const addDealership = trpc.outreach.addDealership.useMutation({
    onSuccess: () => {
      utils.outreach.getDealerships.invalidate();
      setShowAddDealer(false);
      setNewDealer({ name: "", email: "", phone: "", brand: "", city: "", state: "" });
    },
  });

  const preferredDealers = preferred.data || [];
  const nonPreferred = (allDealers.data || []).filter(d => !d.isPreferred);

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Preferred Partners", value: preferredDealers.length, color: "text-amber" },
          { label: "Platinum Tier", value: preferredDealers.filter((d: any) => d.preferredTier === "platinum").length, color: "text-purple-400" },
          { label: "Gold Tier", value: preferredDealers.filter((d: any) => d.preferredTier === "gold").length, color: "text-amber" },
          { label: "Total Network", value: (allDealers.data || []).length, color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] rounded-lg p-3 border border-white/5 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Preferred Dealers */}
      <div>
        <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Preferred Partners</h4>
        {preferredDealers.length === 0 ? (
          <p className="text-sm text-white/20 text-center py-6">No preferred dealers yet. Promote dealers from the network below.</p>
        ) : (
          <div className="space-y-2">
            {preferredDealers.map((d: any) => {
              const tier = TIER_COLORS[d.preferredTier || "standard"] || TIER_COLORS.standard;
              return (
                <div key={d.id} className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-lg p-3">
                  <div className={`w-10 h-10 rounded-lg ${tier.bg} flex items-center justify-center`}>
                    <span className={`text-sm font-bold ${tier.text}`}>{(d.name || "?")[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{d.name}</p>
                    <div className="flex items-center gap-2 text-xs text-white/30">
                      {d.brand && <span>{d.brand}</span>}
                      {d.city && <span>{d.city}, {d.state}</span>}
                      {d.responseRate != null && <span>{Math.round(d.responseRate * 100)}% response rate</span>}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${tier.bg} ${tier.text}`}>
                    {d.preferredTier || "standard"}
                  </span>
                  <select
                    value={d.preferredTier || "standard"}
                    onChange={(e) => updateTier.mutate({ dealershipId: d.id, isPreferred: true, preferredTier: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white/50 focus:border-amber outline-none"
                  >
                    <option value="standard">Standard</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                  <button
                    onClick={() => updateTier.mutate({ dealershipId: d.id, isPreferred: false })}
                    className="text-xs text-red-400/50 hover:text-red-400 transition px-2"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Dealers (non-preferred) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider">Dealer Network</h4>
          <button
            onClick={() => setShowAddDealer(true)}
            className="text-xs bg-amber text-navy font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-light transition"
          >
            + Add Dealer
          </button>
        </div>

        {nonPreferred.length === 0 ? (
          <p className="text-sm text-white/20 text-center py-6">No dealers in the network yet.</p>
        ) : (
          <div className="space-y-1.5">
            {nonPreferred.slice(0, 20).map((d: any) => (
              <div key={d.id} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-lg p-2.5 hover:bg-white/[0.04] transition">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-xs font-bold text-white/30">
                  {(d.name || "?")[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/70 truncate">{d.name}</p>
                  <p className="text-[10px] text-white/20">{d.brand || ""} {d.city ? `| ${d.city}` : ""}</p>
                </div>
                {d.responseRate != null && (
                  <span className="text-[10px] text-white/20">{Math.round(d.responseRate * 100)}%</span>
                )}
                <button
                  onClick={() => updateTier.mutate({ dealershipId: d.id, isPreferred: true, preferredTier: "standard" })}
                  className="text-[10px] text-amber/60 hover:text-amber transition px-2"
                >
                  Promote
                </button>
              </div>
            ))}
            {nonPreferred.length > 20 && (
              <p className="text-xs text-white/15 text-center py-2">+{nonPreferred.length - 20} more dealers</p>
            )}
          </div>
        )}
      </div>

      {/* Add Dealer Modal */}
      {showAddDealer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAddDealer(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-navy-light border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-white">Add Dealer to Network</h3>
            <div className="space-y-3">
              <input value={newDealer.name} onChange={(e) => setNewDealer(p => ({ ...p, name: e.target.value }))} placeholder="Dealership Name *" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-amber outline-none" />
              <input value={newDealer.email} onChange={(e) => setNewDealer(p => ({ ...p, email: e.target.value }))} placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-amber outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input value={newDealer.phone} onChange={(e) => setNewDealer(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-amber outline-none" />
                <input value={newDealer.brand} onChange={(e) => setNewDealer(p => ({ ...p, brand: e.target.value }))} placeholder="Brand (Toyota, etc.)" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-amber outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={newDealer.city} onChange={(e) => setNewDealer(p => ({ ...p, city: e.target.value }))} placeholder="City" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-amber outline-none" />
                <input value={newDealer.state} onChange={(e) => setNewDealer(p => ({ ...p, state: e.target.value }))} placeholder="State" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-amber outline-none" />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { if (newDealer.name) addDealership.mutate(newDealer); }}
                  disabled={!newDealer.name || addDealership.isPending}
                  className="flex-1 bg-amber text-navy font-bold py-3 rounded-lg hover:bg-amber-light transition disabled:opacity-50"
                >
                  {addDealership.isPending ? "Adding..." : "Add Dealer"}
                </button>
                <button onClick={() => setShowAddDealer(false)} className="px-6 py-3 border border-white/10 rounded-lg text-white/40 hover:text-white transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
