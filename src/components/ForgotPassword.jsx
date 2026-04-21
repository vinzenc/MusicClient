import React, { useState } from 'react';
import { Mail, Lock, KeyRound, Headset, Music4, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();

    // Các bước: 1 - Nhập Email, 2 - Nhập OTP + Mật khẩu mới
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Dữ liệu form
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (message.text) setMessage({ type: '', text: '' });
    };

    // Gửi Yêu cầu Quên mật khẩu
    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (!formData.email) {
            setMessage({ type: 'error', text: 'Vui lòng nhập Email để nhận OTP!' });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('https://musicapi-376j.onrender.com/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });

            const data = await response.json();

            if (response.ok || data.success) {
                setMessage({ type: 'success', text: data.message || 'Mã OTP đã được gửi đến email của bạn!' });
                setStep(2); // Chuyển sang bước 2 để nhập OTP và Pass mới
            } else {
                setMessage({ type: 'error', text: data.message || 'Có lỗi xảy ra khi gửi OTP!' });
            }
        } catch (error) {
            console.error('Lỗi API Forgot Password:', error);
            setMessage({ type: 'error', text: 'Lỗi hệ thống. Vui lòng thử lại sau!' });
        } finally {
            setIsLoading(false);
        }
    };

    // Gửi yêu cầu Đổi mật khẩu mới
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!formData.otp || !formData.newPassword) {
            setMessage({ type: 'error', text: 'Vui lòng điền đủ OTP và Mật khẩu mới!' });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('https://musicapi-376j.onrender.com/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (response.ok || data.success) {
                setMessage({ type: 'success', text: data.message || 'Đổi mật khẩu thành công! Đang chuyển hướng...' });
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.message || 'OTP không hợp lệ hoặc lỗi đổi mật khẩu!' });
            }
        } catch (error) {
            console.error('Lỗi API Reset Password:', error);
            setMessage({ type: 'error', text: 'Lỗi hệ thống. Vui lòng thử lại sau!' });
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
                            <Headset size={300} className="text-cyan-400 relative z-10 drop-shadow-[0_0_50px_rgba(14,165,233,0.3)]" />
                            <div className="absolute -top-6 -right-6 animate-bounce text-purple-400"><Music4 size={48} /></div>
                        </div>
                        <h2 className="text-6xl font-black italic bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent mt-6 tracking-tighter uppercase text-center">
                            Reset Password
                        </h2>
                    </div>

                    {/* Cột Phải: Form Quên mật khẩu */}
                    <div className="flex justify-center md:justify-end">
                        <div className="bg-[#101429]/60 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] w-full max-w-[420px] shadow-2xl border-t-white/20">
                            <h1 className="text-2xl font-black uppercase italic text-center mb-6 tracking-widest">
                                {step === 1 ? 'Khôi phục mật khẩu' : 'Nhập mã xác nhận'}
                            </h1>

                            {/* Thông báo */}
                            {message.text && (
                                <div className={`mb-4 p-3 rounded-lg text-[11px] font-bold text-center uppercase tracking-widest ${message.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            <form className="space-y-5" onSubmit={step === 1 ? handleSendOTP : handleResetPassword}>

                                {/* BƯỚC 1: Chỉ nhập Email */}
                                {step === 1 && (
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="ĐỊA CHỈ EMAIL ĐÃ ĐĂNG KÝ"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-cyan-400 transition-all placeholder:text-gray-500"
                                            required
                                        />
                                    </div>
                                )}

                                {/* BƯỚC 2: Nhập OTP và Mật khẩu mới */}
                                {step === 2 && (
                                    <>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500/50" size={18} />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                disabled
                                                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-gray-500 outline-none cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="relative">
                                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
                                            <input
                                                type="text"
                                                name="otp"
                                                value={formData.otp}
                                                onChange={handleChange}
                                                placeholder="MÃ OTP TỪ EMAIL"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-cyan-400 transition-all placeholder:text-gray-500 tracking-widest uppercase"
                                                maxLength="6"
                                                required
                                            />
                                        </div>

                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/50" size={18} />
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                placeholder="MẬT KHẨU MỚI"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-purple-400 transition-all placeholder:text-gray-500"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Nút Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-navy-dark font-black py-4 rounded-2xl mt-4 hover:scale-105 transition-all shadow-lg shadow-cyan-500/20 uppercase tracking-widest text-xs flex justify-center items-center disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={18} />
                                            ĐANG XỬ LÝ...
                                        </>
                                    ) : (
                                        step === 1 ? "Gửi OTP" : "Xác nhận đổi mật khẩu"
                                    )}
                                </button>
                            </form>

                            {/* Nút quay lại */}
                            <p className="mt-8 text-center text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                                Nhớ mật khẩu? <span onClick={() => navigate('/login')} className="text-cyan-400 cursor-pointer underline underline-offset-4 hover:text-white transition-colors">Đăng nhập</span>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-[10px] font-bold text-gray-600 tracking-[0.4em] relative z-10 uppercase">
                &copy; 2026 NOCTURNZ MUSIC SERVICE. BY THANH THUẬN.
            </footer>
        </div>
    );
};

export default ForgotPassword;
