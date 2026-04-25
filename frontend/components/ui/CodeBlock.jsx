'use client';
import { useRef, useState } from 'react';

export default function CodeBlock({ filename, language = 'python', children }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const copy = async () => {
    const text = codeRef.current?.textContent || '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlight tokens (regex-based, no external dep)
  const highlight = (code) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return escaped
      .replace(/(#[^\n]*)/g, '<span style="color:#475569">$1</span>')
      .replace(/\b(def|class|import|from|return|if|else|elif|for|in|while|with|as|not|and|or|True|False|None|yield|async|await|try|except|raise|pass|lambda|self)\b/g, '<span style="color:#8b5cf6">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#f59e0b">$1</span>')
      .replace(/"([^"]*)"|'([^']*)'/g, '<span style="color:#10b981">"$1$2"</span>')
      .replace(/\b([A-Z][a-zA-Z0-9_]*)\b(?=\()/g, '<span style="color:#06b6d4">$1</span>');
  };

  return (
    <div className="code-block">
      <div className="code-block-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e', display: 'block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'block' }} />
          <span className="code-block-filename" style={{ marginLeft: '0.25rem' }}>{filename}</span>
        </div>
        <button
          onClick={copy}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: copied ? 'var(--accent-green)' : 'var(--text-muted)',
            background: 'none', border: '1px solid var(--border-subtle)', padding: '0.2rem 0.5rem',
            borderRadius: '6px', cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div className="code-block-body">
        <pre ref={codeRef}>
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlight(String(children)) }}
          />
        </pre>
      </div>
    </div>
  );
}
