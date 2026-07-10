import { motion } from 'framer-motion-3d'

const GBackBtn = ({goBack}) => {
  return (
    <div className="fixed top-0 left-0">
      <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition:{duration:1, delay: .5}}} className="fixed top-0 left-0 ">
        <button type="button" onClick={goBack} className="font-bold p-3 text-lg text-[var(--fg-strong)] hover:text-gray-500 duration-300 cursor-pointer bg-transparent border-0">Go Back</button>
      </motion.div>
      <div className=""></div>
    </div>
  )
}

export default GBackBtn