"use client";

import { useMemo } from "react";
import { trpc } from "@/lib/trpc";

const STEPS = [
  "Consultation", "Lead Received", "Researching", "Negotiating",
  "Client Approval", "Deal Agreed", "Paperwork", "Delivery", "Delivered",
];

export default function FleetAnalyticsPage() {
  const fleetData = trpc.fleet.getFleetCustomers.useQuery(undefined, { retry: false });
  const customers = fleetData.data ?? [];

  const daysActive = (c: any) =>
    Math.max(0, Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86400000));

  /* ── Computed analytics ── */
  const stats = useMemo(() => {
    const total = customers.length;
    const delivered = customers.filter((c: any) => c.step === 8).length;
    const active = customers.filter((c: any) => c.step < 8).length;
    const avgDays = total > 0
      ? Math.round(customers.reduce((sum: number, c: any) => sum + daysActive(c), 0) / total)
      : 0;

    // Group by vehicle type
    const vehicleTypes: Record<string, number> = {};
    customers.forEach((c: any) => {
      const type = c.vehicleType || "Unknown";
      vehicleTypes[type] = (vehicleTypes[type] || 0) + 1;
    });
    const vehicleBreakdown = Object.entries(vehicleTypes)
      .map(([type, count]) => ({ type, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 }))
      .sort((a, b) => b.count - a.count);

    // Group by company
    const companies: Record<string, number> = {};
    customers.forEach((c: any) => {
      const company = c.fleetCompany || "Unassigned";
      companies[company] = (companies[company] || 0) + 1;
    });
    const companyBreakdown = Object.entries(companies)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Pipeline funnel
    const funnel = STEPS.map((name, i) => ({
      name,
      count: customers.filter((c: any) => c.step === i).length,
    }));

    // Delivery rate
    const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

    return { total, delivered, active, avgDays, vehicleBreakdown, companyBreakdown, funnel, deliveryRate };
  }, [customers]);

  const typeColors: Record<string, string> = {
    "Work Trucks": "linear-gradient(to right, #D4A23A, #E8B84A)",
    "Heavy-Duty Trucks": "linear-gradient(to right, #F97316, #FB923C)",
    "Cargo Vans": "linear-gradient(to right, #3B82F6, #60A5FA)",
    "Passenger Vans": "linear-gradient(to right, #8B5CF6, #A78BFA)",
    "Fleet Sedans / SUVs": "linear-gradient(to right, #10B981, #34D399)",
  };
  const defaultGradient = "linear-gradient(to right, #6B7280, #9CA3AF)";

  return (
    <div className="min-h-screen bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Fleet <span className="text-amber">Analytics</span>
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {fleetData.isLoading ? "Loading..." : `${stats.total} fleet vehicles tracked`}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Vehicles", value: String(stats.total), sub: "In pipeline", color: "text-white" },
            { label: "Delivered", value: String(stats.delivered), sub: `${stats.deliveryRate}% delivery rate`, color: "text-green-400" },
            { label: "Active Orders", value: String(stats.active), sub: "In progress", color: "text-amber" },
            { label: "Avg Days / Order", value: `${stats.avgDays}d`, sub: "Time in pipeline", color: "text-blue-400" },
          ].map((k) => (
            <div key={k.label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-2">{k.label}</p>
              <p className={`text-3xl font-bold ${k.color}`} style={{ fontFamily: "var(--font-display)" }}>
                {fleetData.isLoading ? "\u2014" : k.value}
              </p>
              <p className="text-xs text-white/20 mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Pipeline Funnel */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Fleet Pipeline
            </h2>
            <p className="text-xs text-white/30 mb-6">Distribution across stages</p>

            {fleetData.isLoading ? (
              <div className="text-center py-8 text-white/30 text-sm">Loading...</div>
            ) : (
              <div className="space-y-3">
                {stats.funnel.map((s, i) => {
                  const pct = stats.total > 0 ? (s.count / stats.total) * 100 : 0;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-24 text-xs text-white/40 truncate">{s.name}</span>
                      <div className="flex-1 h-6 bg-white/5 rounded overflow-hidden">
                        <div
                          className="h-full rounded flex items-center px-2 transition-all duration-500"
                          style={{
                            width: `${Math.max(pct, s.count > 0 ? 8 : 0)}%`,
                            background: "linear-gradient(to right, #D4A23A, #E8B84A)",
                          }}
                        >
                          {s.count > 0 && <span className="text-[10px] font-bold text-navy">{s.count}</span>}
                        </div>
                      </div>
                      <span className="text-xs text-white/20 w-8 text-right">{pct.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Vehicle Type Breakdown */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Vehicle Types
            </h2>
            <p className="text-xs text-white/30 mb-6">{stats.total} total vehicles</p>

            {fleetData.isLoading ? (
              <div className="text-center py-8 text-white/30 text-sm">Loading...</div>
            ) : stats.vehicleBreakdown.length === 0 ? (
              <p className="text-center py-8 text-white/20 text-sm">No vehicle data yet</p>
            ) : (
              <div className="space-y-5">
                {stats.vehicleBreakdown.map((v) => (
                  <div key={v.type}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">{v.type}</span>
                      <span className="text-white/40">{v.count} vehicles &middot; {v.pct}%</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${v.pct}%`,
                          background: typeColors[v.type] || defaultGradient,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Companies breakdown */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
          <h2 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
            Fleet Companies
          </h2>
          <p className="text-xs text-white/30 mb-8">Vehicles by company</p>

          {fleetData.isLoading ? (
            <div className="text-center py-8 text-white/30 text-sm">Loading...</div>
          ) : stats.companyBreakdown.length === 0 ? (
            <p className="text-center py-8 text-white/20 text-sm">No company data yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.companyBreakdown.map((c) => (
                <div key={c.name} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                  <p className="text-white font-medium mb-1">{c.name}</p>
                  <p className="text-2xl font-bold text-amber" style={{ fontFamily: "var(--font-display)" }}>
                    {c.count}
                  </p>
                  <p className="text-xs text-white/30 mt-1">vehicle{c.count !== 1 ? "s" : ""}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
