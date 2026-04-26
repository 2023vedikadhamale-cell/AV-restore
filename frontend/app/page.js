'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionReveal from '@/components/ui/SectionReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const navCards = [
  {
    href: '/pipeline', label: 'Pipeline', icon: '⬡',
    desc: 'Walk through all 6 stages of the AV restoration pipeline.',
  },
  {
    href: '/demo', label: 'Live Demo', icon: '▶',
    desc: 'Drag to compare corrupted vs. restored video and audio.',
  },
  {
    href: '/technical', label: 'Technical', icon: '⎔',
    desc: 'Deep-dive into the architecture, algorithms, and evaluation methods.',
  },
];

export default function HeroPage() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
    if (taglineRef.current) {
      tl.fromTo(taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      );
    }
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.6'
      );
    }
  }, []);

  return (
    <div style={{ paddingTop: '80px' }}>
      
      {/* ─── HERO SECTION ─── */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          paddingTop: '100px',
          paddingBottom: '140px',
          textAlign: 'center',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at top, #ffffff 0%, #f8f8f6 100%)',
        }}
      >
        {/* Warm radial glow + secondary accent */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% -10%, rgba(251, 191, 36, 0.18) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 40%)',
        }} />
        
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            background: '#fef3c7', color: '#92400e',
            fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.05em', marginBottom: '32px',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            Research Project
          </div>
          
          {/* Title */}
          <h1 ref={titleRef} style={{
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 800,
            color: '#111827',
            letterSpacing: '-0.05em',
            lineHeight: 1.05,
            marginBottom: '28px',
          }}>
            Audio-Visual<br />
            <span style={{ color: '#9ca3af' }}>Packet Loss Concealment</span>
          </h1>
          
          {/* Tagline */}
          <p ref={taglineRef} style={{
            fontSize: '1.2rem',
            color: '#6b7280',
            maxWidth: '640px',
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            A cross-modal deep learning pipeline that recovers corrupted audio and video 
            streams using complementary signal information. Restoring what packet loss destroys.
          </p>
          
          {/* CTAs */}
          <div ref={ctaRef} style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/demo" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '18px 40px', borderRadius: '999px',
              background: '#111827', color: '#ffffff',
              fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; }}
            >
              Watch Live Demo
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginLeft: '8px' }}>
                <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/pipeline" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '18px 40px', borderRadius: '999px',
              background: 'transparent', color: '#111827',
              fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none',
              border: '1.5px solid #d1d5db',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#111827'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Explore Pipeline
            </Link>
          </div>
        </div>
      </section>

      {/* ─── THE CHALLENGE ─── */}
      <section style={{ padding: '96px 0', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <SectionReveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ width: '32px', height: '2px', background: '#d1d5db' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>
                The Challenge
              </span>
            </div>
          </SectionReveal>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '64px', alignItems: 'center' }}>
            <SectionReveal delay={0.1}>
              <div>
                <h2 style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 700, color: '#111827',
                  lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '24px',
                }}>
                  Network packet loss<br />
                  <span style={{ color: '#9ca3af' }}>destroys communication.</span>
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '24px', maxWidth: '600px' }}>
                  In video conferencing and streaming, even 10–30% packet loss can render
                  speech unintelligible and leave faces with corrupted regions — especially
                  around the mouth area where lip movement encodes crucial information.
                </p>
                <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: 1.7, maxWidth: '600px' }}>
                  Traditional codecs attempt error concealment, but they work on single streams
                  independently. Our pipeline leverages the{' '}
                  <strong style={{ color: '#111827', fontWeight: 600 }}>cross-modal correlation</strong>{' '}
                  between audio and video — using each to help restore the other.
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ─── DEMO PREVIEW ─── */}
      <section style={{ padding: '96px 0', background: '#f8f8f6' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <SectionReveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
                <span style={{ width: '24px', height: '2px', background: '#d1d5db' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>
                  Demo Preview
                </span>
                <span style={{ width: '24px', height: '2px', background: '#d1d5db' }} />
              </div>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700, color: '#111827',
                lineHeight: 1.15, letterSpacing: '-0.03em',
              }}>
                See the restoration in action
              </h2>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {[
                { label: 'Corrupted Input', video: '/corrupted_video.mp4' },
                { label: 'Restored Output', video: '/Restored_video.mp4' }
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)'; }}
                >
                  <div style={{ width: '100%', aspectRatio: '16/9', background: '#f3f4f6' }}>
                    <video 
                      src={item.video} 
                      controls playsInline 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '4px' }}>
                      {i === 0 ? 'Before' : 'After'}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── NAV CARDS / EXPLORE ─── */}
      <section style={{ padding: '96px 0', background: '#ffffff', borderTop: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <SectionReveal>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700, color: '#111827',
                lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '16px',
              }}>
                Dive deeper into the research
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#6b7280', maxWidth: '560px', margin: '0 auto' }}>
                Explore the methodology, inspect the pipeline, or play with the interactive demo.
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {navCards.map((card, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <Link href={card.href} style={{
                  display: 'block',
                  background: '#ffffff',
                  borderRadius: '24px',
                  padding: '40px 32px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = '1px solid rgba(0,0,0,0.1)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(-6px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '1px solid rgba(0,0,0,0.06)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <div style={{
                    width: '56px', height: '56px',
                    background: '#f8f8f6', borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', marginBottom: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.04)',
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
                    {card.label}
                  </h3>
                  <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '24px' }}>
                    {card.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#111827', fontWeight: 600, fontSize: '0.95rem' }}>
                    Explore
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginLeft: '8px' }}>
                      <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* ─── FOOTER CTA ─── */}
      <section style={{ padding: '128px 24px', background: '#fbbf24', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 800, color: '#111827',
            lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '24px',
          }}>
            Ready to experience it?
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#78350f', marginBottom: '40px', lineHeight: 1.7, fontWeight: 500 }}>
            Try the interactive demonstration to see the real-time audio-visual 
            restoration capabilities of our model.
          </p>
          <Link href="/demo" style={{
            display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            padding: '16px 40px',
            borderRadius: '999px',
            background: '#111827', color: '#ffffff',
            fontWeight: 700, fontSize: '1.1rem',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
          >
            Open Interactive Demo
          </Link>
        </div>
      </section>
      
    </div>
  );
}
