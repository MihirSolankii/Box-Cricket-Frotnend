import { Link } from 'react-router-dom';
import { MapPin, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';


const TurfCards = ({ turf }) => {
   const { id, name, location, price, rating, reviews, image, isAvailable } = turf;
   
  const [isLiked, setIsLiked] = useState(false);
  
  // Heart Animation Variant
  const heartVariants = {
    idle: { scale: 1 },
    liked: { scale: [1, 1.4, 1], transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }} // Gentle Hover Lift
      className="group w-full max-w-[340px] mx-auto bg-card rounded-xl overflow-hidden border border-border/40 hover:border-border shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* --- IMAGE SECTION (Medium Height h-40) --- */}
      <div className="relative h-40 overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!isAvailable ? 'grayscale opacity-80' : ''}`}
        />
        
        {/* Availability Badge (Glassmorphism) */}
        <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm border border-white/10 ${isAvailable? 
             'bg-primary/90 text-primary-foreground' 
            : 'bg-muted/90 text-muted-foreground'
        }`}>
          { isAvailable ? 'Available' : 'Fully Booked'}
        </div>

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
            {name}
          </h3>
          <div className="flex items-center gap-1 text-xs font-medium bg-muted/50 px-1.5 py-0.5 rounded-md shrink-0">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span>{rating}</span>
            <span className="text-muted-foreground hidden sm:inline">({reviews})</span>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>
        
        {/* Footer: Price & Button */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-1">
          <div>
            <span className="text-lg font-bold text-primary">₹{price}</span>
            <span className="text-muted-foreground text-xs font-medium">/hr</span>
          </div>
          
          <Button 
            asChild 
            size="sm" 
            disabled={!isAvailable}
            className={`h-8 px-4 rounded-lg text-xs font-semibold shadow-sm ${!isAvailable? 'opacity-70' : 'hover:scale-105 active:scale-95 transition-transform'}`}
          >
            <Link to={`/turf/${id}`}>
              {isAvailable ? 'Book Now' : 'Check slots'}
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TurfCards;