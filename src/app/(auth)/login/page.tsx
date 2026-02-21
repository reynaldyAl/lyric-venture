import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

const NOTES = [
  { note: "𝄞", top: "8%",  left: "8%",  size: "5rem",   opacity: 0.15, rotate:  -8 },
  { note: "♩", top: "28%", left: "75%", size: "3rem",   opacity: 0.12, rotate:  12 },
  { note: "♫", top: "50%", left: "15%", size: "4rem",   opacity: 0.10, rotate:  -5 },
  { note: "♬", top: "68%", left: "62%", size: "3.5rem", opacity: 0.13, rotate:  18 },
  { note: "♪", top: "85%", left: "35%", size: "2.5rem", opacity: 0.10, rotate: -12 },
  { note: "𝄢", top: "42%", left: "48%", size: "4.5rem", opacity: 0.08, rotate:   6 },
];

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">

      {/* ══ LEFT — dark editorial panel ════════════════════ */}
      <div
        className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-14 overflow-hidden"
        style={{ background: "#1A1917" }}
      >
        {/* Staff lines — 5 paranada */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-center gap-7 px-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{ height: "1px", background: "rgba(184,150,90,0.18)" }}
            />
          ))}
        </div>

        {/* Floating notes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {NOTES.map(({ note, top, left, size, opacity, rotate }, i) => (
            <span
              key={i}
              className="absolute font-serif"
              style={{
                top, left,
                fontSize:  size,
                opacity,
                transform: `rotate(${rotate}deg)`,
                color:     "#B8965A",
              }}
            >
              {note}
            </span>
          ))}
        </div>

        {/* Brand */}
        <div className="relative z-10">
          <Link href="/">
            <p className="text-xl font-bold font-serif tracking-tight" style={{ color: "#F4F3F0" }}>
              Lyric<span className="italic" style={{ color: "#B8965A" }}>Venture</span>
            </p>
          </Link>
        </div>

        {/* Center quote */}
        <div className="relative z-10">
          {/* Ornamental divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ background: "rgba(184,150,90,0.3)" }} />
            <span style={{ color: "#B8965A", fontSize: "1rem" }}>♩</span>
            <div className="h-px flex-1" style={{ background: "rgba(184,150,90,0.3)" }} />
          </div>

          <blockquote>
            <p
              className="font-serif text-[1.6rem] leading-[1.35] mb-5"
              style={{ color: "#F4F3F0" }}
            >
              &ldquo;Music is the<br />
              shorthand<br />
              of emotion.&rdquo;
            </p>
            <footer
              className="text-[11px] tracking-[0.35em] uppercase"
              style={{ color: "#6B6050" }}
            >
              — Leo Tolstoy
            </footer>
          </blockquote>

          <div className="flex items-center gap-3 mt-8">
            <div className="h-px flex-1" style={{ background: "rgba(184,150,90,0.3)" }} />
            <span style={{ color: "#B8965A", fontSize: "1rem" }}>♩</span>
            <div className="h-px flex-1" style={{ background: "rgba(184,150,90,0.3)" }} />
          </div>
        </div>

        {/* Bottom features */}
        <div className="relative z-10 space-y-3">
          {[
            "Deep lyric analyses from our editors",
            "Highlighted phrases & hidden meanings",
            "Explore songs across all genres & eras",
          ].map((text, i) => (
            <div key={text} className="flex items-start gap-3">
              <span style={{ color: "#B8965A", marginTop: "1px" }}>
                {["♩", "♪", "♫"][i]}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: "#5A5040" }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ RIGHT — form panel ══════════════════════════════ */}
      <div
        className="flex-1 flex flex-col justify-center items-center px-8 py-16 relative"
        style={{ background: "#F4F3F0" }}
      >
        {/* Mobile brand */}
        <div className="lg:hidden absolute top-8 left-8">
          <Link href="/">
            <p className="text-lg font-bold font-serif" style={{ color: "#1A1917" }}>
              Lyric<span className="italic" style={{ color: "#B8965A" }}>Venture</span>
            </p>
          </Link>
        </div>

        {/* Subtle ornament top-right */}
        <div className="absolute top-8 right-8 text-2xl select-none" style={{ color: "#D5CFC7", opacity: 0.6 }}>
          𝄞
        </div>

        <div className="w-full max-w-[360px] space-y-7">

          {/* Header */}
          <div className="space-y-1">
            {/* Ornamental line */}
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-6" style={{ background: "#1A1917" }} />
              <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#8A8680" }}>
                Welcome back
              </span>
            </div>
            <h1
              className="font-serif font-bold text-[2rem] leading-tight"
              style={{ color: "#1A1917" }}
            >
              Sign in
            </h1>
            <p className="text-sm" style={{ color: "#8A8680" }}>
              Continue your journey through music.
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm" style={{ color: "#8A8680" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium auth-link"
              style={{ color: "#1A1917" }}
            >
              Create one →
            </Link>
          </p>

          {/* Bottom ornament */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="h-px w-12" style={{ background: "#E2E0DB" }} />
            <span className="text-xs" style={{ color: "#C5C2BC" }}>♩ ♪ ♫</span>
            <div className="h-px w-12" style={{ background: "#E2E0DB" }} />
          </div>
        </div>
      </div>
    </div>
  );
}