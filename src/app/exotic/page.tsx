import Link from "next/link";

const vehicles = [
  { name: "2026 Porsche Cayenne", msrp: "$76,550" },
  { name: "2026 BMW X5 M50i", msrp: "$83,900" },
  { name: "2026 Mercedes-Benz GLE 450", msrp: "$68,400" },
  { name: "2026 Audi Q7 Premium Plus", msrp: "$64,800" },
  { name: "2026 Land Rover Defender", msrp: "$72,300" },
  { name: "2026 Lexus LX 600", msrp: "$98,500" },
];

export default function ExoticPage() {
  return (
    <div className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="relative text-white py-28 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-amber/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-amber/5 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-block bg-amber/15 border border-amber/30 text-amber text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-6">
            $1,299 Exotic Tier
          </div>
          <h1
            className="text-5xl md:text-7xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Premium &amp; <span className="text-amber">Exotic</span> Vehicles
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            White-glove advocacy for high-end purchases. Concierge-level service from
            first call to delivery at your door.
          </p>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v) => (
            <div
              key={v.name}
              className="group bg-navy-light border border-white/8 rounded-2xl overflow-hidden hover:border-amber/40 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Placeholder Image */}
              <div className="relative h-56 bg-gradient-to-br from-navy-800 to-navy flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-white/10 mx-auto mb-2"
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
                  <p className="text-xs text-white/15 font-medium">Vehicle Image</p>
                </div>
                {/* Gold accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-amber/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                {/* Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block bg-amber/15 border border-amber/30 text-amber text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Exotic Tier
                  </span>
                  <span className="inline-block bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Concierge
                  </span>
                </div>

                <h3
                  className="text-xl text-white mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {v.name}
                </h3>
                <p className="text-sm text-white/40 mb-1">
                  From <span className="font-bold text-white text-lg">{v.msrp}</span> MSRP
                </p>
                <p className="text-xs text-amber font-semibold mb-6 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  $1,299 Exotic Tier &mdash; concierge service
                </p>
                <Link
                  href="/car-finder"
                  className="block text-center bg-amber text-navy font-bold py-3.5 rounded-xl hover:bg-amber-light transition-colors duration-200 shadow-lg shadow-amber/10"
                >
                  Get This Deal
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-3">Exotic Tier Includes</p>
            <h2
              className="text-3xl md:text-4xl text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              White-Glove Service
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Dedicated Concierge",
                desc: "A single point of contact who manages every detail of your purchase from start to finish.",
              },
              {
                title: "Priority Negotiation",
                desc: "Leveraging dealer principal relationships and wholesale networks to secure pricing below what's publicly available.",
              },
              {
                title: "Door-to-Door Delivery",
                desc: "Your vehicle delivered to your home or office, fully detailed and ready to drive. Zero dealership time.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white/5 border border-white/8 rounded-2xl p-8 hover:border-amber/30 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-amber/15 text-amber flex items-center justify-center mb-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl md:text-4xl text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Don&rsquo;t See Your Dream Car?
          </h2>
          <p className="text-white/50 mb-10">
            We source any luxury or exotic vehicle. Tell us the make, model, and spec &mdash;
            we&rsquo;ll find it and negotiate the best deal.
          </p>
          <Link
            href="/car-finder"
            className="inline-block bg-amber hover:bg-amber-light text-navy font-bold px-10 py-4 rounded-full transition-colors duration-200 shadow-lg shadow-amber/20"
          >
            Request a Concierge Search
          </Link>
        </div>
      </section>
    </div>
  );
}
