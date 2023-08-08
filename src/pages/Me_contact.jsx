import React, { useState } from 'react'
import Env from '../components/Env'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'

const Me_contact = () => {
    const [perfSucks, degrade] = useState(false)

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
        </Canvas>
    </div>
  )
}

export default Me_contact