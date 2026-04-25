'use client';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './hero.module.css';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const navCards = [
  {
    href: '/pipeline', label: 'Pipeline', icon: '⬡',
    desc: 'Walk through all 7 stages of the AV restoration pipeline.',
    color: 'var(--accent-cyan)', glow: 'rgba(6,182,212,0.15)',
  },
  {
    href: '/demo', label: 'Live Demo', icon: '▶',
    desc: 'Drag to compare corrupted vs. restored video and audio.',
    color: 'var(--accent-purple)', glow: 'rgba(139,92,246,0.15)',
  },
  {
    href: '/metrics', label: 'Metrics', icon: '◉',
    desc: 'Explore SSIM, PSNR, STOI, and LSE-D in an interactive 3D dashboard.',
    color: 'var(--accent-green)', glow: 'rgba(16,185,129,0.15)',
  },
  {
    href: '/technical', label: 'Technical', icon: '⎔',
    desc: 'Deep-dive into the architecture, algorithms, and evaluation methods.',
    color: 'var(--accent-amber)', glow: 'rgba(245,158,11,0.15)',
  },
];

const metrics = [
  { label: 'SSIM', value: 0.9962, suffix: '', decimals: 4, desc: 'Structural Similarity', color: '#10b981' },
  { label: 'PSNR', value: 42.4, suffix: ' dB', decimals: 1, desc: 'Peak Signal-to-Noise Ratio', color: '#6366f1' },
  { label: 'STOI', value: 0.62, suffix: '', decimals: 2, desc: 'Speech Intelligibility', color: '#f59e0b' },
  { label: 'Frames', value: 100, suffix: '', decimals: 0, desc: 'Processed per clip', color: '#06b6d4' },
];

export default function HeroPage() {
  const scrollY = useRef({ current: 0 });
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const onScroll = () => { scrollY.current.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Title char stagger
    const tl = gsap.timeline({ delay: 1.2 });
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char');
      tl.fromTo(chars,
        { opacity: 0, y: 30, rotateX: -40 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.03, duration: 0.7, ease: 'power3.out' }
      );
    }
    if (taglineRef.current) {
      tl.fromTo(taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      );
    }
    if (scrollIndicatorRef.current) {
      tl.fromTo(scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '+=0.5'
      );
      gsap.to(scrollIndicatorRef.current, {
        y: 8, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut', delay: 2.5,
      });
    }

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Split title text into char spans for animation
  const title = 'Audio-Visual Packet Loss Concealment';
  const charSpans = title.split('').map((ch, i) => (
    <span key={i} className="char" style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}>
      {ch}
    </span>
  ));

  return (
    <div className={styles.page}>
      {/* ─── HERO SECTION ─── */}
      <section className={styles.hero} ref={heroRef}>
        {/* Full-viewport 3D canvas */}
        <div className={styles.canvasWrapper}>
          <HeroScene scrollY={scrollY} />
        </div>

        {/* Overlay gradient */}
        <div className={styles.heroOverlay} />

        {/* Hero content */}
        <div className={styles.heroContent}>
          <div className={`badge badge-cyan ${styles.badge}`}>
            <span>Research Project</span>
          </div>

          <h1 ref={titleRef} className={styles.heroTitle} style={{ perspective: '800px' }}>
            {charSpans}
          </h1>

          <p ref={taglineRef} className={styles.heroTagline}>
            A cross-modal deep learning pipeline that recovers corrupted audio and video streams
            using complementary signal information — restoring what packet loss destroys.
          </p>

          <div className={styles.heroCtas}>
            <Link href="/demo" className="btn btn-primary">
              Watch Live Demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Link href="/pipeline" className="btn btn-ghost">
              Explore Pipeline
            </Link>
          </div>

          <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
            <span className={styles.scrollText}>Scroll to explore</span>
            <div className={styles.scrollChevron}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE PROBLEM ─── */}
      <section className={styles.problemSection}>
        <div className="container">
          <SectionReveal>
            <span className="section-label">The Challenge</span>
          </SectionReveal>
          <div className={styles.problemGrid}>
            <SectionReveal delay={0.1}>
              <div>
                <h2 className="h2" style={{ marginBottom: '1.25rem' }}>
                  Network packet loss
                  <span className="text-gradient-primary"> destroys communication.</span>
                </h2>
                <p style={{ marginBottom: '1rem' }}>
                  In video conferencing and streaming, even 10–30% packet loss can render
                  speech unintelligible and leave faces with corrupted regions — especially
                  around the mouth area where lip movement encodes crucial information.
                </p>
                <p>
                  Traditional codecs attempt error concealment, but they work on single streams
                  independently. Our pipeline leverages the <strong style={{ color: 'var(--text-primary)' }}>cross-modal correlation</strong> between
                  audio and video — using each to help restore the other.
                </p>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2} direction="left">
              <div className={styles.frameComparison}>
                {['Original', 'Corrupted', 'Restored'].map((label, i) => {
                  const colors = ['#10b981', '#f43f5e', '#6366f1'];
                  const imgNames = ['original', 'corrupted', 'restored'];
                  return (
                    <div key={i} className={styles.frameCard} style={{ borderColor: `${colors[i]}40` }}>
                      <div className={styles.framePlaceholder} style={{ background: `${colors[i]}08` }}>
                        <img
                          src={`/assets/frames/${imgNames[i]}_frame030.png`}
                          alt={`${label} frame`}
                          onError={(e) => { e.target.style.display = 'none'; }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div className={styles.frameOverlay} style={{ background: `${colors[i]}20` }} />
                      </div>
                      <span className={styles.frameLabel} style={{ color: colors[i] }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ─── KEY METRICS ─── */}
      <section className={`${styles.metricsSection} dot-grid`}>
        <div className="container">
          <SectionReveal>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="section-label" style={{ justifyContent: 'center' }}>Results</span>
              <h2 className="h2" style={{ marginTop: '1rem' }}>
                Restoration that <span className="text-gradient-primary">speaks for itself</span>
              </h2>
            </div>
          </SectionReveal>

          <div className={styles.metricsGrid}>
            {metrics.map((m, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="glass-card" style={{ textAlign: 'center', borderColor: `${m.color}30` }}>
                  <div style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, color: m.color, marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>
                    <AnimatedCounter value={m.value} decimals={m.decimals} suffix={m.suffix} />
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{m.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NAV CARDS ─── */}
      <section className={styles.navSection}>
        <div className="container">
          <SectionReveal>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="section-label" style={{ justifyContent: 'center' }}>Explore</span>
              <h2 className="h2" style={{ marginTop: '1rem' }}>
                Dive deeper into the research
              </h2>
            </div>
          </SectionReveal>

          <div className={styles.navCardsGrid}>
            {navCards.map((card, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <Link href={card.href} className={styles.navCard} style={{ '--card-color': card.color, '--card-glow': card.glow }}>
                  <div className={styles.navCardIcon} style={{ color: card.color }}>{card.icon}</div>
                  <h3 className={styles.navCardLabel}>{card.label}</h3>
                  <p className={styles.navCardDesc}>{card.desc}</p>
                  <div className={styles.navCardArrow} style={{ color: card.color }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
