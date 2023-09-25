import React from 'react'
import { motion } from "framer-motion";
import { SkilAnimation, SkilContAnimation, SkilNameAnimation } from '../helpers/AnimationVar';
import Magnetic from './Magnetic';

const Skills = {
  Html: "100%",
  React: "90%",
  Django: "90%",
  "Framer Motion + Gsap": "80%",
  "Three Fiber": "70%",
  Next: "60%",
  FastApi: "40%",
  Blender: "40%"
};

const Languages = {
  English: "80%",
  German: "80%",
  Russian: "100%",
  Ukrainian: "100%"
};

const Skils = () => {
  return (
    <motion.div className="xl:w-[30%] lg:w-[40%] md:w-[50%] w-[100%] " variants={SkilContAnimation} initial="hidden" animate="show">
        {Object.entries(Skills).map(([skill, percent]) => (
          <div key={skill} className="mb-4">
            <Magnetic>
            <motion.p variants={SkilNameAnimation} className="text-gray-500 w-fit text-sm lg:text-base">{skill}</motion.p>
            </Magnetic>
            <motion.div variants={SkilNameAnimation} className="w-full h-1 bg-gray-200 relative rounded-md overflow-hidden">
              <motion.div variants={SkilAnimation}
                className="h-2 bg-red-400 origin-left"
                style={{ width: percent }}
              ></motion.div>
            </motion.div>
          </div>
        ))}
        <motion.div variants={SkilAnimation} className='w-full h-1 bg-red-400 rounded-md my-10'></motion.div>
        {Object.entries(Languages).map(([language, percent]) => (
          <div key={language} className="mb-4">
            <Magnetic>
            <motion.p variants={SkilNameAnimation} className="text-gray-500 w-fit text-sm lg:text-base">{language}</motion.p>
            </Magnetic>
            <motion.div variants={SkilNameAnimation} className="w-full h-1 bg-gray-200 relative rounded-md overflow-hidden">
              <motion.div variants={SkilAnimation}
                className="h-2 bg-red-400 origin-left"
                style={{ width: percent }}
              ></motion.div>
            </motion.div>
          </div>
        ))}
        </motion.div>
  )
}

export default Skils