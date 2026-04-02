"use client";

const kpis = [
  { label: "Total Spend", value: "$1,284,000", sub: "YTD 2026", color: "text-white" },
  { label: "Total Savings", value: "$76,550", sub: "vs MSRP", color: "text-green-400" },
  { label: "Vehicles Purchased", value: "34", sub: "Across 5 orders", color: "text-amber" },
  { label: "Avg Cost / Vehicle", value: "$37,765", sub: "Below market avg", color: "text-white" },
];

const monthlySpend = [
  { month: "Oct", value: 148000 },
  { month: "Nov", value: 192000 },
  { month: "Dec", value: 165000 },
  { month: "Jan", value: 234000 },
  { month: "Feb", value: 278000 },
  { month: "Mar", value: 267000 },
];

const vehicleTypes = [
  { type: "Trucks", count: 14, pct: 41 },
  { type: "Vans", count: 11, pct: 32 },
  { type: "Sedans", count: 3, pct: 9 },
  { type: "SUVs", count: 6, pct: 18 },
];

const maxSpend = Math.max(...monthlySpend.map((m) => m.value));

export default function FleetAnalyticsPage() {
  return (
    <div className="min-h-screen bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Fleet <span className="text-amber">Analytics</span>
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Spend tracking, savings breakdown, and fleet composition.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6"
            >
              <p className="text-xs text-white/30 uppercase tracking-wider mb-2">
                {k.label}
              </p>
              <p
                className={`text-3xl font-bold ${k.color}`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {k.value}
              </p>
              <p className="text-xs text-white/20 mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Monthly Spend Bar Chart */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h2
              className="text-lg font-bold text-white mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Monthly Spend
            </h2>
            <p className="text-xs text-white/30 mb-6">Last 6 months</p>

            <div className="flex items-end gap-3 h-48">
              {monthlySpend.map((m) => {
                const pct = (m.value / maxSpend) * 100;
                return (
                  <div
                    key={m.month}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span className="text-xs text-white/50 font-medium">
                      ${(m.value / 1000).toFixed(0)}k
                    </span>
                    <div className="w-full relative" style={{ height: "140px" }}>
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${pct}%`,
                          background:
                            "linear-gradient(to top, #D4A23A, #E8B84A)",
                        }}
                      />
                    </div>
                    <span className="text-xs text-white/30 font-medium">
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vehicle Type Breakdown */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h2
              className="text-lg font-bold text-white mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Vehicle Type Breakdown
            </h2>
            <p className="text-xs text-white/30 mb-6">
              {vehicleTypes.reduce((s, v) => s + v.count, 0)} total vehicles
            </p>

            <div className="space-y-5">
              {vehicleTypes.map((v) => (
                <div key={v.type}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white font-medium">{v.type}</span>
                    <span className="text-white/40">
                      {v.count} vehicles &middot; {v.pct}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${v.pct}%`,
                        background:
                          v.type === "Trucks"
                            ? "linear-gradient(to right, #D4A23A, #E8B84A)"
                            : v.type === "Vans"
                              ? "linear-gradient(to right, #3B82F6, #60A5FA)"
                              : v.type === "Sedans"
                                ? "linear-gradient(to right, #8B5CF6, #A78BFA)"
                                : "linear-gradient(to right, #10B981, #34D399)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Savings vs MSRP Comparison */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
          <h2
            className="text-lg font-bold text-white mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Savings vs MSRP
          </h2>
          <p className="text-xs text-white/30 mb-8">
            Your fleet purchasing power through GoFetch Auto.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 text-center">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
                Total MSRP
              </p>
              <p
                className="text-4xl sm:text-5xl font-bold text-white/60"
                style={{ fontFamily: "var(--font-display)" }}
              >
                $1,360,550
              </p>
              <p className="text-xs text-white/20 mt-2">
                Combined sticker price for 34 vehicles
              </p>
            </div>

            <div className="bg-white/[0.02] border border-amber/20 rounded-2xl p-8 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background:
                    "radial-gradient(circle at center, #D4A23A, transparent 70%)",
                }}
              />
              <p className="text-xs text-white/30 uppercase tracking-wider mb-3 relative">
                You Paid
              </p>
              <p
                className="text-4xl sm:text-5xl font-bold text-amber relative"
                style={{ fontFamily: "var(--font-display)" }}
              >
                $1,284,000
              </p>
              <p className="text-xs text-green-400 mt-2 relative font-medium">
                You saved $76,550 (5.6%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
