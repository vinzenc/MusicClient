import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // 1. IMPORT THÊM CÁI NÀY

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate(); // 2. KHỞI TẠO HÀM CHUYỂN TRANG

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
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogin = () => {
    // 3. SỬA HÀM NÀY: Chuyển hướng sang trang đăng ký
    navigate('/register');
    setDropdownOpen(false);
  };

  const handleProfile = () => {
    // TODO: Navigate to profile page
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

        {/* User Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={loading}
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-teal-neon/30 hover:border-teal-neon transition-all overflow-hidden disabled:opacity-50"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User avatar'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-white/60 text-xl">person</span>
            )}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-synth-indigo/95 backdrop-blur-md border border-fuchsia-neon/20 rounded-xl shadow-lg py-2 z-50">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-fuchsia-neon/10">
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    {user.tier && (
                      <p className="text-xs text-yellow-cyber font-label">{user.tier.toUpperCase()}</p>
                    )}
                  </div>

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
                    <span>{loading ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Nút đăng nhập - Bấm vào sẽ kích hoạt hàm handleLogin */}
                  <button
                    onClick={handleLogin}
                    className="w-full text-left px-4 py-3 text-teal-neon hover:bg-teal-neon/10 transition-all flex items-center gap-3 font-semibold"
                  >
                    <span className="material-symbols-outlined text-lg">login</span>
                    <span>Đăng nhập & Đăng ký</span>
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