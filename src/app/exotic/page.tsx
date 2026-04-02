import Link from "next/link";

const vehicles = [
  { name: "2026 Porsche Cayenne", msrp: "$76,550", img: "🏎️" },
  { name: "2025 BMW X5 M50i", msrp: "$83,900", img: "🏎️" },
  { name: "2026 Mercedes-Benz GLE 450", msrp: "$68,400", img: "🏎️" },
  { name: "2025 Audi Q7 Premium Plus", msrp: "$64,800", img: "🏎️" },
  { name: "2026 Land Rover Defender", msrp: "$72,300", img: "🏎️" },
  { name: "2025 Lexus LX 600", msrp: "$98,500", img: "🏎️" },
];

export default function ExoticPage() {
  return (
    <div className="pt-20">
      <section className="bg-navy py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-4">Exotic & Luxury</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Premium & Exotic Vehicles
          </h1>
          <p className="text-gray-400 text-lg">White-glove advocacy for high-end purchases. $1,299 Exotic Tier.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-navy-light">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div key={v.name} className="bg-navy border border-white/10 rounded-xl overflow-hidden hover:border-amber/40 hover:-translate-y-1 transition-all">
              <div className="h-48 bg-navy-800 flex items-center justify-center text-6xl">{v.img}</div>
              <div className="p-5">
                <span className="inline-block bg-amber/20 text-amber text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-3">Premium</span>
                <h3 className="font-bold text-white text-lg mb-1">{v.name}</h3>
                <p className="text-sm text-white/40 mb-1">From <span className="font-bold text-white">{v.msrp}</span> MSRP</p>
                <p className="text-xs text-amber font-medium mb-4">$1,299 Exotic Tier — concierge service</p>
                <Link href="/car-finder" className="block text-center bg-amber text-navy font-semibold py-3 rounded-lg hover:bg-amber-light transition">
                  Get This Deal
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
