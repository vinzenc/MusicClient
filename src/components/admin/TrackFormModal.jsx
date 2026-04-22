import { useState, useEffect } from 'react';

const EMPTY = { title: '', artist: '', album: '', preview_url: '', cover_url: '', genre: '', status: 'active' };

const inp = { width: '100%', padding: '10px 13px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

export default function TrackFormModal({ track, onSave, onClose, isCollaborator = false }) {
    const [form, setForm] = useState(EMPTY);
    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState('');

    useEffect(() => {
        setForm(track ? { ...EMPTY, ...track } : EMPTY);
    }, [track]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.artist.trim()) { setErr('Tên bài và nghệ sĩ là bắt buộc!'); return; }
        
        setSaving(true); setErr('');
        try { 
            let dataToSave;
            if (isCollaborator) {
                // Build FormData for multipart upload
                const fd = new FormData();
                fd.append('title', form.title.trim());
                fd.append('artist', form.artist.trim());
                fd.append('album', form.album || '');
                fd.append('genre', form.genre || '');
                if (audioFile) fd.append('audio', audioFile);
                if (coverFile) fd.append('cover', coverFile);
                dataToSave = fd;
            } else {
                dataToSave = { ...form };
            }
            await onSave(dataToSave); 
        }
        catch (e) { setErr(e.message); }
        finally { setSaving(false); }
    };

    return (
        <div onClick={e => e.target === e.currentTarget && onClose()}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(8px)' }}>
            <div style={{ background: 'linear-gradient(135deg,#111827,#1e1b4b)', borderRadius: 20, border: '1px solid rgba(167,139,250,0.25)', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>{track ? '✏️ Sửa track' : '➕ Thêm track mới'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 22 }}>×</button>
                </div>

                <form onSubmit={onSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {form.cover_url && (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={form.cover_url} alt="Cover" style={{ width: 90, height: 90, borderRadius: 12, objectFit: 'cover', border: '2px solid rgba(167,139,250,0.4)' }} />
                        </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Tên bài *</span>
                            <input required style={inp} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tên bài hát" />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Nghệ sĩ *</span>
                            <input required style={inp} value={form.artist} onChange={e => set('artist', e.target.value)} placeholder="Tên nghệ sĩ" />
                        </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Album</span>
                            <input style={inp} value={form.album} onChange={e => set('album', e.target.value)} placeholder="Tên album" />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Thể loại</span>
                            <input style={inp} value={form.genre} onChange={e => set('genre', e.target.value)} placeholder="Pop, Rock..." />
                        </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                        {/* Removed Duration and Deezer ID fields as they are now automated */}
                    </div>
                    {isCollaborator ? (
                        <>
                            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>File Nhạc (MP3/WAV) *</span>
                                <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} style={inp} required={!track} />
                            </label>
                            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Ảnh bìa</span>
                                <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} style={inp} />
                            </label>
                        </>
                    ) : (
                        <>
                            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>URL Preview (30s)</span>
                                <input style={inp} value={form.preview_url} onChange={e => set('preview_url', e.target.value)} placeholder="https://..." />
                            </label>
                            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>URL Cover</span>
                                <input style={inp} value={form.cover_url} onChange={e => set('cover_url', e.target.value)} placeholder="https://..." />
                            </label>
                            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Trạng thái</span>
                                <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </label>
                        </>
                    )}

                    {err && <p style={{ color: '#ef4444', fontSize: 13 }}>❌ {err}</p>}

                    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>Hủy</button>
                        <button type="submit" disabled={saving} style={{ flex: 2, padding: 11, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', color: '#fff', fontWeight: 700, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                            {saving ? '⏳ Đang lưu...' : track ? '💾 Cập nhật' : '➕ Thêm track'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
