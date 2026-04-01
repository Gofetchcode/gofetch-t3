export function Hero() {
  return (
    <section className="pt-28 pb-16 px-4 lg:pt-36 lg:pb-24">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-amber text-sm font-semibold uppercase tracking-widest mb-4">
            Professional Car Buying Advocacy
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-cream mb-6">
            The Dealership Spent 40 Years Perfecting How to Take Your Money.{" "}
            <em className="text-amber">We Spent 10 Years Learning How to Stop Them.</em>
          </h1>
          <p className="text-cream/60 text-lg mb-8 max-w-xl">
            GoFetch Auto is the car buying representation that dealers don&rsquo;t want you to know exists. We negotiate your next car — so you never have to.
          </p>
          <a
            href="#consultation"
            className="inline-block bg-amber text-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-light transition shadow-lg shadow-amber/20"
          >
            Get Your Free Consultation
          </a>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {[
              { num: "$3,400", label: "Average Savings" },
              { num: "0 hrs", label: "At Dealerships" },
              { num: "200+", label: "Happy Buyers" },
              { num: "4.9 ★", label: "Google Reviews" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-bold text-amber">{s.num}</div>
                <div className="text-xs text-cream/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="/hero.png"
            alt="Professional car buying advocacy"
            className="w-full max-w-md rounded-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
