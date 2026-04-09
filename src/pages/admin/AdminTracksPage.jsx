import { useState, useEffect, useCallback } from 'react';
import { adminMusicAPI } from '../../services/adminApi';
import TrackFormModal from '../../components/admin/TrackFormModal';

function formatDur(sec) {
    if (!sec) return '—';
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

export default function AdminTracksPage() {
    const [tracks, setTracks] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState({ open: false, track: null });
    const LIMIT = 15;

    const load = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const res = await adminMusicAPI.getTracks({ search, status: statusFilter, page, limit: LIMIT });
            setTracks(res.data || []); setTotal(res.total || 0);
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    }, [search, statusFilter, page]);

    useEffect(() => { load(); }, [load]);

    const handleDelete = async (id, title) => {
        if (!confirm(`Xóa track "${title}"?`)) return;
        try { await adminMusicAPI.deleteTrack(id); load(); }
        catch (e) { alert('Lỗi: ' + e.message); }
    };

    const handleSave = async (data) => {
        try {
            if (modal.track) await adminMusicAPI.editTrack(modal.track.id, data);
            else await adminMusicAPI.addTrack(data);
            setModal({ open: false, track: null });
            load();
        } catch (e) { throw e; }
    };

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#e2e8f0' }}>🎵 Quản lý nhạc</h1>
                    <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{total} bài nhạc trong hệ thống</p>
                </div>
                <button onClick={() => setModal({ open: true, track: null })} style={{
                    padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', color: '#fff', fontWeight: 700, fontSize: 14,
                }}>
                    + Thêm track
                </button>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <input placeholder="🔍 Tên bài, nghệ sĩ, album..." value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: 14, outline: 'none' }}
                />
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: 14 }}>
                    <option value="">Tất cả</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {error && <div style={{ padding: 14, borderRadius: 10, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', marginBottom: 16, fontSize: 14 }}>❌ {error} — Kiểm tra backend đang chạy không?</div>}

            {/* Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>⏳ Đang tải...</div>
            ) : tracks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: 48 }}>🎵</div>
                    <p style={{ color: '#64748b', marginTop: 12 }}>Chưa có track nào</p>
                </div>
            ) : (
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['ID', 'Cover', 'Tên bài / Artist', 'Album', 'Thời gian', 'Trạng thái', 'Thao tác'].map(h => (
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
                                                ? <img src={t.cover_url} alt="" style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover' }} />
                                                : <div style={{ width: 42, height: 42, borderRadius: 8, background: 'rgba(167,139,250,0.2)', display: 'grid', placeItems: 'center', fontSize: 18 }}>🎵</div>
                                            }
                                        </td>
                                        <td style={{ padding: '11px 14px', maxWidth: 220 }}>
                                            <div style={{ fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                                            <div style={{ fontSize: 12, color: '#a78bfa', marginTop: 2 }}>{t.artist}</div>
                                        </td>
                                        <td style={{ padding: '11px 14px', color: '#64748b', fontSize: 13, maxWidth: 140 }}>
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{t.album || '—'}</span>
                                        </td>
                                        <td style={{ padding: '11px 14px', color: '#64748b', fontSize: 13 }}>{formatDur(t.duration)}</td>
                                        <td style={{ padding: '11px 14px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                                background: t.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                                                color: t.status === 'active' ? '#10b981' : '#ef4444',
                                            }}>
                                                {t.status === 'active' ? '● Active' : '○ Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>
                                            <button onClick={() => setModal({ open: true, track: t })}
                                                style={{ marginRight: 8, padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', background: 'rgba(96,165,250,0.15)', color: '#60a5fa', fontWeight: 600, fontSize: 13 }}>
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(t.id, t.title)}
                                                style={{ padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 600, fontSize: 13 }}>
                                                🗑️
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
                <TrackFormModal track={modal.track} onSave={handleSave} onClose={() => setModal({ open: false, track: null })} />
            )}
        </div>
    );
}
