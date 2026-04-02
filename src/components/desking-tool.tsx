"use client";

import { useState } from "react";

interface DeskingToolProps {
  customerId: string;
  customerName: string;
  onClose: () => void;
}

export function DeskingTool({ customerId, customerName, onClose }: DeskingToolProps) {
  const [offer, setOffer] = useState({
    dealerName: "",
    dealerAddress: "",
    dealerContact: "",
    dealerPhone: "",
    vehicleDesc: "",
    stockNumber: "",
    vin: "",
    msrp: "",
    invoice: "",
    negotiatedPrice: "",
    dealerFees: "",
    taxRate: "7",
    titleReg: "499",
    addOnsRemoved: "",
    notes: "",
  });

  const msrp = parseFloat(offer.msrp.replace(/[^0-9.]/g, "")) || 0;
  const invoice = parseFloat(offer.invoice.replace(/[^0-9.]/g, "")) || 0;
  const negotiated = parseFloat(offer.negotiatedPrice.replace(/[^0-9.]/g, "")) || 0;
  const dealerFees = parseFloat(offer.dealerFees.replace(/[^0-9.]/g, "")) || 0;
  const titleReg = parseFloat(offer.titleReg.replace(/[^0-9.]/g, "")) || 0;
  const taxRate = parseFloat(offer.taxRate) || 0;
  const addOnsRemoved = parseFloat(offer.addOnsRemoved.replace(/[^0-9.]/g, "")) || 0;

  const tax = negotiated * (taxRate / 100);
  const otd = negotiated + dealerFees + tax + titleReg;
  const savings = msrp - negotiated + addOnsRemoved;
  const belowInvoice = invoice - negotiated;

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setOffer((o) => ({ ...o, [field]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy">Desking Tool</h2>
            <p className="text-sm text-muted">Building offer for {customerName}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy text-2xl">&times;</button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          {/* Left: Inputs */}
          <div className="space-y-4">
            <h3 className="font-bold text-navy text-sm uppercase tracking-wider">Dealer Info</h3>
            <input value={offer.dealerName} onChange={set("dealerName")} placeholder="Dealer Name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <input value={offer.dealerContact} onChange={set("dealerContact")} placeholder="Contact Name" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none" />
              <input value={offer.dealerPhone} onChange={set("dealerPhone")} placeholder="Phone" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none" />
            </div>

            <h3 className="font-bold text-navy text-sm uppercase tracking-wider pt-2">Vehicle Info</h3>
            <input value={offer.vehicleDesc} onChange={set("vehicleDesc")} placeholder="Vehicle (e.g. 2026 Honda Accord Sport)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <input value={offer.stockNumber} onChange={set("stockNumber")} placeholder="Stock #" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none" />
              <input value={offer.vin} onChange={set("vin")} placeholder="VIN" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none" />
            </div>

            <h3 className="font-bold text-navy text-sm uppercase tracking-wider pt-2">Pricing</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted">MSRP</label>
                <input value={offer.msrp} onChange={set("msrp")} placeholder="$35,000" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted">Invoice</label>
                <input value={offer.invoice} onChange={set("invoice")} placeholder="$32,500" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted">Negotiated Price</label>
                <input value={offer.negotiatedPrice} onChange={set("negotiatedPrice")} placeholder="$31,200" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted">Dealer Fees</label>
                <input value={offer.dealerFees} onChange={set("dealerFees")} placeholder="$899" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted">Tax Rate %</label>
                <input value={offer.taxRate} onChange={set("taxRate")} placeholder="7" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted">Title/Reg</label>
                <input value={offer.titleReg} onChange={set("titleReg")} placeholder="$499" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted">Add-Ons Removed</label>
              <input value={offer.addOnsRemoved} onChange={set("addOnsRemoved")} placeholder="$2,800" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none" />
            </div>
            <textarea value={offer.notes} onChange={set("notes")} placeholder="Notes..." rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none resize-none" />
          </div>

          {/* Right: Calculations */}
          <div>
            <div className="bg-navy rounded-xl p-6 text-white sticky top-6">
              <h3 className="font-bold text-amber text-sm uppercase tracking-wider mb-4">Deal Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-white/50">MSRP</span><span>{msrp ? `$${msrp.toLocaleString()}` : "—"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/50">Invoice</span><span>{invoice ? `$${invoice.toLocaleString()}` : "—"}</span></div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-sm"><span className="text-white/50">Negotiated</span><span className="text-amber font-bold">{negotiated ? `$${negotiated.toLocaleString()}` : "—"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/50">Dealer Fees</span><span>{dealerFees ? `$${dealerFees.toLocaleString()}` : "—"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/50">Tax ({taxRate}%)</span><span>{tax ? `$${Math.round(tax).toLocaleString()}` : "—"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/50">Title/Reg</span><span>{titleReg ? `$${titleReg.toLocaleString()}` : "—"}</span></div>
                <div className="border-t border-white/10 pt-3 flex justify-between"><span className="font-bold">OTD Price</span><span className="text-2xl font-bold text-amber">{otd ? `$${Math.round(otd).toLocaleString()}` : "—"}</span></div>
              </div>

              {/* Savings */}
              {savings > 0 && (
                <div className="mt-6 bg-green-500/20 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-xs text-green-300 uppercase tracking-wider mb-1">Total Client Savings</p>
                    <p className="text-3xl font-bold text-green-400">${Math.round(savings).toLocaleString()}</p>
                    {belowInvoice > 0 && <p className="text-xs text-green-300 mt-1">${Math.round(belowInvoice).toLocaleString()} below invoice</p>}
                    {addOnsRemoved > 0 && <p className="text-xs text-green-300">${Math.round(addOnsRemoved).toLocaleString()} in add-ons removed</p>}
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <button className="w-full bg-amber text-navy font-bold py-3 rounded-lg hover:bg-amber-light transition">
                  Save Offer
                </button>
                <button className="w-full border border-white/20 text-white/60 py-3 rounded-lg hover:text-white transition">
                  Send to Client Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
