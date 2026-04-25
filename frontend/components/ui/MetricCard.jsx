'use client';
import AnimatedCounter from './AnimatedCounter';

const colorMap = {
  green: { stroke: '#10b981', glow: 'rgba(16,185,129,0.3)', dim: 'rgba(16,185,129,0.1)' },
  amber: { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.3)', dim: 'rgba(245,158,11,0.1)' },
  cyan:  { stroke: '#06b6d4', glow: 'rgba(6,182,212,0.3)',  dim: 'rgba(6,182,212,0.1)'  },
  rose:  { stroke: '#f43f5e', glow: 'rgba(244,63,94,0.3)',  dim: 'rgba(244,63,94,0.1)'  },
  primary:{ stroke: '#6366f1', glow: 'rgba(99,102,241,0.3)', dim: 'rgba(99,102,241,0.1)' },
};

export default function MetricCard({
  label,
  value,
  suffix = '',
  prefix = '',
  decimals = 3,
  maxValue = 1,
  color = 'green',
  interpretation = '',
  className = '',
}) {
  const c = colorMap[color] || colorMap.green;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / maxValue, 1);
  const offset = circumference * (1 - pct);

  return (
    <div className={`glass-card ${className}`} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
      textAlign: 'center', background: c.dim, borderColor: `${c.stroke}30`,
      animation: 'float 4s ease-in-out infinite',
      animationDelay: `${Math.random() * 2}s`,
    }}>
      {/* Circular gauge */}
      <div className="gauge-ring" style={{ width: 100, height: 100 }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle className="gauge-track" cx="50" cy="50" r={radius} />
          <circle
            className="gauge-fill"
            cx="50"
            cy="50"
            r={radius}
            stroke={c.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}
          />
        </svg>
        <div style={{
          position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: c.stroke,
          }}>
            <AnimatedCounter value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
          </span>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          {label}
        </div>
        {interpretation && (
          <div style={{
            fontSize: '0.75rem', color: c.stroke, fontWeight: 600,
            background: `${c.stroke}15`, padding: '0.2rem 0.6rem', borderRadius: '999px',
            display: 'inline-block',
          }}>
            {interpretation}
          </div>
        )}
      </div>
    </div>
  );
}
