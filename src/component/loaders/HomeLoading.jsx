// components/loaders/HomeLoading.js
import Skeleton from '../Skeleton.jsx'; // Adjust path as needed

const HomeLoading = () => {
  return (
    <div className="w-full space-y-12 pb-12">
      {/* Hero Skeleton */}
      <div className="w-full h-[60vh] md:h-[80vh] relative bg-gray-100 flex items-center justify-center">
        <div className="container mx-auto px-4 space-y-4">
          <Skeleton className="h-12 w-3/4 md:w-1/2" />
          <Skeleton className="h-6 w-full md:w-1/3" />
        </div>
      </div>

      {/* Top Rated Section Skeleton */}
      <div className="container mx-auto px-4">
        <Skeleton className="h-8 w-48 mb-6 mx-auto" /> {/* Section Title */}
        
        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-64 w-full rounded-xl" /> {/* Image */}
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/3" /> {/* Title */}
                <Skeleton className="h-6 w-16" /> {/* Rating */}
              </div>
              <Skeleton className="h-4 w-full" /> {/* Address */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeLoading;