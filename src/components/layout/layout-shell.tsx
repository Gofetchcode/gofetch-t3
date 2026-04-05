"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Nav } from "./nav";
import { Footer } from "./footer";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDealer = pathname?.startsWith("/dealer");
  const isFleet = pathname?.startsWith("/fleet");
  const isCarFinder = pathname === "/car-finder";

  if (isDealer || isFleet) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Floating CTA — hidden on car-finder page (already there) */}
      {!isCarFinder && (
        <Link
          href="/car-finder"
          className="fixed bottom-6 right-6 z-50 bg-amber text-navy font-bold px-5 py-3.5 rounded-full shadow-xl shadow-amber/30 hover:bg-amber-light hover:scale-105 hover:shadow-2xl transition-all duration-300 text-sm flex items-center gap-2"
        >
          <span className="text-lg">&#9993;</span>
          Free Consultation
        </Link>
      )}
    </>
  );
}
