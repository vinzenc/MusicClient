import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const NAV = [
    { to: '/admin', label: '📊 Tổng quan', end: true },
    { to: '/admin/tracks', label: '🎵 Quản lý nhạc' },
    { to: '/admin/pending', label: '⏳ Chờ duyệt' },
    { to: '/admin/users', label: '👤 Quản lý user' },
];

const linkStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '11px 16px', borderRadius: 10, textDecoration: 'none',
    fontSize: 14, fontWeight: active ? 700 : 500,
    color: active ? '#fff' : '#94a3b8',
    background: active ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : 'transparent',
    transition: 'all 0.2s',
    marginBottom: 4,
});

export default function AdminLayout() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a1a', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <aside style={{
                width: 230, flexShrink: 0,
                background: 'linear-gradient(180deg, #0f0c29 0%, #110c2e 100%)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', flexDirection: 'column', padding: '24px 16px',
                position: 'sticky', top: 0, height: '100vh',
            }}>
                {/* Logo */}
                <div style={{ marginBottom: 32, padding: '0 8px' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        🎛️ Admin Panel
                    </div>
                    <div style={{ fontSize: 12, color: '#4b5563', marginTop: 4 }}>Music Management</div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1 }}>
                    {NAV.map(n => (
                        <NavLink key={n.to} to={n.to} end={n.end}
                            style={({ isActive }) => linkStyle(isActive)}
                        >
                            {n.label}
                        </NavLink>
                    ))}
                </nav>

                {/* User info */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginTop: 16 }}>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>👤 {user.name || 'Admin'}</div>
                    <div style={{ fontSize: 12, color: '#4b5563', marginBottom: 12 }}>{user.role}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <a href="/" style={{ flex: 1, textAlign: 'center', padding: '7px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textDecoration: 'none', fontSize: 12 }}>
                            ← App
                        </a>
                        <button onClick={handleLogout} style={{ flex: 1, padding: '7px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.15)', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
                <Outlet />
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 3px; }
                input::placeholder { color: #4b5563; }
                select option { background: #1e293b; color: #e2e8f0; }
            `}</style>
        </div>
    );
}
