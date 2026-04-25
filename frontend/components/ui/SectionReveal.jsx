'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SectionReveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const yFrom = direction === 'up' ? 40 : direction === 'down' ? -40 : 0;
    const xFrom = direction === 'left' ? 40 : direction === 'right' ? -40 : 0;

    gsap.fromTo(el,
      { opacity: 0, y: yFrom, x: xFrom },
      {
        opacity: 1, y: 0, x: 0,
        duration: 0.9,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, [delay, direction]);

  return <div ref={ref} className={className} style={{ opacity: 0 }}>{children}</div>;
}
