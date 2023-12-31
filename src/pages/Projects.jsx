import React from 'react'
import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useIntersect, Image, ScrollControls, Scroll, Html } from '@react-three/drei'
import { motion as motion3d} from 'framer-motion-3d'
import { motion, useAnimation } from 'framer-motion'
import {  useNavigate } from 'react-router-dom'
import Env from '../components/Env'
import GBackBtn from '../components/GBackBtn'

function Item({ url, scale, id, ...props }) {
    const visible = useRef(false)
    const [hovered, hover] = useState(false)
    const ref = useIntersect((isVisible) => (visible.current = isVisible))
    const { height } = useThree((state) => state.viewport)
    const navigate = useNavigate()
    useFrame((state, delta) => {
      ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, visible.current ? 0 : -height / 2 + 1, 4, delta)
      ref.current.material.zoom = THREE.MathUtils.damp(ref.current.material.zoom, visible.current ? 1 : 1.5, 4, delta)
      ref.current.material.grayscale = THREE.MathUtils.damp(ref.current.material.grayscale, hovered ? 1 : 0, 4, delta)
    })
    return (
      <group {...props} >
        <Image onClick={()=>navigate(`project/${id}`)} ref={ref} onPointerOver={() =>{ hover(true); document.body.style.cursor =  'pointer' }} onPointerOut={() => {hover(false); document.body.style.cursor =  'auto'}} scale={scale} url={url}  >
        </Image>
      </group>
    )
  }

  function Items() {
    const { width: w, height: h } = useThree((state) => state.viewport)
    const scale= [w / 2 * 1.2, w / 4 * 1.2, 1];
    return (
      <Scroll>
        <Item id="1" url="../images/1.png" scale={scale} position={[-w / 6, 0, 0]} />
        <Item id="2" url="../images/2.png" scale={scale} position={[w / 30, -h, 0]} />
        <Item id="3" url="../images/3.png" scale={scale} position={[w / 10, -h * 1.75, 0]} />
        <Item id="4" url="../images/4.png" scale={scale}position={[-w / 4, -h * 2.6, 0]} />
        <Item id="5" url="../images/5.png" scale={scale} position={[-w / 6, -h * 3.8, 0]} />
      </Scroll>
    )
  }

const Projects = () => {
  const navigate = useNavigate()
  const control = useAnimation()
  const control2 = useAnimation()
  const [perfSucks, degrade] = useState(false)

  const goBack = () => {
        control.start({y:-20, transition: {duration: .3}})
        control2.start({opacity: 0, transition: {duration: .3}})
        setTimeout(() => {
          navigate("/");
        }, 300); 
  }
  return (
    <div className="h-screen w-screen">
    <Canvas   eventPrefix="client" camera={{ zoom: 1,  fov: 60  }} gl={{ alpha: false, antialias: false, stencil: false, depth: false }} dpr={[1, 1.5]}>
    <color attach="background" args={['#f0f0f0']} />
    <group position={[0, -0.5, 0]} rotation={[0, -0.75, 0]}>
w       <Env perfSucks={perfSucks} />
    </group>
    <motion3d.group animate={control}>
    <motion3d.group initial={{y: -20}} animate={{y: 0, transition:{duration:1}}}>
    <ScrollControls damping={.2} pages={5}>
      <Items />
      <Scroll html style={{ width: '100%' }}>
      <motion.div animate={control2}>
    <GBackBtn goBack={goBack} />
  </motion.div>
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
  </div>
  )
}

export default Projects