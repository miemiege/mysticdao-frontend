/**
 * SamplePage — 核心卦象符咒图样板展示页
 *
 * 用于生成5张核心卦象样板截图：乾、坤、离、坎、震
 */

import TalismanPoster from '../components/talisman/TalismanPoster';

const SAMPLES = [
  { name: '乾为天', label: '乾卦 · 天行健', element: '金' },
  { name: '坤为地', label: '坤卦 · 地势坤', element: '土' },
  { name: '离为火', label: '离卦 · 明两作', element: '火' },
  { name: '水天需', label: '坎卦代表 · 云上于天', element: '水' },
  { name: '雷地豫', label: '震卦代表 · 雷出地奋', element: '木' },
];

const W = 400;
const H = 640;

export default function SamplePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#1a1a1a',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '48px',
      }}
    >
      <h1
        style={{
          color: '#C9A227',
          fontSize: '24px',
          fontFamily: 'Georgia, serif',
          letterSpacing: '4px',
          margin: 0,
        }}
      >
        MYSTICDAO TALISMAN SAMPLES
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))',
          gap: '48px',
          maxWidth: '1400px',
          width: '100%',
        }}
      >
        {SAMPLES.map((s) => (
          <div
            key={s.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: W,
                height: H,
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                background: '#f9f4ed',
              }}
            >
              <TalismanPoster
                hexagramName={s.name}
                score={85}
                width={W}
                height={H}
                showSeal
                cyberMode
                variant="default"
                useNewAssets
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  color: '#C9A227',
                  fontSize: '16px',
                  fontFamily: '"Noto Serif SC", serif',
                  fontWeight: 600,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  color: 'rgba(201,162,39,0.5)',
                  fontSize: '12px',
                  fontFamily: '"Share Tech Mono", monospace',
                  marginTop: '4px',
                  letterSpacing: '2px',
                }}
              >
                {s.element} · {W}×{H}px · NEW ASSETS
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
