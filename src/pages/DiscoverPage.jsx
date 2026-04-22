import { useState, useEffect, useMemo } from 'react';
import { songAPI } from '../services/api';
import { useMusic } from '../contexts/MusicContext';

// Danh sách genre tĩnh (giữ nguyên để không phạm vỡ UI)
const GENRES = ['Pop', 'Hip-hop', 'R&B', 'K-Pop', 'Synth-pop', 'Disco-pop', 'Afrobeats', 'Indie-pop', 'Dance-pop'];

function fmtTime(sec) {
  if (!sec) return '—';
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
}

const TABS = ['Tất cả', 'Mới nhất', ...GENRES.slice(0, 6)];

export default function DiscoverPage() {
  const [allTracks, setAllTracks] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('Tất cả');
  const { currentTrack, isPlaying, play, addToLibrary, removeFromLibrary, isInLibrary, playlists, addToPlaylist } = useMusic();
  const [contextMenu, setContextMenu] = useState(null); // { track, x, y }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    songAPI.getList({ limit: 100 })
      .then(r => setAllTracks(r.data || []))
      .catch(() => setAllTracks([]))
      .finally(() => setIsLoading(false));
  }, []);

  const displayed = useMemo(() => {
    let data = [...allTracks];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        (t.album || '').toLowerCase().includes(q)
      );
    }
    if (tab === 'Mới nhất') {
      data = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (tab !== 'Tất cả') {
      data = data.filter(t => t.genre === tab);
    }
    return data;
  }, [allTracks, search, tab]);

  const handleContextMenu = (e, track) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ track, x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const hide = () => setContextMenu(null);
    window.addEventListener('click', hide);
    return () => window.removeEventListener('click', hide);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-1">🔍 Khám phá</h1>
        <p className="text-white/40 text-sm">Tìm kiếm và nghe nhạc yêu thích</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-xl">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl">search</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm tên bài, nghệ sĩ, album..."
          className="w-full bg-synth-indigo/40 border border-fuchsia-neon/20 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-teal-neon/50 transition-colors"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${
              tab === t
                ? 'bg-teal-neon/20 border-teal-neon/40 text-teal-neon'
                : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-white/30">
          <span className="material-symbols-outlined text-4xl animate-spin text-fuchsia-neon">sync</span>
          <p className="mt-4">Đang tải nhạc...</p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <span className="material-symbols-outlined text-6xl">music_off</span>
          <p className="mt-4">Không tìm thấy kết quả nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
          {displayed.map(track => {
            const isActive = currentTrack?.id === track.id;
            const inLib = isInLibrary(track.id);
            return (
              <div
                key={track.id}
                onClick={() => play(track, displayed)}
                onContextMenu={e => handleContextMenu(e, track)}
                className={`group flex flex-col gap-3 p-3 rounded-2xl cursor-pointer border transition-all ${
                  isActive
                    ? 'bg-teal-neon/10 border-teal-neon/30'
                    : 'border-transparent hover:bg-white/5 hover:border-white/10'
                }`}
              >
                <div className="relative">
                  {track.cover_url ? (
                    <img src={track.cover_url} alt="" className="w-full aspect-square rounded-xl object-cover border border-white/10 group-hover:scale-[1.03] transition-transform" />
                  ) : (
                    <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-synth-indigo to-synth-magenta flex items-center justify-center border border-white/10">
                      <span className="material-symbols-outlined text-white/30 text-4xl">music_note</span>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-teal-neon text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {isActive && isPlaying ? 'pause_circle' : 'play_circle'}
                    </span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); inLib ? removeFromLibrary(track.id) : addToLibrary(track); }}
                    className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all w-8 h-8 rounded-full bg-synth-deep/70 flex items-center justify-center ${inLib ? 'opacity-100 text-fuchsia-neon' : 'text-white/60 hover:text-fuchsia-neon'}`}
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: inLib ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  </button>
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-bold truncate ${isActive ? 'text-teal-neon' : 'text-white'}`}>{track.title}</p>
                  <p className="text-xs text-white/40 truncate">{track.artist}</p>
                  <div className="flex items-center justify-between mt-1">
                    {track.genre && <span className="text-[10px] text-fuchsia-neon/60 uppercase tracking-wide">{track.genre}</span>}
                    <span className="text-[10px] text-white/20">{fmtTime(track.duration)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 9999 }}
          className="bg-synth-indigo/95 backdrop-blur border border-fuchsia-neon/20 rounded-xl shadow-2xl py-2 min-w-[180px]"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={() => { play(contextMenu.track, displayed); setContextMenu(null); }}
            className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:text-teal-neon hover:bg-white/5 flex items-center gap-3">
            <span className="material-symbols-outlined text-base">play_arrow</span> Phát ngay
          </button>
          <button onClick={() => { isInLibrary(contextMenu.track.id) ? removeFromLibrary(contextMenu.track.id) : addToLibrary(contextMenu.track); setContextMenu(null); }}
            className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:text-fuchsia-neon hover:bg-white/5 flex items-center gap-3">
            <span className="material-symbols-outlined text-base">favorite</span>
            {isInLibrary(contextMenu.track.id) ? 'Xóa khỏi thư viện' : 'Thêm vào thư viện'}
          </button>
          {playlists.map(pl => (
            <button key={pl.id} onClick={() => { addToPlaylist(pl.id, contextMenu.track.id); setContextMenu(null); }}
              className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:text-yellow-cyber hover:bg-white/5 flex items-center gap-3">
              <span className="material-symbols-outlined text-base">playlist_add</span> + {pl.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
