import React from 'react';
import { HudStateType } from '../../hooks/useHudState';

interface ReactorShieldArcsProps {
  hudState: HudStateType;
}

export const ReactorShieldArcs: React.FC<ReactorShieldArcsProps> = ({ hudState }) => {
  const isError = hudState === 'ERROR';
  const color = isError ? '#ff2a5f' : '#ffffff';
  const glow = isError ? 'rgba(255, 42, 95, 0.8)' : 'rgba(0, 240, 255, 0.7)';

  return (
    <g className="reactor-shield-arcs pointer-events-none select-none">
      <defs>
        <filter id="shieldGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="shieldGradTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="60%" stopColor={isError ? '#ff2a5f' : '#00f0ff'} stopOpacity="0.9" />
          <stop offset="100%" stopColor={isError ? '#ff2a5f' : '#0066ff'} stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="shieldGradBottom" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="60%" stopColor={isError ? '#ff2a5f' : '#00f0ff'} stopOpacity="0.9" />
          <stop offset="100%" stopColor={isError ? '#ff2a5f' : '#0066ff'} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Top Chunky Stepped Arc Shield (from reference image) */}
      <g filter="url(#shieldGlow)">
        <path
          d="M 160 85 
             C 200 62 300 62 340 85 
             L 326 95 
             C 292 78 208 78 174 95 
             Z"
          fill="url(#shieldGradTop)"
        />
        {/* Stepped crown notch */}
        <polygon
          points="225,62 275,62 265,55 235,55"
          fill="#ffffff"
          opacity="0.95"
        />
        {/* Fine outline tracker */}
        <path
          d="M 145 95 C 195 56 305 56 355 95"
          fill="none"
          stroke={isError ? '#ff2a5f' : '#00f0ff'}
          strokeWidth="1.2"
          strokeDasharray="4 8"
          opacity="0.75"
        />
      </g>

      {/* Bottom Chunky Stepped Arc Shield (from reference image) */}
      <g filter="url(#shieldGlow)">
        <path
          d="M 160 415 
             C 200 438 300 438 340 415 
             L 326 405 
             C 292 422 208 422 174 405 
             Z"
          fill="url(#shieldGradBottom)"
        />
        {/* Stepped keel notch */}
        <polygon
          points="225,438 275,438 265,445 235,445"
          fill="#ffffff"
          opacity="0.95"
        />
        {/* Fine outline tracker */}
        <path
          d="M 145 405 C 195 444 305 444 355 405"
          fill="none"
          stroke={isError ? '#ff2a5f' : '#00f0ff'}
          strokeWidth="1.2"
          strokeDasharray="4 8"
          opacity="0.75"
        />
      </g>

      {/* Inner Curved White Bracket Tabs (Framing center circle from left & right, matching reference) */}
      <g filter="url(#shieldGlow)">
        {/* Left inner curved tab '(' */}
        <path
          d="M 112 218 
             C 120 232 120 268 112 282 
             L 105 285 
             C 114 268 114 232 105 215 
             Z"
          fill="#ffffff"
          opacity="0.95"
        />
        {/* Right inner curved tab ')' */}
        <path
          d="M 388 218 
             C 380 232 380 268 388 282 
             L 395 285 
             C 386 268 386 232 395 215 
             Z"
          fill="#ffffff"
          opacity="0.95"
        />
      </g>

      {/* Cardinal Alignment Dots & Hairline Crosshair Markers */}
      <circle cx="95" cy="250" r="2" fill="#ffffff" filter="url(#shieldGlow)" />
      <circle cx="405" cy="250" r="2" fill="#ffffff" filter="url(#shieldGlow)" />
      <line x1="75" y1="250" x2="90" y2="250" stroke={isError ? '#ff2a5f' : '#00f0ff'} strokeWidth="1" opacity="0.6" />
      <line x1="410" y1="250" x2="425" y2="250" stroke={isError ? '#ff2a5f' : '#00f0ff'} strokeWidth="1" opacity="0.6" />
    </g>
  );
};
