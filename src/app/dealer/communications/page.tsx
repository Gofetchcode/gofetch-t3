"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function CommunicationsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState("");
  const [channel, setChannel] = useState<"text" | "email" | "note">("text");

  // Fetch all customers to build conversation list
  const customers = trpc.customer.getAll.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();

  // Fetch thread for selected customer
  const thread = trpc.communications.getThread.useQuery(
    { customerId: selectedId || "" },
    { enabled: !!selectedId, retry: false }
  );

  const sendMsg = trpc.communications.send.useMutation({
    onSuccess: () => {
      setNewMsg("");
      utils.communications.getThread.invalidate();
    },
  });

  const clientList = customers.data || [];
  const selected = clientList.find((c: any) => c.id === selectedId);
  const messages = thread.data || [];

  const handleSend = () => {
    if (!newMsg.trim() || !selectedId) return;
    sendMsg.mutate({ customerId: selectedId, content: newMsg.trim(), channel });
  };

  return (
    <div className="text-white h-screen flex flex-col">
      <div className="flex-1 flex min-h-0">
        {/* Left: Conversation List */}
        <div className="w-72 flex-shrink-0 bg-white/[0.02] border-r border-white/5 flex flex-col">
          <div className="p-3 border-b border-white/5">
            <h2 className="text-lg font-bold mb-2">Messages</h2>
            <input placeholder="Search..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:border-amber outline-none" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {customers.isLoading && <p className="text-sm text-white/20 p-4">Loading...</p>}
            {clientList.length === 0 && !customers.isLoading && (
              <p className="text-sm text-white/20 p-4 text-center">No conversations yet.</p>
            )}
            {clientList.map((c: any) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full flex items-start gap-2.5 p-3 text-left border-b border-white/5 transition ${selectedId === c.id ? "bg-amber/10" : "hover:bg-white/[0.03]"}`}
              >
                <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center text-amber text-[10px] font-bold flex-shrink-0">
                  {(c.firstName?.[0] || "").toUpperCase()}{(c.lastName?.[0] || "").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.firstName} {c.lastName}</p>
                  <p className="text-xs text-white/30 truncate">{c.vehicleSpecific || c.vehicleType || "No vehicle"}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Thread */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selectedId ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white/20 text-sm">Select a conversation</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3 flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-amber/20 flex items-center justify-center text-amber font-bold text-sm">
                  {(selected?.firstName?.[0] || "").toUpperCase()}{(selected?.lastName?.[0] || "").toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm">{selected?.firstName} {selected?.lastName}</p>
                  <p className="text-[10px] text-white/30">{selected?.email} | {selected?.phone}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {thread.isLoading && <p className="text-sm text-white/20 text-center py-8">Loading messages...</p>}
                {messages.length === 0 && !thread.isLoading && (
                  <p className="text-sm text-white/20 text-center py-8">No messages yet. Send the first one.</p>
                )}
                {messages.map((m: any) => (
                  <div key={m.id} className={`flex ${m.sender === "customer" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-xl px-4 py-2.5 text-sm ${
                      m.sender === "customer" ? "bg-amber text-navy rounded-br-sm" :
                      m.sender === "system" || m.channel === "system" ? "bg-blue-500/20 text-blue-300 rounded-bl-sm" :
                      m.channel === "note" ? "bg-purple-500/20 text-purple-300 rounded-bl-sm" :
                      "bg-white/10 text-white/70 rounded-bl-sm"
                    }`}>
                      {m.channel === "note" && <span className="text-[10px] font-bold block mb-1">Note</span>}
                      <p>{m.content}</p>
                      <p className="text-[10px] opacity-50 mt-1">{new Date(m.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Send */}
              <div className="p-3 border-t border-white/5 flex gap-2 flex-shrink-0">
                <select value={channel} onChange={e => setChannel(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white/50 flex-shrink-0">
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="note">Note</option>
                </select>
                <input
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:border-amber outline-none min-w-0"
                />
                <button
                  onClick={handleSend}
                  disabled={sendMsg.isPending || !newMsg.trim()}
                  className="bg-amber text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-light transition flex-shrink-0 disabled:opacity-50"
                >
                  {sendMsg.isPending ? "..." : "Send"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
