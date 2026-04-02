"use client";

import { useState, useEffect } from "react";

interface TimelineEvent {
  step: string;
  date: string;
  detail: string;
}

export function DealReplay({ events, totalDays, avgDays }: { events: TimelineEvent[]; totalDays: number; avgDays: number }) {
  const [playing, setPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);

  useEffect(() => {
    if (!playing) return;
    if (currentIdx >= events.length - 1) { setPlaying(false); return; }
    const timer = setTimeout(() => setCurrentIdx(i => i + 1), 800);
    return () => clearTimeout(timer);
  }, [playing, currentIdx, events.length]);

  const start = () => { setCurrentIdx(-1); setPlaying(true); setTimeout(() => setCurrentIdx(0), 100); };
  const speedDiff = avgDays > 0 ? Math.round(((avgDays - totalDays) / avgDays) * 100) : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-navy">Deal Replay</h3>
        <button onClick={start} className="bg-amber text-navy font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-amber-light transition">
          {playing ? "Replaying..." : "▶ Replay Deal"}
        </button>
      </div>
      <div className="space-y-3">
        {events.map((e, i) => (
          <div key={i} className={`flex items-start gap-3 transition-all duration-500 ${i <= currentIdx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i <= currentIdx ? "bg-amber text-navy" : "bg-gray-100 text-muted"}`}>
              {i <= currentIdx ? "✓" : i + 1}
            </div>
            <div>
              <p className="text-sm font-medium text-navy">{e.step}</p>
              <p className="text-xs text-muted">{e.date} — {e.detail}</p>
            </div>
          </div>
        ))}
      </div>
      {currentIdx >= events.length - 1 && (
        <div className="mt-4 bg-green-50 rounded-lg p-3 text-center border border-green-100">
          <p className="text-sm font-bold text-green-700">Deal completed in {totalDays} days</p>
          {speedDiff > 0 && <p className="text-xs text-green-600">🚀 {speedDiff}% faster than average ({avgDays} days)</p>}
        </div>
      )}
    </div>
  );
}
