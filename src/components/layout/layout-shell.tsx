"use client";

import { usePathname } from "next/navigation";
import { Nav } from "./nav";
import { Footer } from "./footer";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDealer = pathname?.startsWith("/dealer");
  const isFleet = pathname?.startsWith("/fleet");

  if (isDealer || isFleet) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
