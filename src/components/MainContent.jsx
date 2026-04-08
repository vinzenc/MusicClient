import FeaturedSection from './FeaturedSection';
import TrendingSection from './TrendingSection';
import RecentlyPlayedSection from './RecentlyPlayedSection';

export default function MainContent() {
  return (
    <main className="ml-64 pb-32 bg-[radial-gradient(circle_at_top_right,rgba(45,10,49,0.5),rgba(13,2,33,1))]">
      <div className="pt-24 px-12">
        <FeaturedSection />
        <TrendingSection />
        <RecentlyPlayedSection />
      </div>
    </main>
  );
}
