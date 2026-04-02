"use client";

import { useState } from "react";

interface DealerResponse {
  id: string;
  dealerName: string;
  otdPrice: string;
  vin: string;
  stockNumber: string;
  status: "responded" | "declined" | "no_response";
  responseTime: string;
  color?: string;
  inStock: boolean;
}

const mockResponses: DealerResponse[] = [
  { id: "1", dealerName: "Wesley Chapel Toyota", otdPrice: "$33,800", vin: "...4829", stockNumber: "T24829", status: "responded", responseTime: "22 min", color: "White", inStock: true },
  { id: "2", dealerName: "Courtesy Toyota Tampa", otdPrice: "$34,200", vin: "...7731", stockNumber: "T27731", status: "responded", responseTime: "45 min", color: "Silver", inStock: true },
  { id: "3", dealerName: "Gettel Toyota Bradenton", otdPrice: "$33,500", vin: "...9912", stockNumber: "T29912", status: "responded", responseTime: "2 hrs", color: "White", inStock: false },
  { id: "4", dealerName: "Stadium Toyota", otdPrice: "", vin: "", stockNumber: "", status: "no_response", responseTime: "3 days", inStock: false },
  { id: "5", dealerName: "AutoNation Toyota", otdPrice: "", vin: "", stockNumber: "", status: "no_response", responseTime: "3 days", inStock: false },
  { id: "6", dealerName: "Ferman Toyota", otdPrice: "", vin: "", stockNumber: "", status: "declined", responseTime: "1 hr", inStock: false },
];

export function DealerResponses({ campaignId, vehicle, dealersSent }: { campaignId?: string; vehicle: string; dealersSent: number }) {
  const responses = mockResponses;
  const responded = responses.filter(r => r.status === "responded");
  const best = responded.sort((a, b) => parseFloat(a.otdPrice.replace(/\D/g, "")) - parseFloat(b.otdPrice.replace(/\D/g, "")))[0];

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">📬 Dealer Responses</h3>
            <p className="text-xs text-white/30">{vehicle} — Sent to {dealersSent} dealers | {responded.length} responded ({Math.round((responded.length / dealersSent) * 100)}%)</p>
          </div>
          <div className="flex gap-2">
            <button className="text-[10px] bg-amber/20 text-amber px-2 py-1 rounded hover:bg-amber/30 transition">Send Follow-Up</button>
            <button className="text-[10px] bg-white/5 text-white/40 px-2 py-1 rounded hover:bg-white/10 transition">Export PDF</button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {responses.map(r => (
          <div key={r.id} className={`px-4 py-3 flex items-center gap-3 ${r.status === "responded" ? "hover:bg-white/[0.02]" : "opacity-50"}`}>
            <span className="text-lg">{r.status === "responded" ? "✅" : r.status === "declined" ? "❌" : "⏳"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{r.dealerName}</p>
              <p className="text-xs text-white/30">Responded in {r.responseTime}{r.color ? ` | ${r.color}` : ""}{r.inStock ? " | In stock" : ""}</p>
            </div>
            {r.status === "responded" && (
              <>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber">{r.otdPrice}</p>
                  <p className="text-[10px] text-white/20">VIN: {r.vin} | #{r.stockNumber}</p>
                </div>
                {best?.id === r.id && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">BEST</span>}
              </>
            )}
          </div>
        ))}
      </div>

      {best && (
        <div className="p-4 border-t border-white/5 bg-green-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-400 font-bold">BEST OFFER: {best.dealerName} — {best.otdPrice}</p>
            </div>
            <button className="bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-xs hover:bg-amber-light transition">Create Offer from Best Response</button>
          </div>
        </div>
      )}
    </div>
  );
}
