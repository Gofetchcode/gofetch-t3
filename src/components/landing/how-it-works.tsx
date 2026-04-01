const steps = [
  { num: "1", title: "Tell Us What You Want", text: "Free discovery call. 15 minutes. Tell us: what car, your budget, your timeline, and any must-haves. Zero pressure." },
  { num: "2", title: "We Negotiate Everything", text: "We search inventory, negotiate with dealer principals, remove forced add-ons, and present you with a fully itemized deal — before you commit." },
  { num: "3", title: "You Drive Away. We Handle the Rest.", text: "You approve the price, we coordinate all paperwork, and you pick up your car. Total time at a dealership: under 45 minutes." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-4 bg-navy-light/50">
      <div className="max-w-4xl mx-auto">
        <p className="text-amber text-sm font-semibold uppercase tracking-widest text-center mb-3">How It Works</p>
        <h2 className="font-serif text-2xl md:text-3xl text-center text-cream mb-12">
          Three Steps to a Better Deal
        </h2>
        <div className="flex flex-col md:flex-row gap-8 md:gap-4 items-start">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="w-14 h-14 rounded-full bg-amber text-navy font-bold text-xl flex items-center justify-center mx-auto mb-4">
                {s.num}
              </div>
              <h3 className="font-sans font-semibold text-cream mb-2">{s.title}</h3>
              <p className="text-sm text-cream/50 leading-relaxed">{s.text}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block w-16 h-0.5 bg-amber/20 mx-auto mt-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
