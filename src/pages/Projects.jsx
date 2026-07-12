import * as THREE from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useIntersect, Image, ScrollControls, Scroll } from '@react-three/drei'
import { motion as motion3d} from 'framer-motion-3d'
import { motion } from 'framer-motion'
import {  useNavigate } from 'react-router-dom'
import Env from '../components/Env'
import GBackBtn from '../components/GBackBtn'
import ScrollHint from '../components/ScrollHint'
import { pageVariants } from '../helpers/AnimationVar'
import { useTheme } from '../helpers/ThemeContext'
import { useMorph } from '../helpers/MorphContext'

// Project the mesh's four plane corners through the camera to get its on-screen
// pixel rect (in viewport coords), so the DOM morph overlay can start exactly
// where the clicked thumbnail sits.
function getScreenRect(mesh, camera, gl) {
  if (!mesh) return null
  const canvas = gl.domElement.getBoundingClientRect()
  const v = new THREE.Vector3()
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  mesh.updateWorldMatrix(true, false)
  for (const [cx, cy] of [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]]) {
    v.set(cx, cy, 0).applyMatrix4(mesh.matrixWorld).project(camera)
    const sx = canvas.left + (v.x * 0.5 + 0.5) * canvas.width
    const sy = canvas.top + (-v.y * 0.5 + 0.5) * canvas.height
    minX = Math.min(minX, sx); maxX = Math.max(maxX, sx)
    minY = Math.min(minY, sy); maxY = Math.max(maxY, sy)
  }
  return { left: minX, top: minY, width: maxX - minX, height: maxY - minY }
}

function Item({ url, scale, id, startMorph, ...props }) {
    const visible = useRef(false)
    const [hovered, hover] = useState(false)
    const ref = useIntersect((isVisible) => (visible.current = isVisible))
    const { height } = useThree((state) => state.viewport)
    const camera = useThree((state) => state.camera)
    const gl = useThree((state) => state.gl)
    const navigate = useNavigate()
    const openProject = () => {
      const rect = getScreenRect(ref.current, camera, gl)
      // Use an absolute path (matches the project's first image) so the overlay
      // <img> resolves correctly regardless of the current route.
      if (rect) startMorph({ url: `/images/${id}.webp`, rect })
      navigate(`project/${id}`)
    }
    // Reset the cursor if we unmount while still hovering (e.g. on navigate).
    useEffect(() => () => { document.body.style.cursor = 'auto' }, [])
    useFrame((state, delta) => {
      ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, visible.current ? 0 : -height / 2 + 1, 4, delta)
      // Subtle zoom-in on hover reads as "clickable" (the old grayscale-on-hover
      // looked like the image was being disabled).
      ref.current.material.zoom = THREE.MathUtils.damp(ref.current.material.zoom, visible.current ? (hovered ? 1.08 : 1) : 1.5, 4, delta)
      ref.current.material.grayscale = THREE.MathUtils.damp(ref.current.material.grayscale, 0, 4, delta)
    })
    return (
      <group {...props} >
        <Image onClick={openProject} ref={ref} onPointerOver={() =>{ hover(true); document.body.style.cursor =  'pointer' }} onPointerOut={() => {hover(false); document.body.style.cursor =  'auto'}} scale={scale} url={url}  >
        </Image>
      </group>
    )
  }

  function Items({ startMorph }) {
    const { width: w, height: h } = useThree((state) => state.viewport)
    const scale= [w / 2 * 1.2, w / 4 * 1.2, 1];
    return (
      <Scroll>
        <Item id="1" url="../images/1.webp" scale={scale} position={[-w / 6, 0, 0]} startMorph={startMorph} />
        <Item id="2" url="../images/2.webp" scale={scale} position={[w / 30, -h, 0]} startMorph={startMorph} />
        <Item id="3" url="../images/3.webp" scale={scale} position={[w / 10, -h * 1.75, 0]} startMorph={startMorph} />
        <Item id="4" url="../images/4.webp" scale={scale} position={[-w / 4, -h * 2.6, 0]} startMorph={startMorph} />
        <Item id="5" url="../images/5.webp" scale={scale} position={[-w / 6, -h * 3.8, 0]} startMorph={startMorph} />
      </Scroll>
    )
  }

const Projects = () => {
  const navigate = useNavigate()
  const [perfSucks] = useState(false)
  const { theme } = useTheme()
  const { startMorph } = useMorph()

  const goBack = () => navigate("/")
  return (
    <motion.div className="h-[100dvh] w-full overflow-hidden" variants={pageVariants} initial="initial" animate="animate" exit="exit">
    <GBackBtn goBack={goBack} />
    <Canvas   eventPrefix="client" camera={{ zoom: 1,  fov: 60  }} gl={{ alpha: false, antialias: false, stencil: false, depth: false }} dpr={[1, 1.5]}>
    <color attach="background" args={[theme === 'dark' ? '#161226' : '#f0f0f0']} />
    <Suspense fallback={null}>
    <group position={[0, -0.5, 0]} rotation={[0, -0.75, 0]}>
        <Env perfSucks={perfSucks} theme={theme} />
    </group>
    <motion3d.group initial={{y: -20}} animate={{y: 0, transition:{duration:1}}}>
    <ScrollControls damping={.2} pages={5}>
      <Items startMorph={startMorph} />
      <Scroll html style={{ width: '100%' }}>
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
      <ScrollHint />
      </Scroll>
    </ScrollControls>
    </motion3d.group>
    </Suspense>
  </Canvas>
  </motion.div>
  )
}

export default Projects
