"use client";

import { useState } from "react";

/* ── Mock Data ───────────────────────────────────────────────── */

const funnelSteps = [
  { label: "Leads", count: 142 },
  { label: "Contacted", count: 118 },
  { label: "Working", count: 87 },
  { label: "Negotiating", count: 54 },
  { label: "Approved", count: 38 },
  { label: "Closing", count: 29 },
  { label: "Delivered", count: 24 },
];

const responseData = { under15: 42, under30: 28, over30: 18, noContact: 12 };

const revenueByMonth = [
  { month: "Jan", retail: 1200, fleet: 2400 },
  { month: "Feb", retail: 1800, fleet: 3200 },
  { month: "Mar", retail: 2400, fleet: 4100 },
  { month: "Apr", retail: 2900, fleet: 3800 },
  { month: "May", retail: 3100, fleet: 4400 },
];

const advocateData = [
  { name: "Marcus J.", leads: 28, responseTime: "8min", score: 94, status: "online" },
  { name: "Sarah K.", leads: 22, responseTime: "12min", score: 87, status: "online" },
  { name: "David L.", leads: 17, responseTime: "22min", score: 72, status: "offline" },
  { name: "Amy R.", leads: 14, responseTime: "11min", score: 81, status: "online" },
  { name: "Jordan T.", leads: 10, responseTime: "31min", score: 58, status: "offline" },
];

const dailyActivity = {
  inbound:  { calls: 34, emails: 52, texts: 88, visits: 12, deals: 3 },
  outbound: { calls: 61, emails: 73, texts: 112, visits: 0, deals: 0 },
};

const appointments = [
  { time: "10:30 AM", name: "Robert Chen", type: "Test Drive", vehicle: "2024 F-150 XLT" },
  { time: "1:00 PM", name: "Maria Gonzalez", type: "Finance Review", vehicle: "2024 Explorer ST" },
  { time: "3:45 PM", name: "James Wilson", type: "Delivery", vehicle: "2024 Mustang GT" },
];

const recentActivity = [
  { icon: "phone", text: "Marcus J. called Robert Chen", time: "4 min ago" },
  { icon: "mail", text: "Sarah K. sent follow-up to Maria G.", time: "12 min ago" },
  { icon: "bot", text: "AI auto-texted 3 overnight leads", time: "1 hr ago" },
  { icon: "check", text: "David L. closed Deal #1087", time: "2 hrs ago" },
  { icon: "alert", text: "New web lead assigned to Amy R.", time: "3 hrs ago" },
];

const leaderboard = [
  { name: "Marcus J.", deals: 12, badge: "gold" },
  { name: "Sarah K.", deals: 9, badge: "silver" },
  { name: "David L.", deals: 7, badge: "bronze" },
];

const TIME_FILTERS = ["Today", "Yesterday", "7 Days", "30 Days", "MTD", "Custom"] as const;

/* ── Helpers ──────────────────────────────────────────────────── */

const activityIcon = (icon: string) => {
  switch (icon) {
    case "phone": return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
    );
    case "mail": return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    );
    case "bot": return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    );
    case "check": return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    );
    default: return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    );
  }
};

const badgeColor = (b: string) => {
  if (b === "gold") return "text-yellow-400";
  if (b === "silver") return "text-gray-300";
  return "text-amber-700";
};

const badgeEmoji = (b: string) => {
  if (b === "gold") return "1st";
  if (b === "silver") return "2nd";
  return "3rd";
};

/* ── Component ───────────────────────────────────────────────── */

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<string>("30 Days");

  /* donut math */
  const total = responseData.under15 + responseData.under30 + responseData.over30 + responseData.noContact;
  const segments = [
    { pct: responseData.under15, color: "#4ade80" },
    { pct: responseData.under30, color: "#D4A23A" },
    { pct: responseData.over30, color: "#ef4444" },
    { pct: responseData.noContact, color: "#334155" },
  ];
  let cumulativeOffset = 0;

  return (
    <div className="text-white p-6">
      <div className="max-w-[1600px] mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Dealer Analytics</h2>
        </div>

        {/* ═══════ 60 / 40 Layout ═══════ */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* ───── LEFT COLUMN (60% = 3/5) ───── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Time Filters */}
            <div className="flex flex-wrap bg-black/30 rounded-lg p-1 border border-white/5 gap-1">
              {TIME_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setPeriod(f)}
                  className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                    period === f
                      ? "bg-amber text-navy shadow-lg shadow-amber/20"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Sales Funnel */}
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">Sales Funnel</h3>
              <div className="flex items-center justify-between overflow-x-auto pb-2">
                {funnelSteps.map((step, i) => (
                  <div key={step.label} className="flex items-center">
                    {/* Circle */}
                    <div className="flex flex-col items-center min-w-[72px]">
                      <div
                        className="rounded-full border-2 border-amber/60 flex items-center justify-center bg-amber/10 mb-2"
                        style={{
                          width: `${Math.max(40, 72 - i * 4)}px`,
                          height: `${Math.max(40, 72 - i * 4)}px`,
                        }}
                      >
                        <span className="text-base font-bold text-amber">{step.count}</span>
                      </div>
                      <span className="text-[10px] text-white/50 text-center leading-tight">{step.label}</span>
                    </div>
                    {/* Arrow */}
                    {i < funnelSteps.length - 1 && (
                      <svg className="w-6 h-4 text-white/20 mx-1 flex-shrink-0" fill="none" viewBox="0 0 24 16" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 8h16m0 0l-4-4m4 4l-4 4" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4 KPI Circles */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Unanswered Leads", value: 7, ring: "border-red-500", bg: "bg-red-500/10", text: "text-red-400" },
                { label: "Open Negotiations", value: 12, ring: "border-amber", bg: "bg-amber/10", text: "text-amber" },
                { label: "Buying Signals", value: 19, ring: "border-green-400", bg: "bg-green-400/10", text: "text-green-400" },
                { label: "Pending Deals", value: 5, ring: "border-blue-400", bg: "bg-blue-400/10", text: "text-blue-400" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full border-[3px] ${kpi.ring} ${kpi.bg} flex items-center justify-center mb-2`}>
                    <span className={`text-xl font-bold ${kpi.text}`}>{kpi.value}</span>
                  </div>
                  <span className="text-[10px] text-white/40 text-center leading-tight">{kpi.label}</span>
                </div>
              ))}
            </div>

            {/* Response Time Donut */}
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Response Time Distribution</h3>
              <div className="flex items-center gap-8">
                <div className="relative w-44 h-44 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3.5" />
                    {segments.map((seg, i) => {
                      const offset = cumulativeOffset;
                      cumulativeOffset += seg.pct;
                      return (
                        <circle
                          key={i}
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="3.5"
                          strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                          strokeDashoffset={`${-offset}`}
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{total}</p>
                      <p className="text-[10px] text-white/30">Leads</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 text-sm flex-1">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400" /><span className="text-white/50 flex-1">{"\u2264"} 15 min</span><span className="font-bold">{responseData.under15}%</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber" /><span className="text-white/50 flex-1">{"\u2264"} 30 min</span><span className="font-bold">{responseData.under30}%</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500" /><span className="text-white/50 flex-1">&gt; 30 min</span><span className="font-bold">{responseData.over30}%</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-700" /><span className="text-white/50 flex-1">No Contact</span><span className="font-bold">{responseData.noContact}%</span></div>
                </div>
              </div>
            </div>

            {/* AI Activity Card */}
            <div className="bg-gradient-to-r from-amber/10 to-transparent border border-amber/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="text-sm font-bold text-amber">GoFetch AI — Last 24hrs</h3>
                  <p className="text-[11px] text-white/40">Automated actions performed by AI assistant</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Auto-Texts Sent", value: 3, icon: "💬" },
                  { label: "Escalations", value: 2, icon: "⚠️" },
                  { label: "Reassigned", value: 1, icon: "🔄" },
                ].map((ai) => (
                  <div key={ai.label} className="bg-black/20 rounded-lg p-3 text-center">
                    <span className="text-lg">{ai.icon}</span>
                    <p className="text-xl font-bold text-white mt-1">{ai.value}</p>
                    <p className="text-[10px] text-white/40">{ai.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Revenue — Retail vs Fleet</h3>
              <div className="flex items-end gap-3 h-44">
                {revenueByMonth.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-1 items-end" style={{ height: "140px" }}>
                      <div className="flex-1 bg-amber/60 rounded-t transition-all hover:bg-amber/80" style={{ height: `${(m.retail / 5000) * 100}%` }} title={`Retail: $${m.retail}`} />
                      <div className="flex-1 bg-blue-500/60 rounded-t transition-all hover:bg-blue-500/80" style={{ height: `${(m.fleet / 5000) * 100}%` }} title={`Fleet: $${m.fleet}`} />
                    </div>
                    <span className="text-xs text-white/30">{m.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber/60" /><span className="text-white/40">Retail</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500/60" /><span className="text-white/40">Fleet</span></div>
              </div>
            </div>
          </div>

          {/* ───── RIGHT COLUMN (40% = 2/5) ───── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Daily Activity Grid */}
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Daily Activity</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-2 text-left text-[10px] text-white/30 uppercase" />
                    {["Calls", "Emails", "Texts", "Visits", "Deals"].map((h) => (
                      <th key={h} className="p-2 text-center text-[10px] text-white/30 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(["inbound", "outbound"] as const).map((dir) => (
                    <tr key={dir} className="border-b border-white/5">
                      <td className="p-2 text-xs text-white/50 capitalize">{dir}</td>
                      {(["calls", "emails", "texts", "visits", "deals"] as const).map((col) => (
                        <td key={col} className="p-2 text-center font-bold text-amber">{dailyActivity[dir][col]}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-2 text-xs text-white/70 font-semibold">Total</td>
                    {(["calls", "emails", "texts", "visits", "deals"] as const).map((col) => (
                      <td key={col} className="p-2 text-center font-bold text-white">
                        {dailyActivity.inbound[col] + dailyActivity.outbound[col]}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Team Activity Table */}
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Team Activity</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-2 text-left text-[10px] text-white/30 uppercase">Advocate</th>
                    <th className="p-2 text-left text-[10px] text-white/30 uppercase">Leads</th>
                    <th className="p-2 text-left text-[10px] text-white/30 uppercase">Resp.</th>
                    <th className="p-2 text-left text-[10px] text-white/30 uppercase">Score</th>
                    <th className="p-2 text-left text-[10px] text-white/30 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {advocateData.map((a) => (
                    <tr key={a.name} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                      <td className="p-2 font-medium text-sm">{a.name}</td>
                      <td className="p-2 text-amber font-bold">{a.leads}</td>
                      <td className="p-2 text-white/60 text-xs">{a.responseTime}</td>
                      <td className="p-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          a.score >= 80 ? "bg-green-500/20 text-green-400" :
                          a.score >= 60 ? "bg-amber/20 text-amber" :
                          "bg-red-500/20 text-red-400"
                        }`}>{a.score}</span>
                      </td>
                      <td className="p-2">
                        <span className="flex items-center gap-1.5 text-xs">
                          <span className={`w-2 h-2 rounded-full ${a.status === "online" ? "bg-green-400 shadow-sm shadow-green-400/50" : "bg-white/20"}`} />
                          <span className="text-white/50">{a.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Today's Appointments */}
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Today&apos;s Appointments</h3>
              <div className="space-y-3">
                {appointments.map((apt, i) => (
                  <div key={i} className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs font-bold text-amber">{apt.time}</p>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{apt.name}</p>
                      <p className="text-[11px] text-white/40">{apt.type} — {apt.vehicle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-amber flex-shrink-0 mt-0.5">
                      {activityIcon(item.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 leading-snug">{item.text}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Leaderboard — This Month</h3>
              <div className="space-y-3">
                {leaderboard.map((person, i) => (
                  <div key={person.name} className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                      i === 0 ? "bg-yellow-400/20 text-yellow-400 ring-2 ring-yellow-400/40" :
                      i === 1 ? "bg-gray-300/20 text-gray-300 ring-2 ring-gray-300/30" :
                      "bg-amber-700/20 text-amber-700 ring-2 ring-amber-700/30"
                    }`}>
                      {badgeEmoji(person.badge)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${badgeColor(person.badge)}`}>{person.name}</p>
                      <p className="text-[10px] text-white/30">{person.deals} deals closed</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-amber">{person.deals}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
