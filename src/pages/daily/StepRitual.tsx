/**
 * StepRitual — 摇卦仪式：竹筒摇晃 → 铜钱落下 → 卦名显现 → 转场
 *
 * 完整时序：
 *  0-0.5s   入场：光点放大 + 显示竹筒
 *  0.5-2.5s 摇卦：竹筒左右摇晃 (shakeBamboo)
 *  2.5-5s   落爻：6枚铜钱逐一落下 (coinDrop)
 *  5-6s     定卦：卦名放大显现 (scaleInSpring)
 *  6-7s     转场：整体渐隐 → onComplete
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Yao } from '@/components/daily/HexagramDraw';
import './shared.css';

interface StepRitualProps {
  lines: Yao[];
  hexagramName?: string;
  onComplete: () => void;
}

type RitualPhase = 'entrance' | 'shaking' | 'dropping' | 'revealing' | 'transition';

const phaseMessages: Record<RitualPhase, string> = {
  entrance: '静心凝神 · 准备摇卦',
  shaking: '诚心摇卦 · 沟通天地',
  dropping: '铜钱落爻 · 卦象初成',
  revealing: '卦象已定 · 显现天机',
  transition: '解卦中 · 请稍候',
};

// 铜钱名称
const yaoLabel = (value: 0 | 1): string => (value === 1 ? '阳' : '阴');

const StepRitual: React.FC<StepRitualProps> = ({
  lines,
  hexagramName = 'Unknown',
  onComplete,
}) => {
  const [phase, setPhase] = useState<RitualPhase>('entrance');
  const [showCoins, setShowCoins] = useState(false);
  const [showHexagram, setShowHexagram] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const timerRefs = useRef<number[]>([]);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timerRefs.current.push(id);
    return id;
  }, []);

  // 核心时序控制
  useEffect(() => {
    // ── 入场 (0-0.5s) ──
    // 已默认显示 entrance

    // ── 摇卦 (0.5-2.5s) ──
    addTimer(() => {
      setPhase('shaking');
      setShakeKey((k) => k + 1);
    }, 500);

    // 摇晃期间重复触发
    addTimer(() => setShakeKey((k) => k + 1), 1000);
    addTimer(() => setShakeKey((k) => k + 1), 1500);
    addTimer(() => setShakeKey((k) => k + 1), 2000);

    // ── 落爻 (2.5-5s) ──
    addTimer(() => {
      setPhase('dropping');
      setShowCoins(true);
    }, 2500);

    // ── 定卦 (5-6s) ──
    addTimer(() => {
      setPhase('revealing');
      setShowHexagram(true);
    }, 5200);

    // ── 转场 (6-7s) ──
    addTimer(() => {
      setPhase('transition');
      setFadeOut(true);
    }, 6400);

    addTimer(() => {
      onComplete();
    }, 7200);

    return () => {
      timerRefs.current.forEach((id) => clearTimeout(id));
      timerRefs.current = [];
    };
  }, [onComplete, addTimer]);

  // 竹筒摇晃CSS类
  const bambooShaking = phase === 'shaking';

  return (
    <div
      className="step-transition"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '24px 20px',
        position: 'relative',
        overflow: 'hidden',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.8s ease',
      }}
    >
      {/* ── 顶部阶段文字 ── */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <p
          key={phase}
          style={{
            color: '#C8A45C',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
            animation: 'fadeInUp 0.4s ease-out forwards',
            textShadow: '0 0 12px rgba(200,164,92,0.2)',
          }}
        >
          {phaseMessages[phase]}
        </p>
      </div>

      {/* ── 入场光点效果 ── */}
      {phase === 'entrance' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #C8A45C 0%, transparent 70%)',
            opacity: 0.6,
            animation: 'scaleIn 0.5s ease-out forwards',
          }}
        />
      )}

      {/* ── 竹筒 ── */}
      <div
        style={{
          position: 'relative',
          width: '72px',
          height: '126px',
          marginBottom: showCoins ? '24px' : '0',
          // 摇卦阶段居中，落爻后上移
          transform: showCoins ? 'translateY(-30px)' : 'translateY(0)',
          transition: showCoins ? 'transform 0.6s ease' : 'none',
          zIndex: 5,
        }}
      >
        {/* 竹筒主体 */}
        <div
          className={bambooShaking ? 'bamboo-shake' : ''}
          key={`bamboo-${shakeKey}`}
          style={{
            width: '72px',
            height: '126px',
            borderRadius: '8px 8px 16px 16px',
            background: 'linear-gradient(180deg, #4a3728 0%, #3d2e20 30%, #5a4330 50%, #3d2e20 70%, #4a3728 100%)',
            position: 'relative',
            boxShadow: bambooShaking
              ? '0 4px 20px rgba(200,164,92,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
              : '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* 竹节纹理竖线 */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
            <div style={{ position: 'absolute', left: '20%', top: 0, bottom: 0, width: '1px', background: '#C8A45C' }} />
            <div style={{ position: 'absolute', left: '40%', top: 0, bottom: 0, width: '1px', background: '#C8A45C' }} />
            <div style={{ position: 'absolute', left: '60%', top: 0, bottom: 0, width: '1px', background: '#C8A45C' }} />
            <div style={{ position: 'absolute', left: '80%', top: 0, bottom: 0, width: '1px', background: '#C8A45C' }} />
          </div>

          {/* 上箍线 */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #C8A45C, transparent)',
              opacity: 0.5,
            }}
          />

          {/* 下箍线 */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #C8A45C, transparent)',
              opacity: 0.5,
            }}
          />

          {/* 中央太极符号 */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '32px',
              color: '#C8A45C',
              opacity: 0.2,
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            {'\u262F'}
          </div>

          {/* 竹筒开口（顶部） */}
          <div
            style={{
              position: 'absolute',
              top: '-3px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '6px',
              borderRadius: '50%',
              background: 'linear-gradient(180deg, #2a1f16, #3d2e20)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </div>

      {/* ── 铜钱落下区域 ── */}
      {showCoins && (
        <div
          style={{
            position: 'relative',
            width: '50px',
            height: '264px', // 6 * 44px
            marginTop: '8px',
          }}
        >
          {lines.map((yao, i) => {
            const isYang = yao.value === 1;
            const isChanging = yao.changing;
            const dropClass = `coin-drop-${i + 1}`;
            // 从下到上排列：index 0 在底部，index 5 在顶部
            const bottomPos = i * 44;

            return (
              <div
                key={i}
                className={dropClass}
                style={{
                  position: 'absolute',
                  bottom: `${bottomPos}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  boxShadow: isYang
                    ? '0 0 12px rgba(200,164,92,0.3), inset 0 1px 1px rgba(255,255,255,0.2)'
                    : '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.05)',
                  border: isChanging
                    ? '2px solid rgba(200,164,92,0.8)'
                    : '1px solid rgba(200,164,92,0.15)',
                  // 动态背景
                  background: isYang
                    ? 'linear-gradient(135deg, #C8A45C 0%, #E8D5A3 100%)'
                    : 'linear-gradient(135deg, #2a2a2a 0%, #3d3d3d 100%)',
                  color: isYang ? '#0A0A0F' : '#8B7355',
                  zIndex: i + 1,
                }}
              >
                {yaoLabel(yao.value)}
              </div>
            );
          })}
        </div>
      )}

      {/* ── 卦名显现 ── */}
      {showHexagram && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 20,
            animation: 'scaleInSpring 0.8s ease-out forwards',
          }}
        >
          {/* 卦名背景光晕 */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,164,92,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />
          <p
            style={{
              color: '#C8A45C',
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textShadow: '0 0 20px rgba(200,164,92,0.3), 0 2px 4px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
            }}
          >
            {hexagramName}
          </p>
        </div>
      )}

      {/* ── prefers-reduced-motion 支持 ── */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .bamboo-shake {
            animation: none !important;
          }
          .coin-drop-1, .coin-drop-2, .coin-drop-3,
          .coin-drop-4, .coin-drop-5, .coin-drop-6 {
            animation: none !important;
            opacity: 1 !important;
            transform: translateX(-50%) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StepRitual;
