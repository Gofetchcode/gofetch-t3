"use client";

import { useState, useMemo, useCallback, useRef, type DragEvent } from "react";
import { trpc } from "@/lib/trpc";
import { FocusList } from "@/components/focus-list";
import { FocusActions } from "@/components/next-best-action";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { OnboardingTour } from "@/components/onboarding-tour";
import { DeskingTool } from "@/components/desking-tool";
import { OutreachPanel } from "@/components/outreach-panel";
import { DealerResponses } from "@/components/dealer-responses";
import { MeetingPrep } from "@/components/meeting-prep";
import { CompetitiveIntel } from "@/components/competitive-intel";
import { ReferralTracker } from "@/components/referral-tracker";
import { getScoreBadge, calculateDealHealth } from "@/lib/ai-engine";

const STEPS = [
  "Consultation", "Lead Received", "Researching", "Negotiating",
  "Client Approval", "Deal Agreed", "Paperwork", "Delivery", "Delivered",
];

const STEP_COLORS = [
  "bg-gray-200", "bg-blue-200", "bg-blue-300", "bg-amber/30",
  "bg-amber/50", "bg-amber", "bg-green-200", "bg-green-300", "bg-green-500",
];

/* ─────────────────────── Detail Panel ─────────────────────── */

function DetailPanel({ customer, onClose }: { customer: any; onClose: () => void }) {
  const [detailTab, setDetailTab] = useState<string>("overview");
  const [newNote, setNewNote] = useState("");

  const detailTabs = [
    { id: "overview", label: "Overview" },
    { id: "notes", label: "Notes" },
    { id: "messages", label: "Messages" },
    { id: "documents", label: "Docs" },
    { id: "offers", label: "Offers" },
    { id: "outreach", label: "🔍 Find Car" },
    { id: "intel", label: "Intel" },
    { id: "prep", label: "Prep" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="bg-black/50 absolute inset-0" />
      <div className="relative w-full max-w-xl bg-navy-light border-l border-white/10 h-full overflow-y-auto animate-slide-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-navy-light border-b border-white/5 p-4 z-10">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-lg font-bold text-white">{customer.firstName} {customer.lastName}</h3>
              <p className="text-xs text-amber">{customer.gofetchClientId || "No ID"}</p>
            </div>
            <button onClick={onClose} className="text-white/30 hover:text-white text-xl p-1">&times;</button>
          </div>
          <div className="flex gap-1 bg-black/30 rounded-lg p-0.5">
            {detailTabs.map((t) => (
              <button key={t.id} onClick={() => setDetailTab(t.id)} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${detailTab === t.id ? "bg-amber text-navy" : "text-white/40 hover:text-white/60"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {/* OVERVIEW TAB */}
          {detailTab === "overview" && (
            <div className="space-y-4">
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
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${STEP_COLORS[customer.step]} text-navy`}>{STEPS[customer.step]}</span>
                  <span className="text-xs text-white/20">Step {customer.step + 1}/9</span>
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
                <span>Fleet: {customer.isFleet ? "Yes" : "No"}</span>
                <span>|</span>
                <span>Paid: {customer.paid ? "Yes" : "No"}</span>
              </div>
            </div>
          )}

          {/* NOTES TAB */}
          {detailTab === "notes" && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber outline-none" />
                <button onClick={() => setNewNote("")} className="bg-amber text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-light transition">Add</button>
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
                    <div className={`max-w-xs rounded-xl px-3 py-2 text-sm ${m.sender === "customer" ? "bg-amber text-navy" : m.sender === "system" ? "bg-blue-500/20 text-blue-300" : "bg-white/10 text-white/70"}`}>
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
                    <span className={`text-xs px-2 py-0.5 rounded-full ${d.status === "approved" ? "bg-green-500/20 text-green-400" : d.status === "under_review" ? "bg-amber/20 text-amber" : "bg-white/10 text-white/40"}`}>{d.status}</span>
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
                      <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === "accepted" ? "bg-green-500/20 text-green-400" : o.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-amber/20 text-amber"}`}>{o.status}</span>
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

          {/* OUTREACH / FIND THIS CAR TAB */}
          {detailTab === "outreach" && (
            <div className="space-y-4">
              <OutreachPanel customerId={customer.id} customerName={`${customer.firstName} ${customer.lastName}`} vehicleDesc={customer.vehicleSpecific} onClose={() => setDetailTab("overview")} />
              <DealerResponses campaignId="" vehicle={customer.vehicleSpecific || "Vehicle"} dealersSent={23} />
            </div>
          )}

          {/* COMPETITIVE INTEL TAB */}
          {detailTab === "intel" && (
            <div className="space-y-4">
              <CompetitiveIntel vehicle={customer.vehicleSpecific || "Vehicle"} ourPrice={33800} marketAvg={36200} msrp={38500} />
              <ReferralTracker customerName={`${customer.firstName} ${customer.lastName}`} referralCode={customer.gofetchClientId || "GF-0000"} referrals={[]} ltv={customer.paidAmount || "$0"} />
            </div>
          )}

          {/* MEETING PREP TAB */}
          {detailTab === "prep" && (
            <MeetingPrep customer={customer} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Add Customer Drawer ──────────────────── */

function AddCustomerDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isFleet, setIsFleet] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    vehicleType: "", budget: "", step: 0,
    companyName: "", employeeName: "", fleetOrderNumber: "",
  });

  const set = (key: string, val: string | number) => setForm((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    // Mock save
    onClose();
    setForm({ firstName: "", lastName: "", email: "", phone: "", vehicleType: "", budget: "", step: 0, companyName: "", employeeName: "", fleetOrderNumber: "" });
    setIsFleet(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="bg-black/50 absolute inset-0" />
      <div
        className="relative w-full max-w-md bg-[#0f1d32] border-l border-white/10 h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#0f1d32] border-b border-white/5 p-4 z-10 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Add Client</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white text-xl">&times;</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Retail / Fleet toggle */}
          <div className="flex bg-black/30 rounded-lg p-0.5 border border-white/5">
            <button
              onClick={() => setIsFleet(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${!isFleet ? "bg-[#D4A23A] text-[#0A1628]" : "text-white/40"}`}
            >
              Retail
            </button>
            <button
              onClick={() => setIsFleet(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${isFleet ? "bg-[#0A1628] text-white border border-white/20" : "text-white/40"}`}
            >
              Fleet
            </button>
          </div>

          <input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="First Name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#D4A23A] outline-none" />
          <input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Last Name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#D4A23A] outline-none" />
          <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Email" type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#D4A23A] outline-none" />
          <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#D4A23A] outline-none" />
          <input value={form.vehicleType} onChange={(e) => set("vehicleType", e.target.value)} placeholder="Vehicle Type" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#D4A23A] outline-none" />
          <input value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="Budget" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#D4A23A] outline-none" />

          <select
            value={form.step}
            onChange={(e) => set("step", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#D4A23A] outline-none"
          >
            {STEPS.map((s, i) => (
              <option key={i} value={i} className="bg-[#0A1628] text-white">{s}</option>
            ))}
          </select>

          {isFleet && (
            <>
              <div className="border-t border-white/5 pt-4">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Fleet Details</p>
              </div>
              <input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Company Name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#D4A23A] outline-none" />
              <input value={form.employeeName} onChange={(e) => set("employeeName", e.target.value)} placeholder="Employee Name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#D4A23A] outline-none" />
              <input value={form.fleetOrderNumber} onChange={(e) => set("fleetOrderNumber", e.target.value)} placeholder="Fleet Order #" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#D4A23A] outline-none" />
            </>
          )}

          <button onClick={handleSave} className="w-full bg-[#D4A23A] text-[#0A1628] font-bold py-3 rounded-lg hover:brightness-110 transition mt-2">
            Save Client
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Main Page ─────────────────────────── */

type ViewMode = "pipeline" | "table" | "analytics";
type FilterPill = "all" | "new" | "working" | "negotiating" | "closing" | "delivered" | "paid" | "retail" | "fleet";
type SortKey = "name" | "vehicle" | "step" | "type" | "days" | "phone" | "email" | "payment";
type SortDir = "asc" | "desc";

export default function DealerPage() {
  /* ── Auth state ── */
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  /* ── UI state ── */
  const [view, setView] = useState<ViewMode>("pipeline");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [addCustomerDrawer, setAddCustomerDrawer] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterPill, setFilterPill] = useState<FilterPill>("all");
  const [workspace, setWorkspace] = useState("manager");
  const [showDesking, setShowDesking] = useState<any>(null);
  const [showOutreach, setShowOutreach] = useState<any>(null);
  const [showResponses, setShowResponses] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  /* ── Drag state ── */
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStep, setDragOverStep] = useState<number | null>(null);

  /* ── Local step overrides (from drag-and-drop) ── */
  const [stepOverrides, setStepOverrides] = useState<Record<string, number>>({});

  /* ── Debounced search ── */
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 300);
  }, []);

  /* ── Data ── */
  const customers = trpc.customer.getAll.useQuery(undefined, { enabled: authed, retry: false });

  const handleLogin = () => {
    if (pin.length >= 4) {
      localStorage.setItem("gf-dealer-pin", pin);
      setAuthed(true);
      // Force tRPC to refetch with new headers
      setTimeout(() => customers.refetch(), 100);
    } else {
      setError("PIN must be at least 4 digits");
    }
  };

  /* ── PIN Login Screen ── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-[#0f1d32] border border-white/10 rounded-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#D4A23A] flex items-center justify-center">
              <span className="text-[#0A1628] font-bold text-2xl" style={{ fontFamily: "var(--font-display)" }}>G</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white text-center mb-1">Dealer CRM</h3>
          <p className="text-sm text-white/40 text-center mb-8">Enter your PIN to access the dashboard.</p>
          <input
            type="password"
            placeholder="PIN"
            maxLength={10}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-center text-lg tracking-[0.3em] focus:border-[#D4A23A] outline-none mb-4"
          />
          {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}
          <button onClick={handleLogin} className="w-full bg-[#D4A23A] text-[#0A1628] font-bold py-3 rounded-lg hover:brightness-110 transition">
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ── Resolve data with step overrides ── */
  const rawData: any[] = customers.data ?? [];
  const data = rawData.map((c: any) => (stepOverrides[c.id] !== undefined ? { ...c, step: stepOverrides[c.id] } : c));

  /* ── Helpers ── */
  const daysActive = (c: any) => Math.max(0, Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86400000));

  /* ── Filtering ── */
  const filtered = useMemo(() => {
    let list = data;

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((c: any) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.vehicleSpecific ?? "").toLowerCase().includes(q) ||
        (c.vehicleType ?? "").toLowerCase().includes(q)
      );
    }

    // Pill filter
    switch (filterPill) {
      case "new": list = list.filter((c: any) => c.step === 0 || c.step === 1); break;
      case "working": list = list.filter((c: any) => c.step === 2); break;
      case "negotiating": list = list.filter((c: any) => c.step === 3); break;
      case "closing": list = list.filter((c: any) => c.step >= 4 && c.step <= 6); break;
      case "delivered": list = list.filter((c: any) => c.step === 7 || c.step === 8); break;
      case "paid": list = list.filter((c: any) => c.paid); break;
      case "retail": list = list.filter((c: any) => !c.isFleet); break;
      case "fleet": list = list.filter((c: any) => c.isFleet); break;
    }

    return list;
  }, [data, debouncedSearch, filterPill]);

  /* ── Sorting (for table) ── */
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a: any, b: any) => {
      switch (sortKey) {
        case "name": return dir * (`${a.firstName} ${a.lastName}`).localeCompare(`${b.firstName} ${b.lastName}`);
        case "vehicle": return dir * ((a.vehicleSpecific || a.vehicleType || "").localeCompare(b.vehicleSpecific || b.vehicleType || ""));
        case "step": return dir * (a.step - b.step);
        case "type": return dir * ((a.isFleet ? 1 : 0) - (b.isFleet ? 1 : 0));
        case "days": return dir * (daysActive(a) - daysActive(b));
        case "phone": return dir * (a.phone.localeCompare(b.phone));
        case "email": return dir * (a.email.localeCompare(b.email));
        case "payment": return dir * ((a.paid ? 1 : 0) - (b.paid ? 1 : 0));
        default: return 0;
      }
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  /* ── Pipeline columns ── */
  const byStep = STEPS.map((name, i) => ({
    name,
    index: i,
    customers: filtered.filter((c: any) => c.step === i),
  }));

  /* ── KPIs ── */
  const activeLeads = data.filter((c: any) => c.step >= 0 && c.step <= 2).length;
  const negotiating = data.filter((c: any) => c.step === 3).length;
  const pendingClose = data.filter((c: any) => c.step >= 4 && c.step <= 7).length;
  const deliveredThisMonth = data.filter((c: any) => {
    if (c.step !== 8) return false;
    const now = new Date();
    const created = new Date(c.createdAt);
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;
  const revenue = data.filter((c: any) => c.step === 8).length * 499;

  /* ── Drag handlers ── */
  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>, stepIdx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStep(stepIdx);
  };
  const handleDragLeave = () => {
    setDragOverStep(null);
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>, stepIdx: number) => {
    e.preventDefault();
    if (draggedId) {
      setStepOverrides((prev) => ({ ...prev, [draggedId]: stepIdx }));
    }
    setDraggedId(null);
    setDragOverStep(null);
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

  /* ── Recent activity (mock from data) ── */
  const recentActivity = data
    .slice()
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  /* ── Initials helper ── */
  const initials = (c: any) => `${(c.firstName?.[0] ?? "").toUpperCase()}${(c.lastName?.[0] ?? "").toUpperCase()}`;

  /* ── Filter pills config ── */
  const pills: { key: FilterPill; label: string }[] = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "working", label: "Working" },
    { key: "negotiating", label: "Negotiating" },
    { key: "closing", label: "Closing" },
    { key: "delivered", label: "Delivered" },
    { key: "paid", label: "Paid" },
    { key: "retail", label: "Retail Only" },
    { key: "fleet", label: "Fleet Only" },
  ];

  const sortArrow = (key: SortKey) => sortKey === key ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : "";

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="min-h-screen bg-[#0A1628] text-white flex">
      {/* ── Sidebar ── */}
      <aside className="w-[240px] min-w-[240px] bg-[#0f1d32] border-r border-white/5 h-screen sticky top-0 flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4A23A] flex items-center justify-center">
              <span className="text-[#0A1628] font-bold text-sm">G</span>
            </div>
            <span className="text-sm font-bold text-white">GoFetch <span className="text-[#D4A23A]">CRM</span></span>
          </div>
          <div className="mt-2">
            <WorkspaceSwitcher current={workspace} onChange={setWorkspace} />
          </div>
        </div>

        {/* Pipeline stage counts */}
        <div className="p-4 border-b border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Pipeline</p>
          <div className="space-y-1.5">
            {STEPS.map((step, i) => {
              const count = data.filter((c: any) => c.step === i).length;
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${STEP_COLORS[i]}`} />
                  <span className="text-white/50 flex-1 truncate">{step}</span>
                  <span className="text-white/30 font-mono">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-b border-white/5 space-y-2">
          <button
            onClick={() => setAddCustomerDrawer(true)}
            className="w-full bg-[#D4A23A] text-[#0A1628] font-bold py-2 rounded-lg text-sm hover:brightness-110 transition"
          >
            + Add Client
          </button>
          <button
            onClick={exportCSV}
            className="w-full border border-white/10 text-white/50 py-2 rounded-lg text-sm hover:text-white hover:border-white/20 transition"
          >
            Export CSV
          </button>
        </div>

        {/* Recent activity */}
        <div className="p-4 flex-1">
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Recent Activity</p>
          <div className="space-y-2">
            {recentActivity.map((c: any) => (
              <div
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${c.isFleet ? "bg-[#0A1628] text-white border border-white/20" : "bg-[#D4A23A]/20 text-[#D4A23A]"}`}>
                  {initials(c)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/60 truncate">{c.firstName} {c.lastName}</p>
                  <p className="text-[10px] text-white/20">{STEPS[c.step]}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-xs text-white/20">No activity yet.</p>}
          </div>
        </div>

        {/* Sign out */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => { setAuthed(false); setPin(""); }}
            className="w-full text-white/30 text-xs hover:text-white transition py-1"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        {/* ── Command Bar ── */}
        <div className="sticky top-0 z-30 bg-[#0A1628]/95 backdrop-blur-sm border-b border-white/5 p-4 space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Active Leads", value: activeLeads, accent: "border-l-blue-400" },
              { label: "Negotiating", value: negotiating, accent: "border-l-yellow-400" },
              { label: "Pending Close", value: pendingClose, accent: "border-l-orange-400" },
              { label: "Delivered", value: deliveredThisMonth, accent: "border-l-green-400" },
              { label: "Revenue", value: `$${revenue.toLocaleString()}`, accent: "border-l-[#D4A23A]" },
            ].map((kpi) => (
              <div key={kpi.label} className={`bg-white/[0.03] border border-white/5 ${kpi.accent} border-l-[3px] rounded-xl p-3`}>
                <div className="text-xl font-bold text-white">{kpi.value}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider">{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Search + Filters + View Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by name, email, phone, vehicle..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 focus:border-[#D4A23A] outline-none w-72"
            />

            <div className="flex gap-1 flex-1 overflow-x-auto">
              {pills.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setFilterPill(p.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                    filterPill === p.key
                      ? "bg-[#D4A23A] text-[#0A1628]"
                      : "bg-white/5 text-white/40 hover:text-white/60"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Focus List + AI Recommendations */}
            <FocusList customers={data} onSelect={(id) => setSelectedCustomer(data.find((c: any) => c.id === id))} />
            <FocusActions customers={data} />

            {/* View toggle */}
            <div className="flex bg-black/30 rounded-lg p-0.5 border border-white/5">
              {(["pipeline", "table", "analytics"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition ${
                    view === v ? "bg-[#D4A23A] text-[#0A1628]" : "text-white/40"
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

          {/* ════════ PIPELINE VIEW (KANBAN) ════════ */}
          {view === "pipeline" && (
            <div className="flex gap-3 overflow-x-auto pb-4">
              {byStep.map((col) => (
                <div
                  key={col.index}
                  onDragOver={(e) => handleDragOver(e, col.index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.index)}
                  className={`min-w-[220px] w-[220px] flex-shrink-0 rounded-xl border p-3 transition-colors ${
                    dragOverStep === col.index
                      ? "bg-[#D4A23A]/10 border-[#D4A23A]/40"
                      : "bg-white/[0.02] border-white/5"
                  }`}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider truncate">{col.name}</span>
                    <span className="bg-white/10 text-white/60 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                      {col.customers.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2">
                    {col.customers.map((c: any) => (
                      <div
                        key={c.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, c.id)}
                        onClick={() => setSelectedCustomer(c)}
                        className={`rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-white/[0.08] transition border border-white/5 bg-white/[0.04] ${
                          c.isFleet ? "border-l-[3px] border-l-[#0A1628]" : "border-l-[3px] border-l-[#D4A23A]"
                        } ${draggedId === c.id ? "opacity-40" : ""}`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            c.isFleet ? "bg-[#0A1628] text-white border border-white/20" : "bg-[#D4A23A]/20 text-[#D4A23A]"
                          }`}>
                            {initials(c)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-white truncate">{c.firstName} {c.lastName}</p>
                          </div>
                        </div>
                        <p className="text-[11px] text-white/30 truncate mb-1">{c.vehicleSpecific || c.vehicleType || "No vehicle"}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/20">{daysActive(c)}d active</span>
                          <div className="flex items-center gap-1">
                            {c.isFleet && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#0A1628] text-white/60 border border-white/10">FLEET</span>
                            )}
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${STEP_COLORS[c.step]} text-[#0A1628]`}>
                              {STEPS[c.step]}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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
                            c.isFleet ? "bg-[#0A1628] text-white border border-white/20" : "bg-[#D4A23A]/20 text-[#D4A23A]"
                          }`}>
                            {initials(c)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{c.firstName} {c.lastName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-white/60">{c.vehicleSpecific || c.vehicleType || "\u2014"}</td>
                      <td className="p-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${STEP_COLORS[c.step]} text-[#0A1628]`}>
                          {STEPS[c.step]}
                        </span>
                      </td>
                      <td className="p-3">
                        {c.isFleet ? (
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#0A1628] text-white/60 border border-white/10">FLEET</span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#D4A23A]/20 text-[#D4A23A]">RETAIL</span>
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
                          className="text-xs text-[#D4A23A] hover:underline"
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
                  {byStep.map((s) => {
                    const pct = data.length ? (s.customers.length / data.length) * 100 : 0;
                    return (
                      <div key={s.index} className="flex items-center gap-3 mb-2">
                        <span className="w-28 text-xs text-white/40 truncate">{s.name}</span>
                        <div className="flex-1 h-7 bg-white/5 rounded overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#D4A23A] to-[#D4A23A]/40 rounded flex items-center px-2 transition-all"
                            style={{ width: `${pct}%`, minWidth: s.customers.length > 0 ? "30px" : "0" }}
                          >
                            <span className="text-xs font-bold text-[#0A1628]">{s.customers.length}</span>
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
                    <p className="text-3xl font-bold text-[#D4A23A]">${revenue.toLocaleString()}</p>
                    <p className="text-xs text-white/30 mt-1">Total Revenue (Delivered)</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">${(negotiating * 499).toLocaleString()}</p>
                    <p className="text-xs text-white/30 mt-1">In Negotiation</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-400">${(pendingClose * 499).toLocaleString()}</p>
                    <p className="text-xs text-white/30 mt-1">Pending Close</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Detail Panel ── */}
      {selectedCustomer && (
        <DetailPanel customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}

      {/* ── Add Customer Drawer ── */}
      <AddCustomerDrawer open={addCustomerDrawer} onClose={() => setAddCustomerDrawer(false)} />

      {/* ── Onboarding Tour ── */}
      <OnboardingTour />
    </div>
  );
}
