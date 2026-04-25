'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './metrics.module.css';

const MetricsChart3D = dynamic(() => import('@/components/three/MetricsChart3D'), { ssr: false });

const MAIN_METRICS = [
  {
    label: 'SSIM', value: 0.9962, decimals: 4, suffix: '', max: 1,
    color: 'green', colorHex: '#10b981',
    interpretation: 'Excellent',
    desc: 'Structural Similarity Index measures perceived image quality. Values close to 1 indicate near-perfect reconstruction of structure, contrast, and luminance.',
    range: '0 – 1 (higher = better)',
    reference: '> 0.95 = excellent',
  },
  {
    label: 'PSNR', value: 42.4, decimals: 1, suffix: ' dB', max: 60,
    color: 'primary', colorHex: '#6366f1',
    interpretation: 'Very High',
    desc: 'Peak Signal-to-Noise Ratio quantifies reconstruction accuracy in decibels. Higher values mean less signal distortion relative to the original.',
    range: '0 – ∞ dB (higher = better)',
    reference: '> 40 dB = very high quality',
  },
  {
    label: 'STOI', value: 0.62, decimals: 2, suffix: '', max: 1,
    color: 'amber', colorHex: '#f59e0b',
    interpretation: 'Moderate',
    desc: 'Short-Time Objective Intelligibility estimates how understandable restored speech is. Constrained by limited reference bank diversity in the current implementation.',
    range: '0 – 1 (higher = better)',
    reference: '> 0.75 = high intelligibility',
  },
  {
    label: 'LSE-D', value: 1.02, decimals: 2, suffix: '', max: 5,
    color: 'cyan', colorHex: '#06b6d4',
    interpretation: 'Proxy Metric',
    desc: 'Lip Sync Error Distance measures how well the restored mouth region aligns temporally with the audio. Computed as a proxy via block-averaged pixel distance.',
    range: '0 – ∞ (lower = better)',
    reference: '< 2.0 = acceptable sync',
  },
];

const INTERP_CARDS = [
  {
    label: 'What SSIM means',
    icon: '◎',
    color: '#10b981',
    body: 'SSIM captures structural patterns, luminance, and contrast — the three things the human visual system uses to judge image quality. Our 0.996 score means the restored frames are visually almost indistinguishable from the originals.',
    formula: 'SSIM(x,y) = [l(x,y)]^α · [c(x,y)]^β · [s(x,y)]^γ',
  },
  {
    label: 'What PSNR means',
    icon: '◉',
    color: '#6366f1',
    body: 'PSNR is the log-ratio of maximum signal power to noise power. Every 6 dB increase roughly halves the pixel-level error. At 42.4 dB, the mean squared error per pixel is extremely small.',
    formula: 'PSNR = 10 · log₁₀(MAX² / MSE)',
  },
  {
    label: 'What STOI means',
    icon: '◈',
    color: '#f59e0b',
    body: 'STOI correlates well with human intelligibility tests. The 0.62 score reflects the challenge of audio restoration with limited reference speech data — expanding the reference bank would improve this significantly.',
    formula: 'STOI = mean over short-time segments of correlation',
  },
  {
    label: 'What LSE-D means',
    icon: '⬡',
    color: '#06b6d4',
    body: 'LSE-D acts as a proxy for lip-sync quality. We compute block-averaged pixel distances in the mouth region between the restored video and the audio\'s expected mouth position. Lower scores indicate better temporal alignment.',
    formula: 'LSE-D = (1/N) Σ block_dist(restored_mouth, audio_mouth)',
  },
];

export default function MetricsPage() {
  const [activeMetric, setActiveMetric] = useState('ssim');

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className="container">
          <span className="section-label">Quantitative Evaluation</span>
          <h1 className="h1" style={{ marginTop: '0.75rem' }}>
            Metrics <span className="text-gradient-primary">Dashboard</span>
          </h1>
          <p style={{ marginTop: '0.75rem', maxWidth: '55ch' }}>
            Interactive 3D visualization of per-frame metrics. Hover bars to inspect individual frames.
            Rotate and zoom the chart freely.
          </p>
        </div>
      </header>

      {/* Main dashboard grid */}
      <div className="container">
        <div className={styles.dashboard}>
          {/* Left metric cards */}
          <div className={styles.cardCol}>
            {MAIN_METRICS.slice(0, 2).map((m, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div
                  className={`glass-card ${styles.metricCard} ${activeMetric === m.label.toLowerCase() ? styles.metricCardActive : ''}`}
                  style={{ '--m-color': m.colorHex, cursor: 'pointer' }}
                  onClick={() => setActiveMetric(m.label.toLowerCase())}
                >
                  <div className={styles.metricValue} style={{ color: m.colorHex }}>
                    <AnimatedCounter value={m.value} decimals={m.decimals} suffix={m.suffix} />
                  </div>
                  <div className={styles.metricLabel}>{m.label}</div>
                  <div className={styles.metricBadge} style={{ background: `${m.colorHex}20`, color: m.colorHex }}>
                    {m.interpretation}
                  </div>
                  {/* Mini progress bar */}
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{
                      width: `${(m.value / m.max) * 100}%`,
                      background: m.colorHex,
                    }} />
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* 3D Chart center */}
          <div className={styles.chartArea}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTabs}>
                {['ssim', 'psnr'].map(tab => (
                  <button
                    key={tab}
                    className={`${styles.chartTab} ${activeMetric === tab ? styles.chartTabActive : ''}`}
                    onClick={() => setActiveMetric(tab)}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                100 frames · drag to rotate
              </span>
            </div>

            <div className={styles.canvas3D}>
              <Canvas
                camera={{ position: [0, 3, 12], fov: 50 }}
                gl={{ antialias: true, alpha: false }}
                style={{ background: '#070710', borderRadius: '16px' }}
                dpr={[1, 1.5]}
              >
                <MetricsChart3D metric={activeMetric} autoRotate />
              </Canvas>
            </div>
          </div>

          {/* Right metric cards */}
          <div className={styles.cardCol}>
            {MAIN_METRICS.slice(2, 4).map((m, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div
                  className={`glass-card ${styles.metricCard} ${activeMetric === m.label.toLowerCase() ? styles.metricCardActive : ''}`}
                  style={{ '--m-color': m.colorHex, cursor: 'pointer' }}
                  onClick={() => setActiveMetric(m.label.toLowerCase())}
                >
                  <div className={styles.metricValue} style={{ color: m.colorHex }}>
                    <AnimatedCounter value={m.value} decimals={m.decimals} suffix={m.suffix} />
                  </div>
                  <div className={styles.metricLabel}>{m.label}</div>
                  <div className={styles.metricBadge} style={{ background: `${m.colorHex}20`, color: m.colorHex }}>
                    {m.interpretation}
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{
                      width: `${Math.min((m.value / m.max) * 100, 100)}%`,
                      background: m.colorHex,
                    }} />
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>

        {/* Interpretation cards */}
        <div className={styles.interpSection}>
          <SectionReveal>
            <h2 className="h2" style={{ marginBottom: '2rem', textAlign: 'center' }}>
              Understanding the <span className="text-gradient-primary">Metrics</span>
            </h2>
          </SectionReveal>

          <div className={styles.interpGrid}>
            {INTERP_CARDS.map((card, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="glass-card" style={{ borderColor: `${card.color}30`, height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem', color: card.color }}>{card.icon}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{card.label}</h3>
                  </div>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {card.body}
                  </p>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                    background: 'rgba(0,0,0,0.4)', padding: '0.625rem 0.875rem',
                    borderRadius: '8px', color: card.color, border: `1px solid ${card.color}20`,
                  }}>
                    {card.formula}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <SectionReveal>
          <div className={styles.tableSection}>
            <h2 className="h2" style={{ marginBottom: '1.5rem' }}>
              Metric <span className="text-gradient-primary">Summary</span>
            </h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {['Metric', 'Score', 'Range', 'Interpretation', 'Status'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MAIN_METRICS.map((m, i) => (
                    <tr key={i}>
                      <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: m.colorHex }}>{m.label}</span></td>
                      <td><span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.value.toFixed(m.decimals)}{m.suffix}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.range}</td>
                      <td style={{ fontSize: '0.875rem' }}>{INTERP_CARDS[i]?.body.split('.')[0] + '.'}</td>
                      <td>
                        <span style={{
                          background: `${m.colorHex}20`, color: m.colorHex, padding: '0.2rem 0.6rem',
                          borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                        }}>{m.interpretation}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
