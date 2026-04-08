import { Sidebar, Header, MainContent, PlayerFooter } from './components';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';

function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <div className="dark">
          <Sidebar />
          <Header />
          <MainContent />
          <PlayerFooter />
        </div>
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;

export default App;