'use client';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TorusKnot } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './about.module.css';

function TorusKnotBg() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.07;
      ref.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });
  return (
    <TorusKnot ref={ref} args={[2, 0.5, 128, 32]}>
      <meshStandardMaterial color="#6366f1" transparent opacity={0.08} wireframe />
    </TorusKnot>
  );
}

const TECH_STACK = [
  { name: 'PyTorch',        emoji: '🔥', color: '#ee4c2c', desc: 'Deep learning framework'    },
  { name: 'Wav2Vec2',       emoji: '🎙️', color: '#06b6d4', desc: 'Audio embeddings'            },
  { name: 'HuggingFace',    emoji: '🤗', color: '#f59e0b', desc: 'Model hub & pipelines'       },
  { name: 'MediaPipe',      emoji: '👁️', color: '#10b981', desc: 'Face landmark detection'     },
  { name: 'OpenCV',         emoji: '📷', color: '#6366f1', desc: 'Video frame processing'      },
  { name: 'Librosa',        emoji: '🎵', color: '#8b5cf6', desc: 'Audio signal processing'     },
  { name: 'Scikit-image',   emoji: '🖼️', color: '#ec4899', desc: 'Image quality metrics'       },
  { name: 'ffmpeg',         emoji: '🎬', color: '#f43f5e', desc: 'Video encoding & muxing'     },
  { name: 'Next.js 15',     emoji: '⚡', color: '#f1f5f9', desc: 'React framework (this site)' },
  { name: 'Three.js / R3F', emoji: '🌐', color: '#06b6d4', desc: '3D scenes (this site)'       },
  { name: 'GSAP',           emoji: '🎞️', color: '#88ce02', desc: 'Animations (this site)'      },
  { name: 'Lenis',          emoji: '🌊', color: '#8b5cf6', desc: 'Smooth scroll'               },
];

const ACKNOWLEDGEMENTS = [
  {
    name: 'facebook/wav2vec2-base',
    desc: 'Pre-trained self-supervised audio representation model used for extracting 768-dimensional embeddings from 16kHz speech.',
    color: '#06b6d4',
    link: 'https://huggingface.co/facebook/wav2vec2-base',
  },
  {
    name: 'MediaPipe Face Mesh',
    desc: '468-point face landmark detection used to precisely locate and extract the mouth region across video frames.',
    color: '#10b981',
    link: 'https://google.github.io/mediapipe/',
  },
  {
    name: 'Griffin-Lim Algorithm',
    desc: 'Phase reconstruction algorithm used to convert interpolated STFT magnitude spectrograms back to time-domain waveforms.',
    color: '#8b5cf6',
    link: 'https://librosa.org',
  },
  {
    name: 'CIE LAB Color Transfer',
    desc: 'Reinhard et al. (2001) color transfer technique applied in LAB space to maintain color consistency in restored mouth regions.',
    color: '#f59e0b',
    link: 'https://ieeexplore.ieee.org/document/946629',
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* 3D background */}
      <div className={styles.bg3D}>
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }} gl={{ alpha: true }} style={{ background: 'transparent' }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.5} />
          <pointLight position={[4, 4, 4]} intensity={0.5} color="#6366f1" />
          <TorusKnotBg />
          <EffectComposer>
            <Bloom luminanceThreshold={0.1} intensity={0.6} />
          </EffectComposer>
        </Canvas>
      </div>

      <div className={styles.content}>
        {/* Hero */}
        <header className={styles.hero}>
          <SectionReveal>
            <div className="badge badge-primary" style={{ margin: '0 auto 1.5rem', width: 'fit-content' }}>
              Capstone Project · 2025–26
            </div>
            <h1 className="h1" style={{ textAlign: 'center' }}>
              About <span className="text-gradient-primary">AV-Restoration</span>
            </h1>
            <p style={{ textAlign: 'center', maxWidth: '55ch', margin: '1.5rem auto 0', fontSize: '1.1rem' }}>
              A cross-modal deep learning research project for audio-visual packet loss concealment,
              developed as a Semester VI Capstone at our institution.
            </p>
          </SectionReveal>
        </header>

        <div className="container">
          {/* Project info */}
          <SectionReveal>
            <div className={styles.infoCards}>
              {[
                { label: 'Project Title', value: 'Cross-Modal Audio-Visual Packet Loss Concealment', icon: '📄' },
                { label: 'Context', value: 'B.E. Capstone Project — Semester VI (2025–26)', icon: '🎓' },
                { label: 'Approach', value: 'Retrieval-based cross-modal restoration (no end-to-end training)', icon: '🔬' },
                { label: 'GitHub', value: 'sudarshan026/AV-Restoration', icon: '⬡', link: 'https://github.com/sudarshan026/AV-Restoration' },
              ].map((item, i) => (
                <div key={i} className={`glass-card ${styles.infoCard}`}>
                  <span className={styles.infoIcon}>{item.icon}</span>
                  <div>
                    <div className={styles.infoLabel}>{item.label}</div>
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                        {item.value} ↗
                      </a>
                    ) : (
                      <div className={styles.infoValue}>{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>

          {/* Tech stack */}
          <section className={styles.section}>
            <SectionReveal>
              <h2 className="h2" style={{ marginBottom: '2rem' }}>
                Technology <span className="text-gradient-primary">Stack</span>
              </h2>
            </SectionReveal>

            <div className={styles.techGrid}>
              {TECH_STACK.map((tech, i) => (
                <SectionReveal key={i} delay={(i % 4) * 0.08}>
                  <div
                    className={`glass-card ${styles.techCard}`}
                    style={{ '--tech-color': tech.color, borderColor: `${tech.color}20` }}
                  >
                    <div className={styles.techEmoji}>{tech.emoji}</div>
                    <div className={styles.techName} style={{ color: tech.color }}>{tech.name}</div>
                    <div className={styles.techDesc}>{tech.desc}</div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </section>

          {/* Acknowledgements */}
          <section className={styles.section}>
            <SectionReveal>
              <h2 className="h2" style={{ marginBottom: '2rem' }}>
                Acknowledgements
              </h2>
            </SectionReveal>

            <div className={styles.ackGrid}>
              {ACKNOWLEDGEMENTS.map((ack, i) => (
                <SectionReveal key={i} delay={i * 0.1}>
                  <a href={ack.link} target="_blank" rel="noopener noreferrer" className={`glass-card ${styles.ackCard}`} style={{ borderColor: `${ack.color}30` }}>
                    <div style={{ width: 4, height: '100%', minHeight: 60, background: ack.color, borderRadius: '4px', flexShrink: 0 }} />
                    <div>
                      <div className={styles.ackName} style={{ color: ack.color }}>{ack.name}</div>
                      <p className={styles.ackDesc}>{ack.desc}</p>
                    </div>
                  </a>
                </SectionReveal>
              ))}
            </div>
          </section>

          {/* GitHub CTA */}
          <SectionReveal>
            <div className={styles.ctaBlock}>
              <div className={styles.ctaGlow} />
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-secondary)' }}>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <h2 className="h2" style={{ margin: '1rem 0 0.75rem' }}>View the Source Code</h2>
              <p style={{ maxWidth: '45ch', textAlign: 'center', marginBottom: '2rem' }}>
                The full pipeline, evaluation scripts, and batch generation tools are available on GitHub.
              </p>
              <a
                href="https://github.com/sudarshan026/AV-Restoration"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ fontSize: '1rem', padding: '0.875rem 2.5rem' }}
              >
                Open on GitHub ↗
              </a>
            </div>
          </SectionReveal>
        </div>
      </div>
    </div>
  );
}
