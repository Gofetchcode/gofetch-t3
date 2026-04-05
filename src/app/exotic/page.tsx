import Link from "next/link";

const vehicles = [
  { name: "2025 Porsche 911 Carrera", msrp: "$115,400", note: "Porsche loyalty incentives and allocation advantages available", img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&h=400&fit=crop&q=80" },
  { name: "2025 BMW M4 Competition", msrp: "$82,900", note: "BMW currently offering competitive conquest rates", img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=400&fit=crop&q=80" },
  { name: "2025 Mercedes-AMG C63 S", msrp: "$87,500", note: "Hybrid AMG powertrain — dealer inventory available", img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop&q=80" },
  { name: "2025 Audi RS e-tron GT", msrp: "$109,800", note: "EV incentives creating significant savings opportunities", img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop&q=80" },
  { name: "2025 Maserati Grecale GT", msrp: "$63,500", note: "Strong dealer incentives on current inventory", img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop&q=80" },
  { name: "2025 Range Rover Sport", msrp: "$86,600", note: "Current model year clearance pricing available", img: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&h=400&fit=crop&q=80" },
];

export default function ExoticPage() {
  return (
    <div className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="relative text-white py-24 md:py-28 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-amber/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-amber/5 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-block bg-amber/15 border border-amber/30 text-amber text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-6">
            $1,999 Exotic Tier
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl leading-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Premium &amp; <span className="text-amber">Exotic</span> Vehicles
          </h1>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto">
            White-glove advocacy for high-end purchases. Concierge-level service from first call to delivery at your door.
          </p>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {vehicles.map((v) => (
            <div
              key={v.name}
              className="group bg-navy-light border border-white/8 rounded-2xl overflow-hidden hover:border-amber/40 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Vehicle Image */}
              <div className="relative h-44 md:h-56 overflow-hidden">
                <img
                  src={v.img}
                  alt={v.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-light/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent" />
              </div>

              <div className="p-5 md:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block bg-amber/15 border border-amber/30 text-amber text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                    Exotic
                  </span>
                  <span className="inline-block bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                    Concierge
                  </span>
                </div>

                <h3 className="text-lg md:text-xl text-white mb-2 font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  {v.name}
                </h3>
                <p className="text-sm text-white/40 mb-1">
                  From <span className="font-bold text-white text-lg">{v.msrp}</span> MSRP
                </p>
                {v.note && <p className="text-[11px] text-white/40 leading-relaxed mb-3">{v.note}</p>}
                <p className="text-xs text-amber font-semibold mb-4 flex items-center gap-1.5">
                  &#10022; $1,999 Exotic Tier &mdash; concierge service
                </p>
                <Link
                  href="/car-finder"
                  className="block text-center bg-amber text-navy font-bold py-3 md:py-3.5 rounded-xl hover:bg-amber-light transition-all duration-200 shadow-lg shadow-amber/10"
                >
                  Get This Deal
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 px-4 md:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-3">Exotic Tier Includes</p>
            <h2 className="text-2xl md:text-4xl text-white" style={{ fontFamily: "var(--font-display)" }}>
              White-Glove Service
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {[
              { title: "Dedicated Concierge", desc: "A single point of contact who manages every detail of your purchase from start to finish." },
              { title: "Priority Negotiation", desc: "Leveraging dealer principal relationships and wholesale networks to secure pricing below what's publicly available." },
              { title: "White-Glove Delivery", desc: "Vehicle delivered to your door, detailed, inspected, and ready. We handle title, registration, and insurance coordination." },
            ].map((f) => (
              <div key={f.title} className="bg-white/[0.03] border border-white/5 rounded-xl p-6 md:p-8 hover:border-amber/20 transition-all duration-300">
                <h3 className="text-white font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Looking for Something <span className="text-amber">Specific?</span>
          </h2>
          <p className="text-white/50 mb-8 text-sm md:text-base">We source any exotic or luxury vehicle statewide. Tell us what you want.</p>
          <Link href="/car-finder" className="inline-block bg-amber text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-light transition-all duration-200 shadow-lg shadow-amber/20">
            Start Exotic Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
