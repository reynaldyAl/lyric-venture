"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Tables } from "@/lib/types";

type SongItem = Pick<
  Tables<"songs">,
  "id" | "title" | "slug" | "cover_image" | "language" | "duration_sec" | "view_count"
> & {
  artists:   Pick<Tables<"artists">, "id" | "name" | "slug"> | null;
  albums:    Pick<Tables<"albums">,  "id" | "title" | "slug"> | null;
  song_tags: { tags: Pick<Tables<"tags">, "id" | "name" | "slug" | "color"> | null }[];
};

type TagItem = Pick<Tables<"tags">, "id" | "name" | "slug" | "color">;

function fmt(sec: number | null) {
  if (!sec) return "—";
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

export default function SongsClient({ songs, tags }: { songs: SongItem[]; tags: TagItem[] }) {
  const [search,    setSearch]    = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return songs.filter((song) => {
      const matchSearch =
        !search ||
        song.title.toLowerCase().includes(search.toLowerCase()) ||
        (song.artists?.name ?? "").toLowerCase().includes(search.toLowerCase());

      const matchTag =
        !activeTag ||
        song.song_tags.some((st) => st.tags?.slug === activeTag);

      return matchSearch && matchTag;
    });
  }, [songs, search, activeTag]);

  return (
    <div className="container mx-auto px-6 py-10 max-w-5xl space-y-8">

      {/* ── Search + Tag filter ── */}
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A39D] text-sm select-none">
            ⌕
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs or artists..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E2E0DB] bg-white text-[#1A1917] placeholder:text-[#A8A39D] focus:outline-none focus:border-[#1A1917] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A8A39D] hover:text-[#1A1917] text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tag pills */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`text-[11px] px-3 py-1 border transition-colors ${
                activeTag === null
                  ? "bg-[#1A1917] text-[#F4F3F0] border-[#1A1917]"
                  : "bg-white text-[#5A5651] border-[#D5D2CB] hover:border-[#1A1917] hover:text-[#1A1917]"
              }`}
            >
              All
            </button>
            {tags.map((tag) => {
              const isActive = activeTag === tag.slug;
              return (
                <button
                  key={tag.id}
                  onClick={() => setActiveTag(isActive ? null : tag.slug)}
                  className="text-[11px] px-3 py-1 border transition-all"
                  style={{
                    background:  isActive ? tag.color ?? "#1A1917" : "#FFFFFF",
                    borderColor: isActive ? tag.color ?? "#1A1917" : "#D5D2CB",
                    color:       isActive ? "#FFFFFF" : tag.color ?? "#5A5651",
                  }}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Result count */}
        <p className="text-xs text-[#8A8680]">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {(search || activeTag) && (
            <button
              onClick={() => { setSearch(""); setActiveTag(null); }}
              className="ml-2 text-[#3B5BDB] hover:underline"
            >
              Clear filters
            </button>
          )}
        </p>
      </div>

      {/* ── Song list ── */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-4xl mb-4 text-[#C5C2BC]">♫</p>
          <p className="font-serif text-lg text-[#5A5651]">No songs found.</p>
          <p className="text-sm text-[#8A8680] italic mt-1">Try a different search or filter.</p>
        </div>
      ) : (
        <div>
          {/* Column headers */}
          <div className="grid grid-cols-[2rem_2.5rem_1fr_6rem_5rem_4rem] gap-3 items-center px-3 pb-2 border-b border-[#E2E0DB]">
            <span className="text-[9px] text-[#C0B8AE] text-right font-mono">#</span>
            <span />
            <span className="text-[9px] uppercase tracking-widest text-[#C0B8AE]">Title</span>
            <span className="text-[9px] uppercase tracking-widest text-[#C0B8AE] hidden sm:block">Tags</span>
            <span className="text-[9px] uppercase tracking-widest text-[#C0B8AE] hidden md:block text-right">Views</span>
            <span className="text-[9px] uppercase tracking-widest text-[#C0B8AE] text-right hidden md:block">Time</span>
          </div>

          <div className="divide-y divide-[#E2E0DB]">
            {filtered.map((song, i) => {
              const tags = song.song_tags.map((st) => st.tags).filter(Boolean) as NonNullable<typeof song.song_tags[0]["tags"]>[];
              return (
                <Link
                  key={song.id}
                  href={`/songs/${song.slug}`}
                  className="grid grid-cols-[2rem_2.5rem_1fr_6rem_5rem_4rem] gap-3 items-center -mx-3 px-3 py-3 hover:bg-white transition-colors group"
                >
                  {/* Number / play */}
                  <span className="text-xs text-[#C0B8AE] text-right font-mono group-hover:hidden tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-[#3B5BDB] text-right hidden group-hover:block">▶</span>

                  {/* Cover */}
                  <div className="w-10 h-10 bg-[#E2E0DB] overflow-hidden shrink-0">
                    {song.cover_image
                      ? <Image src={song.cover_image} alt={song.title} width={40} height={40} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-[#A8A39D] text-sm">♫</div>}
                  </div>

                  {/* Title + artist + album */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1A1917] truncate group-hover:text-[#3B5BDB] transition-colors">
                      {song.title}
                    </p>
                    <p className="text-xs text-[#8A8680] truncate">
                      {song.artists?.name}
                      {song.albums?.title && (
                        <span className="text-[#C0B8AE]"> · {song.albums.title}</span>
                      )}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="hidden sm:flex flex-wrap gap-1 items-center">
                    {tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag.id}
                        className="text-[9px] px-1.5 py-0.5 border uppercase tracking-wide"
                        style={{
                          background:  tag.color ? `${tag.color}18` : "#E2E0DB",
                          borderColor: tag.color ? `${tag.color}40` : "#D5D2CB",
                          color:       tag.color ?? "#8A8680",
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  {/* View count */}
                  <span className="text-[11px] text-[#C0B8AE] text-right font-mono tabular-nums hidden md:block">
                    {(song.view_count ?? 0).toLocaleString()}
                  </span>

                  {/* Duration */}
                  <span className="text-[11px] text-[#C0B8AE] text-right font-mono tabular-nums hidden md:block">
                    {fmt(song.duration_sec)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}