import Link from "next/link";

const vehicles = [
  { name: "2026 Toyota RAV4 XLE Hybrid", msrp: "$34,295", img: "🚙" },
  { name: "2026 Honda CR-V Sport", msrp: "$33,150", img: "🚙" },
  { name: "2026 Hyundai Tucson SEL", msrp: "$31,550", img: "🚙" },
  { name: "2026 Kia Sportage HEV", msrp: "$33,990", img: "🚙" },
  { name: "2026 Mazda CX-5 Turbo", msrp: "$36,250", img: "🚙" },
  { name: "2026 Subaru Outback Limited", msrp: "$37,895", img: "🚙" },
];

export default function NewCarsPage() {
  return (
    <div className="pt-20">
      <section className="bg-navy py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-4">New Car Specials</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Popular New Vehicles
          </h1>
          <p className="text-gray-400 text-lg">We negotiate below invoice on every one of these. $99 flat fee.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-offwhite">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div key={v.name} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="h-48 bg-gray-50 flex items-center justify-center text-6xl">{v.img}</div>
              <div className="p-5">
                <h3 className="font-bold text-navy text-lg mb-1">{v.name}</h3>
                <p className="text-sm text-muted mb-1">From <span className="font-bold text-navy">{v.msrp}</span> MSRP</p>
                <p className="text-xs text-amber font-medium mb-4">We negotiate below invoice</p>
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
