import { Routes, Route } from 'react-router-dom';
import { Sidebar, Header, MainContent, PlayerFooter } from './components';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import Register from './components/Register';
import Login from './components/Login';

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
          <Route path="/" element={<MainLayout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;