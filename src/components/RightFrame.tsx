import React from 'react';
import { HudStateType } from '../hooks/useHudState';

interface RightFrameProps {
  hudState: HudStateType;
  reducedMotion: boolean;
  harmonicFreqHz: number;
  quantumSync: number;
}

/**
 * Isolated outer faceted chevron bracket (for mobile screen-edge HUD framing)
 */
export const RightFacetedBracket: React.FC<{ hudState: HudStateType }> = ({ hudState }) => {
  const isError = hudState === 'ERROR';
  return (
    <svg
      className="w-full h-full overflow-visible"
      viewBox="240 50 65 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="rightBracketGlowOnly" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="rightBracketGradOnly" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="60%" stopColor={isError ? '#ff2a5f' : '#00f0ff'} stopOpacity="0.85" />
          <stop offset="100%" stopColor={isError ? '#ff2a5f' : '#0066ff'} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <g filter="url(#rightBracketGlowOnly)">
        {/* Upper Faceted Arm */}
        <path
          d="M 256 68 L 268 108 L 278 165 L 290 205 L 294 235 L 284 242 L 274 238 L 276 212 L 266 170 L 258 120 L 250 76 Z"
          fill="url(#rightBracketGradOnly)"
          opacity="0.95"
        />
        {/* Lower Faceted Arm */}
        <path
          d="M 294 245 L 290 275 L 278 315 L 268 372 L 256 412 L 250 404 L 258 360 L 266 310 L 276 268 L 274 242 L 284 238 Z"
          fill="url(#rightBracketGradOnly)"
          opacity="0.95"
        />
        {/* Central Chevron Expansion Point */}
        <polygon points="298,240 282,225 272,235 272,245 282,255" fill="#ffffff" opacity="0.95" />
        {/* Thin outer edge guide line */}
        <path
          d="M 254 60 Q 305 240 254 420"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeDasharray="18 4 6 4"
          opacity="0.85"
        />
      </g>
    </svg>
  );
};

/**
 * SIGNAL-03 [GT-47] badge component
 */
export const SignalBadgeRight: React.FC<{
  hudState: HudStateType;
  quantumSync: number;
  compact?: boolean;
}> = ({ hudState, quantumSync, compact }) => {
  const isError = hudState === 'ERROR';

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 select-none font-mono">
      {/* 4 Segmented Activity Blocks */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        <div className="w-1.5 h-1 sm:w-2 sm:h-1.5 bg-white opacity-95 rounded-2xs" />
        <div className="w-1.5 h-1 sm:w-2 sm:h-1.5 bg-white opacity-95 rounded-2xs" />
        <div className="w-1.5 h-1 sm:w-2 sm:h-1.5 bg-cyan-400 opacity-80 rounded-2xs" />
        <div
          className={`w-1.5 h-1 sm:w-2 sm:h-1.5 rounded-2xs ${
            quantumSync > 0.99 ? 'bg-cyan-400 opacity-90' : 'bg-cyan-900 opacity-40'
          }`}
        />
      </div>
      <div className="flex flex-col items-end bg-[#051329]/80 border border-cyan-500/30 px-2 py-0.5 rounded-xs shadow-[0_0_8px_rgba(0,240,255,0.15)]">
        <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-white">
          SIGNAL-03
        </span>
        <span className="text-[8px] text-cyan-300/80 tracking-wide font-medium">
          [GT-47]
        </span>
      </div>
    </div>
  );
};

/**
 * Mini Diagnostic Radar Component
 */
export const RadarTelemetryRight: React.FC<{
  hudState: HudStateType;
  reducedMotion: boolean;
  harmonicFreqHz: number;
}> = ({ hudState, reducedMotion, harmonicFreqHz }) => {
  const isError = hudState === 'ERROR';
  const strokeColor = isError ? '#ff2a5f' : '#00f0ff';

  return (
    <div className="flex items-center gap-2 select-none font-mono">
      {/* Mini Circular Radar Canvas/SVG */}
      <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0">
        <svg className="w-full h-full" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" stroke={strokeColor} strokeWidth="0.8" opacity="0.35" />
          <circle cx="18" cy="18" r="9" stroke={strokeColor} strokeWidth="0.6" opacity="0.45" />
          <line x1="2" y1="18" x2="34" y2="18" stroke={strokeColor} strokeWidth="0.5" opacity="0.3" />
          <line x1="18" y1="2" x2="18" y2="34" stroke={strokeColor} strokeWidth="0.5" opacity="0.3" />

          {/* Sweeping Cone */}
          <g transform="translate(18, 18)">
            <g className={reducedMotion ? '' : 'animate-radar'}>
              <line x1="0" y1="0" x2="16" y2="0" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
              <path d="M 0 0 L 16 0 A 16 16 0 0 1 11 11 Z" fill={strokeColor} opacity="0.25" />
            </g>
            <circle cx="6" cy="-5" r="1.2" fill="#ffffff" opacity="0.8" />
            <circle cx="-5" cy="6" r="1" fill={strokeColor} opacity="0.7" />
          </g>
        </svg>
      </div>

      <div className="flex flex-col items-start">
        <span className="text-[8px] sm:text-[9px] tracking-widest text-cyan-400/60 uppercase">
          SYS / 02 · RADAR
        </span>
        <span className="text-[10px] sm:text-xs font-bold text-white tabular-nums">
          {harmonicFreqHz} Hz
        </span>
      </div>
    </div>
  );
};

/**
 * Full Panoramic Right Frame (Desktop & Tablet Landscape)
 */
export const RightFrame: React.FC<RightFrameProps> = ({
  hudState,
  reducedMotion,
  harmonicFreqHz,
  quantumSync,
}) => {
  const isError = hudState === 'ERROR';
  const strokeColor = isError ? '#ff2a5f' : '#00f0ff';

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] select-none pointer-events-none flex items-center justify-end">
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 320 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="rightGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="rightBracketGrad" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="60%" stopColor={isError ? '#ff2a5f' : '#00f0ff'} stopOpacity="0.85" />
            <stop offset="100%" stopColor={isError ? '#ff2a5f' : '#0066ff'} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* 1. Iconic Right Angular Faceted White/Cyan Chevron Bracket */}
        <g filter="url(#rightGlow)">
          <path
            d="M 256 68 L 268 108 L 278 165 L 290 205 L 294 235 L 284 242 L 274 238 L 276 212 L 266 170 L 258 120 L 250 76 Z"
            fill="url(#rightBracketGrad)"
            opacity="0.95"
          />
          <path
            d="M 294 245 L 290 275 L 278 315 L 268 372 L 256 412 L 250 404 L 258 360 L 266 310 L 276 268 L 274 242 L 284 238 Z"
            fill="url(#rightBracketGrad)"
            opacity="0.95"
          />
          <polygon points="298,240 282,225 272,235 272,245 282,255" fill="#ffffff" opacity="0.9" />
          <path
            d="M 254 60 Q 305 240 254 420"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="18 4 6 4"
            opacity="0.8"
          />
        </g>

        {/* 2. Horizontal Connector Circuit Lines */}
        <g opacity="0.65" stroke={strokeColor} strokeWidth="1.2">
          <path d="M 235 100 L 165 100 L 140 135 L 35 135" fill="none" />
          <circle cx="35" cy="135" r="2" fill={strokeColor} />
          <path d="M 240 195 L 175 195 L 145 175 L 25 175" fill="none" />
          <path d="M 240 285 L 175 285 L 145 305 L 25 305" fill="none" />
          <path d="M 235 380 L 165 380 L 140 345 L 35 345" fill="none" />
          <circle cx="35" cy="345" r="2" fill={strokeColor} />
          <path d="M 240 430 L 180 430 L 180 440 L 10 440" fill="none" strokeDasharray="6 3" />
        </g>

        {/* 3. Signal Badge & Indicators: SIGNAL-03 [GT-47] */}
        <g transform="translate(112, 222)">
          <rect
            x="-4"
            y="-10"
            width="64"
            height="18"
            fill="#051329"
            stroke={strokeColor}
            strokeWidth="0.8"
            rx="2"
            opacity="0.8"
          />
          <text
            x="2"
            y="2"
            fill={isError ? '#ff2a5f' : '#ffffff'}
            fontSize="8"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="0.8"
          >
            SIGNAL-03
          </text>
          <text
            x="2"
            y="17"
            fill="#00f0ff"
            fontSize="7"
            fontFamily="monospace"
            opacity="0.85"
            letterSpacing="0.5"
          >
            [GT-47]
          </text>
          <g transform="translate(4, 23)">
            <rect x="0" y="0" width="4" height="3" fill="#ffffff" opacity="0.9" />
            <rect x="6" y="0" width="4" height="3" fill="#ffffff" opacity="0.9" />
            <rect x="12" y="0" width="4" height="3" fill="#00f0ff" opacity="0.75" />
            <rect x="18" y="0" width="4" height="3" fill="#00f0ff" opacity={quantumSync > 0.99 ? 0.9 : 0.4} />
          </g>
        </g>

        {/* 4. Circular Mini Diagnostic Radar Sweep (SYS / 02) */}
        <g transform="translate(185, 275)">
          <text x="-4" y="-22" fill="#00f0ff" fontSize="6.5" fontFamily="monospace" opacity="0.65" letterSpacing="1">
            SYS / 02 · RADAR
          </text>
          <circle cx="16" cy="0" r="18" fill="none" stroke={strokeColor} strokeWidth="0.8" opacity="0.3" />
          <circle cx="16" cy="0" r="10" fill="none" stroke={strokeColor} strokeWidth="0.6" opacity="0.4" />
          <line x1="-2" y1="0" x2="34" y2="0" stroke={strokeColor} strokeWidth="0.5" opacity="0.25" />
          <line x1="16" y1="-18" x2="16" y2="18" stroke={strokeColor} strokeWidth="0.5" opacity="0.25" />

          <g transform="translate(16, 0)">
            <g className={reducedMotion ? '' : 'animate-radar'}>
              <line x1="0" y1="0" x2="18" y2="0" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
              <path d="M 0 0 L 18 0 A 18 18 0 0 1 12 13 Z" fill={strokeColor} opacity="0.25" />
            </g>
            <circle cx="8" cy="-6" r="1.5" fill="#ffffff" opacity="0.8" />
            <circle cx="-6" cy="7" r="1.2" fill={strokeColor} opacity="0.7" />
          </g>

          <text x="-4" y="32" fill="#ffffff" fontSize="7" fontFamily="monospace" fontWeight="bold">
            {harmonicFreqHz} Hz
          </text>
        </g>
      </svg>
    </div>
  );
};
