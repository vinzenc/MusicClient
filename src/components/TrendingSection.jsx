import { useEffect } from 'react';
import { useMusic } from '../contexts/MusicContext';

export default function TrendingSection() {
  const { trendingTracks, loading, error, fetchTrendingTracks, playTrack, addToLibrary } = useMusic();

  useEffect(() => {
    fetchTrendingTracks();
  }, []);

  if (loading) return <section className="mb-16"><div className="text-white">Đang tải trending tracks...</div></section>;

  if (error) return <section className="mb-16"><div className="text-red-500">Lỗi: {error}</div></section>;

  // Mock data if API is not available yet
  const displayTracks = trendingTracks.length > 0 ? trendingTracks : [
    {
      id: 1,
      title: 'Midnight Jazz',
      artist: 'The Collective Spirits',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_8gpFYGVrz-bfbAYsKPCFe62EubLHFE3TRLRg0nwwrERJ91vCIrjC40zFm-DfHwVZtABr5S55ZZqECrZTE86EmTvQJTYZeMGzAltfqmQb24NzKS2q8-79xyy6Nog7SelWi6P7L048XkVWguGehg9064SXq4RYgKJD-wRXiLeM4TqmAwUf1Qa95RPVefPMME7Ynlrm42ZRCp_FbW9C00r92zmdk6dOXSH1OirBTMZ0C-j_hbZLZp9coTiuBGx3rirHNMEsHH5lEIg',
      badge: 'Lossless',
      listeners: '1.2M Monthly Listeners',
      featured: true
    },
    {
      id: 2,
      title: 'Neon Pulse',
      artist: 'Synthetica',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBPNdmASBcy6eK920ac3UFospenRDZDz9mpFiRQuRZMENNdi3lIU9g0HITqJaQfC9v1_cGCvI08dX0oWJ41U-hxCB2u2zaApMZkZQu27C4CSoawYHaU_MTXj8oFUxo0f4yOBtVgtVsrrkuqMXekwN11tiH6cVmbnobAaC2XApq1JQDEgaam3BqY6ToVsbyfpGqNXg_dkoxZWm62O8xn-lhrYj8jPg-_fKH6KjgHjgVxpVP8Rv2zyVn_uzuVqPgZWNodoFFYnYi6ws',
      featured: false
    },
    {
      id: 3,
      title: 'Silent Horizon',
      artist: 'Aura',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2OKE4clL_sDm9RS8f6w0YIL6eYU8S2dGqmeA_yyGCY_md33hhFS7wuV0qF7-PNIr0V-Cuhu0B3OnBzZLLOlIMfyPt3X85OdM9irQGsfRFaXSFUHJQleyWleNALcuNZV65bXOgSXUq-5P91AUeOXb9Jd0yFCqc2BLqSV1DsIqJd0tdLMIVtGDMqXPW_RVWIajvYhn8dXNS6Zmeaf5KQJJIJPN8yc1NIkoc5E0x-wAvKpYZwNxY6uiZZiXfuRHYV1eX0A5de3dyQ_E',
      featured: false
    }
  ];

  return (
    <section className="mb-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-3xl font-bold tracking-tight text-white">Trending Now</h3>
          <p className="text-white/40 font-label text-sm">The most played tracks in your circle</p>
        </div>
        <button className="text-teal-neon font-label text-xs tracking-widest uppercase hover:text-yellow-cyber transition-colors">
          View All
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Featured large card */}
        {displayTracks[0] && (
          <div className="col-span-6 rounded-xl p-8 flex gap-8 glass-highlight relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-fuchsia-neon/50 transition-colors">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-fuchsia-neon/10 blur-[80px] rounded-full"></div>
            <img
              alt="Album Art"
              className="w-40 h-40 rounded-lg shadow-2xl z-10 border border-white/10"
              src={displayTracks[0].image}
            />
            <div className="flex flex-col justify-center z-10">
              <h4 className="text-2xl font-bold mb-1 text-white">{displayTracks[0].title}</h4>
              <p className="text-white/50 mb-4">{displayTracks[0].artist}</p>
              <div className="flex items-center gap-2">
                {displayTracks[0].badge && (
                  <span className="bg-yellow-cyber/20 text-yellow-cyber text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border border-yellow-cyber/30">
                    {displayTracks[0].badge}
                  </span>
                )}
                {displayTracks[0].listeners && (
                  <span className="text-white/40 text-xs font-label">{displayTracks[0].listeners}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Small cards */}
        {displayTracks.slice(1, 3).map((track) => (
          <div key={track.id} className="col-span-3 rounded-xl p-6 glass-highlight flex flex-col group hover:bg-synth-magenta/40 transition-all border-white/5 hover:border-teal-neon/40">
            <div className="relative mb-4">
              <img
                alt="Album Art"
                className="w-full aspect-square rounded-lg object-cover"
                src={track.image}
              />
              <button 
                onClick={() => playTrack(track.id)}
                className="absolute bottom-3 right-3 w-10 h-10 bg-teal-neon text-synth-deep rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.6)]"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </button>
            </div>
            <h4 className="font-bold truncate text-white">{track.title}</h4>
            <p className="text-xs text-white/40 font-label">{track.artist}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
