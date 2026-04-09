import { useState, useEffect } from 'react';
import { userStore } from '../../services/mockStore';
import UserFormModal from '../../components/admin/UserFormModal';
import ChangePasswordModal from '../../components/admin/ChangePasswordModal';

const ROLE_COLORS = {
    admin: { bg: 'rgba(167,139,250,0.2)', color: '#a78bfa' },
    collaborator: { bg: 'rgba(96,165,250,0.2)', color: '#60a5fa' },
    user: { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' },
};

function Toast({ msg, type, onDone }) {
    useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
    return (
        <div style={{
            position: 'fixed', top: 20, right: 20, zIndex: 9999,
            padding: '12px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14,
            background: type === 'err' ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#10b981,#059669)',
            color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            animation: 'slideIn 0.3s ease',
        }}>
            {type === 'err' ? '❌ ' : '✅ '}{msg}
        </div>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [roleFilter, setRoleFilter] = useState('');
    const [modal, setModal] = useState({ open: false, user: null });
    const [pwModal, setPwModal] = useState({ open: false, user: null });
    const [toast, setToast] = useState(null);
    const me = JSON.parse(localStorage.getItem('user') || '{}');

    const notify = (msg, type = 'ok') => setToast({ msg, type });

    const load = async (role = roleFilter) => {
        setLoading(true);
        const res = await userStore.getAll(role);
        setUsers(res.data || []);
        setLoading(false);
    };

    useEffect(() => { load(roleFilter); }, [roleFilter]);

    const handleDelete = async (id, name) => {
        if (id === me.id) return notify('Không thể xóa chính mình!', 'err');
        if (!confirm(`Xóa user "${name}"?`)) return;
        await userStore.remove(id);
        notify(`Đã xóa user "${name}"`);
        load();
    };

    const handleRoleChange = async (id, currentRole, name) => {
        const newRole = currentRole === 'user' ? 'collaborator' : 'user';
        if (!confirm(`Đổi role của "${name}" thành "${newRole}"?`)) return;
        await userStore.changeRole(id, newRole);
        notify(`Đã đổi role: ${name} → ${newRole}`);
        load();
    };

    const handleSave = async (data) => {
        if (modal.user) {
            await userStore.edit(modal.user.id, data);
            notify('Đã cập nhật thông tin!');
        } else {
            await userStore.add(data);
            notify('Đã tạo user mới!');
        }
        setModal({ open: false, user: null });
        load();
    };

    const handleChangePassword = async (pw) => {
        await userStore.changePassword(pwModal.user.id, pw);
        notify('Đã đổi mật khẩu thành công!');
        setPwModal({ open: false, user: null });
    };

    return (
        <div>
            {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#e2e8f0' }}>👤 Quản lý người dùng</h1>
                    <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{users.length} tài khoản</p>
                </div>
                <button onClick={() => setModal({ open: true, user: null })} style={{
                    padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', color: '#fff', fontWeight: 700, fontSize: 14,
                    transition: 'opacity 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    + Thêm user
                </button>
            </div>

            {/* Role filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {[{ v: '', l: 'Tất cả' }, { v: 'user', l: '👤 User' }, { v: 'collaborator', l: '🤝 CTV' }, { v: 'admin', l: '🛡️ Admin' }].map(({ v, l }) => (
                    <button key={v} onClick={() => setRoleFilter(v)} style={{
                        padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                        background: roleFilter === v ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.05)',
                        color: roleFilter === v ? '#a78bfa' : '#94a3b8', transition: 'all 0.2s',
                    }}>{l}</button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>⏳ Đang tải...</div>
            ) : (
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                {['ID', 'Tên', 'Email', 'Role', 'Ngày tạo', 'Thao tác'].map(h => (
                                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: 13 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '12px 14px', color: '#4b5563', fontSize: 12 }}>#{u.id}</td>
                                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#e2e8f0' }}>
                                        {u.name}
                                        {u.id === me.id && <span style={{ fontSize: 11, color: '#a78bfa', marginLeft: 6 }}>(bạn)</span>}
                                    </td>
                                    <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{u.email}</td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                            background: ROLE_COLORS[u.role]?.bg, color: ROLE_COLORS[u.role]?.color,
                                        }}>{u.role}</span>
                                    </td>
                                    <td style={{ padding: '12px 14px', color: '#4b5563', fontSize: 12 }}>
                                        {new Date(u.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                            <button onClick={() => setModal({ open: true, user: u })}
                                                style={{ padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', background: 'rgba(96,165,250,0.15)', color: '#60a5fa', fontSize: 12, fontWeight: 600 }}>✏️</button>
                                            <button onClick={() => setPwModal({ open: true, user: u })}
                                                style={{ padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: 12, fontWeight: 600 }}>🔑</button>
                                            {u.role !== 'admin' && (
                                                <button onClick={() => handleRoleChange(u.id, u.role, u.name)}
                                                    style={{ padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', background: 'rgba(167,139,250,0.15)', color: '#a78bfa', fontSize: 12, fontWeight: 600 }}>
                                                    {u.role === 'user' ? '↑ CTV' : '↓ User'}
                                                </button>
                                            )}
                                            {u.id !== me.id && (
                                                <button onClick={() => handleDelete(u.id, u.name)}
                                                    style={{ padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: 12, fontWeight: 600 }}>🗑️</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modal.open && <UserFormModal user={modal.user} onSave={handleSave} onClose={() => setModal({ open: false, user: null })} />}
            {pwModal.open && (
                <ChangePasswordModal
                    user={pwModal.user}
                    onClose={() => setPwModal({ open: false, user: null })}
                    onSave={handleChangePassword}
                />
            )}

            <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:none } }`}</style>
        </div>
    );
}
