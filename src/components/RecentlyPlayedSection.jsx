import { useMusic } from '../contexts/MusicContext';

export default function RecentlyPlayedSection() {
  const { recentlyPlayed, currentTrack, isPlaying, play, trendingTracks } = useMusic();

  if (recentlyPlayed.length === 0) return null;

  return (
    <section className="mb-14">
      <h3 className="text-2xl font-bold tracking-tight mb-6 text-white">🕐 Nghe gần đây</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {recentlyPlayed.slice(0, 6).map(track => {
          const isActive = currentTrack?.id === track.id;
          return (
            <div
              key={track.id}
              onClick={() => play(track, trendingTracks)}
              className={`flex flex-col gap-3 group cursor-pointer p-3 rounded-xl transition-all border ${
                isActive ? 'bg-teal-neon/10 border-teal-neon/20' : 'border-transparent hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <div className="relative">
                {track.cover_url ? (
                  <img
                    src={track.cover_url}
                    alt=""
                    className="w-full aspect-square rounded-lg object-cover shadow-lg group-hover:scale-105 transition-all border border-white/5"
                  />
                ) : (
                  <div className="w-full aspect-square rounded-lg bg-synth-indigo/60 flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-white/30 text-3xl">music_note</span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-lg bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-teal-neon text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isActive && isPlaying ? 'pause_circle' : 'play_circle'}
                  </span>
                </div>
                {isActive && isPlaying && (
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-teal-neon/20 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-teal-neon text-xs animate-pulse">graphic_eq</span>
                  </div>
                )}
              </div>
              <div>
                <p className={`text-sm font-semibold truncate ${isActive ? 'text-teal-neon' : 'text-white group-hover:text-teal-neon transition-colors'}`}>
                  {track.title}
                </p>
                <p className="text-[11px] text-white/40 font-label truncate">{track.artist}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
