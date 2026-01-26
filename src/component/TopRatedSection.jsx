import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import VenueCard from "./VenueCard";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60 },
  },
};

// 1. Accept the full list as a prop
const TopRatedSection = ({ turfs = [] }) => {
  console.log("idlid shosah sambhar chatni...",turfs);
  
  return (
    <section className="py-12 border-t border-border bg-background" id="venues">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold"
          >
            Top Rated Box
          </motion.h2>

          <motion.button
            whileHover="hover"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium"
          >
            <Link to="/turfs">See all</Link>
            <motion.span
              variants={{ hover: { x: 4 } }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChevronRight size={18} />
            </motion.span>
          </motion.button>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {turfs
            .filter((venue) => venue.averageRating > 4.5) // 2. FILTER: Only show rating > 4.5
            .slice(0, 3)                            // 3. LIMIT: Only show top 3 of those
            .map((venue, index) => (
              <motion.div key={venue._id || index} variants={itemVariants}>
                <VenueCard venue={venue} variant="compact" />
              </motion.div>
          ))}
          
          {/* Optional: Show message if no high-rated turfs found */}
          {turfs.filter(v => v.averageRating > 4.5).length === 0 && (
             <p className="col-span-3 text-center text-muted-foreground">
               No top-rated venues found nearby.
             </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TopRatedSection;