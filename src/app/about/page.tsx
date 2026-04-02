import Link from "next/link";

const values = [
  {
    title: "Transparency",
    description:
      "Every number, every fee, every detail — laid bare. We show you exactly what the dealer pays and exactly what you should pay. No hidden markups, no surprises at signing.",
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
      "We sit on YOUR side of the table. Our job is to protect your budget, negotiate relentlessly, and ensure every dollar works in your favor — not the dealership's.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Zero Pressure",
    description:
      "No upsells, no urgency tactics, no \"let me talk to my manager\" games. You review everything on your own time, approve at your own pace, and walk away anytime.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <section className="bg-navy text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-4">
            Our Story
          </p>
          <h1
            className="text-5xl md:text-6xl mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built by an Insider.{" "}
            <span className="text-amber">For the Buyer.</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            After more than a decade inside the automotive industry, we saw
            exactly how the system was designed — and it wasn&apos;t designed for you.
            GoFetch Auto was born to change that.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Placeholder image */}
          <div className="bg-navy/5 rounded-2xl aspect-[4/5] flex items-center justify-center border border-navy/10">
            <div className="text-center text-navy/30">
              <svg className="w-16 h-16 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <p className="text-sm font-medium">Founder Photo</p>
            </div>
          </div>

          <div>
            <h2
              className="text-3xl md:text-4xl text-navy mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              10+ Years on the Inside
            </h2>
            <div className="space-y-4 text-warm-600 leading-relaxed">
              <p>
                For over a decade, our founder worked deep inside the automotive
                industry — from the showroom floor to the finance office. He saw
                every tactic, every markup, and every pressure play that
                dealerships use to maximize their profit at the buyer&apos;s expense.
              </p>
              <p>
                The four-square worksheet. The &quot;manager approval&quot; game. The
                last-minute add-ons slipped into paperwork. The artificially
                inflated rates. He watched good people overpay by thousands
                because the system was designed to confuse them.
              </p>
              <p>
                One day, he decided to stop working for the dealership and start
                working for the buyer. GoFetch Auto was born from that decision
                — a service that takes everything he learned on the inside and
                uses it to protect the people on the other side of the desk.
              </p>
              <p className="text-navy font-semibold">
                Now, every strategy, every negotiation playbook, and every
                insider trick works for you — not against you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-4">
              What We Stand For
            </p>
            <h2
              className="text-3xl md:text-4xl text-navy"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center p-8 rounded-2xl border border-navy/5 hover:border-amber/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-amber/10 text-amber rounded-xl flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-navy mb-3">
                  {value.title}
                </h3>
                <p className="text-warm-600 leading-relaxed text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-4">
            Our Mission
          </p>
          <h2
            className="text-3xl md:text-4xl text-navy mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Representation You Deserve
          </h2>
          <p className="text-warm-600 leading-relaxed text-lg mb-8">
            Our mission is simple: to be the professional representation
            that&apos;s been missing from the second-biggest purchase of your life.
            We believe every car buyer deserves an expert in their corner —
            someone who knows the game, fights for the best deal, and never
            profits from steering you wrong. GoFetch Auto exists so you can buy
            a car with confidence, clarity, and zero regret.
          </p>
          <Link
            href="/car-finder"
            className="inline-flex items-center gap-2 bg-amber hover:bg-amber-light text-navy font-semibold px-8 py-4 rounded-full transition-colors duration-200"
          >
            Start Your Journey
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
