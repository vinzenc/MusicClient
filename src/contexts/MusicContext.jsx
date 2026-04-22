import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { songAPI, favoriteAPI, playlistAPI } from '../services/api';

const MusicContext = createContext();

export function MusicProvider({ children }) {
  // ── Player State ───────────────────────────────────────────
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);       // seconds
  const [duration, setDuration] = useState(0);       // seconds
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('none');      // 'none' | 'one' | 'all'
  const [loading, setLoading] = useState(false);

  // ── Data State ─────────────────────────────────────────────
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [library, setLibrary] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  // ── Init Audio ─────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.7;
    audioRef.current = audio;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => handleEnded();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const handleEnded = useCallback(() => {
    if (repeat === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    } else {
      nextTrack();
    }
  }, [repeat, queueIndex, queue, shuffle]);

  const loadLibrary = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLibrary([]); return; }
    try {
      const songs = await favoriteAPI.getAll();
      setLibrary(songs);
    } catch { setLibrary([]); }
  }, []);

  const loadPlaylists = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch(`https://musicapi-376j.onrender.com/playlist/`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await response.json();
      const list = resData.data || (Array.isArray(resData) ? resData : []);
      setPlaylists(list);
    } catch (e) {
      console.error('loadPlaylists error:', e);
    }
  }, []);

  const loadHomeData = useCallback(async () => {
    // Lấy nhạc approved từ backend (trending = 8 bài đầu, featured = 3 bài)
    try {
      const res = await songAPI.getList({ limit: 20 });
      const songs = res.data || [];
      setTrendingTracks(songs.slice(0, 8));
      setFeaturedTracks(songs.slice(0, 3));
    } catch {
      setTrendingTracks([]);
      setFeaturedTracks([]);
    }
    loadLibrary();
    loadPlaylists();
  }, [loadLibrary, loadPlaylists]);

  // ── Load initial data ──────────────────────────────────────
  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  // ── Player Controls ────────────────────────────────────────

  const play = useCallback(async (track, newQueue = null) => {
    if (!track) return;
    const audio = audioRef.current;
    if (!audio) return;

    // Nếu cùng track đang play → chỉ resume
    if (currentTrack?.id === track.id && audio.src) {
      audio.play().catch(() => { });
      return;
    }

    setCurrentTrack(track);
    setLoading(true);
    setProgress(0);
    setDuration(0);

    if (newQueue) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    }

    // Cập nhật giao diện mượt mà trước
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered].slice(0, 50);
    });

    // Gọi API để lưu lên server (không cần await để tránh block)
    const token = localStorage.getItem('token');
    if (token) {
      historyAPI.add(track.id).catch(e => console.error('historyAPI error', e));
    }

    if (track.preview_url) {
      audio.src = track.preview_url;
      audio.load();
      audio.volume = isMuted ? 0 : volume;
      audio.play().catch(() => setIsPlaying(false));
    } else {
      // Không có preview → vẫn set track nhưng không phát audio
      setIsPlaying(false);
    }
    setLoading(false);
  }, [currentTrack, isMuted, volume]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play().catch(() => { });
  }, []);

  const togglePlay = useCallback((track = null) => {
    if (track && currentTrack?.id !== track.id) {
      play(track);
      return;
    }
    if (isPlaying) pause();
    else resume();
  }, [isPlaying, currentTrack, play, pause, resume]);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;
    let nextIdx;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = queueIndex + 1;
      if (nextIdx >= queue.length) {
        if (repeat === 'all') nextIdx = 0;
        else { audioRef.current?.pause(); setIsPlaying(false); return; }
      }
    }
    setQueueIndex(nextIdx);
    play(queue[nextIdx], queue);
  }, [queue, queueIndex, shuffle, repeat, play]);

  const prevTrack = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (queue.length === 0) return;
    const prevIdx = Math.max(0, queueIndex - 1);
    setQueueIndex(prevIdx);
    play(queue[prevIdx], queue);
  }, [queue, queueIndex, play]);

  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  const setVolume = useCallback((v) => {
    const val = Math.max(0, Math.min(1, v));
    setVolumeState(val);
    if (audioRef.current) audioRef.current.volume = val;
    if (val > 0 && isMuted) setIsMuted(false);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) audioRef.current.volume = next ? 0 : volume;
  }, [isMuted, volume]);

  const toggleShuffle = () => setShuffle(s => !s);
  const toggleRepeat = () => setRepeat(r => r === 'none' ? 'all' : r === 'all' ? 'one' : 'none');

  const playAll = useCallback((tracks) => {
    if (!tracks || tracks.length === 0) return;
    setQueue(tracks);
    setQueueIndex(0);
    play(tracks[0], tracks);
  }, [play]);

  // ── Library Controls (dùng Favorites API) ─────────────────
  const addToLibrary = useCallback(async (track) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để sử dụng tính năng này!');
      return;
    }
    try {
      await favoriteAPI.toggle(track.id);
      await loadLibrary();
    } catch (e) {
      console.error('addToLibrary error:', e);
    }
  }, [loadLibrary]);

  const removeFromLibrary = useCallback(async (trackId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để sử dụng tính năng này!');
      return;
    }
    try {
      await favoriteAPI.toggle(trackId);
      await loadLibrary();
    } catch (e) {
      console.error('removeFromLibrary error:', e);
    }
  }, [loadLibrary]);

  const isInLibrary = useCallback((trackId) => {
    return library.some(t => t.id === trackId);
  }, [library]);

  // ── Playlist Controls ──────────────────────────────────────
  const createPlaylist = useCallback(async (name) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để sử dụng tính năng này!');
      return null;
    }
    try {
      const response = await fetch(`https://musicapi-376j.onrender.com/playlist/add`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playlistName: name })
      });
      const pl = await response.json();
      await loadPlaylists();
      return pl;
    } catch (e) {
      console.error('createPlaylist error:', e);
      return null;
    }
  }, [loadPlaylists]);

  const deletePlaylist = useCallback(async (playlistId) => {
    try {
      await playlistAPI.remove(playlistId);
      await loadPlaylists();
    } catch (e) {
      console.error('deletePlaylist error:', e);
    }
  }, [loadPlaylists]);

  const addToPlaylist = useCallback(async (playlistId, trackId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập!');
      return;
    }
    try {
      // Sử dụng endpoint user cung cấp: /playlist//:id/songs
      const response = await fetch(`https://musicapi-376j.onrender.com/playlist//${playlistId}/songs`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ songId: trackId })
      });
      
      const result = await response.json();
      if (response.ok) {
        alert('Đã thêm vào playlist!');
        await loadPlaylists();
      } else {
        alert(result.message || 'Lỗi khi thêm vào playlist');
      }
    } catch (e) {
      console.error('addToPlaylist error:', e);
      alert('Lỗi kết nối Server');
    }
  }, [loadPlaylists]);

  const removeFromPlaylist = useCallback(async (playlistId, trackId) => {
    console.warn("Chưa có API để xóa bài hát khỏi playlist");
  }, []);

  // Legacy compat
  const playTrack = (id) => {
    const t = trendingTracks.find(x => x.id === id) || featuredTracks.find(x => x.id === id);
    if (t) play(t);
  };
  const skipTrack = (dir) => dir === 'next' ? nextTrack() : prevTrack();
  const togglePlayPause = () => { if (isPlaying) pause(); else resume(); };

  return (
    <MusicContext.Provider value={{
      // Player
      currentTrack, queue, isPlaying, progress, duration, volume, isMuted,
      shuffle, repeat, loading,
      play, pause, resume, togglePlay, nextTrack, prevTrack,
      seek, setVolume, toggleMute, toggleShuffle, toggleRepeat, playAll,
      // Legacy
      playTrack, skipTrack, togglePlayPause,
      // Data
      trendingTracks, featuredTracks, recentlyPlayed,
      library,
      playlists,
      loadHomeData,
      // Actions
      addToLibrary, removeFromLibrary, isInLibrary,
      createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist,
      // Refresh
      refreshLibrary: loadLibrary,
      refreshPlaylists: loadPlaylists,
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
};
