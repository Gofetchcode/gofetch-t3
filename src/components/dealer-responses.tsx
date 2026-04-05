"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface DealerResponsesProps {
  campaignId?: string;
  vehicle: string;
  dealersSent: number;
}

export function DealerResponses({ campaignId, vehicle, dealersSent }: DealerResponsesProps) {
  const [showCounter, setShowCounter] = useState<string | null>(null);
  const [counterLoading, setCounterLoading] = useState(false);
  const [counterResult, setCounterResult] = useState<any>(null);
  const [sendingCounter, setSendingCounter] = useState(false);

  const scoredQuery = trpc.outreach.getScoredResponses.useQuery(
    { campaignId: campaignId || "" },
    { enabled: !!campaignId, retry: false }
  );

  const benchmarkQuery = trpc.outreach.getVehicleBenchmark.useQuery(
    { vehicle },
    { retry: false }
  );

  const generateCounter = trpc.outreach.generateCounterOffer.useMutation();
  const sendCounter = trpc.outreach.sendCounterOffer.useMutation();
  const triggerFollowUps = trpc.outreach.triggerFollowUps.useMutation();

  const ranked = scoredQuery.data?.ranked || [];
  const discrepancies = scoredQuery.data?.discrepancies || [];
  const benchmark = benchmarkQuery.data?.benchmark;
  const insight = benchmarkQuery.data?.insight;

  const responded = ranked.filter(r => r.otdPrice > 0);
  const bestOffer = responded.length > 0 ? responded[0] : null;

  const handleGenerateCounter = async (responseId: string) => {
    setShowCounter(responseId);
    setCounterLoading(true);
    try {
      const result = await generateCounter.mutateAsync({ responseId, useAI: false });
      setCounterResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setCounterLoading(false);
    }
  };

  const handleSendCounter = async (responseId: string) => {
    if (!counterResult?.counter) return;
    setSendingCounter(true);
    try {
      await sendCounter.mutateAsync({
        responseId,
        emailSubject: counterResult.counter.emailSubject,
        emailBody: counterResult.counter.emailBody,
        counterPrice: counterResult.counter.suggestedPrice,
      });
      setShowCounter(null);
      setCounterResult(null);
      scoredQuery.refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setSendingCounter(false);
    }
  };

  const handleFollowUp = async () => {
    if (!campaignId) return;
    await triggerFollowUps.mutateAsync({ campaignId });
    scoredQuery.refetch();
  };

  // Fallback: if no scored data, show empty state
  if (!campaignId) {
    return (
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 text-center">
        <p className="text-white/30 text-sm">No active campaign. Start an outreach to see responses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Competitive Intel Banner */}
      {benchmark && benchmark.totalDeals >= 3 && (
        <div className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400 text-sm">&#9672;</span>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Competitive Intelligence</p>
          </div>
          <p className="text-sm text-white/70">{insight}</p>
          <div className="flex gap-4 mt-3 text-xs text-white/30">
            <span>Avg: ${benchmark.avgOTD.toLocaleString()}</span>
            <span>25th %ile: ${benchmark.p25OTD.toLocaleString()}</span>
            <span>75th %ile: ${benchmark.p75OTD.toLocaleString()}</span>
            <span>{benchmark.totalDeals} deals tracked</span>
          </div>
        </div>
      )}

      {/* Price Discrepancy Alerts */}
      {discrepancies.length > 0 && (
        <div className="bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-4">
          <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Regional Price Opportunities</p>
          {discrepancies.slice(0, 3).map((d, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
              <span className="text-green-400 text-lg">{d.worthTrip ? "&#9733;" : "&#9734;"}</span>
              <div className="flex-1">
                <p className="text-sm text-white/70">{d.recommendation}</p>
                <p className="text-xs text-white/20">{d.dealerName} | {d.distanceMiles} miles | Save ${d.savings.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response List — Ranked */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Dealer Responses — Ranked</h3>
              <p className="text-xs text-white/30">
                {vehicle} — Sent to {dealersSent} dealers | {responded.length} responded
                {dealersSent > 0 ? ` (${Math.round((responded.length / dealersSent) * 100)}%)` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleFollowUp}
                disabled={triggerFollowUps.isPending}
                className="text-[10px] bg-amber/20 text-amber px-2 py-1 rounded hover:bg-amber/30 transition disabled:opacity-50"
              >
                {triggerFollowUps.isPending ? "Sending..." : "Send Follow-Ups"}
              </button>
            </div>
          </div>
        </div>

        {scoredQuery.isLoading ? (
          <div className="p-6 text-center text-white/20 text-sm">Loading responses...</div>
        ) : ranked.length === 0 ? (
          <div className="p-6 text-center text-white/20 text-sm">No responses yet. Follow-ups will be sent automatically.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {ranked.map((r) => (
              <div key={r.id}>
                <div className={`px-4 py-3 flex items-center gap-3 ${r.otdPrice > 0 ? "hover:bg-white/[0.02]" : "opacity-50"}`}>
                  {/* Rank */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    r.rank === 1 && r.otdPrice > 0 ? "bg-amber/20 text-amber" : "bg-white/5 text-white/30"
                  }`}>
                    {r.otdPrice > 0 ? `#${r.rank}` : "—"}
                  </div>

                  {/* Dealer info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">{r.dealerName}</p>
                      {r.flags.map((f) => (
                        <span key={f} className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                          f === "BEST_PRICE" ? "bg-green-500/20 text-green-400" :
                          f === "FASTEST_RESPONSE" ? "bg-blue-500/20 text-blue-400" :
                          f.includes("PLATINUM") ? "bg-purple-500/20 text-purple-400" :
                          f.includes("GOLD") ? "bg-amber/20 text-amber" :
                          f === "UNDER_BUDGET" ? "bg-green-500/20 text-green-400" :
                          "bg-white/10 text-white/40"
                        }`}>
                          {f.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-white/30">
                      {r.responseTimeMin < 60 ? `${r.responseTimeMin}min` : `${Math.round(r.responseTimeMin / 60)}hr`}
                      {r.vin ? ` | VIN: ...${r.vin.slice(-4)}` : ""}
                      {r.stockNumber ? ` | #${r.stockNumber}` : ""}
                    </p>
                  </div>

                  {/* Score */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                    r.score >= 70 ? "bg-green-500/20 text-green-400" :
                    r.score >= 40 ? "bg-amber/20 text-amber" :
                    "bg-white/10 text-white/40"
                  }`}>
                    {r.score}
                  </div>

                  {/* Price */}
                  {r.otdPrice > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber">${r.otdPrice.toLocaleString()}</p>
                      {r.priceVsAvg !== 0 && (
                        <p className={`text-[10px] ${r.priceVsAvg < 0 ? "text-green-400" : "text-red-400"}`}>
                          {r.priceVsAvg < 0 ? "" : "+"}${Math.round(r.priceVsAvg).toLocaleString()} vs avg
                        </p>
                      )}
                    </div>
                  )}

                  {/* Counter-offer button */}
                  {r.otdPrice > 0 && (
                    <button
                      onClick={() => handleGenerateCounter(r.id)}
                      className="text-[10px] bg-white/5 text-white/40 px-2 py-1 rounded hover:bg-white/10 hover:text-white transition"
                    >
                      Counter
                    </button>
                  )}
                </div>

                {/* Counter-Offer Panel */}
                {showCounter === r.id && (
                  <div className="px-4 py-4 bg-white/[0.02] border-t border-white/5">
                    {counterLoading ? (
                      <p className="text-sm text-white/30 text-center py-4">Analyzing deal and generating counter-offer...</p>
                    ) : counterResult?.counter ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-white">
                              Counter: ${counterResult.counter.suggestedPrice.toLocaleString()}
                              <span className={`ml-2 text-xs font-normal ${
                                counterResult.counter.strategy === "aggressive" ? "text-red-400" :
                                counterResult.counter.strategy === "moderate" ? "text-amber" :
                                "text-green-400"
                              }`}>
                                ({counterResult.counter.strategy})
                              </span>
                            </p>
                            <p className="text-xs text-white/30">{counterResult.counter.reasoning}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-xs font-bold ${
                              counterResult.counter.confidence >= 60 ? "text-green-400" :
                              counterResult.counter.confidence >= 40 ? "text-amber" :
                              "text-red-400"
                            }`}>
                              {counterResult.counter.confidence}% confidence
                            </p>
                          </div>
                        </div>

                        {/* Talking points */}
                        <div className="bg-white/[0.02] rounded-lg p-3 border border-white/5">
                          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Talking Points</p>
                          <ul className="space-y-1">
                            {counterResult.counter.talkingPoints.map((tp: string, i: number) => (
                              <li key={i} className="text-xs text-white/50 flex items-start gap-2">
                                <span className="text-amber mt-0.5">&#8226;</span>
                                {tp}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Email preview */}
                        <details className="bg-white/[0.02] rounded-lg border border-white/5">
                          <summary className="px-3 py-2 text-xs text-white/40 cursor-pointer hover:text-white/60">
                            Preview email
                          </summary>
                          <pre className="px-3 py-2 text-xs text-white/30 whitespace-pre-wrap border-t border-white/5 max-h-48 overflow-y-auto">
                            {counterResult.counter.emailBody}
                          </pre>
                        </details>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSendCounter(r.id)}
                            disabled={sendingCounter}
                            className="flex-1 bg-amber text-navy font-semibold py-2 rounded-lg text-xs hover:bg-amber-light transition disabled:opacity-50"
                          >
                            {sendingCounter ? "Sending..." : "Send Counter-Offer"}
                          </button>
                          <button
                            onClick={() => { setShowCounter(null); setCounterResult(null); }}
                            className="px-4 py-2 border border-white/10 rounded-lg text-xs text-white/40 hover:text-white transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-red-400/60 text-center py-4">Could not generate counter-offer.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Best Offer Banner */}
        {bestOffer && (
          <div className="p-4 border-t border-white/5 bg-green-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-400 font-bold">
                  TOP RANKED: {bestOffer.dealerName} — ${bestOffer.otdPrice.toLocaleString()} (Score: {bestOffer.score})
                </p>
              </div>
              <button className="bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-xs hover:bg-amber-light transition">
                Create Offer from Best Response
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
