const tiers = [
  { name: "Standard", price: "$99", desc: "Most new vehicles", features: ["Honda, Toyota, Hyundai, Kia, Ford, Chevy, etc.", "Full negotiation + add-on removal", "Itemized deal breakdown", "Customer portal access"] },
  { name: "Premium", price: "$199", desc: "Premium brands", features: ["BMW, Mercedes, Audi, Lexus, Genesis, etc.", "Everything in Standard", "Priority scheduling", "White-glove delivery coordination"], featured: true },
  { name: "Exotic", price: "$1,299", desc: "Supercars & Ultra-Luxury", features: ["Ferrari, Lamborghini, Porsche, Bentley, etc.", "Everything in Premium", "Nationwide inventory search", "Concierge-level service"] },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-amber text-sm font-semibold uppercase tracking-widest text-center mb-3">Transparent Pricing</p>
        <h2 className="font-serif text-2xl md:text-3xl text-center text-cream mb-4">
          One Fee. No Surprises. That&rsquo;s the Whole Point.
        </h2>
        <p className="text-center text-cream/50 text-sm mb-10 max-w-xl mx-auto">
          If we can&rsquo;t save you more than our fee, you pay nothing.
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {tiers.map((t) => (
            <a
              key={t.name}
              href="#consultation"
              className={`rounded-xl p-6 border transition hover:-translate-y-1 block ${
                t.featured
                  ? "bg-amber/10 border-amber/40 shadow-lg shadow-amber/10"
                  : "bg-white/[0.03] border-white/[0.06] hover:border-amber/20"
              }`}
            >
              {t.featured && (
                <span className="inline-block bg-amber text-navy text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  Most Popular
                </span>
              )}
              <div className="font-serif text-sm text-cream/50 mb-1">{t.name}</div>
              <div className="font-serif text-4xl text-amber font-bold mb-1">{t.price}</div>
              <div className="text-sm text-cream/40 mb-4">{t.desc}</div>
              <ul className="space-y-2">
                {t.features.map((f, i) => (
                  <li key={i} className="text-sm text-cream/60 flex items-start gap-2">
                    <span className="text-amber mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
            </a>
          ))}
        </div>
        <p className="text-center text-cream/30 text-xs mt-6">
          Fee due only at &ldquo;Deal Agreed&rdquo; milestone. Secure payment via Stripe.
        </p>
      </div>
    </section>
  );
}
