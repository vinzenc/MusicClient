import React, { useState } from 'react';
import { Mail, Lock, Headset, Music4, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    // 1. State lưu dữ liệu đăng nhập (Chỉ cần Email và Password)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Cập nhật dữ liệu khi gõ
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (message.text) setMessage({ type: '', text: '' });
    };

    // 2. Hàm gọi API Đăng nhập
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setMessage({ type: 'error', text: 'Vui lòng nhập Email và Mật khẩu!' });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('https://musicapi-376j.onrender.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();
            if (data.success) {
                // Lưu vào bộ nhớ máy
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // GỌI HÀM NÀY ĐỂ BÁO CHO HEADER BIẾT LÀ ĐÃ ĐĂNG NHẬP
                login(data.user);

                setMessage({ type: 'success', text: data.message || 'Đăng nhập thành công! Đang vào app...' });

                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setMessage({ type: 'error', text: data.message || 'Sai thông tin đăng nhập!' });
            }
        } catch (error) {
            console.error('Lỗi API Đăng nhập:', error);
            setMessage({ type: 'error', text: 'Lỗi máy chủ. Vui lòng thử lại sau!' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#070b1d] text-white font-sans relative flex flex-col overflow-hidden">

            {/* Background Sóng Âm */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
                            <stop offset="50%" stopColor="#d946ef" stopOpacity="1" />
                            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d="M0,100 Q360,50 720,100 T1440,100 V800 H0 Z" stroke="url(#waveGradient)" fill="none" strokeWidth="2" />
                </svg>
            </div>

            {/* Header */}
            <header className="flex justify-between items-center py-6 px-8 md:px-16 relative z-10 w-full">
                <div className="text-3xl font-black italic tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
                    <span className="text-cyan-400">NOCTURN</span><span className="text-purple-400">E</span>
                </div>
                <nav className="hidden md:flex space-x-10 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400">
                    <a href="#" className="hover:text-cyan-400 transition-colors">Khám phá</a>
                    <a href="#" className="hover:text-purple-400 transition-colors">Xu hướng</a>
                    <a href="#" className="hover:text-white transition-colors">Về chúng tôi</a>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center relative z-10 w-full px-6 md:px-12">
                <div className="grid md:grid-cols-2 gap-12 w-full max-w-6xl mx-auto items-center">

                    {/* Cột Trái: Đồ họa */}
                    <div className="hidden md:flex flex-col items-center justify-center relative">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[100px] group-hover:bg-purple-500/20 transition-all duration-1000"></div>
                            <Headset size={300} className="text-purple-400 relative z-10 drop-shadow-[0_0_50px_rgba(217,70,239,0.3)]" />
                            <div className="absolute -top-6 -right-6 animate-bounce text-cyan-400"><Music4 size={48} /></div>
                        </div>
                        <h2 className="text-7xl font-black italic bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mt-6 tracking-tighter uppercase">
                            Welcome Back
                        </h2>
                    </div>

                    {/* Cột Phải: Form Đăng nhập */}
                    <div className="flex justify-center md:justify-end">
                        <div className="bg-[#101429]/60 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] w-full max-w-[420px] shadow-2xl border-t-white/20">
                            <h1 className="text-2xl font-black uppercase italic text-center mb-6 tracking-widest">Đăng nhập</h1>

                            {/* HIỂN THỊ THÔNG BÁO LỖI/THÀNH CÔNG */}
                            {message.text && (
                                <div className={`mb-4 p-3 rounded-lg text-xs font-bold text-center uppercase tracking-widest ${message.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                {/* Input Email */}
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="ĐỊA CHỈ EMAIL"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-cyan-400 transition-all placeholder:text-gray-500"
                                    />
                                </div>

                                {/* Input Password */}
                                <div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/50" size={18} />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="MẬT KHẨU"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-purple-400 transition-all placeholder:text-gray-500"
                                        />
                                    </div>

                                    {/* Link Quên mật khẩu */}
                                    <div className="flex justify-end mt-2">
                                        <span onClick={() => navigate('/forgot-password')} className="text-[10px] text-cyan-400 hover:text-white transition-colors font-bold uppercase tracking-widest cursor-pointer">
                                            Quên mật khẩu?
                                        </span>
                                    </div>
                                </div>

                                {/* Nút Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-navy-dark font-black py-4 rounded-2xl mt-4 hover:scale-105 transition-all shadow-lg shadow-cyan-500/20 uppercase tracking-widest text-xs flex justify-center items-center disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={18} />
                                            ĐANG VÀO APP...
                                        </>
                                    ) : (
                                        "Đăng Nhập Ngay"
                                    )}
                                </button>
                            </form>

                            {/* Nút chuyển sang trang đăng ký */}
                            <p className="mt-8 text-center text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                                Chưa có tài khoản? <span onClick={() => navigate('/register')} className="text-purple-400 cursor-pointer underline underline-offset-4 hover:text-white transition-colors">Đăng ký</span>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-[10px] font-bold text-gray-600 tracking-[0.4em] relative z-10 uppercase">
                &copy; 2026 NOCTURNZ MUSIC SERVICE. FULLSCREEN EDITION.
            </footer>
        </div>
    );
};

export default Login;