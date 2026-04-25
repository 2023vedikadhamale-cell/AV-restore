'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import VideoSlider from '@/components/ui/VideoSlider';
import WaveformViz from '@/components/ui/WaveformViz';
import styles from './demo.module.css';

// Lazy-load the 3D background
const IcosahedronBg = dynamic(() => import('@/components/three/IcosahedronBg'), { ssr: false });

const MODES = [
  { id: 'video', label: 'Video Comparison', icon: '▶' },
  { id: 'audio', label: 'Audio Comparison', icon: '🔊' },
  { id: 'sxs',   label: 'Side-by-Side',    icon: '⬛⬛' },
];

const AUDIO_TRACKS = [
  { id: 'original',  label: 'Original',  src: '/assets/audio/original.wav',  color: '#10b981' },
  { id: 'corrupted', label: 'Corrupted', src: '/assets/audio/corrupted.wav', color: '#f43f5e' },
  { id: 'restored',  label: 'Restored',  src: '/assets/audio/restored.wav',  color: '#6366f1' },
];

export default function DemoPage() {
  const [mode, setMode] = useState('video');
  const [audioTrack, setAudioTrack] = useState('original');
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const viewportRef = useRef(null);
  const tabsRef = useRef(null);

  // Page entrance animation
  useEffect(() => {
    if (viewportRef.current) {
      gsap.fromTo(viewportRef.current,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.4)', delay: 0.2 }
      );
    }
  }, []);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  }, [playing]);

  const switchAudio = useCallback((id) => {
    const a = audioRef.current;
    setAudioTrack(id);
    if (a) {
      const wasPlaying = !a.paused;
      a.src = AUDIO_TRACKS.find(t => t.id === id)?.src || '';
      a.load();
      if (wasPlaying) a.play();
    }
  }, []);

  const currentTrack = AUDIO_TRACKS.find(t => t.id === audioTrack);

  return (
    <div className={styles.page}>
      {/* Subtle 3D background */}
      <div className={styles.bgCanvas}>
        <IcosahedronBg />
      </div>

      <div className={styles.content}>
        <div className="container">
          {/* Header */}
          <div className={styles.header}>
            <span className="section-label">Interactive Demo</span>
            <h1 className="h1" style={{ marginTop: '0.75rem' }}>
              See the <span className="text-gradient-primary">Difference</span>
            </h1>
            <p style={{ marginTop: '0.75rem', maxWidth: '55ch' }}>
              Drag the slider to reveal the restoration. Toggle between video and audio comparison modes.
            </p>
          </div>

          {/* Mode tabs */}
          <div ref={tabsRef} className={styles.tabs}>
            {MODES.map(m => (
              <button
                key={m.id}
                className={`${styles.tab} ${mode === m.id ? styles.tabActive : ''}`}
                onClick={() => setMode(m.id)}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* Video viewport */}
          <div ref={viewportRef} className={styles.viewport}>
            {mode === 'video' && (
              <VideoSlider
                leftSrc="/assets/videos/corrupted.mp4"
                rightSrc="/assets/videos/restored.mp4"
                leftLabel="Corrupted"
                rightLabel="Restored"
                className={styles.slider}
              />
            )}

            {mode === 'audio' && (
              <div className={styles.audioMode}>
                <div className={styles.waveformPanel}>
                  <WaveformViz audioUrl="/assets/audio/corrupted.wav" color="#f43f5e" label="Corrupted Audio" height={100} />
                </div>
                <div className={styles.waveformPanel}>
                  <WaveformViz audioUrl="/assets/audio/restored.wav" color="#10b981" label="Restored Audio" height={100} />
                </div>

                <div className={styles.audioControls}>
                  {AUDIO_TRACKS.map(track => (
                    <button
                      key={track.id}
                      className={`${styles.audioBtn} ${audioTrack === track.id ? styles.audioBtnActive : ''}`}
                      style={audioTrack === track.id ? { borderColor: track.color, color: track.color, background: `${track.color}15` } : {}}
                      onClick={() => switchAudio(track.id)}
                    >
                      {track.label}
                    </button>
                  ))}
                  <button className={styles.playBtn} onClick={togglePlay}>
                    {playing ? '⏸' : '▶'} {playing ? 'Pause' : 'Play'}
                  </button>
                </div>

                <audio ref={audioRef} src={currentTrack?.src} onEnded={() => setPlaying(false)} />
              </div>
            )}

            {mode === 'sxs' && (
              <div className={styles.sxsMode}>
                <video
                  src="/assets/videos/side_by_side.mp4"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '100%', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}
                />
              </div>
            )}
          </div>

          {/* Info row */}
          <div className={styles.infoRow}>
            {[
              { label: 'Left / Top', value: mode === 'sxs' ? 'Three-panel view' : 'Corrupted stream', color: '#f43f5e' },
              { label: 'Right / Bottom', value: mode === 'sxs' ? 'Side-by-side' : 'Restored stream', color: '#10b981' },
              { label: 'Method', value: 'Cross-Modal Attention + STFT', color: '#6366f1' },
            ].map((item, i) => (
              <div key={i} className={styles.infoItem}>
                <span className={styles.infoLabel}>{item.label}</span>
                <span className={styles.infoValue} style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Quick metrics */}
          <div className={styles.quickMetrics}>
            {[
              { label: 'SSIM Improvement', value: '+0.48', sub: '0.516 → 0.996', color: '#10b981' },
              { label: 'PSNR Gain',        value: '+15 dB',  sub: '27.2 → 42.4 dB', color: '#6366f1' },
              { label: 'STOI Score',       value: '0.62',   sub: 'Intelligibility', color: '#f59e0b' },
              { label: 'Frames Restored',  value: '100',    sub: 'Per clip',         color: '#06b6d4' },
            ].map((m, i) => (
              <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '1.25rem', borderColor: `${m.color}30` }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: m.color, fontFamily: 'var(--font-sans)' }}>{m.value}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{m.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
