// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Music API endpoints
export const musicAPI = {
  // Auth
  login: (email, password) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  register: (email, password, name) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  }),
  
  logout: () => fetchAPI('/auth/logout', {
    method: 'POST',
  }),
  
  getCurrentUser: () => fetchAPI('/auth/me'),
  
  // Tracks
  getTrendingTracks: () => fetchAPI('/tracks/trending'),
  getTrackById: (id) => fetchAPI(`/tracks/${id}`),
  searchTracks: (query) => fetchAPI(`/tracks/search?q=${query}`),
  
  // Albums
  getFeaturedAlbums: () => fetchAPI('/albums/featured'),
  getAlbumById: (id) => fetchAPI(`/albums/${id}`),
  
  // Artists
  getArtistById: (id) => fetchAPI(`/artists/${id}`),
  searchArtists: (query) => fetchAPI(`/artists/search?q=${query}`),
  
  // Playlists
  getUserPlaylists: (userId) => fetchAPI(`/users/${userId}/playlists`),
  getPlaylistById: (id) => fetchAPI(`/playlists/${id}`),
  
  // User interactions
  addToLibrary: (trackId) => fetchAPI(`/library/add`, {
    method: 'POST',
    body: JSON.stringify({ trackId }),
  }),
  
  removeFromLibrary: (trackId) => fetchAPI(`/library/remove`, {
    method: 'POST',
    body: JSON.stringify({ trackId }),
  }),
  
  getRecentlyPlayed: (userId) => fetchAPI(`/users/${userId}/recently-played`),
  
  // Player
  playTrack: (trackId) => fetchAPI(`/player/play`, {
    method: 'POST',
    body: JSON.stringify({ trackId }),
  }),
  
  pauseTrack: () => fetchAPI(`/player/pause`, {
    method: 'POST',
  }),
  
  skipTrack: (direction) => fetchAPI(`/player/skip`, {
    method: 'POST',
    body: JSON.stringify({ direction }),
  }),
};

export default musicAPI;
