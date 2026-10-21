import React, { useState } from 'react';
import { HudStateType } from '../hooks/useHudState';
import { HudStyleId, HUD_STYLES } from '../types/hudStyles';
import { ReactorOuterGlow } from './reactor/ReactorOuterGlow';
import { ReactorShieldArcs } from './reactor/ReactorShieldArcs';
import { ReactorOuterRing } from './reactor/ReactorOuterRing';
import { ReactorSegmentRing } from './reactor/ReactorSegmentRing';
import { ReactorMechanicalRing } from './reactor/ReactorMechanicalRing';
import { ReactorTickRing } from './reactor/ReactorTickRing';
import { ReactorGlassWings } from './reactor/ReactorGlassWings';
import { ReactorInnerRing } from './reactor/ReactorInnerRing';
import { ReactorScanEffect } from './reactor/ReactorScanEffect';
import { ReactorEnergyCore } from './reactor/ReactorEnergyCore';
import { ReactorVeronicaCore } from './reactor/ReactorVeronicaCore';
import { ReactorChronosCore } from './reactor/ReactorChronosCore';

interface ReactorStageProps {
  hudState: HudStateType;
  onReactorClick: () => void;
  reducedMotion: boolean;
  audioWaveform: number[];
  showExternalLabels?: boolean;
  isListening?: boolean;
  hudStyle?: HudStyleId;
}

export const ReactorStage: React.FC<ReactorStageProps> = ({
  hudState,
  onReactorClick,
  reducedMotion,
  audioWaveform,
  showExternalLabels = true,
  isListening = false,
  hudStyle = 'MARK_85',
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const activeConfig = HUD_STYLES[hudStyle] || HUD_STYLES.MARK_85;

  const handleInteraction = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
    if ('clientX' in e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev.slice(-3), { id, x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 700);
    }
    // Touching the orb toggles the microphone / voice assistant directly
    onReactorClick();
  };

  const isError = hudState === 'ERROR';

  // Ring and border accent color for touch feedback
  const rippleBorderClass =
    hudStyle === 'VERONICA'
      ? 'border-amber-400'
      : hudStyle === 'CHRONOS'
      ? 'border-emerald-400'
      : 'border-cyan-400';

  const glowShadowClass =
    hudStyle === 'VERONICA'
      ? isListening
        ? 'ring-2 ring-amber-400/80 shadow-[0_0_35px_rgba(251,191,36,0.7)]'
        : 'hover:shadow-[0_0_30px_rgba(251,191,36,0.45)]'
      : hudStyle === 'CHRONOS'
      ? isListening
        ? 'ring-2 ring-emerald-400/80 shadow-[0_0_35px_rgba(0,255,136,0.7)]'
        : 'hover:shadow-[0_0_30px_rgba(0,255,136,0.45)]'
      : isListening
      ? 'ring-2 ring-cyan-400/80 shadow-[0_0_35px_rgba(0,240,255,0.7)]'
      : 'hover:shadow-[0_0_30px_rgba(0,240,255,0.45)]';

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[500px] mx-auto select-none px-1 sm:px-2 z-10">
      {/* ABOVE REACTOR LABELS */}
      {showExternalLabels && (
        <div className="flex flex-col items-center mb-1 sm:mb-2 text-center pointer-events-none">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-[1px]"
              style={{
                background: `linear-gradient(to right, transparent, ${activeConfig.primaryColor})`,
              }}
            />
            <span
              className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase font-sans"
              style={{ color: activeConfig.accentColor }}
            >
              {activeConfig.subLabel}
            </span>
            <div
              className="w-6 h-[1px]"
              style={{
                background: `linear-gradient(to left, transparent, ${activeConfig.primaryColor})`,
              }}
            />
          </div>
          <span
            className="text-[9px] tracking-[0.2em] uppercase font-mono opacity-60"
            style={{ color: activeConfig.primaryColor }}
          >
            {activeConfig.topLabel}
          </span>
        </div>
      )}

      {/* CENTRAL REACTOR SVG CONTAINER & INTERACTION TARGET */}
      <div className="relative w-full aspect-square max-w-[440px] flex items-center justify-center">
        {/* Soft Ambient Radial Bloom */}
        <ReactorOuterGlow hudState={hudState} reducedMotion={reducedMotion} />

        {/* Primary Multi-Layered Vector HUD SVG */}
        <svg
          className="relative w-full h-full overflow-visible z-10 pointer-events-none"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ======================================================== */}
          {/* HUD STYLE 1: MARK-85 ARC QUANTUM (Stark Nanotech Arc Core) */}
          {/* ======================================================== */}
          {hudStyle === 'MARK_85' && (
            <>
              {/* Layer 1: Outer Stepped Shield Arcs & Inner Curved Tabs */}
              <ReactorShieldArcs hudState={hudState} />
              {/* Layer 2: Ring A - Outer Energy Ring with Vernier Degree Calibrations */}
              <ReactorOuterRing hudState={hudState} reducedMotion={reducedMotion} />
              {/* Layer 3: Ring B - Segmented Mechanical Ring */}
              <ReactorSegmentRing hudState={hudState} reducedMotion={reducedMotion} />
              {/* Layer 4: Mechanical Cog Gear Ring */}
              <ReactorMechanicalRing hudState={hudState} reducedMotion={reducedMotion} />
              {/* Layer 5: Ring C - 120-Division Precision Radial Tick Ring */}
              <ReactorTickRing hudState={hudState} reducedMotion={reducedMotion} />
              {/* Layer 6: Signature Curved Translucent Glass Wings */}
              <ReactorGlassWings hudState={hudState} />
              {/* Layer 7: Ring D - Inner Technical Ring with 8-Direction Chevrons */}
              <ReactorInnerRing hudState={hudState} reducedMotion={reducedMotion} />
              {/* Layer 8: Rotating Radar Scan Beam Effect */}
              <ReactorScanEffect hudState={hudState} reducedMotion={reducedMotion} />
              {/* Layer 9: Ring E - Central Energy Core (Quantum Singularity & Plasma Orb) */}
              <ReactorEnergyCore
                hudState={hudState}
                reducedMotion={reducedMotion}
                audioWaveform={audioWaveform}
                isListening={isListening}
              />
            </>
          )}

          {/* ======================================================== */}
          {/* HUD STYLE 2: VERONICA PROTOCOL (Heavy Orbital Armor Core) */}
          {/* ======================================================== */}
          {hudStyle === 'VERONICA' && (
            <>
              {/* Background Radar Scan Beam */}
              <ReactorScanEffect hudState={hudState} reducedMotion={reducedMotion} />
              {/* Veronica Orbital Armor Core Geometry */}
              <ReactorVeronicaCore
                hudState={hudState}
                reducedMotion={reducedMotion}
                audioWaveform={audioWaveform}
                isListening={isListening}
              />
            </>
          )}

          {/* ======================================================== */}
          {/* HUD STYLE 3: CHRONOS QUANTUM NEXUS (Tri-Radial Tesseract) */}
          {/* ======================================================== */}
          {hudStyle === 'CHRONOS' && (
            <>
              {/* Background Radar Scan Beam */}
              <ReactorScanEffect hudState={hudState} reducedMotion={reducedMotion} />
              {/* Chronos Tri-Radial Tesseract Core Geometry */}
              <ReactorChronosCore
                hudState={hudState}
                reducedMotion={reducedMotion}
                audioWaveform={audioWaveform}
                isListening={isListening}
              />
            </>
          )}
        </svg>

        {/* Center Interactive Button: Touching Orb Toggles Microphone Voice Assistant Seamlessly! */}
        <button
          onClick={handleInteraction}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleInteraction(e);
            }
          }}
          className={`absolute z-20 w-36 h-36 rounded-full cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-[#020713] transition-all duration-300 active:scale-95 ${glowShadowClass}`}
          aria-label={isListening ? 'Deactivate Voice Assistant' : 'Activate Voice Assistant'}
          title={`${activeConfig.name} · ${isListening ? 'Active' : 'Standby'}`}
        >
          <span className="sr-only">Toggle Voice Assistant</span>

          {/* Pristine Spherical Specular Glass Sheen Overlay */}
          <div className="absolute inset-2 rounded-full pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-white/10 opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* Clean High-Tech Holographic Shockwave Ripples upon touch */}
          {ripples.map((rip) => (
            <span
              key={rip.id}
              className={`absolute inset-0 rounded-full border pointer-events-none animate-ping opacity-75 ${rippleBorderClass}`}
            />
          ))}
        </button>
      </div>

      {/* BELOW REACTOR TELEMETRY READOUTS */}
      {showExternalLabels && (
        <div className="flex flex-col items-center mt-1 sm:mt-2 text-center pointer-events-none">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-sans transition-colors duration-300 ${
                isError
                  ? 'text-[#ff2a5f] drop-shadow-[0_0_8px_rgba(255,42,95,0.8)]'
                  : 'drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
              }`}
              style={{ color: isError ? '#ff2a5f' : activeConfig.primaryColor }}
            >
              {isError
                ? 'CRITICAL ALERT // DELTA-74'
                : isListening
                ? 'NEURAL LINK ACTIVE · LISTENING'
                : `SYSTEM STATE · ${hudState}`}
            </span>
          </div>
          <span
            className="text-[9px] tracking-[0.25em] uppercase font-mono opacity-60"
            style={{ color: activeConfig.primaryColor }}
          >
            {activeConfig.telemetryLabel}
          </span>
        </div>
      )}
    </div>
  );
};
