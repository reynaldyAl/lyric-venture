/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Wikimedia — untuk seed data
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      // Supabase Storage — untuk upload gambar
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      // Spotify CDN — kalau pakai cover dari Spotify
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
};

export default nextConfig;