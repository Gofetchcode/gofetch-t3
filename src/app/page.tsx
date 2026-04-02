"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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

        <div className="relative max-w-5xl mx-auto">
          <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-6">
            Your Personal Car Buying Advocate
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl mb-6">
            What If Buying a Car Actually{" "}
            <em
              className="text-amber not-italic"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <i>Felt Good?</i>
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
              Find Your Perfect Car
            </Link>
            <a
              href="#sound-familiar"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white font-semibold text-sm uppercase tracking-wider transition"
            >
              See How It Works <span aria-hidden="true">&darr;</span>
            </a>
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

      {/* ─── 4. STATS ────────────────────────────────────────────── */}
      <section className="bg-navy-light py-20 lg:py-28 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <CounterStat end={3400} prefix="$" suffix="+" label="Average Savings" />
          <CounterStat end={0} suffix=" Hrs" label="At Dealerships" />
          <CounterStat end={200} suffix="+" label="Happy Buyers" />
          <div className="text-center">
            <div
              ref={undefined}
              className="text-4xl md:text-5xl font-bold text-amber mb-2"
            >
              4.9&thinsp;&#9733;
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">
              Google Reviews
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. THE DIFFERENCE ───────────────────────────────────── */}
      <section className="bg-offwhite py-20 lg:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            The Difference
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-12 max-w-2xl">
            What makes GoFetch different from doing it yourself?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {differences.map((d, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="text-3xl mb-4">{d.icon}</div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-1">
                    Traditional
                  </p>
                  <p className="text-navy/70">{d.traditional}</p>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-1">
                    GoFetch
                  </p>
                  <p className="text-navy font-semibold">{d.goFetch}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. CTA ──────────────────────────────────────────────── */}
      <section className="bg-navy py-20 lg:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Buy a Car{" "}
            <span className="text-amber">Without the Games?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Let us handle the negotiation, the paperwork, and the dealership.
            You just pick the car you love.
          </p>
          <Link
            href="/car-finder"
            className="inline-block bg-amber text-navy px-10 py-4 rounded-lg font-bold text-lg hover:bg-amber-light transition shadow-lg shadow-amber/20"
          >
            Find Your Perfect Car
          </Link>
        </div>
      </section>
    </>
  );
}
