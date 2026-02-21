import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

const BASE_URL = "https://lyricventure.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // ✅ Cast as any — fix "Property 'slug' does not exist on type 'never'"
  const [
    { data: songs },
    { data: artists },
    { data: albums },
    { data: analyses },
  ] = await Promise.all([
    (supabase as any).from("songs").select("slug, updated_at").eq("is_published", true),
    (supabase as any).from("artists").select("slug, updated_at").eq("is_active", true),
    (supabase as any).from("albums").select("slug, updated_at"),
    (supabase as any).from("lyric_analyses").select("id, updated_at").eq("is_published", true),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,               lastModified: new Date(), changeFrequency: "daily",  priority: 1   },
    { url: `${BASE_URL}/songs`,    lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
    { url: `${BASE_URL}/artists`,  lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/albums`,   lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/analyses`, lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
  ];

  // Dynamic pages
  const songPages: MetadataRoute.Sitemap = ((songs ?? []) as any[]).map((s) => ({
    url:             `${BASE_URL}/songs/${s.slug}`,
    lastModified:    s.updated_at ? new Date(s.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }));

  const artistPages: MetadataRoute.Sitemap = ((artists ?? []) as any[]).map((a) => ({
    url:             `${BASE_URL}/artists/${a.slug}`,
    lastModified:    a.updated_at ? new Date(a.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  const albumPages: MetadataRoute.Sitemap = ((albums ?? []) as any[]).map((a) => ({
    url:             `${BASE_URL}/albums/${a.slug}`,
    lastModified:    a.updated_at ? new Date(a.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.6,
  }));

  const analysisPages: MetadataRoute.Sitemap = ((analyses ?? []) as any[]).map((a) => ({
    url:             `${BASE_URL}/analyses/${a.id}`,
    lastModified:    a.updated_at ? new Date(a.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }));

  return [...staticPages, ...songPages, ...artistPages, ...albumPages, ...analysisPages];
}