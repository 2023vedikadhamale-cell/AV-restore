'use client';
import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

const METRICS_DATA = {
  ssim: Array.from({ length: 100 }, (_, i) => 0.98 + Math.random() * 0.016),
  psnr: Array.from({ length: 100 }, (_, i) => 40 + Math.random() * 5),
};

function Bar({ position, height, color, frameIdx, value, metric }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      const target = height;
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, target, 0.08);
      meshRef.current.position.y = meshRef.current.scale.y * 0.5 * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        scale={[1, 0.01, 1]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[0.12, 0.3, 0.12]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      {hovered && (
        <Html center position={[0, height * 0.15 + 0.3, 0]}>
          <div style={{
            background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '0.5rem 0.75rem', whiteSpace: 'nowrap',
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#f1f5f9',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ color: '#94a3b8', marginBottom: 2 }}>Frame #{frameIdx}</div>
            <div style={{ color: '#10b981', fontWeight: 600 }}>{metric.toUpperCase()}: {value.toFixed(4)}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

const lerp = (a, b, t) => a + (b - a) * t;
const getColor = (normalized) => {
  if (normalized > 0.7) return '#10b981';
  if (normalized > 0.4) return '#f59e0b';
  return '#f43f5e';
};

export default function MetricsChart3D({ metric = 'ssim', autoRotate = false }) {
  const data = METRICS_DATA[metric] || METRICS_DATA.ssim;
  const min = Math.min(...data);
  const max = Math.max(...data);

  const bars = useMemo(() => data.map((val, i) => {
    const normalized = (val - min) / (max - min + 0.001);
    const height = 0.3 + normalized * 2.5;
    const x = (i - 50) * 0.18;
    return { pos: [x, 0, 0], height, color: getColor(normalized), val, i };
  }), [data, min, max]);

  return (
    <>
      <OrbitControls enableZoom={true} autoRotate={autoRotate} autoRotateSpeed={0.5} enablePan={false} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#06b6d4" />
      <pointLight position={[-5, 5, -5]} intensity={0.6} color="#8b5cf6" />

      {/* Floor grid */}
      <gridHelper args={[20, 40, '#1e293b', '#1e293b']} position={[0, -0.05, 0]} />

      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <planeGeometry args={[22, 4]} />
        <meshStandardMaterial color="#0a0a0f" metalness={0.8} roughness={0.2} />
      </mesh>

      {bars.map((b) => (
        <Bar
          key={b.i}
          position={b.pos}
          height={b.height}
          color={b.color}
          frameIdx={b.i}
          value={b.val}
          metric={metric}
        />
      ))}

      {/* Axis label */}
      <Text
        position={[0, -0.4, 2]}
        fontSize={0.15}
        color="#475569"
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
      >
        Frame Index (0–99)
      </Text>
    </>
  );
}
