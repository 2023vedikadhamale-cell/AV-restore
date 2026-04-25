'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { Icosahedron, Edges } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

function Mesh() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.08;
      ref.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });
  return (
    <Icosahedron ref={ref} args={[2.2, 1]}>
      <meshStandardMaterial color="#6366f1" transparent opacity={0.04} />
      <Edges lineWidth={0.5} color="#6366f1" threshold={0} />
    </Icosahedron>
  );
}

export default function IcosahedronBg() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ background: 'transparent' }} gl={{ alpha: true }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} intensity={0.5} color="#6366f1" />
      <Mesh />
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} intensity={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
