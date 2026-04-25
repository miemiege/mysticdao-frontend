/**
 * SimpleHexagram — 纯 CSS 六爻可视化组件
 *
 * 特性：
 * - 阳爻：完整金色粗横线
 * - 阴爻：两条金色短横线（中间间隙）
 * - 动爻：红色小圆点标记
 * - 六爻从下到上排列，依次点亮动画
 * - 纯 div + CSS，零 SVG
 * - 使用 shared.css 中 yao-1 ~ yao-6 动画类
 */

import React, { useEffect, useRef } from 'react';
import type { Yao } from '@/components/daily/HexagramDraw';
import './shared.css';

interface SimpleHexagramProps {
  lines: Yao[];
  strokeColor?: string;
  onComplete?: () => void;
  className?: string;
}

const YAO_WIDTH = 120;
const YAO_HEIGHT = 6;
const GAP = 12;

const SimpleHexagram: React.FC<SimpleHexagramProps> = ({
  lines,
  strokeColor = '#C8A45C',
  onComplete,
  className = '',
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 所有爻显示完毕后触发 onComplete（总时长约 2.3s + 缓冲）
  useEffect(() => {
    if (onComplete) {
      timerRef.current = setTimeout(() => {
        onComplete();
      }, 2400);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [onComplete]);

  // 六爻从下到上：index 0 是最下爻，index 5 是最上爻
  // 使用 flex-col-reverse 使 index 0 渲染在最下方
  return (
    <div
      className={`flex flex-col-reverse items-center ${className}`}
      style={{ gap: GAP, width: YAO_WIDTH }}
      role="img"
      aria-label="六爻卦象"
    >
      {lines.map((yao, index) => {
        const isYang = yao.value === 1;
        const isChanging = yao.changing;
        const animationClass = `yao-${index + 1}`;

        return (
          <div
            key={index}
            className={`relative flex items-center justify-center ${animationClass}`}
            style={{ width: YAO_WIDTH, height: YAO_HEIGHT }}
          >
            {isYang ? (
              /* 阳爻：一条完整横线 */
              <div
                className="w-full rounded-full"
                style={{
                  height: YAO_HEIGHT,
                  backgroundColor: strokeColor,
                  boxShadow: `0 0 6px ${strokeColor}60`,
                }}
              />
            ) : (
              /* 阴爻：两条短横线，中间有间隙 */
              <div className="flex items-center justify-between w-full" style={{ gap: 8 }}>
                <div
                  className="rounded-full flex-1"
                  style={{
                    height: YAO_HEIGHT,
                    backgroundColor: strokeColor,
                    boxShadow: `0 0 6px ${strokeColor}60`,
                  }}
                />
                <div
                  className="rounded-full flex-1"
                  style={{
                    height: YAO_HEIGHT,
                    backgroundColor: strokeColor,
                    boxShadow: `0 0 6px ${strokeColor}60`,
                  }}
                />
              </div>
            )}

            {/* 动爻标记：红色小圆点 */}
            {isChanging && (
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-10"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#DC2626',
                  boxShadow: '0 0 6px #DC262680',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SimpleHexagram;
