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
  console.log("data are ::::::",allTurfs);
  

  if (loading) return <div className="text-center py-12"><HomeLoading/></div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  return (
    <div className="min-h-screen bg-background ">
      <CustomCursor />
      <Header/>
      <main>
        <Hero />
      <TopRatedSection turfs={allTurfs} />
      <TurfListing turfs={allTurfs} />
        <HowItWorks/>
      </main>
      <Footer />
    </div>
  );
};

export default Index;