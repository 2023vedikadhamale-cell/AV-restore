'use client';
import { useEffect, useRef, useState } from 'react';

export default function VideoSlider({
  leftSrc,
  rightSrc,
  leftLabel = 'Before',
  rightLabel = 'After',
  className = '',
}) {
  const containerRef = useRef(null);
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);
  const [sliderX, setSliderX] = useState(50); // percent
  const dragging = useRef(false);

  const getPercent = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    return Math.max(2, Math.min(98, pct));
  };

  const onStart = (e) => {
    dragging.current = true;
    setSliderX(getPercent(e));
  };
  const onMove = (e) => {
    if (!dragging.current) return;
    setSliderX(getPercent(e));
  };
  const onEnd = () => { dragging.current = false; };

  useEffect(() => {
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  // Sync video playback
  const syncVideos = () => {
    const lv = leftVideoRef.current;
    const rv = rightVideoRef.current;
    if (!lv || !rv) return;
    rv.currentTime = lv.currentTime;
    if (!lv.paused) rv.play();
    else rv.pause();
  };

  return (
    <div
      ref={containerRef}
      className={`comparison-slider ${className}`}
      onMouseDown={onStart}
      onTouchStart={onStart}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', aspectRatio: '16/9', background: '#000', userSelect: 'none' }}
    >
      {/* Right (full) */}
      <video
        ref={rightVideoRef}
        src={rightSrc}
        autoPlay
        muted
        loop
        playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Left (clipped) */}
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}>
        <video
          ref={leftVideoRef}
          src={leftSrc}
          autoPlay
          muted
          loop
          playsInline
          onTimeUpdate={syncVideos}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Slider handle */}
      <div
        className="comparison-slider-handle"
        style={{ left: `${sliderX}%` }}
      />

      {/* Labels */}
      <span style={{
        position: 'absolute', left: '1rem', bottom: '1rem',
        padding: '0.25rem 0.75rem', borderRadius: '6px',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
        fontSize: '0.8rem', fontWeight: 600, color: '#fff',
        pointerEvents: 'none',
      }}>{leftLabel}</span>
      <span style={{
        position: 'absolute', right: '1rem', bottom: '1rem',
        padding: '0.25rem 0.75rem', borderRadius: '6px',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
        fontSize: '0.8rem', fontWeight: 600, color: '#fff',
        pointerEvents: 'none',
      }}>{rightLabel}</span>
    </div>
  );
}
