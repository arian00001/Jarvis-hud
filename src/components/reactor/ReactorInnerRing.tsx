import React from 'react';
import { HudStateType } from '../../hooks/useHudState';

interface ReactorInnerRingProps {
  hudState: HudStateType;
  reducedMotion: boolean;
}

export const ReactorInnerRing: React.FC<ReactorInnerRingProps> = ({ hudState, reducedMotion }) => {
  const isError = hudState === 'ERROR';
  const color = isError ? '#ff2a5f' : '#00f0ff';

  const spinDuration = hudState === 'THINKING' ? '5s' : '18s';

  return (
    <g
      className={`reactor-inner-ring ${reducedMotion ? '' : 'animate-rotate-ccw'}`}
      style={{
        transformOrigin: '250px 250px',
        animationDuration: spinDuration,
      }}
    >
      <defs>
        <filter id="innerRingGlowDetailed" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Primary Inner Luminous Ring R=88 */}
      <circle
        cx="250"
        cy="250"
        r="88"
        fill="none"
        stroke={isError ? '#ff2a5f' : '#00f0ff'}
        strokeWidth="3.2"
        strokeDasharray="42 6 85 8 130 12"
        opacity="0.9"
        filter="url(#innerRingGlowDetailed)"
      />

      {/* Bright Solid Accent Sections */}
      <circle
        cx="250"
        cy="250"
        r="88"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeDasharray="28 240"
        strokeDashoffset="20"
        opacity="0.95"
      />
      <circle
        cx="250"
        cy="250"
        r="88"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeDasharray="28 240"
        strokeDashoffset="140"
        opacity="0.95"
      />

      {/* 8 Directional Chevron Markers along ring */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 250 250)`}>
          <polygon
            points="250,157 246.5,163 253.5,163"
            fill={deg % 90 === 0 ? '#ffffff' : color}
            opacity="0.9"
          />
        </g>
      ))}

      {/* Micro Telemetry HUD Readout Marks inside Ring */}
      <g opacity="0.75">
        <text
          x="250"
          y="169"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="4.5"
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing="0.5"
        >
          ARC·85
        </text>
        <text
          x="250"
          y="337"
          textAnchor="middle"
          fill={color}
          fontSize="4.5"
          fontFamily="monospace"
          letterSpacing="0.5"
        >
          FLUX·98
        </text>
      </g>

      {/* Concentric Reticle Guides R=76 */}
      <circle
        cx="250"
        cy="250"
        r="76"
        fill="none"
        stroke={isError ? '#ff2a5f' : '#0066ff'}
        strokeWidth="1.2"
        strokeDasharray="4 8"
        opacity="0.6"
      />

      {/* Micro Star Aperture Guide R=68 */}
      <circle
        cx="250"
        cy="250"
        r="68"
        fill="none"
        stroke="#ffffff"
        strokeWidth="0.6"
        strokeDasharray="2 4"
        opacity="0.5"
      />
    </g>
  );
};
