import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMusic } from '../contexts/MusicContext';
import { useNavigate, Link } from 'react-router-dom';
import { notificationStore, deezerAPI } from '../services/mockStore';

// custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Header() {
  const { user, logout, isAdmin, loading } = useAuth();
  const { play } = useMusic();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 500);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  const navigate = useNavigate();

  // Close dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications
  const loadNotifs = async () => {
    if (user) {
      const n = await notificationStore.getByUser(user.name || user.username);
      setNotifications(n || []);
    }
  };

  useEffect(() => {
    loadNotifs();
    // Poll every 5s for demo
    const intv = setInterval(loadNotifs, 5000);
    return () => clearInterval(intv);
  }, [user, loadNotifs]);

  // Handle Deezer Search
  useEffect(() => {
    const doSearch = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const res = await deezerAPI.search(debouncedQuery);
        setSearchResults(res.data || []);
        setSearchOpen(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    };
    doSearch();
  }, [debouncedQuery]);

  const handlePlaySearch = (track) => {
    const standardTrack = {
      ...track,
      id: `dz_${track.id}`,
      deezer_id: String(track.id),
      cover_url: track.cover,
      preview_url: track.preview,
      genre: 'Deezer Search'
    };
    play(standardTrack, searchResults.map(t => ({...t, id: `dz_${t.id}`, cover_url: t.cover, preview_url: t.preview})));
    setSearchOpen(false);
  };

  const handleMarkAsRead = async (id) => {
    await notificationStore.markAsRead(id);
    loadNotifs();
  };

  const handleMarkAllRead = async () => {
    if (user) {
      await notificationStore.markAllAsRead(user.name || user.username);
      loadNotifs();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate('/login'); // Đăng xuất xong thì đẩy về trang đăng nhập
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogin = () => {
    navigate('/login'); // Sửa lại trỏ về login cho chuẩn
    setDropdownOpen(false);
  };

  const handleProfile = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] flex justify-between items-center px-12 h-20 z-40 bg-transparent font-['Manrope'] font-medium">
      <div className="flex-1 max-w-xl relative" ref={searchRef}>
        <div className="relative group z-50">
          <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-teal-neon' : 'text-white/40 group-focus-within:text-teal-neon'}`}>
            search
          </span>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => { if(searchResults.length > 0) setSearchOpen(true); }}
            className="w-full bg-synth-indigo/30 border border-fuchsia-neon/20 rounded-full py-2.5 pl-12 pr-10 text-sm focus:ring-1 focus:ring-teal-neon/50 focus:bg-synth-indigo/50 font-label placeholder:text-white/20 transition-all text-white outline-none"
            placeholder="Tìm bài hát, ca sĩ trên Deezer..."
            type="text"
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setSearchResults([]); setSearchOpen(false); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors flex items-center"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* --- Search Results Dropdown --- */}
        {searchOpen && searchQuery && (
          <div className="absolute top-12 left-0 right-0 bg-[#181d36] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden py-2 z-40 max-h-96 flex flex-col">
            <div className="px-4 py-2 border-b border-white/5 text-xs text-fuchsia-neon font-bold uppercase tracking-widest flex items-center justify-between">
              <span>Đang tìm kiếm trên Deezer</span>
              {isSearching && <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>}
            </div>
            
            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {!isSearching && searchResults.length === 0 ? (
                <div className="text-center py-6 text-white/40 text-sm">Không tìm thấy bài hát nào</div>
              ) : (
                searchResults.map(t => (
                  <div 
                    key={t.id}
                    onClick={() => handlePlaySearch(t)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-colors"
                  >
                    <img src={t.cover} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-bold truncate group-hover:text-teal-neon transition-colors">{t.title}</p>
                      <p className="text-xs text-white/50 truncate">{t.artist}</p>
                    </div>
                    <span className="material-symbols-outlined text-white/0 group-hover:text-teal-neon transition-colors text-[20px] mr-2">
                      play_arrow
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 ml-8">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="text-white/60 hover:text-fuchsia-neon transition-colors relative mt-1"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {notifications.some(n => !n.isRead) && (
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-[#0B0F19] shadow-[0_0_10px_rgba(250,204,21,0.8)]"></span>
            )}
          </button>
          
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-[#181d36] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden py-2 z-50">
              <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-white font-bold">Thông báo</h3>
                {notifications.some(n => !n.isRead) && (
                  <button onClick={handleMarkAllRead} className="text-xs text-fuchsia-neon hover:text-white transition-colors">Đánh dấu đã đọc</button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-white/40 text-sm">Chưa có thông báo nào.</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => handleMarkAsRead(n.id)}
                      className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-fuchsia-neon/5' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5" style={{ color: n.type === 'success' ? '#10b981' : n.type === 'error' ? '#ef4444' : '#a78bfa' }}>
                          {n.type === 'success' ? 'check_circle' : n.type === 'error' ? 'cancel' : 'info'}
                        </span>
                        <div>
                          <p className={`text-sm ${!n.isRead ? 'text-white' : 'text-white/70'}`}>{n.message}</p>
                          <span className="text-[10px] text-white/40 mt-1 block">{new Date(n.created_at).toLocaleTimeString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Panel Button — chỉ hiện với admin */}
        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            title="Admin Panel"
            className="relative flex items-center justify-center w-9 h-9 rounded-full border border-fuchsia-neon/30 bg-fuchsia-neon/10 hover:bg-fuchsia-neon/25 hover:border-fuchsia-neon/70 transition-all group shadow-[0_0_12px_rgba(255,0,255,0.15)] hover:shadow-[0_0_20px_rgba(255,0,255,0.4)]"
          >
            <span
              className="material-symbols-outlined text-fuchsia-neon text-[18px] group-hover:scale-110 transition-transform"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              admin_panel_settings
            </span>
            {/* Pulse dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-fuchsia-neon rounded-full border-2 border-synth-deep animate-pulse shadow-[0_0_6px_rgba(255,0,255,0.8)]" />
          </button>
        )}

        {/* KHU VỰC AVATAR & TÊN NGƯỜI DÙNG */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={loading}
            // Sửa class ở đây: Đổi thành flex row có khoảng cách (gap-3) để chứa cả chữ và hình
            className="flex items-center gap-3 hover:opacity-80 transition-all disabled:opacity-50 bg-synth-indigo/20 px-2 py-1.5 rounded-full border border-transparent hover:border-teal-neon/30"
          >
            {/* Hình Avatar */}
            <div className="flex items-center justify-center w-9 h-9 rounded-full border border-teal-neon/30 overflow-hidden bg-synth-indigo/50">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username || 'User avatar'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-white/60 text-lg">person</span>
              )}
            </div>

            {/* Tên người dùng (Chỉ hiện khi biến 'user' có dữ liệu) */}
            {user && (
              <span className="text-sm font-semibold text-white pr-3 hidden md:block">
                {user.username || user.name || 'Người dùng'}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-synth-indigo/95 backdrop-blur-md border border-fuchsia-neon/20 rounded-xl shadow-lg py-2 z-50">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border-fuchsia-neon/10">
                    <p className="text-sm font-semibold text-white">{user.username || user.name}</p>
                    {user.email && (
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{user.email}</p>
                    )}
                    {/* Role badge */}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {user.role === 'admin' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-neon/20 text-fuchsia-neon font-bold tracking-wide border border-fuchsia-neon/30">ADMIN</span>
                      )}
                      {user.role === 'collaborator' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-neon/20 text-teal-neon font-bold tracking-wide border border-teal-neon/30">CTV</span>
                      )}
                      {user.tier && (
                        <span className="text-[10px] text-yellow-cyber font-label">{user.tier.toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                  {/* Admin Panel — only for admin */}
                  {isAdmin && (
                    <button
                      onClick={() => { navigate('/admin'); setDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-fuchsia-neon hover:text-white hover:bg-fuchsia-neon/15 transition-all flex items-center gap-3 font-semibold border-b border-fuchsia-neon/10"
                    >
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                      <span>Admin Panel</span>
                      <span className="ml-auto text-[10px] bg-fuchsia-neon/20 text-fuchsia-neon px-1.5 py-0.5 rounded">ADMIN</span>
                    </button>
                  )}

                  {/* Profile */}
                  <button
                    onClick={handleProfile}
                    className="w-full text-left px-4 py-2 text-white/80 hover:text-teal-neon hover:bg-fuchsia-neon/10 transition-all flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-lg">account_circle</span>
                    <span>Hồ sơ</span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full text-left px-4 py-2 text-white/80 hover:text-fuchsia-neon hover:bg-fuchsia-neon/10 transition-all flex items-center gap-3 border-t border-fuchsia-neon/10 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span>{loading ? 'Đang xuất...' : 'Đăng xuất'}</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Nút đăng nhập/Đăng ký khi chưa login */}
                  <button
                    onClick={handleLogin}
                    className="w-full text-left px-4 py-3 text-teal-neon hover:bg-teal-neon/10 transition-all flex items-center gap-3 font-semibold"
                  >
                    <span className="material-symbols-outlined text-lg">login</span>
                    <span>Đăng nhập / Đăng ký</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}