import { Html, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import Env from '../components/Env'
import HtmlPart from '../components/HtmlPart'
import { useNavigate } from 'react-router-dom'
import Bubble from '../3dmodels/Bubble'
import { pageVariants } from '../helpers/AnimationVar'
import { useTheme } from '../helpers/ThemeContext'

const Experience = () => {
    const [perfSucks, degrade] = useState(false)
    const [isOpen, setIsOpen] = useState(true)
    const { theme } = useTheme()
    const navigate = useNavigate()
    const navigateTo = (to) => {
      navigate(to)
    }

  return (
    <motion.div className="h-full w-full" variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Canvas
          shadows
          dpr={[1, perfSucks ? 1 : 2]}
          eventPrefix="client"
          camera={{ position: [20, 0.9, 20], fov: 26 }}
        >
          <PerformanceMonitor onDecline={() => degrade(true)} />
          <color attach="background" args={[theme === 'dark' ? '#161226' : '#f0f0f0']} />
          <Suspense fallback={null}>
          <group position={[0, -0.5, 0]} rotation={[0, -0.75, 0]}>
            <Env perfSucks={perfSucks} theme={theme} />
          </group>
          </Suspense>
          <Html fullscreen  style={{ position: "absolute", left:0, top:0, transform: "translate(-50%, -50%)" }}>
            <HtmlPart  isOpen={isOpen} setIsOpen={setIsOpen} navigateTo={navigateTo}/>
          </Html>
          <Bubble  isOpen={isOpen}  />
        </Canvas>
      </motion.div>
  )
}

export default Experience