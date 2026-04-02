"use client";

import { useState } from "react";

interface Referral {
  name: string; date: string; status: "lead" | "active" | "closed"; value: string;
}

export function ReferralTracker({ customerName, referralCode, referrals, ltv }: {
  customerName: string; referralCode: string; referrals: Referral[]; ltv: string;
}) {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://gofetchauto.com/car-finder?ref=${referralCode}`;

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
      <h4 className="text-sm font-bold text-white mb-3">🔗 Referral Tracking</h4>

      {/* LTV */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/[0.02] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-amber">{ltv}</p>
          <p className="text-[10px] text-white/30">Lifetime Value</p>
        </div>
        <div className="bg-white/[0.02] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-white">{referrals.length}</p>
          <p className="text-[10px] text-white/30">Referrals</p>
        </div>
        <div className="bg-white/[0.02] rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-green-400">{referrals.filter(r => r.status === "closed").length}</p>
          <p className="text-[10px] text-white/30">Converted</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white/[0.02] rounded-lg p-3 mb-4">
        <p className="text-[10px] text-white/30 mb-1">Referral Link</p>
        <div className="flex gap-2">
          <input value={referralLink} readOnly className="flex-1 bg-transparent text-xs text-white/50 font-mono truncate" />
          <button onClick={() => { navigator.clipboard.writeText(referralLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs bg-amber/20 text-amber px-2 py-1 rounded hover:bg-amber/30 transition">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Referral Tree */}
      {referrals.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Referral Tree</p>
          {referrals.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="text-white/20">└─</span>
              <span className="text-white/60">{r.name}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
                r.status === "closed" ? "bg-green-500/20 text-green-400" :
                r.status === "active" ? "bg-amber/20 text-amber" :
                "bg-white/10 text-white/30"
              }`}>{r.status}</span>
              {r.value && <span className="text-green-400 ml-auto">{r.value}</span>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-white/20 text-center py-2">No referrals yet</p>
      )}
    </div>
  );
}
