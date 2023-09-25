import React from 'react';
import { motion } from 'framer-motion';
import { AboutMeAnimation } from '../helpers/AnimationVar';

const About = () => {
  return (
    <div className='md:w-[60%] w-full flex flex-col justify-center my-28 md:my-0 md:items-end items-center'>
      <motion.div variants={AboutMeAnimation} initial="hidden" animate="show" className="text-center mt-8">
        <p className="lg:text-3xl  md:text-2xl text-xl mb-8">Front-End developer</p>
        <p className="lg:text-base md:text-sm text-xs">Hey! I'm Alexander Burtyn. 👋</p>
        <p className='lg:text-base md:text-sm text-xs'>I'm currently living in Vienna, Austria.</p>
        <p className='lg:text-base md:text-sm text-xs'>I'm a student at the University of Vienna 🎓.</p>
      </motion.div>
    </div>
  );
};

export default About;
