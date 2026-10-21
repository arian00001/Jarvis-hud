import React from 'react';
import { HudStateType } from '../../hooks/useHudState';

interface ReactorSegmentRingProps {
  hudState: HudStateType;
  reducedMotion: boolean;
}

export const ReactorSegmentRing: React.FC<ReactorSegmentRingProps> = ({ hudState, reducedMotion }) => {
  const isError = hudState === 'ERROR';
  const color = isError ? '#ff2a5f' : '#00f0ff';

  // Duration for counter-clockwise rotation
  const spinDuration =
    hudState === 'THINKING' ? '4.5s' : hudState === 'SPEAKING' ? '9s' : hudState === 'LISTENING' ? '11s' : '15s';

  return (
    <g
      className={`reactor-segment-ring ${reducedMotion ? '' : 'animate-rotate-ccw'}`}
      style={{
        transformOrigin: '250px 250px',
        animationDuration: spinDuration,
      }}
    >
      <defs>
        <filter id="segmentGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Segmented Band R=165 with alternating short arc sections */}
      <circle
        cx="250"
        cy="250"
        r="165"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray="22 10 35 14 15 10 40 18"
        opacity="0.65"
        filter="url(#segmentGlow)"
      />

      {/* High-contrast crisp white sub-segments */}
      <circle
        cx="250"
        cy="250"
        r="165"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeDasharray="12 120"
        strokeDashoffset="45"
        opacity="0.9"
      />
      <circle
        cx="250"
        cy="250"
        r="165"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeDasharray="12 120"
        strokeDashoffset="180"
        opacity="0.9"
      />

      {/* Concentric slotted track R=156 */}
      <circle
        cx="250"
        cy="250"
        r="156"
        fill="none"
        stroke={isError ? '#ff2a5f' : '#0066ff'}
        strokeWidth="1.5"
        strokeDasharray="4 6"
        opacity="0.5"
      />
    </g>
  );
};
