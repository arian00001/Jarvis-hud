// Futuristic JARVIS HUD (Iron Man Mark-85 HUD Interface)
// Features: Dual Mobile/Desktop layouts, 3 Distinct Holographic HUD Architectures, Real Voice Assistant, Bridge API

import React, { useState, useEffect, useCallback } from 'react';
import { useHudState, HudStateType } from './hooks/useHudState';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useWeather } from './hooks/useWeather';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { HudStyleId, HUD_STYLES } from './types/hudStyles';
import { HudBackground } from './components/HudBackground';
import { HudHeader } from './components/HudHeader';
import { LeftFrame } from './components/LeftFrame';
import { RightFrame } from './components/RightFrame';
import { ReactorStage } from './components/ReactorStage';
import { MobileHudLayout } from './components/MobileHudLayout';
import { VoiceVisualizerPanel } from './components/VoiceVisualizerPanel';
import { HudFooter, ActiveScreen } from './components/HudFooter';

// System Feature Modals
import { ChatModal } from './components/modals/ChatModal';
import { ScanModal } from './components/modals/ScanModal';
import { ScreenShareModal } from './components/modals/ScreenShareModal';
import { MemoriesModal } from './components/modals/MemoriesModal';
import { LanguageModal } from './components/modals/LanguageModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { DiagnosticsModal } from './components/DiagnosticsModal';

// Audio & Bridge Utilities
import { hudAudio } from './utils/soundEffects';
import { jarvisBridge } from './bridge/jarvisBridge';

export function App() {
  const {
    hudState,
    setHudState,
    cycleState,
    soundEnabled,
    toggleSound,
    voiceSynthesizer,
    setVoiceSynthesizer,
    diagnosticsOpen,
    setDiagnosticsOpen,
    telemetry,
    audioWaveform,
  } = useHudState();

  const { reducedMotion, toggleReducedMotion } = useReducedMotion();
  const { weather, refreshWeather } = useWeather();

  // Navigation State
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('HOME');
  const [theme, setTheme] = useState<'cyan' | 'lime' | 'crimson'>('cyan');

  // 3 Distinct Holographic HUD Architectures (Switchable via Settings or tap)
  const [hudStyle, setHudStyle] = useState<HudStyleId>(() => {
    try {
      const saved = localStorage.getItem('jarvis_hud_style') as HudStyleId | null;
      if (saved && (saved === 'MARK_85' || saved === 'VERONICA' || saved === 'CHRONOS')) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'MARK_85';
  });

  const handleSetHudStyle = useCallback((style: HudStyleId) => {
    setHudStyle(style);
    try {
      localStorage.setItem('jarvis_hud_style', style);
    } catch {
      // ignore
    }
  }, []);

  // Real Speech Recognition Voice Assistant with Jarvis Bridge
  const handleSpeechFinal = useCallback(
    async (text: string) => {
      setHudState('THINKING');
      const lower = text.toLowerCase();

      // UI Screen action triggers
      if (lower.includes('scan')) {
        setActiveScreen('SCAN');
      } else if (lower.includes('chat') || lower.includes('talk')) {
        setActiveScreen('CHAT');
      } else if (lower.includes('memory') || lower.includes('memories')) {
        setActiveScreen('MEMORIES');
      } else if (lower.includes('share') || lower.includes('screen')) {
        setActiveScreen('SCREEN_SHARE');
      } else if (lower.includes('status') || lower.includes('report') || lower.includes('diagnostic')) {
        setDiagnosticsOpen(true);
      } else if (lower.includes('error') || lower.includes('alert')) {
        setHudState('ERROR');
      }

      // Query real Gemini AI or smart bridge
      const reply = await jarvisBridge.queryAI(text);
      setHudState('SPEAKING');
      if (voiceSynthesizer) {
        hudAudio.speak(reply);
      }
    },
    [setHudState, voiceSynthesizer, setDiagnosticsOpen]
  );

  const {
    isListening,
    transcript,
    toggleListening,
  } = useSpeechRecognition(handleSpeechFinal);

  // Sync speech recognition status with HUD State
  useEffect(() => {
    if (isListening && hudState !== 'THINKING' && hudState !== 'SPEAKING') {
      if (hudState !== 'LISTENING') setHudState('LISTENING');
    } else if (!isListening && hudState === 'LISTENING') {
      setHudState('IDLE');
    }
  }, [isListening, hudState, setHudState]);

  // Initial greeting once on mount
  useEffect(() => {
    hudAudio.playStateSound('IDLE');
  }, []);

  // Handle Chat Modal text commands
  const handleChatCommand = useCallback(
    async (cmd: string): Promise<string> => {
      setHudState('THINKING');
      const res = await jarvisBridge.queryAI(cmd);
      setHudState('SPEAKING');
      setTimeout(() => {
        setHudState('IDLE');
      }, 2500);
      return res;
    },
    [setHudState]
  );

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case 'm':
          toggleListening();
          break;
        case 's':
          toggleSound();
          break;
        case 'r':
          toggleReducedMotion();
          break;
        case 'd':
          setDiagnosticsOpen((prev) => !prev);
          break;
        case 'escape':
          setActiveScreen('HOME');
          setDiagnosticsOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeScreen, diagnosticsOpen, toggleListening, toggleReducedMotion, toggleSound, setDiagnosticsOpen]);

  const activeHudConfig = HUD_STYLES[hudStyle] || HUD_STYLES.MARK_85;

  return (
    <div
      data-hud-style={hudStyle}
      data-theme={hudStyle === 'VERONICA' ? 'amber' : hudStyle === 'CHRONOS' ? 'emerald' : theme}
      className={`jarvis-hud relative w-screen h-screen overflow-hidden flex flex-col justify-between text-white select-none transition-colors duration-500 ${
        reducedMotion ? 'reduce-motion' : ''
      }`}
      style={{ backgroundColor: activeHudConfig.bgTint }}
    >
      {/* LAYER 1: Ambient Background Environment & Visor Cockpit Grid */}
      <HudBackground hudState={hudState} reducedMotion={reducedMotion} />

      {/* LAYER 2: Top Panoramic System Header (Visible on Desktop / Landscape) */}
      <div className="hidden md:block landscape:block shrink-0 z-20">
        <HudHeader
          hudState={hudState}
          telemetry={telemetry}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          voiceSynthesizer={voiceSynthesizer}
          onToggleVoice={() => setVoiceSynthesizer((prev) => !prev)}
          onOpenDiagnostics={() => setDiagnosticsOpen(true)}
          onOpenSettings={() => setActiveScreen('SETTINGS')}
          weather={weather}
          onRefreshWeather={refreshWeather}
        />
      </div>

      {/* Real Live Speech Recognition Overlay Banner (Shown when listening) */}
      {(isListening || transcript) && (
        <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-40 max-w-[92vw] sm:max-w-md w-full px-3 py-1.5 rounded-lg bg-[#020b18]/90 border border-cyan-400/50 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="text-cyan-300 font-bold shrink-0">MIC:</span>
          <span className="text-white truncate">
            {transcript || 'Listening to your voice...'}
          </span>
        </div>
      )}

      {/* MAIN VIEWPORT: DEDICATED PORTRAIT MOBILE COMPOSITION */}
      <main className="relative z-10 flex-1 w-full flex flex-col justify-between items-center overflow-hidden min-h-0 md:hidden landscape:hidden">
        <MobileHudLayout
          hudState={hudState}
          telemetry={telemetry}
          reducedMotion={reducedMotion}
          audioWaveform={audioWaveform}
          onReactorClick={toggleListening}
          isListening={isListening}
          hudStyle={hudStyle}
        />
      </main>

      {/* MAIN VIEWPORT: PANORAMIC LANDSCAPE & DESKTOP COMPOSITION */}
      <main className="relative z-10 flex-1 w-full hidden md:flex landscape:flex items-center justify-between px-2 sm:px-4 md:px-8 py-1 overflow-hidden min-h-0">
        {/* Left Technical Frame */}
        <div className="flex-1 flex justify-start items-center max-w-[220px] lg:max-w-[320px] transition-all duration-300">
          <LeftFrame
            hudState={hudState}
            reducedMotion={reducedMotion}
            fluxPercent={telemetry.fluxPercent}
            pingMs={telemetry.signalPingMs}
          />
        </div>

        {/* Central Holographic Reactor Stage & Voice Visualizer Panel */}
        <div className="shrink-0 flex flex-col items-center justify-center max-w-[460px]">
          <ReactorStage
            hudState={hudState}
            onReactorClick={toggleListening}
            reducedMotion={reducedMotion}
            audioWaveform={audioWaveform}
            showExternalLabels={true}
            isListening={isListening}
            hudStyle={hudStyle}
          />
          <div className="w-full mt-1">
            <VoiceVisualizerPanel
              hudState={hudState}
              isListening={isListening}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>

        {/* Right Technical Frame */}
        <div className="flex-1 flex justify-end items-center max-w-[220px] lg:max-w-[320px] transition-all duration-300">
          <RightFrame
            hudState={hudState}
            reducedMotion={reducedMotion}
            harmonicFreqHz={telemetry.harmonicFreqHz}
            quantumSync={telemetry.quantumSync}
          />
        </div>
      </main>

      {/* LAYER 5: Bottom Navigation Dock (Home, Chat, Mic, Scan, System Modules) */}
      <HudFooter
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        isListening={isListening}
        onToggleMic={toggleListening}
        hudState={hudState}
        onSetHudState={setHudState}
        weatherTemp={weather.temperature}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        voiceSynthesizer={voiceSynthesizer}
        onToggleVoice={() => setVoiceSynthesizer((prev) => !prev)}
        onOpenDiagnostics={() => setDiagnosticsOpen(true)}
      />

      {/* MODAL SCREENS: CHAT, SCAN, SCREEN SHARE, MEMORIES, LANGUAGE, SETTINGS, TELEMETRY */}
      <ChatModal
        isOpen={activeScreen === 'CHAT'}
        onClose={() => setActiveScreen('HOME')}
        onCommandTrigger={handleChatCommand}
        voiceSynthesizer={voiceSynthesizer}
      />

      <ScanModal
        isOpen={activeScreen === 'SCAN'}
        onClose={() => setActiveScreen('HOME')}
        voiceSynthesizer={voiceSynthesizer}
      />

      <ScreenShareModal
        isOpen={activeScreen === 'SCREEN_SHARE'}
        onClose={() => setActiveScreen('HOME')}
        voiceSynthesizer={voiceSynthesizer}
      />

      <MemoriesModal
        isOpen={activeScreen === 'MEMORIES'}
        onClose={() => setActiveScreen('HOME')}
      />

      <LanguageModal
        isOpen={activeScreen === 'LANGUAGE'}
        onClose={() => setActiveScreen('HOME')}
      />

      <SettingsModal
        isOpen={activeScreen === 'SETTINGS'}
        onClose={() => setActiveScreen('HOME')}
        hudStyle={hudStyle}
        onSetHudStyle={handleSetHudStyle}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        voiceSynthesizer={voiceSynthesizer}
        onToggleVoice={() => setVoiceSynthesizer((prev) => !prev)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={toggleReducedMotion}
      />

      <DiagnosticsModal
        isOpen={diagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
        hudState={hudState}
        telemetry={telemetry}
        audioWaveform={audioWaveform}
        onTriggerVoiceQuery={(text, state) => {
          setHudState(state);
          if (voiceSynthesizer) hudAudio.speak(text);
        }}
      />
    </div>
  );
}
export default App;
