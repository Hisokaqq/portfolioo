import * as THREE from "three"
import { Environment, Lightformer } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import { useEffect, useMemo, useRef } from "react"

// Takes authoritative control of the canvas background in dark mode. Runs as a
// passive effect *after* <Environment> sets/tears down its own background, so a
// theme toggle can't leave us on a stale light value (which showed up as a
// white flash that only a refresh fixed). In light mode it yields to
// <Environment background>, which paints the blurred city env.
//
// To echo the light-mode feel (where the blurred env pans with the cursor), the
// dark background isn't flat: its violet tint shifts a little with the pointer
// (and drifts on its own on touch devices, which have no pointer).
function SceneBackground({ theme, accentColor }) {
  const scene = useThree((s) => s.scene)
  const color = useRef(new THREE.Color("#161226"))
  const target = useMemo(() => new THREE.Color(), [])
  const accent = useMemo(() => new THREE.Color(), [])
  // Endpoints the tint interpolates between — all kept dark on purpose.
  const cool = useMemo(() => new THREE.Color("#101028"), []) // indigo / blue
  const warm = useMemo(() => new THREE.Color("#1e1230"), []) // purple / magenta
  const glow = useMemo(() => new THREE.Color("#241a3c"), []) // subtle top highlight
  const isCoarse = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    []
  )

  useEffect(() => {
    if (theme === "dark") scene.background = color.current
  }, [theme, scene])

  useFrame((state, delta) => {
    if (theme !== "dark") return
    const t = state.clock.elapsedTime
    const px = isCoarse ? Math.sin(t * 0.15) * 0.5 + 0.5 : state.pointer.x * 0.5 + 0.5
    const py = isCoarse ? Math.cos(t * 0.12) * 0.5 + 0.5 : state.pointer.y * 0.5 + 0.5
    target.copy(cool).lerp(warm, px)     // horizontal: blue <-> purple
    target.lerp(glow, py * 0.35)         // vertical: subtle brighten toward the top
    // Whichever project row is hovered leans the whole backdrop toward its
    // accent color — a deliberately gentle pull so it reads as mood
    // lighting, not a full recolor (at 0.35 this swung hard between each
    // project's very different hue and read as a rainbow flash rather than
    // a mood shift). Reused fresh every frame (not once on hover-start), so
    // it stays correct no matter how fast hoveredId churns.
    if (accentColor) {
      accent.set(accentColor)
      target.lerp(accent, 0.15)
    }
    easing.dampC(color.current, target, 0.4, delta)
    scene.background = color.current
  })

  return null
}

function Env({ perfSucks, theme = 'light', accentColor = null }) {
    const ref = useRef()
    // Touch devices have no mouse pointer, so the pointer-driven camera would
    // sit perfectly still. Fall back to a gentle time-based drift there.
    const isCoarse = useMemo(
      () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
      []
    )
    useFrame((state, delta) => {
      if (!perfSucks) {
        const t = state.clock.elapsedTime
        const px = isCoarse ? Math.sin(t * 0.15) * 1.2 : state.pointer.x
        const py = isCoarse ? Math.cos(t * 0.12) * 0.4 : state.pointer.y
        easing.damp3(ref.current.rotation, [Math.PI / 2, 0, t / 5 + px], 0.2, delta)
        easing.damp3(state.camera.position, [Math.sin(px / 4) * 9, 1.25 + py, Math.cos(px / 4) * 9], 0.5, delta)
        state.camera.lookAt(0, 0, 0)
      }
    })
    return (
      <>
      <Environment frames={perfSucks ? 1 : Infinity} preset="city" resolution={perfSucks || isCoarse ? 128 : 256} background={theme !== 'dark'} blur={0.8}>
        <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
        <group rotation={[Math.PI / 2, 1, 0]}>
          {[2, -2, 2, -4, 2, -5, 2, -9].map((x, i) => (
            <Lightformer key={i} intensity={1} rotation={[Math.PI / 4, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
          ))}
          <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={0.5} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
        </group>
        <group ref={ref}>
          <Lightformer intensity={5} form="ring" color="red" rotation-y={Math.PI / 2} position={[-5, 2, -1]} scale={[10, 10, 1]} />
        </group>
      </Environment>
      <SceneBackground theme={theme} accentColor={accentColor} />
      </>
    )
  }

export default Env