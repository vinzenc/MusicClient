import { musicAPI } from '../services/api';
import React, { createContext, useState, useContext, useEffect } from 'react';
const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Vừa mở web lên là chạy vào LocalStorage tìm xem trước đó có đăng nhập chưa
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Tìm thấy thì set luôn tên cho Header
    }
    setLoading(false);
  }, []);

  // 2. Hàm xử lý khi người dùng login thành công
  const login = (userData) => {
    setUser(userData); // Cập nhật state để Header tự động đổi giao diện
  };

  // 3. Hàm xử lý đăng xuất
  const logout = () => {
    setUser(null); // Xóa state
    localStorage.removeItem('token'); // Xóa bộ nhớ
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
