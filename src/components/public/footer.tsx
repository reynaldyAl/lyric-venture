import Link from "next/link";

const footerLinks = {
  Explore: [
    { href: "/songs",    label: "Songs" },
    { href: "/artists",  label: "Artists" },
    { href: "/albums",   label: "Albums" },
    { href: "/analyses", label: "Analyses" },
  ],
  Account: [
    { href: "/login",    label: "Sign In" },
    { href: "/register", label: "Create Account" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#1A1917",
        color: "#F4F3F0",
        borderTop: "1px solid #2E2C28",
      }}
    >
      {/* ── Main footer content ─────────────────────── */}
      <div className="container mx-auto px-6 py-14 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <span className="text-xl font-bold font-serif tracking-tight">
              Lyric<span className="italic text-[#93C5FD]">Venture</span>
            </span>
            <p className="text-sm text-[#8A8278] mt-3 leading-relaxed max-w-xs">
              We decode lyrics — the metaphors, the pain, the joy — so you can
              hear your favorite songs in a completely new way.
            </p>

            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 mt-5 border border-white/10 px-3 py-1.5">
              <span className="text-[#93C5FD] text-sm">♫</span>
              <span className="text-[11px] text-[#6B6660] italic tracking-wide">
                Where music meets meaning.
              </span>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#6B6660] font-semibold mb-4">
                {group}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#8A8278] hover:text-[#F4F3F0] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────── */}
      <div
        style={{ borderTop: "1px solid #2E2C28" }}
        className="container mx-auto px-6 py-5 max-w-5xl"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#5A5550]">
            © {year} LyricVenture. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-[#5A5550] hover:text-[#8A8278] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-[#5A5550] hover:text-[#8A8278] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}