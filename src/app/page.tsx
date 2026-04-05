"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GoogleReviewsStat } from "@/components/google-reviews-stat";

/* ───────────────────────────── helpers ───────────────────────────── */

function useCountUp(end: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            setValue(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { value, ref };
}

function CounterStat({
  end,
  prefix = "",
  suffix = "",
  label,
}: {
  end: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  const { value, ref } = useCountUp(end);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-amber mb-2">
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm text-gray-400 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

/* ───────────────────────────── data ────────────────────────────── */

const painQuotes = [
  "\u201CI spent 6 hours at a dealership and still felt like I got ripped off.\u201D",
  "\u201CThe finance guy kept adding fees I didn\u2019t understand and I was too embarrassed to ask.\u201D",
  "\u201CI did weeks of research and still paid $4,000 over market value.\u201D",
  "\u201CEvery time I said no, they brought out another manager. I just wanted to leave.\u201D",
  "\u201CI cried in the parking lot after signing. I knew it was a bad deal but I couldn\u2019t stop it.\u201D",
  "\u201CMy credit score dropped because they ran it at 5 different banks without telling me.\u201D",
];

const differences = [
  {
    traditional: "You vs. trained salespeople",
    goFetch: "Professional negotiator on your side",
    icon: "\uD83E\uDD1D",
  },
  {
    traditional: "Hours wasted at dealerships",
    goFetch: "We handle everything, you get the keys",
    icon: "\u23F1\uFE0F",
  },
  {
    traditional: "Hidden fees & pressure tactics",
    goFetch: "Transparent pricing, zero surprises",
    icon: "\uD83D\uDCA1",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <>
      {/* ─── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-navy pt-28 pb-20 lg:pt-40 lg:pb-28 px-4 overflow-hidden">
        {/* subtle radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,162,58,0.12),transparent)]" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-6">
              Your Personal Car Buying Advocate
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Dealerships Train to Take Your Money.{" "}
              <em
                className="text-amber not-italic"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <i>We&rsquo;re Trained to Stop Them.</i>
              </em>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              GoFetch Auto is the professional representation that&rsquo;s been
              missing from the second-biggest purchase of your life. We find your
              car, negotiate the deal, and handle the dealership&mdash;so you get
              the keys without the dread.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link
                href="/car-finder"
                className="inline-block bg-amber text-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-light transition shadow-lg shadow-amber/20"
              >
                Submit FREE Consultation
              </Link>
              <a
                href="#sound-familiar"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white font-semibold text-sm uppercase tracking-wider transition"
              >
                See How It Works <span aria-hidden="true">&darr;</span>
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden lg:block relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-amber/20 to-transparent rounded-3xl blur-2xl" />
            <img src="/hero-image.png" alt="Happy car buyer with keys" className="relative w-full rounded-2xl shadow-2xl shadow-black/40 object-cover aspect-square" />
          </div>

          {/* trust bar */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <span className="text-amber font-bold">200+</span> Buyers
            </span>
            <span className="hidden sm:block w-px h-4 bg-gray-700" />
            <span className="flex items-center gap-2">
              <span className="text-amber font-bold">$3,400</span> Average
              Savings
            </span>
            <span className="hidden sm:block w-px h-4 bg-gray-700" />
            <span className="flex items-center gap-2">
              <span className="text-amber font-bold">Zero</span> Hours at
              Dealerships
            </span>
          </div>
        </div>
      </section>

      {/* ─── 2. SOUND FAMILIAR ───────────────────────────────────── */}
      <section id="sound-familiar" className="bg-offwhite py-20 lg:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            Sound Familiar?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-12 max-w-2xl">
            The car buying experience is broken. And everyone knows it.
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {painQuotes.map((q, i) => (
              <div
                key={i}
                className="border-l-4 border-amber bg-white rounded-r-lg p-6 shadow-sm"
              >
                <p
                  className="text-navy/80 text-lg leading-relaxed"
                  style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
                >
                  {q}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. EMPATHY BLOCK ────────────────────────────────────── */}
      <section className="bg-navy py-20 lg:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-300 text-xl md:text-2xl leading-relaxed mb-8">
            So that knot in your stomach before walking into a dealership? That
            wasn&rsquo;t weakness. That was your instincts telling you the game
            was rigged&mdash;because it was. Nobody taught you how to negotiate a
            car deal, but they&nbsp;trained an entire industry to sell you one.
          </p>
          <p
            className="text-amber text-4xl md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
          >
            Until now.
          </p>
        </div>
      </section>

      {/* ─── THE REAL COST ─────────────────────────────────────── */}
      <section className="bg-offwhite py-20 lg:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-4">The Real Cost</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">What Dealerships Don&rsquo;t Want You to Know</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: "var(--font-display)" }}>Hidden Markup</h3>
              <p className="text-warm-600 text-sm leading-relaxed mb-4">The average car buyer overpays by <span className="text-navy font-bold">$3,000–$5,000</span> because they don&rsquo;t know invoice pricing, holdback amounts, or manufacturer incentives. Dealerships count on this.</p>
              <p className="text-warm-600 text-sm leading-relaxed">We know every number they&rsquo;re hiding — because we used to be the ones hiding them.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: "var(--font-display)" }}>Forced Add-Ons</h3>
              <p className="text-warm-600 text-sm leading-relaxed mb-4">Nitrogen tire fills ($299), paint protection ($899), fabric coating ($499), VIN etching ($399) — dealerships slip <span className="text-navy font-bold">$2,000–$4,000 in junk fees</span> into every deal.</p>
              <p className="text-warm-600 text-sm leading-relaxed">We identify and remove every single one. If it&rsquo;s not bolted to the car, it&rsquo;s coming off the contract.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: "var(--font-display)" }}>The Finance Office</h3>
              <p className="text-warm-600 text-sm leading-relaxed mb-4">After you agree on a price, the F&amp;I manager tries to add extended warranties, GAP insurance, and protection packages — often at <span className="text-navy font-bold">3–4x their actual cost</span>.</p>
              <p className="text-warm-600 text-sm leading-relaxed">We review every line item before you sign. Nothing gets past us.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: "var(--font-display)" }}>Your Time</h3>
              <p className="text-warm-600 text-sm leading-relaxed mb-4">The average car purchase takes <span className="text-navy font-bold">4+ hours at the dealership</span> — designed to wear you down so you&rsquo;ll agree to anything just to leave.</p>
              <p className="text-warm-600 text-sm leading-relaxed">Our clients spend zero hours at dealerships. We handle everything remotely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. STATS ────────────────────────────────────────────── */}
      <section className="bg-navy-light py-20 lg:py-28 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <CounterStat end={3400} prefix="$" suffix="+" label="Average Savings" />
          <CounterStat end={0} suffix=" Hrs" label="At Dealerships" />
          <CounterStat end={200} suffix="+" label="Happy Buyers" />
          <GoogleReviewsStat />
        </div>
      </section>

      {/* ─── SOCIAL PROOF / RECENT CLIENT WINS ────────────────── */}
      <section className="bg-offwhite py-20 lg:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-4">Recent Client Wins</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">Real Savings. Real Clients.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Marcus R.", vehicle: "2025 Toyota RAV4 XLE", saved: "$3,200", quote: "GoFetch saved me $3,200 and I never stepped foot in a dealership. I got a text that my car was ready for pickup. That was it.", location: "Tampa, FL" },
              { name: "Jennifer & David L.", vehicle: "2025 BMW X3 M40i", saved: "$5,800", quote: "We were about to pay sticker price. GoFetch found the same car at a dealer 60 miles away for almost $6K less and had it delivered to us.", location: "St. Petersburg, FL" },
              { name: "Carlos M.", vehicle: "2026 Honda Accord Sport", saved: "$2,400", quote: "I have anxiety about negotiating. Ricardo handled everything. I just signed the paperwork at my kitchen table.", location: "Lakeland, FL" },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-amber text-lg">&#9733;</span>)}
                </div>
                <p className="text-navy/70 text-sm leading-relaxed mb-6" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-semibold text-navy text-sm">{t.name}</p>
                  <p className="text-xs text-warm-600">{t.vehicle}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-warm-600">{t.location}</span>
                    <span className="text-sm font-bold text-emerald-500">Saved {t.saved}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. THE DIFFERENCE ───────────────────────────────────── */}
      <section className="bg-navy py-20 lg:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            The Difference
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 max-w-2xl">
            What makes GoFetch different from doing it yourself?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {differences.map((d, i) => (
              <div
                key={i}
                className="bg-white/[0.05] backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-amber/30 hover:bg-white/[0.08] transition-all duration-300"
              >
                <div className="text-3xl mb-4">{d.icon}</div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-1">
                    Traditional
                  </p>
                  <p className="text-white/50">{d.traditional}</p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                    GoFetch
                  </p>
                  <p className="text-white font-semibold">{d.goFetch}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. PRICING PACKAGES ────────────────────────────────── */}
      <section className="bg-cream py-20 lg:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-4">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">Simple, Flat-Fee Pricing</h2>
            <p className="text-warm-600 mt-3 max-w-xl mx-auto">No hidden fees. No percentage cuts. If we can&rsquo;t save you more than our fee, you pay nothing.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { tier: "Standard", price: "$199", desc: "Honda, Toyota, Hyundai, Kia, Ford, Chevy, and other mainstream brands.", features: ["Full dealer negotiation", "Add-on removal", "Paperwork handling", "Delivery coordination"] },
              { tier: "Premium", price: "$299", desc: "BMW, Mercedes-Benz, Audi, Lexus, and other premium brands.", features: ["Everything in Standard", "Priority service", "Multi-dealer bidding", "Premium brand expertise"], popular: true },
              { tier: "Exotic", price: "$1,999", desc: "Porsche, Ferrari, Lamborghini, Rolls-Royce, and exotic vehicles.", features: ["Everything in Premium", "Dedicated concierge", "Statewide search", "White-glove delivery"] },
            ].map((p) => (
              <div key={p.tier} className={`rounded-2xl p-8 border ${p.popular ? "bg-navy text-white border-amber/40 shadow-2xl shadow-amber/15 relative scale-105" : "bg-white border-gray-200 shadow-md"} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out`}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber text-navy text-xs font-bold px-4 py-1 rounded-full shadow-lg">Most Popular</span>}
                <p className={`text-sm font-semibold uppercase tracking-wider mb-2 text-amber`}>{p.tier}</p>
                <p className={`text-5xl font-bold mb-3 ${p.popular ? "text-white" : "text-navy"}`} style={{ fontFamily: "var(--font-display)" }}>{p.price}</p>
                <p className={`text-sm mb-6 leading-relaxed ${p.popular ? "text-white/60" : "text-warm-600"}`}>{p.desc}</p>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${p.popular ? "text-white/70" : "text-warm-600"}`}>
                      <span className="text-amber text-base">&#10003;</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/car-finder" className={`block text-center font-bold py-4 rounded-xl transition-all duration-200 ${p.popular ? "bg-amber text-navy hover:bg-amber-light hover:shadow-lg" : "bg-navy text-white hover:bg-navy-light hover:shadow-lg"}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────────── */}
      <section className="relative bg-navy py-24 lg:py-32 px-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,162,58,0.10),transparent)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <img src="/logo-icon-dark.png" alt="GoFetch Auto" className="w-20 h-20 rounded-2xl mx-auto mb-8 object-cover shadow-xl shadow-black/30" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Buy a Car{" "}
            <span className="text-amber" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>Without the Games?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-4 max-w-xl mx-auto leading-relaxed">
            Let us handle the negotiation, the paperwork, and the dealership.
            You just pick the car you love.
          </p>
          <p className="text-amber font-semibold text-sm mb-10">It&rsquo;s completely FREE to get started. No obligation.</p>
          <Link
            href="/car-finder"
            className="inline-block bg-amber text-navy px-12 py-5 rounded-xl font-bold text-xl hover:bg-amber-light transition-all duration-300 shadow-xl shadow-amber/30 hover:scale-105 hover:shadow-2xl hover:shadow-amber/40"
          >
            Submit FREE Consultation
          </Link>
          <p className="text-gray-500 text-xs mt-6">(352) 410-5889 &bull; inquiry@gofetchauto.com &bull; Statewide Florida Service</p>
        </div>
      </section>
    </>
  );
}
