import React from 'react';
import { HudStateType } from '../../hooks/useHudState';

interface ReactorOuterRingProps {
  hudState: HudStateType;
  reducedMotion: boolean;
}

export const ReactorOuterRing: React.FC<ReactorOuterRingProps> = ({ hudState, reducedMotion }) => {
  const isError = hudState === 'ERROR';
  const color = isError ? '#ff2a5f' : '#00f0ff';

  const spinDuration =
    hudState === 'THINKING' ? '6s' : hudState === 'SPEAKING' ? '12s' : hudState === 'LISTENING' ? '14s' : '24s';

  const angleLabels = [
    { deg: 0, text: '000°' },
    { deg: 45, text: '045°' },
    { deg: 90, text: '090°' },
    { deg: 135, text: '135°' },
    { deg: 180, text: '180°' },
    { deg: 225, text: '225°' },
    { deg: 270, text: '270°' },
    { deg: 315, text: '315°' },
  ];

  return (
    <g
      className={`reactor-outer-ring ${reducedMotion ? '' : 'animate-rotate-cw'}`}
      style={{
        transformOrigin: '250px 250px',
        animationDuration: spinDuration,
      }}
    >
      <defs>
        <filter id="outerRingGlowDetailed" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Primary Circular Track R=186 */}
      <circle
        cx="250"
        cy="250"
        r="186"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeDasharray="95 18 45 12 180 25 70 15"
        opacity="0.85"
        filter="url(#outerRingGlowDetailed)"
      />

      {/* Bright Accent Arcs */}
      <circle
        cx="250"
        cy="250"
        r="186"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeDasharray="32 420"
        strokeDashoffset="12"
        opacity="0.95"
      />
      <circle
        cx="250"
        cy="250"
        r="186"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeDasharray="42 440"
        strokeDashoffset="260"
        opacity="0.95"
      />

      {/* Vernier Degree Markings along the outer perimeter (000°, 045°, 090°...) */}
      {angleLabels.map((item) => {
        const rad = (item.deg * Math.PI) / 180;
        const lx = 250 + Math.cos(rad) * 206;
        const ly = 250 + Math.sin(rad) * 206;
        return (
          <g key={item.deg} transform={`rotate(${item.deg} 250 250)`}>
            <line x1="250" y1="56" x2="250" y2="64" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
            <text
              x="250"
              y="50"
              textAnchor="middle"
              fill={color}
              fontSize="6"
              fontFamily="monospace"
              fontWeight="bold"
              opacity="0.75"
              transform="rotate(90 250 50)"
            >
              {item.text}
            </text>
          </g>
        );
      })}

      {/* Orbiting Luminous Nodes & Trailing Beads */}
      <circle cx="250" cy="64" r="3.2" fill="#ffffff" filter="url(#outerRingGlowDetailed)" />
      <circle cx="250" cy="64" r="1.5" fill="#00f0ff" />
      <circle cx="436" cy="250" r="2.8" fill={color} filter="url(#outerRingGlowDetailed)" />
      <circle cx="250" cy="436" r="3.2" fill="#ffffff" filter="url(#outerRingGlowDetailed)" />
      <circle cx="64" cy="250" r="2.8" fill={color} filter="url(#outerRingGlowDetailed)" />

      {/* Secondary Outer Concentric Hairline Ring R=198 */}
      <circle
        cx="250"
        cy="250"
        r="198"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        strokeDasharray="4 8 18 12"
        opacity="0.45"
      />
      {/* Outer Limit Hairline Ring R=214 */}
      <circle
        cx="250"
        cy="250"
        r="214"
        fill="none"
        stroke={color}
        strokeWidth="0.6"
        strokeDasharray="2 12"
        opacity="0.3"
      />
    </g>
  );
};
