const cards = [
  { title: "Someone in Your Corner — Not the Dealer's", text: "Zero dealership affiliations. Zero kickbacks. We work for you — not the dealer. Every dollar we save goes to you." },
  { title: "Stop Losing Your Saturdays to Dealerships", text: "Average car purchase DIY: 12+ hours. Average with GoFetch: zero. You never set foot in a dealership." },
  { title: "The $2,500-$3,500 You're Leaving Behind", text: "Forced dealer add-ons. Unpublished incentives. Holdback margins. We find every dollar — because we know where they hide them." },
  { title: "Every Fee. Every Dollar. Itemized.", text: "No surprises at signing. Full transparency on invoice cost, negotiated price, fees, and savings — before you commit to anything." },
];

export function WhyGoFetch() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-amber text-sm font-semibold uppercase tracking-widest text-center mb-3">Why GoFetch</p>
        <h2 className="font-serif text-2xl md:text-3xl text-center text-cream mb-10">
          The Advantage You&rsquo;ve Been Missing
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
              <h3 className="font-sans font-semibold text-cream mb-2">{c.title}</h3>
              <p className="text-sm text-cream/50 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
