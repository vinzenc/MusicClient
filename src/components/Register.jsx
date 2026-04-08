import React from 'react';
import { Mail, Lock, User, Headset, Music4, ShieldCheck } from 'lucide-react';

const Register = () => {
    return (
        <div className="h-screen w-full bg-[#070b1d] text-white font-sans relative flex flex-col overflow-hidden">

            {/* 1. Background Sóng Âm Neon */}
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

            {/* 2. Header */}
            <header className="flex justify-between items-center py-6 px-8 md:px-16 relative z-10 w-full">
                <div className="text-3xl font-black italic tracking-tighter">
                    <span className="text-cyan-400">Nocturne</span>
                </div>
                <nav className="hidden md:flex space-x-10 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400">
                    <a href="#" className="hover:text-cyan-400 transition-colors">Khám phá</a>
                    <a href="#" className="hover:text-purple-400 transition-colors">Xu hướng</a>
                    <a href="#" className="hover:text-white transition-colors">Về chúng tôi</a>
                </nav>
            </header>

            {/* 3. Main Content - Căn giữa toàn màn hình với max-w-6xl */}
            <main className="flex-grow flex items-center justify-center relative z-10 w-full px-6 md:px-12">
                <div className="grid md:grid-cols-2 gap-12 w-full max-w-6xl mx-auto items-center">

                    {/* Cột Trái: Đồ họa (Thu nhỏ một chút để vừa màn hình Laptop) */}
                    <div className="hidden md:flex flex-col items-center justify-center relative">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[100px] group-hover:bg-purple-500/20 transition-all duration-1000"></div>
                            <Headset size={300} className="text-purple-400 relative z-10 drop-shadow-[0_0_50px_rgba(217,70,239,0.3)]" />
                            <div className="absolute -top-6 -right-6 animate-bounce text-cyan-400"><Music4 size={48} /></div>
                        </div>
                        <h2 className="text-7xl font-black italic bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mt-6 tracking-tighter">
                            NOCTURNE
                        </h2>
                    </div>

                    {/* Cột Phải: Form Đăng ký */}
                    <div className="flex justify-center md:justify-end">
                        <div className="bg-[#101429]/60 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] w-full max-w-[420px] shadow-2xl border-t-white/20">
                            <h1 className="text-2xl font-black uppercase italic text-center mb-8 tracking-widest">Đăng ký thành viên</h1>

                            <form className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
                                    <input type="text" placeholder="TÊN ĐĂNG NHẬP" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 text-xs font-bold outline-none focus:border-cyan-400 transition-all placeholder:text-gray-500" />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/50" size={18} />
                                    <input type="email" placeholder="ĐỊA CHỈ EMAIL" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 text-xs font-bold outline-none focus:border-purple-400 transition-all placeholder:text-gray-500" />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={18} />
                                    <input type="password" placeholder="MẬT KHẨU" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 text-xs font-bold outline-none focus:border-cyan-400 transition-all placeholder:text-gray-500" />
                                </div>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/50" size={18} />
                                    <input type="password" placeholder="XÁC NHẬN MẬT KHẨU" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 text-xs font-bold outline-none focus:border-purple-400 transition-all placeholder:text-gray-500" />
                                </div>

                                <button className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-navy-dark font-black py-4 rounded-2xl mt-6 hover:scale-105 transition-all shadow-lg shadow-cyan-500/20 uppercase tracking-widest text-xs">
                                    Bắt đầu quẩy
                                </button>
                            </form>

                            <p className="mt-8 text-center text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                                Đã có tài khoản? <a href="#" className="text-cyan-400 underline underline-offset-4 hover:text-white transition-colors">Đăng nhập</a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* 4. Footer */}
            <footer className="py-6 text-center text-[10px] font-bold text-gray-600 tracking-[0.4em] relative z-10 uppercase">
                &copy; 2026 NOCTURNE MUSIC SERVICE. FULLSCREEN EDITION.
            </footer>
        </div>
    );
};
export default Register;