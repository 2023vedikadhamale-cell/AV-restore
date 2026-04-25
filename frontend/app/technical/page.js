'use client';
import SectionReveal from '@/components/ui/SectionReveal';
import CodeBlock from '@/components/ui/CodeBlock';
import WaveformViz from '@/components/ui/WaveformViz';
import styles from './technical.module.css';

const PIPELINE_NODES = [
  { id: 'load', label: 'Data Loading', color: '#06b6d4', desc: 'Decode video → frames + audio @ 16kHz' },
  { id: 'corrupt', label: 'Corruption', color: '#f43f5e', desc: 'Zero audio segments, blank mouth region' },
  { id: 'encode', label: 'Encoding', color: '#8b5cf6', desc: 'Wav2Vec2 audio embeddings + VAE video latents' },
  { id: 'a2v', label: 'A→V Restore', color: '#6366f1', desc: 'Cosine similarity → top-k blend → LAB transfer' },
  { id: 'v2a', label: 'V→A Restore', color: '#10b981', desc: 'Crossfade / STFT interpolation per gap length' },
  { id: 'eval', label: 'Evaluation', color: '#f59e0b', desc: 'SSIM, PSNR, STOI, LSE-D computation' },
  { id: 'out', label: 'Output', color: '#ec4899', desc: 'Re-encode with ffmpeg, export comparison clips' },
];

const codeSnippets = {
  audioEmbed: `def get_audio_embedding(waveform, wav2vec_model, processor, device):
    """Extract 768-dim Wav2Vec2 embedding from a waveform segment."""
    inputs = processor(
        waveform,
        sampling_rate=16000,
        return_tensors="pt",
        padding=True
    ).to(device)
    
    with torch.no_grad():
        outputs = wav2vec_model(**inputs)
    
    # Mean-pool across time dimension → (768,)
    return outputs.last_hidden_state.mean(dim=1).squeeze().cpu().numpy()`,

  videoRestore: `def restore_frame(corrupted_frame, audio_emb, reference_bank, top_k=5):
    """
    Audio-guided video frame restoration.
    
    Steps:
    1. Cosine similarity between audio_emb and all bank embeddings
    2. Select top-k reference frames
    3. Weighted blend of reference mouth regions
    4. LAB color transfer to match corrupted frame
    5. Feathered paste with radial gradient mask
    """
    similarities = cosine_similarity(
        audio_emb.reshape(1, -1),
        np.array([e for _, e in reference_bank])
    )[0]
    
    top_indices = np.argsort(similarities)[-top_k:]
    weights = softmax(similarities[top_indices])
    
    blended_mouth = weighted_blend_mouths(
        [reference_bank[i][0] for i in top_indices], weights
    )
    mouth_lab = lab_color_transfer(blended_mouth, corrupted_frame)
    mask = radial_feather_mask(mouth_lab.shape)
    
    return paste_with_mask(corrupted_frame, mouth_lab, mask)`,

  audioRestore: `def restore_audio_gap(gap_start, gap_end, clean_audio, sr=16000):
    """
    Per-segment audio restoration using gap length heuristic.
    
    Short gaps (≤100ms):  Linear crossfade from boundary segments
    Long gaps (>100ms):   STFT interpolation + Griffin-Lim reconstruction
    """
    gap_duration_ms = (gap_end - gap_start) / sr * 1000
    
    if gap_duration_ms <= 100:
        return crossfade_fill(clean_audio, gap_start, gap_end, fade_ms=20)
    else:
        left_stft  = stft(clean_audio[gap_start-N//2:gap_start])
        right_stft = stft(clean_audio[gap_end:gap_end+N//2])
        interp_stft = np.exp(
            np.linspace(np.log(left_stft + 1e-8),
                        np.log(right_stft + 1e-8), gap_end - gap_start)
        )
        return griffin_lim(interp_stft, n_iter=32)`,
};

const ARCH_STEPS = [
  { step: 'Wav2Vec2', label: 'Audio Encoding', sub: 'facebook/wav2vec2-base', color: '#06b6d4' },
  { step: 'Cosine Sim', label: 'Similarity Search', sub: 'vs. reference bank', color: '#6366f1' },
  { step: 'Top-K Blend', label: 'Frame Blending', sub: 'weighted softmax', color: '#8b5cf6' },
  { step: 'LAB Transfer', label: 'Color Correction', sub: 'CIE LAB space', color: '#10b981' },
  { step: 'Feather Paste', label: 'Region Fusion', sub: 'radial gradient mask', color: '#f59e0b' },
];

export default function TechnicalPage() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className="container">
          <span className="section-label">Research Documentation</span>
          <h1 className="h1" style={{ marginTop: '0.75rem' }}>
            Technical <span className="text-gradient-primary">Deep-Dive</span>
          </h1>
          <p style={{ marginTop: '0.75rem', maxWidth: '60ch' }}>
            Architecture, algorithms, and implementation details for the cross-modal AV restoration pipeline.
          </p>
        </div>
      </header>

      <div className={`container ${styles.body}`}>

        {/* ─── Section 1: Architecture ─── */}
        <section className={styles.section}>
          <SectionReveal>
            <div className={styles.sectionLabel}>
              <span>01</span>
              <h2 className="h2">Architecture Overview</h2>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <p style={{ maxWidth: '65ch', marginBottom: '2.5rem' }}>
              The pipeline is a <strong style={{ color: 'var(--text-primary)' }}>7-stage sequential system</strong> with two parallel restoration branches that leverage cross-modal correlations.
              No end-to-end training is needed — restoration is achieved via retrieval and signal processing.
            </p>
          </SectionReveal>

          {/* Pipeline node graph */}
          <SectionReveal>
            <div className={styles.pipelineNodes}>
              {PIPELINE_NODES.map((node, i) => (
                <div key={i} className={styles.nodeGroup}>
                  <div
                    className={styles.node}
                    style={{ '--node-color': node.color, borderColor: `${node.color}40` }}
                    data-cursor-hover
                  >
                    <div className={styles.nodeLabel}>{node.label}</div>
                    <div className={styles.nodeDesc}>{node.desc}</div>
                    <div className={styles.nodeNum} style={{ color: node.color }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                  {i < PIPELINE_NODES.length - 1 && (
                    <div className={styles.nodeArrow} style={{ background: `linear-gradient(90deg, ${node.color}, ${PIPELINE_NODES[i+1].color})` }} />
                  )}
                </div>
              ))}
            </div>
          </SectionReveal>
        </section>

        <div className="divider" />

        {/* ─── Section 2: Video Restoration ─── */}
        <section className={styles.section}>
          <SectionReveal>
            <div className={styles.sectionLabel}>
              <span>02</span>
              <h2 className="h2">Video Restoration Algorithm</h2>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <p style={{ maxWidth: '65ch', marginBottom: '2.5rem' }}>
              Audio embeddings serve as "queries" that retrieve visually compatible reference frames from a clean reference bank.
              Restoration is <strong style={{ color: 'var(--text-primary)' }}>retrieval-based</strong>, not generative — ensuring fidelity to the original speaker's identity.
            </p>
          </SectionReveal>

          {/* Algorithm flow */}
          <SectionReveal>
            <div className={styles.algoFlow}>
              {ARCH_STEPS.map((s, i) => (
                <div key={i} className={styles.algoStep} style={{ '--step-color': s.color }}>
                  <div className={styles.algoStepNum} style={{ color: s.color }}>{i + 1}</div>
                  <div className={styles.algoStepContent}>
                    <div className={styles.algoStepLabel} style={{ color: s.color }}>{s.step}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{s.sub}</div>
                  </div>
                  {i < ARCH_STEPS.length - 1 && (
                    <div className={styles.algoArrow} style={{ color: 'var(--text-muted)' }}>→</div>
                  )}
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <CodeBlock filename="restore/video_restore.py" language="python">
              {codeSnippets.videoRestore}
            </CodeBlock>
          </SectionReveal>

          {/* Frame gallery */}
          <SectionReveal delay={0.1}>
            <div style={{ marginTop: '2rem' }}>
              <h3 className="h3" style={{ marginBottom: '1.25rem' }}>Frame Progression Gallery</h3>
              <div className={styles.frameGallery}>
                {[0, 10, 20, 30, 50, 70, 90].map((idx) => (
                  <div key={idx} className={styles.galleryItem}>
                    <div className={styles.galleryFrames}>
                      {['original', 'corrupted', 'restored'].map((type) => (
                        <img
                          key={type}
                          src={`/assets/frames/${type}_frame${String(idx).padStart(3, '0')}.png`}
                          alt={`${type} frame ${idx}`}
                          className={styles.galleryFrame}
                          onError={(e) => { e.target.style.opacity = '0'; }}
                        />
                      ))}
                    </div>
                    <span className={styles.galleryIdx} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Frame {idx}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </section>

        <div className="divider" />

        {/* ─── Section 3: Audio Restoration ─── */}
        <section className={styles.section}>
          <SectionReveal>
            <div className={styles.sectionLabel}>
              <span>03</span>
              <h2 className="h2">Audio Restoration Algorithm</h2>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <p style={{ maxWidth: '65ch', marginBottom: '2rem' }}>
              Audio gaps are classified by duration and restored with the appropriate method.
              Short gaps use simple crossfading; long gaps use <strong style={{ color: 'var(--text-primary)' }}>STFT interpolation</strong> in the log-magnitude domain,
              followed by Griffin-Lim phase reconstruction.
            </p>
          </SectionReveal>

          {/* Decision tree */}
          <SectionReveal>
            <div className={styles.decisionTree}>
              <div className={styles.dtRoot}>
                <div className={styles.dtBox} style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>Gap detected</div>
              </div>
              <div className={styles.dtBranches}>
                <div className={styles.dtBranch}>
                  <div className={styles.dtCondition} style={{ color: '#10b981' }}>≤ 100ms</div>
                  <div className={styles.dtBox} style={{ borderColor: '#10b981', color: '#10b981' }}>
                    <strong>Crossfade</strong>
                    <span>Linear blend from boundaries with 20ms fade windows</span>
                  </div>
                </div>
                <div className={styles.dtBranch}>
                  <div className={styles.dtCondition} style={{ color: '#f59e0b' }}>{'>'} 100ms</div>
                  <div className={styles.dtBox} style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
                    <strong>STFT Interpolation</strong>
                    <span>Log-magnitude lerp + Griffin-Lim (32 iterations)</span>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '2rem 0' }}>
              <WaveformViz color="#f43f5e" label="Corrupted Audio (gaps zeroed)" height={70} />
              <WaveformViz color="#10b981" label="Restored Audio (gaps filled)" height={70} />
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <CodeBlock filename="restore/audio_restore.py" language="python">
              {codeSnippets.audioRestore}
            </CodeBlock>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <CodeBlock filename="embed/audio_embed.py" language="python">
              {codeSnippets.audioEmbed}
            </CodeBlock>
          </SectionReveal>
        </section>

        <div className="divider" />

        {/* ─── Section 4: Evaluation ─── */}
        <section className={styles.section}>
          <SectionReveal>
            <div className={styles.sectionLabel}>
              <span>04</span>
              <h2 className="h2">Evaluation Methodology</h2>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className={styles.tableWrapper}>
              <table className={styles.evalTable}>
                <thead>
                  <tr>
                    {['Metric', 'Full Name', 'Formula (simplified)', 'Range', 'Our Score'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { m: 'SSIM', full: 'Structural Similarity', formula: 'luminance × contrast × structure', range: '0–1 ↑', score: '0.9962', color: '#10b981' },
                    { m: 'PSNR', full: 'Peak Signal-to-Noise Ratio', formula: '10 · log₁₀(MAX² / MSE)', range: '0–∞ dB ↑', score: '42.4 dB', color: '#6366f1' },
                    { m: 'STOI', full: 'Short-Time Objective Intelligibility', formula: 'mean corr(x̂, x) over segments', range: '0–1 ↑', score: '0.62', color: '#f59e0b' },
                    { m: 'LSE-D', full: 'Lip Sync Error Distance', formula: '(1/N) Σ block_dist(mouth regions)', range: '0–∞ ↓', score: '1.02', color: '#06b6d4' },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: row.color }}>{row.m}</span></td>
                      <td>{row.full}</td>
                      <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{row.formula}</code></td>
                      <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{row.range}</td>
                      <td><strong style={{ color: row.color }}>{row.score}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionReveal>
        </section>

      </div>
    </div>
  );
}
