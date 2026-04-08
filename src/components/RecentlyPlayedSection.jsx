import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMusic } from '../contexts/MusicContext';

export default function RecentlyPlayedSection() {
  const { user } = useAuth();
  const { recentlyPlayed, loading, fetchRecentlyPlayed, playTrack } = useMusic();

  useEffect(() => {
    if (user?.id) {
      fetchRecentlyPlayed(user.id);
    }
  }, [user]);

  // Mock data if no API data
  const displayTracks = recentlyPlayed.length > 0 ? recentlyPlayed : [
    {
      id: 1,
      title: 'Vibrations',
      artist: 'Echo Systems',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFnVGpOYAXv8d9eW-ZxIhIrlfWxSGfJ2znHkZ8xXNi_U57xGOdRXR0WuYthd9Sw1qF2LDFn0OlU_wHNfdpAGuxE4nn51bpLAzUo87hb-Mg2ss_2O_6lADhA6KgonB5LruQxoXuddQYdrZu7QmmvIowAIDNTP0faTI3eurMioNump9TFsUnieTYViSuq3uj0CQZVO32kmNXV9D_JF7gIuRhMq_3fr7IafWT_Z7ZYg4295edUM4giJ3XCxFK9lcS4KIleevqkvIwLnA'
    },
    {
      id: 2,
      title: 'Acid Rain',
      artist: 'Velvet Void',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8PRG60d3Mdw_qyi5gqzSNgExE_SaZ6nA5rys71BvVbljD7N3f-LWs-J8MByW4KhjwUj6LyvN0Akwzb0HcTn5r7bVZ3pGxK-NkP-UAON-_APSptSv0S2cYu2R2X-XfuvrrA8nEYR7pNSXGnLjTQr6F7Q8ZiScmY_1QMLCBh1DAkAew5tBgRkK-zwx81Y3Rd3yLOsYZrbShK2jPOIMrOdhHdiaujGSetoClQw5P6HDCtzlKxtzW8YvENm1NR2cG5PmvQymqHQofNfc'
    },
    {
      id: 3,
      title: 'Golden Era',
      artist: 'The Roots',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARrz7BN6MauVxKEnLHInTF5pDepJ4yJ0ISUXmwO6kBOBlQ1lsZ9M5cw7jhUfOMV3tLPfmZeZg1TMuWesHxPLLK48radUWMQglt4lVIbauq4N6jjOXzwjT-GppwJhhKahJlcbijFQAsTpPrUM8cqaog8B3LsNLeuWJ_41GbVKZOWNUqpYAbHgBWyajOMjvrFnrjArhr80pgyZY5SFN5Ziql_kUiMR4BA2Q85_Fjy_h9MZlSQeCdx13hnHyboOLTKdfkjasizVKobGc'
    },
    {
      id: 4,
      title: 'Oceanic',
      artist: 'Deep Tide',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwJ_bfxWLVlznbR02k07uB-zCIhlw8WdiJJ478kywvehB40lxnvVYYiQjqIcj7ke69iKxNzY1fXAqshwzGwSox5e1JZ1RQ25NGDq1JOghDGilzL-S4EkpzczQ2m8F-Qk7XtEdrIuYsDA_CNtHfYH7bhvRg5RYECxzDLk1C3iiFTubdc7Ng_CH4oAHwZQoYz-_nWEFQWOvi1o0vd7vbSL4c2a2bBgtVT2Vg2aFb-Q_T6tH6vYkCMDxfbO4iRiY7AOaj6PgSc9McLnM'
    },
    {
      id: 5,
      title: 'Forest Walk',
      artist: 'Nature Echo',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB7RQEallZ3xNELT-V4VPxadFoXMbOTE5Dsl45he9w1xt2sXAF3bVjsVo2ZwXD_fHKpyDP159I34CUGp4cskF94SPn15IPVPQk6y0qOhajHasaSZo13sCJ_FolTzt2CwprXgFfq7aE--wljflccWkTKtY9W27yOYKsrysfdzNI3pHSUFWcVr8srfigJ_A4zlWXR1Asfe5HzyawHIy8cgHAv3co_0AoBXm-jN5r4yuHldzCdiMmAW5wElXjvP9_ZCkIh4KpePu_TCQ'
    },
    {
      id: 6,
      title: 'Ivory Keys',
      artist: 'Elias Vane',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-VvuRdrYFXRzCQKJscyrA0udQyMM0scyXgxIriex8ioe3YOmLRASXtyeBSDh3cepQ-dd9pBfQfTZJBWQorVMlzDfhyc6CGWdswIK6WBFAv91ZB2avplVQ8ab6y7EHpH7ScrtR49wBYvpWsAWsswHP7TxrE93Fe934tuuBYeHdMIRCCiiQ8Iqo8LB0xf6aES0tJmgiZuaxoEjBPddFOsL85jQMgPanEzLrCd6rhhL-wG-05O2yC7gKzoHTYtLXhQIv8azGsYa0QIM'
    }
  ];

  if (loading) return <section className="mb-8"><div className="text-white">Đang tải...</div></section>;

  return (
    <section className="mb-8">
      <h3 className="text-2xl font-bold tracking-tight mb-8 text-white">Recently Played</h3>
      <div className="grid grid-cols-6 gap-6">
        {displayTracks.map((track) => (
          <div key={track.id} className="flex flex-col gap-3 group cursor-pointer" onClick={() => playTrack(track.id)}>
            <img
              alt="Music Cover"
              className="w-full aspect-square rounded-lg object-cover shadow-lg group-hover:scale-105 group-hover:shadow-teal-neon/20 transition-all border border-white/5"
              src={track.image}
            />
            <div>
              <p className="text-sm font-semibold truncate text-white group-hover:text-teal-neon transition-colors">
                {track.title}
              </p>
              <p className="text-[11px] text-white/40 font-label">{track.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
