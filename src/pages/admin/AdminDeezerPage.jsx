import { useState, useEffect } from 'react';
import { deezerMockAPI } from '../../services/mockStore';

function fmt(sec) { return sec ? `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}` : ''; }

export default function AdminDeezerPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(new Set());
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const notify = (msg, type = 'ok') => setToast({ msg, type });

    const search = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const r = await deezerMockAPI.search(query);
            setResults(r.data || []);
        } catch (e) { notify(e.message, 'err'); }
        finally { setLoading(false); }
    };

    const loadChart = async () => {
        setLoading(true);
        try {
            const r = await deezerMockAPI.chart();
            setResults(r.data || []);
            notify('Đã tải top charts ✓');
        } catch (e) { notify(e.message, 'err'); }
        finally { setLoading(false); }
    };

    const addTrack = async (t) => {
        try {
            await deezerMockAPI.addToLibrary(t);
            setAdded(s => new Set([...s, t.id]));
            notify(`Đã thêm "${t.title}" vào thư viện ✓`);
        } catch (e) { notify(e.message, 'err'); }
    };

    return (
        <div>
            {toast && (
                <div style={{
                    position: 'fixed', top: 20, right: 20, zIndex: 9999,
                    padding: '12px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14,
                    background: toast.type === 'err'
                        ? 'linear-gradient(135deg,#ef4444,#dc2626)'
                        : 'linear-gradient(135deg,#10b981,#059669)',
                    color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    animation: 'slideIn 0.3s ease',
                }}>
                    {toast.type === 'err' ? '❌ ' : '✅ '}{toast.msg}
                </div>
            )}

            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#e2e8f0', marginBottom: 8 }}>🔍 Tìm nhạc (Mock Deezer)</h1>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>Dữ liệu mẫu — thêm nhạc sẽ được lưu vào thư viện mock</p>

            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                <input placeholder="Tìm tên bài, nghệ sĩ..." value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && search()}
                    style={{ flex: 1, minWidth: 200, padding: '11px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: 14, outline: 'none' }}
                />
                <button onClick={search} disabled={loading}
                    style={{ padding: '11px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                    {loading ? '⏳' : '🔍 Tìm'}
                </button>
                <button onClick={loadChart} disabled={loading}
                    style={{ padding: '11px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#f59e0b', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                    🏆 Top Charts
                </button>
            </div>

            {results.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: 60, color: '#4b5563' }}>
                    <div style={{ fontSize: 48 }}>🎵</div>
                    <p style={{ marginTop: 12 }}>Tìm kiếm để xem nhạc mẫu</p>
                    <button onClick={loadChart} style={{ marginTop: 16, padding: '9px 20px', borderRadius: 10, border: 'none', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: 600, cursor: 'pointer' }}>
                        🏆 Xem Top Charts
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 12 }}>
                {results.map(t => {
                    const isAdded = added.has(t.id);
                    return (
                        <div key={t.id} style={{
                            background: 'rgba(255,255,255,0.04)', borderRadius: 14,
                            border: '1px solid rgba(255,255,255,0.07)', padding: 14,
                            display: 'flex', gap: 12, alignItems: 'center',
                            transition: 'border-color 0.2s, transform 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none'; }}
                        >
                            {t.cover
                                ? <img src={t.cover} alt="" style={{ width: 54, height: 54, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                                : <div style={{ width: 54, height: 54, borderRadius: 10, background: 'rgba(167,139,250,0.2)', display: 'grid', placeItems: 'center', fontSize: 24, flexShrink: 0 }}>🎵</div>
                            }
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                                <div style={{ fontSize: 13, color: '#a78bfa' }}>{t.artist}</div>
                                <div style={{ fontSize: 12, color: '#4b5563' }}>{t.album}{t.duration ? ` · ${fmt(t.duration)}` : ''}</div>
                            </div>
                            <button onClick={() => !isAdded && addTrack(t)}
                                title={isAdded ? 'Đã thêm' : 'Thêm vào thư viện'}
                                style={{
                                    flexShrink: 0, width: 36, height: 36, borderRadius: 8, border: 'none',
                                    cursor: isAdded ? 'default' : 'pointer',
                                    background: isAdded ? 'rgba(16,185,129,0.2)' : 'rgba(167,139,250,0.2)',
                                    color: isAdded ? '#10b981' : '#a78bfa',
                                    fontSize: 18, display: 'grid', placeItems: 'center',
                                    transition: 'all 0.2s',
                                }}>
                                {isAdded ? '✓' : '+'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:none } }`}</style>
        </div>
    );
}
