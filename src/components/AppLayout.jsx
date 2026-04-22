import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import PlayerFooter from './PlayerFooter';
import { useMusic } from '../contexts/MusicContext';

export default function AppLayout() {
  const { currentTrack } = useMusic();
  return (
    <div className="dark">
      <Sidebar />
      <Header />
      <main className={`ml-64 ${currentTrack ? 'pb-28' : 'pb-10'} min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(45,10,49,0.5),rgba(13,2,33,1))]`}>
        <div className="pt-24 px-10">
          <Outlet />
        </div>
      </main>
      <PlayerFooter />
    </div>
  );
}
