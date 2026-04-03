"use client";

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";

const STEPS = [
  "Consultation", "Lead Received", "Researching", "Negotiating",
  "Client Approval", "Deal Agreed", "Paperwork", "Delivery", "Delivered",
];

type SortKey = "name" | "vehicle" | "status" | "budget" | "days" | "company";
type SortDir = "asc" | "desc";

export default function FleetOrdersPage() {
  const [sortKey, setSortKey] = useState<SortKey>("days");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  /* ── New order form ── */
  const [form, setForm] = useState({
    companyName: "", contactName: "", contactEmail: "", contactPhone: "",
    vehicleCount: 1, vehicleType: "Work Trucks",
    budgetPerVehicle: "Under $35,000", timeline: "ASAP", notes: "",
  });

  /* ── Data ── */
  const fleetCustomers = trpc.fleet.getFleetCustomers.useQuery(undefined, { retry: false });
  const submitOrder = trpc.fleet.submitOrder.useMutation({
    onSuccess: () => {
      fleetCustomers.refetch();
      resetForm();
    },
  });

  const customers = fleetCustomers.data ?? [];

  const daysActive = (c: any) =>
    Math.max(0, Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86400000));

  const sorted = useMemo(() => {
    return [...customers].sort((a: any, b: any) => {
      let cmp = 0;
      if (sortKey === "name") cmp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      else if (sortKey === "vehicle") cmp = (a.vehicleSpecific || "").localeCompare(b.vehicleSpecific || "");
      else if (sortKey === "status") cmp = a.step - b.step;
      else if (sortKey === "budget") cmp = (a.budget || "").localeCompare(b.budget || "");
      else if (sortKey === "days") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortKey === "company") cmp = (a.fleetCompany || "").localeCompare(b.fleetCompany || "");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [customers, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  function resetForm() {
    setForm({
      companyName: "", contactName: "", contactEmail: "", contactPhone: "",
      vehicleCount: 1, vehicleType: "Work Trucks",
      budgetPerVehicle: "Under $35,000", timeline: "ASAP", notes: "",
    });
    setShowForm(false);
  }

  const arrow = (key: SortKey) => sortKey === key ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : "";

  const colHeader = (label: string, key: SortKey) => (
    <th
      onClick={() => toggleSort(key)}
      className="p-4 text-left text-xs text-white/30 font-semibold uppercase tracking-wider cursor-pointer hover:text-white/60 transition select-none whitespace-nowrap"
    >
      {label}<span className="text-amber">{arrow(key)}</span>
    </th>
  );

  const statusColor = (step: number) =>
    step === 8 ? "bg-green-500/20 text-green-400" :
    step >= 3 ? "bg-amber/20 text-amber" :
    step >= 1 ? "bg-blue-500/20 text-blue-400" :
    "bg-white/10 text-white/50";

  return (
    <div className="min-h-screen bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Fleet <span className="text-amber">Orders</span>
            </h1>
            <p className="text-sm text-white/40 mt-1">
              {customers.length} fleet vehicle{customers.length !== 1 ? "s" : ""} in pipeline
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber text-navy font-bold px-5 py-3 rounded-xl hover:brightness-110 transition text-sm flex items-center gap-2 self-start"
          >
            <span className="text-lg leading-none">+</span> New Fleet Order
          </button>
        </div>

        {/* Table */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-x-auto">
          {fleetCustomers.isLoading ? (
            <div className="text-center py-12 text-white/30 text-sm">Loading fleet orders...</div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/30 mb-4">No fleet orders in the system yet.</p>
              <button onClick={() => setShowForm(true)} className="bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:brightness-110 transition">
                Submit First Order
              </button>
            </div>
          ) : (
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5">
                  {colHeader("Client", "name")}
                  {colHeader("Company", "company")}
                  {colHeader("Vehicle", "vehicle")}
                  {colHeader("Status", "status")}
                  {colHeader("Budget", "budget")}
                  {colHeader("Days", "days")}
                </tr>
              </thead>
              <tbody>
                {sorted.map((c: any) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-navy border border-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                          {(c.firstName?.[0] || "").toUpperCase()}{(c.lastName?.[0] || "").toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{c.firstName} {c.lastName}</p>
                          <p className="text-[10px] text-amber">{c.gofetchClientId || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white/60">{c.fleetCompany || "\u2014"}</td>
                    <td className="p-4 text-white/60">{c.vehicleSpecific || c.vehicleType || "\u2014"}</td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(c.step)}`}>
                        {STEPS[c.step]}
                      </span>
                    </td>
                    <td className="p-4 text-white/40">{c.budget || "\u2014"}</td>
                    <td className="p-4 text-white/40">{daysActive(c)}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setSelectedCustomer(null)}>
            <div className="w-full max-w-lg bg-[#0f1d32] border border-white/10 rounded-2xl p-8 animate-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Fleet Order</p>
                  <h2 className="text-2xl font-bold text-amber" style={{ fontFamily: "var(--font-display)" }}>
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </h2>
                  <p className="text-sm text-white/40">{selectedCustomer.gofetchClientId}</p>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-white/30 hover:text-white text-2xl leading-none transition">&times;</button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase">Company</p>
                  <p className="text-white font-medium mt-1">{selectedCustomer.fleetCompany || "\u2014"}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase">Vehicle</p>
                  <p className="text-white font-medium mt-1">{selectedCustomer.vehicleSpecific || selectedCustomer.vehicleType || "\u2014"}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase">Budget</p>
                  <p className="text-white font-medium mt-1">{selectedCustomer.budget || "\u2014"}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase">Status</p>
                  <p className="mt-1">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(selectedCustomer.step)}`}>
                      {STEPS[selectedCustomer.step]}
                    </span>
                  </p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase">Timeline</p>
                  <p className="text-white font-medium mt-1">{selectedCustomer.timeline || "\u2014"}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase">Days Active</p>
                  <p className="text-white font-medium mt-1">{daysActive(selectedCustomer)}d</p>
                </div>
              </div>

              {selectedCustomer.notes && (
                <div className="bg-white/[0.03] rounded-xl p-4 mb-6">
                  <p className="text-xs text-white/30 uppercase mb-1">Notes</p>
                  <p className="text-white/70 text-sm leading-relaxed">{selectedCustomer.notes}</p>
                </div>
              )}

              {/* Documents summary */}
              {selectedCustomer.documents && selectedCustomer.documents.length > 0 && (
                <div className="bg-white/[0.03] rounded-xl p-4 mb-6">
                  <p className="text-xs text-white/30 uppercase mb-2">Documents ({selectedCustomer.documents.length})</p>
                  {selectedCustomer.documents.map((d: any) => (
                    <div key={d.id} className="flex justify-between text-xs py-1">
                      <span className="text-white/60">{d.originalName || d.fileName}</span>
                      <span className={`px-1.5 py-0.5 rounded ${
                        d.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"
                      }`}>{d.status}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <p className="text-xs text-white/20 self-center">
                  Created {new Date(selectedCustomer.createdAt).toLocaleDateString()} &bull; {selectedCustomer.email} &bull; {selectedCustomer.phone}
                </p>
                <button onClick={() => setSelectedCustomer(null)} className="ml-auto bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-white/10 transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Fleet Order Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => resetForm()}>
            <div className="w-full max-w-lg bg-[#0f1d32] border border-white/10 rounded-2xl p-8 animate-slide-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {submitOrder.isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-400 text-3xl">&#10003;</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    Order Submitted!
                  </h3>
                  <p className="text-white/40 text-sm mb-6">Our fleet team will reach out within 24 hours.</p>
                  <button onClick={() => { submitOrder.reset(); resetForm(); }} className="bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:brightness-110 transition">
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                        New Fleet <span className="text-amber">Order</span>
                      </h2>
                      <p className="text-sm text-white/30 mt-1">Fill in details to submit a fleet request.</p>
                    </div>
                    <button onClick={resetForm} className="text-white/30 hover:text-white text-2xl leading-none transition">&times;</button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/40 block mb-1">Company Name *</label>
                        <input value={form.companyName} onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none" />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 block mb-1">Contact Name *</label>
                        <input value={form.contactName} onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/40 block mb-1">Email *</label>
                        <input value={form.contactEmail} onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))} type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none" />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 block mb-1">Phone *</label>
                        <input value={form.contactPhone} onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/40 block mb-1">Vehicles</label>
                        <select value={form.vehicleCount} onChange={(e) => setForm((p) => ({ ...p, vehicleCount: Number(e.target.value) }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none">
                          {[1,2,3,4,5,6,7,8,9,10,15,20,25,30,40,50].map((n) => (
                            <option key={n} value={n} className="bg-navy text-white">{n} vehicle{n > 1 ? "s" : ""}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-white/40 block mb-1">Vehicle Type</label>
                        <select value={form.vehicleType} onChange={(e) => setForm((p) => ({ ...p, vehicleType: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none">
                          {["Work Trucks", "Heavy-Duty Trucks", "Cargo Vans", "Passenger Vans", "Sedans", "SUVs", "Mixed Fleet"].map((t) => (
                            <option key={t} value={t} className="bg-navy text-white">{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/40 block mb-1">Budget / Vehicle</label>
                        <select value={form.budgetPerVehicle} onChange={(e) => setForm((p) => ({ ...p, budgetPerVehicle: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none">
                          {["Under $35,000", "$35,000 - $50,000", "$50,000 - $75,000", "$75,000 - $100,000", "$100,000+"].map((b) => (
                            <option key={b} value={b} className="bg-navy text-white">{b}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-white/40 block mb-1">Timeline</label>
                        <select value={form.timeline} onChange={(e) => setForm((p) => ({ ...p, timeline: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none">
                          {["ASAP", "1-2 Weeks", "1 Month", "This Quarter"].map((t) => (
                            <option key={t} value={t} className="bg-navy text-white">{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Notes</label>
                      <textarea placeholder="Special requirements, upfitting, branding..." rows={3} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none resize-none" />
                    </div>
                    {submitOrder.isError && <p className="text-red-400 text-sm">{submitOrder.error.message}</p>}
                    <button
                      onClick={() => {
                        if (!form.companyName || !form.contactName || !form.contactEmail || !form.contactPhone) return;
                        submitOrder.mutate(form);
                      }}
                      disabled={submitOrder.isPending}
                      className="w-full bg-amber text-navy font-bold py-4 rounded-lg hover:brightness-110 transition text-base disabled:opacity-50"
                    >
                      {submitOrder.isPending ? "Submitting..." : "Submit Fleet Order"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
