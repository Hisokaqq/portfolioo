import { useState } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';

// A "scroll ↓" cue rendered inside a drei <Scroll html> region. It fades in
// shortly after load and disappears the moment the user starts scrolling, so
// visitors know there's more content below the first screen.
const ScrollHint = ({ label = 'scroll' }) => {
  const scroll = useScroll();
  const [hidden, setHidden] = useState(false);

  useFrame(() => {
    if (!hidden && scroll.offset > 0.02) setHidden(true);
  });

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1, duration: 0.6 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed left-1/2 bottom-6 -translate-x-1/2 flex flex-col items-center gap-1 text-xs tracking-wide pointer-events-none z-40"
        >
          <span>{label}</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollHint;
