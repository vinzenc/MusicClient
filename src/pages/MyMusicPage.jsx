import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMusic } from '../contexts/MusicContext';
import { trackStore, pendingStore } from '../services/mockStore';

export default function MyMusicPage() {
  const { user } = useAuth();
  const { playTrack } = useMusic();
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);
  const [editingIsPending, setEditingIsPending] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingIsPending, setDeletingIsPending] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: 'Pop',
    cover_url: '',
    preview_url: ''
  });

  const loadTracks = async () => {
    setIsLoading(true);
    try {
      const userName = user?.name || user?.username;
      // Get approved/active tracks
      const activeTracks = await trackStore.getByUser(userName);
      // Get pending and rejected tracks
      const pendingRes = await pendingStore.getByUser(userName);
      
      setTracks([...(activeTracks || []), ...(pendingRes || [])]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadTracks();
    }
  }, [user]);

  const handleOpenModal = (track = null, isPending = false) => {
    if (track) {
      setEditingTrack(track);
      setEditingIsPending(isPending);
      setFormData({
        title: track.title,
        artist: track.artist,
        genre: track.genre || 'Pop',
        cover_url: track.cover_url || '',
        preview_url: track.preview_url || ''
      });
    } else {
      setEditingTrack(null);
      setFormData({
        title: '',
        artist: '',
        genre: 'Pop',
        cover_url: '',
        preview_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrack(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.artist) return;
    
    try {
      if (editingTrack) {
        if (editingIsPending) {
          await pendingStore.edit(editingTrack.id, formData);
        } else {
          await trackStore.edit(editingTrack.id, formData);
        }
      } else {
        await pendingStore.submit({
          ...formData,
          duration: 180, // Fake duration
          submitted_by_name: user?.name || user?.username
        });
      }
      handleCloseModal();
      loadTracks();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      if (deletingIsPending) {
        await pendingStore.remove(deletingId);
      } else {
        await trackStore.remove(deletingId);
      }
      setDeletingId(null);
      loadTracks();
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center bg-gray-900">
        <h2 className="text-2xl font-bold text-white mb-4">Vui lòng đăng nhập để xem Nhạc của bạn</h2>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-32">
      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Nhạc Của <span className="text-fuchsia-neon">Tôi</span>
          </h1>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-fuchsia-neon hover:bg-fuchsia-400 text-synth-deep font-bold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(255,0,255,0.4)] transition-all hover:scale-105"
          >
            <span className="material-symbols-outlined">add</span>
            Tải Nhạc Lên
          </button>
        </div>

        {/* List of tracks */}
        {isLoading ? (
          <div className="text-center py-20">
             <span className="material-symbols-outlined animate-spin text-fuchsia-neon text-4xl">sync</span>
          </div>
        ) : tracks.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center backdrop-blur-sm">
             <span className="material-symbols-outlined text-6xl text-white/20 mb-4 block">music_off</span>
             <p className="text-white/60 text-lg">Bạn chưa tải lên bài hát nào.</p>
             <button 
               onClick={() => handleOpenModal()}
               className="mt-6 text-fuchsia-neon hover:text-white underline underline-offset-4 decoration-fuchsia-neon/50 uppercase tracking-widest text-sm font-bold transition-all"
             >
               Tải bài đầu tiên ngay
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tracks.map(track => (
              <div key={track.id} className="group bg-white/5 hover:bg-white/10 border border-transparent hover:border-fuchsia-neon/30 p-4 rounded-xl flex items-center gap-4 transition-all pr-6">
                
                {/* Cover & Play */}
                <div 
                  className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 cursor-pointer shadow-lg group-hover:shadow-fuchsia-neon/20 transition-all"
                  onClick={() => playTrack(track, tracks)}
                >
                  <img src={track.cover_url || 'https://picsum.photos/seed/default/250/250'} alt={track.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white truncate text-lg group-hover:text-fuchsia-neon transition-colors">{track.title}</h3>
                    {track.status === 'pending' && <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-widest border border-yellow-500/30">Chờ duyệt</span>}
                    {track.status === 'rejected' && <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-500/30">Từ chối</span>}
                  </div>
                  <p className="text-sm text-gray-400 truncate mt-0.5">{track.artist}</p>
                  {track.status === 'rejected' && track.admin_note && (
                    <p className="text-xs text-red-400 mt-1 italic truncate max-w-sm">Lý do: {track.admin_note}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenModal(track, track.status === 'pending' || track.status === 'rejected')}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-teal-neon hover:text-synth-deep flex items-center justify-center transition-all text-white/70"
                    title="Chỉnh sửa"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setDeletingId(track.id); 
                      setDeletingIsPending(track.status === 'pending' || track.status === 'rejected'); 
                    }}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all text-white/70"
                    title="Xóa nhạc"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px] pointer-events-none">delete</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-synth-base border border-fuchsia-neon/30 w-full max-w-lg rounded-3xl p-8 shadow-[0_0_50px_rgba(255,0,255,0.1)]">
            
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-6">
              {editingTrack ? 'Chỉnh Sửa Nhạc' : 'Thêm Nhạc Mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Tên bài hát</label>
                <input 
                  required
                  type="text" name="title" value={formData.title} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-fuchsia-neon focus:bg-white/10 transition-colors"
                  placeholder="Nhập tên bài hát..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Nghệ sĩ / Ca sĩ</label>
                <input 
                  required
                  type="text" name="artist" value={formData.artist} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-fuchsia-neon focus:bg-white/10 transition-colors"
                  placeholder="Tên nghệ sĩ trình bày..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Thể loại</label>
                  <select
                    name="genre" value={formData.genre} onChange={handleChange}
                    className="w-full bg-[#181d36] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-fuchsia-neon transition-colors"
                  >
                    {['Pop', 'Hip-hop', 'R&B', 'K-Pop', 'Synth-pop', 'Disco-pop', 'Indie-pop'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Link Ảnh Bìa (URL)</label>
                <input 
                  type="url" name="cover_url" value={formData.cover_url} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-fuchsia-neon focus:bg-white/10 transition-colors text-sm"
                  placeholder="https://... (.jpg, .png)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Link MP3 Preview (URL)</label>
                <input 
                  type="url" name="preview_url" value={formData.preview_url} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-fuchsia-neon focus:bg-white/10 transition-colors text-sm"
                  placeholder="https://... (.mp3)"
                />
              </div>
              
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors uppercase text-xs tracking-widest">
                  Hủy
                </button>
                <button type="submit" className="flex-1 py-3 px-4 rounded-xl bg-fuchsia-neon text-synth-deep font-bold hover:bg-fuchsia-400 hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(255,0,255,0.4)] uppercase text-xs tracking-widest">
                  Lưu Lại
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeletingId(null)}></div>
          <div className="relative bg-synth-base border border-red-500/50 w-full max-w-sm rounded-3xl p-8 shadow-[0_0_50px_rgba(255,0,0,0.1)] text-center">
             <span className="material-symbols-outlined text-red-500 text-6xl mb-4">warning</span>
             <h2 className="text-xl font-bold text-white mb-2">Xác nhận xóa</h2>
             <p className="text-white/60 mb-8 text-sm">Hành động này sẽ xóa bài hát ngay lập tức và không thể khôi phục.</p>
             <div className="flex gap-4">
               <button 
                 onClick={() => setDeletingId(null)}
                 className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors uppercase text-xs tracking-widest"
               >
                 Hủy
               </button>
               <button 
                 onClick={confirmDelete}
                 className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(255,0,0,0.4)] uppercase text-xs tracking-widest"
               >
                 Xóa
               </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
