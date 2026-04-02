"use client";

export function CompetitiveIntel({ vehicle, ourPrice, marketAvg, msrp }: {
  vehicle: string; ourPrice: number; marketAvg: number; msrp: number;
}) {
  const savingsVsMarket = marketAvg - ourPrice;
  const savingsVsMsrp = msrp - ourPrice;
  const percentile = Math.min(99, Math.round((1 - ourPrice / msrp) * 200));

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
      <h4 className="text-sm font-bold text-white mb-3">⚡ Market Position — {vehicle}</h4>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="w-20 text-xs text-white/30">Your Offer</span>
          <div className="flex-1 h-5 bg-white/5 rounded-full relative">
            <div className="h-full bg-green-500/40 rounded-full" style={{ width: `${(ourPrice / msrp) * 100}%` }} />
            <span className="absolute right-2 top-0.5 text-[10px] font-bold text-green-400">${ourPrice.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-20 text-xs text-white/30">Market Avg</span>
          <div className="flex-1 h-5 bg-white/5 rounded-full relative">
            <div className="h-full bg-amber/30 rounded-full" style={{ width: `${(marketAvg / msrp) * 100}%` }} />
            <span className="absolute right-2 top-0.5 text-[10px] font-bold text-amber">${marketAvg.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-20 text-xs text-white/30">MSRP</span>
          <div className="flex-1 h-5 bg-white/5 rounded-full relative">
            <div className="h-full bg-white/10 rounded-full" style={{ width: "100%" }} />
            <span className="absolute right-2 top-0.5 text-[10px] font-bold text-white/40">${msrp.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-green-500/10 rounded-lg p-2">
          <p className="text-sm font-bold text-green-400">${savingsVsMsrp.toLocaleString()}</p>
          <p className="text-[9px] text-white/30">Below MSRP</p>
        </div>
        <div className="bg-amber/10 rounded-lg p-2">
          <p className="text-sm font-bold text-amber">${savingsVsMarket.toLocaleString()}</p>
          <p className="text-[9px] text-white/30">Below Market</p>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-2">
          <p className="text-sm font-bold text-blue-400">Top {100 - percentile}%</p>
          <p className="text-[9px] text-white/30">Best Price</p>
        </div>
      </div>

      <p className="text-[10px] text-green-400 text-center mt-3">Your client is getting a better deal than {percentile}% of buyers</p>
    </div>
  );
}
