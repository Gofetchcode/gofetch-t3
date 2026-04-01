"use client";

import { useState } from "react";
import Link from "next/link";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-sans text-xl">
            <span className="font-bold text-amber">GoFetch</span>
            <span className="font-normal text-cream"> Auto</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-cream/60">
          <a href="#how-it-works" className="hover:text-cream transition">How It Works</a>
          <a href="#pricing" className="hover:text-cream transition">Pricing</a>
          <a href="#results" className="hover:text-cream transition">Results</a>
          <a href="#faq" className="hover:text-cream transition">FAQ</a>
          <Link href="/portal" className="hover:text-cream transition">My Portal</Link>
          <a
            href="#consultation"
            className="bg-amber text-navy px-4 py-2 rounded-lg font-semibold hover:bg-amber-light transition"
          >
            Free Consultation
          </a>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`w-5 h-0.5 bg-cream transition ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-cream transition ${open ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-cream transition ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-navy-light border-t border-white/5 px-4 py-4 flex flex-col gap-3 text-sm">
          <a href="#how-it-works" onClick={() => setOpen(false)} className="text-cream/60 hover:text-cream py-2">How It Works</a>
          <a href="#pricing" onClick={() => setOpen(false)} className="text-cream/60 hover:text-cream py-2">Pricing</a>
          <a href="#results" onClick={() => setOpen(false)} className="text-cream/60 hover:text-cream py-2">Results</a>
          <a href="#faq" onClick={() => setOpen(false)} className="text-cream/60 hover:text-cream py-2">FAQ</a>
          <Link href="/portal" className="text-cream/60 hover:text-cream py-2">My Portal</Link>
          <a href="#consultation" onClick={() => setOpen(false)} className="bg-amber text-navy px-4 py-3 rounded-lg font-semibold text-center">Free Consultation</a>
        </div>
      )}
    </nav>
  );
}
