'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/pipeline', label: 'Pipeline' },
  { href: '/demo', label: 'Demo' },
  { href: '/metrics', label: 'Metrics' },
  { href: '/technical', label: 'Technical' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScroll = useRef(0);
  const indicatorRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastScroll.current && y > 100);
      lastScroll.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Slide indicator to active link
  useEffect(() => {
    const activeIdx = navLinks.findIndex(l => l.href === pathname);
    if (activeIdx < 0 || !linksRef.current[activeIdx] || !indicatorRef.current) return;
    const el = linksRef.current[activeIdx];
    const parent = el.closest('nav');
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    indicatorRef.current.style.width = `${elRect.width}px`;
    indicatorRef.current.style.left = `${elRect.left - parentRect.left}px`;
    indicatorRef.current.style.opacity = '1';
  }, [pathname]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2L3 6v10l8 4 8-4V6L11 2z" stroke="url(#grad)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
              <path d="M11 2v18M3 6l8 4 8-4" stroke="url(#grad)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
              <defs>
                <linearGradient id="grad" x1="3" y1="2" x2="19" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className={styles.logoText}>AV<span className={styles.logoAccent}>·</span>Restore</span>
        </Link>

        <nav className={styles.nav}>
          <span ref={indicatorRef} className={styles.indicator} />
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              ref={el => linksRef.current[i] = el}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className={`${styles.bar} ${mobileOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.barOpen3 : ''}`} />
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileLinkActive : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
