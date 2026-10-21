import React, { useEffect, useRef } from 'react';
import { HudStateType } from '../hooks/useHudState';

interface HudBackgroundProps {
  hudState: HudStateType;
  reducedMotion: boolean;
}

export const HudBackground: React.FC<HudBackgroundProps> = ({ hudState, reducedMotion }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas particle starfield / floating technical dust
  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Bounded particle pool
    const PARTICLE_COUNT = 38;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 1.5 + 0.5,
      baseAlpha: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const isError = hudState === 'ERROR';
      const particleColor = isError ? '255, 42, 95' : '0, 240, 255';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.phase += dt * 1.2;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pulseAlpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.phase));

        ctx.fillStyle = `rgba(${particleColor}, ${pulseAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion, hudState]);

  const isError = hudState === 'ERROR';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-[#020713]">
      {/* Dynamic Radial Core Glow */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isError ? 'opacity-80' : 'opacity-100'
        }`}
        style={{
          background: isError
            ? 'radial-gradient(circle at 50% 50%, rgba(255, 42, 95, 0.18) 0%, rgba(90, 10, 30, 0.12) 35%, rgba(2, 7, 19, 0.95) 75%)'
            : 'radial-gradient(circle at 50% 50%, rgba(0, 130, 255, 0.22) 0%, rgba(0, 60, 160, 0.14) 38%, rgba(2, 7, 19, 0.95) 80%)',
        }}
      />

      {/* Visor Grid Curvature SVG (Cockpit Lens HUD grid as seen in reference image) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="gridFade" cx="50%" cy="50%" r="50%">
            <stop offset="20%" stopColor="#00f0ff" stopOpacity="0.45" />
            <stop offset="65%" stopColor="#0066ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#020713" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bracketGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
            <stop offset="20%" stopColor="#00f0ff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#00f0ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Visor top bracket line (matching reference image top edge) */}
        <path
          d="M 120 40 L 520 40 L 560 85 L 880 85 L 920 40 L 1320 40"
          fill="none"
          stroke="url(#bracketGlow)"
          strokeWidth="1.2"
          opacity="0.5"
        />

        {/* Visor bottom bracket line (matching reference image bottom edge) */}
        <path
          d="M 120 860 L 520 860 L 560 815 L 880 815 L 920 860 L 1320 860"
          fill="none"
          stroke="url(#bracketGlow)"
          strokeWidth="1.2"
          opacity="0.5"
        />

        {/* Curved Perspective Latitude Lines */}
        <path d="M 0 180 Q 720 220 1440 180" fill="none" stroke="#00f0ff" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.25" />
        <path d="M 0 310 Q 720 340 1440 310" fill="none" stroke="#00f0ff" strokeWidth="0.7" opacity="0.3" />
        <path d="M 0 450 L 1440 450" fill="none" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="6 8" opacity="0.2" />
        <path d="M 0 590 Q 720 560 1440 590" fill="none" stroke="#00f0ff" strokeWidth="0.7" opacity="0.3" />
        <path d="M 0 720 Q 720 680 1440 720" fill="none" stroke="#00f0ff" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.25" />

        {/* Curved Perspective Longitude Lines */}
        <path d="M 220 0 Q 250 450 220 900" fill="none" stroke="#00f0ff" strokeWidth="0.6" strokeDasharray="3 6" opacity="0.2" />
        <path d="M 400 0 Q 420 450 400 900" fill="none" stroke="#00f0ff" strokeWidth="0.7" opacity="0.25" />
        <path d="M 580 0 Q 590 450 580 900" fill="none" stroke="#00f0ff" strokeWidth="0.7" opacity="0.2" />
        <path d="M 860 0 Q 850 450 860 900" fill="none" stroke="#00f0ff" strokeWidth="0.7" opacity="0.2" />
        <path d="M 1040 0 Q 1020 450 1040 900" fill="none" stroke="#00f0ff" strokeWidth="0.7" opacity="0.25" />
        <path d="M 1220 0 Q 1190 450 1220 900" fill="none" stroke="#00f0ff" strokeWidth="0.6" strokeDasharray="3 6" opacity="0.2" />

        {/* Alignment Intersection Dots */}
        {[
          [400, 310], [580, 310], [860, 310], [1040, 310],
          [400, 590], [580, 590], [860, 590], [1040, 590],
          [220, 450], [1220, 450]
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="1.5" fill="#00f0ff" opacity="0.5" />
            <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" />
            <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" />
          </g>
        ))}
      </svg>

      {/* Floating Canvas Dust Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle Horizontal CRT / Holographic Scanline Bar */}
      {!reducedMotion && (
        <div
          className="absolute left-0 right-0 h-24 pointer-events-none opacity-20"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(0, 240, 255, 0.15), transparent)',
            animation: 'scanline-pass 10s linear infinite',
          }}
        />
      )}

      {/* Vignette Shadow Frame */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 120px rgba(2, 6, 18, 0.85), inset 0 0 200px rgba(2, 6, 18, 0.95)',
        }}
      />
    </div>
  );
};
