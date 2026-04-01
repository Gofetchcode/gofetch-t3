const quotes = [
  { text: "I spent 6 hours at a dealership on a Saturday — my only day off — and still felt like I overpaid.", author: "Mark T.", role: "Homeowner, Tampa" },
  { text: "The salesman told me my trade-in was worth $8,000. I found out later it was worth $14,500.", author: "Jessica R.", role: "Teacher, Orlando" },
  { text: "I bought a car online thinking I'd skip the games. They added $4,200 in fees at signing.", author: "David L.", role: "Engineer, St. Pete" },
  { text: "I can negotiate million-dollar contracts. But a car salesman runs circles around me every single time.", author: "Sarah M.", role: "Business Owner" },
];

export function PainQuotes() {
  return (
    <section className="py-16 px-4 bg-navy-light/50">
      <div className="max-w-5xl mx-auto">
        <p className="text-amber text-sm font-semibold uppercase tracking-widest text-center mb-3">Sound Familiar?</p>
        <h2 className="font-serif text-2xl md:text-3xl text-center text-cream mb-10">
          What Nobody Tells You Before You Walk Into a Dealership
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:border-amber/30 transition"
            >
              <p className="font-serif italic text-cream/80 text-lg leading-relaxed mb-4">
                &ldquo;{q.text}&rdquo;
              </p>
              <p className="text-sm text-cream/40">
                — {q.author}, {q.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
