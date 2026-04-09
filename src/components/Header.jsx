import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout, loading, isAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  // Close dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    console.log('TODO: Navigate to profile page');
    setDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] flex justify-between items-center px-12 h-20 z-40 bg-transparent font-['Manrope'] font-medium">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-teal-neon transition-colors">
            search
          </span>
          <input
            className="w-full bg-synth-indigo/30 border border-fuchsia-neon/20 rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-1 focus:ring-teal-neon/50 focus:bg-synth-indigo/50 font-label placeholder:text-white/20 transition-all text-white outline-none"
            placeholder="Search artists, tracks, or mood..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <button className="text-white/60 hover:text-fuchsia-neon transition-colors relative">
          <span className="material-symbols-outlined" data-icon="notifications">
            notifications
          </span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-cyber rounded-full border border-synth-deep shadow-[0_0_5px_#f3ff00]"></span>
        </button>

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