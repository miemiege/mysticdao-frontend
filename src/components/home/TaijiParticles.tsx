import React, { useEffect, useRef } from 'react';

interface TaijiParticlesProps {
  count?: number;
  className?: string;
}

const TaijiParticles: React.FC<TaijiParticlesProps> = ({ count = 80, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; angle: number; speed: number;
      pulse: number; pulseSpeed: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const init = () => {
      resize();
      particles = [];
      const colors = ['#C8A45C', '#9B2C2C'];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          color: colors[i % 2],
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.2,
          pulse: Math.random() * Math.PI,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        });
      }
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      particles.forEach((p) => {
        p.angle += p.speed * 0.01;
        p.pulse += p.pulseSpeed;

        const orbitX = cx + Math.cos(p.angle) * (w * 0.3);
        const orbitY = cy + Math.sin(p.angle) * (h * 0.2);

        p.x += p.vx + (orbitX - p.x) * 0.002;
        p.y += p.vy + (orbitY - p.y) * 0.002;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const pulseSize = p.size * (1 + Math.sin(p.pulse) * 0.3);
        const alpha = 0.3 + Math.sin(p.pulse) * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseSize * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseSize * 3);
        grad.addColorStop(0, p.color + '40');
        grad.addColorStop(1, p.color + '00');
        ctx.fillStyle = grad;
        ctx.globalAlpha = alpha * 0.5;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default TaijiParticles;
