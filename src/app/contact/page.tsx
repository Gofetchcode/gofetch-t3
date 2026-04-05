"use client";

import { useState } from "react";

const contactInfo = [
  {
    label: "Phone",
    value: "(352) 410-5889",
    href: "tel:+13524105889",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: "inquiry@gofetchauto.com",
    href: "mailto:inquiry@gofetchauto.com",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "Service Area",
    value: "Tampa, St. Petersburg, Lakeland, FL",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    label: "Hours",
    value: "Mon\u2013Sat 9am\u20136pm EST",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const [sending, setSending] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("https://formspree.io/f/xjgaqeyy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, _subject: `Contact: ${form.name}` }),
      });
    } catch {}
    setSending(false);
    setSent(true);
  };

  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <section className="relative bg-navy text-white py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-10 left-20 w-80 h-80 rounded-full bg-amber blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-4">Contact Us</p>
          <h1
            className="text-5xl md:text-7xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get in <span className="text-amber">Touch</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Questions? We&rsquo;d love to hear from you. No pressure, no obligation.
          </p>
        </div>
      </section>

      {/* Split Layout */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12">
          {/* Form — Left */}
          <div className="md:col-span-3">
            <h2
              className="text-2xl md:text-3xl text-navy mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Send a Message
            </h2>

            {sent ? (
              <div className="bg-white border border-green-200 rounded-2xl p-10 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Message Sent!</h3>
                <p className="text-warm-600 text-sm">We&rsquo;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="John Smith"
                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm text-navy placeholder:text-muted focus:border-amber focus:ring-1 focus:ring-amber/20 outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="john@example.com"
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm text-navy placeholder:text-muted focus:border-amber focus:ring-1 focus:ring-amber/20 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">Phone</label>
                    <input
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="(555) 123-4567"
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm text-navy placeholder:text-muted focus:border-amber focus:ring-1 focus:ring-amber/20 outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">Message</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={set("message")}
                    placeholder="How can we help you?"
                    rows={5}
                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm text-navy placeholder:text-muted focus:border-amber focus:ring-1 focus:ring-amber/20 outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-amber text-navy font-bold py-4 rounded-xl text-base hover:bg-amber-light transition-colors duration-200 shadow-md shadow-amber/15 disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info — Right */}
          <div className="md:col-span-2">
            <h2
              className="text-2xl md:text-3xl text-navy mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contact Info
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber/10 text-amber flex items-center justify-center shrink-0 mt-0.5">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs text-amber font-semibold uppercase tracking-widest mb-1">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-navy font-medium hover:text-amber transition-colors">
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-navy font-medium">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick CTA */}
            <div className="mt-8 bg-navy rounded-2xl p-8 text-center">
              <p className="text-white/60 text-sm mb-3">Ready to find your car?</p>
              <a
                href="/car-finder"
                className="inline-block bg-amber hover:bg-amber-light text-navy font-bold px-6 py-3 rounded-xl transition-colors duration-200 text-sm"
              >
                Start Consultation
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
