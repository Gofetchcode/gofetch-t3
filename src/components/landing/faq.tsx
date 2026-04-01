"use client";

import { useState } from "react";

const faqs = [
  { q: "How much does GoFetch Auto cost?", a: "Standard vehicles $99, Premium $199, Exotic $1,299. If we can't save you more than our fee, you pay nothing." },
  { q: "How much can I expect to save?", a: "Average savings of $3,400 per client including price negotiation and dealer add-on removal." },
  { q: "Will I lose control of the process?", a: "Never. You choose the car. You approve the price. You make every decision. We handle the parts you hate." },
  { q: "Do you get kickbacks from dealerships?", a: "Zero. Our fee comes from you and only you — our financial interest is 100% aligned with yours." },
  { q: "What if you can't beat what I'd get on my own?", a: "If we don't think we can add meaningful value, we'll tell you — and give you the tools to do it yourself." },
  { q: "Can I still test drive the car?", a: "Absolutely. We arrange test drives at your convenience — in many cases, we bring the test drive to you." },
  { q: "How long does the process take?", a: "Most clients go from discovery call to keys in hand within 1–3 weeks." },
  { q: "Do you handle trade-ins?", a: "Yes. We negotiate trade-in value separately from the purchase price, so the dealer can't play one number against the other." },
  { q: "Do you work outside of Florida?", a: "Yes. We serve clients nationwide and regularly source vehicles from other states. We handle all logistics, titling, and delivery." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-amber text-sm font-semibold uppercase tracking-widest text-center mb-3">FAQ</p>
        <h2 className="font-serif text-2xl md:text-3xl text-center text-cream mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="border border-white/[0.06] rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left text-cream font-medium text-sm hover:bg-white/[0.02] transition"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {f.q}
                <span className={`text-amber transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-cream/50 leading-relaxed">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
