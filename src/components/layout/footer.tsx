import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy text-white pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        {/* Brand — bigger logo */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo-icon.jpeg" alt="GoFetch Auto" className="w-12 h-12 rounded-xl object-cover" />
            <span style={{ fontFamily: "var(--font-display)" }} className="text-2xl tracking-wide">
              <span className="text-amber">GoFetch</span> <span className="text-white">Auto</span>
            </span>
          </div>
          <p className="text-sm text-white/40 leading-relaxed">
            Your personal car buying advocate. Professional representation for the second-biggest purchase of your life.
          </p>
        </div>

        {/* Pages */}
        <div>
          <h4 className="font-semibold text-sm mb-4 text-white/80">Pages</h4>
          <div className="flex flex-col gap-2.5 text-sm text-white/40">
            <Link href="/" className="hover:text-white transition-all duration-200">Home</Link>
            <Link href="/about" className="hover:text-white transition-all duration-200">Our Story</Link>
            <Link href="/how-it-works" className="hover:text-white transition-all duration-200">How It Works</Link>
            <Link href="/new-cars" className="hover:text-white transition-all duration-200">New Cars</Link>
            <Link href="/exotic" className="hover:text-white transition-all duration-200">Exotic & Luxury</Link>
            <Link href="/car-finder" className="hover:text-white transition-all duration-200">Free Consultation</Link>
            <Link href="/faq" className="hover:text-white transition-all duration-200">FAQ</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-sm mb-4 text-white/80">Contact</h4>
          <div className="flex flex-col gap-2.5 text-sm text-white/40">
            <a href="tel:+13524105889" className="hover:text-white transition-all duration-200">(352) 410-5889</a>
            <a href="mailto:inquiry@gofetchauto.com" className="hover:text-white transition-all duration-200">inquiry@gofetchauto.com</a>
            <p>Tampa Bay, Florida</p>
            <p>Mon-Sat 9am-6pm</p>
          </div>
        </div>

        {/* Portals */}
        <div>
          <h4 className="font-semibold text-sm mb-4 text-white/80">Portals</h4>
          <div className="flex flex-col gap-2.5 text-sm text-white/40">
            <Link href="/portal" className="hover:text-white transition-all duration-200">Client Portal</Link>
            <Link href="/dealer" className="hover:text-white transition-all duration-200">Admin Portal</Link>
          </div>
          <div className="flex gap-3 mt-6">
            <a href="https://www.instagram.com/gofetchauto" target="_blank" rel="noopener" className="text-white/30 hover:text-amber transition-all duration-200 text-lg">IG</a>
            <a href="https://www.tiktok.com/@gofetchauto" target="_blank" rel="noopener" className="text-white/30 hover:text-amber transition-all duration-200 text-lg">TT</a>
            <a href="https://www.facebook.com/gofetchauto" target="_blank" rel="noopener" className="text-white/30 hover:text-amber transition-all duration-200 text-lg">FB</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/20">
        <span>&copy; {new Date().getFullYear()} GoFetch Auto LLC. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-white/40 transition-all duration-200">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white/40 transition-all duration-200">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
