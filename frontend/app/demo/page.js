'use client';
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

const MODES = [
  { id: 'video', label: 'Video Comparison', icon: '▶' },
  { id: 'audio', label: 'Audio Comparison', icon: '🔊' },
];

export default function DemoPage() {
  const [mode, setMode] = useState('video');

  return (
    <div style={{ paddingTop: '80px', background: 'radial-gradient(ellipse at top, #ffffff 0%, #f8f8f6 100%)', minHeight: '100vh' }}>

      {/* ─── HERO ─── */}
      <section style={{ padding: '80px 24px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#9ca3af', marginBottom: '20px',
          }}>
            <span style={{ width: '24px', height: '2px', background: '#d1d5db' }} />
            Interactive Demo
            <span style={{ width: '24px', height: '2px', background: '#d1d5db' }} />
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800, color: '#111827',
            letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '20px',
          }}>
            See the<br />
            <span style={{ color: '#9ca3af' }}>Difference</span>
          </h1>
          <p style={{
            fontSize: '1.15rem', color: '#6b7280',
            lineHeight: 1.7, maxWidth: '550px', margin: '0 auto',
          }}>
            Compare corrupted and restored video and audio side-by-side.
            Play each to hear and see the restoration quality.
          </p>
        </div>
      </section>

      {/* ─── MODE TABS ─── */}
      <section style={{ padding: '0 24px 48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', gap: '8px',
            background: '#ffffff', borderRadius: '16px',
            padding: '6px', border: '1px solid #e5e7eb',
            width: 'fit-content', margin: '0 auto',
          }}>
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', borderRadius: '12px',
                  border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 600,
                  background: mode === m.id ? '#111827' : 'transparent',
                  color: mode === m.id ? '#ffffff' : '#6b7280',
                  transition: 'all 0.3s ease',
                }}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VIDEO COMPARISON ─── */}
      {mode === 'video' && (
        <section style={{ padding: '0 24px 96px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '24px',
            }}>
              {[
                { label: 'Corrupted Input', sub: 'Before restoration', video: '/corrupted_video.mp4', accent: '#f43f5e' },
                { label: 'Restored Output', sub: 'After restoration', video: '/Restored_video.mp4', accent: '#10b981' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#ffffff', borderRadius: '20px',
                  overflow: 'hidden', border: `1px solid ${item.accent}20`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)'; }}
                >
                  <div style={{
                    width: '100%', aspectRatio: '16/9', background: '#111827',
                  }}>
                    <video
                      src={item.video}
                      controls
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      marginBottom: '4px',
                    }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: item.accent,
                      }} />
                      <span style={{
                        fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.08em', color: item.accent,
                      }}>{item.sub}</span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Original video */}
            <div style={{ marginTop: '24px' }}>
              <div style={{
                background: '#ffffff', borderRadius: '20px',
                overflow: 'hidden', border: '1px solid #e5e7eb',
                boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: '100%', aspectRatio: '21/9', background: '#111827',
                }}>
                  <video
                    src="/original_video.mp4"
                    controls
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '4px',
                  }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#6366f1',
                    }} />
                    <span style={{
                      fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.08em', color: '#6366f1',
                    }}>Reference</span>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                    Original Video
                  </div>
                </div>
              </div>
            </div>

            {/* Info row */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px', marginTop: '24px',
            }}>
              {[
                { label: 'Left Panel', value: 'Corrupted stream', color: '#f43f5e' },
                { label: 'Right Panel', value: 'Restored stream', color: '#10b981' },
                { label: 'Method', value: 'Cross-Modal Attention + STFT', color: '#6366f1' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#ffffff', borderRadius: '14px',
                  padding: '16px 20px', border: '1px solid #e5e7eb',
                }}>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '4px',
                  }}>{item.label}</div>
                  <div style={{
                    fontSize: '14px', fontWeight: 600, color: item.color,
                  }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── AUDIO COMPARISON ─── */}
      {mode === 'audio' && (
        <section style={{ padding: '0 24px 96px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Original Audio', sub: 'Clean reference audio', src: '/original_audio.wav', accent: '#6366f1' },
                { label: 'Corrupted Audio', sub: 'Audio with packet loss gaps', src: '/corrupted_audio.wav', accent: '#f43f5e' },
                { label: 'Restored Audio', sub: 'After STFT interpolation + Griffin-Lim', src: '/restored_audio.wav', accent: '#10b981' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#ffffff', borderRadius: '20px',
                  padding: '28px 32px', border: `1px solid ${item.accent}25`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    marginBottom: '20px',
                  }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: `${item.accent}10`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px',
                    }}>🔊</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px', color: '#111827' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                        {item.sub}
                      </div>
                    </div>
                  </div>
                  <audio
                    controls
                    src={item.src}
                    style={{ width: '100%', height: '48px', borderRadius: '8px' }}
                  />
                </div>
              ))}
            </div>

            {/* Audio method info */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '12px', marginTop: '24px',
            }}>
              {[
                { label: 'Short Gaps (≤100ms)', method: 'Linear crossfade from boundary segments with 20ms fade windows', color: '#10b981' },
                { label: 'Long Gaps (>100ms)', method: 'STFT log-magnitude interpolation + Griffin-Lim phase reconstruction (32 iter)', color: '#f59e0b' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#ffffff', borderRadius: '16px',
                  padding: '24px', border: '1px solid #e5e7eb',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '10px',
                  }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: item.color,
                    }} />
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>
                      {item.label}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
                    {item.method}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FOOTER CTA ─── */}
      <section style={{ padding: '96px 24px', background: '#fbbf24', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, color: '#111827',
            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px',
          }}>
            Explore the pipeline
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#78350f', lineHeight: 1.7, marginBottom: '32px', fontWeight: 500 }}>
            See how each stage of the restoration process works, step by step.
          </p>
          <Link href="/pipeline" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px 36px', borderRadius: '999px',
            background: '#111827', color: '#ffffff',
            fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
          }}>
            View Pipeline →
          </Link>
        </div>
      </section>

      {/* Responsive */}
      <style jsx global>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
