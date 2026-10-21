import React from 'react';
import { HudStateType, HudTelemetry } from '../hooks/useHudState';
import { HudStyleId, HUD_STYLES } from '../types/hudStyles';
import { LeftFacetedBracket, SignalBadgeLeft } from './LeftFrame';
import { RightFacetedBracket, SignalBadgeRight } from './RightFrame';
import { ReactorStage } from './ReactorStage';
import { VoiceVisualizerPanel } from './VoiceVisualizerPanel';
import { HudStatusBar } from './HudStatusBar';

interface MobileHudLayoutProps {
  hudState: HudStateType;
  telemetry: HudTelemetry;
  reducedMotion: boolean;
  audioWaveform: number[];
  onReactorClick: () => void;
  isListening?: boolean;
  hudStyle?: HudStyleId;
}

export const MobileHudLayout: React.FC<MobileHudLayoutProps> = ({
  hudState,
  telemetry,
  reducedMotion,
  audioWaveform,
  onReactorClick,
  isListening = false,
  hudStyle = 'MARK_85',
}) => {
  const isError = hudState === 'ERROR';
  const activeConfig = HUD_STYLES[hudStyle] || HUD_STYLES.MARK_85;
  const strokeColor = isError ? '#ff2a5f' : activeConfig.primaryColor;

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center px-1 sm:px-2 py-0.5 overflow-hidden select-none font-mono">
      {/* 1. Top HUD Status Bar (Power gauge, State badge, Radar reticle) */}
      <div className="w-full shrink-0 z-20">
        <HudStatusBar
          hudState={hudState}
          telemetry={telemetry}
          reducedMotion={reducedMotion}
          hudStyle={hudStyle}
        />
      </div>

      {/* 2. Top Framing Brackets */}
      <div className="w-full flex justify-between items-center px-1 sm:px-3 pointer-events-none shrink-0 z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-16 sm:w-5 sm:h-20">
            <LeftFacetedBracket hudState={hudState} />
          </div>
          <SignalBadgeLeft hudState={hudState} pingMs={telemetry.signalPingMs} compact />
        </div>
        <div className="flex items-center gap-1.5">
          <SignalBadgeRight hudState={hudState} quantumSync={telemetry.quantumSync} compact />
          <div className="w-4 h-16 sm:w-5 sm:h-20">
            <RightFacetedBracket hudState={hudState} />
          </div>
        </div>
      </div>

      {/* Decorative Technical Line across Mobile */}
      <div className="w-full max-w-[360px] h-[1px] relative opacity-60 pointer-events-none my-0.5">
        <svg className="w-full h-3 overflow-visible" viewBox="0 0 360 12" fill="none">
          <path
            d="M 10 6 L 120 6 L 128 10 L 232 10 L 240 6 L 350 6"
            stroke={strokeColor}
            strokeWidth="1"
            strokeDasharray="4 2 12 3"
          />
          <circle cx="122" cy="9" r="1.5" fill={strokeColor} />
          <circle cx="238" cy="9" r="1.5" fill={strokeColor} />
        </svg>
      </div>

      {/* 3. Central Holographic Reactor (Large, centered, visually dominant) */}
      <div className="flex-1 w-full max-w-[390px] flex items-center justify-center my-auto min-h-0 relative z-10 py-0.5">
        <div className="w-[min(86vw,38vh,320px)] aspect-square flex items-center justify-center">
          <ReactorStage
            hudState={hudState}
            onReactorClick={onReactorClick}
            reducedMotion={reducedMotion}
            audioWaveform={audioWaveform}
            showExternalLabels={false}
            isListening={isListening}
            hudStyle={hudStyle}
          />
        </div>
      </div>

      {/* 4. Priority Feature: Compact Binary + ASCII Voice Animation Panel */}
      <div className="w-full shrink-0 z-20">
        <VoiceVisualizerPanel
          hudState={hudState}
          isListening={isListening}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* 5. Bottom Framing Brackets */}
      <div className="w-full flex justify-between items-center px-1 sm:px-3 pointer-events-none shrink-0 z-10 mt-0.5">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-16 sm:w-5 sm:h-20 rotate-180">
            <LeftFacetedBracket hudState={hudState} />
          </div>
          <span className="text-[7.5px] tracking-widest uppercase opacity-75 font-mono" style={{ color: strokeColor }}>
            {activeConfig.codename}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7.5px] tracking-widest uppercase opacity-75 font-mono" style={{ color: strokeColor }}>
            CORE · {telemetry.coreTempK}K
          </span>
          <div className="w-4 h-16 sm:w-5 sm:h-20 rotate-180">
            <RightFacetedBracket hudState={hudState} />
          </div>
        </div>
      </div>
    </div>
  );
};
