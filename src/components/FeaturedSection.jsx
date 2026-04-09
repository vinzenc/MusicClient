import { useMusic } from '../contexts/MusicContext';

export default function FeaturedSection() {
  const { featuredTracks, play, playAll, trendingTracks } = useMusic();

  const featured = featuredTracks[0] || {
    title: 'Blinding Lights', artist: 'The Weeknd',
    cover_url: 'https://e-cdns-images.dzcdn.net/images/cover/d9f0678820a8b6e5c0e2cf13571e9e8b/250x250-000000-80-0-0.jpg',
    album: 'After Hours',
  };

  return (
    <section className="relative h-[480px] rounded-2xl overflow-hidden mb-16 group border border-fuchsia-neon/20 shadow-[0_0_30px_rgba(255,0,255,0.1)]">
      {/* Background */}
      {featured.cover_url ? (
        <img
          src={featured.cover_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 opacity-50"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-synth-indigo to-synth-magenta" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-synth-deep via-synth-deep/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-synth-deep/80 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end px-12 pb-12 max-w-2xl">
        <span className="text-yellow-cyber font-label text-xs tracking-[0.3em] uppercase mb-3 drop-shadow-[0_0_8px_rgba(243,255,0,0.5)]">
          ✦ Nổi bật
        </span>
        <h2 className="text-6xl font-extrabold tracking-tighter leading-tight mb-2 text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
          {featured.title}
        </h2>
        <p className="text-lg text-white/60 font-light mb-6">{featured.artist} · {featured.album}</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => play(featured, trendingTracks)}
            className="px-8 py-3 bg-teal-neon text-synth-deep font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            Phát ngay
          </button>
          <button
            onClick={() => playAll(trendingTracks)}
            className="px-8 py-3 bg-fuchsia-neon/20 backdrop-blur-md border border-fuchsia-neon/40 text-fuchsia-neon font-bold rounded-full hover:bg-fuchsia-neon/30 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">queue_music</span>
            Phát tất cả
          </button>
        </div>
      </div>

      {/* Mini track list */}
      {featuredTracks.length > 1 && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {featuredTracks.slice(1, 4).map(t => (
            <div
              key={t.id}
              onClick={() => play(t, trendingTracks)}
              className="flex items-center gap-3 bg-synth-deep/60 backdrop-blur px-4 py-3 rounded-xl border border-white/10 cursor-pointer hover:border-teal-neon/40 transition-all group/mini w-64"
            >
              {t.cover_url
                ? <img src={t.cover_url} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                : <div className="w-10 h-10 rounded bg-synth-indigo flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-white/40 text-sm">music_note</span></div>
              }
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover/mini:text-teal-neon transition-colors">{t.title}</p>
                <p className="text-xs text-white/40">{t.artist}</p>
              </div>
              <span className="material-symbols-outlined text-white/20 group-hover/mini:text-teal-neon ml-auto transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
