import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../helpers/ThemeContext';

/**
 * Dark / light theme toggle.
 *  - Animated sun <-> moon icon (framer-motion).
 *  - A circular clip-path "wipe" in the target background colour expands from
 *    the click point, we flip the theme underneath it while it fully covers the
 *    screen, then remove it — so the swap of the (WebGL) scene is hidden and the
 *    reveal is seamless (the overlay colour matches the new background).
 *  - Respects prefers-reduced-motion (instant toggle, no wipe).
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [wipe, setWipe] = useState(null); // { x, y, r, color } | null

  const handleClick = (e) => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      toggleTheme();
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    // Radius large enough to reach the farthest corner from the click point.
    const r = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    // Overlay paints the colour we are switching *to*.
    const color = isDark ? '#f0f0f0' : '#161226';
    setWipe({ x, y, r, color });
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={handleClick}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        aria-pressed={isDark}
        data-cursor
        className="theme-toggle"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ y: -18, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 18, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ display: 'flex' }}
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {wipe && (
          <motion.div
            className="theme-wipe"
            style={{ background: wipe.color }}
            initial={{ clipPath: `circle(0px at ${wipe.x}px ${wipe.y}px)` }}
            animate={{ clipPath: `circle(${wipe.r}px at ${wipe.x}px ${wipe.y}px)` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => {
              // Screen is fully covered by the target colour: flip the theme,
              // then hold the (opaque) overlay briefly so the scene-background
              // effect commits before we lift it — otherwise there's a 1-frame
              // flash of the old background.
              toggleTheme();
              setTimeout(() => setWipe(null), 120);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeToggle;
