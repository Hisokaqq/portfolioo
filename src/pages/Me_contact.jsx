import React, { useState } from 'react'
import Env from '../components/Env'
import { Canvas } from '@react-three/fiber'
import {  Float, PerformanceMonitor, PresentationControls, Scroll, ScrollControls } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { useAnimation, motion } from 'framer-motion'
import GBackBtn from '../components/GBackBtn'
import Me from '../components/Me'
import Contact from '../components/Contact'
import { Model } from '../3dmodels/Phone'
import {motion as motion3d} from 'framer-motion-3d'
import { moveAnimationPhone } from '../helpers/AnimationVar'


const Me_contact = () => {
    const [perfSucks, degrade] = useState(false)
    const navigate = useNavigate()
    const control = useAnimation()
    const control2 = useAnimation()

    const goBack = () => {
      control.start({y:-20, transition: {duration: .3}})
      control2.start({opacity: 0, transition: {duration: .3}})
      setTimeout(() => {
        navigate("/");
      }, 300); 
      }
    
  return (
    <motion.div animate={control2} className="h-full w-full">
        <Canvas
          shadows
          dpr={[1, perfSucks ? 1.5 : 10]}
          eventPrefix="client"
          camera={{ position: [20, 0.9, 20], fov: 26 }}
        >
        <motion3d.group  position={[3, 1, 0]} 
        variants={moveAnimationPhone}
        animate="show"
        initial="hidden">
        <Float rotationIntensity={3} floatingRange={[-.05, .05]} speed={1.1}>
          <PresentationControls
          config={{ mass: 4, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          speed={5}
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}>
          <Model />
          </PresentationControls>
        </Float>
        </motion3d.group>
        <PerformanceMonitor onDecline={() => degrade(true)} />
        <color attach="background" args={['#f0f0f0']} />
          <group position={[0, -0.5, 0]} rotation={[0, -0.75, 0]}>
w          <Env perfSucks={perfSucks} />
          </group>
          <ScrollControls  damping={.4} pages={1.3} html style={{ width: '100%'}}>
            <Scroll html style={{ width: '100%',}}>
            <motion.div  style={{ width: '100%' }}> 
            <GBackBtn goBack={goBack} />
          </motion.div>
          <motion.div className="h-[100vh]"> 
            <Me />
            <Contact />
          </motion.div>
            </Scroll>
          </ScrollControls>
        </Canvas>
    </motion.div>
  )
}

export default Me_contact