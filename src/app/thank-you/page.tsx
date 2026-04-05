"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ThankYouPage() {
  const [tempPw, setTempPw] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTempPw(params.get("pw"));
    setClientId(params.get("id"));
  }, []);

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <div className="w-20 h-20 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl text-green-400">&#10003;</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Thank You for <span className="text-amber">Booking!</span>
        </h1>

        <p className="text-white/60 text-lg mb-6 leading-relaxed">
          Your free consultation request has been received. A GoFetch advocate will reach out within 24 hours to discuss your vehicle search.
        </p>

        {/* Portal Credentials */}
        {tempPw && (
          <div className="bg-amber/10 border border-amber/30 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-sm font-bold text-amber uppercase tracking-wider mb-3">Your Client Portal Login</h3>
            <p className="text-white/60 text-sm mb-4">Use these credentials to track your deal progress, upload documents, and communicate with your advocate.</p>
            <div className="space-y-2">
              {clientId && (
                <div className="flex justify-between items-center bg-white/5 rounded-lg px-4 py-3">
                  <span className="text-white/40 text-sm">Client ID</span>
                  <span className="text-white font-mono font-bold text-sm">{clientId}</span>
                </div>
              )}
              <div className="flex justify-between items-center bg-white/5 rounded-lg px-4 py-3">
                <span className="text-white/40 text-sm">Temporary Password</span>
                <span className="text-amber font-mono font-bold text-sm">{tempPw}</span>
              </div>
            </div>
            <p className="text-white/30 text-xs mt-3">Save this password. You&rsquo;ll be asked to change it on first login.</p>
          </div>
        )}

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-8 text-left">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">What Happens Next</h3>
          <div className="space-y-3">
            {[
              { step: "1", text: "We review your vehicle preferences and budget" },
              { step: "2", text: "Your dedicated advocate reaches out to introduce themselves" },
              { step: "3", text: "We start searching and negotiating with dealers on your behalf" },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber/20 text-amber text-xs font-bold flex items-center justify-center flex-shrink-0">{s.step}</span>
                <p className="text-sm text-white/60">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="bg-amber text-navy font-bold px-8 py-3 rounded-xl hover:bg-amber-light transition">
            Back to Home
          </Link>
          {tempPw && (
            <Link href="/portal" className="border border-amber/30 text-amber font-semibold px-8 py-3 rounded-xl hover:bg-amber/10 transition">
              Go to Client Portal
            </Link>
          )}
        </div>

        <p className="text-white/20 text-xs mt-8">
          Questions? Call us at <a href="tel:+13524105889" className="text-amber/60 hover:text-amber">(352) 410-5889</a>
        </p>
      </div>

      {/* Meta Pixel Lead conversion */}
      <script dangerouslySetInnerHTML={{ __html: `if(typeof fbq!=='undefined'){fbq('track','Lead');}` }} />
    </div>
  );
}
