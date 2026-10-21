import React from 'react';
import { HudStateType } from '../../hooks/useHudState';

interface ReactorScanEffectProps {
  hudState: HudStateType;
  reducedMotion: boolean;
}

export const ReactorScanEffect: React.FC<ReactorScanEffectProps> = ({ hudState, reducedMotion }) => {
  if (reducedMotion) return null;

  const isError = hudState === 'ERROR';
  const color = isError ? '#ff2a5f' : '#00f0ff';
  const scanDuration = hudState === 'THINKING' ? '2.5s' : hudState === 'LISTENING' ? '4s' : '7s';

  return (
    <g
      className="reactor-scan-effect pointer-events-none select-none"
      style={{
        transformOrigin: '250px 250px',
        animation: `rotate-cw ${scanDuration} linear infinite`,
      }}
    >
      <defs>
        <radialGradient id="scanBeamGrad" cx="250" cy="250" r="185" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="60%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sweeping 45-degree translucent cone */}
      <path
        d="M 250 250 L 380 120 A 185 185 0 0 1 435 250 Z"
        fill="url(#scanBeamGrad)"
        opacity="0.65"
      />

      {/* Leading crisp scan line */}
      <line
        x1="250"
        y1="250"
        x2="435"
        y2="250"
        stroke="#ffffff"
        strokeWidth="1.6"
        opacity="0.9"
        style={{
          filter: `drop-shadow(0 0 6px ${color})`,
        }}
      />

      {/* Target ping at perimeter */}
      <circle cx="435" cy="250" r="2.5" fill="#ffffff" />
    </g>
  );
};
