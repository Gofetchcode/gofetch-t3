"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="pt-20">
      <section className="bg-navy py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-4">Contact Us</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Get in Touch
          </h1>
          <p className="text-gray-400 text-lg">Questions? We&rsquo;d love to hear from you.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-offwhite">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Send a Message</h2>
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <p className="text-3xl mb-2">✅</p>
                <p className="font-bold text-green-800">Message sent!</p>
                <p className="text-sm text-green-600 mt-1">We&rsquo;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <input placeholder="Full Name" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none" />
                <input type="email" placeholder="Email" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none" />
                <input placeholder="Phone" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none" />
                <textarea placeholder="Your message..." rows={5} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none resize-none" />
                <button onClick={() => setSent(true)} className="w-full bg-amber text-navy font-bold py-3 rounded-lg hover:bg-amber-light transition">
                  Send Message
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Contact Info</h2>
            <div className="space-y-6">
              {[
                { icon: "📞", label: "Phone", value: "(352) 410-5889", href: "tel:+13524105889" },
                { icon: "✉️", label: "Email", value: "inquiry@gofetchauto.com", href: "mailto:inquiry@gofetchauto.com" },
                { icon: "📍", label: "Service Area", value: "Tampa, St. Petersburg, Lakeland, FL" },
                { icon: "🕐", label: "Hours", value: "Mon–Sat 9am–6pm EST" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="text-xs text-amber font-semibold uppercase tracking-wider">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-navy font-medium hover:text-amber transition">{c.value}</a>
                    ) : (
                      <p className="text-navy font-medium">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
