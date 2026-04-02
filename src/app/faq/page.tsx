"use client";

import { useState } from "react";

const faqs = [
  { q: "How does GoFetch Auto work?", a: "You tell us what car you want. We research, negotiate, and handle the entire deal — you just approve the price and pick up the keys. Most clients spend zero hours at a dealership." },
  { q: "How much does the service cost?", a: "Standard vehicles: $99. Premium brands (BMW, Mercedes, Audi, etc.): $199. Exotic/supercars (Ferrari, Porsche, Lamborghini, etc.): $1,299. If we can't save you more than our fee, you pay nothing." },
  { q: "What types of vehicles can you help with?", a: "Any make, any model — new, used, CPO, exotic, luxury, trucks, SUVs, sedans. We negotiate every category." },
  { q: "How much can I expect to save?", a: "Average client savings: $3,400 — combining negotiated price reductions and forced dealer add-on removal. Some clients save $6,000+." },
  { q: "Do I ever have to go to the dealership?", a: "For pickup: under 45 minutes. For delivery: zero. Many clients never step foot in a dealership." },
  { q: "How long does the process take?", a: "Most clients go from discovery call to keys in hand within 1-3 weeks, depending on vehicle availability and how quickly you'd like to move." },
  { q: "What if I'm not happy with the deal?", a: "You approve every deal before we move forward. If you don't like it, we keep negotiating or you walk away — no fee charged." },
  { q: "Do you work with specific dealerships?", a: "We work with every dealership. Zero affiliations, zero kickbacks. Our fee comes from you only, so our interests are 100% aligned with yours." },
  { q: "How do I track my deal progress?", a: "Through your Client Portal. Real-time step tracking, document uploads, messaging, and payment — all in one place." },
  { q: "Is my personal information secure?", a: "Yes. We use a dual anonymity system — dealers never see your personal info, and you don't see the dealer until the deal is done. All data is encrypted." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="pt-20">
      <section className="bg-navy py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-4">FAQ</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-lg">Everything you need to know about working with GoFetch Auto.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-offwhite">
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left text-navy font-semibold hover:bg-gray-50 transition"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{f.q}</span>
                <span className={`text-amber text-xl transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-warm-600 leading-relaxed border-t border-gray-50 pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
