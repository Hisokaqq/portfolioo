import { Environment, Lightformer } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { easing } from "maath"
import { useMemo, useRef } from "react"

function Env({ perfSucks }) {
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
      <Environment frames={perfSucks ? 1 : Infinity} preset="city" resolution={perfSucks ? 128 : 256} background blur={0.8}>
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
    )
  }

export default Env