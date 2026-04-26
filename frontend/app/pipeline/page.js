'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const stages = [
  {
    num: '01', label: 'Data Loading',
    title: 'Ingesting Raw A/V Streams',
    body: 'The pipeline receives a raw video file and decodes it into individual frames and 16kHz mono audio. Both modalities are normalized and stored as tensors for downstream processing.',
    icon: '⬢',
  },
  {
    num: '02', label: 'Data Corruption',
    title: 'Stochastic Masking',
    body: 'Packet loss is simulated via stochastic masking — randomly hiding mouth regions in video frames and zeroing audio segments. This mimics real-world network degradation patterns affecting both modalities.',
    icon: '⚡',
  },
  {
    num: '03', label: 'Feature Encoding',
    title: 'VQ-VAE & Wav2Vec Encoding',
    body: 'Corrupted frames pass through a Visual Encoder (VQ-VAE) to produce latent representations. Corrupted audio is processed by the Audio Encoder (Wav2Vec) to extract embedding vectors. These form the cross-modal tokens.',
    icon: '⬡',
  },
  {
    num: '04', label: 'Cross-Modal Attention',
    title: 'Latent–Embedding Fusion',
    body: 'Cross-Modal Attention bridges the visual latents and audio embeddings — exchanging context between modalities so each branch can leverage the other\'s clean signal information for guided restoration.',
    icon: '◉',
  },
  {
    num: '05', label: 'Bi-Directional Diffusion',
    title: 'Visual & Audio U-Nets',
    body: 'Two parallel U-Net diffusion models run simultaneously: the Visual U-Net receives audio context to restore video frames, while the Audio U-Net receives visual context to reconstruct corrupted audio — ensuring synchronized output.',
    icon: '⬡',
  },
  {
    num: '06', label: 'Reconstruction & Output',
    title: 'Decoding & Synchronization',
    body: 'The Visual Decoder and Audio Decoder reconstruct the final streams from the diffusion outputs. The restored video and audio are muxed into a synchronized output file using ffmpeg.',
    icon: '▣',
  },
];

export default function PipelinePage() {
  const [activeStage, setActiveStage] = useState(0);
  const stageRefs = useRef([]);

  useEffect(() => {
    stageRefs.current.forEach((el, i) => {
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setActiveStage(i),
        onEnterBack: () => setActiveStage(i),
      });
    });
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div style={{ paddingTop: '80px', background: 'radial-gradient(ellipse at top, #ffffff 0%, #f8f8f6 100%)', minHeight: '100vh' }}>

      {/* ─── PAGE HEADER ─── */}
      <header style={{
        textAlign: 'center',
        padding: '80px 24px 60px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        background: 'radial-gradient(ellipse at top, #ffffff 0%, #f8f8f6 100%)',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#9ca3af', marginBottom: '16px',
          }}>
            <span style={{ width: '24px', height: '2px', background: '#d1d5db' }} />
            6-Stage Process
            <span style={{ width: '24px', height: '2px', background: '#d1d5db' }} />
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800, color: '#111827',
            letterSpacing: '-0.04em', lineHeight: 1.1,
            marginBottom: '16px',
          }}>
            Pipeline Explorer
          </h1>
          <p style={{
            fontSize: '1.15rem', color: '#6b7280', lineHeight: 1.7,
            maxWidth: '560px', margin: '0 auto',
          }}>
            Scroll through each stage of the cross-modal AV restoration pipeline.
            From raw input to restored output — every step explained.
          </p>
        </div>
      </header>

      {/* ─── STAGE SECTIONS ─── */}
      {stages.map((stage, i) => {
        const isActive = activeStage === i;
        const isEven = i % 2 === 0;
        return (
          <section
            key={i}
            ref={el => stageRefs.current[i] = el}
            style={{
              padding: '0',
              background: isEven ? '#ffffff' : '#f8f8f6',
              borderBottom: '1px solid #f3f4f6',
              transition: 'background 0.4s ease',
            }}
          >
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              padding: '80px 24px',
            }}>
              {/* Step number + label row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                marginBottom: '32px',
              }}>
                <div style={{
                  width: '48px', height: '48px',
                  borderRadius: '14px',
                  background: '#111827',
                  color: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '14px', fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {stage.num}
                </div>
                <div style={{
                  fontSize: '13px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: '#9ca3af',
                }}>
                  {stage.label}
                </div>
                <div style={{
                  flex: 1, height: '1px', background: '#e5e7eb',
                }} />
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 700, color: '#111827',
                letterSpacing: '-0.03em', lineHeight: 1.15,
                marginBottom: '20px',
              }}>
                {stage.title}
              </h2>

              {/* Body */}
              <p style={{
                fontSize: '1.1rem', color: '#6b7280',
                lineHeight: 1.75, maxWidth: '650px',
              }}>
                {stage.body}
              </p>

              {/* ── Stage-specific visuals ── */}
              <div style={{ marginTop: '40px' }}>

                {/* Stage 01: Data Loading — video placeholder */}
                {i === 0 && (
                  <div style={{
                    background: '#f3f4f6', borderRadius: '20px',
                    overflow: 'hidden', border: '1px solid #e5e7eb',
                  }}>
                    <div style={{ width: '100%', aspectRatio: '16/9' }}>
                      <video 
                        src="/original_video.mp4" 
                        controls playsInline 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                )}

                {/* Stage 02: Corruption — before/after placeholders */}
                {i === 1 && (
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {['Clean Frame', 'Corrupted Frame'].map((lbl, fi) => (
                      <div key={fi} style={{
                        flex: 1, background: '#f3f4f6', borderRadius: '16px',
                        aspectRatio: '4/3', border: '1px solid #e5e7eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', gap: '8px',
                      }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '10px',
                          background: fi === 0 ? '#d1fae5' : '#fee2e2',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '18px',
                        }}>
                          {fi === 0 ? '✓' : '✕'}
                        </div>
                        <span style={{
                          fontSize: '13px', fontWeight: 600,
                          color: fi === 0 ? '#059669' : '#dc2626',
                        }}>{lbl}</span>
                      </div>
                    ))}
                    <div style={{
                      position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                      fontSize: '24px', color: '#d1d5db', fontWeight: 300, display: 'none',
                    }}>→</div>
                  </div>
                )}

                {/* Stage 03: Encoding — simple flow diagram */}
                {i === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { label: 'Audio', sub: '16kHz mono', model: 'Wav2Vec2', output: '768-dim embedding', accent: '#0ea5e9' },
                      { label: 'Video', sub: '30fps frames', model: 'VAE Encoder', output: '4×32×32 latent', accent: '#8b5cf6' },
                    ].map((row, ri) => (
                      <div key={ri} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        background: '#ffffff', borderRadius: '16px',
                        padding: '20px 24px', border: '1px solid #e5e7eb',
                      }}>
                        <div style={{
                          minWidth: '100px',
                        }}>
                          <div style={{ fontWeight: 700, color: '#111827', fontSize: '15px' }}>{row.label}</div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{row.sub}</div>
                        </div>
                        <div style={{ flex: 1, height: '2px', background: '#e5e7eb', position: 'relative' }}>
                          <div style={{
                            position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                            fontSize: '11px', fontWeight: 600, color: row.accent,
                            background: isEven ? '#ffffff' : '#f8f8f6', padding: '0 8px',
                            fontFamily: "'JetBrains Mono', monospace",
                          }}>
                            {row.model}
                          </div>
                        </div>
                        <div style={{
                          background: `${row.accent}10`, border: `1px solid ${row.accent}30`,
                          borderRadius: '10px', padding: '10px 16px',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '13px', fontWeight: 600, color: row.accent,
                          whiteSpace: 'nowrap',
                        }}>
                          {row.output}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stage 04: A→V Restoration — placeholder */}
                {i === 3 && (
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {[
                      { label: 'Corrupted Input', video: '/corrupted_video.mp4', accent: '#f43f5e' },
                      { label: 'Restored Output', video: '/Restored_video.mp4', accent: '#10b981' }
                    ].map((item, idx) => (
                      <div key={idx} style={{
                        flex: 1, background: '#ffffff', borderRadius: '16px',
                        overflow: 'hidden', border: `1px solid ${item.accent}30`,
                      }}>
                        <div style={{ width: '100%', aspectRatio: '4/3', background: '#f3f4f6' }}>
                          <video 
                            src={item.video} 
                            controls playsInline 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ padding: '16px', textAlign: 'center', fontWeight: 600, color: item.accent, fontSize: '14px' }}>
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stage 05: V→A Restoration — method cards */}
                {i === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Audio Players */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                      {[
                        { label: 'Corrupted Audio', src: '/corrupted_audio.wav', accent: '#f43f5e' },
                        { label: 'Restored Audio', src: '/restored_audio.wav', accent: '#10b981' },
                      ].map((item, ii) => (
                        <div key={ii} style={{
                          flex: 1, background: '#ffffff', borderRadius: '16px',
                          padding: '24px', border: `1px solid ${item.accent}30`,
                        }}>
                          <div style={{ fontWeight: 700, color: '#111827', fontSize: '15px', marginBottom: '16px' }}>
                            {item.label}
                          </div>
                          <audio controls src={item.src} style={{ width: '100%', height: '40px' }} />
                        </div>
                      ))}
                    </div>
                    {/* Method Cards */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                      {[
                        { label: 'Short gap (≤100ms)', method: 'Crossfade blend', accent: '#10b981' },
                        { label: 'Long gap (>100ms)', method: 'STFT interpolation', accent: '#f59e0b' },
                      ].map((item, ii) => (
                        <div key={ii} style={{
                          flex: 1, background: '#ffffff', borderRadius: '16px',
                          padding: '28px 24px', border: '1px solid #e5e7eb',
                        }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: `${item.accent}15`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '16px',
                          }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.accent }} />
                          </div>
                          <div style={{ fontWeight: 700, color: '#111827', fontSize: '15px', marginBottom: '4px' }}>
                            {item.label}
                          </div>
                          <div style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '13px', color: item.accent, fontWeight: 600,
                          }}>
                            {item.method}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                {/* Stage 06: Output — placeholder for final deliverables */}
                {i === 5 && (
                  <div>
                    {/* Video placeholder */}
                    <div style={{
                      background: '#111827', borderRadius: '20px',
                      overflow: 'hidden', border: '1px solid #e5e7eb',
                      marginBottom: '20px',
                    }}>
                      <div style={{ width: '100%', aspectRatio: '16/9' }}>
                        <video 
                          src="/Restored_video.mp4" 
                          controls playsInline 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                    {/* Output cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      {[
                        { label: 'Restored Video', icon: '🎬', file: 'Restored_video.mp4', href: '/Restored_video.mp4' },
                        { label: 'Restored Audio', icon: '🔊', file: 'restored_audio.wav', href: '/restored_audio.wav' },
                        { label: 'Corrupted Video', icon: '🖥️', file: 'corrupted_video.mp4', href: '/corrupted_video.mp4' },
                      ].map((out, oi) => (
                        <a key={oi} href={out.href} target="_blank" rel="noopener noreferrer" style={{
                          background: '#ffffff', borderRadius: '14px',
                          padding: '20px', textAlign: 'center',
                          border: '1px solid #e5e7eb', textDecoration: 'none',
                          display: 'block'
                        }}>
                          <div style={{ fontSize: '24px', marginBottom: '8px' }}>{out.icon}</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                            {out.label}
                          </div>
                          <div style={{
                            fontSize: '11px', color: '#9ca3af',
                            fontFamily: "'JetBrains Mono', monospace",
                          }}>{out.file}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </section>
        );
      })}

      {/* ─── BOTTOM CTA ─── */}
      <section style={{
        padding: '96px 24px', background: '#fbbf24', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, color: '#111827',
            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px',
          }}>
            Try it yourself
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#78350f', lineHeight: 1.7, marginBottom: '32px', fontWeight: 500 }}>
            Upload your own video and see the restoration pipeline in action.
          </p>
          <a href="/demo" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px 36px', borderRadius: '999px',
            background: '#111827', color: '#ffffff',
            fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
          >
            Open Interactive Demo
          </a>
        </div>
      </section>

      {/* Responsive */}
      <style jsx global>{`
        @media (max-width: 600px) {
          section > div {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
