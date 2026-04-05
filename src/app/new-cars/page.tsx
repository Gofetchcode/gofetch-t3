"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const newCars = [
  { name: "2025 Hyundai Ioniq 5", msrp: "$33,500", tag: "Hot Deal", note: "EV incentives + dealer discounts making this one of the best values in Florida", img: "https://images.unsplash.com/photo-1712193424561-d1e2c09f524e?w=800&h=500&fit=crop&crop=center&q=80", category: "new" },
  { name: "2025 Chevrolet Equinox EV", msrp: "$33,900", tag: "High Demand", note: "GM's most affordable EV — strong dealer incentives available", img: "https://images.unsplash.com/photo-1662010021854-e67c538ea7a9?w=800&h=500&fit=crop&crop=center&q=80", category: "new" },
  { name: "2026 Toyota RAV4 XLE Hybrid", msrp: "$34,295", tag: "Best Seller", note: "#1 selling SUV — we consistently negotiate below invoice", img: "https://images.unsplash.com/photo-1632137924251-fcea5ff46035?w=800&h=500&fit=crop&crop=center&q=80", category: "new" },
  { name: "2025 Kia EV6 Light", msrp: "$35,900", tag: "EV Special", note: "Federal tax credits + dealer markdowns on EV inventory", img: "https://images.unsplash.com/photo-1665127771643-0bc02014da61?w=800&h=500&fit=crop&crop=center&q=80", category: "new" },
  { name: "2026 Honda CR-V Sport Hybrid", msrp: "$33,150", tag: "Popular", note: "Honda's best-selling SUV with excellent fuel economy", img: "https://images.unsplash.com/photo-1681697390363-1142eb46b76d?w=800&h=500&fit=crop&crop=center&q=80", category: "new" },
  { name: "2025 Nissan Ariya Engage", msrp: "$36,830", tag: "Clearance", note: "Dealers moving EV inventory — big savings available", img: "https://images.unsplash.com/photo-1604755539279-73061b613133?w=800&h=500&fit=crop&crop=center&q=80", category: "new" },
];

const exoticCars = [
  { name: "2025 Porsche 911 Carrera", msrp: "$115,400", tag: "Exotic Tier", note: "Porsche loyalty incentives and allocation advantages available", img: "https://images.unsplash.com/photo-1748606331782-41ecb53bd016?w=800&h=500&fit=crop&crop=center&q=80", category: "exotic" },
  { name: "2025 BMW M4 Competition", msrp: "$82,900", tag: "Exotic Tier", note: "BMW currently offering competitive conquest rates", img: "https://images.unsplash.com/photo-1744782558819-061b352200fa?w=800&h=500&fit=crop&crop=center&q=80", category: "exotic" },
  { name: "2025 Mercedes-AMG C63 S", msrp: "$87,500", tag: "Exotic Tier", note: "Hybrid AMG powertrain — dealer inventory available", img: "https://images.unsplash.com/photo-1751467928449-aa58e7662a39?w=800&h=500&fit=crop&crop=center&q=80", category: "exotic" },
  { name: "2025 Audi RS e-tron GT", msrp: "$109,800", tag: "Exotic Tier", note: "EV incentives creating significant savings opportunities", img: "https://images.unsplash.com/photo-1528597469186-bddab681a37f?w=800&h=500&fit=crop&crop=center&q=80", category: "exotic" },
  { name: "2025 Maserati Grecale GT", msrp: "$63,500", tag: "Exotic Tier", note: "Strong dealer incentives on current inventory", img: "https://images.unsplash.com/photo-1573939843793-2da032b19f94?w=800&h=500&fit=crop&crop=center&q=80", category: "exotic" },
  { name: "2025 Range Rover Sport", msrp: "$86,600", tag: "Exotic Tier", note: "Current model year clearance pricing available", img: "https://images.unsplash.com/photo-1555404610-4f6162df064d?w=800&h=500&fit=crop&crop=center&q=80", category: "exotic" },
];

const exclusiveDeals = [
  { name: "2026 Toyota Camry XSE", msrp: "$32,200", tag: "Exclusive", note: "GoFetch negotiated pricing — $2,800 below MSRP guaranteed. Limited allocation.", img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=500&fit=crop&crop=center&q=80", category: "exclusive" },
  { name: "2025 Tesla Model Y Long Range", msrp: "$44,990", tag: "Exclusive", note: "Pre-negotiated fleet pricing extended to GoFetch clients. No markup.", img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=500&fit=crop&crop=center&q=80", category: "exclusive" },
  { name: "2025 BMW X3 30e xDrive", msrp: "$49,900", tag: "Exclusive", note: "GoFetch partner dealer — $4,200 below sticker with loyalty bonus stacking.", img: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=500&fit=crop&crop=center&q=80", category: "exclusive" },
];

type Tab = "new" | "exotic" | "exclusive";

export default function VehiclesPage() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("new");

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "exclusive") setTab("exclusive");
    else if (t === "exotic") setTab("exotic");
  }, [searchParams]);

  const vehicles = tab === "new" ? newCars : tab === "exotic" ? exoticCars : exclusiveDeals;
  const isDark = tab === "exotic";

  return (
    <div className={isDark ? "bg-navy min-h-screen" : "bg-offwhite min-h-screen"}>
      {/* Hero */}
      <section className="relative bg-navy text-white py-24 md:py-28 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-20 w-72 h-72 rounded-full bg-amber blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-amber blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-4">Browse Our Vehicles</p>
          <h1 className="text-4xl md:text-5xl lg:text-7xl leading-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Find Your <span className="text-amber">Perfect Car</span>
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
            We negotiate below invoice on every vehicle. From everyday drivers to exotic supercars.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className={`sticky top-14 md:top-16 z-40 ${isDark ? "bg-navy/95" : "bg-offwhite/95"} backdrop-blur-md border-b ${isDark ? "border-white/5" : "border-gray-200"}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center gap-1 py-3 overflow-x-auto">
          <button
            onClick={() => setTab("new")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              tab === "new"
                ? "bg-amber text-navy shadow-md"
                : isDark ? "text-white/50 hover:text-white hover:bg-white/5" : "text-navy/50 hover:text-navy hover:bg-gray-100"
            }`}
          >
            New Cars
          </button>
          <button
            onClick={() => setTab("exotic")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              tab === "exotic"
                ? "bg-amber text-navy shadow-md"
                : isDark ? "text-white/50 hover:text-white hover:bg-white/5" : "text-navy/50 hover:text-navy hover:bg-gray-100"
            }`}
          >
            Exotic &amp; Luxury
          </button>
        </div>
      </div>

      {/* Vehicle Grid */}
      <section className="py-10 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Exclusive Deals Banner */}
          {tab === "exclusive" && (
            <div className="bg-gradient-to-r from-amber/15 to-transparent border border-amber/25 rounded-2xl p-6 md:p-8 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <img src="/logo-icon-dark.png" alt="GoFetch" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h3 className="text-lg font-bold text-navy" style={{ fontFamily: "var(--font-display)" }}>GoFetch Exclusive Deals</h3>
                  <p className="text-xs text-warm-600">Pre-negotiated pricing only available through GoFetch Auto</p>
                </div>
              </div>
              <p className="text-sm text-warm-600 leading-relaxed">These deals are negotiated directly with our preferred dealer partners. Pricing is locked in — no haggling, no surprises. Available exclusively to GoFetch clients.</p>
            </div>
          )}

          {/* Exotic Info Banner */}
          {tab === "exotic" && (
            <div className="bg-amber/10 border border-amber/20 rounded-2xl p-6 mb-8 text-center">
              <span className="text-amber text-xs font-bold uppercase tracking-widest">$1,999 Exotic Tier — White-Glove Concierge Service</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {vehicles.map((v) => (
              <div
                key={v.name}
                className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? "bg-navy-light border border-white/8 hover:border-amber/40 hover:shadow-xl hover:shadow-amber/5"
                    : "bg-white shadow-sm border border-gray-100 hover:shadow-xl"
                }`}
              >
                <div className={`relative h-48 md:h-56 overflow-hidden ${isDark ? "bg-navy-800" : "bg-gray-100"}`}>
                  <img
                    src={v.img}
                    alt={v.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-navy-light via-transparent to-transparent" : "bg-gradient-to-t from-black/40 via-transparent to-transparent"}`} />
                  {v.tag && (
                    <span className={`absolute top-3 right-3 text-[10px] font-bold px-3 py-1 rounded-full ${
                      v.category === "exclusive"
                        ? "bg-amber text-navy shadow-md"
                        : v.category === "exotic"
                        ? "bg-amber/20 backdrop-blur-sm text-amber border border-amber/30"
                        : "bg-white/90 backdrop-blur-sm text-navy shadow-sm"
                    }`}>
                      {v.tag}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-4">
                    <p className="text-white text-lg font-bold drop-shadow-lg">{v.name}</p>
                  </div>
                  {isDark && <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent" />}
                </div>

                <div className="p-5 md:p-6">
                  <p className={`text-sm mb-1 ${isDark ? "text-white/40" : "text-muted"}`}>
                    From <span className={`font-bold text-xl ${isDark ? "text-white" : "text-navy"}`}>{v.msrp}</span> MSRP
                  </p>
                  {v.note && <p className={`text-[12px] leading-relaxed mb-3 ${isDark ? "text-white/40" : "text-muted"}`}>{v.note}</p>}
                  <p className="text-xs text-amber font-semibold mb-4">
                    {v.category === "exotic" ? "\u2726 $1,999 Concierge Service" : v.category === "exclusive" ? "\u2726 GoFetch Exclusive Price" : "\u2193 We negotiate below invoice"}
                  </p>
                  <Link
                    href="/car-finder"
                    className="block text-center bg-amber text-navy font-bold py-3 md:py-3.5 rounded-xl hover:bg-amber-light transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Get This Deal
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-navy text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Don&rsquo;t See Your Car?
          </h2>
          <p className="text-white/60 mb-8 text-sm md:text-base">
            We can locate and negotiate any make or model statewide. Tell us what you want and we&rsquo;ll handle the rest.
          </p>
          <Link
            href="/car-finder"
            className="inline-block bg-amber text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-light transition-all duration-200 shadow-lg shadow-amber/20"
          >
            Start Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
