"use client";

import { useState } from "react";

const REPORT_TYPES = [
  { id: "sales", label: "Sales Summary", icon: "📊", desc: "Revenue, deals closed, and pipeline metrics for any date range." },
  { id: "leads", label: "Lead Source", icon: "🔗", desc: "Breakdown of leads by source, conversion rates, and ROI." },
  { id: "response", label: "Response Times", icon: "⏱", desc: "Average response times by advocate and channel." },
  { id: "pipeline", label: "Pipeline Health", icon: "🏗", desc: "Stage duration, bottlenecks, and stale lead analysis." },
  { id: "advocate", label: "Advocate Performance", icon: "👤", desc: "Individual advocate metrics, scores, and activity." },
  { id: "fleet", label: "Fleet vs Retail", icon: "🚛", desc: "Compare fleet and retail segments across all metrics." },
];

const PERIOD_OPTIONS = ["This Week", "This Month", "Last 30 Days", "Last Quarter", "Year to Date", "Custom"];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [period, setPeriod] = useState("This Month");

  return (
    <div className="text-white p-6">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Reports</h2>
            <p className="text-sm text-white/30">Generate and export detailed reports</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-amber outline-none"
            >
              {PERIOD_OPTIONS.map((p) => (
                <option key={p} value={p} className="bg-navy text-white">{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {REPORT_TYPES.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedReport(selectedReport === r.id ? null : r.id)}
              className={`text-left bg-white/[0.03] border rounded-xl p-5 transition hover:bg-white/[0.06] ${
                selectedReport === r.id ? "border-amber/40 bg-amber/5" : "border-white/5"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{r.icon}</span>
                <h3 className="text-sm font-semibold text-white">{r.label}</h3>
              </div>
              <p className="text-xs text-white/30 leading-relaxed">{r.desc}</p>
            </button>
          ))}
        </div>

        {/* Selected Report Preview */}
        {selectedReport && (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">
                {REPORT_TYPES.find((r) => r.id === selectedReport)?.label} — {period}
              </h3>
              <div className="flex gap-2">
                <button className="bg-white/10 text-white/60 px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition">
                  Print
                </button>
                <button className="bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber-light transition">
                  Export PDF
                </button>
              </div>
            </div>

            {/* Sales Summary */}
            {selectedReport === "sales" && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Total Revenue", value: "$0", sub: "from 0 deals" },
                    { label: "Avg Deal Size", value: "$0", sub: "per closed deal" },
                    { label: "Deals Closed", value: "0", sub: "this period" },
                    { label: "Close Rate", value: "0%", sub: "of total leads" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                      <p className="text-2xl font-bold text-white">{s.value}</p>
                      <p className="text-xs text-white/30 mt-1">{s.label}</p>
                      <p className="text-[10px] text-white/15 mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-white/20 text-center py-8">
                  Connect real data to populate this report. Revenue will flow from paid deals in the pipeline.
                </p>
              </div>
            )}

            {/* Lead Source */}
            {selectedReport === "leads" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {["Website", "Referral", "Cars.com", "AutoTrader", "Facebook", "Google Ads", "Manual"].map((src, i) => (
                    <div key={src} className="flex items-center gap-4 bg-white/[0.02] rounded-lg p-3 border border-white/5">
                      <span className="text-sm text-white w-28">{src}</span>
                      <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden">
                        <div className="h-full bg-amber/40 rounded" style={{ width: `${Math.max(5, 60 - i * 8)}%` }} />
                      </div>
                      <span className="text-xs text-white/30 w-16 text-right">0 leads</span>
                      <span className="text-xs text-white/20 w-12 text-right">0%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Response Times */}
            {selectedReport === "response" && (
              <div className="text-sm text-white/20 text-center py-12">
                Response time tracking will populate once communication data flows through the system.
              </div>
            )}

            {/* Pipeline Health */}
            {selectedReport === "pipeline" && (
              <div className="text-sm text-white/20 text-center py-12">
                Pipeline health metrics will populate from active deals and stage transitions.
              </div>
            )}

            {/* Advocate Performance */}
            {selectedReport === "advocate" && (
              <div className="text-sm text-white/20 text-center py-12">
                Advocate performance data will populate from user activity and deal assignments.
              </div>
            )}

            {/* Fleet vs Retail */}
            {selectedReport === "fleet" && (
              <div className="text-sm text-white/20 text-center py-12">
                Fleet vs retail comparison will populate from pipeline and revenue data.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
