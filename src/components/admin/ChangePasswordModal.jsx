import { useState } from 'react';

const inp = { width: '100%', padding: '10px 13px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

export default function ChangePasswordModal({ user, onSave, onClose }) {
    const [pw, setPw] = useState('');
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (pw.length < 6) { setErr('Mật khẩu phải có ít nhất 6 ký tự!'); return; }
        setSaving(true); setErr('');
        try { await onSave(pw); }
        catch (e) { setErr(e.message); }
        finally { setSaving(false); }
    };

    return (
        <div onClick={e => e.target === e.currentTarget && onClose()}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(8px)' }}>
            <div style={{ background: 'linear-gradient(135deg,#111827,#1e1b4b)', borderRadius: 20, border: '1px solid rgba(245,158,11,0.3)', width: '100%', maxWidth: 380, boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#e2e8f0' }}>🔑 Đổi mật khẩu</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 22 }}>×</button>
                </div>
                <form onSubmit={onSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <p style={{ color: '#94a3b8', fontSize: 14 }}>Đổi mật khẩu cho <strong style={{ color: '#f59e0b' }}>{user?.name}</strong></p>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Mật khẩu mới *</span>
                        <input type="password" required style={inp} value={pw} onChange={e => setPw(e.target.value)} placeholder="Ít nhất 6 ký tự" />
                    </label>
                    {err && <p style={{ color: '#ef4444', fontSize: 13 }}>❌ {err}</p>}
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>Hủy</button>
                        <button type="submit" disabled={saving} style={{ flex: 2, padding: 11, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}>
                            {saving ? '⏳...' : '🔑 Đổi mật khẩu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
