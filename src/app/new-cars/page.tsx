import Link from "next/link";

const vehicles = [
  { name: "2025 Hyundai Ioniq 5", msrp: "$33,500", tag: "Hot Deal", note: "EV incentives + dealer discounts making this one of the best values in Florida", img: "https://images.unsplash.com/photo-1712193424561-d1e2c09f524e?w=800&h=500&fit=crop&crop=center&q=80" },
  { name: "2025 Chevrolet Equinox EV", msrp: "$33,900", tag: "High Demand", note: "GM's most affordable EV — strong dealer incentives available", img: "https://images.unsplash.com/photo-1662010021854-e67c538ea7a9?w=800&h=500&fit=crop&crop=center&q=80" },
  { name: "2026 Toyota RAV4 XLE Hybrid", msrp: "$34,295", tag: "Best Seller", note: "#1 selling SUV — we consistently negotiate below invoice", img: "https://images.unsplash.com/photo-1632137924251-fcea5ff46035?w=800&h=500&fit=crop&crop=center&q=80" },
  { name: "2025 Kia EV6 Light", msrp: "$35,900", tag: "EV Special", note: "Federal tax credits + dealer markdowns on EV inventory", img: "https://images.unsplash.com/photo-1665127771643-0bc02014da61?w=800&h=500&fit=crop&crop=center&q=80" },
  { name: "2026 Honda CR-V Sport Hybrid", msrp: "$33,150", tag: "Popular", note: "Honda's best-selling SUV with excellent fuel economy", img: "https://images.unsplash.com/photo-1681697390363-1142eb46b76d?w=800&h=500&fit=crop&crop=center&q=80" },
  { name: "2025 Nissan Ariya Engage", msrp: "$36,830", tag: "Clearance", note: "Dealers moving EV inventory — big savings available", img: "https://images.unsplash.com/photo-1604755539279-73061b613133?w=800&h=500&fit=crop&crop=center&q=80" },
];

export default function NewCarsPage() {
  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <section className="relative bg-navy text-white py-24 md:py-28 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-20 w-72 h-72 rounded-full bg-amber blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-amber blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-4">New Car Specials</p>
          <h1 className="text-4xl md:text-5xl lg:text-7xl leading-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Popular <span className="text-amber">New Vehicles</span>
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
            We negotiate below invoice on every one of these. Our $199 flat fee saves you thousands.
          </p>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {vehicles.map((v) => (
            <div
              key={v.name}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100">
                <img
                  src={v.img}
                  alt={v.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {v.tag && (
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-navy text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    {v.tag}
                  </span>
                )}
                <div className="absolute bottom-3 left-4">
                  <p className="text-white text-lg font-bold drop-shadow-lg">{v.name}</p>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <p className="text-sm text-muted mb-1">
                  From <span className="font-bold text-navy text-xl">{v.msrp}</span> MSRP
                </p>
                {v.note && <p className="text-[12px] text-muted leading-relaxed mb-3">{v.note}</p>}
                <p className="text-xs text-amber font-semibold mb-4">&#8595; We negotiate below invoice</p>
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
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-navy text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Don&rsquo;t See Your Car?
          </h2>
          <p className="text-white/60 mb-8 text-sm md:text-base">
            We can locate and negotiate any make or model. Tell us what you want and we&rsquo;ll handle the rest.
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
