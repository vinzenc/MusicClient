import { useState } from 'react';
import { useMusic } from '../contexts/MusicContext';
import { useNavigate } from 'react-router-dom';

function fmtTime(sec) {
  if (!sec) return '—';
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
}

export default function LibraryPage() {
  const {
    library, playlists, currentTrack, isPlaying,
    play, playAll, removeFromLibrary, createPlaylist, addToPlaylist,
  } = useMusic();
  const navigate = useNavigate();
  const [tab, setTab] = useState('tracks'); // 'tracks' | 'playlists'
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [addTarget, setAddTarget] = useState(null); // playlistId to add selected tracks to

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    await createPlaylist(newPlaylistName.trim());
    setNewPlaylistName('');
    setCreating(false);
  };

  const handleAddSelectedToPlaylist = async (playlistId) => {
    for (const id of selected) {
      await addToPlaylist(playlistId, id);
    }
    setSelected(new Set());
    setSelectMode(false);
    setAddTarget(null);
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">📚 Thư viện</h1>
          <p className="text-white/40 text-sm">Nhạc yêu thích và danh sách phát của bạn</p>
        </div>
        {tab === 'playlists' && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-fuchsia-neon/20 border border-fuchsia-neon/40 text-fuchsia-neon rounded-xl font-semibold text-sm hover:bg-fuchsia-neon/30 transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Tạo playlist
          </button>
        )}
        {tab === 'tracks' && library.length > 0 && (
          <div className="flex gap-3">
            {selectMode ? (
              <>
                <button
                  onClick={() => { setSelectMode(false); setSelected(new Set()); }}
                  className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-xl transition"
                >Hủy</button>
                {selected.size > 0 && playlists.map(pl => (
                  <button key={pl.id} onClick={() => handleAddSelectedToPlaylist(pl.id)}
                    className="px-4 py-2 text-sm bg-yellow-cyber/10 border border-yellow-cyber/30 text-yellow-cyber rounded-xl hover:bg-yellow-cyber/20 transition">
                    + {pl.name}
                  </button>
                ))}
              </>
            ) : (
              <>
                <button onClick={() => playAll(library)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-teal-neon/20 border border-teal-neon/40 text-teal-neon rounded-xl font-semibold text-sm hover:bg-teal-neon/30 transition-all">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  Phát tất cả
                </button>
                <button onClick={() => setSelectMode(true)}
                  className="px-5 py-2.5 text-sm border border-white/10 text-white/50 hover:text-white rounded-xl transition">
                  Chọn
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-white/5 rounded-xl p-1 w-fit">
        {[{ v: 'tracks', l: `🎵 Bài hát (${library.length})` }, { v: 'playlists', l: `📋 Playlist (${playlists.length})` }].map(({ v, l }) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === v ? 'bg-fuchsia-neon/20 text-fuchsia-neon' : 'text-white/50 hover:text-white'}`}
          >{l}</button>
        ))}
      </div>

      {/* ── TRACKS TAB ── */}
      {tab === 'tracks' && (
        library.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-white/10">favorite</span>
            <p className="text-white/30 mt-4 text-lg">Chưa có bài hát nào trong thư viện</p>
            <p className="text-white/20 text-sm mt-2">Nhấn ❤️ trên bài hát để thêm vào đây</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {library.map((track, i) => {
              const isActive = currentTrack?.id === track.id;
              const sel = selected.has(track.id);
              return (
                <div
                  key={track.id}
                  onClick={() => selectMode ? toggleSelect(track.id) : play(track, library)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl group cursor-pointer transition-all border ${
                    isActive ? 'bg-teal-neon/10 border-teal-neon/30' :
                    sel ? 'bg-fuchsia-neon/10 border-fuchsia-neon/30' :
                    'border-transparent hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  {selectMode ? (
                    <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 ${sel ? 'bg-fuchsia-neon border-fuchsia-neon' : 'border-white/30'}`}>
                      {sel && <span className="material-symbols-outlined text-synth-deep text-xs">check</span>}
                    </div>
                  ) : (
                    <div className="w-7 text-center flex-shrink-0">
                      {isActive && isPlaying ? (
                        <span className="material-symbols-outlined text-teal-neon text-lg animate-pulse">graphic_eq</span>
                      ) : (
                        <span className="text-white/30 text-sm font-label">{i + 1}</span>
                      )}
                    </div>
                  )}
                  {track.cover_url
                    ? <img src={track.cover_url} alt="" className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-white/10" />
                    : <div className="w-11 h-11 rounded-lg bg-synth-indigo/60 flex items-center justify-center flex-shrink-0 border border-white/10"><span className="material-symbols-outlined text-white/30 text-sm">music_note</span></div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isActive ? 'text-teal-neon' : 'text-white'}`}>{track.title}</p>
                    <p className="text-xs text-white/40 truncate">{track.artist}</p>
                  </div>
                  <span className="text-xs text-white/20 hidden md:block flex-shrink-0 w-28 truncate">{track.album}</span>
                  <span className="text-xs text-white/30 font-label flex-shrink-0 w-10 text-right">{fmtTime(track.duration)}</span>
                  <button
                    onClick={e => { e.stopPropagation(); removeFromLibrary(track.id); }}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-fuchsia-neon hover:text-red-400"
                    title="Xóa khỏi thư viện"
                  >
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </button>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ── PLAYLISTS TAB ── */}
      {tab === 'playlists' && (
        <div>
          {creating && (
            <div className="mb-6 p-5 bg-synth-indigo/40 rounded-2xl border border-fuchsia-neon/20">
              <p className="text-sm text-white/60 mb-3">Tên playlist mới</p>
              <div className="flex gap-3">
                <input
                  autoFocus
                  value={newPlaylistName}
                  onChange={e => setNewPlaylistName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreatePlaylist()}
                  placeholder="VD: Chill Vibes..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-teal-neon/50"
                />
                <button onClick={handleCreatePlaylist} className="px-6 py-2.5 bg-fuchsia-neon/20 border border-fuchsia-neon/40 text-fuchsia-neon rounded-xl font-semibold text-sm hover:bg-fuchsia-neon/30 transition">Tạo</button>
                <button onClick={() => setCreating(false)} className="px-4 py-2.5 border border-white/10 text-white/50 rounded-xl text-sm hover:text-white transition">Hủy</button>
              </div>
            </div>
          )}

          {playlists.length === 0 && !creating ? (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-6xl text-white/10">queue_music</span>
              <p className="text-white/30 mt-4 text-lg">Chưa có playlist nào</p>
              <button onClick={() => setCreating(true)} className="mt-4 px-6 py-2.5 bg-fuchsia-neon/20 border border-fuchsia-neon/40 text-fuchsia-neon rounded-xl font-semibold text-sm hover:bg-fuchsia-neon/30 transition">Tạo playlist đầu tiên</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {playlists.map(pl => (
                <div
                  key={pl.id}
                  onClick={() => navigate(`/playlist/${pl.id}`)}
                  className="group flex flex-col gap-3 p-4 rounded-2xl cursor-pointer border border-transparent hover:bg-white/5 hover:border-white/10 transition-all"
                >
                  {pl.cover_url ? (
                    <img src={pl.cover_url} alt="" className="w-full aspect-square rounded-xl object-cover border border-white/10 group-hover:scale-[1.03] transition-transform" />
                  ) : (
                    <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-synth-indigo to-synth-magenta flex items-center justify-center border border-white/10">
                      <span className="material-symbols-outlined text-white/30 text-4xl">queue_music</span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-white text-sm truncate group-hover:text-fuchsia-neon transition-colors">{pl.name}</p>
                    <p className="text-xs text-white/40">{pl.trackIds.length} bài</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
