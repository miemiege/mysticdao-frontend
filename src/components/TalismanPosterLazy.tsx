/**
 * TalismanPosterLazy — 海报系统懒加载包装器
 *
 * 将 TalismanPosterV2 及其依赖（~1300行 SVG 渲染代码）拆分为独立 chunk，
 * 仅在 Daily 页面展示结果时加载，减少首屏 Bundle。
 */

import React, { Suspense } from 'react';
import type { TalismanPosterV2Props } from '@/components/TalismanPosterV2';

const TalismanPosterV2 = React.lazy(() => import('@/components/TalismanPosterV2'));

/** 轻量加载占位 — 与海报同尺寸的骨架屏 */
const PosterFallback: React.FC<{ width?: number; height?: number }> = ({ width = 400, height = 640 }) => (
  <div
    style={{
      width,
      height,
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#666',
      fontSize: 14,
      letterSpacing: 2,
    }}
  >
    <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>✦</span>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
    `}</style>
  </div>
);

const TalismanPosterLazy: React.FC<TalismanPosterV2Props> = (props) => (
  <Suspense fallback={<PosterFallback width={props.width} height={props.height} />}>
    <TalismanPosterV2 {...props} />
  </Suspense>
);

export default TalismanPosterLazy;
