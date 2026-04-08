export default function FeaturedSection() {
  return (
    <section className="relative h-[500px] rounded-2xl overflow-hidden mb-16 group border border-fuchsia-neon/20 shadow-[0_0_30px_rgba(255,0,255,0.1)]">
      <img
        alt="Featured Album Background"
        className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 opacity-60"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7Z5JiakltTsI4EytbvXYtOcH2DNawU2-W5R13xikkmVDaCNKyLxQuzsN2TyTslpt-RCZCDh44Gecnlw88j5mjvyyHwlR5zs0yz3AYsWrbsoLtJTraaP8oVO_CPBZ2oQFx729fzYM3wFnqbatZ1yTr0KVkt2Nkrum1wWK39N078L0kI0S90u7D0RFO54xzRXmqbkp1Y8VCFLus088sQpqx_IXFCL8k9ZDIGgkWwCZSsXrmoxGA6OtVyHF7_cNW--E1zpjG_eYmAy0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-synth-deep via-synth-deep/60 to-transparent"></div>
      <div className="relative h-full flex flex-col justify-center px-12 max-w-2xl">
        <span className="text-yellow-cyber font-label text-xs tracking-[0.3em] uppercase mb-4 drop-shadow-[0_0_8px_rgba(243,255,0,0.5)]">
          New Release
        </span>
        <h2 className="text-7xl font-extrabold tracking-tighter leading-tight mb-2 text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
          Electric <br /> Dreams
        </h2>
        <p className="text-xl text-white/70 font-light mb-8 max-w-md">
          Experience the definitive journey through neo-soul and synthesized textures with Luna Ray's latest masterpiece.
        </p>
        <div className="flex items-center gap-4">
          <button className="px-8 py-3 bg-teal-neon text-synth-deep font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,243,255,0.4)]">
            Play Now
          </button>
          <button className="px-8 py-3 bg-fuchsia-neon/20 backdrop-blur-md border border-fuchsia-neon/40 text-fuchsia-neon font-bold rounded-full hover:bg-fuchsia-neon/30 transition-all">
            Add to Library
          </button>
        </div>
      </div>
    </section>
  );
}
