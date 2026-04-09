import FeaturedSection from '../components/FeaturedSection';
import TrendingSection from '../components/TrendingSection';
import DeezerSection from '../components/DeezerSection';
import RecentlyPlayedSection from '../components/RecentlyPlayedSection';

export default function HomePage() {
  return (
    <>
      <FeaturedSection />
      <DeezerSection />
      <TrendingSection />
      <RecentlyPlayedSection />
    </>
  );
}
