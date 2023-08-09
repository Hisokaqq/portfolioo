import React from 'react'
import { motion } from 'framer-motion-3d'

const GBackBtn = ({goBack}) => {

  return (
    <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition:{duration:1, delay: .5}}} className="fixed top-0 left-0">
        <div onClick={goBack} className="font-bold p-3 text-lg text-black hover:text-gray-400 duration-300">Go Back</div>
    </motion.div>
  )
}

export default GBackBtn