import { motion } from 'framer-motion';
import { FiMousePointer } from 'react-icons/fi';
import { useCursor } from '../helpers/CursorContext';

/**
 * Standalone toggle for the custom cursor, sitting just below the theme toggle
 * on the middle-right of the screen. Mirrors the same command available in the
 * ⌘K palette.
 */
const CursorToggle = () => {
  const { cursorEnabled, toggleCursor } = useCursor();

  return (
    <motion.button
      type="button"
      onClick={toggleCursor}
      aria-label={cursorEnabled ? 'Disable custom cursor' : 'Enable custom cursor'}
      aria-pressed={cursorEnabled}
      data-cursor
      className="theme-toggle cursor-toggle"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <span className={`cursor-toggle-icon${cursorEnabled ? '' : ' is-off'}`}>
        <FiMousePointer size={18} />
      </span>
    </motion.button>
  );
};

export default CursorToggle;
