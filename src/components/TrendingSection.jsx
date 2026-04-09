import { useMusic } from '../contexts/MusicContext';

function fmtTime(sec) {
  if (!sec) return '—';
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
}

function TrackCard({ track, index, onPlay, isPlaying, isActive, onAddToLibrary, inLibrary }) {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-xl group cursor-pointer transition-all border ${
        isActive ? 'bg-teal-neon/10 border-teal-neon/30' : 'border-transparent hover:bg-white/5 hover:border-white/10'
      }`}
      onClick={() => onPlay(track)}
    >
      <div className="w-8 text-center flex-shrink-0">
        {isActive && isPlaying ? (
          <span className="material-symbols-outlined text-teal-neon text-lg animate-pulse">graphic_eq</span>
        ) : (
          <>
            <span className="text-white/30 text-sm font-label group-hover:hidden">{index + 1}</span>
            <span className="material-symbols-outlined text-teal-neon text-lg hidden group-hover:block" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
          </>
        )}
      </div>

      {track.cover_url ? (
        <img src={track.cover_url} alt="" className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-white/10" />
      ) : (
        <div className="w-11 h-11 rounded-lg bg-synth-indigo/60 flex items-center justify-center flex-shrink-0 border border-white/10">
          <span className="material-symbols-outlined text-white/30 text-sm">music_note</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${isActive ? 'text-teal-neon' : 'text-white group-hover:text-teal-neon transition-colors'}`}>{track.title}</p>
        <p className="text-xs text-white/40 truncate">{track.artist}</p>
      </div>

      <span className="text-xs text-white/20 font-label hidden md:block flex-shrink-0 w-20 truncate">{track.album}</span>
      <span className="text-xs text-white/30 font-label flex-shrink-0 w-10 text-right">{fmtTime(track.duration)}</span>

      <button
        onClick={e => { e.stopPropagation(); onAddToLibrary(track); }}
        className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2 ${inLibrary ? 'text-fuchsia-neon opacity-100' : 'text-white/40 hover:text-fuchsia-neon'}`}
      >
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: inLibrary ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
      </button>
    </div>
  );
}

export default function TrendingSection() {
  const { trendingTracks, currentTrack, isPlaying, play, addToLibrary, isInLibrary, playAll } = useMusic();

  return (
    <section className="mb-14">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-white">🔥 Trending Now</h3>
          <p className="text-white/40 font-label text-sm">Những bài được nghe nhiều nhất</p>
        </div>
        <button
          onClick={() => playAll(trendingTracks)}
          className="flex items-center gap-2 text-teal-neon font-label text-xs tracking-widest uppercase hover:text-yellow-cyber transition-colors"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
          Phát tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-1">
        {trendingTracks.map((track, i) => (
          <TrackCard
            key={track.id}
            track={track}
            index={i}
            onPlay={(t) => play(t, trendingTracks)}
            isPlaying={isPlaying}
            isActive={currentTrack?.id === track.id}
            onAddToLibrary={addToLibrary}
            inLibrary={isInLibrary(track.id)}
          />
        ))}
      </div>
    </section>
  );
}
