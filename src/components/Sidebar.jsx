import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMusic } from '../contexts/MusicContext';

const NAV = [
  { to: '/', icon: 'home', label: 'Trang chủ', end: true },
  { to: '/discover', icon: 'explore', label: 'Khám phá' },
  { to: '/library', icon: 'library_music', label: 'Playlist' },
  { to: '/favorites', icon: 'favorite', label: 'Bài nhạc yêu thích' },
  { to: '/history', icon: 'history', label: 'Lịch sử nghe nhạc' },
  { to: '/my-music', icon: 'queue_music', label: 'Nhạc của tôi' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const { playlists, deletePlaylist } = useMusic();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="fixed h-full w-64 left-0 top-0 bg-synth-indigo/40 backdrop-blur-3xl flex flex-col py-8 px-4 z-50 border-r border-fuchsia-neon/10 shadow-[20px_0_50px_rgba(13,2,33,0.8)] font-['Manrope'] tracking-tight">
      {/* Logo */}
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-black text-white italic drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
          Nocturne
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-teal-neon font-label mt-1">Sonic Gallery</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.end}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'text-teal-neon font-bold bg-fuchsia-neon/5 glow-teal'
                : 'text-white/60 hover:text-fuchsia-neon hover:bg-white/5'
              }`
            }
          >
            <span className="material-symbols-outlined text-[22px]">{n.icon}</span>
            <span className="text-sm">{n.label}</span>
          </NavLink>
        ))}

        {/* Playlists */}
        {playlists.length > 0 && (
          <div className="pt-4 mt-4 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-white/30 px-4 mb-2">Danh sách phát</p>
            {playlists.map(pl => (
              <NavLink key={pl.id || pl._id} to={`/playlist/${pl.id || pl._id}`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 group ${isActive ? 'text-teal-neon bg-white/5' : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="material-symbols-outlined text-base">playlist_play</span>
                  <span className="text-xs truncate">{pl.playlist_name || pl.name || pl.title || 'Playlist Chưa có tên'}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm(`Bạn có chắc muốn xóa playlist "${pl.playlist_name || pl.name || pl.title}"?`)) {
                      deletePlaylist(pl.id || pl._id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className="mt-4 pt-4 border-t border-white/5 space-y-1">
        {/* Admin/Collaborator Panel shortcut */}
        {(user?.role === 'admin' || user?.role === 'collaborator') && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all border ${isActive
                ? 'bg-fuchsia-neon/20 border-fuchsia-neon/40 text-fuchsia-neon'
                : 'border-transparent bg-fuchsia-neon/10 text-fuchsia-neon hover:bg-fuchsia-neon/20 hover:border-fuchsia-neon/30'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {user.role === 'admin' ? 'admin_panel_settings' : 'dashboard'}
            </span>
            <span className="text-sm font-bold">{user.role === 'admin' ? 'Admin Panel' : 'CTV Dashboard'}</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-fuchsia-neon animate-pulse shadow-[0_0_6px_rgba(255,0,255,0.8)]" />
          </NavLink>
        )}

        {/* Collaborator Dashboard shortcut */}
        {isCollaborator && (
          <NavLink
            to="/collaborator"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all border ${
                isActive
                  ? 'bg-teal-neon/20 border-teal-neon/40 text-teal-neon font-bold'
                  : 'border-transparent bg-teal-neon/10 text-teal-neon hover:bg-teal-neon/20 hover:border-teal-neon/30'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">
              dashboard
            </span>
            <span className="text-sm font-bold">CTV Dashboard</span>
          </NavLink>
        )}

        {user ? (
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-teal-neon/20 border border-teal-neon/30 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-teal-neon text-base">person</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name || user.username}</p>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <span className="text-[9px] text-fuchsia-neon font-bold uppercase tracking-wide">Admin</span>
                )}
                <button onClick={handleLogout} className="text-[10px] text-white/40 hover:text-red-400 transition-colors">Đăng xuất</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-synth-magenta/30 p-4 rounded-xl border border-teal-neon/20">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-teal-neon to-fuchsia-neon text-synth-deep font-bold py-2 rounded-lg text-sm shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:scale-105 transition-transform">
              Đăng nhập
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
