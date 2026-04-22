import { useEffect, useState } from 'react';
import { songAPI, userAPI } from '../../services/api';

const StatCard = ({ icon, label, value, color }) => (
    <div style={{
        background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33`,
        borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
        transition: 'transform 0.2s, box-shadow 0.2s',
    }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${color}22`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
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
        // Lấy stats từ API thật
        Promise.all([
            songAPI.getAll({ status: 'approved', limit: 1 }),
            songAPI.getAll({ status: 'pending',  limit: 1 }),
            songAPI.getAll({ status: 'rejected', limit: 1 }),
            songAPI.getAll({ limit: 1 }),
        ]).then(([approved, pending, rejected, all]) => {
            setStats({
                total_tracks:   all.total     || 0,
                active_tracks:  approved.total || 0,
                pending_count:  pending.total  || 0,
                inactive_tracks: rejected.total || 0,
            });
        }).catch(() => setStats(null));

        userAPI.getAll().then(r => setUsers(r.data || [])).catch(() => {});
    }, []);

    const userCount = users.length;
    const collabCount = users.filter(u => u.role === 'collaborator').length;

    return (
        <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, color: '#e2e8f0' }}>📊 Tổng quan</h1>
            <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>Xin chào! Đây là bảng điều khiển quản trị — dữ liệu từ API thật.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}>
                <StatCard icon="🎵" label="Tổng bài nhạc" value={stats?.total_tracks} color="#a78bfa" />
                <StatCard icon="✅" label="Đang hoạt động" value={stats?.active_tracks} color="#10b981" />
                <StatCard icon="⏳" label="Chờ duyệt" value={stats?.pending_count} color="#f59e0b" />
                <StatCard icon="👤" label="Tổng user" value={userCount} color="#60a5fa" />
                <StatCard icon="🤝" label="Cộng tác viên" value={collabCount} color="#f472b6" />
            </div>

            {/* Quick Info */}
            <div style={{
                background: 'rgba(167,139,250,0.06)', borderRadius: 16,
                border: '1px solid rgba(167,139,250,0.2)', padding: 24,
            }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#10b981' }}>
                    ✅ Đã kết nối API thật
                </h2>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>
                    Toàn bộ dữ liệu được lấy từ <strong style={{ color: '#e2e8f0' }}>MusicAPI backend</strong> và lưu trong TiDB.
                    Mọi thay đổi sẽ <strong style={{ color: '#10b981' }}>được lưu vĩnh viễn</strong> vào database.
                </p>
                <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                    {[
                        { icon: '🎵', label: 'Quản lý nhạc', desc: 'Thêm / sửa / xóa bài hát' },
                        { icon: '👤', label: 'Quản lý user', desc: 'Phân quyền, thêm / xóa tài khoản' },
                        { icon: '⏳', label: 'Duyệt đề xuất', desc: 'Approve hoặc reject bài nhạc' },
                        { icon: '🔍', label: 'Tìm từ Deezer', desc: 'Thêm nhạc vào thư viện mock' },
                    ].map(item => (
                        <div key={item.label} style={{
                            background: 'rgba(255,255,255,0.04)', borderRadius: 12,
                            padding: '12px 16px', flex: '1 1 180px',
                            border: '1px solid rgba(255,255,255,0.07)',
                        }}>
                            <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                            <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 13 }}>{item.label}</div>
                            <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
