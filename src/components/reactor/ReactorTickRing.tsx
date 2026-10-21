import React, { useMemo } from 'react';
import { HudStateType } from '../../hooks/useHudState';

interface ReactorTickRingProps {
  hudState: HudStateType;
  reducedMotion: boolean;
}

export const ReactorTickRing: React.FC<ReactorTickRingProps> = ({ hudState, reducedMotion }) => {
  const isError = hudState === 'ERROR';
  const color = isError ? '#ff2a5f' : '#00f0ff';

  // 120 precision ticks around r=118 to r=128 for rich instrument detail
  const ticks = useMemo(() => {
    const list = [];
    const count = 120;
    const center = 250;
    const baseR = 118;

    for (let i = 0; i < count; i++) {
      const angle = (i * 360) / count;
      const rad = (angle * Math.PI) / 180;
      const isCardinal = i % 30 === 0; // 0, 90, 180, 270 deg
      const isMajor = i % 10 === 0;
      const isSemi = i % 5 === 0;
      const tickLength = isCardinal ? 10 : isMajor ? 7 : isSemi ? 4.5 : 2.5;

      const x1 = center + Math.cos(rad) * baseR;
      const y1 = center + Math.sin(rad) * baseR;
      const x2 = center + Math.cos(rad) * (baseR + tickLength);
      const y2 = center + Math.sin(rad) * (baseR + tickLength);

      list.push({
        id: i,
        x1,
        y1,
        x2,
        y2,
        isMajor,
        isCardinal,
        isSemi,
      });
    }
    return list;
  }, []);

  const spinDuration = hudState === 'THINKING' ? '14s' : '72s';

  return (
    <g
      className={`reactor-tick-ring ${reducedMotion ? '' : 'animate-rotate-cw'}`}
      style={{
        transformOrigin: '250px 250px',
        animationDuration: spinDuration,
      }}
    >
      {/* 120 Precision Calibration Ticks */}
      {ticks.map((t) => (
        <line
          key={t.id}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.isCardinal ? '#ffffff' : t.isMajor ? '#ffffff' : color}
          strokeWidth={t.isCardinal ? 1.6 : t.isMajor ? 1.2 : t.isSemi ? 0.8 : 0.5}
          opacity={t.isCardinal ? 0.95 : t.isMajor ? 0.8 : t.isSemi ? 0.5 : 0.28}
        />
      ))}

      {/* Cardinal Diamond Markers */}
      {[0, 90, 180, 270].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 250 250)`}>
          <polygon
            points="250,114 252.5,116.5 250,119 247.5,116.5"
            fill="#ffffff"
            opacity="0.95"
          />
        </g>
      ))}

      {/* Orbiting Vernier Cursor Beads */}
      <circle cx="250" cy="115" r="2.4" fill="#ffffff" />
      <circle cx="250" cy="385" r="2.4" fill="#ffffff" />
      <circle cx="115" cy="250" r="2.4" fill="#ffffff" />
      <circle cx="385" cy="250" r="2.4" fill="#ffffff" />
    </g>
  );
};
