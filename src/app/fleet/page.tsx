"use client";

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";

const STEPS = [
  "Consultation", "Lead Received", "Researching", "Negotiating",
  "Client Approval", "Deal Agreed", "Paperwork", "Delivery", "Delivered",
];

export default function FleetPage() {
  /* ── Auth state ── */
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [companyName, setCompanyName] = useState("");

  /* ── UI state ── */
  const [tab, setTab] = useState<"dashboard" | "orders" | "new">("dashboard");

  /* ── New order form ── */
  const [orderForm, setOrderForm] = useState({
    companyName: "", contactName: "", contactEmail: "", contactPhone: "",
    vehicleCount: 1, vehicleType: "Work Trucks (Half-Ton)",
    budgetPerVehicle: "$35,000 - $50,000", timeline: "1 Month", notes: "",
  });

  /* ── Login mutation ── */
  const loginMutation = trpc.fleet.login.useMutation({
    onSuccess: (data) => {
      setAuthed(true);
      setCompanyName(data.company.name);
      setLoginError("");
      // Pre-fill the new order form with company info
      setOrderForm((prev) => ({
        ...prev,
        companyName: data.company.name,
        contactName: data.company.contactName,
        contactEmail: data.company.contactEmail,
        contactPhone: data.company.contactPhone,
      }));
    },
    onError: (err) => {
      setLoginError(err.message || "Invalid credentials");
    },
  });

  /* ── Data queries (only when authed) ── */
  const dashboard = trpc.fleet.getDashboard.useQuery(
    { companyName: companyName || undefined },
    { enabled: authed && !!companyName, retry: false }
  );

  /* ── Submit order mutation ── */
  const submitOrder = trpc.fleet.submitOrder.useMutation({
    onSuccess: () => {
      setTab("orders");
      dashboard.refetch();
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      setLoginError("Please enter email and password");
      return;
    }
    loginMutation.mutate({ email, password });
  };

  /* ── Computed dashboard data ── */
  const customers = dashboard.data?.customers ?? [];
  const totalVehicles = customers.length;
  const activeOrders = dashboard.data?.active ?? 0;
  const deliveredOrders = dashboard.data?.delivered ?? 0;
  const totalSavings = customers.reduce((sum, c: any) => {
    const paid = parseFloat(c.paidAmount || "0");
    return sum + (paid > 0 ? Math.round(paid * 0.12) : 0); // estimate ~12% savings
  }, 0);

  const daysActive = (c: any) =>
    Math.max(0, Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86400000));

  /* ── Status grouping for dashboard ── */
  const statusGroups = useMemo(() => {
    const groups = { active: [] as any[], negotiating: [] as any[], delivered: [] as any[] };
    customers.forEach((c: any) => {
      if (c.step === 8) groups.delivered.push(c);
      else if (c.step >= 3 && c.step <= 6) groups.negotiating.push(c);
      else groups.active.push(c);
    });
    return groups;
  }, [customers]);

  /* ══════════════ LOGIN SCREEN ══════════════ */
  if (!authed) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-sm bg-[#0f1d32] border border-white/10 rounded-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-amber flex items-center justify-center">
              <span className="text-navy font-bold text-3xl" style={{ fontFamily: "var(--font-display)" }}>G</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white text-center mb-1" style={{ fontFamily: "var(--font-display)" }}>
            GoFetch <span className="text-amber">Fleet</span>
          </h3>
          <p className="text-sm text-white/40 text-center mb-8">Sign in to manage your fleet orders.</p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Company email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
            />
            {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
            <button
              onClick={handleLogin}
              disabled={loginMutation.isPending}
              className="w-full bg-amber text-navy font-bold py-3 rounded-lg hover:brightness-110 transition disabled:opacity-50"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </button>
          </div>
          <p className="text-xs text-white/20 text-center mt-6">
            New to fleet? Contact us at fleet@gofetchauto.com
          </p>
        </div>
      </div>
    );
  }

  /* ══════════════ AUTHENTICATED DASHBOARD ══════════════ */
  return (
    <div className="min-h-screen bg-navy text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Fleet <span className="text-amber">Portal</span>
            </h2>
            <p className="text-sm text-white/30">Welcome back, {companyName}</p>
          </div>
          <button
            onClick={() => { setAuthed(false); setEmail(""); setPassword(""); setCompanyName(""); }}
            className="border border-white/10 px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white transition"
          >
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Orders", value: String(activeOrders), color: "text-blue-400" },
            { label: "Total Vehicles", value: String(totalVehicles), color: "text-white" },
            { label: "Delivered", value: String(deliveredOrders), color: "text-green-400" },
            { label: "Total Savings", value: totalSavings > 0 ? `$${totalSavings.toLocaleString()}` : "Calculating...", color: "text-amber" },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-white/30 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-black/30 rounded-xl p-1 mb-6 border border-white/5">
          {(["dashboard", "orders", "new"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition ${
                tab === t ? "bg-amber text-navy shadow-md" : "text-white/40 hover:text-white/60"
              }`}
            >
              {t === "new" ? "New Order" : t}
            </button>
          ))}
        </div>

        {/* ════════ DASHBOARD TAB ════════ */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            {/* Pipeline overview */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Fleet Pipeline</h3>
              {dashboard.isLoading ? (
                <div className="text-center py-8 text-white/30 text-sm">Loading fleet data...</div>
              ) : customers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/30 mb-4">No fleet orders yet.</p>
                  <button onClick={() => setTab("new")} className="bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:brightness-110 transition">
                    Submit Your First Order
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">Active</p>
                    <p className="text-2xl font-bold text-blue-400">{statusGroups.active.length}</p>
                    <div className="mt-2 space-y-1">
                      {statusGroups.active.slice(0, 3).map((c: any) => (
                        <p key={c.id} className="text-xs text-white/40 truncate">
                          {c.firstName} {c.lastName} &mdash; {c.vehicleSpecific || c.vehicleType || "Vehicle TBD"}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="bg-amber/10 border border-amber/20 rounded-lg p-4">
                    <p className="text-xs text-amber uppercase tracking-wider mb-1">Negotiating</p>
                    <p className="text-2xl font-bold text-amber">{statusGroups.negotiating.length}</p>
                    <div className="mt-2 space-y-1">
                      {statusGroups.negotiating.slice(0, 3).map((c: any) => (
                        <p key={c.id} className="text-xs text-white/40 truncate">
                          {c.firstName} {c.lastName} &mdash; {STEPS[c.step]}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <p className="text-xs text-green-400 uppercase tracking-wider mb-1">Delivered</p>
                    <p className="text-2xl font-bold text-green-400">{statusGroups.delivered.length}</p>
                    <div className="mt-2 space-y-1">
                      {statusGroups.delivered.slice(0, 3).map((c: any) => (
                        <p key={c.id} className="text-xs text-white/40 truncate">
                          {c.firstName} {c.lastName} &mdash; {c.vehicleSpecific || "Delivered"}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Analytics summary */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Fleet Analytics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] rounded-lg p-4">
                  <p className="text-xs text-white/30 uppercase">Total Fleet Vehicles</p>
                  <p className="text-xl font-bold text-white">{totalVehicles}</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-4">
                  <p className="text-xs text-white/30 uppercase">Avg Days per Order</p>
                  <p className="text-xl font-bold text-amber">
                    {customers.length > 0
                      ? Math.round(customers.reduce((sum: number, c: any) => sum + daysActive(c), 0) / customers.length)
                      : 0}d
                  </p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-4">
                  <p className="text-xs text-white/30 uppercase">Delivery Rate</p>
                  <p className="text-xl font-bold text-green-400">
                    {customers.length > 0 ? Math.round((deliveredOrders / customers.length) * 100) : 0}%
                  </p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-4">
                  <p className="text-xs text-white/30 uppercase">Company</p>
                  <p className="text-xl font-bold text-white truncate">{companyName}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════ ORDERS TAB ════════ */}
        {tab === "orders" && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
            {dashboard.isLoading ? (
              <div className="text-center py-12 text-white/30 text-sm">Loading orders...</div>
            ) : customers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/30 mb-4">No fleet orders yet.</p>
                <button onClick={() => setTab("new")} className="bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:brightness-110 transition">
                  Submit Your First Order
                </button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-4 text-left text-xs text-white/30 font-semibold uppercase">Client</th>
                    <th className="p-4 text-left text-xs text-white/30 font-semibold uppercase">Vehicle</th>
                    <th className="p-4 text-left text-xs text-white/30 font-semibold uppercase">Status</th>
                    <th className="p-4 text-left text-xs text-white/30 font-semibold uppercase">Budget</th>
                    <th className="p-4 text-left text-xs text-white/30 font-semibold uppercase">Days</th>
                    <th className="p-4 text-left text-xs text-white/30 font-semibold uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c: any) => (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-navy border border-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                            {(c.firstName?.[0] || "").toUpperCase()}{(c.lastName?.[0] || "").toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">{c.firstName} {c.lastName}</p>
                            <p className="text-[10px] text-white/30">{c.gofetchClientId || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white/60">{c.vehicleSpecific || c.vehicleType || "\u2014"}</td>
                      <td className="p-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          c.step === 8 ? "bg-green-500/20 text-green-400" :
                          c.step >= 3 ? "bg-amber/20 text-amber" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                          {STEPS[c.step]}
                        </span>
                      </td>
                      <td className="p-4 text-white/40">{c.budget || "\u2014"}</td>
                      <td className="p-4 text-white/40">{daysActive(c)}d</td>
                      <td className="p-4 text-white/40">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ════════ NEW ORDER TAB ════════ */}
        {tab === "new" && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
            {submitOrder.isSuccess ? (
              <div className="text-center py-8">
                <p className="text-5xl mb-4">&#9989;</p>
                <h3 className="text-xl font-bold text-white mb-2">Order Submitted!</h3>
                <p className="text-white/40 mb-6">Our fleet team will reach out within 24 hours.</p>
                <button
                  onClick={() => { submitOrder.reset(); setTab("orders"); }}
                  className="bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:brightness-110 transition"
                >
                  View Orders
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-white mb-6">New Fleet Order</h3>
                <div className="space-y-4">
                  {/* Company info - pre-filled from login */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Company Name</label>
                      <input
                        value={orderForm.companyName}
                        onChange={(e) => setOrderForm((p) => ({ ...p, companyName: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Contact Name</label>
                      <input
                        value={orderForm.contactName}
                        onChange={(e) => setOrderForm((p) => ({ ...p, contactName: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Contact Email</label>
                      <input
                        value={orderForm.contactEmail}
                        onChange={(e) => setOrderForm((p) => ({ ...p, contactEmail: e.target.value }))}
                        type="email"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Contact Phone</label>
                      <input
                        value={orderForm.contactPhone}
                        onChange={(e) => setOrderForm((p) => ({ ...p, contactPhone: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Number of Vehicles</label>
                      <select
                        value={orderForm.vehicleCount}
                        onChange={(e) => setOrderForm((p) => ({ ...p, vehicleCount: Number(e.target.value) }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50].map((n) => (
                          <option key={n} value={n} className="bg-navy text-white">{n} vehicle{n > 1 ? "s" : ""}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Vehicle Type</label>
                      <select
                        value={orderForm.vehicleType}
                        onChange={(e) => setOrderForm((p) => ({ ...p, vehicleType: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                      >
                        {[
                          "Work Trucks (Half-Ton)", "Work Trucks (Heavy-Duty)", "Cargo Vans",
                          "Passenger Vans", "Fleet Sedans / SUVs", "Specialty / Chassis Cab", "Mixed Fleet",
                        ].map((t) => (
                          <option key={t} value={t} className="bg-navy text-white">{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Budget per Vehicle</label>
                      <select
                        value={orderForm.budgetPerVehicle}
                        onChange={(e) => setOrderForm((p) => ({ ...p, budgetPerVehicle: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                      >
                        {["Under $35,000", "$35,000 - $50,000", "$50,000 - $75,000", "$75,000 - $100,000", "$100,000+"].map((b) => (
                          <option key={b} value={b} className="bg-navy text-white">{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Timeline</label>
                      <select
                        value={orderForm.timeline}
                        onChange={(e) => setOrderForm((p) => ({ ...p, timeline: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none"
                      >
                        {["ASAP", "1-2 Weeks", "1 Month", "This Quarter"].map((t) => (
                          <option key={t} value={t} className="bg-navy text-white">{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Special Requirements</label>
                    <textarea
                      placeholder="Upfitting, branding, specific models, color preferences..."
                      rows={3}
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm((p) => ({ ...p, notes: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none resize-none"
                    />
                  </div>
                  {submitOrder.isError && (
                    <p className="text-red-400 text-sm">{submitOrder.error.message}</p>
                  )}
                  <button
                    onClick={() => {
                      if (!orderForm.companyName || !orderForm.contactName || !orderForm.contactEmail || !orderForm.contactPhone) return;
                      submitOrder.mutate(orderForm);
                    }}
                    disabled={submitOrder.isPending}
                    className="w-full bg-amber text-navy font-bold py-4 rounded-lg hover:brightness-110 transition text-lg disabled:opacity-50"
                  >
                    {submitOrder.isPending ? "Submitting..." : "Submit Fleet Order"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
