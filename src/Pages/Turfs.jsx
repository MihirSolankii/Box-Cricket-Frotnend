import { useState, useEffect } from 'react';
import { Search, MapPin, ChevronLeft, Loader2 } from 'lucide-react';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import TurfCard from '@/component/TurfCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from "axios";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';

// --- Skeleton Component for Loading State ---
const TurfSkeleton = () => (
  <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm h-[320px] animate-pulse">
    <div className="h-48 bg-muted" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="flex justify-between mt-4">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-8 bg-muted rounded w-1/4" />
      </div>
    </div>
  </div>
);

const Turfs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [turfbook, setTurfbook] = useState([]);
  const [loading, setLoading] = useState(true); // Added Loading State

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${routes.getData}`, {
        lat: "22.2756864",
        lng: "70.7756032",
      });
      // Safety check to ensure array exists
      console.log(response);
      
      setTurfbook(response.data.boxes || []);
    } catch (error) {
      console.error("Error fetching turfs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTurfs = turfbook.filter((turf) => {
    // Safety checks using optional chaining
    const nameMatch = turf?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const vicinityMatch = turf?.vicinity?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || vicinityMatch;

    const matchesPrice = priceFilter === 'all' ||
      (priceFilter === 'low' && turf.pricePerHour <= 1000) ||
      (priceFilter === 'medium' && turf.pricePerHour > 1000 && turf.pricePerHour <= 1500) ||
      (priceFilter === 'high' && turf.pricePerHour > 1500);

    const matchesAvailability = availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && turf.isActive) ||
      (availabilityFilter === 'booked' && !turf.isActive);

    return matchesSearch && matchesPrice && matchesAvailability;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* <Header /> */}
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          {/* --- TOP SECTION --- */}
          <div className="mb-8">
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="group mb-6 flex items-center gap-2 text-muted-foreground hover:text-primary font-medium transition-colors"
            >
              <div className="p-1 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                 <ChevronLeft className="h-4 w-4" />
              </div>
              Back to Home
            </motion.button>
         
          </div>

          {/* --- SEARCH & FILTERS BAR --- */}
          <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-md border border-border/60 shadow-lg shadow-black/5 rounded-2xl p-4 mb-10">
            <div className="flex flex-col lg:flex-row gap-4">
              
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                <Input
                  placeholder="Search venues, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-11 bg-background border-muted-foreground/20 focus-visible:ring-primary/20 transition-all"
                />
              </div>
              
              {/* Filters Container */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] h-11 bg-background border-muted-foreground/20">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    <SelectItem value="low">Under ₹1000</SelectItem>
                    <SelectItem value="medium">₹1000 - ₹1500</SelectItem>
                    <SelectItem value="high">Above ₹1500</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] h-11 bg-background border-muted-foreground/20">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Status</SelectItem>
                    <SelectItem value="available">Open Now</SelectItem>
                    <SelectItem value="booked">Closed / Booked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

        
          {loading ? (
            // LOADING SKELETON GRID
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <TurfSkeleton key={item} />
              ))}
            </div>
          ) : filteredTurfs.length > 0 ? (
            // DATA GRID
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              {filteredTurfs.map((turf, index) => (
                <TurfCard key={index} turf={turf} />
              ))}
            </motion.div>
          ) : (
            // EMPTY STATE
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border rounded-3xl bg-card/50"
            >
              <div className="bg-muted p-4 rounded-full mb-4">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No turfs found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                We couldn't find any turfs matching your criteria. Try changing your filters or search for a different location.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setPriceFilter('all');
                  setAvailabilityFilter('all');
                }}
                className="font-medium"
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Turfs; 