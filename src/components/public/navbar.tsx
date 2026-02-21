"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/songs",    label: "Songs" },
  { href: "/artists",  label: "Artists" },
  { href: "/analyses", label: "Analyses" },
  { href: "/albums",   label: "Albums" },
];

export default function Navbar() {
  const pathname   = usePathname();
  const [open, setOpen] = useState(false);

  // Tutup menu kalau navigasi
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock scroll saat menu terbuka
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b"
        style={{
          background: "rgba(244, 243, 240, 0.92)",
          borderColor: "#E2E0DB",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-5 md:px-6 max-w-5xl">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold font-serif tracking-tight text-[#1A1917]">
              Lyric<span className="italic text-[#3B5BDB]">Venture</span>
            </span>
            <span className="text-[9px] font-medium tracking-widest uppercase px-1.5 py-0.5 border border-[#D5D2CB] text-[#8A8680] hidden sm:inline">
              Beta
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-sm transition-colors rounded",
                  pathname === link.href
                    ? "text-[#1A1917] font-semibold"
                    : "text-[#8A8680] hover:text-[#1A1917]"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="block h-[1.5px] bg-[#1A1917] mt-0.5 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Desktop Auth ── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-[#5A5651] hover:text-[#1A1917] transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 bg-[#1A1917] text-[#F4F3F0] hover:bg-[#3B5BDB] transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* ── Mobile: Get Started + Hamburger ── */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/register"
              className="text-[13px] font-medium px-3 py-1.5 bg-[#1A1917] text-[#F4F3F0] hover:bg-[#3B5BDB] transition-colors"
            >
              Get Started
            </Link>

            {/* Hamburger button */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded hover:bg-[#E8E5E0] transition-colors"
            >
              <span
                className={cn(
                  "block w-5 h-[1.5px] bg-[#1A1917] transition-all duration-300 origin-center",
                  open && "rotate-45 translate-y-[6.5px]"
                )}
              />
              <span
                className={cn(
                  "block w-5 h-[1.5px] bg-[#1A1917] transition-all duration-300",
                  open && "opacity-0 scale-x-0"
                )}
              />
              <span
                className={cn(
                  "block w-5 h-[1.5px] bg-[#1A1917] transition-all duration-300 origin-center",
                  open && "-rotate-45 -translate-y-[6.5px]"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Drawer ── */}
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          open ? "bg-black/30 pointer-events-auto" : "bg-transparent pointer-events-none"
        )}
      />

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed top-16 inset-x-0 z-40 md:hidden transition-all duration-300 ease-in-out",
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}
        style={{
          background: "#F4F3F0",
          borderBottom: "1px solid #E2E0DB",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        }}
      >
        <div className="container mx-auto px-5 py-6 max-w-5xl">

          {/* Nav links */}
          <nav className="space-y-1 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between px-3 py-3 text-sm transition-colors border-b border-[#E8E5E0]",
                  pathname === link.href
                    ? "text-[#1A1917] font-semibold"
                    : "text-[#5A5651] hover:text-[#1A1917]"
                )}
              >
                <span>{link.label}</span>
                {pathname === link.href && (
                  <span className="text-[#3B5BDB] text-xs">●</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full text-center py-2.5 text-sm border border-[#C5C2BC] text-[#5A5651] hover:border-[#1A1917] hover:text-[#1A1917] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="w-full text-center py-2.5 text-sm font-medium bg-[#1A1917] text-[#F4F3F0] hover:bg-[#3B5BDB] transition-colors"
            >
              Get Started — it&apos;s free
            </Link>
          </div>

          {/* Bottom tagline */}
          <p className="text-center text-xs text-[#A8A39D] italic mt-5">
            ♫ &nbsp; Where music meets meaning.
          </p>
        </div>
      </div>
    </>
  );
}