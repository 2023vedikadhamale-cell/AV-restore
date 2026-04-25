'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AnimatedCounter({ value, decimals = 0, suffix = '', prefix = '', className = '' }) {
  const ref = useRef(null);
  const [displayed, setDisplayed] = useState('0');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: value,
      duration: 2,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        setDisplayed(obj.val.toFixed(decimals));
      },
      onComplete: () => {
        setDisplayed(value.toFixed(decimals));
      },
    });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => tween.play(),
    });

    return () => { tween.kill(); };
  }, [value, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayed}{suffix}
    </span>
  );
}
