'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const stages = [
  'Initializing Pipeline...',
  'Loading Audio Encoder...',
  'Building Reference Bank...',
  'Mounting VAE Decoder...',
  'Calibrating STFT...',
  'Ready.',
];

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const screenRef = useRef(null);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) p = 100;
      setProgress(Math.round(p));
      setStageIdx(Math.min(Math.floor((p / 100) * stages.length), stages.length - 1));
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (screenRef.current) {
            gsap.to(screenRef.current, {
              opacity: 0,
              duration: 0.8,
              ease: 'power2.inOut',
              onComplete: () => setVisible(false),
            });
          }
        }, 400);
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div ref={screenRef} className="loading-screen" style={{ opacity: 1 }}>
      {/* Animated grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.3,
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      {/* Logo mark */}
      <div style={{ position: 'relative', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <svg width="60" height="60" viewBox="0 0 22 22" fill="none" style={{ animation: 'spin-slow 8s linear infinite' }}>
          <path d="M11 2L3 6v10l8 4 8-4V6L11 2z" stroke="url(#grad2)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          <path d="M11 2v18M3 6l8 4 8-4" stroke="url(#grad2)" strokeWidth="1.5" fill="none" />
          <defs>
            <linearGradient id="grad2" x1="3" y1="2" x2="19" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" /><stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-cyan)', letterSpacing: '0.08em' }}>
            {stages[stageIdx]}
          </p>

          <div className="loading-bar-track">
            <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
          </div>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
