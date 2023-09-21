import React, { useRef } from 'react'
import Btn from './Btn'
import Magnetic from './Magnetic'
import { useScroll, useTransform, motion } from 'framer-motion';
import { useInView } from "react-intersection-observer";
const Contact = () => {
    
    const { ref, inView } = useInView({ triggerOnce: false, threshold: .1});
    
  return (
    <motion.div className="h-[100vh] w-full flex items-center justify-center relative">

        <div className='w-[70%]  '>
            <motion.h1  className="lg:text-4xl text-xl">Let's work together</motion.h1>
            <div className="relative">
                <div className='relative overflow-hidden'>
                    <motion.div animate={inView ? { opacity: 1,  x: 0 } : {  x: "-300%" }}
            transition={{ duration: .4,  }}  className='w-full h-[2px] bg-gray-400'></motion.div>
                </div>
                <motion.div ref={ref}
            animate={inView ? { opacity: 1,  x: 0 } : { opacity: 0,  x: -100 }}
            transition={{ duration: .4,  }}>
                <motion.div   className='w-32 h-32 absolute right-0 top-[-50%] translate-y-[-60%] '>
                <Btn >
                    <p>Get in touch</p>
                </Btn>
                </motion.div>
                </motion.div>
            </div>
            <motion.div className="flex-col lg:flex  gap-1 mt-5 w-full">
                <p className="hover:text-gray-500 transition-all duration-200 cursor-pointer text-sm">+43 660 7890132</p>
                <p className="hover:text-gray-500 transition-all duration-200 cursor-pointer text-sm">burtynoleksandr@gmail.com</p>
            </motion.div>
        </div>
        <div className="w-full h-10 absolute bottom-0 px-8 py-0 flex flex-row-reverse gap-5">
            <Magnetic >
                <p className="text-sm cursor-pointer" onClick={()=>window.open("https://www.instagram.com/hisokaxix/")}  >Instagram</p>
            </Magnetic>
            <Magnetic>
                <p className="text-sm cursor-pointer" onClick={()=>window.open("https://www.linkedin.com/in/alexandr-burtyn-397534266/")}  >Github</p>
            </Magnetic>
            <Magnetic>
                <p className="text-sm cursor-pointer" onClick={()=>window.open("https://github.com/Hisokaqq")}  > linkedin</p>
            </Magnetic>
        </div>

    </motion.div>
  )
}

export default Contact