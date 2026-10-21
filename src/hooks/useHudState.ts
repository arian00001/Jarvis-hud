import { useState, useEffect, useCallback, useRef } from 'react';
import { hudAudio } from '../utils/soundEffects';

export type HudStateType = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR';

export interface HudTelemetry {
  coreTempK: number;
  fluxPercent: number;
  harmonicFreqHz: number;
  quantumSync: number;
  signalPingMs: number;
  primaryVoltage: number;
  spectralBandwidth: string;
}

export function useHudState() {
  const [hudState, setHudStateInternal] = useState<HudStateType>('IDLE');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceSynthesizer, setVoiceSynthesizer] = useState<boolean>(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState<boolean>(false);
  const [audioWaveform, setAudioWaveform] = useState<number[]>([12, 28, 45, 68, 52, 33, 19, 8, 22, 59, 84, 95, 71, 44, 20]);
  const [lastActionTime, setLastActionTime] = useState<string>('');

  const [telemetry, setTelemetry] = useState<HudTelemetry>({
    coreTempK: 304.2,
    fluxPercent: 98.4,
    harmonicFreqHz: 432.8,
    quantumSync: 0.994,
    signalPingMs: 14,
    primaryVoltage: 48.2,
    spectralBandwidth: '12.4 GHz',
  });

  const stateTimerRef = useRef<number | null>(null);

  // Sync soundEnabled with hudAudio engine
  useEffect(() => {
    hudAudio.enabled = soundEnabled;
  }, [soundEnabled]);

  // Set HUD state with audio cue
  const setHudState = useCallback((nextState: HudStateType) => {
    setHudStateInternal((prev) => {
      if (prev === nextState) return prev;
      hudAudio.playStateSound(nextState);

      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLastActionTime(timeStr);

      if (voiceSynthesizer) {
        if (nextState === 'LISTENING') hudAudio.speak('Audio input matrix active. Standing by.');
        else if (nextState === 'THINKING') hudAudio.speak('Processing contextual neural heuristics.');
        else if (nextState === 'SPEAKING') hudAudio.speak('Holographic subroutines verified.');
        else if (nextState === 'ERROR') hudAudio.speak('Warning: Diagnostic parameter alert triggered.');
        else if (nextState === 'IDLE') hudAudio.speak('System nominal. Returning to standby.');
      }

      return nextState;
    });
  }, [voiceSynthesizer]);

  // Cycle state
  const cycleState = useCallback(() => {
    const states: HudStateType[] = ['IDLE', 'LISTENING', 'THINKING', 'SPEAKING', 'ERROR'];
    setHudStateInternal((prev) => {
      const idx = states.indexOf(prev);
      const next = states[(idx + 1) % states.length];
      hudAudio.playStateSound(next);
      return next;
    });
  }, []);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      hudAudio.enabled = next;
      if (next) hudAudio.playClick();
      return next;
    });
  }, []);

  // Update dynamic telemetry
  useEffect(() => {
    let frame = 0;
    const interval = window.setInterval(() => {
      frame++;
      setTelemetry((prev) => {
        const offset = Math.sin(frame * 0.15);
        const tempBase = hudState === 'ERROR' ? 348.5 : hudState === 'THINKING' ? 322.1 : 304.2;
        const fluxBase = hudState === 'ERROR' ? 64.2 : hudState === 'SPEAKING' ? 99.8 : 98.4;
        const pingBase = hudState === 'ERROR' ? 142 : hudState === 'THINKING' ? 24 : 14;

        return {
          coreTempK: parseFloat((tempBase + offset * 1.8).toFixed(1)),
          fluxPercent: parseFloat((fluxBase + Math.cos(frame * 0.1) * 0.9).toFixed(1)),
          harmonicFreqHz: parseFloat((432.8 + offset * 3.4).toFixed(1)),
          quantumSync: parseFloat((0.994 + offset * 0.003).toFixed(3)),
          signalPingMs: Math.max(8, Math.round(pingBase + offset * 4)),
          primaryVoltage: parseFloat((48.2 + offset * 0.4).toFixed(1)),
          spectralBandwidth: hudState === 'THINKING' ? '48.6 GHz' : '12.4 GHz',
        };
      });

      // Update simulated audio waveform
      if (hudState === 'LISTENING' || hudState === 'SPEAKING') {
        setAudioWaveform((prev) =>
          prev.map(() => {
            const min = hudState === 'SPEAKING' ? 25 : 10;
            const max = hudState === 'SPEAKING' ? 100 : 70;
            return Math.floor(min + Math.random() * (max - min));
          })
        );
      } else {
        setAudioWaveform([12, 18, 25, 30, 26, 20, 14, 10, 15, 22, 28, 24, 18, 14, 10]);
      }
    }, 400);

    return () => {
      clearInterval(interval);
      if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    };
  }, [hudState]);

  return {
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
    lastActionTime,
  };
}
