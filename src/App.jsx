import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';

// ── Layout & components ─────────────────────────────────────────
import AppLayout from './components/AppLayout';

// ── Main Pages ──────────────────────────────────────────────────
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import LibraryPage from './pages/LibraryPage';
import PlaylistPage from './pages/PlaylistPage';
import MyMusicPage from './pages/MyMusicPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';

// ── Admin Pages ─────────────────────────────────────────────────
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTracksPage from './pages/admin/AdminTracksPage';
import AdminPendingPage from './pages/admin/AdminPendingPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import CollaboratorDashboard from './pages/collaborator/CollaboratorDashboard';

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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/collaborator" element={<CollaboratorDashboard />} />
          </Route>

          {/* ── Auth ── */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ── Admin Panel ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="tracks" element={<AdminTracksPage />} />
            <Route path="pending" element={<AdminPendingPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;