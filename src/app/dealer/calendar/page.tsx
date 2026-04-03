"use client";

import { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TYPES = ["Consultation", "Follow-up", "Vehicle Showing", "Delivery", "Custom"];

const mockAppointments = [
  { id: "1", title: "John Smith — Consultation", date: "2026-04-02", time: "10:00", duration: 30, type: "Consultation", customer: "John Smith" },
  { id: "2", title: "Sarah Johnson — Vehicle Showing", date: "2026-04-02", time: "14:00", duration: 60, type: "Vehicle Showing", customer: "Sarah Johnson" },
  { id: "3", title: "Mike Davis — Follow-up Call", date: "2026-04-03", time: "09:30", duration: 15, type: "Follow-up", customer: "Mike Davis" },
  { id: "4", title: "Lisa Wang — Delivery", date: "2026-04-04", time: "11:00", duration: 45, type: "Delivery", customer: "Lisa Wang" },
];

export default function CalendarPage() {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [showAdd, setShowAdd] = useState(false);
  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long", year: "numeric" });

  // Generate days for the current week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  return (
    <div className="text-white p-6">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Calendar</h2>
            <p className="text-sm text-white/30">{currentMonth}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-black/30 rounded-lg p-0.5 border border-white/5">
              {(["day", "week", "month"] as const).map(v => (
                <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition ${view === v ? "bg-amber text-navy" : "text-white/40"}`}>{v}</button>
              ))}
            </div>
            <button onClick={() => setShowAdd(true)} className="bg-amber text-navy font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber-light transition">+ Appointment</button>
          </div>
        </div>

        {/* Today's appointments */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Today&rsquo;s Appointments</h3>
          <div className="space-y-2">
            {mockAppointments.filter(a => a.date === today.toISOString().split("T")[0]).length > 0 ?
              mockAppointments.filter(a => a.date === today.toISOString().split("T")[0]).map(a => (
                <div key={a.id} className="flex items-center gap-3 bg-white/[0.02] rounded-lg p-3 border border-white/5">
                  <div className="text-center min-w-[50px]"><div className="text-lg font-bold text-amber">{a.time}</div><div className="text-[10px] text-white/30">{a.duration}min</div></div>
                  <div className="w-px h-8 bg-white/10" />
                  <div><p className="text-sm font-medium">{a.customer}</p><p className="text-xs text-white/30">{a.type}</p></div>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${a.type === "Delivery" ? "bg-green-500/20 text-green-400" : a.type === "Consultation" ? "bg-blue-500/20 text-blue-400" : "bg-amber/20 text-amber"}`}>{a.type}</span>
                </div>
              )) : <p className="text-sm text-white/20 text-center py-4">No appointments today</p>
            }
          </div>
        </div>

        {/* Week View */}
        {view === "week" && (
          <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
            <div className="grid grid-cols-8 border-b border-white/5">
              <div className="p-3 text-xs text-white/20" />
              {weekDays.map((d, i) => {
                const isToday = d.toDateString() === today.toDateString();
                return (
                  <div key={i} className={`p-3 text-center border-l border-white/5 ${isToday ? "bg-amber/5" : ""}`}>
                    <p className="text-xs text-white/30">{DAYS[d.getDay()]}</p>
                    <p className={`text-lg font-bold ${isToday ? "text-amber" : "text-white/60"}`}>{d.getDate()}</p>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-8">
              {hours.map(h => (
                <div key={h} className="contents">
                  <div className="p-2 text-[10px] text-white/20 text-right border-t border-white/5">{h > 12 ? h - 12 : h}{h >= 12 ? "PM" : "AM"}</div>
                  {weekDays.map((d, di) => (
                    <div key={di} className="border-l border-t border-white/5 min-h-[40px] p-0.5 relative">
                      {mockAppointments.filter(a => a.date === d.toISOString().split("T")[0] && parseInt(a.time) === h).map(a => (
                        <div key={a.id} className="bg-amber/20 border border-amber/30 rounded px-1.5 py-0.5 text-[10px] text-amber truncate">{a.time} {a.customer.split(" ")[0]}</div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Appointment Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-navy-light border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">New Appointment</h3>
              <div className="space-y-3">
                <input placeholder="Customer name" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none" />
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none">
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none" />
                  <input type="time" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none" />
                </div>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none">
                  <option>15 minutes</option><option>30 minutes</option><option>45 minutes</option><option>60 minutes</option>
                </select>
                <textarea placeholder="Notes..." rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none resize-none" />
                <div className="flex gap-3">
                  <button onClick={() => setShowAdd(false)} className="flex-1 bg-amber text-navy font-bold py-3 rounded-lg hover:bg-amber-light transition">Save Appointment</button>
                  <button onClick={() => setShowAdd(false)} className="px-6 py-3 border border-white/10 rounded-lg text-white/40 hover:text-white transition">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
