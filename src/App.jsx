import { Routes, Route } from 'react-router-dom'; // Thêm import này
import { Sidebar, Header, MainContent, PlayerFooter } from './components';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import Register from './components/Register'; // Nhớ import trang Register của bạn vào đây

// Tạo một Component gom nhóm Giao diện chính (có thanh bên, trình phát nhạc...)
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
          {/* Đường dẫn mặc định (Trang chủ nghe nhạc) */}
          <Route path="/" element={<MainLayout />} />

          {/* Đường dẫn sang trang Đăng ký full màn hình */}
          <Route path="/register" element={<Register />} />
        </Routes>
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;