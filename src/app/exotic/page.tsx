import Link from "next/link";

const vehicles = [
  { name: "2025 Porsche 911 Carrera", msrp: "$115,400", note: "Porsche loyalty incentives and allocation advantages available", brand: "Porsche", model: "911 Carrera", gradient: "from-[#2D2926] to-[#4A443E]" },
  { name: "2025 BMW M4 Competition", msrp: "$82,900", note: "BMW currently offering competitive conquest rates", brand: "BMW", model: "M4 Competition", gradient: "from-[#1C2541] to-[#3A506B]" },
  { name: "2025 Mercedes-AMG C63 S", msrp: "$87,500", note: "Hybrid AMG powertrain — dealer inventory available", brand: "Mercedes-AMG", model: "C63 S", gradient: "from-[#1A1A2E] to-[#16213E]" },
  { name: "2025 Audi RS e-tron GT", msrp: "$109,800", note: "EV incentives creating significant savings opportunities", brand: "Audi", model: "RS e-tron GT", gradient: "from-[#2B2D42] to-[#5C5D72]" },
  { name: "2025 Maserati Grecale GT", msrp: "$63,500", note: "Strong dealer incentives on current inventory", brand: "Maserati", model: "Grecale GT", gradient: "from-[#0B132B] to-[#1C2541]" },
  { name: "2025 Range Rover Sport", msrp: "$86,600", note: "Current model year clearance pricing available", brand: "Range Rover", model: "Sport", gradient: "from-[#2D3436] to-[#636E72]" },
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
              {/* Vehicle Card Header */}
              <div className={`relative h-40 md:h-48 bg-gradient-to-br ${v.gradient} overflow-hidden flex items-end p-5 md:p-6`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/[0.03] rounded-full translate-y-1/2 -translate-x-1/4" />
                <div className="relative">
                  <p className="text-amber/60 text-xs font-bold uppercase tracking-widest mb-1">{v.brand}</p>
                  <p className="text-white text-xl md:text-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                    {v.model}
                  </p>
                </div>
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
