import Link from "next/link";

export default function ThankYouPage() {
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
          <Link href="/portal" className="border border-white/10 text-white/50 font-semibold px-8 py-3 rounded-xl hover:text-white hover:border-white/20 transition">
            Client Portal
          </Link>
        </div>

        <p className="text-white/20 text-xs mt-8">
          Questions? Call us at <a href="tel:+13524105889" className="text-amber/60 hover:text-amber">(352) 410-5889</a>
        </p>
      </div>

      {/* Conversion tracking pixel */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if(typeof fbq!=='undefined'){fbq('track','Lead');}
            if(typeof gtag!=='undefined'){gtag('event','conversion',{send_to:'AW-CONVERSION_ID/LABEL'});}
          `,
        }}
      />
    </div>
  );
}
