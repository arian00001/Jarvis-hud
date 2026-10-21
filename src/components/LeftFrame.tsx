import React from 'react';
import { HudStateType } from '../hooks/useHudState';

interface LeftFrameProps {
  hudState: HudStateType;
  reducedMotion: boolean;
  fluxPercent: number;
  pingMs: number;
}

/**
 * Isolated outer faceted chevron bracket (for mobile screen-edge HUD framing)
 */
export const LeftFacetedBracket: React.FC<{ hudState: HudStateType }> = ({ hudState }) => {
  const isError = hudState === 'ERROR';
  return (
    <svg
      className="w-full h-full overflow-visible"
      viewBox="15 50 65 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="leftBracketGlowOnly" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="leftBracketGradOnly" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="60%" stopColor={isError ? '#ff2a5f' : '#00f0ff'} stopOpacity="0.85" />
          <stop offset="100%" stopColor={isError ? '#ff2a5f' : '#0066ff'} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <g filter="url(#leftBracketGlowOnly)">
        {/* Upper Faceted Arm */}
        <path
          d="M 64 68 L 52 108 L 42 165 L 30 205 L 26 235 L 36 242 L 46 238 L 44 212 L 54 170 L 62 120 L 70 76 Z"
          fill="url(#leftBracketGradOnly)"
          opacity="0.95"
        />
        {/* Lower Faceted Arm */}
        <path
          d="M 26 245 L 30 275 L 42 315 L 52 372 L 64 412 L 70 404 L 62 360 L 54 310 L 44 268 L 46 242 L 36 238 Z"
          fill="url(#leftBracketGradOnly)"
          opacity="0.95"
        />
        {/* Central Chevron Expansion Point */}
        <polygon points="22,240 38,225 48,235 48,245 38,255" fill="#ffffff" opacity="0.95" />
        {/* Thin outer edge guide line */}
        <path
          d="M 66 60 Q 15 240 66 420"
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
 * SIGNAL-14 [MD-34] badge component
 */
export const SignalBadgeLeft: React.FC<{
  hudState: HudStateType;
  pingMs: number;
  compact?: boolean;
}> = ({ hudState, pingMs, compact }) => {
  const isError = hudState === 'ERROR';
  const strokeColor = isError ? '#ff2a5f' : '#00f0ff';

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 select-none font-mono">
      <div className="flex flex-col items-start bg-[#051329]/80 border border-cyan-500/30 px-2 py-0.5 rounded-xs shadow-[0_0_8px_rgba(0,240,255,0.15)]">
        <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-white">
          SIGNAL-14
        </span>
        <span className="text-[8px] text-cyan-300/80 tracking-wide font-medium">
          [MD-34]
        </span>
      </div>
      {/* 4 Segmented Activity Blocks */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        <div className="w-1.5 h-1 sm:w-2 sm:h-1.5 bg-white opacity-95 rounded-2xs" />
        <div className="w-1.5 h-1 sm:w-2 sm:h-1.5 bg-white opacity-95 rounded-2xs" />
        <div className="w-1.5 h-1 sm:w-2 sm:h-1.5 bg-cyan-400 opacity-80 rounded-2xs" />
        <div
          className={`w-1.5 h-1 sm:w-2 sm:h-1.5 rounded-2xs ${
            pingMs < 30 ? 'bg-cyan-400 opacity-90' : 'bg-cyan-900 opacity-40'
          }`}
        />
      </div>
    </div>
  );
};

/**
 * SYS / 01 Power Strip Component
 */
export const PowerTelemetryLeft: React.FC<{
  hudState: HudStateType;
  fluxPercent: number;
}> = ({ hudState, fluxPercent }) => {
  const isError = hudState === 'ERROR';
  const color = isError ? 'text-[#ff2a5f]' : 'text-cyan-400';
  const barColor = isError ? 'bg-[#ff2a5f]' : 'bg-cyan-400';

  return (
    <div className="flex flex-col items-start select-none font-mono">
      <span className="text-[8px] sm:text-[9px] tracking-widest text-cyan-400/60 uppercase">
        SYS / 01 · PWR
      </span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] sm:text-xs font-bold text-white tabular-nums">
          {fluxPercent.toFixed(1)}%
        </span>
        {/* 6-segment bar */}
        <div className="flex items-center gap-0.5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1 sm:w-2 sm:h-1.5 rounded-2xs transition-colors duration-300 ${
                i < Math.round((fluxPercent / 100) * 6)
                  ? `${barColor} opacity-95`
                  : 'bg-cyan-950/60 opacity-30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Full Panoramic Left Frame (Desktop & Tablet Landscape)
 */
export const LeftFrame: React.FC<LeftFrameProps> = ({
  hudState,
  reducedMotion,
  fluxPercent,
  pingMs,
}) => {
  const isError = hudState === 'ERROR';
  const strokeColor = isError ? '#ff2a5f' : '#00f0ff';

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] select-none pointer-events-none flex items-center justify-start">
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 320 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="leftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="leftBracketGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="60%" stopColor={isError ? '#ff2a5f' : '#00f0ff'} stopOpacity="0.85" />
            <stop offset="100%" stopColor={isError ? '#ff2a5f' : '#0066ff'} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* 1. Iconic Outer Angular Faceted White/Cyan Chevron Bracket */}
        <g filter="url(#leftGlow)">
          <path
            d="M 64 68 L 52 108 L 42 165 L 30 205 L 26 235 L 36 242 L 46 238 L 44 212 L 54 170 L 62 120 L 70 76 Z"
            fill="url(#leftBracketGrad)"
            opacity="0.95"
          />
          <path
            d="M 26 245 L 30 275 L 42 315 L 52 372 L 64 412 L 70 404 L 62 360 L 54 310 L 44 268 L 46 242 L 36 238 Z"
            fill="url(#leftBracketGrad)"
            opacity="0.95"
          />
          <polygon points="22,240 38,225 48,235 48,245 38,255" fill="#ffffff" opacity="0.9" />
          <path
            d="M 66 60 Q 15 240 66 420"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="18 4 6 4"
            opacity="0.8"
          />
        </g>

        {/* 2. Horizontal Connector Circuit Lines */}
        <g opacity="0.65" stroke={strokeColor} strokeWidth="1.2">
          <path d="M 85 100 L 155 100 L 180 135 L 285 135" fill="none" />
          <circle cx="285" cy="135" r="2" fill={strokeColor} />
          <path d="M 80 195 L 145 195 L 175 175 L 295 175" fill="none" />
          <path d="M 80 285 L 145 285 L 175 305 L 295 305" fill="none" />
          <path d="M 85 380 L 155 380 L 180 345 L 285 345" fill="none" />
          <circle cx="285" cy="345" r="2" fill={strokeColor} />
          <path d="M 80 430 L 140 430 L 140 440 L 310 440" fill="none" strokeDasharray="6 3" />
        </g>

        {/* 3. Signal Badge & Indicators: SIGNAL-14 [MD-34] */}
        <g transform="translate(142, 222)">
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
            SIGNAL-14
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
            [MD-34]
          </text>
          <g transform="translate(4, 23)">
            <rect x="0" y="0" width="4" height="3" fill="#ffffff" opacity="0.9" />
            <rect x="6" y="0" width="4" height="3" fill="#ffffff" opacity="0.9" />
            <rect x="12" y="0" width="4" height="3" fill="#00f0ff" opacity="0.75" />
            <rect x="18" y="0" width="4" height="3" fill="#00f0ff" opacity={pingMs < 30 ? 0.8 : 0.3} />
          </g>
        </g>

        {/* 4. Telemetry & Segmented Power Strip (SYS / 01) */}
        <g transform="translate(90, 245)">
          <text x="0" y="0" fill="#00f0ff" fontSize="6.5" fontFamily="monospace" opacity="0.65" letterSpacing="1">
            SYS / 01 · PWR
          </text>
          <text x="0" y="10" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">
            {fluxPercent.toFixed(1)}%
          </text>
          <g transform="translate(0, 16)">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={i}
                x={i * 7}
                y="0"
                width="5"
                height="3"
                fill={i < Math.round((fluxPercent / 100) * 6) ? strokeColor : 'rgba(0,240,255,0.15)'}
                rx="0.5"
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};
