"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

const STEPS = [
  "Lead Sent", "Lead Received", "Working", "Negotiating",
  "Client Approval", "Deal Agreed", "Paperwork Sent & Signed",
  "Scheduled for Pickup", "Delivered",
];

export default function DealerPage() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"customers" | "pipeline">("customers");

  // Store pin in a ref-like state for tRPC headers
  const customers = trpc.customer.getAll.useQuery(undefined, {
    enabled: authed,
    trpc: { context: { headers: { "x-dealer-pin": pin } } } as any,
  });

  const handleLogin = () => {
    if (pin.length >= 4) setAuthed(true);
    else setError("PIN must be at least 4 digits");
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-navy-light border border-white/[0.06] rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-cream text-center mb-2">Dealer Management</h3>
          <p className="text-sm text-cream/40 text-center mb-6">Enter your dealer PIN to access the dashboard.</p>
          <input
            type="password"
            placeholder="4-digit PIN"
            maxLength={10}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-cream text-sm mb-3 text-center tracking-widest focus:border-amber focus:outline-none"
          />
          {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-amber text-navy font-semibold py-3 rounded-lg hover:bg-amber-light transition"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  const data = customers.data ?? [];
  const byStep = STEPS.map((name, i) => ({
    name,
    count: data.filter((c) => c.step === i).length,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 bg-white/[0.02] rounded-lg p-4 border border-white/[0.04]">
        <h2 className="text-xl font-bold text-cream">
          Dealer <span className="text-amber">Management</span>
        </h2>
        <button
          onClick={() => { setAuthed(false); setPin(""); }}
          className="border border-white/10 px-4 py-2 rounded-lg text-sm text-cream/50 hover:text-cream transition"
        >
          Sign Out
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="text-2xl font-bold text-cream">{data.length}</div>
          <div className="text-xs text-cream/30 uppercase">Total Customers</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="text-2xl font-bold text-green-400">
            {data.filter((c) => c.step === 8).length}
          </div>
          <div className="text-xs text-cream/30 uppercase">Delivered</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="text-2xl font-bold text-amber">
            {data.filter((c) => c.step >= 1 && c.step < 8).length}
          </div>
          <div className="text-xs text-cream/30 uppercase">Active Deals</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-black/25 rounded-xl p-1 mb-6 border border-white/[0.04]">
        {(["customers", "pipeline"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
              tab === t
                ? "bg-gradient-to-r from-amber to-amber-light text-navy shadow-md shadow-amber/30"
                : "text-cream/40 hover:text-cream/60"
            }`}
          >
            {t === "customers" ? "Customers" : "Pipeline"}
          </button>
        ))}
      </div>

      {/* Customers Tab */}
      {tab === "customers" && (
        <div className="space-y-3">
          {customers.isLoading && <p className="text-cream/40 text-sm">Loading...</p>}
          {data.map((c) => (
            <div key={c.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-cream text-sm">{c.name}</div>
                <div className="text-xs text-cream/30">{c.email} &bull; {c.phone}</div>
                <div className="text-xs text-cream/40 mt-1">{c.vehicle || "No vehicle yet"}</div>
              </div>
              <div className="text-right">
                <span className="inline-block bg-amber/20 text-amber text-xs font-semibold px-2 py-1 rounded">
                  {STEPS[c.step]}
                </span>
                {c.tags?.map((ct: any) => (
                  <span
                    key={ct.tag.id}
                    className="inline-block text-xs font-medium px-2 py-0.5 rounded ml-1"
                    style={{ backgroundColor: ct.tag.color + "33", color: ct.tag.color }}
                  >
                    {ct.tag.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {data.length === 0 && !customers.isLoading && (
            <p className="text-cream/30 text-sm text-center py-8">No customers yet.</p>
          )}
        </div>
      )}

      {/* Pipeline Tab */}
      {tab === "pipeline" && (
        <div className="space-y-2">
          {byStep.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-40 text-sm text-cream/50 truncate">{s.name}</div>
              <div className="flex-1 h-7 bg-white/5 rounded">
                <div
                  className="h-full bg-gradient-to-r from-amber to-amber-light/40 rounded flex items-center px-3 transition-all"
                  style={{ width: `${data.length ? (s.count / data.length) * 100 : 0}%`, minWidth: s.count > 0 ? "40px" : "0" }}
                >
                  <span className="text-xs font-semibold text-navy">{s.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
