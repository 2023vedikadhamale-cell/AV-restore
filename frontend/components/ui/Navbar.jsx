'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/pipeline', label: 'Pipeline' },
  { href: '/demo', label: 'Demo' },
  { href: '/technical', label: 'Technical' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      lastScroll.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      background: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(248,248,246,0.6)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '0 24px', height: '80px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          fontWeight: 700, fontSize: '1.25rem', color: '#111827',
          textDecoration: 'none', letterSpacing: '-0.02em',
        }}>
          <span style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: '8px',
            background: '#111827', color: '#ffffff',
          }}>
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <path d="M11 2L3 6v10l8 4 8-4V6L11 2z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
              <path d="M11 2v18M3 6l8 4 8-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
            </svg>
          </span>
          <span>AV<span style={{ color: '#d1d5db' }}>·</span>Restore</span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '14px', fontWeight: 500,
                  color: isActive ? '#111827' : '#6b7280',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#111827'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#6b7280'; }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="desktop-nav">
          <Link href="/demo" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
            Live Demo
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          style={{
            display: 'none', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            width: '40px', height: '40px', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          <span style={{
            display: 'block', width: '24px', height: '2px', background: '#4b5563',
            transition: 'transform 0.3s ease',
            transform: mobileOpen ? 'rotate(45deg) translateY(8px)' : 'none',
          }} />
          <span style={{
            display: 'block', width: '24px', height: '2px', background: '#4b5563',
            transition: 'opacity 0.3s ease',
            opacity: mobileOpen ? 0 : 1,
          }} />
          <span style={{
            display: 'block', width: '24px', height: '2px', background: '#4b5563',
            transition: 'transform 0.3s ease',
            transform: mobileOpen ? 'rotate(-45deg) translateY(-8px)' : 'none',
          }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, width: '100%',
          background: '#ffffff', borderTop: '1px solid #f3f4f6',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          padding: '16px 24px',
          display: 'flex', flexDirection: 'column',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'block', padding: '12px 0',
                fontSize: '16px', fontWeight: 500,
                color: pathname === link.href ? '#111827' : '#6b7280',
                textDecoration: 'none',
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/demo"
            className="btn btn-primary"
            style={{ marginTop: '16px', textAlign: 'center', justifyContent: 'center' }}
            onClick={() => setMobileOpen(false)}
          >
            Live Demo
          </Link>
        </div>
      )}

      {/* Responsive CSS */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
