import React, { useState } from 'react'
import Env from '../components/Env'
import { Canvas } from '@react-three/fiber'
import { Html, PerformanceMonitor, Scroll, ScrollControls } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { useAnimation, motion } from 'framer-motion'
import GBackBtn from '../components/GBackBtn'

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
    <div className="h-full w-full">
        <Canvas
          shadows
          dpr={[1, perfSucks ? 1.5 : 10]}
          eventPrefix="client"
          camera={{ position: [20, 0.9, 20], fov: 26 }}
        >
        <PerformanceMonitor onDecline={() => degrade(true)} />
        <color attach="background" args={['#f0f0f0']} />
          <group position={[0, -0.5, 0]} rotation={[0, -0.75, 0]}>
w          <Env perfSucks={perfSucks} />
          </group>
          <Html fullscreen  style={{ position: "fixed", left:0, top:0, transform: "translate(-50%, -50%)" }}>
          <motion.div animate={control2} style={{ width: '100%' }}> 
            <GBackBtn goBack={goBack} />
          </motion.div>


          </Html>

          <ScrollControls damping={.2} pages={5} html style={{ width: '50%', left: "50%"}}>
            <Scroll html style={{ width: '50%',}}></Scroll>
          </ScrollControls>
        </Canvas>
    </div>
  )
}

export default Me_contact