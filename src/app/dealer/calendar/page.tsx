"use client";

import { useState, type DragEvent } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TYPES = ["Consultation", "Follow-up", "Vehicle Showing", "Delivery", "Custom"];

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Consultation: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  "Follow-up": { bg: "bg-amber/20", text: "text-amber", border: "border-amber/30" },
  "Vehicle Showing": { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
  Delivery: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
  Custom: { bg: "bg-white/10", text: "text-white/60", border: "border-white/10" },
};

const initialAppointments = [
  { id: "1", title: "John Smith — Consultation", date: "2026-04-02", time: "10:00", duration: 30, type: "Consultation", customer: "John Smith", phone: "(813) 555-1234", email: "john@example.com", vehicle: "2026 Toyota RAV4 XLE", notes: "Interested in white or silver. Budget $35k." },
  { id: "2", title: "Sarah Johnson — Vehicle Showing", date: "2026-04-02", time: "14:00", duration: 60, type: "Vehicle Showing", customer: "Sarah Johnson", phone: "(727) 555-5678", email: "sarah@example.com", vehicle: "2025 Honda CR-V Hybrid", notes: "First showing, coming with spouse." },
  { id: "3", title: "Mike Davis — Follow-up Call", date: "2026-04-03", time: "09:30", duration: 15, type: "Follow-up", customer: "Mike Davis", phone: "(352) 555-9012", email: "mike@example.com", vehicle: "2026 Ford F-150", notes: "Sent offer yesterday, following up." },
  { id: "4", title: "Lisa Wang — Delivery", date: "2026-04-04", time: "11:00", duration: 45, type: "Delivery", customer: "Lisa Wang", phone: "(813) 555-3456", email: "lisa@example.com", vehicle: "2025 BMW X3", notes: "All paperwork signed. Final delivery walkthrough." },
];

export default function CalendarPage() {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [showAdd, setShowAdd] = useState(false);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedAppt, setSelectedAppt] = useState<typeof initialAppointments[0] | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long", year: "numeric" });

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

  // Drag handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dayDate: string, hour: number) => {
    e.preventDefault();
    if (!draggedId) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === draggedId
          ? { ...a, date: dayDate, time: `${String(hour).padStart(2, "0")}:00` }
          : a
      )
    );
    setDraggedId(null);
  };

  const typeStyle = (type: string) => TYPE_COLORS[type] || TYPE_COLORS.Custom;

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
            {appointments.filter(a => a.date === today.toISOString().split("T")[0]).length > 0 ?
              appointments.filter(a => a.date === today.toISOString().split("T")[0]).map(a => {
                const style = typeStyle(a.type);
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAppt(a)}
                    className={`flex items-center gap-3 rounded-lg p-3 border cursor-pointer transition hover:bg-white/[0.04] ${style.bg} ${style.border}`}
                  >
                    <div className="text-center min-w-[50px]">
                      <div className={`text-lg font-bold ${style.text}`}>{a.time}</div>
                      <div className="text-[10px] text-white/30">{a.duration}min</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.customer}</p>
                      <p className="text-xs text-white/30">{a.type}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>{a.type}</span>
                  </div>
                );
              }) : <p className="text-sm text-white/20 text-center py-4">No appointments today</p>
            }
          </div>
        </div>

        {/* Week View with drag-and-drop */}
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
                  {weekDays.map((d, di) => {
                    const dayStr = d.toISOString().split("T")[0];
                    return (
                      <div
                        key={di}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, dayStr, h)}
                        className="border-l border-t border-white/5 min-h-[44px] p-0.5 relative hover:bg-white/[0.02] transition"
                      >
                        {appointments.filter(a => a.date === dayStr && parseInt(a.time) === h).map(a => {
                          const style = typeStyle(a.type);
                          return (
                            <div
                              key={a.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, a.id)}
                              onClick={() => setSelectedAppt(a)}
                              className={`${style.bg} border ${style.border} rounded px-1.5 py-1 text-[10px] ${style.text} truncate cursor-grab active:cursor-grabbing hover:brightness-125 transition ${
                                draggedId === a.id ? "opacity-40" : ""
                              }`}
                            >
                              {a.time} {a.customer.split(" ")[0]}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day View */}
        {view === "day" && (
          <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/5 text-center">
              <p className="text-lg font-bold text-amber">{today.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })}</p>
            </div>
            <div className="divide-y divide-white/5">
              {hours.map(h => {
                const dayStr = today.toISOString().split("T")[0];
                const appts = appointments.filter(a => a.date === dayStr && parseInt(a.time) === h);
                return (
                  <div
                    key={h}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, dayStr, h)}
                    className="flex gap-4 p-3 min-h-[56px] hover:bg-white/[0.02] transition"
                  >
                    <div className="w-16 text-xs text-white/20 text-right pt-1 flex-shrink-0">{h > 12 ? h - 12 : h}:00 {h >= 12 ? "PM" : "AM"}</div>
                    <div className="flex-1 space-y-1">
                      {appts.map(a => {
                        const style = typeStyle(a.type);
                        return (
                          <div
                            key={a.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, a.id)}
                            onClick={() => setSelectedAppt(a)}
                            className={`${style.bg} border ${style.border} rounded-lg px-3 py-2 cursor-grab active:cursor-grabbing hover:brightness-125 transition ${
                              draggedId === a.id ? "opacity-40" : ""
                            }`}
                          >
                            <p className={`text-sm font-medium ${style.text}`}>{a.customer}</p>
                            <p className="text-xs text-white/30">{a.type} - {a.duration}min</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Month View */}
        {view === "month" && (
          <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
            <div className="grid grid-cols-7 border-b border-white/5">
              {DAYS.map(d => (
                <div key={d} className="p-3 text-center text-xs text-white/30 font-semibold">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {(() => {
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                const cells = [];
                for (let i = 0; i < firstDay.getDay(); i++) cells.push(<div key={`e${i}`} className="border-t border-l border-white/5 min-h-[80px] p-2" />);
                for (let d = 1; d <= lastDay.getDate(); d++) {
                  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                  const isToday = d === today.getDate();
                  const dayAppts = appointments.filter(a => a.date === dateStr);
                  cells.push(
                    <div key={d} className={`border-t border-l border-white/5 min-h-[80px] p-2 ${isToday ? "bg-amber/5" : ""}`}>
                      <p className={`text-xs font-bold mb-1 ${isToday ? "text-amber" : "text-white/40"}`}>{d}</p>
                      <div className="space-y-0.5">
                        {dayAppts.slice(0, 2).map(a => {
                          const style = typeStyle(a.type);
                          return (
                            <div
                              key={a.id}
                              onClick={() => setSelectedAppt(a)}
                              className={`${style.bg} rounded px-1 py-0.5 text-[9px] ${style.text} truncate cursor-pointer hover:brightness-125 transition`}
                            >
                              {a.time} {a.customer.split(" ")[0]}
                            </div>
                          );
                        })}
                        {dayAppts.length > 2 && <p className="text-[9px] text-white/20">+{dayAppts.length - 2} more</p>}
                      </div>
                    </div>
                  );
                }
                return cells;
              })()}
            </div>
          </div>
        )}

        {/* Client Detail Panel (slide-over) */}
        {selectedAppt && (
          <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedAppt(null)}>
            <div className="bg-black/50 absolute inset-0" />
            <div
              className="relative w-full max-w-md bg-[#0f1d32] border-l border-white/10 h-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-[#0f1d32] border-b border-white/5 p-5 z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ${typeStyle(selectedAppt.type).bg} ${typeStyle(selectedAppt.type).text}`}>
                      {selectedAppt.customer.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedAppt.customer}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${typeStyle(selectedAppt.type).bg} ${typeStyle(selectedAppt.type).text}`}>
                        {selectedAppt.type}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedAppt(null)} className="text-white/30 hover:text-white text-xl p-1">&times;</button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Appointment Details */}
                <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Appointment Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-white/40">Date</span>
                      <span className="text-sm text-white font-medium">{new Date(selectedAppt.date + "T12:00:00").toLocaleDateString("default", { weekday: "short", month: "short", day: "numeric" })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-white/40">Time</span>
                      <span className="text-sm text-white font-medium">{selectedAppt.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-white/40">Duration</span>
                      <span className="text-sm text-white font-medium">{selectedAppt.duration} min</span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Contact Info</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-white/40">Phone</span>
                      <span className="text-sm text-amber">{selectedAppt.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-white/40">Email</span>
                      <span className="text-sm text-white">{selectedAppt.email}</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Interest */}
                <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Vehicle Interest</h4>
                  <p className="text-sm text-white">{selectedAppt.vehicle}</p>
                </div>

                {/* Notes */}
                <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Notes</h4>
                  <p className="text-sm text-white/60">{selectedAppt.notes}</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-amber text-navy font-semibold py-2.5 rounded-lg text-sm hover:bg-amber-light transition">
                    Call Client
                  </button>
                  <button className="bg-white/10 text-white/60 font-semibold py-2.5 rounded-lg text-sm hover:bg-white/20 transition">
                    Send Message
                  </button>
                  <button className="bg-white/5 text-white/40 font-medium py-2.5 rounded-lg text-sm hover:bg-white/10 transition">
                    Reschedule
                  </button>
                  <button className="bg-red-500/10 text-red-400/60 font-medium py-2.5 rounded-lg text-sm hover:bg-red-500/20 transition">
                    Cancel
                  </button>
                </div>
              </div>
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
