"use client";

import { useRef, useState } from "react";

export function ShareableCard({ vehicle, savings, customerName }: { vehicle: string; savings: string; customerName: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const shareText = `I just saved ${savings} on my ${vehicle} with GoFetch Auto! Zero hours at the dealership. gofetchauto.com`;

  const copyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n\nhttps://gofetchauto.com/?ref=${encodeURIComponent(customerName)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-navy mb-4">Share Your Win!</h3>
      <div ref={cardRef} className="bg-gradient-to-br from-navy to-navy-light rounded-xl p-6 text-white mb-4">
        <p className="text-amber text-xs font-semibold uppercase tracking-wider mb-2">🏆 Deal Complete</p>
        <p className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>I just saved {savings}</p>
        <p className="text-white/60 text-sm mb-4">on my {vehicle} with GoFetch Auto!</p>
        <div className="flex gap-4 text-xs text-white/40">
          <span>✓ Zero dealership hours</span>
          <span>✓ No hidden fees</span>
        </div>
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-amber text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>GoFetch Auto</span>
          <span className="text-white/30 text-xs">gofetchauto.com</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={copyLink} className="flex-1 bg-amber text-navy font-semibold py-2.5 rounded-lg text-sm hover:bg-amber-light transition">
          {copied ? "Copied!" : "Copy Referral Link"}
        </button>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener" className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">𝕏</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener" className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">FB</a>
      </div>
    </div>
  );
}
