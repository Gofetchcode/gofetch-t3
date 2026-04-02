"use client";

import { useState } from "react";

const sections = [
  { id: "users", label: "Users & Roles", icon: "👥" },
  { id: "leads", label: "Lead Settings", icon: "📋" },
  { id: "sources", label: "Lead Sources", icon: "🔗" },
  { id: "pipeline", label: "Pipeline Stages", icon: "📊" },
  { id: "comms", label: "Communications", icon: "💬" },
  { id: "ai", label: "AI Settings", icon: "🤖" },
  { id: "integrations", label: "Integrations", icon: "🔌" },
  { id: "webhooks", label: "Webhooks", icon: "🪝" },
  { id: "company", label: "Company Info", icon: "🏢" },
  { id: "audit", label: "Audit Logs", icon: "📜" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("users");

  return (
    <div className="min-h-screen bg-navy text-white pt-20">
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
                <h3 className="text-lg font-bold mb-4">Communications</h3>
                <div className="space-y-4">
                  <div><label className="text-sm text-white/50 block mb-1">SMS Provider</label>
                    <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full"><option>Twilio</option><option>Not configured</option></select></div>
                  <div><label className="text-sm text-white/50 block mb-1">Email Provider</label>
                    <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full"><option>SendGrid</option><option>AWS SES</option><option>Not configured</option></select></div>
                </div>
              </div>
            )}

            {active === "ai" && (
              <div>
                <h3 className="text-lg font-bold mb-4">AI Settings</h3>
                <div className="space-y-4">
                  <div><label className="text-sm text-white/50 block mb-1">Auto-text after (minutes)</label>
                    <input type="number" defaultValue={240} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-40" /></div>
                  <div><label className="text-sm text-white/50 block mb-1">Escalation after (hours)</label>
                    <input type="number" defaultValue={24} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-40" /></div>
                  <div><label className="text-sm text-white/50 block mb-1">Auto-reassign after (hours)</label>
                    <input type="number" defaultValue={48} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-40" /></div>
                </div>
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
