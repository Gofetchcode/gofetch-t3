"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AICoPilot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Fetch AI, your CRM co-pilot. Ask me anything — lead scores, deal status, draft messages, analytics, or recommendations." },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);

    // Simulate AI response (replace with real Claude/OpenAI API call)
    setTimeout(() => {
      const responses: Record<string, string> = {
        "hottest lead": "Your hottest lead right now is **Sarah Johnson** (Score: 92). She's viewed your last email 4 times and uploaded her insurance docs yesterday. Recommend: Call her now.",
        "conversion": "Your conversion rate this month is **24%** (up 3% from last month). You've closed 8 out of 33 leads. Top converting source: Referrals at 34%.",
        "response time": "Average response time this week: **18 minutes** (down from 31 last week). Great improvement! 78% of leads contacted within 15 minutes.",
        "draft": "Here's a draft follow-up:\n\n\"Hi! Just checking in on the vehicle options we discussed. I found 3 great matches under your budget. Want me to send the details? No pressure — just want to make sure you have the latest info.\"",
        "stalled": "You have **3 stalled deals**: Mike Davis (8 days in Negotiating), Lisa Wang (12 days in Approval), Robert Brown (5 days no response). Recommend: Focus on Mike — he opened your email yesterday.",
        "next": "**Today's priority actions:**\n1. Call Sarah Johnson — score jumped to 92\n2. Send Offer #2 to Mike Davis — been waiting 3 days\n3. Follow up with Lisa Wang — docs needed\n4. Text Robert Brown — no response in 5 days\n5. Review new lead from Google Ads",
      };

      const key = Object.keys(responses).find((k) => userMsg.toLowerCase().includes(k));
      const reply = key
        ? responses[key]
        : `Based on your CRM data, here's what I found:\n\nYou have **12 active deals** across the pipeline. 3 are in negotiation, 2 awaiting approval. Your top performer this week is Marcus with 4 deals closed.\n\nWant me to dig deeper into any specific area?`;

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      setLoading(false);
    }, 1200);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-amber to-amber-light text-navy shadow-xl shadow-amber/30 flex items-center justify-center hover:scale-110 transition-transform"
        title="Fetch AI Co-Pilot"
      >
        <span className="text-2xl">🤖</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-navy border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber to-amber-light px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <p className="text-navy font-bold text-sm">Fetch AI</p>
            <p className="text-navy/60 text-[10px]">Your CRM Co-Pilot</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="text-navy/50 hover:text-navy text-xl leading-none">&times;</button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
              m.role === "user"
                ? "bg-amber text-navy rounded-br-sm"
                : "bg-white/10 text-white/80 rounded-bl-sm"
            }`}>
              <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                __html: m.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber">$1</strong>')
              }} />
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-xl px-4 py-3 rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-amber/60 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                <span className="w-2 h-2 bg-amber/60 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="w-2 h-2 bg-amber/60 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick prompts */}
      <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto border-t border-white/5">
        {["Hottest lead?", "What's next?", "Draft a text", "Stalled deals"].map((q) => (
          <button key={q} onClick={() => { setInput(q); }} className="text-[10px] text-white/30 bg-white/5 px-2 py-1 rounded-full whitespace-nowrap hover:bg-white/10 hover:text-white/60 transition">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/5 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask Fetch AI anything..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-amber outline-none"
        />
        <button onClick={send} disabled={loading} className="bg-amber text-navy px-3 py-2.5 rounded-lg font-semibold text-sm hover:bg-amber-light transition disabled:opacity-50">
          →
        </button>
      </div>
    </div>
  );
}
