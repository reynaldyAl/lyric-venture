import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container mx-auto px-4 py-8">
        <Separator className="mb-6 bg-white/10" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-bold text-white">
            Lyric<span className="text-purple-400">Venture</span>
          </span>
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} LyricVenture. Explore the meaning behind music.
          </p>
          <Link
            href="/dashboard"
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}