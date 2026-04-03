"use client";

import { useState } from "react";
import { SmartCompose } from "@/components/smart-compose";
import { VideoRecorder } from "@/components/video-recorder";
import { VoiceRecorder } from "@/components/voice-recorder";

const mockConversations = [
  { id: "1", name: "John Smith", lastMsg: "Thanks, looking forward to the offer!", time: "2m ago", unread: 2, channel: "text" },
  { id: "2", name: "Sarah Johnson", lastMsg: "Can you send me the insurance docs?", time: "15m ago", unread: 0, channel: "email" },
  { id: "3", name: "Mike Davis", lastMsg: "AI: Welcome! We received your request...", time: "1h ago", unread: 1, channel: "ai" },
  { id: "4", name: "Lisa Wang", lastMsg: "I'd like to schedule a test drive.", time: "3h ago", unread: 0, channel: "text" },
  { id: "5", name: "Robert Brown", lastMsg: "Note: Client prefers morning calls", time: "5h ago", unread: 0, channel: "note" },
];

const mockMessages = [
  { id: "1", sender: "system", content: "Welcome! We've received your consultation for a 2026 Toyota RAV4.", time: "Mar 15, 9:00 AM", channel: "system" },
  { id: "2", sender: "agent", content: "Hi John! I'm your GoFetch advocate. I'll start searching for your RAV4 today.", time: "Mar 15, 9:15 AM", channel: "text" },
  { id: "3", sender: "customer", content: "Great! I'm looking for the XLE trim in white or silver.", time: "Mar 15, 10:30 AM", channel: "text" },
  { id: "4", sender: "agent", content: "Perfect. I've found 3 matching vehicles in the Tampa area. Working on pricing now.", time: "Mar 15, 2:00 PM", channel: "text" },
  { id: "5", sender: "system", content: "AI auto-text sent: Following up on vehicle search.", time: "Mar 16, 8:00 AM", channel: "ai" },
  { id: "6", sender: "customer", content: "Thanks, looking forward to the offer!", time: "Mar 16, 9:30 AM", channel: "text" },
];

export default function CommunicationsPage() {
  const [selectedConvo, setSelectedConvo] = useState(mockConversations[0]);
  const [filter, setFilter] = useState("all");
  const [newMsg, setNewMsg] = useState("");

  const channelIcon = (ch: string) => ch === "text" ? "💬" : ch === "email" ? "📧" : ch === "ai" ? "🤖" : ch === "note" ? "📋" : "📞";
  const filters = ["all", "texts", "emails", "notes", "ai", "system"];

  return (
    <div className="text-white p-6">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Communications</h2>
        <div className="flex gap-4 h-[calc(100vh-160px)]">
          {/* Left: Conversation List */}
          <div className="w-80 flex-shrink-0 bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden flex flex-col">
            <div className="p-3 border-b border-white/5">
              <input placeholder="Search conversations..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:border-amber outline-none" />
            </div>
            <div className="flex gap-1 px-3 py-2 border-b border-white/5 overflow-x-auto">
              {filters.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-2 py-1 text-[10px] font-medium rounded whitespace-nowrap transition ${filter === f ? "bg-amber text-navy" : "text-white/30 hover:text-white/60"}`}>
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto">
              {mockConversations.map(c => (
                <button key={c.id} onClick={() => setSelectedConvo(c)} className={`w-full flex items-start gap-3 p-3 text-left border-b border-white/5 transition ${selectedConvo.id === c.id ? "bg-amber/10" : "hover:bg-white/[0.03]"}`}>
                  <div className="w-9 h-9 rounded-full bg-amber/20 flex items-center justify-center text-amber text-xs font-bold flex-shrink-0">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white truncate">{c.name}</span>
                      <span className="text-[10px] text-white/20">{c.time}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px]">{channelIcon(c.channel)}</span>
                      <span className="text-xs text-white/30 truncate">{c.lastMsg}</span>
                    </div>
                  </div>
                  {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-amber text-navy text-[10px] font-bold flex items-center justify-center flex-shrink-0">{c.unread}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Thread */}
          <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center text-amber font-bold">
                {selectedConvo.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-medium">{selectedConvo.name}</p>
                <p className="text-xs text-white/30">Active conversation</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mockMessages.map(m => (
                <div key={m.id} className={`flex ${m.sender === "customer" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-sm rounded-xl px-4 py-2.5 text-sm ${
                    m.sender === "customer" ? "bg-amber text-navy rounded-br-sm" :
                    m.sender === "system" || m.channel === "ai" ? "bg-blue-500/20 text-blue-300 rounded-bl-sm" :
                    "bg-white/10 text-white/70 rounded-bl-sm"
                  }`}>
                    {m.channel === "ai" && <span className="text-[10px] font-bold block mb-1">🤖 AI Auto</span>}
                    <p>{m.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] opacity-50">{channelIcon(m.channel)}</span>
                      <span className="text-[10px] opacity-50">{m.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Smart Compose + Video/Voice */}
            <div className="p-3 border-t border-white/5 space-y-3">
              <SmartCompose customerName={selectedConvo.name} vehicle="2026 Toyota RAV4" step={3} onSend={(msg) => setNewMsg(msg)} />
              <div className="flex gap-3">
                <VideoRecorder onSend={(blob) => console.log("Video recorded:", blob.size)} />
              </div>
            </div>
            <div className="p-3 border-t border-white/5 flex gap-2">
              <select className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white/50">
                <option>💬 Text</option>
                <option>📧 Email</option>
                <option>📋 Note</option>
              </select>
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type a message..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:border-amber outline-none" />
              <VoiceRecorder onSave={(blob, transcript) => setNewMsg(transcript)} />
              <button className="bg-amber text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-light transition">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
