import React, { useState } from 'react';
import TalismanSVG from './TalismanSVG';
import { getTalismanImage } from '@/data/talisman-images';

interface TalismanRendererProps {
  hexagramName: string;
  blessingTheme: string;
  element: string;
  category: string;
  seed: number;
  score?: number;
  width?: number;
  height?: number;
}

const TalismanRenderer: React.FC<TalismanRendererProps> = ({
  hexagramName, blessingTheme, element, category, seed, score = 75, width = 300, height = 450
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgSrc = getTalismanImage(hexagramName);

  // 有本地图且未报错 → 显示AI符咒图
  if (imgSrc && !error) {
    return (
      <div className="relative rounded-xl overflow-hidden" style={{ width, height }}>
        <img
          src={imgSrc}
          alt={`${hexagramName} 符咒`}
          className="w-full h-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="text-gold/50 text-xs tracking-wider">Loading...</span>
          </div>
        )}
      </div>
    );
  }

  // 无本地图或加载失败 → SVG fallback
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ width, height }}>
      <TalismanSVG
        hexagramName={hexagramName}
        blessingTheme={blessingTheme}
        element={element}
        category={category}
        seed={seed}
        score={score}
        width={width}
        height={height}
      />
    </div>
  );
};

export default TalismanRenderer;
