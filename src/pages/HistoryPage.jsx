import { useMusic } from '../contexts/MusicContext';

function fmtTime(sec) {
  if (!sec) return '—';
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
}

export default function HistoryPage() {
  const { recentlyPlayed, currentTrack, isPlaying, play, addToLibrary, isInLibrary } = useMusic();

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">🕒 Lịch sử nghe nhạc</h1>
          <p className="text-white/40 text-sm">Danh sách các bài hát bạn đã nghe gần đây</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {recentlyPlayed.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-white/10">history</span>
            <p className="text-white/30 mt-4 text-lg">Chưa có bài hát nào trong lịch sử</p>
            <p className="text-white/20 text-sm mt-2">Hãy phát một bài hát để xem lịch sử tại đây</p>
          </div>
        ) : (
          recentlyPlayed.map((track, i) => {
            const isActive = currentTrack?.id === track.id;
            const inLib = isInLibrary(track.id);
            return (
              <div
                key={`${track.id}-${i}`}
                onClick={() => play(track, recentlyPlayed)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl group cursor-pointer transition-all border ${
                  isActive ? 'bg-teal-neon/10 border-teal-neon/30' :
                  'border-transparent hover:bg-white/5 hover:border-white/10'
                }`}
              >
                <div className="w-7 text-center flex-shrink-0">
                  {isActive && isPlaying ? (
                    <span className="material-symbols-outlined text-teal-neon text-lg animate-pulse">graphic_eq</span>
                  ) : (
                    <span className="text-white/30 text-sm font-label">{i + 1}</span>
                  )}
                </div>
                {track.cover_url
                  ? <img src={track.cover_url} alt="" className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-white/10" />
                  : <div className="w-11 h-11 rounded-lg bg-synth-indigo/60 flex items-center justify-center flex-shrink-0 border border-white/10"><span className="material-symbols-outlined text-white/30 text-sm">music_note</span></div>
                }
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isActive ? 'text-teal-neon' : 'text-white'}`}>{track.title}</p>
                  <p className="text-xs text-white/40 truncate">{track.artist}</p>
                </div>
                <span className="text-xs text-white/20 hidden md:block flex-shrink-0 w-28 truncate">{track.album}</span>
                <span className="text-xs text-white/30 font-label flex-shrink-0 w-10 text-right">{fmtTime(track.duration)}</span>
                <button
                  onClick={e => { e.stopPropagation(); addToLibrary(track); }}
                  className={`flex-shrink-0 ml-2 transition-colors ${inLib ? 'text-fuchsia-neon opacity-100' : 'text-white/40 hover:text-fuchsia-neon opacity-0 group-hover:opacity-100'}`}
                  title={inLib ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: inLib ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
