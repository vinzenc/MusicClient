// Re-export API functions for admin pages
export { songAPI as trackStore, userAPI, songAPI as pendingStore } from './api';
// Deezer vẫn lấy từ mockStore (chưa có proxy backend)
export { deezerAPI } from './mockStore';
