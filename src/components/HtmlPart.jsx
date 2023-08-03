import React, { useState } from 'react'
import {motion, useAnimation} from 'framer-motion'
import { firstnameAnimation, parentAnimation, simpleAnimation } from '../helpers/AnimationVar'

const variants = {
    open: { opacity: 1 },
    closed: { opacity: 0, transition: { duration: 1.5 } },
  }
const HtmlPart = ({isOpen, setIsOpen}) => {
  return (
    <div className="w-[100%] h-[100vh] z-20 fixed top-0 left-0 overflow-hidden">
      

    <motion.div   animate={isOpen ? "open"  : "closed"}
    variants={variants}>
        <motion.div variants={parentAnimation} initial="hidden" animate="show" className="  p-3 sm:p-7 md:p-10 absolute flex flex-col gap-3 sm:gap-5 md:gap-7 lg:gap-10 xl:w-[35rem] md:w-[30rem] sm:w-[20rem] w-[10rem] 2xl:text-9xl lg:text-8xl md:text-7xl sm:text-6xl text-2xl">
            <div  className="flex w-full justify-between">
            <div className="overflow-hidden"><motion.h1 variants={firstnameAnimation}   className="title " >A</motion.h1></div>
            <div className="overflow-hidden"><motion.h1 variants={firstnameAnimation}   className="title " >L</motion.h1></div>
            <div className="overflow-hidden"><motion.h1 variants={firstnameAnimation}   className="title " >E</motion.h1></div>
            </div>
            <div className="text-center w-full" >
                <div className="overflow-hidden"> <motion.h1 variants={firstnameAnimation}   className="title " >X</motion.h1></div>
            </div>
        
        </motion.div>
        <motion.div variants={simpleAnimation} initial="hidden" animate="show"  className="explore absolute top-0 right-0  p-3 sm:p-7 md:p-10 w-fit flex flex-col  gap-2 sm:text-lg text-xs">
            <div className="overflow-hidden flex justify-between gap-3 items-end"><h3 className="name text-stone-950">Get in Touch!</h3><div className="line w-20 h-[3px]  bg-[#3e3e3d] " /><h3 className="name text-right">I'm a</h3></div>
            <div className="overflow-hidden text-right"><h3 className='name '>software developer</h3></div>
            <div className="line w-full h-[3px]  bg-[#3e3e3d]" />
        </motion.div>

        <motion.div variants={simpleAnimation} initial="hidden" animate="show" className="absolute left-[10%] bottom-48 w-96 ">
            <p className="md:text-lg lg:text-xl text-sm mb-8">Passionate developer proficient in <span className="text-teal-500">Django</span>, <span className="text-cyan-500">React.js</span>, <span className="text-stone-950">Next.js</span>, and <span className="text-stone-950">Three.js</span>.</p>
            <div className="explore w-fit">
                <motion.h3 onClick={()=>{setIsOpen(false)}}  className="text-base md:text-xl lg:text-2xl w-fit py-3">Find Out More & Get in Touch</motion.h3>
                <div className="line w-full h-[3px]  bg-[#3e3e3d]" />
            </div>
        </motion.div>

        <motion.div variants={parentAnimation} initial="hidden" animate="show" className=" p-3 sm:p-7 md:p-10 absolute right-0 bottom-0  flex flex-col gap-3 sm:gap-5 md:gap-7 lg:gap-10 2xl:text-9xl lg:text-8xl md:text-7xl sm:text-6xl text-2xl">
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