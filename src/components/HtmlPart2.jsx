import React from 'react'
import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useIntersect, Image, ScrollControls, Scroll } from '@react-three/drei'
import { motion as motion3d} from 'framer-motion-3d'
import { motion, useAnimation } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'


function Item({ url, scale, ...props }) {
    const visible = useRef(false)
    const [hovered, hover] = useState(false)
    const ref = useIntersect((isVisible) => (visible.current = isVisible))
    const { height } = useThree((state) => state.viewport)

    useFrame((state, delta) => {
      ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, visible.current ? 0 : -height / 2 + 1, 4, delta)
      ref.current.material.zoom = THREE.MathUtils.damp(ref.current.material.zoom, visible.current ? 1 : 1.5, 4, delta)
      ref.current.material.grayscale = THREE.MathUtils.damp(ref.current.material.grayscale, hovered ? 1 : 0, 4, delta)
    })
    return (
      <group {...props}>
        <Image ref={ref} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} scale={scale} url={url} />
      </group>
    )
  }

  function Items() {
    const { width: w, height: h } = useThree((state) => state.viewport)
    return (
      <Scroll>
        <Item url="../images/1.jpg" scale={[w / 3, w / 3, 1]} position={[-w / 6, 0, 0]} />
        <Item url="../images/2.jpg" scale={[2, w / 3, 1]} position={[w / 30, -h, 0]} />
        <Item url="../images/3.jpg" scale={[w / 3, w / 5, 1]} position={[-w / 4, -h * 1, 0]} />
        <Item url="../images/4.jpg" scale={[w / 5, w / 5, 1]} position={[w / 4, -h * 1.2, 0]} />
        <Item url="../images/5.jpg" scale={[w / 5, w / 5, 1]} position={[w / 10, -h * 1.75, 0]} />
        <Item url="../images/6.jpg" scale={[w / 3, w / 3, 1]} position={[-w / 4, -h * 2, 0]} />
        <Item url="../images/7.jpg" scale={[w / 3, w / 5, 1]} position={[-w / 4, -h * 2.6, 0]} />
        <Item url="../images/8.jpg" scale={[w / 2, w / 2, 1]} position={[w / 4, -h * 3.1, 0]} />
        <Item url="../images/9.jpg" scale={[w / 2.5, w / 2, 1]} position={[-w / 6, -h * 4.1, 0]} />
      </Scroll>
    )
  }

const HtmlPart2 = () => {
  const navigate = useNavigate()
  const control = useAnimation()
  const control2 = useAnimation()

  const goBack = () => {
        control.start({y:-20, transition: {duration: 1.3}})
        control2.start({opacity: 0, transition: {duration: 1.3}})
        setTimeout(() => {
          navigate("/");
        }, 1300); 
  }
  return (
    <div className="h-screen w-screen">
    <Canvas orthographic camera={{ zoom: 80 }} gl={{ alpha: false, antialias: false, stencil: false, depth: false }} dpr={[1, 1.5]}>
    <color attach="background" args={['#f0f0f0']} />
    <motion3d.group animate={control}>
    <motion3d.group initial={{y: -20}} animate={{y: 0, transition:{duration:1}}}>

    <ScrollControls damping={.2} pages={5}>
      <Items />
      <Scroll html style={{ width: '100%' }}>
      <motion.div animate={control2}>
      <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition:{duration:1, delay: .5}}}>
        <h1 className="h1" style={{ position: 'absolute', top: '180vh', left: '10vw' }}>creating</h1>
        <h1 className="h1" style={{ position: 'absolute', top: `100vh`, right: '20vw', transform: `translate3d(0,-100%,0)` }}>awesome</h1>
        <h1 className="h1" style={{ position: 'absolute', top: '260vh', right: '10vw' }}>projects,</h1>
        <h1 className="h1" style={{ position: 'absolute', top: '350vh', left: '10vw' }}>code</h1>
        <h1 className="h1" style={{ position: 'absolute', top: '450vh', right: '10vw' }}>
        with
        <br />
        passion.
        </h1>
      </motion.div>
      </motion.div>

      </Scroll>
    </ScrollControls>
    </motion3d.group>
    </motion3d.group>

  </Canvas>
  <div  className="fixed top-0 left-0">
    <div onClick={goBack} className="font-bold p-3 text-lg text-black hover:text-gray-400 duration-300">Go Back</div>
  </div>
  </div>

  )
}

export default HtmlPart2