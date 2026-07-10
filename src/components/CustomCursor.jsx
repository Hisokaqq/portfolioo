import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Elements that should trigger the "hover" (grown) cursor state.
const INTERACTIVE = 'a, button, [role="button"], input, textarea, label, [data-cursor]';

/**
 * A framer-motion custom cursor:
 *  - a small dot that tracks the pointer tightly,
 *  - an outer ring that follows with a springy lag,
 *  - grows over interactive things (buttons, links, copy rows, 3D thumbnails),
 *  - presses in on mousedown.
 * Uses mix-blend-mode: difference so it inverts against any background and is
 * always visible (white hero, black project viewer, etc.). Only enabled on
 * devices that actually have a fine pointer (skipped on touch).
 */
const CustomCursor = () => {
  const [hovered, setHovered] = useState(false);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  // Raw pointer position.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Ring lags behind with a soft spring; dot is much snappier.
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.6 });
  const dotX = useSpring(x, { stiffness: 900, damping: 40 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40 });

  useEffect(() => {
    // Skip entirely on touch / coarse-pointer devices.
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return;

    setEnabled(true);
    document.body.classList.add('custom-cursor-active');

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target;
      const interactive =
        !!(t && t.closest && t.closest(INTERACTIVE)) ||
        // 3D thumbnails / anything that set the body cursor to pointer.
        document.body.style.cursor === 'pointer';
      setHovered(interactive);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: down ? 0.75 : hovered ? 2.6 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY }}
        animate={{
          scale: hovered ? 0 : down ? 0.6 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
    </>
  );
};

export default CustomCursor;
