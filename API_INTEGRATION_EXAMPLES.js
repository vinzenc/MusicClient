/**
 * HƯỚNG DẪN TÍCH HỢP API BACKEND
 * 
 * File này chứa các ví dụ cơ bản về cách sử dụng API service
 * trong các components React
 */

// ============================================
// 1. FETCH DỮ LIỆU KHI MOUNTED COMPONENT
// ============================================

// Example:
// import { useEffect, useState } from 'react';
// import { musicAPI } from '../services/api';
// 
// export default function YourComponent() {
//   const [tracks, setTracks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//
//   useEffect(() => {
//     const loadTracks = async () => {
//       try {
//         setLoading(true);
//         const data = await musicAPI.getTrendingTracks();
//         setTracks(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     loadTracks();
//   }, []);
//
//   if (loading) return <div>Đang tải...</div>;
//   if (error) return <div>Lỗi: {error}</div>;
//
//   return (
//     <div>
//       {tracks.map(track => (
//         <div key={track.id}>{track.title}</div>
//       ))}
//     </div>
//   );
// }


// ============================================
// 2. TÌM KIẾM VỚI DEBOUNCE
// ============================================

// Example:
// import { useState, useCallback } from 'react';
// import { musicAPI } from '../services/api';
// import { debounce } from 'lodash'; // hoặc implement debounce tự viết
//
// export default function SearchComponent() {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//
//   const handleSearch = useCallback(
//     debounce(async (searchQuery) => {
//       if (!searchQuery) {
//         setResults([]);
//         return;
//       }
//       const data = await musicAPI.searchTracks(searchQuery);
//       setResults(data);
//     }, 300),
//     []
//   );
//
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setQuery(value);
//     handleSearch(value);
//   };
//
//   return (
//     <div>
//       <input 
//         value={query}
//         onChange={handleInputChange}
//         placeholder="Tìm kiếm..."
//       />
//       {results.map(track => (
//         <div key={track.id}>{track.title}</div>
//       ))}
//     </div>
//   );
// }


// ============================================
// 3. CẬP NHẬT APP STATE KTRONG CONTEXT API
// ============================================

// Tạo AudioContext.js:
// import { createContext, useContext, useState } from 'react';
// import { musicAPI } from '../services/api';
//
// const AudioContext = createContext();
//
// export function AudioProvider({ children }) {
//   const [currentTrack, setCurrentTrack] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [playlist, setPlaylist] = useState([]);
//
//   const playTrack = async (trackId) => {
//     try {
//       const track = await musicAPI.getTrackById(trackId);
//       setCurrentTrack(track);
//       setIsPlaying(true);
//     } catch (error) {
//       console.error('Lỗi phát nhạc:', error);
//     }
//   };
//
//   const addToLibrary = async (trackId) => {
//     try {
//       await musicAPI.addToLibrary(trackId);
//       // Cập nhật UI hoặc state nếu cần
//     } catch (error) {
//       console.error('Lỗi thêm vào thư viện:', error);
//     }
//   };
//
//   return (
//     <AudioContext.Provider value={{ currentTrack, isPlaying, playTrack, addToLibrary }}>
//       {children}
//     </AudioContext.Provider>
//   );
// }
//
// export const useAudio = () => {
//   const context = useContext(AudioContext);
//   if (!context) {
//     throw new Error('useAudio phải dùng trong AudioProvider');
//   }
//   return context;
// };


// ============================================
// 4. ENVIRONMENT VARIABLES
// ============================================

// Tạo file .env.local trong thư mục gốc
// VITE_API_BASE_URL=http://localhost:3000/api
// VITE_API_TIMEOUT=5000


// ============================================
// 5. RETRY LOGIC HELPER
// ============================================

// const fetchWithRetry = async (fn, retries = 3, delay = 1000) => {
//   for (let i = 0; i < retries; i++) {
//     try {
//       return await fn();
//     } catch (error) {
//       if (i === retries - 1) throw error;
//       await new Promise(resolve => setTimeout(resolve, delay));
//     }
//   }
// };
//
// // Sử dụng:
// const tracks = await fetchWithRetry(() => musicAPI.getTrendingTracks());


// ============================================
// 6. CACHE IMPLEMENTATION
// ============================================

// const cache = new Map();
//
// const cachedFetch = async (key, fn, ttl = 5 * 60 * 1000) => {
//   if (cache.has(key)) {
//     const { data, timestamp } = cache.get(key);
//     if (Date.now() - timestamp < ttl) {
//       return data;
//     }
//   }
//
//   const data = await fn();
//   cache.set(key, { data, timestamp: Date.now() });
//   return data;
// };
//
// // Sử dụng:
// const tracks = await cachedFetch(
//   'trending-tracks',
//   () => musicAPI.getTrendingTracks()
// );

export {};
