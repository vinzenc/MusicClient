import { useState, useEffect } from 'react';
import { useMusic } from '../contexts/MusicContext';

function fmtTime(sec) {
  if (!sec) return '—';
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
}

function DeezerTrackCard({ track, index, onPlay, isPlaying, isActive }) {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-xl group cursor-pointer transition-all border ${
        isActive ? 'bg-fuchsia-neon/10 border-fuchsia-neon/30' : 'border-transparent hover:bg-white/5 hover:border-white/10'
      }`}
      onClick={() => onPlay(track)}
    >
      <div className="w-8 text-center flex-shrink-0">
        {isActive && isPlaying ? (
          <span className="material-symbols-outlined text-fuchsia-neon text-lg animate-pulse">graphic_eq</span>
        ) : (
          <>
            <span className="text-white/30 text-sm font-label group-hover:hidden">{index + 1}</span>
            <span className="material-symbols-outlined text-fuchsia-neon text-lg hidden group-hover:block" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
          </>
        )}
      </div>

      {track.cover_url ? (
        <img src={track.cover_url} alt="" className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-white/10" />
      ) : (
        <div className="w-11 h-11 rounded-lg bg-synth-base flex items-center justify-center flex-shrink-0 border border-white/10">
          <span className="material-symbols-outlined text-white/30 text-sm">music_note</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${isActive ? 'text-fuchsia-neon' : 'text-white group-hover:text-fuchsia-neon transition-colors'}`}>{track.title}</p>
        <p className="text-xs text-white/40 truncate">{track.artist}</p>
      </div>

      <span className="text-xs text-fuchsia-neon text-right font-bold hidden md:block flex-shrink-0 w-24">Deezer API</span>
    </div>
  );
}

export default function DeezerSection() {
  const { currentTrack, isPlaying, play } = useMusic();
  const [deezerTracks, setDeezerTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeezer = async () => {
      try {
        // Using cors proxy because direct call to api.deezer.com often gets blocked from browser
        const proxyUrl = 'https://corsproxy.io/?url=' + encodeURIComponent('https://api.deezer.com/chart');
        const r = await fetch(proxyUrl);
        if (!r.ok) throw new Error('Network error');
        const data = await r.json();
        
        // Map deezer track structure to our standard track structure
        const mappedTracks = data.tracks.data.map(dt => ({
          // using dz_ prefix to avoid ID collisions with our mock array
          id: `dz_${dt.id}`,
          title: dt.title,
          artist: dt.artist?.name || 'Unknown',
          album: dt.album?.title || '',
          duration: dt.duration || 0,
          cover_url: dt.album?.cover_xl || dt.album?.cover_medium || '',
          preview_url: dt.preview || '',
          deezer_id: String(dt.id),
          genre: 'Deezer'
        }));
        
        setDeezerTracks(mappedTracks);
      } catch (err) {
        console.error(err);
        setError('Không load được Deezer. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchDeezer();
  }, []);

  if (error) {
    return (
      <section className="mb-14">
        <h3 className="text-2xl font-bold tracking-tight text-white mb-6">🌍 Deezer Global Chart</h3>
        <p className="text-red-400">{error}</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mb-14">
        <h3 className="text-2xl font-bold tracking-tight text-white mb-6">🌍 Deezer Global Chart</h3>
        <p className="text-white/40 animate-pulse text-sm">Đang kết nối tới API Deezer.com...</p>
      </section>
    );
  }

  return (
    <section className="mb-14">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-white">🌍 Deezer Hot Tracks</h3>
          <p className="text-fuchsia-neon/80 font-label text-sm uppercase tracking-widest mt-1">Live from Deezer API</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-1">
        {deezerTracks.map((track, i) => (
          <DeezerTrackCard
            key={track.id}
            track={track}
            index={i}
            onPlay={(t) => play(t, deezerTracks)}
            isPlaying={isPlaying}
            isActive={currentTrack?.id === track.id}
          />
        ))}
      </div>
    </section>
  );
}
