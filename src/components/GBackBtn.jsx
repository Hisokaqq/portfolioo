import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import Magnetic from './Magnetic'

// `onDark` forces a light-on-dark palette for placements over an always-dark
// surface (e.g. the black project image viewer), where the theme's foreground
// would be near-black and invisible in light mode.
const GBackBtn = ({ goBack, onDark = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } }}
      // High z-index so it stays above drei's <Scroll html> / <Html> layers
      // (which reach ~16.7M) when rendered as a sibling of the <Canvas>; sits
      // just below the cursor/toggle/wipe/morph overlays.
      // top/left offsets include the safe-area insets so the pill clears the
      // notch / rounded corners on modern phones.
      className="fixed z-[2147483642]"
      style={{
        top: 'calc(0.75rem + env(safe-area-inset-top, 0px))',
        left: 'calc(0.75rem + env(safe-area-inset-left, 0px))',
      }}
    >
      {/* Magnetic pulls the whole pill toward the cursor (gsap transforms the
          button), so the arrow/label movement lives on inner spans via
          group-hover to avoid clobbering that transform. */}
      <Magnetic>
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back"
          data-cursor
          className={`go-back${onDark ? ' go-back-dark' : ''} group flex items-center gap-2 rounded-full pl-3 pr-4 py-2 text-sm font-semibold`}
        >
          <FiArrowLeft className="text-base transition-transform duration-300 ease-out group-hover:-translate-x-1 group-active:-translate-x-1" />
          <span className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-active:translate-x-0.5">Back</span>
        </button>
      </Magnetic>
    </motion.div>
  )
}

export default GBackBtn
