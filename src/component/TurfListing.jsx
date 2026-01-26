import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import TurfCard from './TurfCard';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Accept 'turfs' as a prop
const TurfListing = ({ turfs = [] }) => {  
  
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        
        <div className="flex items-center justify-between mb-8">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-foreground"
          >
            Explore Turfs
          </motion.h2>
          
          <motion.button 
            whileHover="hover"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 font-medium group text-sm md:text-base">
            <Link to={`/turfs`}>See more</Link>
            <motion.span
              variants={{ hover: { x: 4 } }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChevronRight size={18} />
            </motion.span>
          </motion.button>
        </div>

        {/* Use the 'turfs' prop directly */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {turfs.slice(0, 8).map((turf) => (
            <TurfCard key={turf.id || turf._id} turf={turf} />
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default TurfListing;