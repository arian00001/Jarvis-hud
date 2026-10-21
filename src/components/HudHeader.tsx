import React, { useState, useEffect } from 'react';
import { HudStateType, HudTelemetry } from '../hooks/useHudState';
import { Activity, Volume2, VolumeX, Settings, Sparkles } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { WeatherData } from '../hooks/useWeather';

interface HudHeaderProps {
  hudState: HudStateType;
  telemetry: HudTelemetry;
  soundEnabled: boolean;
  onToggleSound: () => void;
  voiceSynthesizer: boolean;
  onToggleVoice: () => void;
  onOpenDiagnostics: () => void;
  onOpenSettings: () => void;
  weather: WeatherData;
  onRefreshWeather: () => void;
}

export const HudHeader: React.FC<HudHeaderProps> = ({
  hudState,
  telemetry,
  soundEnabled,
  onToggleSound,
  voiceSynthesizer,
  onToggleVoice,
  onOpenDiagnostics,
  onOpenSettings,
  weather,
  onRefreshWeather,
}) => {
  const [timeStr, setTimeStr] = useState<string>('00:00:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isError = hudState === 'ERROR';

  return (
    <header className="relative z-30 w-full flex items-center justify-between px-2.5 sm:px-6 py-1.5 sm:py-2 text-xs tracking-wider select-none font-mono">
      {/* Hairline Bottom Separator with corner accents */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent" />
      <div className="absolute bottom-0 left-6 sm:left-12 w-6 sm:w-8 h-[2px] bg-[#00f0ff]/70" />
      <div className="absolute bottom-0 right-6 sm:right-12 w-6 sm:w-8 h-[2px] bg-[#00f0ff]/70" />

      {/* LEFT ZONE: Wordmark & System Badge */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-base font-extrabold tracking-widest text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.7)] font-sans">
              J.A.R.V.I.S.
            </span>
            <span className="text-[9px] text-cyan-300/70 border border-cyan-500/30 px-1 py-0.2 rounded-2xs tracking-widest">
              MK-85
            </span>
          </div>
          <span className="hidden sm:inline text-[8px] sm:text-[9px] tracking-widest text-cyan-400/50 uppercase">
            Holographic HUD System
          </span>
        </div>
      </div>

      {/* CENTER ZONE: Collapsible Real-Time Weather Widget & Status */}
      <div className="flex items-center gap-2">
        {/* Real Weather Telemetry Widget */}
        <WeatherWidget weather={weather} onRefresh={onRefreshWeather} />

        {/* State Mode Badge */}
        <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-[#051329]/60 border border-cyan-500/20 backdrop-blur-xs">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isError
                ? 'bg-[#ff2a5f] animate-ping'
                : hudState === 'THINKING'
                ? 'bg-amber-400 animate-pulse'
                : hudState === 'LISTENING'
                ? 'bg-[#00f0ff] animate-ping'
                : hudState === 'SPEAKING'
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-cyan-400'
            }`}
          />
          <span
            className={`text-[9px] font-bold tracking-widest uppercase ${
              isError
                ? 'text-[#ff2a5f]'
                : hudState === 'THINKING'
                ? 'text-amber-400'
                : hudState === 'LISTENING'
                ? 'text-cyan-300'
                : hudState === 'SPEAKING'
                ? 'text-emerald-400'
                : 'text-[#00f0ff]'
            }`}
          >
            {hudState}
          </span>
        </div>
      </div>

      {/* RIGHT ZONE: Voice Synthesis, Audio, Settings & Clock */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Quick Voice Synthesizer Toggle */}
        <button
          onClick={onToggleVoice}
          className={`p-1 sm:px-2 sm:py-0.5 text-[10px] rounded border transition-colors cursor-pointer flex items-center gap-1 ${
            voiceSynthesizer
              ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200'
              : 'border-cyan-500/20 bg-[#051329]/50 text-cyan-400/50 hover:text-cyan-200'
          }`}
          title="Toggle Voice Synthesizer speech"
          aria-label="Toggle Voice Synthesizer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[9px] uppercase">
            {voiceSynthesizer ? 'VOICE ON' : 'VOICE OFF'}
          </span>
        </button>

        {/* Quick Audio Mute/Unmute */}
        <button
          onClick={onToggleSound}
          className="p-1 sm:p-1.5 text-[11px] rounded border border-cyan-500/25 bg-[#051329]/50 hover:bg-cyan-950/40 text-cyan-300 transition-colors cursor-pointer flex items-center justify-center"
          title={soundEnabled ? 'Disable Synthesizer Audio' : 'Enable Synthesizer Audio'}
          aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {/* Telemetry Diagnostics trigger */}
        <button
          onClick={onOpenDiagnostics}
          className="p-1 sm:p-1.5 text-[11px] rounded border border-cyan-500/25 bg-[#051329]/50 hover:bg-cyan-950/40 text-cyan-300 transition-colors cursor-pointer flex items-center justify-center"
          title="Open Subsystem Telemetry"
          aria-label="Open Telemetry"
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
        </button>

        {/* Settings modal trigger */}
        <button
          onClick={onOpenSettings}
          className="p-1 sm:p-1.5 text-[11px] rounded border border-cyan-500/25 bg-[#051329]/50 hover:bg-cyan-950/40 text-cyan-300 transition-colors cursor-pointer flex items-center justify-center"
          title="Open System Settings"
          aria-label="Open Settings"
        >
          <Settings className="w-3.5 h-3.5 text-cyan-400" />
        </button>

        {/* Live Clock */}
        <div className="flex items-center pl-1">
          <span className="text-[10px] sm:text-xs text-cyan-200/90 tabular-nums font-bold">
            {timeStr}
          </span>
        </div>
      </div>
    </header>
  );
};
