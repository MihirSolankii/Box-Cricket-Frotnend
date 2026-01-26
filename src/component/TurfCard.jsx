import { Link } from 'react-router-dom';
import { MapPin, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/Components/ui/button';

const TurfCard = ({ turf }) => {

  console.log("turfcard page is ",turf);
  
  const [isLiked, setIsLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // --- 1. CRITICAL FIX: Safe Access with Optional Chaining (?.) ---
  // If opening_hours is undefined, this now returns undefined instead of crashing.
  // We double-negate (!!) or use ?? false to make it a strict boolean.
  const isOpen = turf?.isActive; 

  // --- 2. TEXT LOGIC ---
  const text = turf?.address?.fullAddress || "Location not available";
  const limit = 40;
  const isLong = text.length > limit;
  const displayText = expanded ? text : text.slice(0, limit);

  // --- 3. PHOTO LOGIC ---
  // Replace 'YOUR_API_KEY' with process.env.REACT_APP_GOOGLE_KEY or similar
  const photoUrl = (turf?.images && turf.images.length > 0)
    // ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${turf.images[0].photo_reference}&key=`
    ?`${turf.images[0]}`
    : 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800'; 

  // --- 4. ANIMATION VARIANT ---
  const heartVariants = {
    idle: { scale: 1 },
    liked: { scale: [1, 1.4, 1], transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }} // Performance: Only animate once when 50px in view
      whileHover={{ y: -5 }} 
      className="group w-full max-w-[340px] mx-auto bg-card rounded-xl overflow-hidden border border-border/40 hover:border-border shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-40 overflow-hidden bg-muted">
        <img
          src={photoUrl}
          alt={turf.name}
          loading="lazy" // Performance: Lazy load offscreen images
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!isOpen ? 'grayscale opacity-80' : ''}`}
        />
        
       

        {/* Heart Micro-interaction */}
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <motion.div variants={heartVariants} animate={isLiked ? "liked" : "idle"}>
            <Heart 
              size={18} 
              className={`transition-colors duration-300 ${
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
              }`} 
            />
          </motion.div>
        </motion.button>
      </div>
      
      {/* --- CONTENT SECTION --- */}
      <div className="p-3 space-y-2">
        
        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {turf.name}
          </h3>
          <div className="flex items-center gap-1 text-xs font-medium bg-muted/50 px-1.5 py-0.5 rounded-md shrink-0">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span>{turf.averageRating || "N/A"}</span>
            {/* <span className="text-muted-foreground hidden sm:inline">({turf.user_ratings_total || 0})</span> */}
          </div>
        </div>
        
        {/* Location with Read More */}
        <div className="flex items-start gap-1 text-muted-foreground text-xs min-h-[2rem]">
          <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
          <span>
            {displayText}
            {!expanded && isLong && "... "}
            
            {isLong && (
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigating to detail page
                  setExpanded(!expanded);
                }}
                className="text-primary ml-1 hover:underline font-medium"
              >
                {expanded ? "less" : "more"}
              </button>
            )}
          </span>
        </div>
        
        {/* Footer: Price & Button */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-1">
          <div>
            <span className="text-lg font-bold text-primary">₹{turf.pricePerHour}</span>
            <span className="text-muted-foreground text-xs font-medium">/hr</span>
          </div>
          
          <Button 
            asChild 
            size="sm" 
            disabled={!isOpen}
            className={`h-8 px-4 rounded-lg text-xs font-semibold shadow-sm ${
              !isOpen ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95 transition-transform'
            }`}
          >
            {/* Wrap Link in check to prevent clicking disabled buttons */}
            {isOpen ? (
              <Link to={`/turf/${turf?.googlePlaceId}`}>View More </Link>
            ) : (
              <span>Check slots</span>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TurfCard;