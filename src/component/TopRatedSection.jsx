import { ChevronRight, Star, Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import VenueCard from "./VenueCard";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
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

// Accept the turfs list as a prop and display the Top 5 based on ratings
const TopRatedSection = ({ turfs = [] }) => {
  // Sort descending by averageRating or rating, and pick the top 5
  const top5Turfs = [...turfs]
    .filter((venue) => venue && (venue.name || venue.address))
    .sort((a, b) => {
      const ratingA = Number(a?.averageRating ?? a?.rating ?? 0);
      const ratingB = Number(b?.averageRating ?? b?.rating ?? 0);
      return ratingB - ratingA;
    })
    .slice(0, 5);

  const getRankBadgeStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-amber-500 text-slate-950 shadow-amber-500/30";
      case 1:
        return "bg-slate-200 text-slate-900 shadow-slate-300/30";
      case 2:
        return "bg-amber-700 text-amber-50 shadow-amber-700/30";
      default:
        return "bg-emerald-600 text-white shadow-emerald-600/30";
    }
  };

  return (
    <section className="py-14 border-t border-border bg-gradient-to-b from-background to-muted/20" id="venues">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-2">
              <Sparkles size={13} />
              <span>Players' Choice</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight"
            >
              Top 5 Rated Box Venues
            </motion.h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Handpicked arenas with highest player satisfaction, floodlights, and premium turf
            </p>
          </div>

          <motion.div whileHover="hover">
            <Link
              to="/turfs"
              className="text-muted-foreground hover:text-emerald-500 transition-colors flex items-center gap-1.5 font-semibold text-sm group"
            >
              <span>See all {turfs.length > 0 ? `(${turfs.length})` : "turfs"}</span>
              <motion.span
                variants={{ hover: { x: 4 } }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ChevronRight size={18} />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Cards Grid: 5 columns on xl, 3 on md/lg, 2 on sm, 1 on mobile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-5"
        >
          {top5Turfs.map((venue, index) => (
            <motion.div
              key={venue._id || venue.id || index}
              variants={itemVariants}
              className="relative flex flex-col h-full"
            >
              {/* Top 5 Rank Tag */}
              <div
                className={`absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 shadow-md ${getRankBadgeStyle(
                  index
                )}`}
              >
                <Trophy size={11} className="shrink-0" />
                <span>#{index + 1} Rated</span>
              </div>

              <VenueCard venue={venue} variant="compact" />
            </motion.div>
          ))}

          {/* Fallback if no venues */}
          {top5Turfs.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-2xl border border-dashed border-border p-8">
              <Star className="mx-auto mb-2 text-amber-400 opacity-60" size={32} />
              <p className="font-semibold text-foreground">No rated venues currently available</p>
              <p className="text-xs text-muted-foreground mt-1">Check back shortly as new box cricket turfs are added!</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TopRatedSection;