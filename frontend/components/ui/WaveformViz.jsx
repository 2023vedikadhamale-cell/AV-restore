'use client';
import { useEffect, useRef } from 'react';

export default function WaveformViz({
  audioUrl,
  color = '#06b6d4',
  height = 80,
  className = '',
  label = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Generate synthetic waveform if no audio (procedural fallback)
    const drawProcedural = () => {
      ctx.clearRect(0, 0, w, h);
      const bars = 120;
      const barW = w / bars;
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, `${color}60`);
      grad.addColorStop(0.5, color);
      grad.addColorStop(1, `${color}60`);
      ctx.fillStyle = grad;

      for (let i = 0; i < bars; i++) {
        const amp = Math.sin(i * 0.18) * 0.4 + Math.sin(i * 0.07) * 0.3 + Math.random() * 0.3 + 0.1;
        const barH = amp * h * 0.8;
        const x = i * barW;
        const y = (h - barH) / 2;
        ctx.beginPath();
        ctx.roundRect(x + 1, y, barW - 2, barH, 2);
        ctx.fill();
      }
    };

    if (!audioUrl) {
      drawProcedural();
      return;
    }

    // Real audio decoding
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    fetch(audioUrl)
      .then(r => r.arrayBuffer())
      .then(buf => ac.decodeAudioData(buf))
      .then(decoded => {
        const data = decoded.getChannelData(0);
        const step = Math.ceil(data.length / w);
        ctx.clearRect(0, 0, w, h);
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, `${color}60`);
        grad.addColorStop(0.5, color);
        grad.addColorStop(1, `${color}60`);
        ctx.fillStyle = grad;

        for (let i = 0; i < w; i++) {
          let min = 1, max = -1;
          for (let j = 0; j < step; j++) {
            const d = data[i * step + j] || 0;
            if (d < min) min = d;
            if (d > max) max = d;
          }
          const y = ((1 + min) / 2) * h;
          const barH = Math.max(1, ((max - min) / 2) * h);
          ctx.fillRect(i, y, 1, barH);
        }
      })
      .catch(drawProcedural);

    return () => { ac.close(); };
  }, [audioUrl, color]);

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          {label}
        </span>
      )}
      <canvas
        ref={canvasRef}
        width={600}
        height={height}
        style={{ width: '100%', height: `${height}px`, borderRadius: '8px' }}
      />
    </div>
  );
}
