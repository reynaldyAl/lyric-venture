# LyricVenture 

**Song and Lyric Meanings Platform**

A full-stack web application for analyzing and exploring song lyrics with deep meanings, built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

---

##  Tech Stack

- **Frontend + Backend:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Deployment:** Vercel (frontend) + Supabase (backend)
- **Music Integration:** Spotify Embed Widget

---

## ✨ Features

### Public Features (No Login Required)
-  Browse and search songs with lyric analyses
-  Read in-depth lyric breakdowns (intro, theme, background, conclusion)
-  Interactive lyric highlights with hover tooltips
-  Listen to songs via Spotify inline player
-  Filter songs by genre/mood tags
-  View artist profiles, albums, and discography
-  See trending/popular songs by view count

### Admin/Author Features (Login Required)
-  Create and manage lyric analyses
-  Rich text editor for lyric sections
-  Highlight specific lyrics with explanations and color coding
-  Manage artists, albums, songs, and tags
-  Upload and manage images
-  Track song view counts
-  Draft/publish workflow with RLS (Row Level Security)

---

##  Database Schema

The project uses 9 main tables with comprehensive relationships:

- `profiles` → Admin/Author users
- `tags` → Genre/mood/theme tags
- `artists` → Band/artist information
- `albums` → Album metadata
- `songs` → Song details + Spotify track ID
- `song_tags` → Many-to-many: songs ↔ tags
- `lyric_analyses` → Main analysis content (intro, theme, etc.)
- `lyric_sections` → Lyric sections (Verse, Chorus, Bridge, etc.)
- `lyric_highlights` → Highlighted lyrics with explanations

**Key Features:**
- ✅ UUID primary keys
- ✅ Automatic timestamps (`created_at`, `updated_at`)
- ✅ Row Level Security (RLS) — guest can read published content
- ✅ Performance indexes on frequently queried columns
- ✅ Auto-trigger for profile creation on user signup
- ✅ Function for incrementing song view count
- ✅ SEO fields (meta_title, meta_description, og_image)

---

##  Setup Instructions

### Prerequisites
- Node.js v20.x or higher ([Download](https://nodejs.org))
- npm v10.x or higher (comes with Node.js)
- Supabase account ([Sign up](https://supabase.com))

---

### 1️⃣ Clone Repository

```bash
git clone https://github.com/reynaldyAl/lyric-venture.git
cd lyric-venture
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

If you encounter peer dependency errors:
```bash
npm install --legacy-peer-deps
```

**Main dependencies:**
```bash
npm install @supabase/supabase-js @supabase/ssr
npm install clsx tailwind-merge react-hook-form @hookform/resolvers zod date-fns
npx shadcn@latest init
```
*** for shadcn ***
```bash
✔ Which style would you like to use? › New York        ← pilih ini
✔ Which color would you like to use as base color? › Zinc  ← pilih ini (neutral, cocok untuk musik)
✔ Would you like to use CSS variables for colors? › Yes

npx shadcn@latest add button input label textarea select card badge separator avatar sheet dropdown-menu breadcrumb tabs toast dialog alert skeleton form switch checkbox
```

---

### 3️⃣ Setup Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com/dashboard)
2. In Supabase Dashboard → SQL Editor
3. Run all migration files in order (`00` to `13`):
   - Navigate to `supabase/migrations/` folder
   - Copy content of each `.sql` file
   - Paste and execute in Supabase SQL Editor
   - Execute in order: `00_extensions.sql` → `01_profiles.sql` → ... → `13_seed_data.sql`

**Migration files:**
```
supabase/migrations/
├── 00_extensions.sql          → UUID extension
├── 01_profiles.sql            → Profiles table
├── 02_tags.sql                → Tags table
├── 03_artists.sql             → Artists table
├── 04_albums.sql              → Albums table
├── 05_songs.sql               → Songs + song_tags tables
├── 06_lyric_analyses.sql      → Lyric analyses table
├── 07_lyric_sections.sql      → Lyric sections table
├── 08_lyric_highlights.sql    → Lyric highlights table
├── 09_indexes.sql             → Performance indexes
├── 10_rls_policies.sql        → Row Level Security policies
├── 11_functions.sql           → Custom functions
├── 12_triggers.sql            → Database triggers
└── 13_seed_data.sql           → Sample data (The Beatles)
```

---

### 4️⃣ Configure Environment Variables

Create `.env.local` file in project root:

```bash
# Copy template
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**How to get credentials:**
1. Go to Supabase Dashboard → Project Settings → API
2. Copy **Project URL** → paste to `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public key** → paste to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

⚠️ **Never commit `.env.local` to Git!** (already in `.gitignore`)

---

### 5️⃣ Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Expected result:**
```
✅ Connected! Published Songs: 0
```

---

## 📁 Project Structure

```
lyric-venture/
├── supabase/
│   └── migrations/          # Database SQL files
├── src/
│   ├── app/
│   │   ├── (public)/        # Public routes (guest access)
│   │   ├── (admin)/         # Protected routes (admin only)
│   │   ├── api/             # API routes
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── admin/           # Admin-only components
│   │   └── public/          # Public-facing components
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts    # Browser Supabase client
│       │   ├── server.ts    # Server Supabase client
│       │   └── middleware.ts # Auth middleware
│       ├── database.types.ts # Generated TypeScript types
│       ├── types.ts         # Custom type definitions
│       └── utils.ts         # Utility functions
├── middleware.ts            # Next.js middleware (auth)
├── .env.local              # Environment variables (NOT in Git)
└── package.json            # Dependencies
```

---

##  Testing Database Connection

The homepage (`src/app/page.tsx`) includes a test query that:
- ✅ Connects to Supabase
- ✅ Counts total published songs
- ✅ Displays connection status

If you see **"✅ Connected! Published Songs: 0"**, setup is successful!

---

##  Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### Supabase Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

##  Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy! 

The app will be live at: `https://your-project.vercel.app`

---

##  Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abcd1234.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJIUzI1NiIsInR5...` |

---

##  Contributing

This is a learning project. Feel free to fork and experiment!

---

##  License

MIT License - Free to use for learning and portfolio purposes.

---

## \ Author

**Reynaldy Al**  
- GitHub: [@reynaldyAl](https://github.com/reynaldyAl)
- Project: [LyricVenture](https://github.com/reynaldyAl/lyric-venture)

---

**Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and Supabase**