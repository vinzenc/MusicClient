// Service gọi MusicAPI backend (port 3001)
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Lấy token từ localStorage
const getToken = () => localStorage.getItem('token');

const req = async (endpoint, options = {}) => {
    const token = getToken();
    const res = await fetch(`${BASE}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
        ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Lỗi không xác định');
    return data;
};

// ── Admin - Tracks ─────────────────────────────────────────────
export const adminMusicAPI = {
    getStats: () => req('/admin/music/stats'),
    getTracks: (params = {}) => req(`/admin/music/tracks?${new URLSearchParams(params)}`),
    getTrack: (id) => req(`/admin/music/tracks/${id}`),
    addTrack: (data) => req('/admin/music/tracks', { method: 'POST', body: JSON.stringify(data) }),
    editTrack: (id, data) => req(`/admin/music/tracks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTrack: (id) => req(`/admin/music/tracks/${id}`, { method: 'DELETE' }),

    // Pending
    getPending: (status = 'pending') => req(`/admin/music/pending?status=${status}`),
    approve: (id) => req(`/admin/music/pending/${id}/approve`, { method: 'POST' }),
    reject: (id, note = '') => req(`/admin/music/pending/${id}/reject`, { method: 'POST', body: JSON.stringify({ admin_note: note }) }),
    deletePending: (id) => req(`/admin/music/pending/${id}`, { method: 'DELETE' }),
};

// ── Admin - Users ──────────────────────────────────────────────
export const adminUserAPI = {
    getUsers: (role = '') => req(`/admin/users${role ? `?role=${role}` : ''}`),
    getUser: (id) => req(`/admin/users/${id}`),
    addUser: (data) => req('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    editUser: (id, data) => req(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteUser: (id) => req(`/admin/users/${id}`, { method: 'DELETE' }),
    changeRole: (id, role) => req(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
    changePassword: (id, newPassword) => req(`/admin/users/${id}/password`, { method: 'PUT', body: JSON.stringify({ newPassword }) }),
};

// ── User - Đề xuất nhạc ────────────────────────────────────────
export const pendingAPI = {
    submit: (data) => req('/pending', { method: 'POST', body: JSON.stringify(data) }),
    getMine: () => req('/pending/mine'),
};

// ── Deezer (qua backend proxy music/) ─────────────────────────
export const deezerAPI = {
    search: (q, limit = 25) => req(`/music/search?q=${encodeURIComponent(q)}&limit=${limit}`),
    chart: () => req('/music/chart'),
};
