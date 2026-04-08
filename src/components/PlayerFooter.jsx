import { useState, useRef } from 'react';
import { useMusic } from '../contexts/MusicContext';

export default function PlayerFooter() {
  const { currentTrack, isPlaying, togglePlayPause, skipTrack } = useMusic();
  const [volume, setVolume] = useState(65);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(102); // 1:42 in seconds
  const duration = 260; // 4:20 in seconds
  const volumeBarRef = useRef(null);
  const progressBarRef = useRef(null);

  const handlePlayPause = async () => {
    try {
      await togglePlayPause();
    } catch (error) {
      console.error('Play/pause failed:', error);
    }
  };

  const handleSkipNext = async () => {
    try {
      await skipTrack('next');
    } catch (error) {
      console.error('Skip next failed:', error);
    }
  };

  const handleSkipPrev = async () => {
    try {
      await skipTrack('prev');
    } catch (error) {
      console.error('Skip previous failed:', error);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleVolumeBarClick = (e) => {
    if (!volumeBarRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(100, Math.round(percentage * 100)));
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleProgressBarClick = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(duration, Math.round(percentage * duration)));
    setCurrentTime(newTime);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <footer className="fixed bottom-0 left-0 w-full h-24 bg-synth-magenta/40 backdrop-blur-3xl border-t border-fuchsia-neon/20 flex items-center justify-between px-8 z-50 shadow-[0_-10px_50px_rgba(0,0,0,0.7)]">
      {/* Track Info - Left */}
      <div className="flex items-center gap-4 w-1/4 min-w-0">
        {currentTrack ? (
          <>
            <img
              alt="Current Track"
              className="w-14 h-14 rounded shadow-lg border border-teal-neon/30 object-cover flex-shrink-0"
              src={currentTrack.image || 'https://via.placeholder.com/56'}
            />
            <div className="min-w-0">
              <h5 className="text-sm font-bold truncate text-white">{currentTrack.title}</h5>
              <p className="text-xs text-teal-neon font-label opacity-80 truncate">{currentTrack.artist}</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded shadow-lg border border-teal-neon/30 bg-synth-indigo/30 flex-shrink-0"></div>
            <div>
              <h5 className="text-sm font-bold text-white/50">No track playing</h5>
            </div>
          </>
        )}
        <button className="text-white/40 hover:text-fuchsia-neon transition-colors ml-2 flex-shrink-0">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>
            favorite
          </span>
        </button>
      </div>

      {/* Player Controls - Center */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl px-8">
        {/* Play/Pause & Skip Buttons */}
        <div className="flex items-center gap-6">
          <button 
            onClick={handleSkipPrev}
            className="text-white/40 hover:text-teal-neon hover:scale-110 transition-transform active:scale-90"
          >
            <span className="material-symbols-outlined text-2xl">skip_previous</span>
          </button>

          {/* Play Button - Circular */}
          <button 
            onClick={handlePlayPause}
            className="bg-gradient-to-b from-teal-neon to-teal-neon/80 text-synth-deep rounded-full w-14 h-14 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-[0_0_25px_rgba(0,243,255,0.7)] flex-shrink-0"
          >
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button 
            onClick={handleSkipNext}
            className="text-white/40 hover:text-teal-neon hover:scale-110 transition-transform active:scale-90"
          >
            <span className="material-symbols-outlined text-2xl">skip_next</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] font-label text-white/40 flex-shrink-0">
            {Math.floor(currentTime / 60)}:{String(currentTime % 60).padStart(2, '0')}
          </span>
          
          <div
            ref={progressBarRef}
            onClick={handleProgressBarClick}
            className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group hover:h-2 transition-all"
          >
            <div
              className="h-full bg-gradient-to-r from-teal-neon to-fuchsia-neon shadow-[0_0_10px_rgba(0,243,255,0.6)] transition-all duration-75 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <span className="text-[10px] font-label text-white/40 flex-shrink-0">
            {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Right Controls - Volume & Queue */}
      <div className="flex items-center justify-end gap-4 w-1/4">
        <button className="text-white/40 hover:text-teal-neon transition-colors flex-shrink-0">
          <span className="material-symbols-outlined text-xl">queue_music</span>
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-2 group">
          <button
            onClick={handleMuteToggle}
            className="text-white/40 group-hover:text-yellow-cyber transition-colors flex-shrink-0 hover:scale-110 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">
              {isMuted ? 'volume_off' : volume < 50 ? 'volume_down' : 'volume_up'}
            </span>
          </button>

          <div
            ref={volumeBarRef}
            onClick={handleVolumeBarClick}
            className="w-28 h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer hover:h-2.5 transition-all"
          >
            <div
              className="h-full bg-gradient-to-r from-yellow-cyber to-fuchsia-neon shadow-[0_0_8px_rgba(243,255,0,0.6)] transition-all duration-75 rounded-full"
              style={{ width: `${isMuted ? 0 : volume}%` }}
            ></div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="hidden"
          />
        </div>

        <button className="text-white/40 hover:text-teal-neon transition-colors flex-shrink-0">
          <span className="material-symbols-outlined text-xl">fullscreen</span>
        </button>
      </div>
    </footer>
  );
}
