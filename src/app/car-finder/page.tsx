"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ESignModal } from "@/components/e-sign-modal";

const brands = [
  "Toyota", "Honda", "Hyundai", "Kia", "Ford", "Chevrolet",
  "BMW", "Mercedes-Benz", "Audi", "Porsche", "Lexus", "Tesla",
  "Subaru", "Mazda", "Volkswagen", "Jeep",
];

export default function CarFinderPage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    vehicleType: "", budget: "", timeline: "", notes: "",
  });
  const [showContract, setShowContract] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tempPw, setTempPw] = useState("");
  const [clientId, setClientId] = useState("");
  const [error, setError] = useState("");

  const submitMutation = trpc.customer.submitConsultation.useMutation({
    onSuccess: (data) => {
      setTempPw(data.tempPassword);
      setClientId(data.clientId ?? "");
      setSubmitted(true);
      fetch("https://formspree.io/f/xjgaqeyy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, _subject: `New Lead: ${form.firstName} ${form.lastName}` }),
      }).catch(() => {});
    },
    onError: (err) => setError(err.message),
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setShowContract(true);
  };

  const handleSign = (signatureData: string, signatureName: string) => {
    setShowContract(false);
    submitMutation.mutate({
      ...form,
      contractData: { signatureData, signatureName, signedAt: new Date().toISOString() },
      source: "Website",
    });
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <section className="relative bg-navy text-white py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-1/3 w-80 h-80 rounded-full bg-amber blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-amber blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-4">Car Finder</p>
          <h1
            className="text-5xl md:text-7xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Free <span className="text-amber">Consultation</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            15 minutes. No pressure. No obligation. Tell us what you want and we&rsquo;ll
            handle the rest.
          </p>
        </div>
      </section>

      {/* Removed brand marquee */}

      {/* Form Section */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-white rounded-2xl shadow-xl p-10 md:p-12 text-center border border-gray-100">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2
                className="text-3xl text-navy mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Consultation Submitted!
              </h2>
              <p className="text-muted mb-8">Our team will reach out within 24 hours.</p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-offwhite rounded-xl p-6">
                  <p className="text-xs text-amber font-semibold uppercase tracking-widest mb-2">Your Client ID</p>
                  <p className="text-xl font-bold text-navy font-mono">{clientId}</p>
                </div>
                <div className="bg-offwhite rounded-xl p-6">
                  <p className="text-xs text-amber font-semibold uppercase tracking-widest mb-2">Temporary Password</p>
                  <p className="text-xl font-bold text-navy font-mono">{tempPw}</p>
                </div>
              </div>

              <p className="text-xs text-muted mb-6">You&rsquo;ll be asked to change your password on first login.</p>

              <a
                href="/portal"
                className="inline-block bg-amber text-navy font-bold px-10 py-4 rounded-xl hover:bg-amber-light transition-colors duration-200 shadow-md shadow-amber/15"
              >
                Go to Client Portal
              </a>
            </div>
          ) : (
            <form
              onSubmit={handleFormSubmit}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100"
            >
              <h2
                className="text-2xl md:text-3xl text-navy mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tell Us What You&rsquo;re Looking For
              </h2>
              <p className="text-muted text-sm mb-8">Fields marked with * are required.</p>

              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">First Name *</label>
                  <input
                    required
                    value={form.firstName}
                    onChange={set("firstName")}
                    placeholder="John"
                    className="w-full bg-offwhite border border-gray-200 rounded-xl px-5 py-4 text-sm text-navy placeholder:text-muted focus:border-amber focus:ring-1 focus:ring-amber/20 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">Last Name *</label>
                  <input
                    required
                    value={form.lastName}
                    onChange={set("lastName")}
                    placeholder="Smith"
                    className="w-full bg-offwhite border border-gray-200 rounded-xl px-5 py-4 text-sm text-navy placeholder:text-muted focus:border-amber focus:ring-1 focus:ring-amber/20 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Contact Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="john@example.com"
                    className="w-full bg-offwhite border border-gray-200 rounded-xl px-5 py-4 text-sm text-navy placeholder:text-muted focus:border-amber focus:ring-1 focus:ring-amber/20 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">Phone *</label>
                  <input
                    required
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="(555) 123-4567"
                    className="w-full bg-offwhite border border-gray-200 rounded-xl px-5 py-4 text-sm text-navy placeholder:text-muted focus:border-amber focus:ring-1 focus:ring-amber/20 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Dropdowns */}
              <div className="space-y-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">Vehicle Type</label>
                  <select
                    value={form.vehicleType}
                    onChange={set("vehicleType")}
                    className="w-full bg-offwhite border border-gray-200 rounded-xl px-5 py-4 text-sm text-navy focus:border-amber focus:ring-1 focus:ring-amber/20 outline-none transition-colors appearance-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238A95A3' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 1rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.25rem" }}
                  >
                    <option value="">Select vehicle type...</option>
                    <option>New Car</option>
                    <option>Used Car</option>
                    <option>Certified Pre-Owned</option>
                    <option>Exotic / Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">Budget Range</label>
                  <select
                    value={form.budget}
                    onChange={set("budget")}
                    className="w-full bg-offwhite border border-gray-200 rounded-xl px-5 py-4 text-sm text-navy focus:border-amber focus:ring-1 focus:ring-amber/20 outline-none transition-colors appearance-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238A95A3' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 1rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.25rem" }}
                  >
                    <option value="">Select budget range...</option>
                    <option>Under $20,000</option>
                    <option>$20,000 - $30,000</option>
                    <option>$30,000 - $40,000</option>
                    <option>$40,000 - $60,000</option>
                    <option>$60,000 - $80,000</option>
                    <option>$80,000 - $100,000</option>
                    <option>$100,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">Timeline</label>
                  <select
                    value={form.timeline}
                    onChange={set("timeline")}
                    className="w-full bg-offwhite border border-gray-200 rounded-xl px-5 py-4 text-sm text-navy focus:border-amber focus:ring-1 focus:ring-amber/20 outline-none transition-colors appearance-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238A95A3' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 1rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.25rem" }}
                  >
                    <option value="">Select timeline...</option>
                    <option>ASAP</option>
                    <option>1-2 Weeks</option>
                    <option>1 Month</option>
                    <option>2-3 Months</option>
                    <option>Just Browsing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">Additional Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Specific models, colors, features, trade-in info, or anything else we should know..."
                    rows={4}
                    className="w-full bg-offwhite border border-gray-200 rounded-xl px-5 py-4 text-sm text-navy placeholder:text-muted focus:border-amber focus:ring-1 focus:ring-amber/20 outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-5">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-amber text-navy font-bold py-4 rounded-xl text-lg hover:bg-amber-light transition-colors duration-200 shadow-lg shadow-amber/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit FREE Consultation Request"
                )}
              </button>
              <p className="text-xs text-muted text-center mt-4">
                No credit card required. You&rsquo;ll sign our representation agreement next.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "$3,400", label: "Avg Savings" },
            { value: "500+", label: "Deals Closed" },
            { value: "24hr", label: "Response Time" },
            { value: "100%", label: "Satisfaction" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl md:text-3xl font-bold text-amber mb-1">{s.value}</p>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* E-Sign Modal */}
      <ESignModal
        isOpen={showContract}
        onClose={() => setShowContract(false)}
        onSign={handleSign}
        customerName={`${form.firstName} ${form.lastName}`}
      />
    </div>
  );
}
