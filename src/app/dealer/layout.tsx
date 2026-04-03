"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const CRM_NAV = [
  { href: "/dealer", label: "Dashboard", icon: "◧" },
  { href: "/dealer/tasks", label: "Tasks", icon: "☑" },
  { href: "/dealer/calendar", label: "Calendar", icon: "◯" },
  { href: "/dealer/communications", label: "Messages", icon: "✉" },
  { href: "/dealer/analytics", label: "Analytics", icon: "◈" },
  { href: "/dealer/import", label: "Import", icon: "⬆" },
  { href: "/dealer/settings", label: "Settings", icon: "⚙" },
];

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show sidebar on the main dealer page (it has its own full layout)
  if (pathname === "/dealer") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-navy flex pt-16">
      {/* CRM Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-navy-light border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-white/5">
          <Link href="/dealer" className="flex items-center gap-2">
            <img src="/logo-icon.jpeg" alt="GoFetch CRM" className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <span className="text-sm font-bold text-white">GoFetch <span className="text-amber">CRM</span></span>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1">
          {CRM_NAV.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dealer" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-amber/15 text-amber font-semibold"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to Site */}
        <div className="p-3 border-t border-white/5">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/20 hover:text-white/40 transition">
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
