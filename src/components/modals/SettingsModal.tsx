import React from 'react';
import { X, Settings, Volume2, Sliders, Shield, Layers, CheckCircle2 } from 'lucide-react';
import { hudAudio } from '../../utils/soundEffects';
import { HudStyleId, HUD_STYLES } from '../../types/hudStyles';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hudStyle: HudStyleId;
  onSetHudStyle: (style: HudStyleId) => void;
  theme?: 'cyan' | 'lime' | 'crimson';
  onSetTheme?: (theme: 'cyan' | 'lime' | 'crimson') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  voiceSynthesizer: boolean;
  onToggleVoice: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  hudStyle,
  onSetHudStyle,
  soundEnabled,
  onToggleSound,
  voiceSynthesizer,
  onToggleVoice,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  if (!isOpen) return null;

  const handleSelectHudStyle = (styleId: HudStyleId) => {
    hudAudio.playClick();
    onSetHudStyle(styleId);
  };

  const activeConfig = HUD_STYLES[hudStyle] || HUD_STYLES.MARK_85;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none font-mono">
      <div
        className="relative w-full max-w-lg bg-[#020713] border rounded-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh] transition-colors duration-300"
        style={{
          borderColor: activeConfig.borderColor,
          boxShadow: `0 0 35px ${activeConfig.glowColor}`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b bg-[#051329]/95 shrink-0"
          style={{ borderColor: activeConfig.borderColor }}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" style={{ color: activeConfig.primaryColor }} />
            <span className="text-xs font-bold tracking-widest text-white uppercase font-sans">
              J.A.R.V.I.S. SYSTEM PREFERENCES
            </span>
          </div>
          <button
            onClick={() => {
              hudAudio.playClick();
              onClose();
            }}
            className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-950/60 transition-colors cursor-pointer"
            aria-label="Close Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* 1. HOLOGRAPHIC HUD ARCHITECTURE SELECTOR (3 Distinct Styles) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label
                className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 font-sans"
                style={{ color: activeConfig.primaryColor }}
              >
                <Layers className="w-3.5 h-3.5" />
                HOLOGRAPHIC HUD ARCHITECTURE · 3 STYLES
              </label>
              <span className="text-[9px] text-cyan-400/60 uppercase font-mono">
                ACTIVE: {activeConfig.codename}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {(Object.keys(HUD_STYLES) as HudStyleId[]).map((styleId) => {
                const config = HUD_STYLES[styleId];
                const isSelected = hudStyle === styleId;

                return (
                  <button
                    key={styleId}
                    onClick={() => handleSelectHudStyle(styleId)}
                    className={`relative p-3 rounded-lg border text-left transition-all duration-200 cursor-pointer overflow-hidden flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900/90 shadow-lg scale-[1.01]'
                        : 'bg-[#030d22]/60 hover:bg-[#051535]/80 border-slate-700/40 opacity-80 hover:opacity-100'
                    }`}
                    style={{
                      borderColor: isSelected ? config.primaryColor : undefined,
                      boxShadow: isSelected ? `0 0 18px ${config.glowColor}` : undefined,
                    }}
                  >
                    {/* Top Row: Name, Color Swatch & Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: config.primaryColor,
                            boxShadow: `0 0 10px ${config.primaryColor}`,
                          }}
                        />
                        <span className="text-xs font-bold text-white tracking-wider font-sans">
                          {config.name}
                        </span>
                      </div>

                      {isSelected ? (
                        <div
                          className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${config.primaryColor}20`,
                            color: config.primaryColor,
                            border: `1px solid ${config.primaryColor}60`,
                          }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          ONLINE
                        </div>
                      ) : (
                        <span className="text-[9px] text-slate-400 font-mono">
                          TAP TO SWITCH
                        </span>
                      )}
                    </div>

                    {/* Tagline & Specs */}
                    <div className="text-[10px] text-slate-300 font-mono">
                      {config.tagline}
                    </div>

                    {/* Technical Spec Pill */}
                    <div className="flex items-center gap-2 mt-0.5 text-[8.5px] font-mono">
                      <span
                        className="px-1.5 py-0.5 rounded text-slate-950 font-bold tracking-wider"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        {config.codename}
                      </span>
                      <span className="text-slate-400">
                        {config.architectureSpec}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Audio & Vocal Telemetry Options */}
          <div className="space-y-2 p-3 rounded-lg bg-[#051329]/60 border border-cyan-500/20">
            <div className="text-[11px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              AUDIO & VOCAL TELEMETRY
            </div>

            <div className="flex items-center justify-between py-1 border-b border-cyan-500/15">
              <div>
                <div className="text-xs text-white">UI Sound Synthesizer</div>
                <div className="text-[9px] text-cyan-400/60">Holographic chirps, frequency sweeps, klaxon tones</div>
              </div>
              <button
                onClick={() => {
                  hudAudio.playClick();
                  onToggleSound();
                }}
                className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                  soundEnabled
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {soundEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs text-white">Neural Voice Engine</div>
                <div className="text-[9px] text-cyan-400/60">Speak status confirmations and chat replies aloud</div>
              </div>
              <button
                onClick={() => {
                  hudAudio.playClick();
                  onToggleVoice();
                }}
                className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                  voiceSynthesizer
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {voiceSynthesizer ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
          </div>

          {/* 3. Animation & Accessibility */}
          <div className="space-y-2 p-3 rounded-lg bg-[#051329]/60 border border-cyan-500/20">
            <div className="text-[11px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              ACCESSIBILITY & PERFORMANCE
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs text-white">Reduced Motion Mode</div>
                <div className="text-[9px] text-cyan-400/60">Pauses continuous rotations for comfort or low-spec devices</div>
              </div>
              <button
                onClick={() => {
                  hudAudio.playClick();
                  onToggleReducedMotion();
                }}
                className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                  reducedMotion
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {reducedMotion ? 'REDUCED' : 'FULL'}
              </button>
            </div>
          </div>

          {/* 4. Active Architecture Specifications */}
          <div className="p-3 rounded-lg bg-[#051329]/40 border border-cyan-500/15 text-[9.5px] space-y-1.5 text-cyan-400/70 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">ACTIVE HUD MODEL:</span>
              <span className="text-white font-bold">{activeConfig.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">EMITTER ARCHITECTURE:</span>
              <span className="text-white font-mono">{activeConfig.architectureSpec}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">PLATFORM SPEC:</span>
              <span className="text-cyan-300">ANDROID / PROGRESSIVE WEB HUD</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-3 border-t bg-[#051329]/95 flex justify-between items-center text-[10px] shrink-0"
          style={{ borderColor: activeConfig.borderColor }}
        >
          <span className="text-slate-400 font-mono">STARK INDUSTRIES MK-85 SPEC</span>
          <button
            onClick={() => {
              hudAudio.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded font-bold text-slate-950 transition-all cursor-pointer shadow-md"
            style={{ backgroundColor: activeConfig.primaryColor }}
          >
            APPLY & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
