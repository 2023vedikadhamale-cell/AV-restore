'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ParticleField from './ParticleField';
import FloatingPlanes from './FloatingPlanes';

function CameraRig({ scrollY }) {
  useFrame((state) => {
    state.camera.position.z = 6 - (scrollY.current / 1000) * 2;
    state.camera.position.y = scrollY.current / 2000;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ scrollY }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 8, 20]} />

      <ambientLight intensity={0.1} />
      <pointLight position={[4, 4, 4]} intensity={0.6} color="#6366f1" />
      <pointLight position={[-4, -4, 4]} intensity={0.4} color="#06b6d4" />

      <Stars radius={80} depth={60} count={2000} factor={3} saturation={0.5} fade speed={1} />
      <ParticleField count={1500} color="#6366f1" radius={6} />
      <FloatingPlanes />

      <CameraRig scrollY={scrollY} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={1.2} />
      </EffectComposer>
    </Canvas>
  );
}
