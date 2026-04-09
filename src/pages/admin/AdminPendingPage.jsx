import { useState, useEffect } from 'react';
import { pendingStore } from '../../services/mockStore';
import { useMusic } from '../../contexts/MusicContext';

function formatDur(sec) {
    if (!sec) return '—';
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

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

export default function AdminPendingPage() {
    const { loadHomeData } = useMusic();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusTab, setStatusTab] = useState('pending');
    const [rejectId, setRejectId] = useState(null);
    const [note, setNote] = useState('');
    const [toast, setToast] = useState(null);

    const notify = (msg, type = 'ok') => setToast({ msg, type });

    const load = async (s = statusTab) => {
        setLoading(true);
        const res = await pendingStore.getAll(s);
        setItems(res.data || []);
        setLoading(false);
    };

    useEffect(() => { load(statusTab); }, [statusTab]);

    const handleApprove = async (id, title) => {
        await pendingStore.approve(id);
        notify(`Đã duyệt "${title}" và thêm vào thư viện!`);
        load();
        loadHomeData(); // Update global context for home page
    };

    const handleReject = async () => {
        const item = items.find(i => i.id === rejectId);
        await pendingStore.reject(rejectId, note);
        notify(`Đã từ chối "${item?.title}"`);
        setRejectId(null);
        setNote('');
        load();
        loadHomeData();
    };

    const handleDelete = async (id, title) => {
        if (!confirm('Xóa bản đề xuất này?')) return;
        await pendingStore.remove(id);
        notify(`Đã xóa đề xuất "${title}"`);
        load();
    };

    const TABS = [
        { value: 'pending', label: '⏳ Chờ duyệt' },
        { value: 'approved', label: '✅ Đã duyệt' },
        { value: 'rejected', label: '❌ Đã từ chối' },
    ];

    return (
        <div>
            {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#e2e8f0', marginBottom: 24 }}>⏳ Nhạc đề xuất</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
                {TABS.map(t => (
                    <button key={t.value} onClick={() => setStatusTab(t.value)} style={{
                        padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                        background: statusTab === t.value ? 'linear-gradient(135deg,#a78bfa,#7c3aed)' : 'transparent',
                        color: statusTab === t.value ? '#fff' : '#94a3b8', transition: 'all 0.2s',
                    }}>{t.label}</button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>⏳ Đang tải...</div>
            ) : items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: 48 }}>📭</div>
                    <p style={{ color: '#64748b', marginTop: 12 }}>Không có bản đề xuất nào</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {items.map(item => (
                        <div key={item.id} style={{
                            background: 'rgba(255,255,255,0.04)', borderRadius: 14,
                            border: '1px solid rgba(255,255,255,0.07)',
                            padding: 16, display: 'flex', gap: 16, alignItems: 'center',
                            transition: 'border-color 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(167,139,250,0.3)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                        >
                            {item.cover_url
                                ? <img src={item.cover_url} alt="" style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                                : <div style={{ width: 52, height: 52, borderRadius: 10, background: 'rgba(167,139,250,0.2)', display: 'grid', placeItems: 'center', fontSize: 24, flexShrink: 0 }}>🎵</div>
                            }

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, color: '#e2e8f0' }}>{item.title}</div>
                                <div style={{ fontSize: 13, color: '#a78bfa' }}>{item.artist}</div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                                    {item.album && <span>{item.album} · </span>}
                                    {formatDur(item.duration)}
                                    {item.submitted_by_name && <span> · 👤 {item.submitted_by_name}</span>}
                                </div>
                                {item.admin_note && (
                                    <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>Ghi chú: {item.admin_note}</div>
                                )}
                            </div>

                            {/* Status badge */}
                            <span style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0,
                                background: item.status === 'pending' ? 'rgba(245,158,11,0.15)' : item.status === 'approved' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                                color: item.status === 'pending' ? '#f59e0b' : item.status === 'approved' ? '#10b981' : '#ef4444',
                            }}>
                                {item.status === 'pending' ? '⏳ Đang chờ' : item.status === 'approved' ? '✅ Đã duyệt' : '❌ Bị từ chối'}
                            </span>

                            {/* Actions */}
                            {statusTab === 'pending' && (
                                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                    <button onClick={() => handleApprove(item.id, item.title)}
                                        style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontWeight: 700, fontSize: 13 }}>
                                        ✅ Duyệt
                                    </button>
                                    <button onClick={() => { setRejectId(item.id); setNote(''); }}
                                        style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 700, fontSize: 13 }}>
                                        ❌ Từ chối
                                    </button>
                                </div>
                            )}
                            <button onClick={() => handleDelete(item.id, item.title)}
                                style={{ padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(100,116,139,0.15)', color: '#94a3b8', fontSize: 13 }}>
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Reject modal */}
            {rejectId && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(8px)' }}>
                    <div style={{ background: '#1e1b4b', borderRadius: 16, border: '1px solid rgba(239,68,68,0.3)', padding: 28, width: 400 }}>
                        <h3 style={{ color: '#e2e8f0', marginBottom: 16 }}>❌ Từ chối đề xuất</h3>
                        <textarea value={note} onChange={e => setNote(e.target.value)}
                            placeholder="Lý do từ chối (không bắt buộc)..."
                            rows={3}
                            style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: 14, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
                        />
                        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                            <button onClick={() => setRejectId(null)} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>Hủy</button>
                            <button onClick={handleReject} style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.8)', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Từ chối</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:none } }`}</style>
        </div>
    );
}
