import React, { useState } from 'react'
import {motion, useAnimation} from 'framer-motion'
import { firstnameAnimation, parentAnimation, simpleAnimation } from '../helpers/AnimationVar'
import { Link } from 'react-router-dom'

const variants = {
    open: { opacity: 1 },
    closed: { opacity: 0, transition: { duration: .3 } },
  }
const HtmlPart = ({isOpen, setIsOpen, goinTo}) => {
    const nav_anim = (to) => {
        setIsOpen(false);
        setTimeout(() => {
          goinTo(to);
        }, 1300); 
      };
      
  return (
    <div className="w-[100%] h-[100vh] z-50 fixed top-0 left-0 overflow-hidden" >
    
    <motion.div   animate={isOpen ? "open"  : "closed"}
    variants={variants}>
        <motion.div variants={parentAnimation} initial="hidden" animate="show" exit="exit" className="  p-2 sm:p-6 md:p-8 absolute flex flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:w-[25rem] md:w-[20rem] sm:w-[15rem] w-[8rem] 2xl:text-7xl lg:text-6xl md:text-5xl sm:text-4xl text-xl">
            <div  className="flex w-full justify-between">
            <div className="overflow-hidden"><motion.h1 variants={firstnameAnimation}   className="title " >A</motion.h1></div>
            <div className="overflow-hidden"><motion.h1 variants={firstnameAnimation}   className="title " >L</motion.h1></div>
            <div className="overflow-hidden"><motion.h1 variants={firstnameAnimation}   className="title " >E</motion.h1></div>
            </div>
            <div className="text-center w-full" >
                <div className="overflow-hidden"> <motion.h1 variants={firstnameAnimation}   className="title " >X</motion.h1></div>
            </div>
        
        </motion.div>
        <motion.div onClick={()=>nav_anim("/me")} variants={simpleAnimation} initial="hidden" animate="show"  className="explore absolute top-0 right-0  p-2 sm:p-6 md:p-8 w-fit flex flex-col  gap-2 sm:text-sm text-xs">
            <div className="overflow-hidden flex justify-between gap-1 items-end"><h3 className="name text-stone-950">Get in Touch!</h3><div className="line w-12 lg:w-16 h-[2px]  bg-[#3e3e3d] " /><h3 className="name text-right">I'm a</h3></div>
            <div className="overflow-hidden text-right"><h3 className='name '>software developer</h3></div>
            <div className="line w-full h-[2px]  bg-[#3e3e3d]" />
        </motion.div>

        <motion.div variants={simpleAnimation} initial="hidden" animate="show" className="absolute left-0  bottom-0 p-2 sm:p-6 md:p-8  w-fit ">
            <p className="md:text-sm lg:text-base text-xs mb-6">Passionate developer proficient <br/> in <span className="text-teal-500">Django</span>, <span className="text-cyan-500">React.js</span>, <span className="text-stone-950">Next.js</span>, and <span className="text-stone-950">Three.js</span>.</p>
            <div className="explore w-fit">
                <motion.h3 onClick={()=>nav_anim("/projects")}  className="text-sm md:text-base lg:text-lg w-fit py-2">Take a look at my Projects</motion.h3>
                <div className="line w-full h-[2px]  bg-[#3e3e3d]" />
            </div>
        </motion.div>

        <motion.div variants={parentAnimation} initial="hidden" animate="show" className=" p-2 sm:p-6 md:p-8 absolute right-0 bottom-0  flex flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-8 2xl:text-7xl lg:text-6xl md:text-5xl sm:text-4xl text-xl">
            <div className="flex w-full">
               <div className="overflow-hidden"> <motion.h1 variants={firstnameAnimation}  className="title " >B</motion.h1></div>
               <div className="overflow-hidden"> <motion.h1 variants={firstnameAnimation}  className="title " >U</motion.h1></div>
               <div className="overflow-hidden"> <motion.h1 variants={firstnameAnimation}  className="title " >R</motion.h1></div>
               <div className="overflow-hidden"> <h1 className="title  text-transparent" >T</h1></div>
               <div className="overflow-hidden"> <h1 className="title  text-transparent" >Y</h1></div>
               <div className="overflow-hidden"> <h1 className="title  text-transparent" >N</h1></div>
            </div>
            
            <div className="flex w-fit self-end">
               <div className="overflow-hidden"> <motion.h1 variants={firstnameAnimation}  className="title " >T</motion.h1></div>
               <div className="overflow-hidden"> <motion.h1 variants={firstnameAnimation}  className="title " >Y</motion.h1></div>
               <div className="overflow-hidden"> <motion.h1 variants={firstnameAnimation}  className="title " >N</motion.h1></div>
            </div>
        </motion.div>
    </motion.div>
    </div>
  )
}

export default HtmlPart