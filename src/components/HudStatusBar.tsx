import React from 'react';
import { HudStateType, HudTelemetry } from '../hooks/useHudState';
import { HudStyleId, HUD_STYLES } from '../types/hudStyles';
import { Zap, AlertTriangle } from 'lucide-react';

interface HudStatusBarProps {
  hudState: HudStateType;
  telemetry: HudTelemetry;
  reducedMotion: boolean;
  hudStyle?: HudStyleId;
  onToggleHudStyle?: () => void;
}

export const HudStatusBar: React.FC<HudStatusBarProps> = ({
  hudState,
  telemetry,
  reducedMotion,
  hudStyle = 'MARK_85',
  onToggleHudStyle,
}) => {
  const isError = hudState === 'ERROR';
  const activeConfig = HUD_STYLES[hudStyle] || HUD_STYLES.MARK_85;
  const strokeColor = isError ? '#ff2a5f' : activeConfig.primaryColor;
  const activeColor = isError ? 'text-[#ff2a5f]' : 'text-white';

  return (
    <div className="w-full max-w-[420px] mx-auto flex flex-col items-center select-none font-mono my-0.5 px-2 z-20">
      {/* 1. Main Unified Status Bar Frame */}
      <div
        className="relative w-full h-[46px] sm:h-[50px] flex items-center justify-between px-3 sm:px-4 bg-[#030d22]/85 rounded-lg border backdrop-blur-md transition-colors duration-300"
        style={{
          borderColor: activeConfig.borderColor,
          boxShadow: `0 0 15px ${activeConfig.glowColor}`,
        }}
      >
        {/* Chamfered Corner Accents */}
        <div
          className="absolute top-0 left-0 w-2 h-2 border-t border-l pointer-events-none"
          style={{ borderColor: activeConfig.primaryColor }}
        />
        <div
          className="absolute top-0 right-0 w-2 h-2 border-t border-r pointer-events-none"
          style={{ borderColor: activeConfig.primaryColor }}
        />
        <div
          className="absolute bottom-0 left-0 w-2 h-2 border-b border-l pointer-events-none"
          style={{ borderColor: activeConfig.primaryColor }}
        />
        <div
          className="absolute bottom-0 right-0 w-2 h-2 border-b border-r pointer-events-none"
          style={{ borderColor: activeConfig.primaryColor }}
        />

        {/* LEFT ZONE: POWER & 6-SEGMENT ILLUMINATED METER */}
        <div className="flex flex-col items-start justify-center">
          <span
            className="text-[8px] sm:text-[8.5px] font-bold tracking-[0.16em] uppercase opacity-80"
            style={{ color: activeConfig.primaryColor }}
          >
            POWER
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
            <span className="text-[10px] sm:text-[11px] font-bold text-white tabular-nums">
              {telemetry.fluxPercent.toFixed(1)}%
            </span>
            <div className="flex items-center gap-[2px]">
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const filled = i < Math.round((telemetry.fluxPercent / 100) * 6);
                return (
                  <div
                    key={i}
                    className="w-1.5 h-2 sm:w-2 sm:h-2.5 rounded-2xs transition-all duration-300"
                    style={{
                      backgroundColor: filled ? (isError ? '#ff2a5f' : activeConfig.primaryColor) : undefined,
                      opacity: filled ? 0.95 : 0.2,
                      boxShadow: filled ? `0 0 5px ${activeConfig.primaryColor}` : undefined,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER ZONE: CIRCULAR LIGHTNING BADGE & STATE */}
        <div className="flex items-center gap-2 px-1">
          {/* Circular Lightning Badge with rotating/pulsing ring */}
          <div
            className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-[#051838] border"
            style={{
              borderColor: activeConfig.borderColor,
              boxShadow: `0 0 12px ${activeConfig.glowColor}`,
            }}
          >
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 32 32"
            >
              <circle
                cx="16"
                cy="16"
                r="13"
                fill="none"
                stroke={isError ? '#ff2a5f' : activeConfig.primaryColor}
                strokeWidth="1.8"
                strokeDasharray="80"
                strokeDashoffset="24"
                strokeLinecap="round"
                opacity="0.9"
              />
            </svg>
            {isError ? (
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff2a5f] animate-bounce" />
            ) : (
              <Zap
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                style={{ color: activeConfig.primaryColor, fill: `${activeConfig.primaryColor}40` }}
              />
            )}
          </div>

          <div className="flex flex-col items-start">
            <span
              className="text-[7.5px] sm:text-[8px] font-bold tracking-[0.18em] uppercase opacity-70"
              style={{ color: activeConfig.primaryColor }}
            >
              STATE
            </span>
            <span
              className={`text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.14em] uppercase font-sans ${activeColor}`}
              style={{ textShadow: `0 0 8px ${activeConfig.primaryColor}` }}
            >
              {hudState}
            </span>
          </div>
        </div>

        {/* RIGHT ZONE: RADAR TELEMETRY RETICLE */}
        <div className="flex items-center gap-2">
          {/* Mini Rotating Radar Reticle */}
          <div
            className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center bg-[#020b18] border"
            style={{ borderColor: activeConfig.borderColor }}
          >
            <svg
              className={`w-full h-full ${reducedMotion ? '' : 'animate-spin'}`}
              style={{ animationDuration: '6s' }}
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="14" cy="14" r="11" stroke={strokeColor} strokeWidth="0.8" opacity="0.6" />
              <line x1="14" y1="2" x2="14" y2="26" stroke={strokeColor} strokeWidth="0.8" opacity="0.5" />
              <line x1="2" y1="14" x2="26" y2="14" stroke={strokeColor} strokeWidth="0.8" opacity="0.5" />
              <path
                d="M 14 14 L 24 9 A 11 11 0 0 1 24 14 Z"
                fill={strokeColor}
                opacity="0.35"
              />
            </svg>
          </div>

          <div className="flex flex-col items-end">
            <span
              className="text-[8px] sm:text-[8.5px] font-bold tracking-[0.16em] uppercase opacity-80"
              style={{ color: activeConfig.primaryColor }}
            >
              RADAR
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-white tabular-nums tracking-wider">
              {telemetry.harmonicFreqHz.toFixed(1)} Hz
            </span>
          </div>
        </div>
      </div>

      {/* 2. Below Status Line: ─── ● [CODENAME] // ONLINE ─── */}
      <div
        className="w-full flex items-center justify-center gap-3 mt-1 opacity-75 cursor-pointer hover:opacity-100 transition-opacity"
        onClick={onToggleHudStyle}
        title="Tap to cycle HUD Hologram Architecture"
      >
        <div
          className="flex-1 h-[1px]"
          style={{ background: `linear-gradient(to right, transparent, ${activeConfig.primaryColor}50)` }}
        />
        <div
          className="flex items-center gap-1.5 text-[8px] sm:text-[8.5px] font-bold tracking-[0.2em] uppercase font-sans"
          style={{ color: activeConfig.primaryColor }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: activeConfig.primaryColor, boxShadow: `0 0 6px ${activeConfig.primaryColor}` }}
          />
          <span>{activeConfig.codename} // ONLINE</span>
        </div>
        <div
          className="flex-1 h-[1px]"
          style={{ background: `linear-gradient(to left, transparent, ${activeConfig.primaryColor}50)` }}
        />
      </div>
    </div>
  );
};
