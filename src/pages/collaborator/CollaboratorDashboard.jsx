import { useState, useEffect, useCallback } from 'react';
import { songAPI } from '../../services/api';
import TrackFormModal from '../../components/admin/TrackFormModal';

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

export default function CollaboratorDashboard() {
    const [tracks, setTracks] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState({ open: false, track: null });
    const [toast, setToast] = useState(null);
    const LIMIT = 10;

    const notify = (msg, type = 'ok') => setToast({ msg, type });

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await songAPI.getMyUploads({ page, limit: LIMIT });
            setTracks(res.data || []);
            setTotal(res.total || 0);
        } catch (e) {
            notify(e.message || 'Lỗi khi tải danh sách nhạc', 'err');
        } finally { setLoading(false); }
    }, [page]);

    useEffect(() => { load(); }, [load]);

    const handleSave = async (data) => {
        try {
            if (modal.track) {
                await songAPI.update(modal.track.id, data);
                notify('Đã cập nhật yêu cầu chỉnh sửa!');
            } else {
                await songAPI.createMultipart(data); // CTV thường dùng multipart cho file thật
                notify('Đã gửi nhạc lên, vui lòng chờ duyệt!');
            }
            setModal({ open: false, track: null });
            load();
        } catch (e) {
            notify(e.message || 'Lỗi khi lưu nhạc', 'err');
        }
    };

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="p-8 pb-32">
            {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#e2e8f0' }}>🎨 Dashboard Cộng tác viên</h1>
                    <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Bạn đã tải lên {total} bài hát</p>
                </div>
                <button onClick={() => setModal({ open: true, track: null })} style={{
                    padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg,#2dd4bf,#0d9488)', color: '#fff', fontWeight: 700, fontSize: 14,
                    transition: 'opacity 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    + Upload nhạc mới
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>⏳ Đang tải...</div>
            ) : tracks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: 48 }}>📤</div>
                    <p style={{ color: '#64748b', marginTop: 12 }}>Bạn chưa tải lên bài hát nào</p>
                    <button onClick={() => setModal({ open: true, track: null })} style={{ marginTop: 16, padding: '9px 20px', borderRadius: 10, border: 'none', background: 'rgba(45,212,191,0.2)', color: '#2dd4bf', fontWeight: 600, cursor: 'pointer' }}>
                        Tải lên bài đầu tiên
                    </button>
                </div>
            ) : (
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['#', 'Ảnh', 'Tên bài / Artist', 'Album', 'Dài', 'Trạng thái', 'Thao tác'].map(h => (
                                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', fontSize: 13 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tracks.map(t => (
                                    <tr key={t.id}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '11px 14px', color: '#4b5563', fontSize: 12 }}>#{t.id}</td>
                                        <td style={{ padding: '11px 14px' }}>
                                            {t.cover_url
                                                ? <img src={t.cover_url} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                                                : <div style={{ width: 40, height: 40, borderRadius: 6, background: 'rgba(45,212,191,0.2)', display: 'grid', placeItems: 'center', fontSize: 16 }}>🎵</div>
                                            }
                                        </td>
                                        <td style={{ padding: '11px 14px', maxWidth: 200 }}>
                                            <div style={{ fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                                            <div style={{ fontSize: 12, color: '#2dd4bf', marginTop: 2 }}>{t.artist}</div>
                                        </td>
                                        <td style={{ padding: '11px 14px', color: '#64748b', fontSize: 13 }}>{t.album || '—'}</td>
                                        <td style={{ padding: '11px 14px', color: '#64748b', fontSize: 13 }}>{formatDur(t.duration)}</td>
                                        <td style={{ padding: '11px 14px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                                                background: t.approvalStatus === 'approved' ? 'rgba(16,185,129,0.15)' : t.approvalStatus === 'rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(234,179,8,0.15)',
                                                color: t.approvalStatus === 'approved' ? '#10b981' : t.approvalStatus === 'rejected' ? '#ef4444' : '#eab308',
                                                textTransform: 'uppercase'
                                            }}>
                                                {t.approvalStatus === 'approved' ? 'Đã duyệt' : t.approvalStatus === 'rejected' ? 'Từ chối' : 'Đang chờ'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '11px 14px' }}>
                                            <button onClick={() => setModal({ open: true, track: t })}
                                                style={{ padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 12 }}>
                                                Sửa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20 }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                        style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: page <= 1 ? '#4b5563' : '#e2e8f0', cursor: page <= 1 ? 'default' : 'pointer' }}>
                        ← Trước
                    </button>
                    <span style={{ color: '#64748b', fontSize: 14 }}>Trang {page}/{totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                        style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: page >= totalPages ? '#4b5563' : '#e2e8f0', cursor: page >= totalPages ? 'default' : 'pointer' }}>
                        Sau →
                    </button>
                </div>
            )}

            {modal.open && (
                <TrackFormModal 
                    track={modal.track} 
                    onSave={handleSave} 
                    onClose={() => setModal({ open: false, track: null })}
                    isCollaborator={true} 
                />
            )}

            <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:none } }`}</style>
        </div>
    );
}
