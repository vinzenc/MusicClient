import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playlistStore } from '../services/mockStore';
import { useMusic } from '../contexts/MusicContext';

function fmtTime(sec) {
  if (!sec) return '—';
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
}

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentTrack, isPlaying, play, playAll, removeFromPlaylist, addToLibrary, isInLibrary } = useMusic();

  const load = async () => {
    setLoading(true);
    const pl = await playlistStore.getById(Number(id));
    setPlaylist(pl);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handleRemoveTrack = async (trackId) => {
    await removeFromPlaylist(Number(id), trackId);
    load();
  };

  const totalDuration = playlist?.tracks?.reduce((s, t) => s + (t.duration || 0), 0) || 0;
  const fmtTotal = `${Math.floor(totalDuration / 60)} phút`;

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-teal-neon/30 border-t-teal-neon rounded-full animate-spin" />
    </div>
  );

  if (!playlist) return (
    <div className="text-center py-32">
      <span className="material-symbols-outlined text-6xl text-white/10">queue_music</span>
      <p className="text-white/30 mt-4">Không tìm thấy playlist này</p>
      <button onClick={() => navigate('/library')} className="mt-4 text-teal-neon hover:underline text-sm">← Về thư viện</button>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex gap-8 mb-10 items-end">
        <div className="relative flex-shrink-0">
          {playlist.cover_url ? (
            <img src={playlist.cover_url} alt="" className="w-52 h-52 rounded-2xl object-cover shadow-2xl border border-white/10" />
          ) : (
            <div className="w-52 h-52 rounded-2xl bg-gradient-to-br from-fuchsia-neon/30 to-teal-neon/20 flex items-center justify-center border border-white/10 shadow-2xl">
              <span className="material-symbols-outlined text-white/30 text-7xl">queue_music</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 pb-2">
          <span className="text-[10px] uppercase tracking-widest text-white/30">Playlist</span>
          <h1 className="text-4xl font-extrabold text-white mt-2 mb-2">{playlist.name}</h1>
          {playlist.description && <p className="text-white/50 text-sm mb-3">{playlist.description}</p>}
          <p className="text-white/30 text-sm">{playlist.tracks.length} bài · {fmtTotal}</p>

          <div className="flex gap-4 mt-6">
            {playlist.tracks.length > 0 && (
              <>
                <button
                  onClick={() => playAll(playlist.tracks)}
                  className="flex items-center gap-2 px-7 py-3 bg-teal-neon text-synth-deep font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  Phát tất cả
                </button>
                <button
                  onClick={() => { const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5); playAll(shuffled); }}
                  className="flex items-center gap-2 px-6 py-3 border border-fuchsia-neon/40 text-fuchsia-neon rounded-full hover:bg-fuchsia-neon/10 transition-all font-semibold"
                >
                  <span className="material-symbols-outlined text-base">shuffle</span>
                  Ngẫu nhiên
                </button>
              </>
            )}
            <button
              onClick={() => navigate('/library')}
              className="flex items-center gap-2 px-6 py-3 border border-white/10 text-white/50 rounded-full hover:text-white hover:border-white/20 transition-all text-sm"
            >
              ← Thư viện
            </button>
          </div>
        </div>
      </div>

      {/* Track list */}
      {playlist.tracks.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-white/10">music_note</span>
          <p className="text-white/30 mt-4">Playlist chưa có bài hát nào</p>
          <p className="text-white/20 text-sm mt-1">Chuột phải vào bài nhạc trong Khám phá để thêm vào đây</p>
        </div>
      ) : (
        <div>
          {/* Table Header */}
          <div className="grid grid-cols-[32px_1fr_200px_60px_40px] gap-4 px-4 pb-2 border-b border-white/5 mb-1">
            <span className="text-white/30 text-xs">#</span>
            <span className="text-white/30 text-xs uppercase tracking-wide">Bài hát</span>
            <span className="text-white/30 text-xs uppercase tracking-wide hidden md:block">Album</span>
            <span className="text-white/30 text-xs uppercase tracking-wide text-right">⏱</span>
            <span />
          </div>

          <div className="flex flex-col gap-0.5">
            {playlist.tracks.map((track, i) => {
              const isActive = currentTrack?.id === track.id;
              const inLib = isInLibrary(track.id);
              return (
                <div
                  key={track.id}
                  onClick={() => play(track, playlist.tracks)}
                  className={`grid grid-cols-[32px_1fr_200px_60px_40px] gap-4 px-4 py-3 rounded-xl group cursor-pointer transition-all border items-center ${
                    isActive ? 'bg-teal-neon/10 border-teal-neon/30' : 'border-transparent hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="text-center">
                    {isActive && isPlaying ? (
                      <span className="material-symbols-outlined text-teal-neon text-base animate-pulse">graphic_eq</span>
                    ) : (
                      <>
                        <span className="text-white/30 text-sm font-label group-hover:hidden">{i + 1}</span>
                        <span className="material-symbols-outlined text-teal-neon text-base hidden group-hover:block" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    {track.cover_url
                      ? <img src={track.cover_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-white/10" />
                      : <div className="w-10 h-10 rounded-lg bg-synth-indigo/60 flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-white/30 text-sm">music_note</span></div>
                    }
                    <div className="min-w-0">
                      <p className={`text-sm font-bold truncate ${isActive ? 'text-teal-neon' : 'text-white'}`}>{track.title}</p>
                      <p className="text-xs text-white/40 truncate">{track.artist}</p>
                    </div>
                  </div>
                  <span className="text-xs text-white/30 truncate hidden md:block">{track.album || '—'}</span>
                  <span className="text-xs text-white/30 font-label text-right">{fmtTime(track.duration)}</span>
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); addToLibrary(track); }} title="Yêu thích"
                      className={`${inLib ? 'text-fuchsia-neon' : 'text-white/40 hover:text-fuchsia-neon'}`}>
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: inLib ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleRemoveTrack(track.id); }} title="Xóa khỏi playlist"
                      className="text-white/40 hover:text-red-400 transition-colors">
                      <span className="material-symbols-outlined text-base">remove_circle</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
