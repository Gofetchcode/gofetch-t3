const cases = [
  {
    vehicle: "2026 Honda Accord Sport Hybrid",
    client: "Mark T. • Tampa, FL",
    quote: "I was about to pay sticker. GoFetch saved me $3,200 and removed $2,800 in dealer add-ons I didn't even know were optional.",
    stats: [
      { label: "Negotiated", value: "$30,240" },
      { label: "Savings", value: "$3,200", green: true },
      { label: "Add-Ons Removed", value: "$2,800", green: true },
      { label: "Time at Dealer", value: "38 min" },
    ],
  },
  {
    vehicle: "2025 BMW X5 xDrive40i",
    client: "Sarah M. • Orlando, FL",
    quote: "The dealer quoted $68,400. GoFetch got the same car for $62,100 with zero add-ons. The $199 fee was the best money I've ever spent.",
    stats: [
      { label: "Negotiated", value: "$62,100" },
      { label: "Savings", value: "$6,300", green: true },
      { label: "Add-Ons Removed", value: "$3,500", green: true },
      { label: "Time at Dealer", value: "42 min" },
    ],
  },
  {
    vehicle: "2025 Porsche 911 Carrera",
    client: "David L. • St. Petersburg, FL",
    quote: "Saved $14,200 on a car they told me was 'non-negotiable.' GoFetch found allocation at a dealer 200 miles away at $14K under MSRP.",
    stats: [
      { label: "Negotiated", value: "$118,300" },
      { label: "Savings", value: "$14,200", green: true },
      { label: "Add-Ons Removed", value: "$1,200", green: true },
      { label: "Time at Dealer", value: "0 hrs" },
    ],
  },
];

export function Results() {
  return (
    <section id="results" className="py-16 px-4 bg-navy-light/50">
      <div className="max-w-5xl mx-auto">
        <p className="text-amber text-sm font-semibold uppercase tracking-widest text-center mb-3">Real Results</p>
        <h2 className="font-serif text-2xl md:text-3xl text-center text-cream mb-10">
          Recent Wins for Our Clients
        </h2>
        <div className="space-y-6">
          {cases.map((c, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
              <h3 className="font-sans font-semibold text-cream text-lg mb-1">{c.vehicle}</h3>
              <p className="text-sm text-cream/40 mb-3">{c.client}</p>
              <p className="font-serif italic text-cream/70 mb-4">&ldquo;{c.quote}&rdquo;</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {c.stats.map((s, j) => (
                  <div key={j} className="text-center">
                    <div className="text-xs text-cream/30 uppercase tracking-wider mb-1">{s.label}</div>
                    <div className={`font-bold text-lg ${s.green ? "text-green-400" : "text-cream"}`}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
