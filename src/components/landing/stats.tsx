const stats = [
  { num: "$3,400", label: "Average Savings" },
  { num: "0 hrs", label: "Client Time at Dealerships" },
  { num: "200+", label: "Happy Buyers" },
  { num: "$2,800", label: "Avg Add-Ons Removed" },
  { num: "4.9 ★", label: "Google Reviews" },
];

export function Stats() {
  return (
    <section className="py-12 px-4 bg-amber/10 border-y border-amber/20">
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 md:gap-12">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber">{s.num}</div>
            <div className="text-xs text-cream/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
