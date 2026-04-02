"use client";

import { useState, useEffect } from "react";

const TOUR_STEPS = [
  { target: "pipeline", title: "Pipeline View", desc: "Drag customers between columns to update their deal stage. Click any card to view details." },
  { target: "search", title: "Search & Filter", desc: "Search by name, email, phone, or vehicle. Use filter pills to narrow results." },
  { target: "add", title: "Add Clients", desc: "Click '+ Add Client' to manually create a new customer record." },
  { target: "analytics", title: "Analytics", desc: "View conversion funnels, revenue, response times, and team performance." },
  { target: "ai", title: "Fetch AI", desc: "Click the 🤖 button to ask AI anything — lead scores, draft messages, deal insights." },
];

export function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("gf-onboarding-done");
    if (!seen) setShow(true);
  }, []);

  const finish = () => { setShow(false); localStorage.setItem("gf-onboarding-done", "true"); };

  if (!show) return null;

  const s = TOUR_STEPS[step];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={finish} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-amber font-semibold">Step {step + 1} of {TOUR_STEPS.length}</span>
          <button onClick={finish} className="text-muted hover:text-navy text-sm">Skip tour</button>
        </div>
        <h3 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: "var(--font-display)" }}>{s.title}</h3>
        <p className="text-sm text-muted mb-6">{s.desc}</p>
        <div className="flex gap-2">
          {step > 0 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-muted hover:text-navy transition">Back</button>}
          {step < TOUR_STEPS.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="flex-1 bg-amber text-navy font-bold py-2 rounded-lg hover:bg-amber-light transition">Next</button>
          ) : (
            <button onClick={finish} className="flex-1 bg-amber text-navy font-bold py-2 rounded-lg hover:bg-amber-light transition">Get Started!</button>
          )}
        </div>
        <div className="flex gap-1 justify-center mt-4">
          {TOUR_STEPS.map((_, i) => <span key={i} className={`w-2 h-2 rounded-full ${i === step ? "bg-amber" : "bg-gray-200"}`} />)}
        </div>
      </div>
    </div>
  );
}
