export function CTA() {
  return (
    <section id="consultation" className="py-20 px-4 bg-navy-light/50">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-serif italic text-cream/60 text-lg mb-6">
          &ldquo;For the first time in my life, buying a car wasn&rsquo;t a nightmare. It was actually... easy.&rdquo;
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">
          Ready to Buy Your Next Car Without the Games?
        </h2>
        <p className="text-cream/50 mb-8">
          Free. No commitment. No pressure. Just find out what your car should actually cost — based on numbers the dealer doesn&rsquo;t want you to see.
        </p>
        <a
          href="#consultation-form"
          className="inline-block bg-amber text-navy px-10 py-4 rounded-lg font-bold text-lg hover:bg-amber-light transition shadow-lg shadow-amber/20"
        >
          Start Your Free Consultation
        </a>
        <p className="text-cream/20 text-xs mt-4">No credit card required. No obligation.</p>
      </div>
    </section>
  );
}
