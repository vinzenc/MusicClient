import { createContext, useContext, useState, useEffect } from 'react';
import { musicAPI } from '../services/api';

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch trending tracks
  const fetchTrendingTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await musicAPI.getTrendingTracks();
      setTrendingTracks(data);
    } catch (err) {
      console.error('Failed to fetch trending tracks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recently played
  const fetchRecentlyPlayed = async (userId) => {
    try {
      setLoading(true);
      const data = await musicAPI.getRecentlyPlayed(userId);
      setRecentlyPlayed(data);
    } catch (err) {
      console.error('Failed to fetch recently played:', err);
    } finally {
      setLoading(false);
    }
  };

  // Play track
  const playTrack = async (trackId) => {
    try {
      const track = await musicAPI.getTrackById(trackId);
      setCurrentTrack(track);
      await musicAPI.playTrack(trackId);
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to play track:', err);
      setError(err.message);
    }
  };

  // Pause track
  const pauseTrack = async () => {
    try {
      await musicAPI.pauseTrack();
      setIsPlaying(false);
    } catch (err) {
      console.error('Failed to pause track:', err);
      setError(err.message);
    }
  };

  // Skip track
  const skipTrack = async (direction = 'next') => {
    try {
      await musicAPI.skipTrack(direction);
      // Fetch next track from playlist
    } catch (err) {
      console.error('Failed to skip track:', err);
      setError(err.message);
    }
  };

  // Toggle play/pause
  const togglePlayPause = async () => {
    if (isPlaying) {
      await pauseTrack();
    } else if (currentTrack) {
      await playTrack(currentTrack.id);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        trendingTracks,
        recentlyPlayed,
        currentTrack,
        isPlaying,
        loading,
        error,
        fetchTrendingTracks,
        fetchRecentlyPlayed,
        playTrack,
        pauseTrack,
        skipTrack,
        togglePlayPause,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
};
