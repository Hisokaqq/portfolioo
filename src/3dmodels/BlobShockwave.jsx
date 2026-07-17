import { useFrame } from '@react-three/fiber';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PALETTE } from '../helpers/blobPalette';
import noiseGLSL from '../helpers/noiseGLSL';

// One ring per press. Pool just gives headroom for rapid repeated clicks
// before recycling the oldest ring.
const MAX_RINGS = 3;
const DURATION = 1.1;
const START_SCALE = 1.1;
const END_SCALE = 2.3;
const FRESNEL_POWER = 2.5;
const WOBBLE = 0.05;

const shockwaveVertexShader = `
  uniform float uTime;
  uniform float uWobble;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  ${noiseGLSL}

  void main() {
    vNormal = normalize(normalMatrix * normal);
    float n = cnoise(position * 1.1 + vec3(0.0, 0.0, uTime * 0.2));
    vec3 displaced = position + normal * (uWobble * n);
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const shockwaveFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - clamp(dot(viewDir, normalize(vNormal)), 0.0, 1.0), ${FRESNEL_POWER});
    gl_FragColor = vec4(uColor, fresnel * uOpacity);
  }
`;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const randomColor = () => PALETTE[Math.floor(Math.random() * PALETTE.length)];

const BlobShockwave = forwardRef(({ radius = 2 }, ref) => {
  const meshRefs = useRef([]);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(radius, 5), [radius]);

  const materials = useMemo(
    () =>
      Array.from({ length: MAX_RINGS }, () => {
        const uniforms = {
          uColor: { value: new THREE.Color('#5aa9ff') },
          uOpacity: { value: 0 },
          uTime: { value: 0 },
          uWobble: { value: WOBBLE * radius },
        };
        return new THREE.ShaderMaterial({
          vertexShader: shockwaveVertexShader,
          fragmentShader: shockwaveFragmentShader,
          uniforms,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
      }),
    [radius]
  );

  const ringState = useMemo(
    () => Array.from({ length: MAX_RINGS }, () => ({ active: false, age: 0 })),
    []
  );

  useImperativeHandle(ref, () => ({
    trigger() {
      let slot = ringState.findIndex((r) => !r.active);
      if (slot === -1) {
        slot = ringState.reduce((best, r, i) => (r.age > ringState[best].age ? i : best), 0);
      }
      ringState[slot].active = true;
      ringState[slot].age = 0;
      materials[slot].uniforms.uColor.value.copy(randomColor());
      materials[slot].uniforms.uOpacity.value = 0;
    },
  }));

  useFrame((state, delta) => {
    for (let i = 0; i < MAX_RINGS; i++) {
      const st = ringState[i];
      const mesh = meshRefs.current[i];
      if (!st.active || !mesh) continue;

      materials[i].uniforms.uTime.value = state.clock.elapsedTime;
      st.age += delta;

      const t = Math.min(st.age / DURATION, 1);
      const eased = easeOutCubic(t);

      mesh.scale.setScalar(THREE.MathUtils.lerp(START_SCALE, END_SCALE, eased));
      materials[i].uniforms.uOpacity.value = (1 - t) * (1 - t);

      if (t >= 1) {
        st.active = false;
        materials[i].uniforms.uOpacity.value = 0;
      }
    }
  });

  return (
    <>
      {materials.map((material, i) => (
        <mesh key={i} ref={(el) => (meshRefs.current[i] = el)} geometry={geometry} material={material} />
      ))}
    </>
  );
});

BlobShockwave.displayName = 'BlobShockwave';

export default BlobShockwave;
