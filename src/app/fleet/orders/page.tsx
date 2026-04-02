"use client";

import { useState, useMemo } from "react";

type SortKey = "id" | "company" | "vehicles" | "type" | "status" | "date" | "savings";
type SortDir = "asc" | "desc";

interface FleetOrder {
  id: string;
  company: string;
  vehicles: number;
  type: string;
  status: "Delivered" | "Negotiating" | "In Progress" | "Pending";
  date: string;
  sortDate: number;
  savings: number;
  contact: string;
  budget: string;
  timeline: string;
  notes: string;
}

const mockOrders: FleetOrder[] = [
  {
    id: "GF-F-2026-001",
    company: "Summit Logistics",
    vehicles: 8,
    type: "Work Trucks",
    status: "Delivered",
    date: "Jan 10, 2026",
    sortDate: 20260110,
    savings: 18400,
    contact: "James Hartfield",
    budget: "$45,000/vehicle",
    timeline: "Completed",
    notes: "8x Ford F-150 XLT crew cab, white, fleet upfit package.",
  },
  {
    id: "GF-F-2026-002",
    company: "Greenway Plumbing",
    vehicles: 5,
    type: "Cargo Vans",
    status: "Negotiating",
    date: "Feb 18, 2026",
    sortDate: 20260218,
    savings: 9250,
    contact: "Maria Vasquez",
    budget: "$38,000/vehicle",
    timeline: "Q1 2026",
    notes: "5x Ram ProMaster 2500 High Roof, shelving + ladder racks.",
  },
  {
    id: "GF-F-2026-003",
    company: "Apex Construction",
    vehicles: 12,
    type: "Heavy-Duty Trucks",
    status: "In Progress",
    date: "Mar 05, 2026",
    sortDate: 20260305,
    savings: 31200,
    contact: "Derek Owens",
    budget: "$62,000/vehicle",
    timeline: "This Quarter",
    notes: "12x Chevy Silverado 2500HD, tow package, bed liner, company wrap.",
  },
  {
    id: "GF-F-2026-004",
    company: "ClearView Realty",
    vehicles: 3,
    type: "SUVs",
    status: "Pending",
    date: "Mar 22, 2026",
    sortDate: 20260322,
    savings: 5100,
    contact: "Natalie Park",
    budget: "$55,000/vehicle",
    timeline: "1 Month",
    notes: "3x Hyundai Palisade Calligraphy, black on black, tinted windows.",
  },
  {
    id: "GF-F-2026-005",
    company: "Metro Medical Transport",
    vehicles: 6,
    type: "Passenger Vans",
    status: "Negotiating",
    date: "Mar 28, 2026",
    sortDate: 20260328,
    savings: 12600,
    contact: "Robert Chen",
    budget: "$48,000/vehicle",
    timeline: "ASAP",
    notes: "6x Toyota Sienna Hybrid, ADA compliant conversion needed.",
  },
];

const statusColor: Record<FleetOrder["status"], string> = {
  Delivered: "bg-green-500/20 text-green-400",
  Negotiating: "bg-amber/20 text-amber",
  "In Progress": "bg-blue-500/20 text-blue-400",
  Pending: "bg-white/10 text-white/50",
};

export default function FleetOrdersPage() {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedOrder, setSelectedOrder] = useState<FleetOrder | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form state
  const [formCompany, setFormCompany] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formVehicles, setFormVehicles] = useState(1);
  const [formType, setFormType] = useState("Work Trucks");
  const [formBudget, setFormBudget] = useState("Under $35,000");
  const [formTimeline, setFormTimeline] = useState("ASAP");
  const [formNotes, setFormNotes] = useState("");

  const sorted = useMemo(() => {
    const copy = [...mockOrders];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "id":
          cmp = a.id.localeCompare(b.id);
          break;
        case "company":
          cmp = a.company.localeCompare(b.company);
          break;
        case "vehicles":
          cmp = a.vehicles - b.vehicles;
          break;
        case "type":
          cmp = a.type.localeCompare(b.type);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "date":
          cmp = a.sortDate - b.sortDate;
          break;
        case "savings":
          cmp = a.savings - b.savings;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function handleSubmit() {
    setFormSubmitted(true);
  }

  function resetForm() {
    setFormCompany("");
    setFormContact("");
    setFormVehicles(1);
    setFormType("Work Trucks");
    setFormBudget("Under $35,000");
    setFormTimeline("ASAP");
    setFormNotes("");
    setFormSubmitted(false);
    setShowForm(false);
  }

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  const colHeader = (label: string, key: SortKey) => (
    <th
      onClick={() => toggleSort(key)}
      className="p-4 text-left text-xs text-white/30 font-semibold uppercase tracking-wider cursor-pointer hover:text-white/60 transition select-none whitespace-nowrap"
    >
      {label}
      <span className="text-amber">{arrow(key)}</span>
    </th>
  );

  return (
    <div className="min-h-screen bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Fleet <span className="text-amber">Orders</span>
            </h1>
            <p className="text-sm text-white/40 mt-1">
              Track and manage all fleet procurement orders.
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setFormSubmitted(false);
            }}
            className="bg-amber text-navy font-bold px-5 py-3 rounded-xl hover:bg-amber-light transition text-sm flex items-center gap-2 self-start"
          >
            <span className="text-lg leading-none">+</span> New Fleet Order
          </button>
        </div>

        {/* Table */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5">
                {colHeader("Order #", "id")}
                {colHeader("Company", "company")}
                {colHeader("Vehicles", "vehicles")}
                {colHeader("Type", "type")}
                {colHeader("Status", "status")}
                {colHeader("Date", "date")}
                {colHeader("Savings", "savings")}
              </tr>
            </thead>
            <tbody>
              {sorted.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition"
                >
                  <td className="p-4 text-amber font-mono font-medium">
                    {o.id}
                  </td>
                  <td className="p-4 text-white">{o.company}</td>
                  <td className="p-4 text-white">{o.vehicles}</td>
                  <td className="p-4 text-white/70">{o.type}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 text-white/40">{o.date}</td>
                  <td className="p-4 text-green-400 font-medium">
                    ${o.savings.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="w-full max-w-lg bg-navy-light border border-white/10 rounded-2xl p-8 animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-1">
                    Order Details
                  </p>
                  <h2
                    className="text-2xl font-bold text-amber"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {selectedOrder.id}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white/30 hover:text-white text-2xl leading-none transition"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase">Company</p>
                  <p className="text-white font-medium mt-1">
                    {selectedOrder.company}
                  </p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase">Contact</p>
                  <p className="text-white font-medium mt-1">
                    {selectedOrder.contact}
                  </p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase">Vehicles</p>
                  <p className="text-white font-medium mt-1">
                    {selectedOrder.vehicles} &mdash; {selectedOrder.type}
                  </p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase">Budget</p>
                  <p className="text-white font-medium mt-1">
                    {selectedOrder.budget}
                  </p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase">Status</p>
                  <p className="mt-1">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[selectedOrder.status]}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase">Savings</p>
                  <p className="text-green-400 font-bold mt-1">
                    ${selectedOrder.savings.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-white/[0.03] rounded-xl p-4 mb-6">
                <p className="text-xs text-white/30 uppercase mb-1">Notes</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  {selectedOrder.notes}
                </p>
              </div>

              <div className="flex gap-3">
                <p className="text-xs text-white/20 self-center">
                  {selectedOrder.date} &bull; Timeline: {selectedOrder.timeline}
                </p>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="ml-auto bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-white/10 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Fleet Order Modal */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => resetForm()}
          >
            <div
              className="w-full max-w-lg bg-navy-light border border-white/10 rounded-2xl p-8 animate-slide-in max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-400 text-3xl">&#10003;</span>
                  </div>
                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Order Submitted!
                  </h3>
                  <p className="text-white/40 text-sm mb-6">
                    Our fleet team will reach out within 24 hours.
                  </p>
                  <button
                    onClick={resetForm}
                    className="bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:bg-amber-light transition"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2
                        className="text-xl font-bold text-white"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        New Fleet <span className="text-amber">Order</span>
                      </h2>
                      <p className="text-sm text-white/30 mt-1">
                        Fill in the details below to submit a new fleet request.
                      </p>
                    </div>
                    <button
                      onClick={resetForm}
                      className="text-white/30 hover:text-white text-2xl leading-none transition"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-white/40 block mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Logistics"
                        value={formCompany}
                        onChange={(e) => setFormCompany(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/40 block mb-1">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. John Smith"
                        value={formContact}
                        onChange={(e) => setFormContact(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/40 block mb-1">
                          Number of Vehicles
                        </label>
                        <select
                          value={formVehicles}
                          onChange={(e) =>
                            setFormVehicles(Number(e.target.value))
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                        >
                          {Array.from({ length: 50 }, (_, i) => i + 1).map(
                            (n) => (
                              <option key={n} value={n}>
                                {n} vehicle{n > 1 ? "s" : ""}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-white/40 block mb-1">
                          Vehicle Types
                        </label>
                        <select
                          value={formType}
                          onChange={(e) => setFormType(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                        >
                          <option>Work Trucks</option>
                          <option>Heavy-Duty Trucks</option>
                          <option>Cargo Vans</option>
                          <option>Passenger Vans</option>
                          <option>Sedans</option>
                          <option>SUVs</option>
                          <option>Mixed Fleet</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/40 block mb-1">
                          Budget per Vehicle
                        </label>
                        <select
                          value={formBudget}
                          onChange={(e) => setFormBudget(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                        >
                          <option>Under $35,000</option>
                          <option>$35,000 - $50,000</option>
                          <option>$50,000 - $75,000</option>
                          <option>$75,000 - $100,000</option>
                          <option>$100,000+</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-white/40 block mb-1">
                          Timeline
                        </label>
                        <select
                          value={formTimeline}
                          onChange={(e) => setFormTimeline(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                        >
                          <option>ASAP</option>
                          <option>1-2 Weeks</option>
                          <option>1 Month</option>
                          <option>This Quarter</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-white/40 block mb-1">
                        Notes
                      </label>
                      <textarea
                        placeholder="Special requirements, upfitting, branding, specific models..."
                        rows={3}
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="w-full bg-amber text-navy font-bold py-4 rounded-lg hover:bg-amber-light transition text-base"
                    >
                      Submit Fleet Order
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
