"use client";

import { useState, useMemo, useCallback, useRef, type DragEvent } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

/* ═══════════════════ Constants ═══════════════════ */

const STEPS = [
  "Consultation", "Lead Received", "Researching", "Negotiating",
  "Client Approval", "Deal Agreed", "Paperwork", "Delivery", "Delivered",
];

// 6-column pipeline grouping per spec
const PIPELINE_COLS = [
  { label: "NEW", steps: [0, 1], color: "bg-blue-400", border: "border-l-blue-400" },
  { label: "WORKING", steps: [2], color: "bg-indigo-400", border: "border-l-indigo-400" },
  { label: "NEGOTIATING", steps: [3, 4], color: "bg-amber", border: "border-l-amber" },
  { label: "CLOSING", steps: [5, 6], color: "bg-orange-400", border: "border-l-orange-400" },
  { label: "DELIVERY", steps: [7], color: "bg-green-400", border: "border-l-green-400" },
  { label: "COMPLETED", steps: [8], color: "bg-green-500", border: "border-l-green-500" },
];

const STEP_COLORS = [
  "bg-gray-200", "bg-blue-200", "bg-blue-300", "bg-amber/30",
  "bg-amber/50", "bg-amber", "bg-green-200", "bg-green-300", "bg-green-500",
];

const CRM_NAV = [
  { id: "dashboard", label: "Dashboard", icon: "\u25A6" },
  { id: "pipeline", label: "Pipeline", icon: "\u2630" },
  { id: "tasks", href: "/dealer/tasks", label: "Tasks", icon: "\u2611" },
  { id: "calendar", href: "/dealer/calendar", label: "Calendar", icon: "\u25CB" },
  { id: "comms", href: "/dealer/communications", label: "Messages", icon: "\u2709" },
  { id: "analytics", href: "/dealer/analytics", label: "Analytics", icon: "\u25C8" },
  { id: "settings", href: "/dealer/settings", label: "Settings", icon: "\u2699" },
];

/* ═══════════════════ Helpers ═══════════════════ */

const initials = (c: any) =>
  `${(c.firstName?.[0] ?? "").toUpperCase()}${(c.lastName?.[0] ?? "").toUpperCase()}`;

const daysActive = (c: any) =>
  Math.max(0, Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86400000));

const leadScoreColor = (score: number) =>
  score >= 80 ? "bg-red-500/20 text-red-400" :
  score >= 50 ? "bg-amber/20 text-amber" :
  "bg-white/10 text-white/40";

const leadScoreLabel = (score: number) =>
  score >= 80 ? "Hot" : score >= 50 ? "Warm" : "Cold";

/* ═══════════════════ Focus List ═══════════════════ */

function FocusList({
  customers,
  onSelect,
}: {
  customers: any[];
  onSelect: (c: any) => void;
}) {
  // Top 5 by lead score, then by most recent
  const top5 = useMemo(() => {
    return [...customers]
      .sort((a, b) => (b.leadScore ?? 0) - (a.leadScore ?? 0))
      .slice(0, 5);
  }, [customers]);

  if (top5.length === 0) return null;

  return (
    <div className="bg-white/[0.03] rounded-xl border border-white/5 p-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-amber text-sm">&#9733;</span>
        <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Focus List</p>
      </div>
      <div className="space-y-1.5">
        {top5.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition group"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
              c.isFleet ? "bg-navy text-white border border-white/20" : "bg-amber/20 text-amber"
            }`}>
              {initials(c)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/70 truncate group-hover:text-white transition">
                {c.firstName} {c.lastName}
              </p>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${leadScoreColor(c.leadScore ?? 0)}`}>
              {c.leadScore ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════ AI Recommendations ═══════════════════ */

function AIRecommendations({ customers }: { customers: any[] }) {
  const recommendations = useMemo(() => {
    const recs: { icon: string; text: string; type: string }[] = [];

    // Stale leads (no activity in 3+ days, not delivered)
    const stale = customers.filter((c) => c.step < 8 && daysActive(c) >= 3);
    if (stale.length > 0) {
      recs.push({
        icon: "\u26A0",
        text: `${stale.length} lead${stale.length > 1 ? "s" : ""} with no activity in 3+ days`,
        type: "warning",
      });
    }

    // Hot leads in early stages
    const hotEarly = customers.filter((c) => (c.leadScore ?? 0) >= 80 && c.step <= 2);
    if (hotEarly.length > 0) {
      recs.push({
        icon: "\uD83D\uDD25",
        text: `${hotEarly.length} hot lead${hotEarly.length > 1 ? "s" : ""} need immediate attention`,
        type: "urgent",
      });
    }

    // Deals ready to close
    const readyClose = customers.filter((c) => c.step >= 5 && c.step <= 6 && !c.paid);
    if (readyClose.length > 0) {
      recs.push({
        icon: "\uD83D\uDCB0",
        text: `${readyClose.length} deal${readyClose.length > 1 ? "s" : ""} ready to close`,
        type: "success",
      });
    }

    // ASAP timeline leads
    const asap = customers.filter((c) => c.timeline === "ASAP" && c.step < 3);
    if (asap.length > 0) {
      recs.push({
        icon: "\u23F1",
        text: `${asap.length} ASAP buyer${asap.length > 1 ? "s" : ""} still in early pipeline`,
        type: "warning",
      });
    }

    if (recs.length === 0) {
      recs.push({ icon: "\u2705", text: "Pipeline looking healthy. Keep it up!", type: "success" });
    }

    return recs.slice(0, 4);
  }, [customers]);

  return (
    <div className="bg-white/[0.03] rounded-xl border border-white/5 p-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-blue-400 text-sm">&#9672;</span>
        <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">AI Insights</p>
      </div>
      <div className="space-y-2">
        {recommendations.map((r, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <span className="flex-shrink-0 mt-0.5">{r.icon}</span>
            <span className={`${
              r.type === "urgent" ? "text-red-400" :
              r.type === "warning" ? "text-amber" :
              "text-green-400"
            }`}>
              {r.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════ Detail Panel ═══════════════════ */

function DetailPanel({
  customer,
  onClose,
}: {
  customer: any;
  onClose: () => void;
}) {
  const [detailTab, setDetailTab] = useState("overview");
  const [newNote, setNewNote] = useState("");
  const utils = trpc.useUtils();

  const addNote = trpc.dealer.addNote.useMutation({
    onSuccess: () => {
      setNewNote("");
      utils.customer.getAll.invalidate();
    },
  });

  const detailTabs = [
    { id: "overview", label: "Overview" },
    { id: "notes", label: "Notes" },
    { id: "messages", label: "Messages" },
    { id: "documents", label: "Docs" },
    { id: "offers", label: "Offers" },
    { id: "outreach", label: "Find Car" },
    { id: "intel", label: "Intel" },
    { id: "prep", label: "Prep" },
  ];

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote.mutate({ customerId: customer.id, content: newNote.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="bg-black/50 absolute inset-0" />
      <div
        className="relative w-full max-w-xl bg-[#0f1d32] border-l border-white/10 h-full overflow-y-auto animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0f1d32] border-b border-white/5 p-4 z-10">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                customer.isFleet ? "bg-navy text-white border border-white/20" : "bg-amber/20 text-amber"
              }`}>
                {initials(customer)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{customer.firstName} {customer.lastName}</h3>
                  {customer.isFleet ? (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-navy text-white/70 border border-white/10">FLEET</span>
                  ) : (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber/20 text-amber">RETAIL</span>
                  )}
                </div>
                <p className="text-xs text-amber">{customer.gofetchClientId || "No ID"}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/30 hover:text-white text-xl p-1">&times;</button>
          </div>
          <div className="flex gap-0.5 bg-black/30 rounded-lg p-0.5 overflow-x-auto">
            {detailTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setDetailTab(t.id)}
                className={`flex-1 py-1.5 text-[10px] font-semibold rounded-md transition whitespace-nowrap px-2 ${
                  detailTab === t.id ? "bg-amber text-navy" : "text-white/40 hover:text-white/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {/* OVERVIEW TAB */}
          {detailTab === "overview" && (
            <div className="space-y-4">
              {/* Lead score banner */}
              {customer.leadScore != null && (
                <div className={`flex items-center justify-between rounded-lg p-3 ${leadScoreColor(customer.leadScore)}`}>
                  <span className="text-xs font-semibold">Lead Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{leadScoreLabel(customer.leadScore)}</span>
                    <span className="text-lg font-bold">{customer.leadScore}</span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Email", value: customer.email },
                  { label: "Phone", value: customer.phone },
                  { label: "Vehicle", value: customer.vehicleSpecific || customer.vehicleType || "\u2014" },
                  { label: "Budget", value: customer.budget || "\u2014" },
                  { label: "Source", value: customer.source || "\u2014" },
                  { label: "Timeline", value: customer.timeline || "\u2014" },
                  { label: "Negotiated", value: customer.negotiatedPrice || "Pending" },
                  { label: "Delivery", value: customer.deliveryDate || "Pending" },
                ].map((f) => (
                  <div key={f.label} className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{f.label}</p>
                    <p className="text-sm text-white">{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${STEP_COLORS[customer.step]} text-navy`}>
                    {STEPS[customer.step]}
                  </span>
                  <span className="text-xs text-white/20">Step {customer.step + 1}/9</span>
                </div>
              </div>
              {/* Deal timeline */}
              <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Deal Timeline</p>
                <div className="flex items-center gap-1">
                  {STEPS.map((s, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        i < customer.step ? "bg-amber border-amber" :
                        i === customer.step ? "bg-amber border-amber animate-pulse" :
                        "bg-transparent border-white/20"
                      }`} />
                      <span className={`text-[7px] text-center leading-tight ${
                        i <= customer.step ? "text-white/50" : "text-white/15"
                      }`}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              {customer.notes && (
                <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Client Notes</p>
                  <p className="text-sm text-white/60">{customer.notes}</p>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-white/20">
                <span>Created: {new Date(customer.createdAt).toLocaleDateString()}</span>
                <span>|</span>
                <span>{customer.isFleet ? "Fleet" : "Retail"}</span>
                <span>|</span>
                <span>{daysActive(customer)}d active</span>
                <span>|</span>
                <span>Paid: {customer.paid ? "Yes" : "No"}</span>
              </div>
            </div>
          )}

          {/* NOTES TAB */}
          {detailTab === "notes" && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="Add a note..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber outline-none"
                />
                <button
                  onClick={handleAddNote}
                  disabled={addNote.isPending}
                  className="bg-amber text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-light transition disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              {customer.notesLog && customer.notesLog.length > 0 ? (
                customer.notesLog.map((n: any) => (
                  <div key={n.id} className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                    <p className="text-sm text-white/70">{n.content}</p>
                    <p className="text-xs text-white/20 mt-1">{n.author} &mdash; {new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/30 text-center py-6">No notes yet.</p>
              )}
            </div>
          )}

          {/* MESSAGES TAB */}
          {detailTab === "messages" && (
            <div className="space-y-2">
              {customer.messages && customer.messages.length > 0 ? (
                customer.messages.map((m: any) => (
                  <div key={m.id} className={`flex ${m.sender === "customer" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs rounded-xl px-3 py-2 text-sm ${
                      m.sender === "customer" ? "bg-amber text-navy" :
                      m.sender === "system" ? "bg-blue-500/20 text-blue-300" :
                      "bg-white/10 text-white/70"
                    }`}>
                      <p>{m.content}</p>
                      <p className="text-[10px] mt-1 opacity-50">{m.sender} &mdash; {new Date(m.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/30 text-center py-6">No messages.</p>
              )}
            </div>
          )}

          {/* DOCUMENTS TAB */}
          {detailTab === "documents" && (
            <div className="space-y-2">
              {customer.documents && customer.documents.length > 0 ? (
                customer.documents.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between bg-white/[0.03] rounded-lg p-3 border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">&#128196;</span>
                      <div>
                        <p className="text-sm text-white">{d.originalName || d.fileName}</p>
                        <p className="text-xs text-white/30">{d.docType}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      d.status === "approved" ? "bg-green-500/20 text-green-400" :
                      d.status === "under_review" ? "bg-amber/20 text-amber" :
                      "bg-white/10 text-white/40"
                    }`}>{d.status}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/30 text-center py-6">No documents uploaded.</p>
              )}
            </div>
          )}

          {/* OFFERS TAB */}
          {detailTab === "offers" && (
            <div className="space-y-2">
              {customer.deskingOffers && customer.deskingOffers.length > 0 ? (
                customer.deskingOffers.map((o: any) => (
                  <div key={o.id} className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-medium text-white">{o.vehicleDesc || "Vehicle TBD"}</p>
                        <p className="text-xs text-white/30">{o.dealerName || "Dealer TBD"}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        o.status === "accepted" ? "bg-green-500/20 text-green-400" :
                        o.status === "rejected" ? "bg-red-500/20 text-red-400" :
                        "bg-amber/20 text-amber"
                      }`}>{o.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><span className="text-white/30">MSRP:</span> <span className="text-white">{o.msrp || "\u2014"}</span></div>
                      <div><span className="text-white/30">Negotiated:</span> <span className="text-amber">{o.negotiatedPrice || "\u2014"}</span></div>
                      <div><span className="text-white/30">OTD:</span> <span className="text-white">{o.otdPrice || "\u2014"}</span></div>
                    </div>
                    {o.savings && <p className="text-xs text-green-400 mt-2">Savings: {o.savings}</p>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/30 text-center py-6">No offers yet.</p>
              )}
            </div>
          )}

          {/* OUTREACH / FIND CAR TAB */}
          {detailTab === "outreach" && (
            <OutreachTab customer={customer} />
          )}

          {/* COMPETITIVE INTEL TAB */}
          {detailTab === "intel" && (
            <IntelTab customer={customer} />
          )}

          {/* MEETING PREP TAB */}
          {detailTab === "prep" && (
            <MeetingPrepTab customer={customer} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ Outreach Tab ═══════════════════ */

function OutreachTab({ customer }: { customer: any }) {
  const [searchForm, setSearchForm] = useState({
    vehicle: customer.vehicleSpecific || customer.vehicleType || "",
    color: "",
    maxPrice: customer.budget || "",
    radius: "50",
  });

  const campaigns = trpc.outreach.getByCustomer.useQuery(
    { customerId: customer.id },
    { retry: false }
  );

  return (
    <div className="space-y-4">
      {/* Search form */}
      <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
        <p className="text-xs font-semibold text-white/60 mb-3 uppercase tracking-wider">Define Vehicle Search</p>
        <div className="space-y-3">
          <input
            value={searchForm.vehicle}
            onChange={(e) => setSearchForm((p) => ({ ...p, vehicle: e.target.value }))}
            placeholder="Vehicle (e.g., 2026 Toyota RAV4 XLE)"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={searchForm.color}
              onChange={(e) => setSearchForm((p) => ({ ...p, color: e.target.value }))}
              placeholder="Preferred color"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber outline-none"
            />
            <input
              value={searchForm.maxPrice}
              onChange={(e) => setSearchForm((p) => ({ ...p, maxPrice: e.target.value }))}
              placeholder="Max price"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber outline-none"
            />
          </div>
          <select
            value={searchForm.radius}
            onChange={(e) => setSearchForm((p) => ({ ...p, radius: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber outline-none"
          >
            {["25", "50", "100", "200"].map((r) => (
              <option key={r} value={r} className="bg-navy text-white">{r} mile radius</option>
            ))}
          </select>
          <button className="w-full bg-amber text-navy font-bold py-2.5 rounded-lg text-sm hover:brightness-110 transition">
            Send Dealer Inquiries
          </button>
        </div>
      </div>

      {/* Existing campaigns */}
      <div>
        <p className="text-xs font-semibold text-white/60 mb-3 uppercase tracking-wider">Active Campaigns</p>
        {campaigns.data && campaigns.data.length > 0 ? (
          <div className="space-y-2">
            {campaigns.data.map((cam: any) => (
              <div key={cam.id} className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-white font-medium">{cam.vehicleDesc}</p>
                  <span className="text-[10px] text-white/30">{new Date(cam.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="text-green-400">{cam.respondedCount ?? 0} responded</span>
                  <span className="text-white/30">{cam.pendingCount ?? 0} pending</span>
                  <span className="text-red-400/60">{cam.declinedCount ?? 0} declined</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/30 text-center py-4">No outreach campaigns yet.</p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════ Intel Tab ═══════════════════ */

function IntelTab({ customer }: { customer: any }) {
  const vehicle = customer.vehicleSpecific || customer.vehicleType || "Vehicle";
  const budget = customer.budget || "Not specified";

  return (
    <div className="space-y-4">
      <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
        <p className="text-xs font-semibold text-white/60 mb-3 uppercase tracking-wider">Market Intelligence</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">Target Vehicle</span>
            <span className="text-sm text-white">{vehicle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">Client Budget</span>
            <span className="text-sm text-amber">{budget}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">Days in Pipeline</span>
            <span className="text-sm text-white">{daysActive(customer)}d</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">Timeline</span>
            <span className="text-sm text-white">{customer.timeline || "Not specified"}</span>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
        <p className="text-xs font-semibold text-white/60 mb-3 uppercase tracking-wider">Negotiation Position</p>
        <div className="space-y-2 text-xs text-white/50">
          {customer.negotiatedPrice ? (
            <div className="flex justify-between">
              <span>Current Negotiated Price</span>
              <span className="text-amber font-semibold">{customer.negotiatedPrice}</span>
            </div>
          ) : (
            <p className="text-center py-2 text-white/30">No negotiations started yet</p>
          )}
          {customer.deskingOffers && customer.deskingOffers.length > 0 && (
            <div className="flex justify-between">
              <span>Total Offers Received</span>
              <span className="text-white font-semibold">{customer.deskingOffers.length}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
        <p className="text-xs font-semibold text-white/60 mb-3 uppercase tracking-wider">Source &amp; Referral</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Lead Source</span>
            <span className="text-white">{customer.source || "Unknown"}</span>
          </div>
          {customer.utmCampaign && (
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Campaign</span>
              <span className="text-white">{customer.utmCampaign}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ Meeting Prep Tab ═══════════════════ */

function MeetingPrepTab({ customer }: { customer: any }) {
  const vehicle = customer.vehicleSpecific || customer.vehicleType || "Not specified";

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-b from-blue-500/10 to-transparent rounded-xl border border-blue-500/20 p-4">
        <p className="text-xs font-semibold text-blue-400 mb-3 uppercase tracking-wider">AI Meeting Briefing</p>
        <div className="space-y-3 text-sm text-white/70">
          <p><span className="text-white font-semibold">{customer.firstName} {customer.lastName}</span> is a {customer.isFleet ? "fleet" : "retail"} client looking for: <span className="text-amber">{vehicle}</span></p>
          {customer.budget && <p>Budget range: <span className="text-white font-semibold">{customer.budget}</span></p>}
          {customer.timeline && <p>Timeline: <span className="text-white font-semibold">{customer.timeline}</span></p>}
          <p>Currently at: <span className="text-amber font-semibold">{STEPS[customer.step]}</span> ({daysActive(customer)} days active)</p>
        </div>
      </div>

      <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
        <p className="text-xs font-semibold text-white/60 mb-3 uppercase tracking-wider">Key Talking Points</p>
        <ul className="space-y-2 text-xs text-white/50">
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5">&#8226;</span>
            <span>Confirm vehicle preferences and any changes since last contact</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5">&#8226;</span>
            <span>{customer.step < 3 ? "Discuss timeline expectations and financing preferences" : "Review current offers and negotiation progress"}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5">&#8226;</span>
            <span>{customer.negotiatedPrice ? `Current negotiated price: ${customer.negotiatedPrice}` : "No price negotiated yet — set expectations"}</span>
          </li>
          {customer.isFleet && (
            <li className="flex items-start gap-2">
              <span className="text-amber mt-0.5">&#8226;</span>
              <span>Fleet order — confirm quantity, delivery schedule, and company billing</span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="text-amber mt-0.5">&#8226;</span>
            <span>Next steps: {customer.step < 8 ? `Move to ${STEPS[Math.min(customer.step + 1, 8)]}` : "Deal complete"}</span>
          </li>
        </ul>
      </div>

      {customer.notesLog && customer.notesLog.length > 0 && (
        <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
          <p className="text-xs font-semibold text-white/60 mb-3 uppercase tracking-wider">Recent Notes</p>
          <div className="space-y-2">
            {customer.notesLog.slice(0, 3).map((n: any) => (
              <div key={n.id} className="text-xs text-white/50 border-l-2 border-white/10 pl-3">
                <p>{n.content}</p>
                <p className="text-white/20 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ Add Customer Drawer ═══════════════════ */

function AddCustomerDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isFleet, setIsFleet] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    vehicleType: "", budget: "", step: 0,
    source: "Manual", notes: "", fleetCompany: "",
  });

  const utils = trpc.useUtils();
  const addCustomer = trpc.dealer.addCustomer.useMutation({
    onSuccess: () => {
      utils.customer.getAll.invalidate();
      onClose();
      setForm({ firstName: "", lastName: "", email: "", phone: "", vehicleType: "", budget: "", step: 0, source: "Manual", notes: "", fleetCompany: "" });
      setIsFleet(false);
    },
  });

  const set = (key: string, val: string | number) => setForm((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) return;
    addCustomer.mutate({
      ...form,
      isFleet,
      fleetCompany: isFleet ? form.fleetCompany : undefined,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="bg-black/50 absolute inset-0" />
      <div className="relative w-full max-w-md bg-[#0f1d32] border-l border-white/10 h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#0f1d32] border-b border-white/5 p-4 z-10 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Add Client</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white text-xl">&times;</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Retail / Fleet toggle */}
          <div className="flex bg-black/30 rounded-lg p-0.5 border border-white/5">
            <button
              onClick={() => setIsFleet(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${!isFleet ? "bg-amber text-navy" : "text-white/40"}`}
            >
              Retail
            </button>
            <button
              onClick={() => setIsFleet(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${isFleet ? "bg-navy text-white border border-white/20" : "text-white/40"}`}
            >
              Fleet
            </button>
          </div>

          <input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="First Name *" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-amber outline-none" />
          <input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Last Name *" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-amber outline-none" />
          <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Email *" type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-amber outline-none" />
          <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone *" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-amber outline-none" />
          <input value={form.vehicleType} onChange={(e) => set("vehicleType", e.target.value)} placeholder="Vehicle Type" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-amber outline-none" />
          <input value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="Budget" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-amber outline-none" />

          <select value={form.source} onChange={(e) => set("source", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber outline-none">
            {["Manual", "Website", "Referral", "Social", "Google", "Facebook"].map((s) => (
              <option key={s} value={s} className="bg-navy text-white">{s}</option>
            ))}
          </select>

          <select value={form.step} onChange={(e) => set("step", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber outline-none">
            {STEPS.map((s, i) => (
              <option key={i} value={i} className="bg-navy text-white">{s}</option>
            ))}
          </select>

          <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Notes (optional)" rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-amber outline-none resize-none" />

          {isFleet && (
            <>
              <div className="border-t border-white/5 pt-4">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Fleet Details</p>
              </div>
              <input value={form.fleetCompany} onChange={(e) => set("fleetCompany", e.target.value)} placeholder="Company Name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-amber outline-none" />
            </>
          )}

          <button
            onClick={handleSave}
            disabled={addCustomer.isPending}
            className="w-full bg-amber text-navy font-bold py-3 rounded-lg hover:brightness-110 transition mt-2 disabled:opacity-50"
          >
            {addCustomer.isPending ? "Saving..." : "Save Client"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */

type ViewMode = "pipeline" | "table" | "analytics";
type FilterPill = "all" | "new" | "working" | "negotiating" | "closing" | "delivered" | "paid" | "retail" | "fleet";
type SortKey = "name" | "vehicle" | "step" | "type" | "days" | "phone" | "email" | "payment";
type SortDir = "asc" | "desc";

export default function DealerPage() {
  /* ── Auth state ── */
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState("");

  /* ── UI state ── */
  const [view, setView] = useState<ViewMode>("pipeline");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [addCustomerDrawer, setAddCustomerDrawer] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterPill, setFilterPill] = useState<FilterPill>("all");
  const [activeNav, setActiveNav] = useState("pipeline");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* ── Drag state ── */
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<number | null>(null);

  /* ── Local step overrides ── */
  const [stepOverrides, setStepOverrides] = useState<Record<string, number>>({});

  /* ── Debounced search ── */
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 300);
  }, []);

  /* ── Login mutation ── */
  const loginMutation = trpc.dealer.login.useMutation({
    onSuccess: () => {
      localStorage.setItem("gf-dealer-pin", pin);
      setAuthed(true);
      setLoginError("");
    },
    onError: (err) => {
      setLoginError(err.message || "Invalid PIN");
    },
  });

  /* ── Data ── */
  const customers = trpc.customer.getAll.useQuery(undefined, {
    enabled: authed,
    retry: false,
  });

  /* ── Update step mutation ── */
  const updateStep = trpc.customer.updateStep.useMutation({
    onSuccess: () => customers.refetch(),
  });

  const handleLogin = () => {
    if (pin.length < 4) {
      setLoginError("PIN must be at least 4 digits");
      return;
    }
    loginMutation.mutate({ pin });
  };

  // Check for existing session
  const existingPin = typeof window !== "undefined" ? localStorage.getItem("gf-dealer-pin") : null;
  if (existingPin && !authed && !loginMutation.isPending) {
    // Auto-login with stored PIN — set state synchronously on first render won't work,
    // so we handle it via useEffect-like pattern below
  }

  /* ── Process data ── */
  const rawData: any[] = customers.data ?? [];
  const dataWithOverrides = rawData.map((c: any) =>
    stepOverrides[c.id] !== undefined ? { ...c, step: stepOverrides[c.id] } : c
  );

  const filtered = useMemo(() => {
    let list = dataWithOverrides;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((c: any) =>
        c.firstName?.toLowerCase().includes(q) || c.lastName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) || c.phone?.includes(q) ||
        (c.vehicleSpecific ?? "").toLowerCase().includes(q)
      );
    }
    if (filterPill === "retail") list = list.filter((c: any) => !c.isFleet);
    else if (filterPill === "fleet") list = list.filter((c: any) => c.isFleet);
    else if (filterPill === "paid") list = list.filter((c: any) => c.paid);
    else if (filterPill !== "all") {
      const stepMap: Record<string, number[]> = {
        new: [0, 1], working: [2], negotiating: [3, 4], closing: [5, 6], delivered: [7, 8],
      };
      const steps = stepMap[filterPill];
      if (steps) list = list.filter((c: any) => steps.includes(c.step));
    }
    return list;
  }, [dataWithOverrides, debouncedSearch, filterPill]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a: any, b: any) => {
      let cmp = 0;
      if (sortKey === "name") cmp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      else if (sortKey === "step") cmp = a.step - b.step;
      else if (sortKey === "days") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortKey === "email") cmp = (a.email || "").localeCompare(b.email || "");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  /* ── PIN Login Screen ── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-[#0f1d32] border border-white/10 rounded-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-amber flex items-center justify-center">
              <span className="text-navy font-bold text-3xl" style={{ fontFamily: "var(--font-display)" }}>G</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white text-center mb-1" style={{ fontFamily: "var(--font-display)" }}>
            GoFetch <span className="text-amber">CRM</span>
          </h3>
          <p className="text-sm text-white/40 text-center mb-8">Enter your PIN to access the dashboard.</p>
          <input
            type="password"
            placeholder="PIN"
            maxLength={10}
            value={pin}
            onChange={(e) => { setPin(e.target.value); setLoginError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-center text-lg tracking-[0.3em] focus:border-amber outline-none mb-4"
          />
          {loginError && <p className="text-red-400 text-sm text-center mb-3">{loginError}</p>}
          <button
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            className="w-full bg-amber text-navy font-bold py-3 rounded-lg hover:brightness-110 transition disabled:opacity-50"
          >
            {loginMutation.isPending ? "Authenticating..." : "Access Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  /* ── Computed values ── */
  const data = dataWithOverrides;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  /* ── Pipeline columns (6 grouped) ── */
  const pipelineCols = PIPELINE_COLS.map((col) => ({
    ...col,
    customers: filtered.filter((c: any) => col.steps.includes(c.step)),
    retailCount: filtered.filter((c: any) => col.steps.includes(c.step) && !c.isFleet).length,
    fleetCount: filtered.filter((c: any) => col.steps.includes(c.step) && c.isFleet).length,
  }));

  /* ── KPIs ── */
  const activeLeads = data.filter((c: any) => c.step >= 0 && c.step <= 2).length;
  const negotiating = data.filter((c: any) => c.step === 3 || c.step === 4).length;
  const pendingClose = data.filter((c: any) => c.step >= 5 && c.step <= 7).length;
  const deliveredThisMonth = data.filter((c: any) => {
    if (c.step !== 8) return false;
    const now = new Date();
    const created = new Date(c.updatedAt || c.createdAt);
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;
  const revenue = data.filter((c: any) => c.paid).reduce((sum: number, c: any) => {
    const amt = parseFloat(c.paidAmount || "0") || 499;
    return sum + amt;
  }, 0);

  /* ── Drag handlers ── */
  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>, colIdx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colIdx);
  };
  const handleDragLeave = () => setDragOverCol(null);
  const handleDrop = (e: DragEvent<HTMLDivElement>, colIdx: number) => {
    e.preventDefault();
    if (draggedId) {
      const targetStep = PIPELINE_COLS[colIdx].steps[0]; // Drop to first step of the group
      setStepOverrides((prev) => ({ ...prev, [draggedId]: targetStep }));
      updateStep.mutate({ id: draggedId, step: targetStep });
    }
    setDraggedId(null);
    setDragOverCol(null);
  };

  /* ── CSV Export ── */
  const exportCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Phone", "Vehicle", "Step", "Type", "Days Active", "Paid"];
    const rows = data.map((c: any) => [
      c.firstName, c.lastName, c.email, c.phone,
      c.vehicleSpecific || c.vehicleType || "",
      STEPS[c.step] || "", c.isFleet ? "Fleet" : "Retail",
      daysActive(c), c.paid ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gofetch-crm-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Filter pills ── */
  const pills: { key: FilterPill; label: string }[] = [
    { key: "all", label: "All" }, { key: "new", label: "New" }, { key: "working", label: "Working" },
    { key: "negotiating", label: "Negotiating" }, { key: "closing", label: "Closing" },
    { key: "delivered", label: "Delivered" }, { key: "paid", label: "Paid" },
    { key: "retail", label: "Retail" }, { key: "fleet", label: "Fleet" },
  ];

  const sortArrow = (key: SortKey) => sortKey === key ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : "";

  /* ── Recent activity ── */
  const recentActivity = data
    .slice()
    .sort((a: any, b: any) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 5);

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <div className="h-screen bg-navy text-white flex overflow-hidden">
      {/* ═══ SIDEBAR ═══ */}
      <aside className={`${sidebarCollapsed ? "w-[60px]" : "w-[240px]"} min-w-0 bg-[#0f1d32] border-r border-white/5 h-screen flex flex-col transition-all duration-200`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <img src="/logo-icon.jpeg" alt="GoFetch CRM" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              GoFetch <span className="text-amber">CRM</span>
            </span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto text-white/20 hover:text-white/50 text-xs transition"
          >
            {sidebarCollapsed ? "\u25B6" : "\u25C0"}
          </button>
        </div>

        {/* CRM Nav */}
        <div className="p-2 border-b border-white/5">
          {CRM_NAV.map((item) => (
            item.href ? (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition text-sm"
              >
                <span className="flex-shrink-0 w-5 text-center">{item.icon}</span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  if (item.id === "pipeline") setView("pipeline");
                  if (item.id === "dashboard") setView("analytics");
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition text-sm ${
                  activeNav === item.id
                    ? "bg-amber/10 text-amber"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <span className="flex-shrink-0 w-5 text-center">{item.icon}</span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            )
          ))}
        </div>

        {/* Pipeline stage counts */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-white/5 overflow-y-auto">
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Pipeline</p>
            <div className="space-y-1.5">
              {PIPELINE_COLS.map((col, i) => {
                const count = data.filter((c: any) => col.steps.includes(c.step)).length;
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full ${col.color}`} />
                    <span className="text-white/50 flex-1 truncate">{col.label}</span>
                    <span className="text-white/30 font-mono">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-white/5 space-y-2">
            <button onClick={() => setAddCustomerDrawer(true)} className="w-full bg-amber text-navy font-bold py-2 rounded-lg text-sm hover:brightness-110 transition">
              + Add Client
            </button>
            <button onClick={exportCSV} className="w-full border border-white/10 text-white/50 py-2 rounded-lg text-sm hover:text-white hover:border-white/20 transition">
              Export CSV
            </button>
          </div>
        )}

        {/* Focus List */}
        {!sidebarCollapsed && data.length > 0 && (
          <div className="p-4 border-b border-white/5 overflow-y-auto">
            <FocusList customers={data} onSelect={setSelectedCustomer} />
          </div>
        )}

        {/* AI Recommendations */}
        {!sidebarCollapsed && data.length > 0 && (
          <div className="p-4 flex-1 overflow-y-auto">
            <AIRecommendations customers={data} />
          </div>
        )}

        {/* Sign out */}
        <div className="p-4 border-t border-white/5 mt-auto">
          <button
            onClick={() => { setAuthed(false); setPin(""); localStorage.removeItem("gf-dealer-pin"); }}
            className="w-full text-white/30 text-xs hover:text-white transition py-1 flex items-center justify-center gap-1"
          >
            {!sidebarCollapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden">
        {/* ── Command Bar ── */}
        <div className="sticky top-0 z-30 bg-navy/95 backdrop-blur-sm border-b border-white/5 p-4 space-y-3">
          {/* KPI Cards */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Active Leads", value: activeLeads, accent: "border-l-blue-400" },
              { label: "Negotiating", value: negotiating, accent: "border-l-amber" },
              { label: "Pending Close", value: pendingClose, accent: "border-l-orange-400" },
              { label: "Delivered", value: deliveredThisMonth, accent: "border-l-green-400" },
              { label: "Revenue", value: `$${revenue.toLocaleString()}`, accent: "border-l-amber" },
            ].map((kpi) => (
              <div key={kpi.label} className={`bg-white/[0.03] border border-white/5 ${kpi.accent} border-l-[3px] rounded-xl p-3`}>
                <div className="text-xl font-bold text-white">{kpi.value}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider">{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Search + Filters + View Toggle */}
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search by name, email, phone, vehicle..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 focus:border-amber outline-none w-64"
            />

            <div className="flex gap-1 flex-1 overflow-x-auto min-w-0">
              {pills.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setFilterPill(p.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                    filterPill === p.key
                      ? "bg-amber text-navy"
                      : "bg-white/5 text-white/40 hover:text-white/60"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="flex bg-black/30 rounded-lg p-0.5 border border-white/5 flex-shrink-0">
              {(["pipeline", "table", "analytics"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => { setView(v); setActiveNav(v === "analytics" ? "dashboard" : "pipeline"); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition ${
                    view === v ? "bg-amber text-navy" : "text-white/40"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className="p-4">

          {/* ════════ PIPELINE VIEW (6-COLUMN KANBAN) ════════ */}
          {view === "pipeline" && (
            <div className="grid grid-cols-6 gap-3 min-h-[calc(100vh-200px)]">
              {pipelineCols.map((col, colIdx) => (
                <div
                  key={colIdx}
                  onDragOver={(e) => handleDragOver(e, colIdx)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, colIdx)}
                  className={`rounded-xl border p-3 flex flex-col transition-colors ${
                    dragOverCol === colIdx
                      ? "bg-amber/10 border-amber/40"
                      : "bg-white/[0.02] border-white/5"
                  }`}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${col.color}`} />
                      <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider truncate">{col.label}</span>
                    </div>
                    <span className="bg-white/10 text-white/60 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                      {col.customers.length}
                    </span>
                  </div>
                  {/* Retail/fleet split */}
                  {(col.retailCount > 0 || col.fleetCount > 0) && (
                    <div className="text-[9px] text-white/20 mb-2 flex-shrink-0">
                      {col.retailCount} retail &middot; {col.fleetCount} fleet
                    </div>
                  )}

                  {/* Cards */}
                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {col.customers.map((c: any) => (
                      <div
                        key={c.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, c.id)}
                        onClick={() => setSelectedCustomer(c)}
                        className={`rounded-lg p-2.5 cursor-grab active:cursor-grabbing hover:bg-white/[0.08] transition border bg-white/[0.04] ${
                          c.isFleet
                            ? "border-l-[3px] border-l-navy-800 border-t-white/5 border-r-white/5 border-b-white/5"
                            : "border-l-[3px] border-l-amber border-t-white/5 border-r-white/5 border-b-white/5"
                        } ${draggedId === c.id ? "opacity-40" : ""}`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            c.isFleet ? "bg-navy text-white border border-white/20" : "bg-amber/20 text-amber"
                          }`}>
                            {initials(c)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-white truncate">{c.firstName} {c.lastName}</p>
                          </div>
                          {/* Lead score badge */}
                          {c.leadScore != null && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${leadScoreColor(c.leadScore)}`}>
                              {c.leadScore}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-white/30 truncate mb-1.5">
                          {c.vehicleSpecific || c.vehicleType || "No vehicle"}
                        </p>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] text-white/20">{daysActive(c)}d</span>
                          <div className="flex items-center gap-1">
                            {c.isFleet ? (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-navy text-white/60 border border-white/10">FLEET</span>
                            ) : (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber/20 text-amber">RETAIL</span>
                            )}
                            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${STEP_COLORS[c.step]} text-navy`}>
                              {STEPS[c.step]}
                            </span>
                          </div>
                        </div>
                        {/* Stale indicator */}
                        {daysActive(c) >= 3 && c.step < 8 && (
                          <div className="mt-1.5 text-[9px] text-red-400/70 flex items-center gap-1">
                            <span>&#9888;</span> {daysActive(c)} days
                          </div>
                        )}
                      </div>
                    ))}
                    {col.customers.length === 0 && (
                      <div className="text-center py-8 text-white/10 text-xs">No clients</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ════════ TABLE VIEW ════════ */}
          {view === "table" && (
            <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left">
                    {([
                      { key: "name" as SortKey, label: "Name" },
                      { key: "vehicle" as SortKey, label: "Vehicle" },
                      { key: "step" as SortKey, label: "Step" },
                      { key: "type" as SortKey, label: "Type" },
                      { key: "days" as SortKey, label: "Days" },
                      { key: "phone" as SortKey, label: "Phone" },
                      { key: "email" as SortKey, label: "Email" },
                      { key: "payment" as SortKey, label: "Payment" },
                    ]).map((col) => (
                      <th
                        key={col.key}
                        onClick={() => toggleSort(col.key)}
                        className="p-3 text-xs text-white/30 font-semibold uppercase cursor-pointer hover:text-white/50 transition select-none"
                      >
                        {col.label}{sortArrow(col.key)}
                      </th>
                    ))}
                    <th className="p-3 text-xs text-white/30 font-semibold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((c: any) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            c.isFleet ? "bg-navy text-white border border-white/20" : "bg-amber/20 text-amber"
                          }`}>
                            {initials(c)}
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{c.firstName} {c.lastName}</p>
                            {c.leadScore != null && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${leadScoreColor(c.leadScore)}`}>
                                {c.leadScore}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-white/60 max-w-[180px] truncate">{c.vehicleSpecific || c.vehicleType || "\u2014"}</td>
                      <td className="p-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${STEP_COLORS[c.step]} text-navy`}>
                          {STEPS[c.step]}
                        </span>
                      </td>
                      <td className="p-3">
                        {c.isFleet ? (
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-navy text-white/60 border border-white/10">FLEET</span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber/20 text-amber">RETAIL</span>
                        )}
                      </td>
                      <td className="p-3 text-white/40">{daysActive(c)}d</td>
                      <td className="p-3 text-white/40">{c.phone}</td>
                      <td className="p-3 text-white/40 truncate max-w-[160px]">{c.email}</td>
                      <td className="p-3">
                        {c.paid ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Paid</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/30">Pending</span>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedCustomer(c); }}
                          className="text-xs text-amber hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sorted.length === 0 && (
                <div className="text-center py-12 text-white/20 text-sm">No customers match your filters.</div>
              )}
            </div>
          )}

          {/* ════════ ANALYTICS VIEW ════════ */}
          {view === "analytics" && (
            <div className="space-y-6">
              {/* Funnel + Metrics */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/[0.03] rounded-xl border border-white/5 p-6">
                  <h4 className="text-sm font-semibold text-white/60 mb-4">Pipeline Funnel</h4>
                  {PIPELINE_COLS.map((col, i) => {
                    const count = data.filter((c: any) => col.steps.includes(c.step)).length;
                    const pct = data.length ? (count / data.length) * 100 : 0;
                    return (
                      <div key={i} className="flex items-center gap-3 mb-2">
                        <span className="w-24 text-xs text-white/40 truncate">{col.label}</span>
                        <div className="flex-1 h-7 bg-white/5 rounded overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber to-amber/40 rounded flex items-center px-2 transition-all"
                            style={{ width: `${pct}%`, minWidth: count > 0 ? "30px" : "0" }}
                          >
                            <span className="text-xs font-bold text-navy">{count}</span>
                          </div>
                        </div>
                        <span className="text-xs text-white/20 w-10 text-right">{pct.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white/[0.03] rounded-xl border border-white/5 p-6">
                  <h4 className="text-sm font-semibold text-white/60 mb-4">Key Metrics</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between"><span className="text-white/40">Total Clients</span><span className="font-bold">{data.length}</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Conversion Rate</span><span className="font-bold text-green-400">{data.length > 0 ? Math.round((data.filter((c: any) => c.step === 8).length / data.length) * 100) : 0}%</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Avg Days Active</span><span className="font-bold">{data.length > 0 ? Math.round(data.reduce((sum: number, c: any) => sum + daysActive(c), 0) / data.length) : 0}d</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Fleet vs Retail</span><span className="font-bold">{data.filter((c: any) => c.isFleet).length} / {data.filter((c: any) => !c.isFleet).length}</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Paid Clients</span><span className="font-bold text-green-400">{data.filter((c: any) => c.paid).length}</span></div>
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-white/[0.03] rounded-xl border border-white/5 p-6">
                <h4 className="text-sm font-semibold text-white/60 mb-4">Revenue Summary</h4>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-3xl font-bold text-amber">${revenue.toLocaleString()}</p>
                    <p className="text-xs text-white/30 mt-1">Total Revenue (Paid)</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{negotiating}</p>
                    <p className="text-xs text-white/30 mt-1">In Negotiation</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-400">{pendingClose}</p>
                    <p className="text-xs text-white/30 mt-1">Pending Close</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/[0.03] rounded-xl border border-white/5 p-6">
                <h4 className="text-sm font-semibold text-white/60 mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  {recentActivity.map((c: any) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        c.isFleet ? "bg-navy text-white border border-white/20" : "bg-amber/20 text-amber"
                      }`}>
                        {initials(c)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-white/30">{c.vehicleSpecific || c.vehicleType || "No vehicle"} &middot; {STEPS[c.step]}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {c.isFleet ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-navy text-white/60 border border-white/10">FLEET</span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber/20 text-amber">RETAIL</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && <p className="text-xs text-white/20 text-center py-4">No activity yet.</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ═══ Detail Panel ═══ */}
      {selectedCustomer && (
        <DetailPanel customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}

      {/* ═══ Add Customer Drawer ═══ */}
      <AddCustomerDrawer open={addCustomerDrawer} onClose={() => setAddCustomerDrawer(false)} />
    </div>
  );
}
