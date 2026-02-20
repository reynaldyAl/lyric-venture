"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Map pathname → judul halaman
const pageTitles: Record<string, string> = {
  "/dashboard":            "Overview",
  "/dashboard/artists":    "Artists",
  "/dashboard/albums":     "Albums",
  "/dashboard/songs":      "Songs",
  "/dashboard/analyses":   "Lyric Analyses",
  "/dashboard/tags":       "Tags",
};

export default function Topbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6">
      {/* Page Title */}
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <p className="text-xs text-zinc-500">LyricVenture Admin Panel</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* View Site shortcut */}
        <Link
          href="/"
          target="_blank"
          className="text-xs text-zinc-400 hover:text-white transition-colors hidden md:block"
        >
          🌐 View Site
        </Link>

        <Separator orientation="vertical" className="h-6 bg-zinc-700" />

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg hover:bg-zinc-800 p-1.5 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="Admin" />
                <AvatarFallback className="bg-purple-600 text-white text-xs font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-zinc-300 hidden md:block">Admin</span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 bg-zinc-900 border-zinc-800 text-zinc-300"
          >
            <DropdownMenuLabel className="text-zinc-400 text-xs">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem
              asChild
              className="hover:bg-zinc-800 hover:text-white cursor-pointer"
            >
              <Link href="/dashboard/profile">👤 Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="hover:bg-red-900/40 hover:text-red-400 cursor-pointer text-red-500">
              🚪 Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}