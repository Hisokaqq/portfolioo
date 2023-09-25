import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { MathUtils } from "three";
import vertexShader from '../helpers/vertexShader';
import fragmentShader from '../helpers/fragmentShader';
import { motion } from 'framer-motion-3d';
import { moveAnimation } from '../helpers/AnimationVar';

const variants = {
  open: { scale: 1 },
  closed: { scale: 0, transition: { duration: .3} },
}

const Bubble = ({ isOpen }) => {
  const mesh = useRef();
  const hover = useRef(false);
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_intensity: { value: 0.3 },
  }));

  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setScale(0.3);
      } else {
        setScale(0.6);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useFrame((state) => {
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
  });

  return (
    <group scale={scale}>
      <motion.group whileTap={{ rotateY: 3, scale: .8 }}>
        <motion.group animate={isOpen ? "open" : "closed"} variants={variants}>
          <motion.mesh
            variants={moveAnimation}
            animate="show"
            initial="hidden"
            ref={mesh}
            position={[0, 0, 0]}
            onPointerOver={() => (hover.current = true)}
            onPointerOut={() => (hover.current = false)}
          >
            <icosahedronGeometry args={[2, 20]} />
            <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
          </motion.mesh>
        </motion.group>
      </motion.group>
    </group>
  );
};

export default Bubble;