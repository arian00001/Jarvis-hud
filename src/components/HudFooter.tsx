import React, { useState } from 'react';
import {
  Home,
  MessageSquare,
  Mic,
  MicOff,
  Scan,
  Settings,
  Database,
  Monitor,
  Languages,
  CloudSun,
  Layers,
  ChevronUp,
} from 'lucide-react';
import { HudStateType } from '../hooks/useHudState';
import { hudAudio } from '../utils/soundEffects';

export type ActiveScreen =
  | 'HOME'
  | 'CHAT'
  | 'SCAN'
  | 'SETTINGS'
  | 'MEMORIES'
  | 'LANGUAGE'
  | 'SCREEN_SHARE';

interface HudFooterProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  isListening: boolean;
  onToggleMic: () => void;
  hudState: HudStateType;
  onSetHudState: (state: HudStateType) => void;
  weatherTemp?: number;
  onToggleWeatherPanel?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  voiceSynthesizer?: boolean;
  onToggleVoice?: () => void;
  onOpenDiagnostics?: () => void;
}

export const HudFooter: React.FC<HudFooterProps> = ({
  activeScreen,
  onSelectScreen,
  isListening,
  onToggleMic,
  hudState,
  onSetHudState,
  weatherTemp,
  onToggleWeatherPanel,
  soundEnabled = true,
  onToggleSound,
  voiceSynthesizer = false,
  onToggleVoice,
  onOpenDiagnostics,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (screen: ActiveScreen) => {
    hudAudio.playClick();
    onSelectScreen(screen);
    setMenuOpen(false);
  };

  return (
    <footer className="relative z-30 w-full flex flex-col items-center justify-center px-2 sm:px-6 py-1 select-none font-mono">
      {/* Top Hairline Separator with Glow */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent mb-1" />

      {/* QUICK EXPANDABLE SYSTEM MENU POPUP */}
      {menuOpen && (
        <div className="absolute bottom-full mb-2 w-[95%] max-w-sm bg-[#020713]/95 border border-cyan-400/40 rounded-xl p-3 shadow-[0_0_30px_rgba(0,240,255,0.3)] backdrop-blur-md z-40 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20 text-[10px] text-cyan-300">
            <span className="font-bold tracking-widest uppercase">J.A.R.V.I.S. SYSTEM MODULES</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-cyan-400/60 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => handleNav('SETTINGS')}
              className={`p-2 rounded border text-left flex flex-col items-start gap-1 transition-colors cursor-pointer ${
                activeScreen === 'SETTINGS'
                  ? 'border-cyan-400 bg-cyan-950/70 text-cyan-100'
                  : 'border-cyan-500/20 bg-[#051329] text-cyan-400/70 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold">SETTINGS</span>
              <span className="text-[8px] opacity-60">System Config</span>
            </button>

            <button
              onClick={() => handleNav('MEMORIES')}
              className={`p-2 rounded border text-left flex flex-col items-start gap-1 transition-colors cursor-pointer ${
                activeScreen === 'MEMORIES'
                  ? 'border-cyan-400 bg-cyan-950/70 text-cyan-100'
                  : 'border-cyan-500/20 bg-[#051329] text-cyan-400/70 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold">MEMORIES</span>
              <span className="text-[8px] opacity-60">Neural Recall</span>
            </button>

            <button
              onClick={() => handleNav('SCREEN_SHARE')}
              className={`p-2 rounded border text-left flex flex-col items-start gap-1 transition-colors cursor-pointer ${
                activeScreen === 'SCREEN_SHARE'
                  ? 'border-cyan-400 bg-cyan-950/70 text-cyan-100'
                  : 'border-cyan-500/20 bg-[#051329] text-cyan-400/70 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold">SCREEN SHARE</span>
              <span className="text-[8px] opacity-60">Stream Optical</span>
            </button>

            <button
              onClick={() => handleNav('LANGUAGE')}
              className={`p-2 rounded border text-left flex flex-col items-start gap-1 transition-colors cursor-pointer ${
                activeScreen === 'LANGUAGE'
                  ? 'border-cyan-400 bg-cyan-950/70 text-cyan-100'
                  : 'border-cyan-500/20 bg-[#051329] text-cyan-400/70 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              <Languages className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold">LANGUAGE</span>
              <span className="text-[8px] opacity-60">Voice Profile</span>
            </button>

            <button
              onClick={() => {
                hudAudio.playClick();
                if (onToggleWeatherPanel) onToggleWeatherPanel();
              }}
              className="p-2 rounded border border-cyan-500/20 bg-[#051329] text-cyan-400/70 hover:border-cyan-400/40 hover:text-white text-left flex flex-col items-start gap-1 transition-colors cursor-pointer"
            >
              <CloudSun className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold">WEATHER</span>
              <span className="text-[8px] opacity-60">
                {weatherTemp !== undefined ? `${weatherTemp}°C Live` : 'Atmosphere'}
              </span>
            </button>

            <button
              onClick={() => {
                hudAudio.playClick();
                if (onOpenDiagnostics) onOpenDiagnostics();
                setMenuOpen(false);
              }}
              className="p-2 rounded border border-cyan-500/20 bg-[#051329] text-cyan-400/70 hover:border-cyan-400/40 hover:text-white text-left flex flex-col items-start gap-1 transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold">DIAGNOSTICS</span>
              <span className="text-[8px] opacity-60">Core Status</span>
            </button>
          </div>

          {/* Audio & Synthesizer Quick Controls */}
          <div className="pt-2 pb-2 border-t border-cyan-500/15 flex items-center justify-between text-[9px] text-cyan-300">
            <span className="text-[8px] text-cyan-400/50 uppercase tracking-widest">AUDIO MATRIX:</span>
            <div className="flex items-center gap-2">
              {onToggleSound && (
                <button
                  onClick={() => {
                    hudAudio.playClick();
                    onToggleSound();
                  }}
                  className={`px-2 py-0.5 rounded border text-[8.5px] font-bold cursor-pointer transition-colors ${
                    soundEnabled
                      ? 'border-cyan-400/60 bg-cyan-950/60 text-cyan-200'
                      : 'border-red-500/40 bg-red-950/40 text-red-300'
                  }`}
                >
                  FX: {soundEnabled ? 'ON' : 'OFF'}
                </button>
              )}
              {onToggleVoice && (
                <button
                  onClick={() => {
                    hudAudio.playClick();
                    onToggleVoice();
                  }}
                  className={`px-2 py-0.5 rounded border text-[8.5px] font-bold cursor-pointer transition-colors ${
                    voiceSynthesizer
                      ? 'border-cyan-400/60 bg-cyan-950/60 text-cyan-200'
                      : 'border-cyan-500/20 bg-[#051329] text-cyan-400/50'
                  }`}
                >
                  TTS: {voiceSynthesizer ? 'ON' : 'OFF'}
                </button>
              )}
            </div>
          </div>

          {/* Quick State Overrides inside System Menu */}
          <div className="pt-2 border-t border-cyan-500/15">
            <span className="text-[8px] text-cyan-400/50 uppercase tracking-widest block mb-1">
              REACTOR STATE OVERRIDE:
            </span>
            <div className="grid grid-cols-5 gap-1">
              {(['IDLE', 'LISTENING', 'THINKING', 'SPEAKING', 'ERROR'] as HudStateType[]).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    hudAudio.playClick();
                    onSetHudState(st);
                  }}
                  className={`py-1 text-[9px] rounded font-bold transition-colors cursor-pointer ${
                    hudState === st
                      ? st === 'ERROR'
                        ? 'bg-[#ff2a5f] text-white'
                        : 'bg-cyan-500 text-slate-950'
                      : 'bg-cyan-950/40 text-cyan-400/60 border border-cyan-500/15 hover:text-white'
                  }`}
                >
                  {st === 'ERROR' ? 'ALERT' : st.slice(0, 5)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRIMARY COMPACT MOBILE HUD DOCK MATCHING REFERENCE MOCKUP */}
      <nav
        aria-label="JARVIS Primary Navigation"
        className="w-full max-w-[420px] flex items-center justify-between px-3 py-1.5 rounded-2xl bg-[#030d22]/90 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.15)]"
      >
        {/* 1. HOME BUTTON */}
        <button
          onClick={() => handleNav('HOME')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
            activeScreen === 'HOME'
              ? 'text-cyan-100 bg-[#0a2347] border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-cyan-400/60 hover:text-cyan-200 hover:bg-cyan-950/30'
          }`}
          title="Return to Futuristic Holographic HUD Home"
          aria-label="Home"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.16em] mt-0.5 uppercase">HOME</span>
        </button>

        {/* 2. CHAT BUTTON */}
        <button
          onClick={() => handleNav('CHAT')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
            activeScreen === 'CHAT'
              ? 'text-cyan-100 bg-[#0a2347] border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-cyan-400/60 hover:text-cyan-200 hover:bg-cyan-950/30'
          }`}
          title="Open JARVIS AI Neural Chat"
          aria-label="Chat"
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.16em] mt-0.5 uppercase">CHAT</span>
        </button>

        {/* 3. CENTER ILLUMINATED ARC REACTOR MICROPHONE BUTTON */}
        <div className="relative -top-2 flex flex-col items-center">
          <button
            onClick={() => {
              hudAudio.playClick();
              onToggleMic();
            }}
            className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
              isListening
                ? 'bg-[#00f0ff] text-slate-950 shadow-[0_0_25px_#00f0ff,0_0_45px_#0066ff] scale-105'
                : 'bg-[#041630] border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-900/60 shadow-[0_0_20px_rgba(0,240,255,0.45)]'
            }`}
            title={isListening ? 'Stop listening' : 'Engage voice assistant microphone'}
            aria-label="Voice Assistant Microphone"
          >
            {/* Halo ring matching mockup */}
            <span
              className={`absolute -inset-1 rounded-full border border-cyan-400/40 pointer-events-none ${
                isListening ? 'animate-ping' : ''
              }`}
            />
            {isListening ? (
              <Mic className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            ) : (
              <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
          <span
            className={`text-[8px] sm:text-[8.5px] tracking-[0.2em] font-bold mt-1 uppercase ${
              isListening ? 'text-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff]' : 'text-cyan-300/80'
            }`}
          >
            {isListening ? 'LISTENING' : 'VOICE'}
          </span>
        </div>

        {/* 4. SCAN BUTTON */}
        <button
          onClick={() => handleNav('SCAN')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
            activeScreen === 'SCAN'
              ? 'text-cyan-100 bg-[#0a2347] border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-cyan-400/60 hover:text-cyan-200 hover:bg-cyan-950/30'
          }`}
          title="Open Holographic Environmental Optical Scanner"
          aria-label="Scanner"
        >
          <Scan className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.16em] mt-0.5 uppercase">SCAN</span>
        </button>

        {/* 5. SYSTEM SETTINGS / MODULES BUTTON */}
        <button
          onClick={() => {
            hudAudio.playClick();
            setMenuOpen((prev) => !prev);
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
            menuOpen || activeScreen === 'SETTINGS'
              ? 'text-cyan-100 bg-[#0a2347] border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-cyan-400/60 hover:text-cyan-200 hover:bg-cyan-950/30'
          }`}
          title="Open System Modules (Weather, Memories, Screen Share, Settings)"
          aria-label="System Menu"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.16em] mt-0.5 uppercase">SYSTEM</span>
        </button>
      </nav>
    </footer>
  );
};
