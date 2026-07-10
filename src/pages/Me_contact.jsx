import { Suspense, useState } from 'react'
import Env from '../components/Env'
import { Canvas } from '@react-three/fiber'
import {  Float, PerformanceMonitor, PresentationControls, Scroll, ScrollControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import GBackBtn from '../components/GBackBtn'
import Me from '../components/Me'
import Contact from '../components/Contact'
import ScrollHint from '../components/ScrollHint'
import { Model } from '../3dmodels/Phone'
import {motion as motion3d} from 'framer-motion-3d'
import { moveAnimationPhone, pageVariants } from '../helpers/AnimationVar'


const Me_contact = () => {
    const [perfSucks, degrade] = useState(false)
    const navigate = useNavigate()

    const goBack = () => navigate("/")

  return (
    <motion.div className="h-full w-full" variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Canvas
          shadows
          dpr={[1, perfSucks ? 1 : 2]}
          eventPrefix="client"
          camera={{ position: [20, 0.9, 20], fov: 26 }}
        >
        <Suspense fallback={null}>
        <motion3d.group  position={[3, 1, 0]}
        variants={moveAnimationPhone}
        animate="show"
        initial="hidden">
        <Float rotationIntensity={3} floatingRange={[-.05, .05]} speed={1.1}>
          <PresentationControls
          global={false}
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
        </Suspense>
        <PerformanceMonitor onDecline={() => degrade(true)} />
        <color attach="background" args={['#f0f0f0']} />
          <Suspense fallback={null}>
          <group position={[0, -0.5, 0]} rotation={[0, -0.75, 0]}>
            <Env perfSucks={perfSucks} />
          </group>
          </Suspense>
          <ScrollControls  damping={.05} pages={1.3} html style={{ width: '100%'}}>
            <Scroll html style={{ width: '100%',}}>
            <div style={{ width: '100%' }}>
            <GBackBtn goBack={goBack} />
          </div>
          <div className="h-[100dvh]">
            <Me />
            <Contact />
          </div>
            <ScrollHint />
            </Scroll>
          </ScrollControls>
        </Canvas>
    </motion.div>
  )
}

export default Me_contact
