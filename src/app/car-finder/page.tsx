"use client";

import { useState } from "react";

const brands = ["Toyota", "Honda", "Hyundai", "Kia", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", "Audi", "Porsche", "Lexus", "Tesla", "Subaru", "Mazda", "Volkswagen", "Jeep"];

export default function CarFinderPage() {
  const [submitted, setSubmitted] = useState(false);
  const [tempPw, setTempPw] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pw = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
    setTempPw(pw);
    setSubmitted(true);
  };

  return (
    <div className="pt-20">
      <section className="bg-navy py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-4">Car Finder</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Free Consultation
          </h1>
          <p className="text-gray-400 text-lg">15 minutes. No pressure. No obligation. Tell us what you want.</p>
        </div>
      </section>

      {/* Brand Marquee */}
      <div className="bg-navy-light py-4 overflow-hidden border-y border-white/5">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          {[...brands, ...brands].map((b, i) => (
            <span key={i} className="text-white/15 text-sm font-semibold uppercase tracking-widest">{b}</span>
          ))}
        </div>
      </div>

      <section className="py-16 px-4 bg-offwhite">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-100">
              <p className="text-5xl mb-4">🎉</p>
              <h2 className="text-2xl font-bold text-navy mb-2">Consultation Submitted!</h2>
              <p className="text-muted mb-6">Our team will reach out within 24 hours.</p>
              <div className="bg-offwhite rounded-xl p-6 mb-6">
                <p className="text-xs text-amber font-semibold uppercase tracking-wider mb-2">Your Portal Login</p>
                <p className="text-sm text-muted mb-1">Temporary Password:</p>
                <p className="text-2xl font-bold text-navy font-mono">{tempPw}</p>
                <p className="text-xs text-muted mt-2">You&rsquo;ll be asked to change this on first login.</p>
              </div>
              <a href="/portal" className="inline-block bg-amber text-navy font-bold px-8 py-3 rounded-lg hover:bg-amber-light transition">
                Go to Portal →
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-navy mb-6">Tell Us What You&rsquo;re Looking For</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input required placeholder="First Name *" className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none" />
                <input required placeholder="Last Name *" className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none" />
              </div>
              <div className="space-y-4 mb-4">
                <input required type="email" placeholder="Email *" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none" />
                <input required placeholder="Phone *" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none" />
                <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-muted focus:border-amber outline-none">
                  <option>Vehicle Type</option>
                  <option>New Car</option>
                  <option>Used Car</option>
                  <option>Certified Pre-Owned</option>
                  <option>Exotic / Luxury</option>
                </select>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-muted focus:border-amber outline-none">
                  <option>Budget Range</option>
                  <option>Under $20,000</option>
                  <option>$20,000 - $30,000</option>
                  <option>$30,000 - $40,000</option>
                  <option>$40,000 - $60,000</option>
                  <option>$60,000 - $80,000</option>
                  <option>$80,000 - $100,000</option>
                  <option>$100,000+</option>
                </select>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-muted focus:border-amber outline-none">
                  <option>Timeline</option>
                  <option>ASAP</option>
                  <option>1-2 Weeks</option>
                  <option>1 Month</option>
                  <option>2-3 Months</option>
                  <option>Just Browsing</option>
                </select>
                <textarea placeholder="Additional notes — specific models, colors, features, trade-in info..." rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none resize-none" />
              </div>
              <button type="submit" className="w-full bg-amber text-navy font-bold py-4 rounded-lg text-lg hover:bg-amber-light transition shadow-lg shadow-amber/20">
                Submit Free Consultation
              </button>
              <p className="text-xs text-muted text-center mt-3">No credit card required. No obligation.</p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
