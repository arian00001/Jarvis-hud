import React from 'react';
import { HudStateType } from '../../hooks/useHudState';

interface ReactorMechanicalRingProps {
  hudState: HudStateType;
  reducedMotion: boolean;
}

export const ReactorMechanicalRing: React.FC<ReactorMechanicalRingProps> = ({
  hudState,
  reducedMotion,
}) => {
  const isError = hudState === 'ERROR';
  const color = isError ? '#ff2a5f' : '#00f0ff';

  const spinDuration = hudState === 'THINKING' ? '8s' : '32s';

  return (
    <g
      className={`reactor-mechanical-ring ${reducedMotion ? '' : 'animate-rotate-cw'}`}
      style={{
        transformOrigin: '250px 250px',
        animationDuration: spinDuration,
      }}
    >
      {/* Heavy Mechanical Cog Blocks R=142 */}
      <circle
        cx="250"
        cy="250"
        r="142"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray="6 14 18 10 32 16 8 8 24 12"
        opacity="0.85"
      />

      {/* High-Precision Outer Teeth Ring R=148 */}
      <circle
        cx="250"
        cy="250"
        r="148"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeDasharray="4 8 12 8"
        opacity="0.8"
      />

      {/* Mechanical Caliper Notches (Every 60 degrees) */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 250 250)`}>
          <line x1="250" y1="134" x2="250" y2="152" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
          <polygon points="248,136 252,136 250,140" fill={color} />
        </g>
      ))}

      {/* Internal Ball-Bearing Guide Track R=134 */}
      <circle
        cx="250"
        cy="250"
        r="134"
        fill="none"
        stroke={isError ? '#ff2a5f' : '#0284c7'}
        strokeWidth="1.2"
        strokeDasharray="3 6"
        opacity="0.6"
      />

      {/* Micro-Perimeter Hairline Ring R=154 */}
      <circle
        cx="250"
        cy="250"
        r="154"
        fill="none"
        stroke={color}
        strokeWidth="0.6"
        strokeDasharray="1 5"
        opacity="0.4"
      />
    </g>
  );
};
