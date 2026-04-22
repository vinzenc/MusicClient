// ════════════════════════════════════════════════════════════════
//  API CLIENT — kết nối thật với MusicAPI backend
// ════════════════════════════════════════════════════════════════

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Lấy token từ localStorage
const getToken = () => localStorage.getItem('token');

// Fetch wrapper chuẩn hoá header + token + error handling
async function request(path, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  // Không tự set Content-Type nếu body là FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  // Với 204 No Content không có body
  if (res.status === 204) return { success: true };

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Có thể thêm window.location.reload() nếu muốn force user về login
    }
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ── Helper shorthand ─────────────────────────────────────────────
const get = (path, opts) => request(path, { method: 'GET', ...opts });
const post = (path, body) => request(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) });
const put = (path, body) => request(path, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) });
const patch = (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) });
const del = (path) => request(path, { method: 'DELETE' });

// ════════════════════════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════════════════════════
export const authAPI = {
  login: (email, password) => post('/auth/login', { email, password }),
  register: (name, email, password) => post('/auth/register', { name, email, password }),
  forgotPassword: (email) => post('/auth/forgot-password', { email }),
  resetPassword: (email, otp, newPassword) => post('/auth/reset-password', { email, otp, newPassword }),
};

// ════════════════════════════════════════════════════════════════
//  SONGS / TRACKS  — normalize field names để tương thích với UI
// ════════════════════════════════════════════════════════════════

// Backend trả audioUrl, coverUrl; UI dùng preview_url, cover_url → normalize
function normalizeSong(s) {
  if (!s) return null;
  return {
    ...s,
    // UI fields
    cover_url: s.cover_url || s.coverUrl || '',
    preview_url: s.preview_url || s.audioUrl || '',
    // Giữ lại backend fields để không mất thông tin
    coverUrl: s.coverUrl || s.cover_url || '',
    audioUrl: s.audioUrl || s.preview_url || '',
    // status theo dạng string đơn giản
    status: s.approvalStatus === 'approved' ? 'active'
      : s.approvalStatus === 'rejected' ? 'rejected'
        : s.approvalStatus || s.status || 'pending',
    approvalStatus: s.approvalStatus || (s.status === 'active' ? 'approved' : s.status) || 'pending',
  };
}

function normalizeList(res) {
  // res có thể là array hoặc { data, total, rows, ... }
  if (Array.isArray(res)) return { data: res.map(normalizeSong), total: res.length };
  const rows = res.rows || res.data || [];
  return {
    data: rows.map(normalizeSong),
    total: res.total ?? rows.length,
  };
}

export const songAPI = {
  // Lấy danh sách nhạc approved (public)
  getList: async ({ search = '', page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.set('q', search);
    const path = search ? `/music/search?${params}` : `/music/list?${params}`;
    const res = await get(path);
    return normalizeList(res);
  },

  // Lấy tất cả nhạc (admin, lọc theo approvalStatus)
  getAll: async ({ search = '', status = '', page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.set('status', status === 'active' ? 'approved' : status);
    const res = await get(`/music/songs?${params}`);
    let result = normalizeList(res);
    // Filter phía client nếu cần search (endpoint /songs không có ?q)
    if (search) {
      const q = search.toLowerCase();
      result.data = result.data.filter(t =>
        t.title?.toLowerCase().includes(q) ||
        t.artist?.toLowerCase().includes(q) ||
        (t.album || '').toLowerCase().includes(q)
      );
      result.total = result.data.length;
    }
    return result;
  },

  // Lấy nhạc của chính CTV đang đăng nhập
  getMyUploads: async ({ page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    const res = await get(`/music/my-uploads?${params}`);
    return normalizeList(res);
  },

  getById: async (id) => {
    const res = await get(`/music/songs/${id}`);
    return normalizeSong(res);
  },

  // Tạo bài hát bằng JSON (URL đã có sẵn)
  create: async (payload) => {
    const res = await post('/music/songs', {
      title: payload.title,
      artist: payload.artist,
      album: payload.album || '',
      genre: payload.genre || '',
      duration: payload.duration || 0,
      releaseYear: payload.releaseYear || null,
      audioUrl: payload.audioUrl || payload.preview_url || null,
      coverUrl: payload.coverUrl || payload.cover_url || null,
      cloudinaryId: payload.cloudinaryId || null,
    });
    return normalizeSong(res);
  },

  // Upload multipart (file nhạc + cover + metadata)
  createMultipart: async (formData) => {
    const res = await request('/music/songs/multipart', {
      method: 'POST',
      body: formData,
    });
    return normalizeSong(res);
  },

  // Cập nhật bài hát bằng JSON
  update: async (id, payload) => {
    const res = await put(`/music/songs/${id}`, {
      title: payload.title,
      artist: payload.artist,
      album: payload.album || '',
      genre: payload.genre || '',
      duration: payload.duration || 0,
      releaseYear: payload.releaseYear || null,
      audioUrl: payload.audioUrl || payload.preview_url || undefined,
      coverUrl: payload.coverUrl || payload.cover_url || undefined,
    });
    return normalizeSong(res);
  },

  // Xóa bài hát
  remove: async (id) => del(`/music/songs/${id}`),

  // Upload chỉ audio, trả về { audioUrl, cloudinaryId, duration }
  uploadAudio: async (file) => {
    const fd = new FormData();
    fd.append('audio', file);
    return request('/music/songs/upload', { method: 'POST', body: fd });
  },

  // Upload chỉ cover, trả về { coverUrl, coverPublicId }
  uploadCover: async (file) => {
    const fd = new FormData();
    fd.append('cover', file);
    return request('/music/songs/upload-cover', { method: 'POST', body: fd });
  },

  // Admin/CTV duyệt nhạc: status = 'approved' | 'rejected'
  review: async (id, status) => {
    const res = await patch(`/music/songs/${id}/review`, { status });
    return normalizeSong(res.data || res);
  },

  // Lấy lịch sử tìm kiếm
  getSearchHistory: () => get('/music/history').then(r => r.data || []),

  // Xóa toàn bộ lịch sử
  clearSearchHistory: () => del('/music/history'),

  // Xóa 1 từ khóa
  deleteHistoryItem: (keyword) => del(`/music/history/${encodeURIComponent(keyword)}`),

  // URL nghe nhạc (redirect Cloudinary)
  getListenUrl: (id) => `${BASE}/music/songs/${id}/listen`,
};

// ════════════════════════════════════════════════════════════════
//  FAVORITES (Library)
// ════════════════════════════════════════════════════════════════
export const favoriteAPI = {
  // Toggle yêu thích — trả về { success, isLiked }
  toggle: (songId) => post('/favorite/like', { songId }),

  // Lấy danh sách bài hát yêu thích của user hiện tại
  getAll: async () => {
    const res = await get('/favorite');
    const rows = res.data || res || [];
    return rows.map(normalizeSong);
  },
};

// ════════════════════════════════════════════════════════════════
//  HISTORY
// ════════════════════════════════════════════════════════════════
export const historyAPI = {
  // Lấy lịch sử nghe nhạc của user
  getAll: async () => {
    const res = await get('/history/');
    const rows = res.data || res || [];
    return rows.map(normalizeSong);
  },
  
  // Ghi nhận bài hát vào lịch sử
  add: (songId) => post('/history/', { songId }),
};

// ════════════════════════════════════════════════════════════════
//  ADMIN — USERS
// ════════════════════════════════════════════════════════════════
export const userAPI = {
  getAll: async (role = '') => {
    const params = role ? `?role=${role}` : '';
    const res = await get(`/users${params}`);
    const data = Array.isArray(res) ? res : (res.data || res.users || []);
    return { data };
  },

  getById: (id) => get(`/users/${id}`),

  // Admin tạo user trực tiếp
  create: (payload) => post('/users/add', payload),

  // Chỉnh sửa user
  update: (id, payload) => put(`/users/${id}`, payload),

  // Xóa user
  remove: (id) => del(`/users/${id}`),

  // Nâng/hạ role (user ↔ collaborator)
  changeRole: (id, role) => patch(`/users/${id}/role`, { role }),

  // Admin reset mật khẩu
  forceResetPassword: (id) => post(`/users/${id}/force-reset`),
};

// ════════════════════════════════════════════════════════════════
//  PROFILE (user tự đổi)
// ════════════════════════════════════════════════════════════════
export const profileAPI = {
  update: (name, email) => put('/profile', { name, email }),
  changePassword: (oldPassword, newPassword) => put('/profile/password', { oldPassword, newPassword }),
};

// ════════════════════════════════════════════════════════════════
//  HEALTH CHECK
// ════════════════════════════════════════════════════════════════
export const healthAPI = {
  check: () => get('/health'),
};

// ════════════════════════════════════════════════════════════════
//  PLAYLIST
// ════════════════════════════════════════════════════════════════
export const playlistAPI = {
  getAll: async () => {
    const res = await get('/playlist/');
    return res.data || res || [];
  },
  create: async (name) => {
    const res = await post('/playlist/add', { playlistName: name });
    return res.data || res;
  },
  remove: async (id) => del(`/playlist/${id}`),
  getSongs: async (id) => {
    const res = await get(`/playlist/${id}/songs`);
    const rows = res.data || res || [];
    return Array.isArray(rows) ? rows.map(normalizeSong) : rows;
  },
};

export default { authAPI, songAPI, favoriteAPI, userAPI, profileAPI, healthAPI, playlistAPI };
