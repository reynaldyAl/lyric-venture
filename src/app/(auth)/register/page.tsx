import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

const NOTES = [
  { note: "𝄢", top: "10%", left: "70%", size: "5rem",   opacity: 0.15, rotate:   8 },
  { note: "♬", top: "32%", left: "8%",  size: "3.5rem", opacity: 0.12, rotate: -10 },
  { note: "♩", top: "55%", left: "55%", size: "4rem",   opacity: 0.10, rotate:   5 },
  { note: "♫", top: "74%", left: "22%", size: "3rem",   opacity: 0.13, rotate: -15 },
  { note: "♪", top: "20%", left: "40%", size: "4.5rem", opacity: 0.08, rotate:  12 },
];

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">

      {/* ══ LEFT panel ════════════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-14 overflow-hidden"
        style={{ background: "#1A1917" }}
      >
        {/* Staff lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-center gap-7 px-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ height: "1px", background: "rgba(184,150,90,0.18)" }} />
          ))}
        </div>

        {/* Notes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {NOTES.map(({ note, top, left, size, opacity, rotate }, i) => (
            <span
              key={i}
              className="absolute font-serif"
              style={{ top, left, fontSize: size, opacity, transform: `rotate(${rotate}deg)`, color: "#B8965A" }}
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
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ background: "rgba(184,150,90,0.3)" }} />
            <span style={{ color: "#B8965A" }}>♫</span>
            <div className="h-px flex-1" style={{ background: "rgba(184,150,90,0.3)" }} />
          </div>

          <blockquote>
            <p className="font-serif text-[1.6rem] leading-[1.35] mb-5" style={{ color: "#F4F3F0" }}>
              &ldquo;Without music,<br />
              life would be<br />
              a mistake.&rdquo;
            </p>
            <footer className="text-[11px] tracking-[0.35em] uppercase" style={{ color: "#6B6050" }}>
              — Friedrich Nietzsche
            </footer>
          </blockquote>

          <div className="flex items-center gap-3 mt-8">
            <div className="h-px flex-1" style={{ background: "rgba(184,150,90,0.3)" }} />
            <span style={{ color: "#B8965A" }}>♫</span>
            <div className="h-px flex-1" style={{ background: "rgba(184,150,90,0.3)" }} />
          </div>
        </div>

        {/* What you get */}
        <div className="relative z-10 space-y-3">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: "#4A4030" }}>
            What you get
          </p>
          {[
            "Personalized lyric analysis feed",
            "Save your favorite songs & insights",
            "Explore hidden meanings in music",
          ].map((text, i) => (
            <div key={text} className="flex items-start gap-3">
              <span style={{ color: "#B8965A", marginTop: "1px" }}>
                {["♩", "♪", "♫"][i]}
              </span>
              <p className="text-sm" style={{ color: "#5A5040" }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ RIGHT panel ═══════════════════════════════════ */}
      <div
        className="flex-1 flex flex-col justify-center items-center px-8 py-12 relative overflow-y-auto"
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

        <div className="absolute top-8 right-8 text-2xl select-none" style={{ color: "#D5CFC7", opacity: 0.6 }}>
          𝄢
        </div>

        <div className="w-full max-w-[360px] space-y-7">

          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-6" style={{ background: "#1A1917" }} />
              <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#8A8680" }}>
                New member
              </span>
            </div>
            <h1 className="font-serif font-bold text-[2rem] leading-tight" style={{ color: "#1A1917" }}>
              Create account
            </h1>
            <p className="text-sm mt-1" style={{ color: "#8A8680" }}>
              Start exploring the meaning behind music.
            </p>
          </div>

          <RegisterForm />

          <p className="text-center text-sm" style={{ color: "#8A8680" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-medium auth-link" style={{ color: "#1A1917" }}>
              Sign in →
            </Link>
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-12" style={{ background: "#E2E0DB" }} />
            <span className="text-xs" style={{ color: "#C5C2BC" }}>♩ ♪ ♫</span>
            <div className="h-px w-12" style={{ background: "#E2E0DB" }} />
          </div>
        </div>
      </div>
    </div>
  );
}