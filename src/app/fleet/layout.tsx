"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const fleetLinks = [
  { href: "/fleet", label: "Dashboard" },
  { href: "/fleet/orders", label: "Orders" },
  { href: "/fleet/analytics", label: "Analytics" },
  { href: "/dealer", label: "CRM" },
];

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="min-h-screen bg-navy">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? "bg-navy/98 backdrop-blur-lg shadow-lg" : "bg-navy"} border-b border-white/5`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/fleet" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center">
              <span className="text-navy font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>G</span>
            </div>
            <span style={{ fontFamily: "var(--font-display)" }} className="text-xl text-white">
              GoFetch <span className="text-amber">Auto</span>
            </span>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded">Fleet</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {fleetLinks.map((l) => (
              <Link key={l.label} href={l.href} className="px-3 py-2 text-sm text-white/60 hover:text-white transition">
                {l.label}
              </Link>
            ))}
            <Link href="/" className="ml-2 px-3 py-2 text-sm text-white/30 hover:text-white/60 transition border border-white/10 rounded-lg">
              Sign Out
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={`w-5 h-0.5 bg-white transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-0.5 bg-white transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-0.5 bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0f1d32] border-t border-white/5 px-4 py-4 flex flex-col gap-1">
            {fleetLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-white/60 hover:text-white py-3 px-2 text-sm border-b border-white/5"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/" onClick={() => setMobileOpen(false)} className="text-white/30 py-3 px-2 text-sm text-center mt-2">
              Sign Out
            </Link>
          </div>
        )}
      </nav>
      <div className="pt-16">{children}</div>
      <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-white/20">
        GoFetch Auto Fleet Management &bull; (352) 410-5889 &bull; fleet@gofetchauto.com
      </footer>
    </div>
  );
}
