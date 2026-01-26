import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

const CustomCursor = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [trail, setTrail] = useState([]);
  const [ripples, setRipples] = useState([]); 

  // --- PHYSICS ---
  const springConfig = { damping: 30, stiffness: 150, mass: 0.8 }; 
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Rotation logic 
  const rotateX = useTransform(cursorY, (latest) => latest * 0.5);
  const rotateY = useTransform(cursorX, (latest) => latest * 0.5);
  const rotateCombined = useTransform([rotateX, rotateY], ([rx, ry]) => `${rx + ry}deg`);

  // --- CURSOR VISIBILITY LOGIC ---
  useEffect(() => {
    // When clicking, we want the system cursor back. 
    // We add a class to body to handle this via CSS.
    if (isClicked) {
      document.body.classList.add("clicking-active");
    } else {
      document.body.classList.remove("clicking-active");
    }
  }, [isClicked]);

  useEffect(() => {
    const moveMouse = (e) => {
      mouseX.set(e.clientX - 12);
      mouseY.set(e.clientY - 12);

      // Sparkle Trail
      if (Math.random() > 0.8 && !isClicked) { // Only sparkle if NOT clicking (optional preference)
        addSparkle(e.clientX, e.clientY);
      }
    };

    const mouseDown = (e) => {
      setIsClicked(true);
      
      // Keep the Shockwave effect for feedback
      const newRipple = {
        id: Date.now(),
        x: e.clientX - 12,
        y: e.clientY - 12,
      };
      setRipples((prev) => [...prev, newRipple]);

      // Keep the Burst effect
      for (let i = 0; i < 5; i++) {
        addSparkle(e.clientX, e.clientY, true);
      }
    };

    const mouseUp = () => setIsClicked(false);

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [mouseX, mouseY, isClicked]);

  const addSparkle = (x, y, isBurst = false) => {
    const newSparkle = {
      id: Date.now() + Math.random(),
      x: x,
      y: y,
      driftX: (Math.random() - 0.5) * (isBurst ? 50 : 20),
      driftY: (Math.random() - 0.5) * (isBurst ? 50 : 20),
    };
    setTrail((prev) => [...prev.slice(-15), newSparkle]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => prev.filter(s => Date.now() - s.id < 800));
      setRipples((prev) => prev.filter(r => Date.now() - r.id < 600));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* SHOCKWAVES (Still visible on click for feedback) */}
      <div className="pointer-events-none fixed inset-0 z-9998 overflow-hidden">
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              initial={{ opacity: 0.8, scale: 0.5, borderWidth: "4px" }}
              animate={{ opacity: 0, scale: 2.5, borderWidth: "0px" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute w-6 h-6 rounded-full border-white"
              style={{ left: ripple.x, top: ripple.y }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* SPARKLE TRAIL */}
      <div className="pointer-events-none fixed inset-0 z-9998 overflow-hidden">
        <AnimatePresence>
          {trail.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              initial={{ opacity: 1, scale: 0.4 }}
              animate={{ 
                opacity: 0, 
                scale: 0, 
                x: sparkle.driftX, 
                y: sparkle.driftY + 20, 
                rotate: 180 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute w-4 h-4"
              style={{ left: sparkle.x, top: sparkle.y }}
            >
              <svg viewBox="0 0 24 24" fill="gold" className="drop-shadow-md">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- THE CRICKET BALL --- */}
      <motion.div
        style={{
          translateX: cursorX,
          translateY: cursorY,
        }}
        // ANIMATION CHANGE: Scale to 0 when clicked
        animate={{
          scale: isClicked ? 0 : 1,
          opacity: isClicked ? 0 : 1,
        }}
        transition={{ duration: 0.1 }} // Fast vanish
        className="fixed top-0 left-0 pointer-events-none z-9999"
      >
        <motion.div 
          style={{ rotate: rotateCombined }}
          className="w-6 h-6 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)] relative overflow-hidden"
        >
          <div className="absolute inset-0 w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,#ff6b6b,#cc0000,#800000)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2px h-full border-l border-r border-dashed border-white/60 bg-white/20 blur-[0.5px]" />
          <div className="absolute top-1 left-1 w-2.5 h-1.5 bg-white/50 rounded-full blur-[1px] rotate-45deg" />
        </motion.div>
      </motion.div>
    </>
  );
};

export default CustomCursor;