import { Star, Heart, MapPin } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate ,Link} from 'react-router-dom';

const VenueCard = ({ venue = {}, variant = 'default' }) => {

  console.log("in the venue section ",venue );
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate=useNavigate();

  // --- 1. SAFE DATA & DEFAULTS ---
  const venueName = venue?.name || "Unknown Venue";
  const venueAddress = venue?.vicinity || venue?.address?.fullAddress || "Location not available";
  const venueRating = venue?.averageRating || "10"; 

  const venuePrice = venue?.pricePerHour || 1200; 
  const isOpen = venue?.isActive; 
  const discount = venue?.discount || null;
  // console.log("each box photo url",venue.photos[0].photo_reference);
  console.log(venueName);
  
  // console.log(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${venue.photos[0].photo_reference}&key=AIzaSyAEYJ2S1w2sr-tZu3V2hiQIrQ8aIdmiqw4`);
  
     const clickhandler=()=>{
      console.log("button clciker");
     navigate(`/turf/${venue.place_id}`)
    console.log(venue);
    
      
     }
  
  // Photo Logic: Use Google Photo or Fallback
  const photoUrl = (venue?.images && venue.images.length > 0)
    // ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${venue.photos[0].photo_reference}&key=AIzaSyAEYJ2S1w2sr-tZu3V2hiQIrQ8aIdmiqw4`
    ?`${venue.images[0]}`
     :'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800'; 
  
   
  // Text Truncation
  const limit = 45;
  const isLong = (venueAddress?.length || 0) > limit;
  const displayText = expanded ? venueAddress : venueAddress?.slice(0, limit);

  // Animation
  const heartVariants = {
    idle: { scale: 1 },
    liked: { scale: [1, 1.4, 1], transition: { duration: 0.3 } }
  };

  // --- COMPACT VARIANT (Grid View) ---
  if (variant === 'compact') {
    return (
      <motion.div 
        whileHover={{ y: -5 }}
        className="group w-full bg-card rounded-2xl overflow-hidden border border-border/40 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      >
        {/* IMAGE SECTION - Fixed Height */}
        <div className="relative h-48 bg-muted overflow-hidden shrink-0">
          <img 
            src={photoUrl} 
            alt={venueName} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800'; }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
          
          {/* Rating Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-slate-900 shadow-sm">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span>{venueRating}</span>
          </div>

          {/* Like Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
          >
            <motion.div variants={heartVariants} animate={isFavorite ? "liked" : "idle"}>
              <Heart
                className={`transition-colors duration-300 ${
                  isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-400 hover:text-red-500'
                }`}
                size={18}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-4 flex flex-col flex-grow justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-2">
               <h3 className="font-bold text-base text-foreground line-clamp-1" title={venueName}>
                 {venueName}
               </h3>
               <span className="text-sm font-bold text-primary shrink-0">₹{venuePrice}</span>
            </div>
            
            <p className="text-xs text-muted-foreground flex items-start gap-1.5 min-h-[2.5rem] leading-relaxed">
              <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
             <span>
        {venueAddress}
      </span>
            </p>
          </div>

          <div className="pt-4 mt-2 border-t border-border/40">
            <Button 
              size="sm" 
              onClick={clickhandler}
              className={`w-full h-9 text-xs font-semibold shadow-sm transition-all ${
                !isOpen 
                  ? 'bg-slate-100 text-slate-400 hover:bg-slate-100 cursor-not-allowed' 
                  : 'hover:scale-[1.02] active:scale-[0.98]'
              }`}
              
            >
          <Link to={`/turf/${venue.place_id}`}>View More </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- DEFAULT (List) VARIANT ---
  // return (
  //   <motion.div 
  //     initial={{ opacity: 0, y: 10 }}
  //     whileInView={{ opacity: 1, y: 0 }}
  //     viewport={{ once: true }}
  //     whileHover={{ scale: 1.01 }}
  //     className="group w-full bg-card rounded-xl border border-border/40 p-3 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
  //   >
  //     {/* Image - Fixed Square Size */}
  //     {/* <div className="relative w-full sm:w-36 h-48 sm:h-36 shrink-0 rounded-lg overflow-hidden bg-muted">
  //       <img 
  //           src={photoUrl} 
  //           alt={venueName} 
  //           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
  //           onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800'; }}
  //       />
  //       {!isOpen && (
  //          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
  //            <span className="text-white text-xs font-bold px-2 py-1 border border-white/30 rounded-md">Closed</span>
  //          </div>
  //       )}
  //     </div> */}

  //     {/* Content */}
      
  //   </motion.div>
  // );
};

export default VenueCard;