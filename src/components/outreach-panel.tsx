"use client";

import { useState } from "react";

interface OutreachPanelProps {
  customerId: string;
  customerName: string;
  vehicleDesc?: string;
  onClose: () => void;
}

export function OutreachPanel({ customerId, customerName, vehicleDesc, onClose }: OutreachPanelProps) {
  const [campaign, setCampaign] = useState({
    vehicleDesc: vehicleDesc || "",
    colorPref: "",
    features: "",
    maxPrice: "",
    radiusMiles: "50",
    brandFilter: "",
  });
  const [sent, setSent] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setCampaign((c) => ({ ...c, [field]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-navy">Dealer Outreach</h2>
            <p className="text-sm text-muted">Send to dealers for {customerName}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy text-2xl">&times;</button>
        </div>

        {sent ? (
          <div className="p-10 text-center">
            <p className="text-5xl mb-4">📨</p>
            <h3 className="text-xl font-bold text-navy mb-2">Outreach Sent!</h3>
            <p className="text-muted mb-6">Campaign sent to dealers within {campaign.radiusMiles} miles. We&rsquo;ll track responses here.</p>
            <button onClick={onClose} className="bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:bg-amber-light transition">Done</button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-bold text-navy block mb-1">Vehicle Description *</label>
              <input value={campaign.vehicleDesc} onChange={set("vehicleDesc")} placeholder="2026 Honda Accord Sport Hybrid" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-navy block mb-1">Color Preference</label>
                <input value={campaign.colorPref} onChange={set("colorPref")} placeholder="Any / Platinum White" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none" />
              </div>
              <div>
                <label className="text-sm font-bold text-navy block mb-1">Max OTD Price</label>
                <input value={campaign.maxPrice} onChange={set("maxPrice")} placeholder="$35,000" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-navy block mb-1">Required Features</label>
              <textarea value={campaign.features} onChange={set("features")} placeholder="Sunroof, heated seats, AWD..." rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-navy block mb-1">Search Radius (miles)</label>
                <select value={campaign.radiusMiles} onChange={set("radiusMiles")} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none">
                  <option value="25">25 miles</option>
                  <option value="50">50 miles</option>
                  <option value="100">100 miles</option>
                  <option value="200">200 miles</option>
                  <option value="500">500+ miles (nationwide)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-navy block mb-1">Brand Filter</label>
                <input value={campaign.brandFilter} onChange={set("brandFilter")} placeholder="Honda, Toyota..." className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none" />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button onClick={() => setSent(true)} className="flex-1 bg-amber text-navy font-bold py-4 rounded-lg hover:bg-amber-light transition text-lg">
                Send to Dealers
              </button>
              <button onClick={onClose} className="px-6 py-4 border border-gray-200 rounded-lg text-muted hover:text-navy transition">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
