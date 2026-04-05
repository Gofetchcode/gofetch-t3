"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

const leftLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Our Story" },
  { href: "/how-it-works", label: "How It Works" },
];

const rightLinks = [
  { href: "/new-cars", label: "Vehicles" },
  { href: "/car-finder", label: "Free Consultation" },
  { href: "/portal", label: "My Portal", cta: true },
];

const allLinks = [
  ...leftLinks,
  { href: "/new-cars?tab=exclusive", label: "exclusive", exclusive: true },
  ...rightLinks,
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const linkCls = "px-3 py-2 text-sm text-white/60 hover:text-white transition-all duration-200";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy/98 backdrop-blur-lg shadow-lg" : "bg-navy"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <img src="/logo-icon-dark.png" alt="GoFetch Auto" className="w-12 h-12 rounded-xl object-cover" />
          <span className="text-[22px] font-medium tracking-wide hidden sm:inline" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <span className="text-amber font-semibold">GoFetch</span>{" "}
            <span className="text-white font-light">Auto</span>
          </span>
        </Link>

        {/* Desktop nav — split layout with GoFetch Exclusive centered */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {/* Left links */}
          {leftLinks.map((l) => (
            <Link key={l.label} href={l.href} className={linkCls}>{l.label}</Link>
          ))}

          {/* CENTER: GoFetch Exclusive */}
          <Link
            href="/new-cars?tab=exclusive"
            className="flex items-center mx-4 py-2 hover:opacity-100 opacity-80 transition-all duration-200 group"
          >
            <img src="/g-icon-transparent.png" alt="G" className="w-9 h-9 object-contain -mr-0.5" />
            <span className="text-base font-semibold text-amber group-hover:text-amber-light transition-all duration-200">oFetch Exclusive</span>
          </Link>

          {/* Right links */}
          {rightLinks.map((l) => (
            (l as any).cta ? (
              <Link key={l.label} href={l.href} className="ml-1 bg-amber text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-light transition-all duration-200">
                {l.label}
              </Link>
            ) : (
              <Link key={l.label} href={l.href} className={linkCls}>{l.label}</Link>
            )
          ))}
          <DarkModeToggle />
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`w-5 h-0.5 bg-white transition-all duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-navy-light border-t border-white/5 px-4 py-4 flex flex-col gap-1 animate-slide-in">
          {allLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className={
                (l as any).cta
                  ? "bg-amber text-navy px-4 py-3 rounded-lg font-semibold text-center mt-2"
                  : (l as any).exclusive
                  ? "flex items-center gap-0 py-3 px-2 text-sm border-b border-amber/10"
                  : "text-white/60 hover:text-white py-3 px-2 text-sm border-b border-white/5 transition-all duration-200"
              }
            >
              {(l as any).exclusive ? (
                <span className="flex items-center gap-0">
                  <img src="/g-icon-transparent.png" alt="G" className="w-6 h-6 object-contain" />
                  <span className="text-amber font-semibold">oFetch Exclusive</span>
                </span>
              ) : l.label}
            </Link>
          ))}
          <div className="flex justify-center pt-2">
            <DarkModeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
