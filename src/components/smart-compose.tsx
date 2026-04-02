"use client";

import { useState } from "react";

const TONES = ["Professional", "Friendly", "Urgent", "Casual"];

export function SmartCompose({ customerName, vehicle, step, onSend }: { customerName: string; vehicle?: string; step: number; onSend: (msg: string) => void }) {
  const [tone, setTone] = useState("Friendly");
  const [draft, setDraft] = useState("");
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const drafts: Record<string, string> = {
        Professional: `Dear ${customerName},\n\nI wanted to provide you with an update on your ${vehicle || "vehicle"} search. We've identified several strong options and are actively negotiating on your behalf. I'll have detailed pricing information for you shortly.\n\nPlease don't hesitate to reach out if you have any questions.\n\nBest regards,\nGoFetch Auto`,
        Friendly: `Hi ${customerName}! 👋\n\nQuick update on your ${vehicle || "vehicle"} — we've been talking to a few dealers and things are looking great! I should have some numbers to show you soon.\n\nLet me know if anything's changed on your end!`,
        Urgent: `${customerName} — Important update on your ${vehicle || "vehicle"} deal.\n\nWe have a competitive offer that expires in 48 hours. I'd love to walk you through the numbers today. When's a good time for a quick call?\n\nDon't want you to miss this one.`,
        Casual: `Hey ${customerName}! Just wanted to check in real quick about the ${vehicle || "vehicle"}. Found some good stuff — want me to send over the details? No rush, just keeping you in the loop! 🚗`,
      };
      setDraft(drafts[tone] || drafts.Friendly);
      setGenerating(false);
    }, 800);
  };

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-white/60">🤖 Smart Compose</h4>
        <div className="flex gap-1">
          {TONES.map(t => (
            <button key={t} onClick={() => setTone(t)} className={`text-[10px] px-2 py-1 rounded-full transition ${tone === t ? "bg-amber text-navy" : "bg-white/5 text-white/30 hover:text-white/60"}`}>{t}</button>
          ))}
        </div>
      </div>
      {draft ? (
        <div className="space-y-2">
          <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={5} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber outline-none resize-none" />
          <div className="flex gap-2">
            <button onClick={() => onSend(draft)} className="flex-1 bg-amber text-navy font-semibold py-2 rounded-lg text-sm hover:bg-amber-light transition">Send</button>
            <button onClick={generate} className="px-4 py-2 border border-white/10 rounded-lg text-white/40 text-sm hover:text-white transition">Regenerate</button>
            <button onClick={() => setDraft("")} className="px-4 py-2 text-white/20 text-sm hover:text-white/40 transition">Clear</button>
          </div>
        </div>
      ) : (
        <button onClick={generate} disabled={generating} className="w-full bg-white/5 text-white/40 py-3 rounded-lg text-sm hover:bg-white/10 hover:text-white/60 transition disabled:opacity-50">
          {generating ? "✨ Drafting..." : "✨ Generate AI Draft"}
        </button>
      )}
    </div>
  );
}
