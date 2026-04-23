/**
 * TaijiParticles — 墨玉质感太极粒子背景
 *
 * 基于Canvas 2D，粒子围绕太极图案缓慢旋转流动
 * 金色粒子（阳）+ 暗色粒子（阴），克制不喧宾夺主
 */

import { memo, useRef, useEffect } from 'react';

interface TaijiParticlesProps {
  count?: number;
}

const TaijiParticles = memo(function TaijiParticles({ count = 80 }: TaijiParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w: number, h: number;
    let time = 0;

    interface Particle {
      angle: number;
      radius: number;
      size: number;
      speed: number;
      opacity: number;
      isGold: boolean;
      arm: number;
    }

    const particles: Particle[] = [];

    function resize() {
      const rect = canvas!.parentElement?.getBoundingClientRect();
      w = canvas!.width = rect?.width || window.innerWidth;
      h = canvas!.height = rect?.height || window.innerHeight;
    }

    function init() {
      resize();
      for (let i = 0; i < count; i++) {
        particles.push({
          angle: (Math.PI * 2 * i) / count + Math.random() * 0.5,
          radius: 80 + Math.random() * 200,
          size: 0.5 + Math.random() * 1.5,
          speed: 0.0003 + Math.random() * 0.0008,
          opacity: 0.1 + Math.random() * 0.4,
          isGold: Math.random() > 0.4,
          arm: Math.random() > 0.5 ? 0 : 1,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      time += 1;

      const cx = w / 2;
      const cy = h / 2;

      // 绘制太极轮廓（极淡）
      const taijiR = Math.min(w, h) * 0.25;
      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(time * 0.0002);

      ctx!.beginPath();
      ctx!.arc(0, 0, taijiR, 0, Math.PI * 2);
      ctx!.strokeStyle = 'rgba(200, 164, 92, 0.03)';
      ctx!.lineWidth = 1;
      ctx!.stroke();

      ctx!.beginPath();
      ctx!.arc(0, -taijiR / 2, taijiR / 2, Math.PI / 2, Math.PI * 1.5);
      ctx!.arc(0, taijiR / 2, taijiR / 2, -Math.PI / 2, Math.PI / 2);
      ctx!.strokeStyle = 'rgba(200, 164, 92, 0.02)';
      ctx!.stroke();

      ctx!.restore();

      // 绘制粒子
      for (const p of particles) {
        const rotAngle = p.angle + time * p.speed * (p.arm === 0 ? 1 : -1);
        const px = cx + Math.cos(rotAngle) * p.radius;
        const py = cy + Math.sin(rotAngle) * p.radius * 0.6;

        ctx!.beginPath();
        ctx!.arc(px, py, p.size, 0, Math.PI * 2);

        if (p.isGold) {
          ctx!.fillStyle = `rgba(200, 164, 92, ${p.opacity})`;
        } else {
          ctx!.fillStyle = `rgba(100, 100, 110, ${p.opacity * 0.6})`;
        }
        ctx!.fill();

        if (p.isGold && Math.random() > 0.995) {
          ctx!.beginPath();
          ctx!.arc(px, py, p.size * 3, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(200, 164, 92, ${p.opacity * 0.3})`;
          ctx!.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
      aria-hidden="true"
    />
  );
});

export default TaijiParticles;
