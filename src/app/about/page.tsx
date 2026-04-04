import Link from "next/link";

const values = [
  {
    title: "Transparency",
    description:
      "Every dollar, every fee, every line item — laid bare. We show you exactly what the dealer sees so you can make informed decisions with zero guesswork.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Advocacy",
    description:
      "We sit on YOUR side of the table. Our job is to fight for the best price, the cleanest deal, and the terms that actually serve you — not the dealership's bottom line.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Zero Pressure",
    description:
      "No upsells. No hidden fees. No urgency tactics. You review every detail at your own pace, approve only when you're ready, and never feel rushed into a decision.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "10+", label: "Years in Automotive" },
  { value: "$3,400", label: "Average Client Savings" },
  { value: "500+", label: "Deals Closed" },
  { value: "100%", label: "Client Satisfaction" },
];

export default function AboutPage() {
  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <section className="relative bg-navy text-white py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-amber blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-4">Our Story</p>
          <h1
            className="text-5xl md:text-7xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built by an Insider.
            <br />
            <span className="text-amber">Designed for You.</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            GoFetch Auto was born from one simple realization: the car buying process is broken,
            and the people who know it best should be the ones fixing it.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-8 px-6 text-center ${
                i < 3 ? "border-r border-gray-100" : ""
              }`}
            >
              <p className="text-3xl md:text-4xl font-bold text-amber mb-1">{s.value}</p>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div>
            <p className="text-amber font-semibold tracking-widest uppercase text-xs mb-3">The Founder</p>
            <h2
              className="text-3xl md:text-5xl text-navy mb-8 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              10+ Years on the Inside
            </h2>
            <div className="space-y-5 text-warm-600 leading-relaxed">
              <p>
                After spending over a decade in the automotive industry, I saw firsthand how the
                system is designed to work against buyers. The markup strategies, the finance office
                upsells, the &ldquo;limited time&rdquo; pressure tactics &mdash; I knew every play
                in the book because I was trained to run them.
              </p>
              <p>
                But something never sat right. I watched families overpay by thousands. I saw
                first-time buyers sign deals they didn&rsquo;t fully understand. And I realized the
                expertise I had could be used differently &mdash; not to sell cars, but to
                <span className="text-navy font-semibold"> advocate for the people buying them</span>.
              </p>
              <p>
                That&rsquo;s why I started GoFetch Auto. I took everything I learned from the
                dealer side and flipped it. Now I work exclusively for the buyer &mdash; negotiating
                below invoice, stripping out junk fees, and making sure every client gets a deal
                they can feel genuinely good about.
              </p>
              <p className="text-navy font-bold text-lg border-l-4 border-amber pl-5 mt-8">
                &ldquo;You deserve someone in your corner. That&rsquo;s exactly where I&rsquo;ll be.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-3">What We Stand For</p>
            <h2
              className="text-3xl md:text-5xl text-navy"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our Core Values
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="group bg-offwhite rounded-2xl p-10 text-center hover:bg-navy hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-full bg-amber/10 text-amber flex items-center justify-center mx-auto mb-6 group-hover:bg-amber/20 transition-colors duration-500">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-white transition-colors duration-500">
                  {v.title}
                </h3>
                <p className="text-warm-600 leading-relaxed text-sm group-hover:text-white/70 transition-colors duration-500">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="relative py-28 px-6 bg-navy text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-4">Our Mission</p>
          <h2
            className="text-3xl md:text-5xl leading-tight mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            To make buying a car feel as good as driving one.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            GoFetch Auto exists to give every buyer the professional representation that&rsquo;s
            been missing from the second-biggest purchase of their life. We believe you
            shouldn&rsquo;t need to be an expert negotiator to get a fair deal &mdash; you just need
            one on your side.
          </p>
          <Link
            href="/car-finder"
            className="inline-block bg-amber hover:bg-amber-light text-navy font-bold px-10 py-4 rounded-full transition-colors duration-200 shadow-lg shadow-amber/20"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
