export default function Sidebar() {
  return (
    <aside className="fixed h-full w-64 left-0 top-0 bg-synth-indigo/40 backdrop-blur-3xl flex flex-col py-8 px-4 z-50 border-r border-fuchsia-neon/10 shadow-[20px_0_50px_rgba(13,2,33,0.8)] font-['Manrope'] tracking-tight">
      <div className="mb-12 px-4">
        <h1 className="text-2xl font-black text-white italic drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
          Nocturne
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-teal-neon font-label mt-1">
          Sonic Gallery
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        <a href="#" className="flex items-center gap-4 px-4 py-3 text-teal-neon font-bold glow-teal bg-fuchsia-neon/5 rounded-lg group">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            home
          </span>
          <span>Trang chủ</span>
        </a>
        <a href="#" className="flex items-center gap-4 px-4 py-3 text-white/60 hover:text-fuchsia-neon hover:bg-white/5 transition-all duration-300 rounded-lg group">
          <span className="material-symbols-outlined">explore</span>
          <span>Khám phá</span>
        </a>
        <a href="#" className="flex items-center gap-4 px-4 py-3 text-white/60 hover:text-fuchsia-neon hover:bg-white/5 transition-all duration-300 rounded-lg group">
          <span className="material-symbols-outlined">library_music</span>
          <span>Thư viện</span>
        </a>
        <a href="#" className="flex items-center gap-4 px-4 py-3 text-white/60 hover:text-fuchsia-neon hover:bg-white/5 transition-all duration-300 rounded-lg group">
          <span className="material-symbols-outlined">playlist_play</span>
          <span>Danh sách phát</span>
        </a>
      </nav>

      <div className="mt-auto px-4">
        <div className="bg-synth-magenta/30 p-4 rounded-xl border border-teal-neon/20 backdrop-blur-md">
          <button className="w-full bg-gradient-to-r from-teal-neon to-fuchsia-neon text-synth-deep font-bold py-2 rounded-lg text-sm transition-transform active:scale-95 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
            Premium
          </button>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <img
            alt="User profile"
            className="w-10 h-10 rounded-full border-2 border-yellow-cyber/50 object-cover grayscale-0 transition-all duration-500"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPqU64prtQQpor7-GSdvurAXpCbs90lUt6CpkC1Ypoi1DTvYm1wCExTRG1j3PSPNxHUr0XqWCCBqZ5xRrrurKOGrstudeRmCaNkp2NQBu_-cY526a5iiwV7-x32zQzp0HBnOptBHzJgMZB6754-4yqHIzCinFJArHh8dEYndoFcWZ3a6KakohyMqhFXp3u_enIvALV_goIS8Cynb7wg7zHxYkAMfjKbbP26BJAY-SDdWUhuqr2yC8vmgtV41kUV6BOquH5biyP59k"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Alex Thorne</span>
            <span className="text-[10px] text-yellow-cyber font-label font-bold uppercase tracking-wider">
              PRO MEMBER
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
