import { Html, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { useState } from 'react'
import Env from '../components/Env'
import HtmlPart from '../components/HtmlPart'
import { useNavigate } from 'react-router-dom'
import Buble from '../components/Buble'

const Experience = () => {
    const [perfSucks, degrade] = useState(false)
    const [isOpen, setIsOpen] = useState(true)
    const navigate = useNavigate()
    const goinTo = (to) => {
      navigate(to)
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
          <Html fullscreen  style={{ position: "absolute", left:0, top:0, transform: "translate(-50%, -50%)" }}>
            <HtmlPart  isOpen={isOpen} setIsOpen={setIsOpen} goinTo={goinTo}/>
          </Html>
          <Buble  isOpen={isOpen}  />
          
        </Canvas>
        
      </div>
  )
}

export default Experience