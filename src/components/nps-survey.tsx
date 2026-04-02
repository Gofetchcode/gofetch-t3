"use client";

import { useState } from "react";

export function NPSSurvey({ customerName, onSubmit }: { customerName: string; onSubmit: (score: number, comment: string) => void }) {
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <p className="text-4xl mb-3">🙏</p>
        <h3 className="text-xl font-bold text-navy mb-2">Thank you, {customerName}!</h3>
        <p className="text-sm text-muted mb-4">Your feedback helps us improve.</p>
        {score !== null && score >= 9 && (
          <a href="https://g.page/r/gofetchauto/review" target="_blank" rel="noopener" className="inline-block bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:bg-amber-light transition">
            Leave us a Google Review ⭐
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-navy mb-2">How was your experience?</h3>
      <p className="text-sm text-muted mb-4">How likely are you to recommend GoFetch Auto to a friend?</p>
      <div className="flex gap-1 mb-4 justify-center">
        {Array.from({ length: 11 }, (_, i) => (
          <button key={i} onClick={() => setScore(i)} className={`w-9 h-9 rounded-lg text-sm font-bold transition ${
            score === i ? "bg-amber text-navy scale-110" :
            i <= 6 ? "bg-red-50 text-red-400 hover:bg-red-100" :
            i <= 8 ? "bg-amber/10 text-amber hover:bg-amber/20" :
            "bg-green-50 text-green-600 hover:bg-green-100"
          }`}>{i}</button>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted mb-4 px-1">
        <span>Not likely</span><span>Very likely</span>
      </div>
      <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Any additional feedback? (optional)" rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none resize-none mb-3" />
      <button onClick={() => { if (score !== null) { onSubmit(score, comment); setSubmitted(true); } }} disabled={score === null} className="w-full bg-amber text-navy font-bold py-3 rounded-lg hover:bg-amber-light transition disabled:opacity-40">
        Submit Feedback
      </button>
    </div>
  );
}
