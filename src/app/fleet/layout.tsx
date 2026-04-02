"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const fleetLinks = [
  { href: "/fleet", label: "Dashboard" },
  { href: "/fleet?tab=orders", label: "Orders" },
  { href: "/dealer", label: "CRM" },
  { href: "/fleet?tab=analytics", label: "Analytics" },
];

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="min-h-screen bg-navy">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? "bg-navy/98 backdrop-blur-lg shadow-lg" : "bg-navy"}`}>
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
          <div className="hidden md:flex items-center gap-1">
            {fleetLinks.map((l) => (
              <Link key={l.label} href={l.href} className="px-3 py-2 text-sm text-white/60 hover:text-white transition">
                {l.label}
              </Link>
            ))}
            <button className="ml-2 px-3 py-2 text-sm text-white/30 hover:text-white/60 transition">Sign Out</button>
          </div>
        </div>
      </nav>
      <div className="pt-16">{children}</div>
      <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-white/20">
        GoFetch Auto Fleet Management &bull; (352) 410-5889 &bull; fleet@gofetchauto.com
      </footer>
    </div>
  );
}
