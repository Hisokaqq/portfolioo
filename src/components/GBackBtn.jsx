import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import Magnetic from './Magnetic'

const GBackBtn = ({ goBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } }}
      className="fixed top-3 left-3 z-50"
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
          className="go-back group flex items-center gap-2 rounded-full pl-3 pr-4 py-2 text-sm font-semibold"
        >
          <FiArrowLeft className="text-base transition-transform duration-300 ease-out group-hover:-translate-x-1" />
          <span className="transition-transform duration-300 ease-out group-hover:translate-x-0.5">Back</span>
        </button>
      </Magnetic>
    </motion.div>
  )
}

export default GBackBtn
