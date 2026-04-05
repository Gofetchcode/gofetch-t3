"use client";

import { useState, useEffect } from "react";

interface Inquiry {
  id: string;
  vehicle: string;
  color: string | null;
  budget: string | null;
  radius: number | null;
  postedAt: string;
  responsesReceived: number;
}

export default function DealerPortalPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    dealerName: "",
    dealerEmail: "",
    dealerPhone: "",
    contactName: "",
    otdPrice: "",
    msrp: "",
    vin: "",
    stockNumber: "",
    color: "",
    trim: "",
    inStock: true,
    availabilityDate: "",
    dealerFees: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/dealer-portal")
      .then((r) => r.json())
      .then((d) => {
        setInquiries(d.inquiries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const set = (key: string, val: string | boolean) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async () => {
    if (!form.dealerName || !form.dealerEmail || !form.otdPrice) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/dealer-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          campaignId: selectedInquiry?.id,
          vehicleDesc: selectedInquiry?.vehicle,
        }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-green-400">&#10003;</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Offer Submitted</h1>
          <p className="text-white/40 mb-6">
            Thank you for your competitive offer. Our team will review it and respond within 24 hours.
            Responsive dealers receive priority lead flow from GoFetch Auto.
          </p>
          <button
            onClick={() => { setSubmitted(false); setSelectedInquiry(null); setForm({ dealerName: "", dealerEmail: "", dealerPhone: "", contactName: "", otdPrice: "", msrp: "", vin: "", stockNumber: "", color: "", trim: "", inStock: true, availabilityDate: "", dealerFees: "", notes: "" }); }}
            className="bg-amber text-navy font-semibold px-6 py-3 rounded-lg hover:bg-amber-light transition"
          >
            Submit Another Offer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0f1d32]">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <img src="/logo-icon.jpeg" alt="GoFetch" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <h1 className="text-xl font-bold">
                GoFetch <span className="text-amber">Dealer Portal</span>
              </h1>
              <p className="text-xs text-white/30">Submit competitive offers to qualified, ready-to-buy clients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-amber/10 to-transparent border border-amber/20 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-amber mb-2">Why Submit Offers Through GoFetch?</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-white">Qualified Buyers</p>
              <p className="text-white/40 text-xs mt-1">Every client is pre-qualified, funded, and ready to purchase. No tire-kickers.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Fast Transactions</p>
              <p className="text-white/40 text-xs mt-1">Average deal closes in 48 hours. Minimal floor time, maximum efficiency.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Priority Lead Flow</p>
              <p className="text-white/40 text-xs mt-1">Responsive dealers with competitive pricing get first access to new inquiries.</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Active Inquiries */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Active Vehicle Inquiries</h3>
            {loading ? (
              <p className="text-sm text-white/20">Loading inquiries...</p>
            ) : inquiries.length === 0 ? (
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 text-center">
                <p className="text-white/30 text-sm">No active inquiries right now.</p>
                <p className="text-white/15 text-xs mt-2">You can still submit a general offer below.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {inquiries.map((inq) => (
                  <button
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className={`w-full text-left bg-white/[0.03] border rounded-xl p-4 transition hover:bg-white/[0.06] ${
                      selectedInquiry?.id === inq.id ? "border-amber/40 bg-amber/5" : "border-white/5"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{inq.vehicle || "Vehicle Inquiry"}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
                      {inq.color && <span>{inq.color}</span>}
                      {inq.budget && <span>Budget: {inq.budget}</span>}
                      <span>{inq.responsesReceived} offers received</span>
                    </div>
                    <p className="text-[10px] text-white/15 mt-1">
                      Posted {new Date(inq.postedAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Offer Submission Form */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
              {selectedInquiry ? `Submit Offer — ${selectedInquiry.vehicle}` : "Submit an Offer"}
            </h3>

            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <div className="space-y-4">
                {/* Dealer Info */}
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Your Dealership</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={form.dealerName} onChange={(e) => set("dealerName", e.target.value)} placeholder="Dealership Name *" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-amber outline-none" />
                    <input value={form.dealerEmail} onChange={(e) => set("dealerEmail", e.target.value)} placeholder="Email *" type="email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-amber outline-none" />
                    <input value={form.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="Contact Name" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-amber outline-none" />
                    <input value={form.dealerPhone} onChange={(e) => set("dealerPhone", e.target.value)} placeholder="Phone" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-amber outline-none" />
                  </div>
                </div>

                {/* Vehicle & Pricing */}
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Vehicle & Pricing</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={form.otdPrice} onChange={(e) => set("otdPrice", e.target.value)} placeholder="OTD Price * (e.g. 33500)" type="number" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-amber outline-none" />
                    <input value={form.msrp} onChange={(e) => set("msrp", e.target.value)} placeholder="MSRP" type="number" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-amber outline-none" />
                    <input value={form.vin} onChange={(e) => set("vin", e.target.value)} placeholder="VIN" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-amber outline-none" />
                    <input value={form.stockNumber} onChange={(e) => set("stockNumber", e.target.value)} placeholder="Stock #" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-amber outline-none" />
                    <input value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="Color" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-amber outline-none" />
                    <input value={form.trim} onChange={(e) => set("trim", e.target.value)} placeholder="Trim" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-amber outline-none" />
                    <input value={form.dealerFees} onChange={(e) => set("dealerFees", e.target.value)} placeholder="Dealer Fees ($)" type="number" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-amber outline-none" />
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
                        <input type="checkbox" checked={form.inStock} onChange={(e) => set("inStock", e.target.checked)} className="accent-amber" />
                        In Stock
                      </label>
                      {!form.inStock && (
                        <input value={form.availabilityDate} onChange={(e) => set("availabilityDate", e.target.value)} placeholder="ETA" type="date" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber outline-none flex-1" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Additional notes (optional)" rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-amber outline-none resize-none" />

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !form.dealerName || !form.dealerEmail || !form.otdPrice}
                  className="w-full bg-amber text-navy font-bold py-3 rounded-lg hover:bg-amber-light transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Offer"}
                </button>

                <p className="text-[10px] text-white/15 text-center">
                  By submitting, you agree to respond to GoFetch Auto inquiries within 24 hours. Priority partners receive exclusive lead access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
