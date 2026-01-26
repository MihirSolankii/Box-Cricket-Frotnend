// components/Skeleton.js
const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-300 rounded-md ${className}`}></div>
  );
};

export default Skeleton;