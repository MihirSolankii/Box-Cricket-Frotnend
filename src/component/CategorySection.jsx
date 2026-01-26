import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import VenueCard from './VenueCard';

const categories = ['Cricket Box', 'Night Cricket', '360° Box'];

const categoryVenues = [
  { id: 1, name: 'Box Arena A1', address: 'Malad, Mumbai', price: '₹500/hour', rating: 4.5 },
  { id: 2, name: 'Night Warriors', address: 'Goregaon, Mumbai', price: '₹700/hour', rating: 4.3 },
  { id: 3, name: 'Premium Box', address: 'Juhu, Mumbai', price: '₹900/hour', rating: 4.7 },
  { id: 4, name: 'Cricket Hub', address: 'Borivali, Mumbai', price: '₹550/hour', rating: 4.4 },
];

const CategorySection = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 md:gap-8 overflow-x-auto pb-2">
            {categories.map((cat, index) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(index)}
                className={`text-lg md:text-xl font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === index
                    ? 'text-foreground underline underline-offset-8 decoration-2 decoration-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 font-medium hidden sm:flex">
            See all
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categoryVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
