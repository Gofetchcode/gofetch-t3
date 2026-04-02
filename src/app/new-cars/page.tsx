import Link from "next/link";

const vehicles = [
  { name: "2026 Toyota RAV4 XLE Hybrid", msrp: "$34,295" },
  { name: "2026 Honda CR-V Sport", msrp: "$33,150" },
  { name: "2026 Hyundai Tucson SEL", msrp: "$31,550" },
  { name: "2026 Kia Sportage HEV", msrp: "$33,990" },
  { name: "2026 Mazda CX-5 Turbo", msrp: "$36,250" },
  { name: "2026 Subaru Outback Limited", msrp: "$37,895" },
];

export default function NewCarsPage() {
  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <section className="relative bg-navy text-white py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-20 w-72 h-72 rounded-full bg-amber blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-amber blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-4">New Car Specials</p>
          <h1
            className="text-5xl md:text-7xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Popular <span className="text-amber">New Vehicles</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            We negotiate below invoice on every one of these. Our $99 flat fee saves you thousands.
          </p>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v) => (
            <div
              key={v.name}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Placeholder Image */}
              <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-navy/15 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={0.75}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-9H5.625c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <p className="text-xs text-navy/20 font-medium">Vehicle Image</p>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">View Details</span>
                </div>
              </div>

              <div className="p-6">
                <h3
                  className="text-xl text-navy mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {v.name}
                </h3>
                <p className="text-sm text-muted mb-1">
                  From <span className="font-bold text-navy text-lg">{v.msrp}</span> MSRP
                </p>
                <p className="text-xs text-amber font-semibold mb-6 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                  </svg>
                  We negotiate below invoice
                </p>
                <Link
                  href="/car-finder"
                  className="block text-center bg-amber text-navy font-bold py-3.5 rounded-xl hover:bg-amber-light transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Get This Deal
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-navy text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl md:text-4xl mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Don&rsquo;t See Your Car?
          </h2>
          <p className="text-white/60 mb-8">
            We can locate and negotiate any make or model. Tell us what you want and
            we&rsquo;ll handle the rest.
          </p>
          <Link
            href="/car-finder"
            className="inline-block bg-amber hover:bg-amber-light text-navy font-bold px-10 py-4 rounded-full transition-colors duration-200 shadow-lg shadow-amber/20"
          >
            Start a Custom Search
          </Link>
        </div>
      </section>
    </div>
  );
}
