"use client";

const touchpoints = [
  { date: "Mar 1", channel: "🎯 Facebook Ad", action: "Ad click", campaign: "fb_spring_campaign" },
  { date: "Mar 3", channel: "🌐 Website", action: "Homepage → How It Works → Pricing", campaign: "" },
  { date: "Mar 5", channel: "🌐 Website", action: "New Cars page (viewed RAV4)", campaign: "" },
  { date: "Mar 8", channel: "📧 Email", action: "Opened: Spring Savings Newsletter", campaign: "" },
  { date: "Mar 8", channel: "🌐 Website", action: "Car Finder (started but didn't submit)", campaign: "" },
  { date: "Mar 10", channel: "🎯 Google Ad", action: "Ad click", campaign: "google_rav4_tampa" },
  { date: "Mar 10", channel: "📋 Form", action: "Submitted Car Finder → LEAD CREATED", campaign: "" },
];

const channelPerformance = [
  { source: "Facebook Ads", leads: 45, closed: 12, revenue: "$12,400", cost: "$500", roi: "24.8x" },
  { source: "Google Ads", leads: 28, closed: 8, revenue: "$8,200", cost: "$620", roi: "13.2x" },
  { source: "Referrals", leads: 22, closed: 11, revenue: "$5,800", cost: "$0", roi: "∞" },
  { source: "Organic", leads: 18, closed: 5, revenue: "$2,400", cost: "$0", roi: "∞" },
  { source: "Cars.com", leads: 8, closed: 2, revenue: "$1,200", cost: "$200", roi: "6x" },
  { source: "Direct", leads: 12, closed: 3, revenue: "$1,800", cost: "$0", roi: "∞" },
];

export function AttributionDashboard() {
  return (
    <div className="space-y-6">
      {/* Channel Performance Table */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-bold text-white text-sm">Channel Performance — Revenue Attribution</h3>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/5">
            <th className="p-3 text-left text-xs text-white/30 font-semibold">Source</th>
            <th className="p-3 text-left text-xs text-white/30 font-semibold">Leads</th>
            <th className="p-3 text-left text-xs text-white/30 font-semibold">Closed</th>
            <th className="p-3 text-left text-xs text-white/30 font-semibold">Revenue</th>
            <th className="p-3 text-left text-xs text-white/30 font-semibold">Cost</th>
            <th className="p-3 text-left text-xs text-white/30 font-semibold">ROI</th>
          </tr></thead>
          <tbody>
            {channelPerformance.map(c => (
              <tr key={c.source} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="p-3 font-medium text-white">{c.source}</td>
                <td className="p-3 text-white/60">{c.leads}</td>
                <td className="p-3 text-white/60">{c.closed}</td>
                <td className="p-3 text-amber font-bold">{c.revenue}</td>
                <td className="p-3 text-white/40">{c.cost}</td>
                <td className="p-3 text-green-400 font-bold">{c.roi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sample Customer Journey */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
        <h3 className="font-bold text-white text-sm mb-4">Sample Customer Journey — John Smith</h3>
        <div className="space-y-2">
          {touchpoints.map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-white/20 w-14">{t.date}</span>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i === touchpoints.length - 1 ? "bg-green-400" : "bg-amber/60"}`} />
              <span className="text-xs">{t.channel}</span>
              <span className="text-xs text-white/40">{t.action}</span>
              {t.campaign && <span className="text-[10px] bg-white/5 text-white/20 px-1.5 py-0.5 rounded">{t.campaign}</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-white/20 mt-3">Average: 3.2 visits before submitting form</p>
      </div>

      {/* Marketing ROI Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber">$31,800</p>
          <p className="text-xs text-white/30">Total Revenue Attributed</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">$1,320</p>
          <p className="text-xs text-white/30">Total Ad Spend</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">24.1x</p>
          <p className="text-xs text-white/30">Overall ROI</p>
        </div>
      </div>
    </div>
  );
}
