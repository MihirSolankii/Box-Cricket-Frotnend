import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../component/Headers';
import Hero from '../component/Hero';
import TopRatedSection from '../component/TopRatedSection';
import CategorySection from '../component/CategorySection';
import FeaturesSection from '../component/FeaturesSection';
import Footer from '../component/Footer';
import HowItWorks from '@/component/HowItWorks';
import TurfListing from '@/component/TurfListing';
import CustomCursor from '@/component/CustomCursor';
import { useTurfData } from '@/hooks/useTurfData';
import HomeLoading from '@/component/loaders/HomeLoading';

const Index = () => {
  const { data: allTurfs, loading, error } = useTurfData();

  // Top 5 turfs sorted descending based on player rating
  const top5RatedTurfs = useMemo(() => {
    if (!allTurfs || !Array.isArray(allTurfs)) return [];
    return [...allTurfs]
      .filter((turf) => turf && (turf.name || turf.address))
      .sort((a, b) => {
        const ratingA = Number(a?.averageRating ?? a?.rating ?? 0);
        const ratingB = Number(b?.averageRating ?? b?.rating ?? 0);
        return ratingB - ratingA;
      })
      .slice(0, 5);
  }, [allTurfs]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <HomeLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CustomCursor />
      <Header />
      
      <main className="flex-1">
        {/* 1. Hero Introduction: 3D Tilt Arena, Live Counters & Magnetic CTA */}
        <Hero />

        {/* 2. Platform Value Proposition: Why Players Choose Box Cricket */}
        <FeaturesSection />

        {/* 3. Top 5 Rated Venues based on ratings */}
        <TopRatedSection turfs={top5RatedTurfs} />

        {/* 4. Format Categories: Night floodlit, 360 nets, budget friendly */}
        <CategorySection turfs={allTurfs || []} />

        {/* 5. Complete Explore / Turf Listings */}
        <TurfListing turfs={allTurfs || []} />

        {/* 6. Easy 3-step booking guide */}
        <HowItWorks />

        {/* 7. High-Energy Call-to-Action Banner */}
        <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm mb-4">
              Ready to Hit the Turf?
            </span>
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
              Ready for your next Super Over?
            </h2>
            <p className="text-emerald-100 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Find floodlit box cricket arenas near you, gather your squad, and book your prime match slot in under 60 seconds.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <Link
                to="/turfs"
                className="bg-white text-emerald-800 hover:bg-emerald-50 px-8 py-3.5 rounded-full font-bold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Book A Box Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;