import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import VinylCard from "@/components/public/VynilCard";
import AlbumCard from "@/components/public/AlbumCard";

// ── Data fetching ────────────────────────────────────────
async function getHomeData() {
  const supabase = await createClient();
  const [
    { data: artists },
    { data: analyses },
    { data: songs },
    { data: albums },
  ] = await Promise.all([
    supabase
      .from("artists")
      .select("id, name, slug, cover_image, genre, origin, is_active")
      .eq("is_active", true)
      .order("name")
      .limit(8),

    supabase
      .from("lyric_analyses")
      .select(`
        id, intro, theme, published_at,
        songs (
          id, title, slug, cover_image, language,
          artists ( id, name, slug )
        )
      `)
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(4),

    supabase
      .from("songs")
      .select(`
        id, title, slug, cover_image, language,
        duration_sec, view_count,
        artists ( id, name, slug ),
        song_tags ( tags ( id, name, slug, color ) )
      `)
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(8),

    supabase
      .from("albums")
      .select(`
        id, title, slug, cover_image, release_date, album_type,
        artists ( id, name, slug )
      `)
      .order("release_date", { ascending: false })
      .limit(6),
  ]);

  return {
    artists:  artists  ?? [],
    analyses: analyses ?? [],
    songs:    songs    ?? [],
    albums:   albums   ?? [],
  };
}

// ── Helpers ──────────────────────────────────────────────
function formatDuration(sec: number | null): string {
  if (!sec) return "";
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

// ── Page ─────────────────────────────────────────────────
export default async function HomePage() {
  const { artists, analyses, songs, albums } = await getHomeData();
  const heroAnalysis = analyses[0] as any;
  const heroSong     = heroAnalysis?.songs as any;
  const heroArtist   = heroSong?.artists as any;

  return (
    <div style={{ background: "#F4F3F0", color: "#1A1917" }}>

      {/* ══════════════════════════════════════════════
          HERO — split: text left, featured analysis right
      ══════════════════════════════════════════════ */}
      <section className="container mx-auto px-6 pt-16 pb-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* Left: text */}
          <div>
            <p className="text-[10px] tracking-[0.45em] uppercase text-[#8A8680] mb-5">
              Issue No. 01 · Song &amp; Lyric Meanings
            </p>
            <h1 className="text-5xl md:text-6xl font-bold font-serif leading-[1.05] tracking-tight mb-5">
              The words<br />behind<br />the music.
            </h1>
            <p className="text-base text-[#5A5651] leading-relaxed mb-8 max-w-sm">
              We decode lyrics — the metaphors, the pain, the joy — so you can
              hear your favorite songs in a completely new way.
            </p>
            <div className="flex gap-3">
              <Link href="/songs"
                className="px-5 py-2.5 bg-[#1A1917] text-[#F4F3F0] text-sm font-medium hover:bg-[#3B5BDB] transition-colors">
                Browse Songs
              </Link>
              <Link href="/analyses"
                className="px-5 py-2.5 border border-[#C5C2BC] text-[#5A5651] text-sm hover:border-[#1A1917] hover:text-[#1A1917] transition-colors">
                Read Analyses
              </Link>
            </div>
          </div>

          {/* Right: featured analysis card */}
          {heroAnalysis && heroSong ? (
            <Link href={`/songs/${heroSong.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#E2E0DB]">
                {heroSong.cover_image ? (
                  <Image
                    src={heroSong.cover_image}
                    alt={heroSong.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-[#A8A39D]">♫</div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] tracking-[0.35em] uppercase text-white/60 mb-1">
                    Featured Analysis · {heroArtist?.name}
                  </p>
                  <p className="font-serif font-bold text-xl text-white leading-tight group-hover:text-[#93C5FD] transition-colors">
                    {heroSong.title}
                  </p>
                  {heroAnalysis.theme && (
                    <p className="text-xs text-white/60 mt-1 italic">{heroAnalysis.theme}</p>
                  )}
                </div>
              </div>
            </Link>
          ) : (
            <div className="aspect-[4/3] bg-[#E2E0DB] flex items-center justify-center">
              <div className="text-center text-[#A8A39D]">
                <p className="text-5xl mb-3">♫</p>
                <p className="text-xs italic">Analyses coming soon.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED ANALYSES — 2x2 grid
      ══════════════════════════════════════════════ */}
      {analyses.length > 1 && (
        <section className="border-t border-[#E2E0DB]" style={{ background: "#FFFFFF" }}>
          <div className="container mx-auto px-6 py-14 max-w-5xl">
            <div className="flex items-baseline justify-between mb-7">
              <h2 className="font-serif font-bold text-xl text-[#1A1917]">Latest Analyses</h2>
              <Link href="/analyses" className="text-xs text-[#3B5BDB] hover:underline tracking-wide">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E2E0DB]">
              {analyses.slice(1).map((analysis: any) => {
                const song   = analysis.songs as any;
                const artist = song?.artists as any;
                return (
                  <Link key={analysis.id} href={`/songs/${song?.slug}`}
                    className="bg-white p-5 group hover:bg-[#F8F7F4] transition-colors">
                    <div className="flex gap-3 mb-3">
                      <div className="w-12 h-12 bg-[#E8E5E0] shrink-0 overflow-hidden">
                        {song?.cover_image
                          ? <Image src={song.cover_image} alt={song.title} width={48} height={48} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-[#A8A39D]">✦</div>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] tracking-widest uppercase text-[#8A8680]">{artist?.name}</p>
                        <p className="font-serif font-bold text-sm leading-snug truncate group-hover:text-[#3B5BDB] transition-colors">
                          {song?.title}
                        </p>
                      </div>
                    </div>
                    {analysis.theme && (
                      <p className="text-xs text-[#8A8680] italic leading-relaxed line-clamp-2">{analysis.theme}</p>
                    )}
                    {analysis.intro && (
                      <p className="text-xs text-[#5A5651] mt-2 leading-relaxed line-clamp-3">{analysis.intro}</p>
                    )}
                    <p className="text-[10px] text-[#3B5BDB] mt-3 group-hover:underline">Read analysis →</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          ARTISTS — vinyl spinning cards
      ══════════════════════════════════════════════ */}
      {artists.length > 0 && (
        <section className="border-t border-[#E2E0DB]" style={{ background: "#F4F3F0" }}>
          <div className="container mx-auto px-6 py-14 max-w-5xl">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#1A1917]">Artists</h2>
                <p className="text-xs text-[#8A8680] mt-0.5">Hover to spin the vinyl ↻</p>
              </div>
              <Link href="/artists" className="text-xs text-[#3B5BDB] hover:underline">
                All artists →
              </Link>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-5">
              {artists.map((artist: any) => (
                <VinylCard
                  key={artist.id}
                  name={artist.name}
                  slug={artist.slug}
                  coverImage={artist.cover_image}
                  origin={artist.origin}
                  genre={artist.genre}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═════════════════════��════════════════════════
          ALBUMS — square cover grid
      ══════════════════════════════════════════════ */}
      {albums.length > 0 && (
        <section className="border-t border-[#E2E0DB]" style={{ background: "#FFFFFF" }}>
          <div className="container mx-auto px-6 py-14 max-w-5xl">
            <div className="flex items-baseline justify-between mb-7">
              <h2 className="font-serif font-bold text-xl text-[#1A1917]">Albums</h2>
              <Link href="/albums" className="text-xs text-[#3B5BDB] hover:underline">All albums →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
              {albums.map((album: any) => (
                <AlbumCard
                  key={album.id}
                  title={album.title}
                  slug={album.slug}
                  coverImage={album.cover_image}
                  artistName={album.artists?.name}
                  artistSlug={album.artists?.slug}
                  releaseDate={album.release_date}
                  albumType={album.album_type}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          SONGS — numbered tracklist
      ══════════════════════════════════════════════ */}
      {songs.length > 0 && (
        <section className="border-t border-[#E2E0DB]" style={{ background: "#F4F3F0" }}>
          <div className="container mx-auto px-6 py-14 max-w-5xl">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-serif font-bold text-xl text-[#1A1917]">Recent Songs</h2>
              <Link href="/songs" className="text-xs text-[#3B5BDB] hover:underline">All songs →</Link>
            </div>
            <div className="divide-y divide-[#E2E0DB]">
              {songs.map((song: any, i: number) => {
                const artist = song.artists as any;
                const tags   = song.song_tags?.map((st: any) => st.tags).filter(Boolean) ?? [];
                return (
                  <Link key={song.id} href={`/songs/${song.slug}`}
                    className="flex items-center gap-4 py-3 -mx-2 px-2 hover:bg-white transition-colors group">
                    {/* Number */}
                    <span className="text-xs text-[#C0B8AE] w-6 text-right shrink-0 font-mono tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Cover */}
                    <div className="w-10 h-10 bg-[#E2E0DB] shrink-0 overflow-hidden">
                      {song.cover_image
                        ? <Image src={song.cover_image} alt={song.title} width={40} height={40} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-sm text-[#A8A39D]">♫</div>}
                    </div>

                    {/* Title + artist */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1A1917] truncate group-hover:text-[#3B5BDB] transition-colors">
                        {song.title}
                      </p>
                      <p className="text-xs text-[#8A8680] truncate">{artist?.name}</p>
                    </div>

                    {/* Tags */}
                    <div className="hidden sm:flex items-center gap-1 shrink-0">
                      {tags.slice(0, 2).map((tag: any) => (
                        <span key={tag.id}
                          className="text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider border"
                          style={{
                            background: tag.color ? `${tag.color}18` : "#E2E0DB",
                            borderColor: tag.color ? `${tag.color}40` : "#D5D2CB",
                            color: tag.color ?? "#8A8680",
                          }}>
                          {tag.name}
                        </span>
                      ))}
                    </div>

                    {/* Duration */}
                    {song.duration_sec && (
                      <span className="text-xs text-[#C0B8AE] shrink-0 font-mono hidden md:block">
                        {formatDuration(song.duration_sec)}
                      </span>
                    )}

                    {/* Has analysis indicator */}
                    <span className="text-[10px] text-[#3B5BDB] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          EMPTY STATE
      ══════════════════════════════════════════════ */}
      {artists.length === 0 && analyses.length === 0 && songs.length === 0 && (
        <section className="py-32 text-center">
          <p className="text-5xl mb-5">♪</p>
          <p className="font-serif text-xl text-[#5A5651] mb-2">The library is being built.</p>
          <p className="text-sm text-[#8A8680] italic">Check back soon — great analyses take time.</p>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          FOOTER QUOTE
      ══════════════════════════════════════════════ */}
      <section className="border-t-2 border-[#1A1917] py-16" style={{ background: "#F4F3F0" }}>
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <blockquote className="text-xl md:text-2xl font-serif italic text-[#5A5651] leading-relaxed">
            &ldquo;Music gives a soul to the universe, wings to the mind,
            flight to the imagination, and life to everything.&rdquo;
          </blockquote>
          <p className="text-xs text-[#8A8680] mt-4 tracking-widest uppercase">— Plato</p>
        </div>
      </section>
    </div>
  );
}