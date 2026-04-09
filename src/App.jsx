import { Routes, Route } from 'react-router-dom';
import { Sidebar, Header, MainContent, PlayerFooter } from './components';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import Register from './components/Register';
import Login from './components/Login';

// ── Admin Pages ────────────────────────────────────────────────
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTracksPage from './pages/admin/AdminTracksPage';
import AdminPendingPage from './pages/admin/AdminPendingPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminDeezerPage from './pages/admin/AdminDeezerPage';

const MainLayout = () => {
  return (
    <div className="dark">
      <Sidebar />
      <Header />
      <MainContent />
      <PlayerFooter />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <Routes>
          {/* ── App chính (giữ nguyên) ── */}
          <Route path="/" element={<MainLayout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Admin Panel ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="tracks" element={<AdminTracksPage />} />
            <Route path="pending" element={<AdminPendingPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="deezer" element={<AdminDeezerPage />} />
          </Route>
        </Routes>
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;