"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/new-cars", label: "New Cars" },
  { href: "/exotic", label: "Exotic" },
  { href: "/car-finder", label: "Car Finder" },
  { href: "/contact", label: "Contact" },
  { href: "https://fleet.gofetchauto.com", label: "Fleet", external: true },
  { href: "/portal", label: "My Portal", cta: true },
  { href: "/dealer", label: "Dealer", muted: true },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled ? "bg-navy/98 backdrop-blur-lg shadow-lg" : "bg-navy"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-icon.jpeg" alt="GoFetch Auto" className="w-8 h-8 rounded-lg object-cover" />
          <span style={{ fontFamily: "var(--font-display)" }} className="text-xl text-white">
            GoFetch <span className="text-amber">Auto</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const cls = (l as any).cta
              ? "ml-2 bg-amber text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-light transition"
              : (l as any).muted
              ? "ml-1 px-3 py-2 text-sm text-white/30 hover:text-white/60 transition"
              : "px-3 py-2 text-sm text-white/60 hover:text-white transition";
            return (l as any).external ? (
              <a key={l.label} href={l.href} className={cls}>{l.label}</a>
            ) : (
              <Link key={l.label} href={l.href} className={cls}>{l.label}</Link>
            );
          })}
          <DarkModeToggle />
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`w-5 h-0.5 bg-white transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-white transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-white transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-navy-light border-t border-white/5 px-4 py-4 flex flex-col gap-1 animate-slide-in">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className={
                (l as any).cta
                  ? "bg-amber text-navy px-4 py-3 rounded-lg font-semibold text-center mt-2"
                  : (l as any).muted
                  ? "text-white/30 py-3 px-2 text-sm text-center"
                  : "text-white/60 hover:text-white py-3 px-2 text-sm border-b border-white/5"
              }
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
