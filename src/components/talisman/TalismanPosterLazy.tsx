/**
 * TalismanPosterLazy — 旧版海报懒加载包装器
 *
 * ShareCard 等场景仍在使用旧版 TalismanPoster，此处提供懒加载入口。
 */

import React, { Suspense } from 'react';

const TalismanPoster = React.lazy(() => import('./TalismanPoster'));

const PosterFallback = () => (
  <div style={{ width: 380, height: 570, background: '#111', borderRadius: 8 }} />
);

const TalismanPosterLazy: React.FC<any> = (props) => (
  <Suspense fallback={<PosterFallback />}>
    <TalismanPoster {...props} />
  </Suspense>
);

export default TalismanPosterLazy;
