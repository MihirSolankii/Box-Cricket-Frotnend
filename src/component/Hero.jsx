import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import heroImage from '@/assets/hero-cricket.jpg';

const Hero = () => {
  
  const [count, setCount] = useState(0);
  useEffect(() => {
    const controls = setTimeout(() => {
      if (count < 500) setCount(prev => Math.min(prev + 12, 500));
    }, 30);
    return () => clearTimeout(controls);
  }, [count]);

  // --- 2. Magnetic Button Logic ---
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 150 };
  const magneticX = useSpring(btnX, springConfig);
  const magneticY = useSpring(btnY, springConfig);

  const handleButtonMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    btnX.set((clientX - (left + width / 2)) * 0.3);
    btnY.set((clientY - (top + height / 2)) * 0.3);
  };

  // --- 3. Image Tilt Logic (Your existing logic refined) ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section className="py-12 md:py-20 overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        
          <div className="space-y-6 ml-15  ">
         
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: 80, rotate: 5 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
              >
                Find. Play. Win.
                <br />
                <span className="text-green-500">Book your box now</span>
              </motion.h1>
            </div>

            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-md"
            >
              Discover the best cricket boxes near you, split payments with friends, and track your matches.
            </motion.p>

          
            <motion.div
              onMouseMove={handleButtonMove}
              onMouseLeave={() => { btnX.set(0); btnY.set(0); }}
              style={{ x: magneticX, y: magneticY }}
              className="inline-block"
            >
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden bg-green-500 text-white px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2 group transition-shadow hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]"
              >
                <span className="relative z-10 flex items-center gap-2" onClick={() => window.location.href = '/turfs'}>
                  Explore Now
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <ChevronRight size={20} />
                  </motion.span>
                </span>
              
                <motion.div 
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  className="absolute inset-0 bg-slate-900 z-0"
                  transition={{ type: "spring", damping: 25 }}
                />
              </motion.button>
            </motion.div>
          </div>

         
          <motion.div 
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative perspective-1000"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="aspect-video rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={heroImage}
                alt="Cricket stadium"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-xl hidden md:block border border-gray-100 z-20"
            >
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Venues</p>
              <p className="text-3xl font-black text-green-600">
                {count}+
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;