import * as THREE from 'three';

// Blue / purple / cyan, matched to the blob's shader gradient (fragmentShader.js
// derives R/G from vUv and locks B to 1.0, which reads as this same range).
// Shared across the blob's particle and shockwave effects for a consistent look.
export const PALETTE = [
  new THREE.Color('#5aa9ff'),
  new THREE.Color('#9d6bff'),
  new THREE.Color('#4ce3e0'),
];
