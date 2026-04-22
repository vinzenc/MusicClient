import { useEffect, useCallback } from 'react';
import { useMusic } from '../contexts/MusicContext';

function fmtTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function PlayerFooter() {
  const {
    currentTrack, isPlaying, progress, duration,
    volume, isMuted, shuffle, repeat,
    togglePlay, nextTrack, prevTrack, seek,
    setVolume, toggleMute, toggleShuffle, toggleRepeat,
    addToLibrary, isInLibrary,
  } = useMusic();

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;
  const inLibrary = currentTrack ? isInLibrary(currentTrack.id) : false;

  const handleProgressClick = useCallback((e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(duration, pct * duration)));
  }, [duration, seek]);

  const handleVolumeClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, pct)));
  }, [setVolume]);

  const repeatIcon = repeat === 'one' ? 'repeat_one' : 'repeat';
  const repeatActive = repeat !== 'none';

  if (!currentTrack) return null;

  return (
    <footer className="fixed bottom-0 left-0 w-full h-24 bg-synth-magenta/40 backdrop-blur-3xl border-t border-fuchsia-neon/20 flex items-center justify-between px-8 z-50 shadow-[0_-10px_50px_rgba(0,0,0,0.7)]">

      {/* ── Left: Track Info ── */}
      <div className="flex items-center gap-4 w-1/4 min-w-0">
        {currentTrack ? (
          <>
            {currentTrack.cover_url ? (
              <img src={currentTrack.cover_url} alt="" className="w-14 h-14 rounded shadow-lg border border-teal-neon/30 object-cover flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded bg-synth-indigo/60 border border-teal-neon/20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-teal-neon/50">music_note</span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h5 className="text-sm font-bold truncate text-white">{currentTrack.title}</h5>
              <p className="text-xs text-teal-neon font-label opacity-80 truncate">{currentTrack.artist}</p>
            </div>
            <button
              onClick={() => currentTrack && addToLibrary(currentTrack)}
              title={inLibrary ? 'Đã lưu' : 'Thêm vào thư viện'}
              className={`flex-shrink-0 transition-colors ${inLibrary ? 'text-fuchsia-neon' : 'text-white/40 hover:text-fuchsia-neon'}`}
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: inLibrary ? "'FILL' 1" : "'FILL' 0" }}>
                favorite
              </span>
            </button>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded bg-synth-indigo/30 border border-teal-neon/10 flex-shrink-0" />
            <p className="text-sm text-white/30">Chưa phát track nào</p>
          </>
        )}
      </div>

      {/* ── Center: Controls ── */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl px-8">
        <div className="flex items-center gap-5">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`hover:scale-110 active:scale-90 transition-all ${shuffle ? 'text-teal-neon hover:brightness-125 drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]' : 'text-white/40 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'}`}
          >
            <span className="material-symbols-outlined text-xl">shuffle</span>
          </button>

          {/* Prev */}
          <button onClick={prevTrack} className="text-white/40 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] hover:scale-110 transition-all active:scale-90">
            <span className="material-symbols-outlined text-2xl">skip_previous</span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => togglePlay()}
            className="bg-gradient-to-b from-teal-neon to-teal-neon/80 text-synth-deep rounded-full w-14 h-14 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-[0_0_25px_rgba(0,243,255,0.7)] flex-shrink-0"
          >
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Next */}
          <button onClick={nextTrack} className="text-white/40 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] hover:scale-110 transition-all active:scale-90">
            <span className="material-symbols-outlined text-2xl">skip_next</span>
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className={`hover:scale-110 active:scale-90 transition-all ${repeatActive ? 'text-teal-neon hover:brightness-125 drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]' : 'text-white/40 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'}`}
          >
            <span className="material-symbols-outlined text-xl">{repeatIcon}</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] font-label text-white/40 flex-shrink-0 w-8 text-right">{fmtTime(progress)}</span>
          <div className="relative flex-1 h-1.5 bg-white/10 rounded-full group hover:h-2 transition-all flex items-center">
            {/* Progress fill */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-neon to-fuchsia-neon shadow-[0_0_10px_rgba(0,243,255,0.6)] rounded-full transition-none pointer-events-none"
              style={{ width: `${progressPct}%` }}
            />
            {/* Thumb */}
            <div 
              className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity group-hover:scale-125 z-10"
              style={{ left: `${progressPct}%`, transform: 'translateX(-50%)' }}
            />
            {/* Native input for real-time drag */}
            <input 
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 m-0"
            />
          </div>
          <span className="text-[10px] font-label text-white/40 flex-shrink-0 w-8">{fmtTime(duration)}</span>
        </div>
      </div>

      {/* ── Right: Volume ── */}
      <div className="flex items-center justify-end gap-4 w-1/4">
        <button className="text-white/40 hover:text-teal-neon transition-colors flex-shrink-0">
          <span className="material-symbols-outlined text-xl">queue_music</span>
        </button>

        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-white/40 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all flex-shrink-0 hover:scale-110 active:scale-90">
            <span className="material-symbols-outlined text-xl">
              {isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
            </span>
          </button>
          <div className="relative w-24 h-2 bg-white/10 rounded-full group hover:h-2.5 transition-all flex items-center">
            {/* Volume fill */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-cyber to-fuchsia-neon shadow-[0_0_8px_rgba(243,255,0,0.6)] rounded-full transition-none pointer-events-none"
              style={{ width: `${isMuted ? 0 : volume * 100}%` }}
            />
            {/* Thumb */}
            <div 
              className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity group-hover:scale-125 z-10"
              style={{ left: `${isMuted ? 0 : volume * 100}%`, transform: 'translateX(-50%)' }}
            />
            {/* Native input for real-time drag */}
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 m-0"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
