import React from 'react';
import { HudStateType } from '../../hooks/useHudState';

interface ReactorGlassWingsProps {
  hudState: HudStateType;
}

export const ReactorGlassWings: React.FC<ReactorGlassWingsProps> = ({ hudState }) => {
  const isError = hudState === 'ERROR';
  const color = isError ? '#ff2a5f' : '#00f0ff';
  const glowFilter = isError ? 'url(#wingGlowError)' : 'url(#wingGlow)';

  return (
    <g className="reactor-glass-wings pointer-events-none select-none">
      <defs>
        <filter id="wingGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="wingGlowError" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="glassWingGradLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={isError ? '#ff2a5f' : '#00f0ff'} stopOpacity="0.4" />
          <stop offset="60%" stopColor={isError ? '#ff2a5f' : '#0066ff'} stopOpacity="0.15" />
          <stop offset="100%" stopColor="#051329" stopOpacity="0.05" />
        </linearGradient>

        <linearGradient id="glassWingGradRight" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor={isError ? '#ff2a5f' : '#00f0ff'} stopOpacity="0.4" />
          <stop offset="60%" stopColor={isError ? '#ff2a5f' : '#0066ff'} stopOpacity="0.15" />
          <stop offset="100%" stopColor="#051329" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* LEFT TRANSLUCENT GLASS WING LENS (Signature element from reference) */}
      <g filter={glowFilter}>
        {/* Flared curved plate */}
        <path
          d="M 197 202 
             C 192 216 189 233 189 250 
             C 189 267 192 284 197 298 
             L 204 304 
             C 200 286 197 268 197 250 
             C 197 232 200 214 204 196 
             Z"
          fill="url(#glassWingGradLeft)"
          stroke={color}
          strokeWidth="1.2"
        />

        {/* Outer flared wing tips with notches */}
        <path
          d="M 197 202 L 175 190 L 179 204 L 195 214"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <path
          d="M 197 298 L 175 310 L 179 296 L 195 286"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* Glowing tip anchor nodes */}
        <circle cx="175" cy="190" r="2" fill="#ffffff" />
        <circle cx="175" cy="310" r="2" fill="#ffffff" />
      </g>

      {/* RIGHT TRANSLUCENT GLASS WING LENS (Signature element from reference) */}
      <g filter={glowFilter}>
        {/* Flared curved plate */}
        <path
          d="M 303 202 
             C 308 216 311 233 311 250 
             C 311 267 308 284 303 298 
             L 296 304 
             C 300 286 303 268 303 250 
             C 303 232 300 214 296 196 
             Z"
          fill="url(#glassWingGradRight)"
          stroke={color}
          strokeWidth="1.2"
        />

        {/* Outer flared wing tips with notches */}
        <path
          d="M 303 202 L 325 190 L 321 204 L 305 214"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <path
          d="M 303 298 L 325 310 L 321 296 L 305 286"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* Glowing tip anchor nodes */}
        <circle cx="325" cy="190" r="2" fill="#ffffff" />
        <circle cx="325" cy="310" r="2" fill="#ffffff" />
      </g>
    </g>
  );
};
