import React, { useEffect, useRef, useState } from 'react'
import { Text, useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Model(props) {
  const { nodes, materials } = useGLTF('/phone.glb')
  const ScrollerMesh = useRef()
  const rotationAxis = new THREE.Vector3(0, 1, 0) 

  useFrame(() => {
    ScrollerMesh.current.rotateOnAxis(rotationAxis, 0.03)
  })
  const [scale, setScale] = useState(0.22);
  const [pos, setPos] = useState([0, 0, 0]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 950) {
        setScale(0.13);
        setPos([-2.5, .5, 0]);

      } else {
        setScale(0.22);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.group 
      whileTap={{
        scale: scale * 1.1,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 5
        }
      }} 
      scale={scale} 
      rotation={[scale, -Math.PI / 1.3, 0]} 
      {...props} 
      dispose={null}
      position= {pos}
    >
      <mesh 
        geometry={nodes.Phone_base.geometry} 
        material={materials.Base} 
        scale={0.672}
      >
        <group ref={ScrollerMesh}
          position={[0.428, 0.941, 0]} 
          rotation={[-0.002, 0.004, -0.759]} 
          scale={0.636}
        >
          <mesh 
            geometry={nodes.Circle005.geometry} 
            material={materials.Controller} 
          />
          <mesh 
            geometry={nodes.Circle005_1.geometry} 
            material={materials.Controller} 
          />
        </group>
        <mesh 
          geometry={nodes.Phone.geometry} 
          material={materials.Base} 
          position={[-0.467, 1.487, 1.448]} 
          scale={1.381} 
        />
        <mesh 
          geometry={nodes.Phone_holders.geometry} 
          material={materials.Controller} 
          position={[-0.476, 1.489, 0.357]} 
        />
        <mesh 
          geometry={nodes.Spiral001.geometry} 
          material={materials['Material.002']} 
          position={[-1.201, -0.147, 0.046]} 
          rotation={[0, 0, -Math.PI / 2]} 
          scale={1.452} 
        />
      </mesh>
      
      <RoundedBox 
        args={[1, 0.3, 0.02]} 
        scale={2}
        position={[.7, -.4, 0]} 
        rotation={[0, 1.5, 0]}
        radius={0.05}  // Rounded corner radius
        smoothness={4}  // Smoothness of the corners
      >
        <meshStandardMaterial color="black" />
        <Text
          scale={1}
          position={[0, 0, 0.02]}
          color="#ffffff"
          fontSize={0.2}
          fontWeight={300}
          letterSpacing={0.05}
        >
          Drag me
        </Text>
        <Text
          scale={1}
          position={[0, 0, -.02]}
          rotation={[0, Math.PI, 0]}
          color="#ffffff"
          fontSize={0.2}
          fontWeight={300}
          letterSpacing={0.05}
        >
          Call me
        </Text>
      </RoundedBox>
    </motion.group>
  )
}

useGLTF.preload('/phone.glb')
