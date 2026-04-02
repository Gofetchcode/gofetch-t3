"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

const STEPS = [
  "Consultation", "Lead Received", "Researching", "Negotiating",
  "Client Approval", "Deal Agreed", "Paperwork", "Delivery", "Delivered",
];

const STEP_COLORS = [
  "bg-gray-200", "bg-blue-200", "bg-blue-300", "bg-amber/30",
  "bg-amber/50", "bg-amber", "bg-green-200", "bg-green-300", "bg-green-500",
];

export default function DealerPage() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"pipeline" | "customers" | "analytics">("pipeline");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [search, setSearch] = useState("");

  const customers = trpc.customer.getAll.useQuery(undefined, {
    enabled: authed,
  });

  const handleLogin = () => {
    if (pin.length >= 4) setAuthed(true);
    else setError("PIN must be at least 4 digits");
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-navy-light border border-white/10 rounded-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber flex items-center justify-center">
              <span className="text-navy font-bold text-2xl" style={{ fontFamily: "var(--font-display)" }}>G</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white text-center mb-1">Dealer CRM</h3>
          <p className="text-sm text-white/40 text-center mb-8">Enter your PIN to access the dashboard.</p>
          <input
            type="password"
            placeholder="PIN"
            maxLength={10}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-center text-lg tracking-[0.3em] focus:border-amber outline-none mb-4"
          />
          {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}
          <button onClick={handleLogin} className="w-full bg-amber text-navy font-bold py-3 rounded-lg hover:bg-amber-light transition">
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  const data = customers.data ?? [];
  const filtered = data.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.vehicleSpecific ?? "").toLowerCase().includes(q)
    );
  });

  const byStep = STEPS.map((name, i) => ({
    name,
    customers: filtered.filter((c) => c.step === i),
  }));

  const totalLeads = data.length;
  const activeDeals = data.filter((c) => c.step >= 1 && c.step < 8).length;
  const delivered = data.filter((c) => c.step === 8).length;
  const conversionRate = totalLeads > 0 ? Math.round((delivered / totalLeads) * 100) : 0;

  return (
    <div className="min-h-screen bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 py-6 pt-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white/[0.03] rounded-xl p-5 border border-white/5">
          <div>
            <h2 className="text-xl font-bold">
              GoFetch <span className="text-amber">CRM</span>
            </h2>
            <p className="text-xs text-white/30">{data.length} total clients</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 focus:border-amber outline-none w-60"
            />
            <button onClick={() => { setAuthed(false); setPin(""); }} className="border border-white/10 px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white transition">
              Sign Out
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Leads", value: totalLeads, color: "border-l-blue-400" },
            { label: "Active Deals", value: activeDeals, color: "border-l-amber" },
            { label: "Delivered", value: delivered, color: "border-l-green-400" },
            { label: "Conversion", value: `${conversionRate}%`, color: "border-l-purple-400" },
          ].map((kpi) => (
            <div key={kpi.label} className={`bg-white/[0.03] border border-white/5 ${kpi.color} border-l-3 rounded-xl p-4`}>
              <div className="text-2xl font-bold text-white">{kpi.value}</div>
              <div className="text-xs text-white/30 uppercase tracking-wider">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-black/30 rounded-xl p-1 mb-6 border border-white/5">
          {(["pipeline", "customers", "analytics"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition ${
                tab === t ? "bg-gradient-to-r from-amber to-amber-light text-navy shadow-md" : "text-white/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* PIPELINE VIEW */}
        {tab === "pipeline" && (
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 overflow-x-auto">
            {byStep.slice(0, 5).map((col, i) => (
              <div key={i} className="bg-white/[0.02] rounded-xl border border-white/5 p-3 min-w-[200px]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">{col.name}</span>
                  <span className="bg-white/10 text-white/60 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{col.customers.length}</span>
                </div>
                <div className="space-y-2">
                  {col.customers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className="bg-white/[0.04] rounded-lg p-3 cursor-pointer hover:bg-white/[0.08] transition border border-white/5"
                    >
                      <p className="text-sm font-medium text-white truncate">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-white/30 truncate">{c.vehicleSpecific || c.vehicleType || "No vehicle"}</p>
                      <p className="text-xs text-white/20 mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CUSTOMERS TABLE */}
        {tab === "customers" && (
          <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="p-3 text-xs text-white/30 font-semibold uppercase">Client</th>
                  <th className="p-3 text-xs text-white/30 font-semibold uppercase">Vehicle</th>
                  <th className="p-3 text-xs text-white/30 font-semibold uppercase">Status</th>
                  <th className="p-3 text-xs text-white/30 font-semibold uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition"
                  >
                    <td className="p-3">
                      <p className="font-medium text-white">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-white/30">{c.email}</p>
                    </td>
                    <td className="p-3 text-white/60">{c.vehicleSpecific || c.vehicleType || "—"}</td>
                    <td className="p-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${STEP_COLORS[c.step]} text-navy`}>
                        {STEPS[c.step]}
                      </span>
                    </td>
                    <td className="p-3 text-white/30">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ANALYTICS */}
        {tab === "analytics" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/[0.03] rounded-xl border border-white/5 p-6">
              <h4 className="text-sm font-semibold text-white/60 mb-4">Pipeline Funnel</h4>
              {byStep.map((s, i) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <span className="w-28 text-xs text-white/40 truncate">{s.name}</span>
                  <div className="flex-1 h-6 bg-white/5 rounded">
                    <div
                      className="h-full bg-gradient-to-r from-amber to-amber-light/40 rounded flex items-center px-2 transition-all"
                      style={{ width: `${data.length ? (s.customers.length / data.length) * 100 : 0}%`, minWidth: s.customers.length > 0 ? "30px" : "0" }}
                    >
                      <span className="text-xs font-bold text-navy">{s.customers.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white/[0.03] rounded-xl border border-white/5 p-6">
              <h4 className="text-sm font-semibold text-white/60 mb-4">Key Metrics</h4>
              <div className="space-y-4">
                <div className="flex justify-between"><span className="text-white/40">Total Revenue</span><span className="font-bold text-amber">${delivered * 99}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Avg Deal Time</span><span className="font-bold">12 days</span></div>
                <div className="flex justify-between"><span className="text-white/40">Avg Savings/Client</span><span className="font-bold text-green-400">$3,400</span></div>
                <div className="flex justify-between"><span className="text-white/40">Fleet vs Retail</span><span className="font-bold">{data.filter(c=>c.isFleet).length} / {data.filter(c=>!c.isFleet).length}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* DETAIL SLIDE-IN PANEL */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedCustomer(null)}>
            <div className="bg-black/50 absolute inset-0" />
            <div
              className="relative w-full max-w-lg bg-navy-light border-l border-white/10 h-full overflow-y-auto animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
                  <button onClick={() => setSelectedCustomer(null)} className="text-white/30 hover:text-white text-xl">&times;</button>
                </div>
                <div className="space-y-4 text-sm">
                  <div><span className="text-white/30">Email:</span> <span className="ml-2">{selectedCustomer.email}</span></div>
                  <div><span className="text-white/30">Phone:</span> <span className="ml-2">{selectedCustomer.phone}</span></div>
                  <div><span className="text-white/30">Vehicle:</span> <span className="ml-2">{selectedCustomer.vehicleSpecific || selectedCustomer.vehicleType || "—"}</span></div>
                  <div><span className="text-white/30">Budget:</span> <span className="ml-2">{selectedCustomer.budget || "—"}</span></div>
                  <div><span className="text-white/30">Status:</span> <span className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${STEP_COLORS[selectedCustomer.step]} text-navy`}>{STEPS[selectedCustomer.step]}</span></div>
                  <div><span className="text-white/30">Client ID:</span> <span className="ml-2 text-amber">{selectedCustomer.gofetchClientId || "—"}</span></div>
                  <div><span className="text-white/30">Source:</span> <span className="ml-2">{selectedCustomer.source || "—"}</span></div>
                  <div><span className="text-white/30">Timeline:</span> <span className="ml-2">{selectedCustomer.timeline || "—"}</span></div>
                  {selectedCustomer.notes && (
                    <div><span className="text-white/30">Notes:</span><p className="mt-1 text-white/60 bg-white/5 p-3 rounded-lg">{selectedCustomer.notes}</p></div>
                  )}
                  <div><span className="text-white/30">Created:</span> <span className="ml-2">{new Date(selectedCustomer.createdAt).toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
