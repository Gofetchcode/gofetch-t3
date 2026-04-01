import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <div className="text-lg mb-2">
            <span className="font-bold text-amber">GoFetch</span> Auto
          </div>
          <p className="text-sm text-cream/40 leading-relaxed">
            Professional car buying advocacy. Serving nationwide from Tampa Bay, FL.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-cream mb-3">Pages</h4>
          <div className="flex flex-col gap-2 text-sm text-cream/40">
            <Link href="/" className="hover:text-cream transition">Home</Link>
            <a href="#how-it-works" className="hover:text-cream transition">How It Works</a>
            <a href="#pricing" className="hover:text-cream transition">Pricing</a>
            <a href="#faq" className="hover:text-cream transition">FAQ</a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-cream mb-3">Portals</h4>
          <div className="flex flex-col gap-2 text-sm text-cream/40">
            <Link href="/portal" className="hover:text-cream transition">Customer Portal</Link>
            <Link href="/dealer" className="hover:text-cream transition">Dealer Login</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-cream mb-3">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-cream/40">
            <a href="tel:+13524105889" className="hover:text-cream transition">(352) 410-5889</a>
            <a href="mailto:inquiry@gofetchauto.com" className="hover:text-cream transition">inquiry@gofetchauto.com</a>
            <p>Tampa Bay, Florida</p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-xs text-cream/20">
        &copy; {new Date().getFullYear()} GoFetch Auto LLC. All rights reserved.
      </div>
    </footer>
  );
}
