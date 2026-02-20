export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-20">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Explore the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            meaning
          </span>{" "}
          behind music
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          Deep dive into lyrics, discover hidden meanings, and understand
          the story behind your favorite songs.
        </p>
      </section>
    </div>
  );
}