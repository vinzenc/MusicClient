import { createContext, useContext, useState, useEffect } from 'react';
import { musicAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const userData = await musicAPI.getCurrentUser();
        setUser(userData);
        setError(null);
      } catch (err) {
        console.log('Not authenticated:', err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await musicAPI.login(email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);
      const response = await musicAPI.register(email, password, name);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await musicAPI.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
