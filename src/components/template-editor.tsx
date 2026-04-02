"use client";

import { useState } from "react";

const DEFAULT_TEMPLATES = [
  { id: "welcome", name: "New Lead Welcome", channel: "text", content: "Hi {name}, thanks for reaching out to GoFetch Auto about the {vehicle}! Your dedicated agent will be in touch shortly. Is there anything specific you're looking for?" },
  { id: "followup", name: "Follow-up Nudge", channel: "text", content: "Hi {name}, just checking in on your {vehicle} search. We're actively working on finding the best deal for you. Any updates on your end?" },
  { id: "appointment", name: "Appointment Reminder", channel: "text", content: "Hi {name}, reminder about your GoFetch consultation tomorrow at {time}. Looking forward to chatting!" },
  { id: "offer", name: "Offer Notification", channel: "text", content: "Hi {name}, great news! We have a new offer for your {vehicle}. Log into your portal to review it: gofetchauto.com/portal" },
  { id: "closing", name: "Deal Closing", channel: "text", content: "Hi {name}, your {vehicle} is almost ready! Just a few final steps. Check your portal for details." },
  { id: "welcome_email", name: "Welcome Email", channel: "email", content: "Subject: Welcome to GoFetch Auto!\n\nHi {name},\n\nThank you for choosing GoFetch Auto as your car buying advocate. We've received your consultation request for a {vehicle}.\n\nWhat happens next:\n1. Your dedicated agent will review your requirements\n2. We'll search nationwide inventory for the best matches\n3. You'll receive updates in your Client Portal\n\nYour portal login: {email} / {temp_password}\nLog in at: gofetchauto.com/portal\n\nQuestions? Reply to this email or call (352) 410-5889.\n\n— The GoFetch Auto Team" },
  { id: "payment_email", name: "Payment Confirmation", channel: "email", content: "Subject: Payment Confirmed — {vehicle} Deal Details\n\nHi {name},\n\nYour payment of {amount} has been confirmed. Your deal details are now available in your portal:\n\nDealer: {dealer_name}\nVehicle: {vehicle}\nPrice: {price}\n\nYour agent will coordinate final paperwork and delivery.\n\nLog in: gofetchauto.com/portal\n\n— GoFetch Auto" },
];

const VARIABLES = ["{name}", "{vehicle}", "{email}", "{temp_password}", "{time}", "{amount}", "{price}", "{dealer_name}"];

export function TemplateEditor() {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [filter, setFilter] = useState<"all" | "text" | "email">("all");

  const filtered = filter === "all" ? templates : templates.filter(t => t.channel === filter);

  const startEdit = (id: string) => {
    const t = templates.find(t => t.id === id);
    if (t) { setEditing(id); setEditContent(t.content); }
  };

  const saveEdit = () => {
    if (!editing) return;
    setTemplates(ts => ts.map(t => t.id === editing ? { ...t, content: editContent } : t));
    setEditing(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Message Templates</h3>
        <div className="flex gap-1">
          {(["all", "text", "email"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-xs rounded-lg capitalize transition ${filter === f ? "bg-amber text-navy" : "bg-white/5 text-white/40"}`}>{f === "all" ? "All" : f === "text" ? "💬 SMS" : "📧 Email"}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(t => (
          <div key={t.id} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs">{t.channel === "text" ? "💬" : "📧"}</span>
                <h4 className="text-sm font-medium text-white">{t.name}</h4>
              </div>
              <button onClick={() => startEdit(t.id)} className="text-xs text-amber hover:text-amber-light transition">Edit</button>
            </div>
            {editing === t.id ? (
              <div className="space-y-2">
                <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={t.channel === "email" ? 10 : 3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-amber outline-none resize-none" />
                <div className="flex flex-wrap gap-1 mb-2">
                  {VARIABLES.map(v => (
                    <button key={v} onClick={() => setEditContent(c => c + " " + v)} className="text-[10px] bg-amber/10 text-amber px-2 py-0.5 rounded hover:bg-amber/20 transition">{v}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="bg-amber text-navy font-semibold px-4 py-1.5 rounded-lg text-xs hover:bg-amber-light transition">Save</button>
                  <button onClick={() => setEditing(null)} className="text-white/30 text-xs hover:text-white/60 transition">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-white/30 font-mono whitespace-pre-wrap line-clamp-2">{t.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
