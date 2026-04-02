"use client";

import { useState } from "react";

const STEPS = ["Consultation", "Lead Received", "Researching", "Negotiating", "Client Approval", "Deal Agreed", "Paperwork", "Delivery", "Delivered"];

// Mock data for analytics
const funnelData = [100, 82, 68, 52, 41, 35, 30, 27, 24];
const revenueByMonth = [
  { month: "Jan", retail: 1200, fleet: 2400 },
  { month: "Feb", retail: 1800, fleet: 3200 },
  { month: "Mar", retail: 2400, fleet: 4100 },
];
const sourceData = [
  { name: "Website", count: 45, pct: 38 },
  { name: "Referral", count: 28, pct: 23 },
  { name: "Google Ads", count: 18, pct: 15 },
  { name: "Facebook", count: 15, pct: 13 },
  { name: "Cars.com", count: 8, pct: 7 },
  { name: "Other", count: 5, pct: 4 },
];
const responseData = { under15: 42, under30: 28, over30: 18, noContact: 12 };
const advocateData = [
  { name: "Marcus J.", deals: 12, responseTime: "8min", score: 94, status: "online" },
  { name: "Sarah K.", deals: 9, responseTime: "12min", score: 87, status: "online" },
  { name: "David L.", deals: 7, responseTime: "22min", score: 72, status: "offline" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30d");

  return (
    <div className="min-h-screen bg-navy text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Analytics</h2>
          <div className="flex bg-black/30 rounded-lg p-0.5 border border-white/5">
            {["today", "7d", "30d", "90d", "all"].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${period === p ? "bg-amber text-navy" : "text-white/40 hover:text-white"}`}>
                {p === "today" ? "Today" : p === "all" ? "All Time" : p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total Leads", value: "119", change: "+12%", up: true },
            { label: "Conversion Rate", value: "24%", change: "+3%", up: true },
            { label: "Avg Response Time", value: "14min", change: "-22%", up: true },
            { label: "Revenue (MTD)", value: "$7,600", change: "+18%", up: true },
            { label: "Avg Deal Time", value: "11 days", change: "-2 days", up: true },
          ].map(k => (
            <div key={k.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-white/30 uppercase">{k.label}</span>
                <span className={`text-xs font-medium ${k.up ? "text-green-400" : "text-red-400"}`}>{k.change}</span>
              </div>
              <div className="text-2xl font-bold">{k.value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Conversion Funnel */}
          <div className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Sales Funnel</h3>
            <div className="space-y-2">
              {STEPS.map((s, i) => {
                const pct = funnelData[0] > 0 ? (funnelData[i] / funnelData[0]) * 100 : 0;
                const dropoff = i > 0 ? Math.round(((funnelData[i-1] - funnelData[i]) / funnelData[i-1]) * 100) : 0;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <span className="w-28 text-xs text-white/40 truncate">{s}</span>
                    <div className="flex-1 h-7 bg-white/5 rounded relative">
                      <div className="h-full bg-gradient-to-r from-amber to-amber-light/40 rounded flex items-center px-3 transition-all" style={{ width: `${pct}%` }}>
                        <span className="text-xs font-bold text-navy">{funnelData[i]}</span>
                      </div>
                    </div>
                    <span className="w-12 text-xs text-right text-white/30">{Math.round(pct)}%</span>
                    {dropoff > 0 && <span className="w-14 text-xs text-right text-red-400/60">-{dropoff}%</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Response Time Donut */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Response Time</h3>
            <div className="relative w-40 h-40 mx-auto mb-4">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray={`${responseData.under15} ${100 - responseData.under15}`} strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D4A23A" strokeWidth="3" strokeDasharray={`${responseData.under30} ${100 - responseData.under30}`} strokeDashoffset={`${-responseData.under15}`} />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray={`${responseData.over30} ${100 - responseData.over30}`} strokeDashoffset={`${-(responseData.under15 + responseData.under30)}`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center"><p className="text-2xl font-bold">100</p><p className="text-[10px] text-white/30">Total</p></div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400" /><span className="text-white/50">≤ 15min</span><span className="ml-auto font-bold">{responseData.under15}%</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber" /><span className="text-white/50">≤ 30min</span><span className="ml-auto font-bold">{responseData.under30}%</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500" /><span className="text-white/50">&gt; 30min</span><span className="ml-auto font-bold">{responseData.over30}%</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white/10" /><span className="text-white/50">No contact</span><span className="ml-auto font-bold">{responseData.noContact}%</span></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Revenue (Retail vs Fleet)</h3>
            <div className="flex items-end gap-4 h-40">
              {revenueByMonth.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 items-end" style={{ height: "120px" }}>
                    <div className="flex-1 bg-amber/60 rounded-t" style={{ height: `${(m.retail / 5000) * 100}%` }} />
                    <div className="flex-1 bg-blue-500/60 rounded-t" style={{ height: `${(m.fleet / 5000) * 100}%` }} />
                  </div>
                  <span className="text-xs text-white/30">{m.month}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber/60" /><span className="text-white/40">Retail</span></div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500/60" /><span className="text-white/40">Fleet</span></div>
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Lead Sources</h3>
            <div className="space-y-3">
              {sourceData.map(s => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-white/50">{s.name}</span>
                  <div className="flex-1 h-5 bg-white/5 rounded">
                    <div className="h-full bg-amber/40 rounded" style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="w-8 text-xs text-white/30 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Activity */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Team Performance</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/5">
              <th className="p-3 text-left text-xs text-white/30">Advocate</th>
              <th className="p-3 text-left text-xs text-white/30">Deals</th>
              <th className="p-3 text-left text-xs text-white/30">Avg Response</th>
              <th className="p-3 text-left text-xs text-white/30">AI Score</th>
              <th className="p-3 text-left text-xs text-white/30">Status</th>
            </tr></thead>
            <tbody>
              {advocateData.map(a => (
                <tr key={a.name} className="border-b border-white/5">
                  <td className="p-3 font-medium">{a.name}</td>
                  <td className="p-3 text-amber font-bold">{a.deals}</td>
                  <td className="p-3 text-white/60">{a.responseTime}</td>
                  <td className="p-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.score >= 80 ? "bg-green-500/20 text-green-400" : a.score >= 50 ? "bg-amber/20 text-amber" : "bg-white/10 text-white/40"}`}>{a.score}</span></td>
                  <td className="p-3"><span className={`w-2 h-2 rounded-full inline-block mr-1 ${a.status === "online" ? "bg-green-400" : "bg-white/20"}`} />{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
