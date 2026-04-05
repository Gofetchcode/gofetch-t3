"use client";

import { useState } from "react";
import { TemplateEditor } from "@/components/template-editor";
import { AttributionDashboard } from "@/components/attribution-dashboard";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { PreferredNetworkManager } from "@/components/preferred-network";

const sections = [
  { id: "appearance", label: "Appearance", icon: "🎨" },
  { id: "network", label: "Dealer Network", icon: "🤝" },
  { id: "users", label: "Users & Roles", icon: "👥" },
  { id: "leads", label: "Lead Settings", icon: "📋" },
  { id: "sources", label: "Lead Sources", icon: "🔗" },
  { id: "pipeline", label: "Pipeline Stages", icon: "📊" },
  { id: "goals", label: "Sales Goals", icon: "🎯" },
  { id: "desking", label: "Desking Defaults", icon: "💰" },
  { id: "tasks", label: "Task Templates", icon: "✅" },
  { id: "hours", label: "Business Hours", icon: "🕐" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "comms", label: "Communications", icon: "💬" },
  { id: "ai", label: "AI Settings", icon: "🤖" },
  { id: "integrations", label: "Integrations", icon: "🔌" },
  { id: "webhooks", label: "Webhooks", icon: "🪝" },
  { id: "company", label: "Company Info", icon: "🏢" },
  { id: "export", label: "Data Export", icon: "💾" },
  { id: "audit", label: "Audit Logs", icon: "📜" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("appearance");

  return (
    <div className="text-white p-6">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-56 flex-shrink-0">
            <div className="space-y-1">
              {sections.map((s) => (
                <button key={s.id} onClick={() => setActive(s.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition text-left ${active === s.id ? "bg-amber/20 text-amber font-semibold" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
                  <span>{s.icon}</span>{s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl p-6">
            {active === "appearance" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Appearance</h3>
                <p className="text-white/40 text-sm mb-6">Customize the look and feel of your CRM.</p>

                <div className="space-y-6">
                  {/* Dark/Light Mode Toggle */}
                  <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">Theme Mode</p>
                        <p className="text-xs text-white/30 mt-1">Switch between dark and light mode for the CRM interface.</p>
                      </div>
                      <DarkModeToggle />
                    </div>
                  </div>

                  {/* Accent Color (visual only for now) */}
                  <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                    <div>
                      <p className="font-medium text-white mb-1">Accent Color</p>
                      <p className="text-xs text-white/30 mb-3">Choose the primary accent color for buttons and highlights.</p>
                      <div className="flex gap-2">
                        {[
                          { name: "Amber", class: "bg-amber" },
                          { name: "Blue", class: "bg-blue-500" },
                          { name: "Green", class: "bg-green-500" },
                          { name: "Purple", class: "bg-purple-500" },
                          { name: "Red", class: "bg-red-500" },
                        ].map((c) => (
                          <button
                            key={c.name}
                            title={c.name}
                            className={`w-8 h-8 rounded-full ${c.class} ${c.name === "Amber" ? "ring-2 ring-white/30 ring-offset-2 ring-offset-navy" : ""} hover:scale-110 transition`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar density */}
                  <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">Compact Sidebar</p>
                        <p className="text-xs text-white/30 mt-1">Use a narrower sidebar with icon-only navigation.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {active === "network" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Preferred Dealer Network</h3>
                <p className="text-white/40 text-sm mb-6">Manage your dealer network. Preferred partners get priority lead flow and faster response times.</p>
                <PreferredNetworkManager />
              </div>
            )}

            {active === "users" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Users & Roles</h3>
                <p className="text-white/40 text-sm mb-6">Manage team members and their access levels.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white/[0.03] rounded-lg p-4 border border-white/5">
                    <div><p className="font-medium">Admin</p><p className="text-xs text-white/30">inquiry@gofetchauto.com</p></div>
                    <span className="text-xs bg-amber/20 text-amber px-2 py-1 rounded-full">Admin</span>
                  </div>
                </div>
                <button className="mt-4 bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber-light transition">+ Add User</button>
              </div>
            )}

            {active === "leads" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Lead Settings</h3>
                <div className="space-y-4">
                  <div><label className="text-sm text-white/50 block mb-1">Auto-Assignment Rule</label>
                    <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full"><option>Round Robin</option><option>Specific User</option><option>Manual</option></select></div>
                  <div><label className="text-sm text-white/50 block mb-1">Lead Response Time Target</label>
                    <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full"><option>15 minutes</option><option>30 minutes</option><option>1 hour</option><option>2 hours</option></select></div>
                </div>
              </div>
            )}

            {active === "sources" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Lead Sources</h3>
                <div className="space-y-2">
                  {["Website", "Referral", "Cars.com", "AutoTrader", "Facebook", "Google Ads", "Manual", "Zapier"].map(s => (
                    <div key={s} className="flex items-center justify-between bg-white/[0.03] rounded-lg p-3 border border-white/5">
                      <span className="text-sm">{s}</span><span className="text-xs text-green-400">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "pipeline" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Pipeline Stages</h3>
                <p className="text-white/40 text-sm mb-4">Customize your deal pipeline stages.</p>
                {["Consultation", "Lead Received", "Researching", "Negotiating", "Client Approval", "Deal Agreed", "Paperwork", "Delivery", "Delivered"].map((s, i) => (
                  <div key={s} className="flex items-center gap-3 bg-white/[0.03] rounded-lg p-3 border border-white/5 mb-2">
                    <span className="text-xs text-white/30 w-6">{i + 1}</span>
                    <input defaultValue={s} className="bg-transparent text-sm flex-1 focus:outline-none" />
                  </div>
                ))}
              </div>
            )}

            {active === "comms" && (
              <div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4">Communications</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div><label className="text-sm text-white/50 block mb-1">SMS Provider</label>
                        <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full"><option>Twilio</option><option>Not configured</option></select></div>
                      <div><label className="text-sm text-white/50 block mb-1">Email Provider</label>
                        <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full"><option>SendGrid</option><option>AWS SES</option><option>Not configured</option></select></div>
                    </div>
                  </div>
                  <TemplateEditor />
                </div>
              </div>
            )}

            {active === "ai" && (
              <div>
                <h3 className="text-lg font-bold mb-4">AI Settings</h3>

                {/* Autonomy Level */}
                <div className="mb-6">
                  <label className="text-sm text-white/50 block mb-2">AI Autonomy Level</label>
                  <div className="space-y-2">
                    {[
                      { level: 1, name: "Suggest Only", desc: "AI recommends but never executes. Human approves everything.", color: "border-green-500/30" },
                      { level: 2, name: "Auto Low-Risk", desc: "AI handles follow-ups, reminders, welcomes. Waits for approval on offers/money.", color: "border-amber/30" },
                      { level: 3, name: "Full Auto", desc: "AI handles everything except payments, contracts, and deletions.", color: "border-red-500/30" },
                    ].map(a => (
                      <label key={a.level} className={`flex items-start gap-3 bg-white/[0.02] border ${a.color} rounded-lg p-3 cursor-pointer hover:bg-white/[0.04] transition`}>
                        <input type="radio" name="autonomy" defaultChecked={a.level === 1} className="mt-1 accent-amber" />
                        <div>
                          <p className="text-sm font-medium text-white">Level {a.level}: {a.name}</p>
                          <p className="text-xs text-white/30">{a.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Timing */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider">Escalation Timing</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="text-xs text-white/50 block mb-1">Auto-text after</label>
                      <div className="flex items-center gap-2"><input type="number" defaultValue={240} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-20" /><span className="text-xs text-white/30">min</span></div></div>
                    <div><label className="text-xs text-white/50 block mb-1">Escalation after</label>
                      <div className="flex items-center gap-2"><input type="number" defaultValue={24} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-20" /><span className="text-xs text-white/30">hrs</span></div></div>
                    <div><label className="text-xs text-white/50 block mb-1">Auto-reassign after</label>
                      <div className="flex items-center gap-2"><input type="number" defaultValue={48} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-20" /><span className="text-xs text-white/30">hrs</span></div></div>
                  </div>
                </div>

                {/* Safety */}
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider">Safety Guardrails</h4>
                  <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="accent-amber" /><span className="text-sm text-white/60">Quiet hours: No messages 9PM-8AM</span></label>
                  <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="accent-amber" /><span className="text-sm text-white/60">Max 3 auto-messages per customer per day</span></label>
                  <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="accent-amber" /><span className="text-sm text-white/60">AI always identifies itself in messages</span></label>
                  <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="accent-amber" /><span className="text-sm text-white/60">Stop AI on negative customer sentiment</span></label>
                  <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="accent-amber" /><span className="text-sm text-white/60">5-second undo window on all AI actions</span></label>
                </div>

                <button className="mt-6 bg-amber text-navy font-semibold px-6 py-2 rounded-lg text-sm hover:bg-amber-light transition">Save AI Settings</button>
              </div>
            )}

            {active === "integrations" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Integrations</h3>
                <div className="space-y-3">
                  {[
                    { name: "Stripe", status: "Not connected", icon: "💳" },
                    { name: "Twilio", status: "Not connected", icon: "📱" },
                    { name: "SendGrid", status: "Not connected", icon: "📧" },
                    { name: "Zapier", status: "Ready", icon: "⚡" },
                    { name: "Facebook Ads", status: "Not connected", icon: "📘" },
                    { name: "Google Ads", status: "Not connected", icon: "🔍" },
                  ].map(i => (
                    <div key={i.name} className="flex items-center justify-between bg-white/[0.03] rounded-lg p-4 border border-white/5">
                      <div className="flex items-center gap-3"><span className="text-xl">{i.icon}</span><span className="font-medium text-sm">{i.name}</span></div>
                      <button className="text-xs bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20 transition">{i.status === "Ready" ? "Configure" : "Connect"}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "webhooks" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Outbound Webhooks</h3>
                <p className="text-white/40 text-sm mb-4">Configure webhooks to fire on events.</p>
                <button className="bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber-light transition">+ Add Webhook</button>
              </div>
            )}

            {active === "company" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Company Info</h3>
                <div className="space-y-4">
                  <div><label className="text-sm text-white/50 block mb-1">Company Name</label><input defaultValue="GoFetch Auto LLC" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full" /></div>
                  <div><label className="text-sm text-white/50 block mb-1">Phone</label><input defaultValue="(352) 410-5889" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full" /></div>
                  <div><label className="text-sm text-white/50 block mb-1">Email</label><input defaultValue="inquiry@gofetchauto.com" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full" /></div>
                  <button className="bg-amber text-navy font-semibold px-6 py-2 rounded-lg text-sm hover:bg-amber-light transition">Save</button>
                </div>
              </div>
            )}

            {active === "goals" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Sales Goals</h3>
                <p className="text-white/40 text-sm mb-4">Set monthly targets per advocate.</p>
                <div className="space-y-3">
                  {["Marcus J.", "Sarah K.", "David L."].map(name => (
                    <div key={name} className="flex items-center gap-4 bg-white/[0.03] rounded-lg p-3 border border-white/5">
                      <span className="text-sm font-medium text-white w-28">{name}</span>
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <div><label className="text-[10px] text-white/30">Deals/Month</label><input type="number" defaultValue={10} className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm" /></div>
                        <div><label className="text-[10px] text-white/30">Revenue Target</label><input defaultValue="$2,000" className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm" /></div>
                        <div><label className="text-[10px] text-white/30">Response Time</label><input defaultValue="15 min" className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm" /></div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-sm">Save Goals</button>
              </div>
            )}

            {active === "desking" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Desking Defaults</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm text-white/50 block mb-1">Default Tax Rate (%)</label><input type="number" defaultValue={7} step={0.1} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full" /></div>
                  <div><label className="text-sm text-white/50 block mb-1">Doc Fee ($)</label><input type="number" defaultValue={799} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full" /></div>
                  <div><label className="text-sm text-white/50 block mb-1">Title & Reg Fee ($)</label><input type="number" defaultValue={499} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full" /></div>
                  <div><label className="text-sm text-white/50 block mb-1">Default Finance Rate (%)</label><input type="number" defaultValue={5.9} step={0.1} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full" /></div>
                  <div><label className="text-sm text-white/50 block mb-1">Default Term (months)</label><input type="number" defaultValue={60} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full" /></div>
                </div>
                <button className="mt-4 bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-sm">Save Defaults</button>
              </div>
            )}

            {active === "tasks" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Task Templates</h3>
                <p className="text-white/40 text-sm mb-4">Auto-create tasks when deals reach specific steps.</p>
                <div className="space-y-2">
                  {["Consultation", "Lead Received", "Researching", "Negotiating", "Client Approval", "Deal Agreed", "Paperwork", "Delivery", "Delivered"].map((step, i) => (
                    <div key={step} className="flex items-center gap-3 bg-white/[0.03] rounded-lg p-3 border border-white/5">
                      <span className="text-xs text-white/30 w-6">{i}</span>
                      <span className="text-sm text-white/60 w-32">{step}</span>
                      <input placeholder={`Auto-task at step ${i}... (e.g., "Send welcome email")`} className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white placeholder-white/20 focus:border-amber outline-none" />
                      <label className="flex items-center gap-1 text-xs text-white/30"><input type="checkbox" className="accent-amber" /> Active</label>
                    </div>
                  ))}
                </div>
                <button className="mt-4 bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-sm">Save Templates</button>
              </div>
            )}

            {active === "hours" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Business Hours</h3>
                <div className="space-y-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                    <div key={day} className="flex items-center gap-4 bg-white/[0.03] rounded-lg p-3 border border-white/5">
                      <label className="flex items-center gap-2 w-28"><input type="checkbox" defaultChecked={day !== "Sunday"} className="accent-amber" /><span className="text-sm text-white">{day}</span></label>
                      <input type="time" defaultValue="09:00" className="bg-white/5 border border-white/10 rounded px-3 py-1 text-sm" />
                      <span className="text-white/20">to</span>
                      <input type="time" defaultValue="18:00" className="bg-white/5 border border-white/10 rounded px-3 py-1 text-sm" />
                    </div>
                  ))}
                </div>
                <button className="mt-4 bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-sm">Save Hours</button>
              </div>
            )}

            {active === "notifications" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Notification Preferences</h3>
                <p className="text-white/40 text-sm mb-4">Choose which events trigger notifications per role.</p>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/5">
                    <th className="p-2 text-left text-xs text-white/30">Event</th>
                    <th className="p-2 text-center text-xs text-white/30">Admin</th>
                    <th className="p-2 text-center text-xs text-white/30">Manager</th>
                    <th className="p-2 text-center text-xs text-white/30">Advocate</th>
                  </tr></thead>
                  <tbody>
                    {["New Lead", "Step Changed", "Payment Received", "Document Uploaded", "Offer Sent", "Offer Accepted", "AI Escalation", "Deal Closed"].map(event => (
                      <tr key={event} className="border-b border-white/5">
                        <td className="p-2 text-white/60">{event}</td>
                        <td className="p-2 text-center"><input type="checkbox" defaultChecked className="accent-amber" /></td>
                        <td className="p-2 text-center"><input type="checkbox" defaultChecked className="accent-amber" /></td>
                        <td className="p-2 text-center"><input type="checkbox" defaultChecked={!event.includes("AI")} className="accent-amber" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="mt-4 bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-sm">Save Preferences</button>
              </div>
            )}

            {active === "export" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Data Export & Backup</h3>
                <div className="space-y-4">
                  <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                    <h4 className="text-sm font-medium text-white mb-2">Export Customers</h4>
                    <p className="text-xs text-white/30 mb-3">Download all customer data as CSV.</p>
                    <button onClick={() => { fetch("/api/trpc/dealer.exportCSV").then(r => r.json()).then(d => { const blob = new Blob([d.result?.data || ""], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "gofetch-customers.csv"; a.click(); }); }} className="bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber-light transition">📥 Export CSV</button>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                    <h4 className="text-sm font-medium text-white mb-2">Full Database Backup</h4>
                    <p className="text-xs text-white/30 mb-3">Generate a complete backup of all CRM data.</p>
                    <button className="bg-white/10 text-white/60 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition">📦 Generate Backup</button>
                    <p className="text-[10px] text-white/20 mt-2">Last backup: Never</p>
                  </div>
                </div>
              </div>
            )}

            {active === "audit" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Audit Logs</h3>
                <p className="text-white/40 text-sm mb-4">All actions are logged for compliance.</p>
                <div className="text-sm text-white/30 text-center py-8">Audit log entries will appear here.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
