"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",          label: "Overview",  icon: "📊" },
  { href: "/dashboard/artists",  label: "Artists",   icon: "🎸" },
  { href: "/dashboard/albums",   label: "Albums",    icon: "💿" },
  { href: "/dashboard/songs",    label: "Songs",     icon: "🎵" },
  { href: "/dashboard/analyses", label: "Analyses",  icon: "📝" },
  { href: "/dashboard/tags",     label: "Tags",      icon: "🏷️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <Link href="/" className="text-lg font-bold text-white">
          Lyric<span className="text-purple-400">Venture</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-purple-600 text-white font-medium"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-zinc-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <span>🌐</span>
          View Site
        </Link>
      </div>
    </aside>
  );
}