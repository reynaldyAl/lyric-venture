import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">
            Lyric<span className="text-purple-400">Venture</span>
          </span>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/songs"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Songs
          </Link>
          <Link
            href="/artists"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Artists
          </Link>
        </nav>
      </div>
    </header>
  );
}