"use client";

import { useState } from "react";

export default function FleetPage() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"dashboard" | "orders" | "new">("dashboard");
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  if (!authed) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-sm bg-navy-light border border-white/10 rounded-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber flex items-center justify-center">
              <span className="text-navy font-bold text-2xl" style={{ fontFamily: "var(--font-display)" }}>G</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white text-center mb-1">Fleet Portal</h3>
          <p className="text-sm text-white/40 text-center mb-8">Sign in to manage your fleet orders.</p>
          <div className="space-y-3">
            <input type="email" placeholder="Company email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && setAuthed(true)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none" />
            <button onClick={() => setAuthed(true)} className="w-full bg-amber text-navy font-bold py-3 rounded-lg hover:bg-amber-light transition">Sign In</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Fleet <span className="text-amber">Portal</span></h2>
            <p className="text-sm text-white/30">Welcome back, Fleet Manager</p>
          </div>
          <button onClick={() => setAuthed(false)} className="border border-white/10 px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white transition">Sign Out</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Orders", value: "3", icon: "📦" },
            { label: "Total Vehicles", value: "12", icon: "🚛" },
            { label: "Total Savings", value: "$49,200", icon: "💰" },
            { label: "Avg Savings/Vehicle", value: "$4,100", icon: "📊" },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-white/30 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-black/30 rounded-xl p-1 mb-6 border border-white/5">
          {(["dashboard", "orders", "new"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition ${tab === t ? "bg-gradient-to-r from-amber to-amber-light text-navy shadow-md" : "text-white/40"}`}>
              {t === "new" ? "New Order" : t}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "dashboard" && (
          <div className="space-y-4">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Fleet Analytics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] rounded-lg p-4">
                  <p className="text-xs text-white/30 uppercase">Total Spend</p>
                  <p className="text-xl font-bold text-white">$492,000</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-4">
                  <p className="text-xs text-white/30 uppercase">Vehicles This Year</p>
                  <p className="text-xl font-bold text-white">12</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-4">
                  <p className="text-xs text-white/30 uppercase">Avg Cost/Vehicle</p>
                  <p className="text-xl font-bold text-amber">$41,000</p>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-4">
                  <p className="text-xs text-white/30 uppercase">Service Fee Total</p>
                  <p className="text-xl font-bold text-white">$11,988</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 text-left text-xs text-white/30 font-semibold uppercase">Order</th>
                  <th className="p-4 text-left text-xs text-white/30 font-semibold uppercase">Vehicles</th>
                  <th className="p-4 text-left text-xs text-white/30 font-semibold uppercase">Status</th>
                  <th className="p-4 text-left text-xs text-white/30 font-semibold uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "FO-2026-001", vehicles: "6x Ford F-150 XLT", status: "Delivered", date: "Jan 15, 2026" },
                  { id: "FO-2026-002", vehicles: "4x Ram ProMaster 2500", status: "Negotiating", date: "Mar 1, 2026" },
                  { id: "FO-2026-003", vehicles: "3x Chevy Silverado 2500HD", status: "In Progress", date: "Mar 28, 2026" },
                ].map((o) => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4 text-amber font-mono font-medium">{o.id}</td>
                    <td className="p-4 text-white">{o.vehicles}</td>
                    <td className="p-4"><span className={`text-xs font-medium px-2 py-1 rounded-full ${o.status === "Delivered" ? "bg-green-500/20 text-green-400" : o.status === "Negotiating" ? "bg-amber/20 text-amber" : "bg-blue-500/20 text-blue-400"}`}>{o.status}</span></td>
                    <td className="p-4 text-white/40">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* New Order */}
        {tab === "new" && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
            {orderSubmitted ? (
              <div className="text-center py-8">
                <p className="text-5xl mb-4">✅</p>
                <h3 className="text-xl font-bold text-white mb-2">Order Submitted!</h3>
                <p className="text-white/40 mb-6">Our fleet team will reach out within 24 hours.</p>
                <button onClick={() => { setOrderSubmitted(false); setTab("orders"); }} className="bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:bg-amber-light transition">View Orders</button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-white mb-6">New Fleet Order</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Number of Vehicles</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none">
                        {[1,2,3,4,5,6,7,8,9,10,15,20,25,30,40,50].map(n => <option key={n} value={n}>{n} vehicle{n > 1 ? "s" : ""}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Vehicle Type</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none">
                        <option>Work Trucks (Half-Ton)</option>
                        <option>Work Trucks (Heavy-Duty)</option>
                        <option>Cargo Vans</option>
                        <option>Passenger Vans</option>
                        <option>Fleet Sedans / SUVs</option>
                        <option>Specialty / Chassis Cab</option>
                        <option>Mixed Fleet</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Budget per Vehicle</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none">
                        <option>Under $35,000</option>
                        <option>$35,000 - $50,000</option>
                        <option>$50,000 - $75,000</option>
                        <option>$75,000 - $100,000</option>
                        <option>$100,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Timeline</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none">
                        <option>ASAP</option>
                        <option>1-2 Weeks</option>
                        <option>1 Month</option>
                        <option>This Quarter</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Special Requirements</label>
                    <textarea placeholder="Upfitting, branding, specific models..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-amber outline-none resize-none" />
                  </div>
                  <button onClick={() => setOrderSubmitted(true)} className="w-full bg-amber text-navy font-bold py-4 rounded-lg hover:bg-amber-light transition text-lg">Submit Fleet Order</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
