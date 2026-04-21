import React, { useState } from 'react';
import { Mail, Lock, User, Headset, Music4, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    // 1. Tạo state để lưu dữ liệu người dùng nhập
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // 2. Tạo state để xử lý trạng thái hiển thị (đang tải, lỗi, thành công)
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Hàm cập nhật dữ liệu khi người dùng gõ vào ô input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
        if (message.text) setMessage({ type: '', text: '' });
    };

    // Hàm xử lý khi bấm nút Đăng ký
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn trang web tải lại

        // Validate cơ bản: Kiểm tra nhập đủ và mật khẩu khớp
        if (!formData.username || !formData.email || !formData.password) {
            setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin!' });
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
            return;
        }

        setIsLoading(true);

        try {
            // GỌI API ĐĂNG KÝ
            const response = await fetch('https://musicapi-376j.onrender.com/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Gửi dữ liệu lên API (Không gửi confirmPassword)
                body: JSON.stringify({
                    name: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Nếu API trả về thành công
                setMessage({ type: 'success', text: 'Đăng ký thành công! Đang chuyển hướng...' });

                // Tự động chuyển sang trang đăng nhập sau 2 giây
                setTimeout(() => {
                    navigate('/login'); // Thay '/login' bằng đường dẫn trang đăng nhập của bạn nếu khác
                }, 2000);
            } else {
                // Nếu API báo lỗi (VD: trùng email, trùng username)
                setMessage({ type: 'error', text: data.message || 'Đăng ký thất bại. Vui lòng thử lại!' });
            }
        } catch (error) {
            console.error('Lỗi API:', error);
            setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' });
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
                <div className="text-3xl font-black italic tracking-tighter">
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
                        <h2 className="text-7xl font-black italic bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mt-6 tracking-tighter">
                            NOC TURNE
                        </h2>
                    </div>

                    {/* Cột Phải: Form Đăng ký */}
                    <div className="flex justify-center md:justify-end">
                        <div className="bg-[#101429]/60 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] w-full max-w-[420px] shadow-2xl border-t-white/20">
                            <h1 className="text-2xl font-black uppercase italic text-center mb-6 tracking-widest">Đăng ký thành viên</h1>

                            {/* HIỂN THỊ THÔNG BÁO LỖI HOẶC THÀNH CÔNG TẠI ĐÂY */}
                            {message.text && (
                                <div className={`mb-4 p-3 rounded-lg text-xs font-bold text-center uppercase tracking-widest ${message.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            {/* THÊM onSubmit={handleSubmit} VÀO FORM */}
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
                                    <input
                                        type="text"
                                        name="username" // Thêm name
                                        value={formData.username} // Ràng buộc value
                                        onChange={handleChange} // Lắng nghe thay đổi
                                        placeholder="TÊN ĐĂNG NHẬP"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-cyan-400 transition-all placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/50" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="ĐỊA CHỈ EMAIL"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-purple-400 transition-all placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="MẬT KHẨU"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-cyan-400 transition-all placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/50" size={18} />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="XÁC NHẬN MẬT KHẨU"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-purple-400 transition-all placeholder:text-gray-500"
                                    />
                                </div>

                                {/* NÚT SUBMIT: Thay đổi trạng thái khi đang tải */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-navy-dark font-black py-4 rounded-2xl mt-6 hover:scale-105 transition-all shadow-lg shadow-cyan-500/20 uppercase tracking-widest text-xs flex justify-center items-center disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={18} />
                                            ĐANG XỬ LÝ...
                                        </>
                                    ) : (
                                        "Bắt đầu quẩy"
                                    )}
                                </button>
                            </form>

                            <p className="mt-8 text-center text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                                Đã có tài khoản? <span onClick={() => navigate('/login')} className="text-cyan-400 cursor-pointer underline underline-offset-4 hover:text-white transition-colors">Đăng nhập</span>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-[10px] font-bold text-gray-600 tracking-[0.4em] relative z-10 uppercase">
                &copy; 2026 NOCTURNE MUSIC SERVICE.BY THANH THUẬN
            </footer>
        </div>
    );
};

export default Register;