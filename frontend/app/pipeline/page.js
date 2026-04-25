'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoSlider from '@/components/ui/VideoSlider';
import WaveformViz from '@/components/ui/WaveformViz';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import styles from './pipeline.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const stages = [
  {
    num: '01', label: 'Data Loading', color: '#06b6d4',
    title: 'Ingesting Raw A/V Streams',
    body: 'The pipeline receives a raw video file and decodes it into 30fps frames and 16kHz mono audio. Both streams are normalized and stored as NumPy arrays for processing.',
    icon: '⬢',
  },
  {
    num: '02', label: 'Stream Corruption', color: '#f43f5e',
    title: 'Simulating Packet Loss',
    body: 'Packet loss is simulated by zeroing random segments of the audio and blacking out the mouth region in video frames — mimicking real network degradation patterns.',
    icon: '⚡',
  },
  {
    num: '03', label: 'Encoding', color: '#8b5cf6',
    title: 'Cross-Modal Feature Extraction',
    body: 'Wav2Vec2 transforms audio into 768-dimensional embeddings. The VAE encodes video frames into a 4×32×32 latent space. These become the "tokens" for cross-modal reasoning.',
    icon: '⬡',
  },
  {
    num: '04', label: 'A→V Restoration', color: '#6366f1',
    title: 'Audio-Guided Video Healing',
    body: 'For each corrupted frame, its audio embedding is compared (cosine similarity) against a reference bank of clean frame→audio pairs. The top-k matches are blended, color-transferred in LAB space, then feathered into the corrupted frame.',
    icon: '◉',
  },
  {
    num: '05', label: 'V→A Restoration', color: '#10b981',
    title: 'Video-Guided Audio Recovery',
    body: 'Short gaps (≤100ms) are bridged with crossfade from surrounding clean segments. Long gaps use STFT interpolation — the spectrogram between clean anchor frames is reconstructed and converted back to waveform via Griffin-Lim.',
    icon: '⬡',
  },
  {
    num: '06', label: 'Evaluation', color: '#f59e0b',
    title: 'Quantitative Assessment',
    body: 'SSIM and PSNR measure video reconstruction quality. STOI assesses speech intelligibility. LSE-D (Lip Sync Error Distance) verifies temporal alignment between the restored mouth and audio.',
    icon: '◈',
  },
  {
    num: '07', label: 'Output', color: '#ec4899',
    title: 'Delivering Restored Streams',
    body: 'The restored video frames are re-encoded with ffmpeg at the original bitrate. The pipeline produces separate restored audio, restored video, and a side-by-side comparison clip.',
    icon: '▣',
  },
];

const metrics = [
  { label: 'SSIM', value: 0.9962, suffix: '', decimals: 4, color: '#10b981', interpretation: 'Excellent', max: 1 },
  { label: 'PSNR', value: 42.4,   suffix: ' dB', decimals: 1, color: '#6366f1', interpretation: 'Very High', max: 50 },
  { label: 'STOI', value: 0.62,   suffix: '', decimals: 2, color: '#f59e0b', interpretation: 'Moderate', max: 1 },
  { label: 'LSE-D', value: 1.02,  suffix: '', decimals: 2, color: '#ec4899', interpretation: 'Proxy Metric', max: 5 },
];

export default function PipelinePage() {
  const [activeStage, setActiveStage] = useState(0);
  const stageRefs = useRef([]);
  const sidebarRef = useRef(null);

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
    <div className={styles.page}>
      {/* Pipeline sidebar */}
      <div className={styles.sidebar} ref={sidebarRef}>
        {stages.map((s, i) => (
          <div key={i} className={styles.sidebarItem}>
            {i < stages.length - 1 && (
              <div className={styles.sidebarLine}>
                <div
                  className={styles.sidebarLineFill}
                  style={{ height: activeStage > i ? '100%' : '0%' }}
                />
              </div>
            )}
            <button
              className={`${styles.sidebarDot} ${activeStage === i ? styles.dotActive : ''} ${activeStage > i ? styles.dotDone : ''}`}
              style={activeStage === i ? { background: s.color, borderColor: s.color, boxShadow: `0 0 16px ${s.color}` } : {}}
              onClick={() => stageRefs.current[i]?.scrollIntoView({ behavior: 'smooth' })}
              title={s.label}
            />
            {activeStage === i && (
              <span className={styles.sidebarLabel} style={{ color: s.color }}>
                {s.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className={styles.pageHeader}>
        <div className="container">
          <span className="section-label">7-Stage Process</span>
          <h1 className="h1" style={{ marginTop: '1rem' }}>
            Pipeline <span className="text-gradient-primary">Explorer</span>
          </h1>
          <p style={{ maxWidth: '60ch', marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Scroll through each stage of the cross-modal AV restoration pipeline.
            From raw input to restored output — every step explained with visuals.
          </p>
        </div>
      </header>

      {/* Stage sections */}
      {stages.map((stage, i) => (
        <section
          key={i}
          ref={el => stageRefs.current[i] = el}
          className={`${styles.stageSection} ${activeStage === i ? styles.stageSectionActive : ''}`}
          style={{ '--stage-color': stage.color }}
        >
          <div className="container">
            <div className={styles.stageInner}>
              {/* Stage header */}
              <div className={styles.stageHeader}>
                <div className={styles.stageNum} style={{ color: stage.color, borderColor: `${stage.color}40` }}>
                  {stage.num}
                </div>
                <div>
                  <div className={`badge`} style={{
                    background: `${stage.color}15`, color: stage.color, border: `1px solid ${stage.color}40`,
                    marginBottom: '0.75rem',
                  }}>
                    {stage.icon} {stage.label}
                  </div>
                  <h2 className="h2">{stage.title}</h2>
                  <p style={{ marginTop: '1rem', maxWidth: '55ch' }}>{stage.body}</p>
                </div>
              </div>

              {/* Stage visual */}
              <div className={styles.stageVisual}>
                {i === 0 && (
                  <div className={styles.videoCard}>
                    <div style={{ marginBottom: '1rem' }}>
                      <video
                        src="/assets/videos/original.mp4"
                        autoPlay muted loop playsInline
                        style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}
                      />
                    </div>
                    <WaveformViz audioUrl="/assets/audio/original.wav" color="#06b6d4" label="Original Audio Waveform" />
                  </div>
                )}

                {i === 1 && (
                  <div className={styles.corruptionDemo}>
                    <div className={styles.splitFrame}>
                      <div className={styles.frameSlot}>
                        <img src="/assets/frames/original_frame030.png" alt="Clean frame" style={{ width: '100%', borderRadius: '8px' }} onError={e => e.target.style.display='none'} />
                        <span className={styles.frameTag} style={{ color: '#10b981' }}>Clean</span>
                      </div>
                      <div className={styles.corruptArrow}>→</div>
                      <div className={styles.frameSlot}>
                        <img src="/assets/frames/corrupted_frame030.png" alt="Corrupted frame" style={{ width: '100%', borderRadius: '8px' }} onError={e => e.target.style.display='none'} />
                        <div className={styles.corruptOverlay} />
                        <span className={styles.frameTag} style={{ color: '#f43f5e' }}>Corrupted</span>
                      </div>
                    </div>
                    <WaveformViz color="#f43f5e" label="Corrupted Audio (zeroed segments)" />
                  </div>
                )}

                {i === 2 && (
                  <div className={styles.encodingDiagram}>
                    {[
                      { label: 'Audio', sub: '16kHz mono', arrow: 'Wav2Vec2', output: '768-dim embedding', color: '#06b6d4' },
                      { label: 'Video', sub: '30fps frames', arrow: 'VAE Encoder', output: '4×32×32 latent', color: '#8b5cf6' },
                    ].map((row, ri) => (
                      <div key={ri} className={styles.encodingRow}>
                        <div className={styles.encodingBox} style={{ borderColor: `${row.color}40`, color: row.color }}>
                          <div style={{ fontWeight: 700 }}>{row.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.sub}</div>
                        </div>
                        <div className={styles.encodingArrow}>
                          <div className={styles.encodingArrowLine} style={{ background: row.color }} />
                          <div className={styles.encodingArrowLabel} style={{ color: row.color }}>{row.arrow}</div>
                        </div>
                        <div className={styles.encodingBox} style={{ borderColor: `${row.color}40`, background: `${row.color}10` }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: row.color, fontWeight: 600 }}>{row.output}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {i === 3 && (
                  <div>
                    <VideoSlider
                      leftSrc="/assets/videos/corrupted.mp4"
                      rightSrc="/assets/videos/restored.mp4"
                      leftLabel="Corrupted"
                      rightLabel="Restored"
                    />
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
                      Drag the slider to compare • Audio-guided video restoration
                    </p>
                  </div>
                )}

                {i === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <WaveformViz audioUrl="/assets/audio/corrupted.wav" color="#f43f5e" label="Corrupted Audio" height={60} />
                    <WaveformViz audioUrl="/assets/audio/restored.wav" color="#10b981" label="Restored Audio (gaps filled)" height={60} />
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      {[
                        { label: 'Short gap', sub: '≤100ms', method: 'Crossfade blend', color: '#10b981' },
                        { label: 'Long gap', sub: '>100ms', method: 'STFT interpolation', color: '#f59e0b' },
                      ].map((item, ii) => (
                        <div key={ii} className="glass-card" style={{ flex: 1, padding: '1.25rem', borderColor: `${item.color}30` }}>
                          <div style={{ color: item.color, fontWeight: 700, marginBottom: '0.25rem' }}>{item.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{item.sub}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.method}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {i === 5 && (
                  <div className={styles.metricsGauges}>
                    {metrics.map((m, mi) => {
                      const radius = 36;
                      const circ = 2 * Math.PI * radius;
                      const pct = Math.min(m.value / m.max, 1);
                      const offset = circ * (1 - pct);
                      return (
                        <div key={mi} className="glass-card" style={{ textAlign: 'center', padding: '1.5rem', borderColor: `${m.color}30` }}>
                          <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 0.75rem' }}>
                            <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
                              <circle cx="45" cy="45" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                              <circle cx="45" cy="45" r={radius} fill="none" stroke={m.color} strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={circ}
                                strokeDashoffset={offset}
                                style={{ filter: `drop-shadow(0 0 6px ${m.color})` }}
                              />
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: m.color }}>
                              <AnimatedCounter value={m.value} decimals={m.decimals} suffix={m.suffix} />
                            </div>
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{m.label}</div>
                          <div style={{ fontSize: '0.7rem', color: m.color, marginTop: '0.25rem', fontWeight: 600 }}>{m.interpretation}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {i === 6 && (
                  <div>
                    <div className={styles.videoCard}>
                      <video
                        src="/assets/videos/side_by_side.mp4"
                        controls
                        style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
                      {[
                        { label: 'Restored Video', icon: '🎬', file: 'restored.mp4', color: '#6366f1' },
                        { label: 'Restored Audio', icon: '🔊', file: 'restored.wav', color: '#10b981' },
                        { label: 'Side-by-Side', icon: '🖥', file: 'side_by_side.mp4', color: '#ec4899' },
                      ].map((out, oi) => (
                        <a key={oi} href={`/assets/videos/${out.file}`} download className="glass-card" style={{ padding: '1rem', textAlign: 'center', borderColor: `${out.color}30`, textDecoration: 'none' }}>
                          <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{out.icon}</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{out.label}</div>
                          <div style={{ fontSize: '0.7rem', color: out.color, fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>{out.file}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
