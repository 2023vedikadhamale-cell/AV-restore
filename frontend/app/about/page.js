'use client';
import Link from 'next/link';

const PROJECT_INFO = [
  { label: 'Project Title', value: 'Cross-Modal Audio-Visual Packet Loss Concealment', icon: '📄' },
  { label: 'Context', value: 'B.E. Capstone Project — Semester VI (2025–26)', icon: '🎓' },
  { label: 'Approach', value: 'Retrieval-based cross-modal restoration (no end-to-end training)', icon: '🔬' },
];

const LINKS = [
  {
    label: 'GitHub Repository',
    desc: 'Full pipeline source code, evaluation scripts, and batch generation tools.',
    href: 'https://github.com/sudarshan026/AV-Restoration',
    icon: '⬡',
    color: '#111827',
  },
  {
    label: 'Wav2Vec2 — HuggingFace',
    desc: 'Pre-trained self-supervised audio model used for 768-dim speech embeddings.',
    href: 'https://huggingface.co/facebook/wav2vec2-base',
    icon: '🎙️',
    color: '#06b6d4',
  },
  {
    label: 'MediaPipe Face Mesh',
    desc: '468-point face landmark detection used to extract mouth regions.',
    href: 'https://google.github.io/mediapipe/',
    icon: '👁️',
    color: '#10b981',
  },
  {
    label: 'Griffin-Lim / Librosa',
    desc: 'Phase reconstruction algorithm for converting STFT magnitudes back to waveforms.',
    href: 'https://librosa.org',
    icon: '🔊',
    color: '#8b5cf6',
  },
  {
    label: 'CIE LAB Color Transfer',
    desc: 'Reinhard et al. (2001) — color transfer in LAB space for visual consistency.',
    href: 'https://ieeexplore.ieee.org/document/946629',
    icon: '🎨',
    color: '#f59e0b',
  },
];

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '80px', background: 'radial-gradient(ellipse at top, #ffffff 0%, #f8f8f6 100%)', minHeight: '100vh' }}>

      {/* ─── HERO ─── */}
      <section style={{ padding: '80px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            background: '#fef3c7', color: '#92400e',
            fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.05em', marginBottom: '28px',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            Capstone Project · 2025–26
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800, color: '#111827',
            letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '20px',
          }}>
            About<br />
            <span style={{ color: '#9ca3af' }}>AV-Restoration</span>
          </h1>
          <p style={{
            fontSize: '1.15rem', color: '#6b7280',
            lineHeight: 1.7, maxWidth: '600px', margin: '0 auto',
          }}>
            A cross-modal deep learning research project for audio-visual
            packet loss concealment — restoring what network degradation destroys.
          </p>
        </div>
      </section>

      {/* ─── PROJECT OVERVIEW ─── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '32px',
          }}>
            <span style={{
              fontSize: '13px', fontWeight: 800, color: '#6366f1',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>01</span>
            <span style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{
              fontSize: '13px', fontWeight: 700, color: '#9ca3af',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>Overview</span>
            <span style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          {/* Info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {PROJECT_INFO.map((item, i) => (
              <div key={i} style={{
                background: '#ffffff', borderRadius: '16px',
                padding: '24px 28px', border: '1px solid #e5e7eb',
                display: 'flex', alignItems: 'center', gap: '20px',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: '#f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', flexShrink: 0,
                }}>{item.icon}</div>
                <div>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '4px',
                  }}>{item.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{
            background: '#ffffff', borderRadius: '20px',
            padding: '32px', border: '1px solid #e5e7eb',
          }}>
            <p style={{ fontSize: '1.05rem', color: '#4b5563', lineHeight: 1.8, marginBottom: '16px' }}>
              In real-time video conferencing and streaming, network packet loss of even 10–30%
              can render speech unintelligible and corrupt facial regions — especially around the
              mouth area where lip movements encode crucial communication signals.
            </p>
            <p style={{ fontSize: '1.05rem', color: '#4b5563', lineHeight: 1.8 }}>
              This project implements a <strong style={{ color: '#111827' }}>retrieval-based cross-modal restoration pipeline</strong> that
              leverages the natural correlation between audio and video signals. Audio embeddings
              guide video frame repair, while signal processing techniques restore corrupted
              audio segments — all without requiring end-to-end deep learning training.
            </p>
          </div>
        </div>
      </section>

      {/* ─── REFERENCES & LINKS ─── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '32px',
          }}>
            <span style={{
              fontSize: '13px', fontWeight: 800, color: '#6366f1',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>02</span>
            <span style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{
              fontSize: '13px', fontWeight: 700, color: '#9ca3af',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>References & Links</span>
            <span style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {LINKS.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#ffffff', borderRadius: '16px',
                  padding: '24px 28px', border: '1px solid #e5e7eb',
                  display: 'flex', alignItems: 'center', gap: '20px',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${link.color}40`;
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: `${link.color}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', flexShrink: 0,
                }}>{link.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 700, fontSize: '16px', color: '#111827',
                    marginBottom: '4px',
                  }}>{link.label}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.5 }}>
                    {link.desc}
                  </div>
                </div>
                <div style={{
                  fontSize: '18px', color: '#9ca3af', flexShrink: 0,
                  fontWeight: 300,
                }}>↗</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section style={{ padding: '96px 24px', background: '#fbbf24', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, color: '#111827',
            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px',
          }}>
            Explore the source
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#78350f', lineHeight: 1.7, marginBottom: '32px', fontWeight: 500 }}>
            The full pipeline, evaluation scripts, and batch generation tools are open source.
          </p>
          <a
            href="https://github.com/sudarshan026/AV-Restoration"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '14px 36px', borderRadius: '999px',
              background: '#111827', color: '#ffffff',
              fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
            }}
          >
            Open on GitHub ↗
          </a>
        </div>
      </section>
    </div>
  );
}
