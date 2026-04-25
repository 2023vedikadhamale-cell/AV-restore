'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

const planeData = [
  { pos: [-2.5, 0, 0], color: '#f43f5e', scale: [1.2, 0.7, 1] },
  { pos: [0, 0.8, -1.5], color: '#6366f1', scale: [1.4, 0.8, 1] },
  { pos: [2.5, 0, 0], color: '#10b981', scale: [1.2, 0.7, 1] },
];

const beams = [
  { from: new THREE.Vector3(-2.5, 0, 0), to: new THREE.Vector3(0, 0.8, -1.5), color: '#6366f1' },
  { from: new THREE.Vector3(0, 0.8, -1.5), to: new THREE.Vector3(2.5, 0, 0), color: '#06b6d4' },
];

function Beam({ from, to, color }) {
  const dir = to.clone().sub(from);
  const len = dir.length();
  const mid = from.clone().add(dir.clone().multiplyScalar(0.5));
  const q = useMemo(() => {
    return new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
  }, []);

  return (
    <mesh position={[mid.x, mid.y, mid.z]} quaternion={q}>
      <cylinderGeometry args={[0.008, 0.008, len, 6]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.3}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

export default function FloatingPlanes() {
  const group = useRef();
  const planeRefs = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.08;
    }
    planeRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.position.y = Math.sin(t * (0.5 + i * 0.15) + i * 2) * 0.18;
      }
    });
  });

  return (
    <group ref={group}>
      {planeData.map((d, i) => (
        <group key={i} ref={el => planeRefs.current[i] = el} position={d.pos}>
          {/* Translucent plane */}
          <mesh scale={d.scale}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
              color={d.color}
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Wireframe outline */}
          <mesh scale={[d.scale[0] + 0.02, d.scale[1] + 0.02, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
              color={d.color}
              transparent
              opacity={0.45}
              wireframe
            />
          </mesh>
          {/* Glow core */}
          <Sphere args={[0.07, 16, 16]} position={[0, 0, 0.05]}>
            <meshStandardMaterial
              color={d.color}
              emissive={d.color}
              emissiveIntensity={2.5}
              transparent
              opacity={0.9}
            />
          </Sphere>
        </group>
      ))}

      {/* Connecting beams */}
      {beams.map((b, i) => (
        <Beam key={i} from={b.from} to={b.to} color={b.color} />
      ))}
    </group>
  );
}
