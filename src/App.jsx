import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import Register from './components/Register';
import Login from './components/Login';

// ── Layout & components ─────────────────────────────────────────
import AppLayout from './components/AppLayout';

// ── Main Pages ──────────────────────────────────────────────────
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import LibraryPage from './pages/LibraryPage';
import PlaylistPage from './pages/PlaylistPage';
import MyMusicPage from './pages/MyMusicPage';

// ── Admin Pages ─────────────────────────────────────────────────
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTracksPage from './pages/admin/AdminTracksPage';
import AdminPendingPage from './pages/admin/AdminPendingPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminDeezerPage from './pages/admin/AdminDeezerPage';

function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <Routes>
          {/* ── App chính ── */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/playlist/:id" element={<PlaylistPage />} />
            <Route path="/my-music" element={<MyMusicPage />} />
          </Route>

          {/* ── Auth ── */}
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