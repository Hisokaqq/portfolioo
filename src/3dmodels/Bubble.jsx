import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils } from "three";
import vertexShader from '../helpers/vertexShader';
import fragmentShader from '../helpers/fragmentShader';
import { motion } from 'framer-motion-3d';
import { moveAnimation } from '../helpers/AnimationVar';
import useIsMobile from '../helpers/useIsMobile';
import BlobParticles from './BlobParticles';

const variants = {
  open: { scale: 1 },
  closed: { scale: 0, transition: { duration: .3} },
}

// How often (seconds) a new particle batch spawns while the pointer stays over the blob.
const SPAWN_INTERVAL = 0.35;

const Bubble = ({ isOpen }) => {
  const mesh = useRef();
  const hover = useRef(false);
  const particles = useRef();
  const spawnTimer = useRef(0);
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_intensity: { value: 0.3 },
  }), []);

  const scale = useIsMobile(800) ? 0.3 : 0.6;

  const handlePointerOver = () => {
    hover.current = true;
    spawnTimer.current = 0;
    particles.current?.trigger();
  };

  useFrame((state, delta) => {
    const { clock } = state;
    if (mesh.current) {
      mesh.current.material.uniforms.u_time.value =
        0.4 * clock.getElapsedTime();
      mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(
        mesh.current.material.uniforms.u_intensity.value,
        hover.current ? 1 : 0.15,
        0.02
      );
    }

    if (hover.current) {
      spawnTimer.current += delta;
      if (spawnTimer.current >= SPAWN_INTERVAL) {
        spawnTimer.current = 0;
        particles.current?.trigger();
      }
    }
  });

  return (
    <group scale={scale}>
      <motion.group animate={isOpen ? "open" : "closed"} variants={variants}>
        <motion.mesh
          variants={moveAnimation}
          animate="show"
          initial="hidden"
          ref={mesh}
          position={[0, 0, 0]}
          onPointerOver={handlePointerOver}
          onPointerOut={() => (hover.current = false)}
        >
          <icosahedronGeometry args={[2, 20]} />
          <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
        </motion.mesh>
        <BlobParticles ref={particles} radius={2} />
      </motion.group>
    </group>
  );
};

export default Bubble;