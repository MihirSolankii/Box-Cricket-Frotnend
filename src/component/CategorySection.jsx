import { useState, useMemo } from 'react';
import { ChevronRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import VenueCard from './VenueCard';

const categories = ['All Box Arenas', 'Night Floodlit', '360° Nets', 'Budget Friendly'];

const fallbackVenues = [
  { googlePlaceId: 'ChIJFc6U9gjLWTkR5LnmDfrVCS8', name: 'FWF BOX CRICKET', address: { fullAddress: 'Rajkot, Gujarat' }, pricePerHour: 602, averageRating: 4.8 },
  { googlePlaceId: 'ChIJ_6wYAgDLWTkRNEvNECZm-GU', name: 'Howzzat Multi Sport Arena', address: { fullAddress: 'Rajkot, Gujarat' }, pricePerHour: 1028, averageRating: 4.7 },
  { googlePlaceId: 'ChIJt4amFQC3WTkR6GbCUVjcyRA', name: 'Cricboxx Box Cricket', address: { fullAddress: 'Rajkot, Gujarat' }, pricePerHour: 1200, averageRating: 5.0 },
  { googlePlaceId: 'ChIJxfZPdwDLWTkRYK93b5p7itc', name: 'Gully Box Cricket', address: { fullAddress: 'Rajkot, Gujarat' }, pricePerHour: 978, averageRating: 4.4 },
];

const CategorySection = ({ turfs = [] }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  const displayVenues = useMemo(() => {
    if (!turfs || turfs.length === 0) return fallbackVenues;

    switch (activeCategory) {
      case 0: // All
        return turfs.slice(0, 4);
      case 1: // Night Floodlit
        return turfs.slice(1, 5).length > 0 ? turfs.slice(1, 5) : turfs.slice(0, 4);
      case 2: // 360 Nets
        return turfs.slice(2, 6).length > 0 ? turfs.slice(2, 6) : turfs.slice(0, 4);
      case 3: // Budget Friendly (<= 1200 or sorted by price)
        return [...turfs]
          .sort((a, b) => (Number(a.pricePerHour || 1000) - Number(b.pricePerHour || 1000)))
          .slice(0, 4);
      default:
        return turfs.slice(0, 4);
    }
  }, [turfs, activeCategory]);

  return (
    <section className="py-14 border-t border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-2">
              <Layers size={13} />
              <span>Explore Formats</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              Featured Categories
            </h2>
          </div>

          <Link
            to="/turfs"
            className="text-muted-foreground hover:text-emerald-500 transition-colors flex items-center gap-1 font-semibold text-sm self-start md:self-auto group"
          >
            <span>Explore all venues</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {categories.map((cat, index) => {
            const isActive = activeCategory === index;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(index)}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Venues Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {displayVenues.map((venue, index) => (
              <VenueCard key={venue._id || venue.id || index} venue={venue} variant="compact" />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CategorySection;

