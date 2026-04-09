// ════════════════════════════════════════════════════════════════
//  MOCK DATA STORE  –  toàn bộ dữ liệu ứng dụng (không cần API)
// ════════════════════════════════════════════════════════════════
const delay = (ms = 150) => new Promise(r => setTimeout(r, ms));

// ── ID generators ────────────────────────────────────────────────
const ids = { track: 20, user: 10, pending: 10, playlist: 5 };
const nextId = (key) => { ids[key] += 1; return ids[key]; };

// ════════════════════════════════════════════════════════════════
//  MUSIC TRACKS  (preview_url = file mp3 30s miễn phí)
// ════════════════════════════════════════════════════════════════
export let tracks = [
  {
    id: 1, title: 'Blinding Lights', artist: 'The Weeknd',
    album: 'After Hours', genre: 'Synth-pop', duration: 200,
    cover_url: 'https://picsum.photos/seed/blinding/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    deezer_id: '1109731532', status: 'active', created_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 2, title: 'Shape of You', artist: 'Ed Sheeran',
    album: '÷ (Divide)', genre: 'Pop', duration: 234,
    cover_url: 'https://picsum.photos/seed/shapeofyou/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    deezer_id: '1374480217', status: 'active', created_at: '2024-01-12T00:00:00Z',
  },
  {
    id: 3, title: 'Levitating', artist: 'Dua Lipa',
    album: 'Future Nostalgia', genre: 'Disco-pop', duration: 203,
    cover_url: 'https://picsum.photos/seed/levitating/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    deezer_id: '886444251', status: 'active', created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 4, title: 'Bad Guy', artist: 'Billie Eilish',
    album: 'When We All Fall Asleep', genre: 'Electropop', duration: 194,
    cover_url: 'https://picsum.photos/seed/badguy/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    deezer_id: '675641752', status: 'active', created_at: '2024-01-18T00:00:00Z',
  },
  {
    id: 5, title: 'Stay', artist: 'The Kid LAROI & Justin Bieber',
    album: 'Stay', genre: 'Pop', duration: 141,
    cover_url: 'https://picsum.photos/seed/staynow/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    deezer_id: '1470109622', status: 'active', created_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 6, title: 'Watermelon Sugar', artist: 'Harry Styles',
    album: 'Fine Line', genre: 'Pop-rock', duration: 174,
    cover_url: 'https://picsum.photos/seed/watermelon/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    deezer_id: '919891212', status: 'active', created_at: '2024-01-22T00:00:00Z',
  },
  {
    id: 7, title: 'Dynamite', artist: 'BTS',
    album: 'Dynamite', genre: 'K-Pop', duration: 199,
    cover_url: 'https://picsum.photos/seed/dynamitebts/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    deezer_id: '1161993226', status: 'active', created_at: '2024-01-25T00:00:00Z',
  },
  {
    id: 8, title: 'As It Was', artist: 'Harry Styles',
    album: "Harry's House", genre: 'Indie-pop', duration: 167,
    cover_url: 'https://picsum.photos/seed/asitwas/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    deezer_id: '1760824871', status: 'active', created_at: '2024-01-27T00:00:00Z',
  },
  {
    id: 9, title: 'Anti-Hero', artist: 'Taylor Swift',
    album: 'Midnights', genre: 'Synth-pop', duration: 200,
    cover_url: 'https://picsum.photos/seed/antihero/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    deezer_id: '1885421841', status: 'active', created_at: '2024-01-29T00:00:00Z',
  },
  {
    id: 10, title: 'Flowers', artist: 'Miley Cyrus',
    album: 'Endless Summer Vacation', genre: 'Pop', duration: 200,
    cover_url: 'https://picsum.photos/seed/flowersmil/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    deezer_id: '2177946907', status: 'active', created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 11, title: 'Rich Flex', artist: 'Drake & 21 Savage',
    album: 'Her Loss', genre: 'Hip-hop', duration: 212,
    cover_url: 'https://picsum.photos/seed/richflex/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    deezer_id: '2038694487', status: 'active', created_at: '2024-02-03T00:00:00Z',
  },
  {
    id: 12, title: 'Calm Down', artist: 'Rema & Selena Gomez',
    album: 'Rave & Roses', genre: 'Afrobeats', duration: 239,
    cover_url: 'https://picsum.photos/seed/calmdown/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    deezer_id: '2030773327', status: 'active', created_at: '2024-02-05T00:00:00Z',
  },
  {
    id: 13, title: 'Unholy', artist: 'Sam Smith & Kim Petras',
    album: 'Gloria', genre: 'Dance-pop', duration: 156,
    cover_url: 'https://picsum.photos/seed/unholyss/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    deezer_id: '2063568567', status: 'active', created_at: '2024-02-08T00:00:00Z',
  },
  {
    id: 14, title: 'Kill Bill', artist: 'SZA',
    album: 'SOS', genre: 'R&B', duration: 153,
    cover_url: 'https://picsum.photos/seed/killbillsza/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    deezer_id: '2075823747', status: 'inactive', created_at: '2024-02-10T00:00:00Z',
  },
  {
    id: 15, title: 'Midnight Rain', artist: 'Taylor Swift',
    album: 'Midnights', genre: 'Synth-pop', duration: 174,
    cover_url: 'https://picsum.photos/seed/midnightrain/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    deezer_id: '1885421842', status: 'active', created_at: '2024-02-12T00:00:00Z',
  },
  {
    id: 16, title: 'Golden Hour', artist: 'JVKE',
    album: 'this is what ____ feels like', genre: 'Pop', duration: 209,
    cover_url: 'https://picsum.photos/seed/goldenhour/250/250',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    deezer_id: '1766449142', status: 'active', created_at: '2024-02-14T00:00:00Z',
  },
];

// ════════════════════════════════════════════════════════════════
//  GENRES
// ════════════════════════════════════════════════════════════════
export const GENRES = ['Pop', 'Hip-hop', 'R&B', 'K-Pop', 'Synth-pop', 'Disco-pop', 'Afrobeats', 'Indie-pop', 'Dance-pop'];

// ════════════════════════════════════════════════════════════════
//  LIBRARY  (danh sách yêu thích của user)
// ════════════════════════════════════════════════════════════════
export let library = [1, 3, 7]; // track IDs

// ════════════════════════════════════════════════════════════════
//  PLAYLISTS
// ════════════════════════════════════════════════════════════════
export let playlists = [
  {
    id: 1, name: 'Chill Vibes', description: 'Nhạc thư giãn cuối ngày',
    cover_url: 'https://picsum.photos/seed/levitating/250/250',
    trackIds: [1, 3, 6, 8], created_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 2, name: 'Top Hits 2024', description: 'Những bài hot nhất năm',
    cover_url: 'https://picsum.photos/seed/shapeofyou/250/250',
    trackIds: [2, 4, 5, 9, 10], created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 3, name: 'K-Pop & More', description: 'Tổng hợp K-Pop đỉnh cao',
    cover_url: 'https://picsum.photos/seed/dynamitebts/250/250',
    trackIds: [7, 11, 12], created_at: '2024-02-10T00:00:00Z',
  },
];

// ════════════════════════════════════════════════════════════════
//  TRACK STORE
// ════════════════════════════════════════════════════════════════
export const trackStore = {
  getAll: async ({ search = '', status = '', genre = '', page = 1, limit = 16 } = {}) => {
    await delay();
    let data = [...tracks];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        (t.album || '').toLowerCase().includes(q)
      );
    }
    if (status) data = data.filter(t => t.status === status);
    if (genre) data = data.filter(t => t.genre === genre);
    const total = data.length;
    data = data.slice((page - 1) * limit, page * limit);
    return { data, total };
  },

  getById: async (id) => { await delay(); return tracks.find(t => t.id === id) || null; },

  getStats: async () => {
    await delay();
    return {
      total_tracks: tracks.length,
      active_tracks: tracks.filter(t => t.status === 'active').length,
      inactive_tracks: tracks.filter(t => t.status === 'inactive').length,
      pending_count: pending.filter(p => p.status === 'pending').length,
    };
  },

  add: async (data) => {
    await delay();
    const id = nextId('track');
    const t = { id, ...data, created_at: new Date().toISOString() };
    tracks = [t, ...tracks];
    return t;
  },

  edit: async (id, data) => {
    await delay();
    tracks = tracks.map(t => t.id === id ? { ...t, ...data } : t);
    return tracks.find(t => t.id === id);
  },

  remove: async (id) => {
    await delay();
    tracks = tracks.filter(t => t.id !== id);
    library = library.filter(lid => lid !== id);
    playlists = playlists.map(pl => ({ ...pl, trackIds: pl.trackIds.filter(tid => tid !== id) }));
    return { success: true };
  },

  getFeatured: async () => { await delay(); return tracks.filter(t => t.status === 'active').slice(0, 3); },
  getTrending: async () => { await delay(); return tracks.filter(t => t.status === 'active').slice(0, 8); },
  getNew: async () => { await delay(); return [...tracks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8); },
  getByGenre: async (genre) => { await delay(); return tracks.filter(t => t.genre === genre && t.status === 'active'); },
  getByUser: async (userName) => {
    await delay();
    return tracks.filter(t => t.submitted_by_name === userName);
  },
};

// ════════════════════════════════════════════════════════════════
//  LIBRARY STORE
// ════════════════════════════════════════════════════════════════
export const libraryStore = {
  getAll: async () => {
    await delay();
    return tracks.filter(t => library.includes(t.id));
  },
  add: async (trackId) => {
    await delay();
    if (!library.includes(trackId)) library = [...library, trackId];
    return { success: true };
  },
  remove: async (trackId) => {
    await delay();
    library = library.filter(id => id !== trackId);
    return { success: true };
  },
  has: (trackId) => library.includes(trackId),
};

// ════════════════════════════════════════════════════════════════
//  PLAYLIST STORE
// ════════════════════════════════════════════════════════════════
export const playlistStore = {
  getAll: async () => { await delay(); return [...playlists]; },

  getById: async (id) => {
    await delay();
    const pl = playlists.find(p => p.id === id);
    if (!pl) return null;
    return { ...pl, tracks: tracks.filter(t => pl.trackIds.includes(t.id)) };
  },

  create: async (name, description = '') => {
    await delay();
    const pl = { id: nextId('playlist'), name, description, cover_url: '', trackIds: [], created_at: new Date().toISOString() };
    playlists = [pl, ...playlists];
    return pl;
  },

  addTrack: async (playlistId, trackId) => {
    await delay();
    playlists = playlists.map(pl =>
      pl.id === playlistId && !pl.trackIds.includes(trackId)
        ? { ...pl, trackIds: [...pl.trackIds, trackId] }
        : pl
    );
    return { success: true };
  },

  removeTrack: async (playlistId, trackId) => {
    await delay();
    playlists = playlists.map(pl =>
      pl.id === playlistId
        ? { ...pl, trackIds: pl.trackIds.filter(id => id !== trackId) }
        : pl
    );
    return { success: true };
  },

  remove: async (id) => {
    await delay();
    playlists = playlists.filter(pl => pl.id !== id);
    return { success: true };
  },
};

// ════════════════════════════════════════════════════════════════
//  USERS STORE  (Admin)
// ════════════════════════════════════════════════════════════════
let users = [
  { id: 1, name: 'Admin', email: 'admin@music.app', role: 'admin', created_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Nguyễn Văn An', email: 'an.nguyen@gmail.com', role: 'collaborator', created_at: '2024-01-10T00:00:00Z' },
  { id: 3, name: 'Trần Thị Bình', email: 'binh.tran@gmail.com', role: 'user', created_at: '2024-01-15T00:00:00Z' },
  { id: 4, name: 'Lê Minh Cường', email: 'cuong.le@gmail.com', role: 'user', created_at: '2024-01-18T00:00:00Z' },
  { id: 5, name: 'Phạm Thu Dung', email: 'dung.pham@gmail.com', role: 'collaborator', created_at: '2024-01-20T00:00:00Z' },
  { id: 6, name: 'Hoàng Văn Em', email: 'em.hoang@gmail.com', role: 'user', created_at: '2024-02-01T00:00:00Z' },
  { id: 7, name: 'Vũ Thị Phương', email: 'phuong.vu@gmail.com', role: 'user', created_at: '2024-02-05T00:00:00Z' },
];

export const userStore = {
  getAll: async (role = '') => { await delay(); const data = role ? users.filter(u => u.role === role) : [...users]; return { data }; },
  getById: async (id) => { await delay(); return users.find(u => u.id === id) || null; },
  add: async (data) => { await delay(); const u = { id: nextId('user'), ...data, role: data.role || 'user', created_at: new Date().toISOString() }; users = [u, ...users]; return u; },
  edit: async (id, data) => { await delay(); users = users.map(u => u.id === id ? { ...u, ...data } : u); return users.find(u => u.id === id); },
  remove: async (id) => { await delay(); users = users.filter(u => u.id !== id); return { success: true }; },
  changeRole: async (id, role) => { await delay(); users = users.map(u => u.id === id ? { ...u, role } : u); return { success: true }; },
  changePassword: async () => { await delay(); return { success: true }; },
};

// ════════════════════════════════════════════════════════════════
//  PENDING STORE  (Admin)
// ════════════════════════════════════════════════════════════════
let pending = [
  { id: 1, title: 'Astronaut in the Ocean', artist: 'Masked Wolf', album: 'Astronomical', genre: 'Hip Hop', duration: 133, preview_url: '', cover_url: '', status: 'pending', submitted_by_name: 'Trần Thị Bình', admin_note: '', created_at: '2024-03-01T00:00:00Z' },
  { id: 2, title: 'Montero', artist: 'Lil Nas X', album: 'Montero', genre: 'Pop', duration: 137, preview_url: '', cover_url: 'https://picsum.photos/seed/montero/250/250', status: 'pending', submitted_by_name: 'Lê Minh Cường', admin_note: '', created_at: '2024-03-05T00:00:00Z' },
  { id: 3, title: 'good 4 u', artist: 'Olivia Rodrigo', album: 'SOUR', genre: 'Pop', duration: 178, preview_url: '', cover_url: '', status: 'approved', submitted_by_name: 'Hoàng Văn Em', admin_note: '', created_at: '2024-03-10T00:00:00Z' },
  { id: 4, title: 'Permission to Dance', artist: 'BTS', album: '', genre: 'K-Pop', duration: 186, preview_url: '', cover_url: '', status: 'rejected', submitted_by_name: 'Vũ Thị Phương', admin_note: 'Đã có bài BTS trong hệ thống', created_at: '2024-03-12T00:00:00Z' },
];

export const pendingStore = {
  getAll: async (status = 'pending') => { await delay(); return { data: pending.filter(p => p.status === status) }; },
  approve: async (id) => {
    await delay();
    const item = pending.find(p => p.id === id);
    if (item) {
      pending = pending.map(p => p.id === id ? { ...p, status: 'approved' } : p);
      const nid = nextId('track');
      tracks = [{ id: nid, ...item, status: 'active', created_at: new Date().toISOString() }, ...tracks];
    }
    return { success: true };
  },
  reject: async (id, admin_note = '') => { await delay(); pending = pending.map(p => p.id === id ? { ...p, status: 'rejected', admin_note } : p); return { success: true }; },
  remove: async (id) => { await delay(); pending = pending.filter(p => p.id !== id); return { success: true }; },
  submit: async (data) => {
    await delay();
    const item = { id: nextId('pending'), ...data, status: 'pending', submitted_by_name: 'Người dùng', admin_note: '', created_at: new Date().toISOString() };
    pending = [item, ...pending];
    return item;
  },
};

// ════════════════════════════════════════════════════════════════
//  DEEZER MOCK (Tìm kiếm nhạc)
// ════════════════════════════════════════════════════════════════
export const deezerMockAPI = {
  search: async (q) => {
    await delay(400);
    const query = q.toLowerCase();
    const data = tracks.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.artist.toLowerCase().includes(query)
    );
    return { data: data.length ? data.map(t => ({ ...t, cover: t.cover_url, preview: t.preview_url })) : tracks.slice(0, 8).map(t => ({ ...t, cover: t.cover_url, preview: t.preview_url })) };
  },
  chart: async () => {
    await delay(400);
    return { data: tracks.slice(0, 8).map(t => ({ ...t, cover: t.cover_url, preview: t.preview_url })) };
  },
  addToLibrary: async (t) => {
    await delay(300);
    const nid = nextId('track');
    const newTrack = { id: nid, title: t.title, artist: t.artist, album: t.album || '', duration: t.duration || 0, preview_url: t.preview || t.preview_url || '', cover_url: t.cover || t.cover_url || '', deezer_id: String(t.id || t.deezer_id || ''), genre: t.genre || '', status: 'active', created_at: new Date().toISOString() };
    tracks = [newTrack, ...tracks];
    return newTrack;
  },
};
