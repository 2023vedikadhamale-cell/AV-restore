'use client';
import Link from 'next/link';

/* ══════════════════════════════════════════════════════
   DATA — sourced from project documentation
   ══════════════════════════════════════════════════════ */

const SOFTWARE_STACK = [
  { category: 'Operating System', items: 'Windows 10 / 11, Ubuntu Linux', color: '#06b6d4' },
  { category: 'Programming Language', items: 'Python 3.9+', color: '#3776ab' },
  { category: 'Deep Learning Framework', items: 'PyTorch', color: '#ee4c2c' },
  { category: 'Model Libraries', items: 'HuggingFace Diffusers, Transformers (Wav2Vec), Accelerate', color: '#f59e0b' },
  { category: 'Data Processing', items: 'ffmpeg-python (Video), Librosa (Audio), OpenCV', color: '#8b5cf6' },
  { category: 'Interface (UI)', items: 'Gradio / Streamlit', color: '#10b981' },
];

const TOOLS = [
  { category: 'Development IDE', items: 'Visual Studio Code, Jupyter Lab, Google Colab', icon: '💻' },
  { category: 'Version Control', items: 'Git, GitHub', icon: '🔀' },
  { category: 'Data Visualization', items: 'Matplotlib, Seaborn', icon: '📊' },
  { category: 'Documentation', items: 'LaTeX / Overleaf', icon: '📝' },
];

const CONSTRAINTS = [
  {
    area: 'Computational Resources',
    problem: 'Limited access to real-world CRM and live interaction datasets.',
    solution: 'Latent Caching: Pre-encode all videos into VQ-VAE latents once, speeding up training by 10×. Use Checkpointing to resume training.',
    color: '#06b6d4',
  },
  {
    area: 'Data Variance',
    problem: '"Universal" lip-syncing is difficult due to variations in accents, dialects, and face shapes.',
    solution: 'Subject-Specific Training: Restrict scope to specific speakers (Few-Shot Fine-tuning) to ensure high fidelity and feasibility.',
    color: '#f59e0b',
  },
  {
    area: 'Model Hallucination',
    problem: 'Generative models may produce "jittery" lips or artifacts in the restored region.',
    solution: 'Cross-Modal Attention: Explicitly condition the visual generation on audio embeddings to enforce strict synchronization.',
    color: '#f43f5e',
  },
];

const HARDWARE = [
  { component: 'Processor', spec: 'Intel Core i7 (10th Gen+) / AMD Ryzen 7 or higher' },
  { component: 'RAM', spec: 'Minimum 16 GB' },
  { component: 'Storage', spec: '512 GB SSD or higher' },
  { component: 'Architecture', spec: '64-bit system' },
  { component: 'Internet', spec: 'Stable broadband connection' },
];

/* ══════════════════════════════════════════════════════
   ARCHITECTURE BLOCK DIAGRAM (inline SVG-like layout)
   ══════════════════════════════════════════════════════ */

const ARCH_STAGES = [
  {
    id: 'input',
    label: 'Input',
    sub: 'Dataset (Audio + Video)',
    color: '#93c5fd',
    bg: '#eff6ff',
  },
  {
    id: 'corrupt',
    label: 'Data Corruption',
    sub: 'Stochastic Masking\n(Randomly hide Mouth / Audio)',
    color: '#fbbf24',
    bg: '#fefce8',
  },
  {
    id: 'encode',
    label: 'Feature Encoding',
    items: [
      { name: 'Visual Encoder (VQ-VAE)', flow: 'Corrupted Frames →', color: '#10b981', bg: '#ecfdf5' },
      { name: 'Audio Encoder (Wav2Vec)', flow: 'Corrupted Audio →', color: '#10b981', bg: '#ecfdf5' },
    ],
  },
  {
    id: 'attention',
    label: 'Cross-Modal Attention',
    sub: 'Latents ↔ Embeddings',
    color: '#a78bfa',
    bg: '#f5f3ff',
    diamond: true,
  },
  {
    id: 'diffusion',
    label: 'Bi-Directional Diffusion',
    items: [
      { name: 'Visual U-Net', flow: 'Audio Context →', color: '#f59e0b', bg: '#fef3c7' },
      { name: 'Audio U-Net', flow: 'Visual Context →', color: '#f59e0b', bg: '#fef3c7' },
    ],
  },
  {
    id: 'reconstruct',
    label: 'Reconstruction',
    items: [
      { name: 'Visual Decoder', color: '#10b981', bg: '#ecfdf5' },
      { name: 'Audio Decoder', color: '#10b981', bg: '#ecfdf5' },
    ],
  },
  {
    id: 'output',
    label: 'Restored Output',
    sub: '(Synchronized)',
    color: '#93c5fd',
    bg: '#eff6ff',
  },
];

export default function TechnicalPage() {
  return (
    <div style={{ paddingTop: '80px', background: 'radial-gradient(ellipse at top, #ffffff 0%, #f8f8f6 100%)', minHeight: '100vh' }}>

      {/* ─── HERO ─── */}
      <section style={{ padding: '80px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#9ca3af', marginBottom: '20px',
          }}>
            <span style={{ width: '24px', height: '2px', background: '#d1d5db' }} />
            Technical Documentation
            <span style={{ width: '24px', height: '2px', background: '#d1d5db' }} />
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800, color: '#111827',
            letterSpacing: '-0.05em', lineHeight: 1.05, marginBottom: '20px',
          }}>
            Architecture &<br />
            <span style={{ color: '#9ca3af' }}>Technology Stack</span>
          </h1>
          <p style={{
            fontSize: '1.15rem', color: '#6b7280',
            lineHeight: 1.7, maxWidth: '600px', margin: '0 auto',
          }}>
            A complete technical overview of the cross-modal AV restoration pipeline —
            from signal processing to bi-directional diffusion.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 01 — ARCHITECTURE BLOCK DIAGRAM
          ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <SectionHeader num="01" label="Architecture Block Diagram" />

          <AdvancedArchitecture />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 02 — SOFTWARE STACK
          ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <SectionHeader num="02" label="Software Stack" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
            {SOFTWARE_STACK.map((item, i) => (
              <div key={i} style={{
                background: '#ffffff', borderRadius: '16px',
                padding: '24px 28px', border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                display: 'flex', alignItems: 'flex-start', gap: '16px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.03)'; }}
              >
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: item.color, flexShrink: 0, marginTop: '6px',
                }} />
                <div>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '4px',
                  }}>{item.category}</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                    {item.items}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 03 — TOOLS
          ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <SectionHeader num="03" label="Tools" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {TOOLS.map((tool, i) => (
              <div key={i} style={{
                background: '#ffffff', borderRadius: '16px',
                padding: '24px', border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.03)'; }}
              >
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>{tool.icon}</div>
                <div style={{
                  fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '6px',
                }}>{tool.category}</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                  {tool.items}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 04 — CONSTRAINTS & SOLUTIONS
          ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <SectionHeader num="04" label="Constraints & Solutions" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {CONSTRAINTS.map((c, i) => (
              <div key={i} style={{
                background: '#ffffff', borderRadius: '20px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.03)'; }}
              >
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  {/* Left accent */}
                  <div style={{ width: '5px', background: c.color, flexShrink: 0 }} />
                  <div style={{ padding: '24px 28px', flex: 1 }}>
                    <div style={{
                      fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.08em', color: c.color, marginBottom: '6px',
                    }}>Constraint — {c.area}</div>
                    <div style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.6 }}>
                      {c.problem}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '20px 28px 24px 33px', background: '#fafafa' }}>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: '#10b981', marginBottom: '6px',
                  }}>✓ Proposed Solution</div>
                  <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500, lineHeight: 1.6 }}>
                    {c.solution}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 05 — HARDWARE REQUIREMENTS
          ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <SectionHeader num="05" label="Hardware Requirements" />

          <div style={{
            background: '#ffffff', borderRadius: '20px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}>
            {HARDWARE.map((hw, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                padding: '20px 28px',
                borderBottom: i < HARDWARE.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                <div style={{
                  minWidth: '140px', fontSize: '14px', fontWeight: 700,
                  color: '#111827',
                }}>
                  {hw.component}
                </div>
                <div style={{
                  fontSize: '14px', color: '#6b7280', fontWeight: 500,
                }}>
                  {hw.spec}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section style={{ padding: '96px 24px', background: '#fbbf24', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, color: '#111827',
            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px',
          }}>
            See it in action
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#78350f', lineHeight: 1.7, marginBottom: '32px', fontWeight: 500 }}>
            Watch the pipeline restore corrupted audio and video in real time.
          </p>
          <Link href="/demo" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px 36px', borderRadius: '999px',
            background: '#111827', color: '#ffffff',
            fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
          >
            Open Interactive Demo
          </Link>
        </div>
      </section>

      {/* Responsive */}
      <style jsx global>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(auto-fill"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   REUSABLE SUB-COMPONENTS
   ══════════════════════════════════════════════════════ */

function SectionHeader({ num, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      marginBottom: '32px',
    }}>
      <span style={{
        fontSize: '13px', fontWeight: 800, color: '#6366f1',
        textTransform: 'uppercase', letterSpacing: '0.1em',
      }}>{num}</span>
      <span style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
      <span style={{
        fontSize: '13px', fontWeight: 700, color: '#9ca3af',
        textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>{label}</span>
      <span style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
    </div>
  );
}

function AdvancedArchitecture() {
  return (
    <div style={{
      width: '100%', background: '#ffffff', borderRadius: '24px',
      border: '1px solid rgba(0,0,0,0.06)', padding: '24px 0',
      boxShadow: '0 8px 32px rgba(0,0,0,0.05)', overflowX: 'auto',
    }}>
      <svg viewBox="0 0 1100 380" width="100%" height="auto" style={{ minWidth: '700px' }}>

        {/* TITLE */}
        <text x="550" y="28" textAnchor="middle" fontSize="17" fontWeight="700" fill="#111827">
          Cross-Modal Diffusion Architecture
        </text>

        {/* ── SECTION BACKGROUNDS ── */}
        <rect x="155" y="65" width="160" height="260" rx="14" fill="#fefce8" opacity="0.5" />
        <rect x="330" y="65" width="200" height="260" rx="14" fill="#f0fdf4" opacity="0.5" />
        <rect x="540" y="55" width="160" height="280" rx="16" fill="#f5f3ff" opacity="0.4" />
        <rect x="710" y="65" width="145" height="260" rx="14" fill="#eff6ff" opacity="0.4" />
        <rect x="865" y="65" width="170" height="260" rx="14" fill="#f0fdf4" opacity="0.4" />

        {/* ── INPUT ── */}
        <rect x="20" y="155" width="120" height="60" rx="10" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
        <text x="80" y="182" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1e40af">Input Dataset</text>
        <text x="80" y="198" textAnchor="middle" fontSize="10" fill="#6b7280">(Audio + Video)</text>

        {/* ── STOCHASTIC MASKING ── */}
        <rect x="175" y="130" width="120" height="70" rx="12" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="235" y="162" textAnchor="middle" fontSize="11" fontWeight="600" fill="#92400e">Stochastic</text>
        <text x="235" y="178" textAnchor="middle" fontSize="11" fontWeight="600" fill="#92400e">Masking</text>
        <text x="235" y="195" textAnchor="middle" fontSize="8" fill="#a16207">Hide Mouth / Audio</text>

        {/* ── VISUAL ENCODER ── */}
        <text x="430" y="82" textAnchor="middle" fontSize="10" fontWeight="700" fill="#9ca3af" letterSpacing="0.05em">FEATURE ENCODING</text>
        <rect x="350" y="110" width="160" height="55" rx="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="430" y="135" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1d4ed8">Visual Encoder</text>
        <text x="430" y="151" textAnchor="middle" fontSize="9" fill="#6b7280">(VQ-VAE)</text>

        {/* ── AUDIO ENCODER ── */}
        <rect x="350" y="205" width="160" height="55" rx="10" fill="#dcfce7" stroke="#10b981" strokeWidth="1.5" />
        <text x="430" y="230" textAnchor="middle" fontSize="11" fontWeight="600" fill="#065f46">Audio Encoder</text>
        <text x="430" y="246" textAnchor="middle" fontSize="9" fill="#6b7280">(Wav2Vec)</text>

        {/* ── CROSS-MODAL ATTENTION (diamond) ── */}
        <text x="620" y="72" textAnchor="middle" fontSize="10" fontWeight="700" fill="#9ca3af" letterSpacing="0.05em">CROSS-MODAL</text>
        <polygon
          points="620,105 690,185 620,265 550,185"
          fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5"
        />
        <text x="620" y="180" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6d28d9">Cross-Modal</text>
        <text x="620" y="196" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6d28d9">Attention</text>

        {/* ── VISUAL U-NET ── */}
        <text x="783" y="82" textAnchor="middle" fontSize="10" fontWeight="700" fill="#9ca3af" letterSpacing="0.05em">DIFFUSION</text>
        <rect x="725" y="110" width="115" height="50" rx="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="783" y="140" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1d4ed8">Visual U-Net</text>

        {/* ── AUDIO U-NET ── */}
        <rect x="725" y="210" width="115" height="50" rx="10" fill="#dcfce7" stroke="#10b981" strokeWidth="1.5" />
        <text x="783" y="240" textAnchor="middle" fontSize="11" fontWeight="600" fill="#065f46">Audio U-Net</text>

        {/* ── VISUAL DECODER ── */}
        <text x="950" y="82" textAnchor="middle" fontSize="10" fontWeight="700" fill="#9ca3af" letterSpacing="0.05em">RECONSTRUCTION</text>
        <rect x="880" y="110" width="140" height="50" rx="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="950" y="140" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1d4ed8">Visual Decoder</text>

        {/* ── AUDIO DECODER ── */}
        <rect x="880" y="210" width="140" height="50" rx="10" fill="#dcfce7" stroke="#10b981" strokeWidth="1.5" />
        <text x="950" y="240" textAnchor="middle" fontSize="11" fontWeight="600" fill="#065f46">Audio Decoder</text>

        {/* ── OUTPUT ── */}
        <rect x="960" y="300" width="120" height="55" rx="10" fill="#f5d0fe" stroke="#c084fc" strokeWidth="1.5" />
        <text x="1020" y="323" textAnchor="middle" fontSize="11" fontWeight="600" fill="#7e22ce">Restored Output</text>
        <text x="1020" y="340" textAnchor="middle" fontSize="9" fill="#9333ea">(Synchronized)</text>

        {/* ── FLOW LABELS ── */}
        <text x="310" y="120" textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="600">Frames →</text>
        <text x="310" y="245" textAnchor="middle" fontSize="8" fill="#10b981" fontWeight="600">Audio →</text>
        <text x="530" y="142" textAnchor="middle" fontSize="8" fill="#7c3aed" fontWeight="600">Latents</text>
        <text x="530" y="240" textAnchor="middle" fontSize="8" fill="#7c3aed" fontWeight="600">Embeddings</text>
        <text x="708" y="120" textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="600">Audio Ctx</text>
        <text x="708" y="255" textAnchor="middle" fontSize="8" fill="#10b981" fontWeight="600">Visual Ctx</text>

        {/* ═══ ARROWS ═══ */}

        {/* Input → Masking */}
        <line x1="140" y1="185" x2="173" y2="170" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowTech)" />

        {/* Masking → Visual Encoder */}
        <line x1="295" y1="150" x2="348" y2="137" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowTech)" />
        {/* Masking → Audio Encoder */}
        <line x1="295" y1="180" x2="348" y2="225" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowTech)" />

        {/* Visual Encoder → Cross-Modal */}
        <path d="M510 137 Q535 137 555 170" stroke="#3b82f6" strokeWidth="1.5" fill="none" markerEnd="url(#arrowTech)" />
        {/* Audio Encoder → Cross-Modal */}
        <path d="M510 232 Q535 232 555 200" stroke="#10b981" strokeWidth="1.5" fill="none" markerEnd="url(#arrowTech)" />

        {/* Cross-Modal → Visual U-Net */}
        <path d="M688 172 Q708 150 723 140" stroke="#3b82f6" strokeWidth="1.5" fill="none" markerEnd="url(#arrowTech)" />
        {/* Cross-Modal → Audio U-Net */}
        <path d="M688 200 Q708 225 723 235" stroke="#10b981" strokeWidth="1.5" fill="none" markerEnd="url(#arrowTech)" />

        {/* Visual U-Net → Visual Decoder */}
        <line x1="840" y1="135" x2="878" y2="135" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowTech)" />
        {/* Audio U-Net → Audio Decoder */}
        <line x1="840" y1="235" x2="878" y2="235" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowTech)" />

        {/* Visual Decoder → Output */}
        <path d="M1020 160 Q1020 280 1020 298" stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#arrowTech)" />
        {/* Audio Decoder → Output */}
        <path d="M950 260 Q950 280 990 298" stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#arrowTech)" />

        {/* ARROW DEF */}
        <defs>
          <marker id="arrowTech" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
          </marker>
        </defs>

      </svg>
    </div>
  );
}
