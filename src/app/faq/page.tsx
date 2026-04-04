"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    q: "How does GoFetch Auto work?",
    a: "You tell us what car you want. We research, negotiate, and handle the entire deal — you just approve the price and pick up the keys. Most clients spend zero hours at a dealership.",
  },
  {
    q: "How much does the service cost?",
    a: "Standard vehicles: $199. Premium brands (BMW, Mercedes, Audi, etc.): $299. Exotic/supercars (Ferrari, Porsche, Lamborghini, etc.): $1,999. If we can't save you more than our fee, you pay nothing.",
  },
  {
    q: "How much can I expect to save?",
    a: "Average client savings: $3,400 — combining negotiated price reductions and forced dealer add-on removal. Some clients save $6,000+ on a single transaction.",
  },
  {
    q: "How long does the process take?",
    a: "Most clients go from discovery call to keys in hand within 1-3 weeks, depending on vehicle availability and how quickly you'd like to move. Some in-stock deals close in under a week.",
  },
  {
    q: "What types of vehicles can you help with?",
    a: "Any make, any model — new, used, certified pre-owned, exotic, luxury, trucks, SUVs, sedans. We negotiate every category across all major brands.",
  },
  {
    q: "Do I ever have to go to the dealership?",
    a: "For pickup: under 45 minutes total. For delivery: zero. Many clients never step foot in a dealership. We coordinate everything remotely.",
  },
  {
    q: "What if I have a trade-in?",
    a: "We handle that too. We'll get competing offers from multiple dealers and wholesale buyers to ensure you get the highest value for your trade-in, not just whatever the selling dealer offers.",
  },
  {
    q: "What if I'm not happy with the deal you negotiate?",
    a: "You approve every deal before we move forward. If you don't like it, we keep negotiating or you walk away — no fee charged. You're never locked in.",
  },
  {
    q: "Is my personal information secure?",
    a: "Absolutely. We use a dual anonymity system — dealers never see your personal info during negotiation, and you don't see the dealer until the deal is done. All data is encrypted with industry-standard SSL/TLS.",
  },
  {
    q: "Do you work with specific dealerships or get kickbacks?",
    a: "No affiliations, no kickbacks, no dealer relationships that compromise our advocacy. Our fee comes from you only, so our interests are 100% aligned with yours. We work with every dealership.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <section className="relative bg-navy text-white py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-40 w-72 h-72 rounded-full bg-amber blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-4">FAQ</p>
          <h1
            className="text-5xl md:text-7xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Frequently Asked <span className="text-amber">Questions</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Everything you need to know about working with GoFetch Auto.
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                open === i
                  ? "border-amber/30 shadow-lg shadow-amber/5"
                  : "border-gray-100 shadow-sm hover:shadow-md"
              }`}
            >
              <button
                className="w-full flex items-center justify-between px-7 py-6 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="flex items-center gap-4">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-300 ${
                      open === i
                        ? "bg-amber text-navy"
                        : "bg-offwhite text-muted group-hover:bg-amber/10 group-hover:text-amber"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-navy font-semibold text-[15px] leading-snug">{f.q}</span>
                </span>
                <svg
                  className={`w-5 h-5 text-amber shrink-0 ml-4 transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  open === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-7 pb-6 pl-19 text-warm-600 leading-relaxed text-sm border-t border-gray-50 pt-4 ml-12">
                  {f.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-navy text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl md:text-4xl mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Still Have Questions?
          </h2>
          <p className="text-white/60 mb-8">
            We&rsquo;re happy to chat. Reach out anytime &mdash; no pressure, no obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full transition-colors duration-200 border border-white/10"
            >
              Contact Us
            </Link>
            <Link
              href="/car-finder"
              className="inline-block bg-amber hover:bg-amber-light text-navy font-bold px-8 py-4 rounded-full transition-colors duration-200 shadow-lg shadow-amber/20"
            >
              Start Your Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
