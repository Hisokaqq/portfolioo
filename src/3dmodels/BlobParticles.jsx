import { useFrame } from '@react-three/fiber';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PALETTE } from '../helpers/blobPalette';

// Pool sizes cap how many particles can ever exist at once — buffers are
// allocated once and reused (recycled) on every click instead of growing.
const MAX_BURST = 50;
const MAX_ORBIT = 8;

const particleVertexShader = `
  attribute float aScale;
  attribute float aAlpha;
  attribute vec3 color;
  uniform float uPixelScale;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vAlpha = aAlpha;
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aScale * (uPixelScale / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float edge = 1.0 - smoothstep(0.2, 0.5, d);
    gl_FragColor = vec4(vColor, vAlpha * edge);
  }
`;

const randRange = (min, max) => min + Math.random() * (max - min);
const randomColor = () => PALETTE[Math.floor(Math.random() * PALETTE.length)];

const _dir = new THREE.Vector3();
const _jitter = new THREE.Vector3();
const _tmpVec = new THREE.Vector3();
const _tmpEuler = new THREE.Euler();

const randomOnUnitSphere = (target) => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  return target.set(
    Math.sin(phi) * Math.cos(theta),
    Math.sin(phi) * Math.sin(theta),
    Math.cos(phi)
  );
};

// Point on a particle's tilted elliptical orbit at the given angle.
const orbitPointAt = (st, angle) => {
  _tmpVec.set(
    Math.cos(angle) * st.orbitRadius,
    0,
    Math.sin(angle) * st.orbitRadius * st.ellipse
  );
  return _tmpVec.applyQuaternion(st.quaternion);
};

function makeBuffers(count) {
  return {
    positions: new Float32Array(count * 3),
    colors: new Float32Array(count * 3),
    scales: new Float32Array(count),
    alphas: new Float32Array(count),
    active: new Uint8Array(count),
  };
}

function makeGeometry(buf) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(buf.positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(buf.colors, 3));
  geo.setAttribute('aScale', new THREE.BufferAttribute(buf.scales, 1));
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(buf.alphas, 1));
  return geo;
}

function makeMaterial(uniforms) {
  return new THREE.ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

// Click-triggered particle burst (30-50 outward, fading/shrinking) plus a
// smaller batch of "captured" particles that ease into an elliptical orbit
// around the blob before releasing outward. Both pools are pre-allocated and
// recycled on every trigger() call — no per-click geometry allocation.
const BlobParticles = forwardRef(({ radius = 2 }, ref) => {
  const burstPointsRef = useRef();
  const orbitPointsRef = useRef();

  const burst = useMemo(() => makeBuffers(MAX_BURST), []);
  const orbit = useMemo(() => makeBuffers(MAX_ORBIT), []);

  const burstGeometry = useMemo(() => makeGeometry(burst), [burst]);
  const orbitGeometry = useMemo(() => makeGeometry(orbit), [orbit]);

  const burstUniforms = useMemo(() => ({ uPixelScale: { value: 800 } }), []);
  const orbitUniforms = useMemo(() => ({ uPixelScale: { value: 800 } }), []);

  const burstMaterial = useMemo(() => makeMaterial(burstUniforms), [burstUniforms]);
  const orbitMaterial = useMemo(() => makeMaterial(orbitUniforms), [orbitUniforms]);

  const burstState = useMemo(
    () =>
      Array.from({ length: MAX_BURST }, () => ({
        velocity: new THREE.Vector3(),
        age: 0,
        life: 1,
        baseScale: 0.2,
      })),
    []
  );

  const orbitState = useMemo(
    () =>
      Array.from({ length: MAX_ORBIT }, () => ({
        stage: 'idle', // 'capture' | 'orbit' | 'release'
        stageTime: 0,
        from: new THREE.Vector3(),
        phase: 0,
        orbitRadius: 0,
        ellipse: 1,
        angularSpeed: 0,
        quaternion: new THREE.Quaternion(),
        captureDuration: 0.35,
        orbitDuration: 3,
        releaseDuration: 0.7,
        releaseAngle: 0,
      })),
    []
  );

  const spawnBurst = () => {
    const target = Math.floor(randRange(30, 50));
    let spawned = 0;
    for (let i = 0; i < MAX_BURST && spawned < target; i++) {
      if (burst.active[i]) continue;

      randomOnUnitSphere(_dir);
      const px = _dir.x * radius;
      const py = _dir.y * radius;
      const pz = _dir.z * radius;

      _jitter.set(randRange(-1, 1), randRange(-1, 1), randRange(-1, 1)).multiplyScalar(0.4);
      const speed = randRange(1.2, 2.4);

      const st = burstState[i];
      st.velocity.set(_dir.x * speed + _jitter.x, _dir.y * speed + _jitter.y, _dir.z * speed + _jitter.z);
      st.age = 0;
      st.life = randRange(0.7, 1.1);
      st.baseScale = randRange(0.12, 0.22) * radius;

      burst.positions[i * 3] = px;
      burst.positions[i * 3 + 1] = py;
      burst.positions[i * 3 + 2] = pz;

      const color = randomColor();
      burst.colors[i * 3] = color.r;
      burst.colors[i * 3 + 1] = color.g;
      burst.colors[i * 3 + 2] = color.b;

      burst.scales[i] = st.baseScale;
      burst.alphas[i] = 1;
      burst.active[i] = 1;

      spawned++;
    }
  };

  const spawnOrbit = () => {
    const target = Math.floor(randRange(5, 8));
    let spawned = 0;
    for (let i = 0; i < MAX_ORBIT && spawned < target; i++) {
      const st = orbitState[i];
      if (st.stage !== 'idle') continue;

      randomOnUnitSphere(_dir);
      st.from.set(_dir.x * radius, _dir.y * radius, _dir.z * radius);
      st.phase = randRange(0, Math.PI * 2);
      st.orbitRadius = radius * randRange(1.3, 1.7);
      st.ellipse = randRange(0.6, 1);
      st.angularSpeed = randRange(1.2, 2.2) * (Math.random() < 0.5 ? -1 : 1);
      st.quaternion.setFromEuler(_tmpEuler.set(randRange(-0.6, 0.6), 0, randRange(-0.6, 0.6)));
      st.stage = 'capture';
      st.stageTime = 0;
      st.captureDuration = randRange(0.25, 0.45);
      st.orbitDuration = randRange(2, 4);
      st.releaseDuration = randRange(0.5, 0.8);

      const color = randomColor();
      orbit.colors[i * 3] = color.r;
      orbit.colors[i * 3 + 1] = color.g;
      orbit.colors[i * 3 + 2] = color.b;
      orbit.scales[i] = randRange(0.14, 0.2) * radius;
      orbit.alphas[i] = 0;
      orbit.active[i] = 1;

      spawned++;
    }
    orbitGeometry.attributes.color.needsUpdate = true;
    orbitGeometry.attributes.aScale.needsUpdate = true;
  };

  useImperativeHandle(ref, () => ({
    trigger() {
      spawnBurst();
      spawnOrbit();
    },
  }));

  useFrame((state, delta) => {
    burstUniforms.uPixelScale.value = state.size.height * 0.5;
    orbitUniforms.uPixelScale.value = state.size.height * 0.5;

    let burstDirty = false;
    for (let i = 0; i < MAX_BURST; i++) {
      if (!burst.active[i]) continue;
      burstDirty = true;
      const st = burstState[i];
      st.age += delta;

      if (st.age >= st.life) {
        burst.active[i] = 0;
        burst.alphas[i] = 0;
        burst.scales[i] = 0;
        continue;
      }

      const t = st.age / st.life;
      burst.positions[i * 3] += st.velocity.x * delta;
      burst.positions[i * 3 + 1] += st.velocity.y * delta;
      burst.positions[i * 3 + 2] += st.velocity.z * delta;
      burst.alphas[i] = 1 - t;
      burst.scales[i] = st.baseScale * (1 - t);
    }
    if (burstDirty) {
      burstGeometry.attributes.position.needsUpdate = true;
      burstGeometry.attributes.aAlpha.needsUpdate = true;
      burstGeometry.attributes.aScale.needsUpdate = true;
      burstGeometry.attributes.color.needsUpdate = true;
    }

    let orbitDirty = false;
    for (let i = 0; i < MAX_ORBIT; i++) {
      const st = orbitState[i];
      if (st.stage === 'idle') continue;
      orbitDirty = true;
      st.stageTime += delta;

      if (st.stage === 'capture') {
        const t = Math.min(st.stageTime / st.captureDuration, 1);
        const target = orbitPointAt(st, st.phase);
        orbit.positions[i * 3] = THREE.MathUtils.lerp(st.from.x, target.x, t);
        orbit.positions[i * 3 + 1] = THREE.MathUtils.lerp(st.from.y, target.y, t);
        orbit.positions[i * 3 + 2] = THREE.MathUtils.lerp(st.from.z, target.z, t);
        orbit.alphas[i] = t;
        if (t >= 1) {
          st.stage = 'orbit';
          st.stageTime = 0;
        }
      } else if (st.stage === 'orbit') {
        const angle = st.phase + st.stageTime * st.angularSpeed;
        const p = orbitPointAt(st, angle);
        orbit.positions[i * 3] = p.x;
        orbit.positions[i * 3 + 1] = p.y;
        orbit.positions[i * 3 + 2] = p.z;
        orbit.alphas[i] = 1;
        if (st.stageTime >= st.orbitDuration) {
          st.stage = 'release';
          st.stageTime = 0;
          st.releaseAngle = angle;
        }
      } else if (st.stage === 'release') {
        const t = Math.min(st.stageTime / st.releaseDuration, 1);
        const p = orbitPointAt(st, st.releaseAngle);
        const dx = p.x / st.orbitRadius;
        const dy = p.y / st.orbitRadius;
        const dz = p.z / st.orbitRadius;
        const distance = t * radius * 2;
        orbit.positions[i * 3] = p.x + dx * distance;
        orbit.positions[i * 3 + 1] = p.y + dy * distance;
        orbit.positions[i * 3 + 2] = p.z + dz * distance;
        orbit.alphas[i] = 1 - t;
        if (t >= 1) {
          st.stage = 'idle';
          orbit.active[i] = 0;
          orbit.alphas[i] = 0;
        }
      }
    }
    if (orbitDirty) {
      orbitGeometry.attributes.position.needsUpdate = true;
      orbitGeometry.attributes.aAlpha.needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={burstPointsRef} geometry={burstGeometry} material={burstMaterial} frustumCulled={false} />
      <points ref={orbitPointsRef} geometry={orbitGeometry} material={orbitMaterial} frustumCulled={false} />
    </>
  );
});

BlobParticles.displayName = 'BlobParticles';

export default BlobParticles;
