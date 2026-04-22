import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Chuẩn hóa user object từ API (có thể có nhiều format khác nhau)
const normalizeUser = (raw) => {
  if (!raw) return null;
  return {
    ...raw,
    // Ưu tiên role từ API, rồi mới suy ra từ is_admin
    role: raw.role || (raw.is_admin ? 'admin' : 'user'),
    name: raw.name || raw.username || raw.full_name || 'Người dùng',
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Đọc từ LocalStorage khi mở app
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(normalizeUser(parsed));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Hàm login — nhận user từ API
  const login = (userData) => {
    const normalized = normalizeUser(userData);
    setUser(normalized);
    // Cập nhật lại localStorage với data đã chuẩn hóa
    localStorage.setItem('user', JSON.stringify(normalized));
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Helper — kiểm tra role nhanh
  const isAdmin = user?.role === 'admin';
  const isCollaborator = user?.role === 'collaborator' || user?.role === 'ctv';

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isCollaborator }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
