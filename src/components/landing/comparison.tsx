const cards = [
  { icon: "🏢", title: "Buying Real Estate", text: "You get a buyer's broker" },
  { icon: "📜", title: "Negotiating Contracts", text: "You get an attorney" },
  { icon: "💰", title: "Managing Finances", text: "You get a CFO" },
  { icon: "🚗", title: "Buying a Car?", text: "You walk in alone. Against professionals. On their turf. Until now.", highlight: true },
];

export function Comparison() {
  return (
    <section className="py-16 px-4 bg-navy-light/50">
      <div className="max-w-5xl mx-auto">
        <p className="text-amber text-sm font-semibold uppercase tracking-widest text-center mb-3">The Structural Fix</p>
        <h2 className="font-serif text-2xl md:text-3xl text-center text-cream mb-10">
          Every High-Stakes Negotiation Has Professional Representation — Except One
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <div
              key={i}
              className={`rounded-xl p-6 border transition ${
                c.highlight
                  ? "bg-amber/10 border-amber/40 shadow-lg shadow-amber/10"
                  : "bg-white/[0.03] border-white/[0.06] hover:border-amber/20"
              }`}
            >
              <div className="text-2xl mb-3">{c.icon}</div>
              <h3 className="font-sans font-semibold text-cream text-sm mb-2">{c.title}</h3>
              <p className={`text-sm ${c.highlight ? "text-amber font-medium" : "text-cream/50"}`}>{c.text}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-cream/50 text-sm mt-8 max-w-2xl mx-auto">
          A car buying advocate does for your purchase what a real estate broker does for your home — applies professional-grade knowledge so you stop leaving money on the table.
        </p>
      </div>
    </section>
  );
}
