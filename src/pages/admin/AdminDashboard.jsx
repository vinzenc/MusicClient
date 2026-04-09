import { useEffect, useState } from 'react';
import { adminMusicAPI, adminUserAPI } from '../../services/adminApi';

const StatCard = ({ icon, label, value, color }) => (
    <div style={{
        background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}22`,
        borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
    }}>
        <div style={{ fontSize: 36 }}>{icon}</div>
        <div>
            <div style={{ fontSize: 30, fontWeight: 800, color }}>{value ?? '—'}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{label}</div>
        </div>
    </div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        adminMusicAPI.getStats().then(r => setStats(r.data)).catch(() => {});
        adminUserAPI.getUsers().then(r => setUsers(r.data || [])).catch(() => {});
    }, []);

    const userCount = users.length;
    const collabCount = users.filter(u => u.role === 'collaborator').length;

    return (
        <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, color: '#e2e8f0' }}>📊 Tổng quan</h1>
            <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>Xin chào! Đây là bảng điều khiển quản trị.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 36 }}>
                <StatCard icon="🎵" label="Tổng bài nhạc" value={stats?.total_tracks} color="#a78bfa" />
                <StatCard icon="✅" label="Đang hoạt động" value={stats?.active_tracks} color="#10b981" />
                <StatCard icon="⏳" label="Chờ duyệt" value={stats?.pending_count} color="#f59e0b" />
                <StatCard icon="👤" label="Tổng user" value={userCount} color="#60a5fa" />
                <StatCard icon="🤝" label="Cộng tác viên" value={collabCount} color="#f472b6" />
            </div>

            {/* API Routes Reference */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', padding: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#a78bfa' }}>📌 API Endpoints</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                        ['GET', '/admin/music/tracks', 'Danh sách nhạc'],
                        ['POST', '/admin/music/tracks', 'Thêm nhạc'],
                        ['PUT', '/admin/music/tracks/:id', 'Sửa nhạc'],
                        ['DELETE', '/admin/music/tracks/:id', 'Xóa nhạc'],
                        ['GET', '/admin/music/pending', 'Nhạc chờ duyệt'],
                        ['POST', '/admin/music/pending/:id/approve', 'Duyệt nhạc'],
                        ['GET', '/admin/users', 'Danh sách user'],
                        ['POST', '/admin/users', 'Thêm user'],
                        ['PATCH', '/admin/users/:id/role', 'Thay đổi role'],
                        ['POST', '/pending', 'User đề xuất nhạc'],
                    ].map(([method, path, desc]) => (
                        <div key={path + method} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                            <span style={{
                                padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, flexShrink: 0,
                                background: method === 'GET' ? '#10b98122' : method === 'POST' ? '#3b82f622' : method === 'PUT' ? '#f59e0b22' : '#ef444422',
                                color: method === 'GET' ? '#10b981' : method === 'POST' ? '#3b82f6' : method === 'PUT' ? '#f59e0b' : '#ef4444',
                            }}>{method}</span>
                            <code style={{ fontSize: 12, color: '#94a3b8', flex: 1 }}>{path}</code>
                            <span style={{ fontSize: 12, color: '#4b5563' }}>{desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
