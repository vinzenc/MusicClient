import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, Mail, Save, Loader2, KeyRound } from 'lucide-react';

export default function ProfilePage() {
    const { user, login } = useAuth(); // login is actually our setUser in the context if it updates the state, or we can just rely on the API.
    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Forms
    const [profileData, setProfileData] = useState({
        username: '',
        name: '',
        email: '',
        avatar: ''
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://musicapi-376j.onrender.com/profile/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok || data.success) {
                // Giả sử API trả về user trong data.data hoặc data.user hoặc chính data
                const userData = data.user || data.data || data;
                setProfileData({
                    username: userData.username || '',
                    name: userData.name || '',
                    email: userData.email || '',
                    avatar: userData.avatar || ''
                });
            }
        } catch (error) {
            console.error('Lỗi khi tải profile:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
        setMessage({ type: '', text: '' });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
        setMessage({ type: '', text: '' });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://musicapi-376j.onrender.com/profile/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();
            if (response.ok || data.success) {
                setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
                
                // Update local storage and context if valid
                const currentUser = JSON.parse(localStorage.getItem('user')) || {};
                const updatedUser = { ...currentUser, ...profileData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                if (login) login(updatedUser); // sync Auth context

            } else {
                setMessage({ type: 'error', text: data.message || 'Có lỗi xảy ra khi cập nhật hồ sơ!' });
            }
        } catch (error) {
            console.error('Lỗi API Profile:', error);
            setMessage({ type: 'error', text: 'Lỗi máy chủ, vui lòng thử lại sau.' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu mới không khớp!' });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://musicapi-376j.onrender.com/profile/password', {
                method: 'PUT', // Thường là PUT cho việc update tài nguyên
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldPassword: passwordData.oldPassword,
                    currentPassword: passwordData.oldPassword, // Gửi cả 2 dự phòng format từ BE
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();
            if (response.ok || data.success) {
                setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Mật khẩu cũ không chính xác hoặc lỗi hệ thống!' });
            }
        } catch (error) {
            console.error('Lỗi API Profile Password:', error);
            setMessage({ type: 'error', text: 'Lỗi máy chủ, vui lòng thử lại sau.' });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex-1 flex justify-center items-center h-full pt-20">
                <Loader2 className="animate-spin text-cyan-400" size={48} />
            </div>
        );
    }

    return (
        <div className="pt-24 px-8 md:px-12 pb-12 min-h-screen text-white font-sans animate-in fade-in duration-500">
            {/* Header Title */}
            <div className="mb-10 flex items-end gap-6">
                <div className="w-24 h-24 rounded-full border-2 border-fuchsia-neon p-1 relative overflow-hidden bg-synth-deep/50 shadow-[0_0_20px_rgba(217,70,239,0.3)] shrink-0 flex items-center justify-center">
                    {profileData.avatar ? (
                        <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <User size={40} className="text-cyan-400 opacity-50" />
                    )}
                </div>
                <div>
                    <h1 className="text-4xl font-black italic bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-tighter">
                        Hồ sơ của bạn
                    </h1>
                    <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase mt-2">
                        Quản lý thông tin và bảo mật
                    </p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-8 max-w-5xl">
                
                {/* Tabs Sidebar */}
                <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all text-sm uppercase tracking-widest ${activeTab === 'info' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(14,165,233,0.2)]' : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'}`}
                    >
                        <User size={18} /> Thông tin
                    </button>
                    <button 
                        onClick={() => setActiveTab('password')}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all text-sm uppercase tracking-widest ${activeTab === 'password' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'}`}
                    >
                        <KeyRound size={18} /> Đổi mật khẩu
                    </button>
                </div>

                {/* Content Panel */}
                <div className="flex-1 bg-[#181d36]/50 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                    {/* Decorative Blur */}
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${activeTab === 'info' ? 'from-cyan-500/10' : 'from-purple-500/10'} to-transparent rounded-full blur-[80px] pointer-events-none transition-colors duration-1000`}></div>

                    <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                        {activeTab === 'info' ? 'Thông tin cá nhân' : 'Đổi mật khẩu'}
                    </h2>

                    {/* Notification Messages */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl text-xs font-bold uppercase tracking-widest ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Tab: Thông tin cá nhân */}
                    {activeTab === 'info' && (
                        <div className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 ml-1">Tên hiển thị</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
                                    <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white cursor-default">
                                        {profileData.name || profileData.username || 'Chưa cập nhật'}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 ml-1">Email đã đăng ký</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
                                    <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white cursor-default">
                                        {profileData.email || 'Chưa cập nhật'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Đổi Mật Khẩu */}
                    {activeTab === 'password' && (
                        <form onSubmit={handleUpdatePassword} className="space-y-5 relative z-10">
                            <div>
                                <label className="block text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2 ml-1">Mật khẩu hiện tại</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input 
                                        type="password" 
                                        name="oldPassword"
                                        value={passwordData.oldPassword} 
                                        onChange={handlePasswordChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:border-purple-400 transition-colors"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2 ml-1">Mật khẩu mới</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input 
                                        type="password" 
                                        name="newPassword"
                                        value={passwordData.newPassword} 
                                        onChange={handlePasswordChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:border-purple-400 transition-colors"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2 ml-1">Xác nhận mật khẩu mới</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input 
                                        type="password" 
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword} 
                                        onChange={handlePasswordChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:border-purple-400 transition-colors"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="mt-8 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-navy-dark px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                                Đổi Mật Khẩu
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
}
