import { useState, useEffect, useRef, useCallback } from 'react';
import { HudStateType } from './useHudState';
import { hudAudio } from '../utils/soundEffects';

export interface AudioAnalyzerResult {
  hasRealMicStream: boolean;
  micAmplitude: number; // 0 to 1
  bars: number[]; // 25 symmetrical waveform bar values (0 to 100)
  isSpeaking: boolean;
  audioMode: 'REAL_MIC' | 'TTS_SPEAKING' | 'THINKING' | 'IDLE';
}

const BAR_COUNT = 25;

export function useAudioAnalyzer(
  hudState: HudStateType,
  isListening: boolean,
  reducedMotion: boolean
): AudioAnalyzerResult {
  const [hasRealMicStream, setHasRealMicStream] = useState<boolean>(false);
  const [micAmplitude, setMicAmplitude] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: BAR_COUNT }, () => 8)
  );

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const wordPulseRef = useRef<number>(0);

  // 1. Subscribe to real TTS speech playback events
  useEffect(() => {
    const unsubscribe = hudAudio.onSpeechStateChange((speaking, charIndex) => {
      setIsSpeaking(speaking);
      if (speaking) {
        wordPulseRef.current = 1.0;
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // 2. Connect to real microphone audio stream when isListening is true
  useEffect(() => {
    if (!isListening) {
      // Clean up mic stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      setHasRealMicStream(false);
      setMicAmplitude(0);
      return;
    }

    let active = true;

    async function initMic() {
      if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          await ctx.resume().catch(() => {});
        }
        audioContextRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.65;
        source.connect(analyser);
        analyserRef.current = analyser;

        setHasRealMicStream(true);
      } catch {
        // User denied mic or not available - will fallback gracefully
        if (active) {
          setHasRealMicStream(false);
        }
      }
    }

    initMic();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      setHasRealMicStream(false);
    };
  }, [isListening]);

  // 3. Animation loop for rendering bars and processing amplitude
  useEffect(() => {
    let tick = 0;
    const dataArray = new Uint8Array(32);

    const updateLoop = () => {
      tick++;

      // Decay word pulse for speech
      if (wordPulseRef.current > 0.05) {
        wordPulseRef.current *= 0.88;
      } else {
        wordPulseRef.current = 0;
      }

      const centerIdx = Math.floor(BAR_COUNT / 2);

      // Case A: Real Microphone Stream is active
      if (isListening && hasRealMicStream && analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);

        // Compute RMS
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalizedAmp = Math.min(1, avg / 120);
        setMicAmplitude(normalizedAmp);

        // Generate symmetrical bars
        const newBars = new Array(BAR_COUNT).fill(6);
        for (let i = 0; i <= centerIdx; i++) {
          const freqIndex = Math.min(dataArray.length - 1, Math.floor((i / centerIdx) * 16));
          const rawVal = dataArray[freqIndex] || 0;
          // Distance from center factor for cinematic taper
          const taper = 1 - Math.pow((centerIdx - i) / centerIdx, 1.8) * 0.75;
          const height = Math.max(6, Math.min(100, (rawVal / 255) * 100 * taper + 4));

          newBars[centerIdx + i] = height;
          newBars[centerIdx - i] = height;
        }
        setBars(newBars);
      }
      // Case B: Speaking (either TTS is playing or hudState is SPEAKING)
      else if (hudState === 'SPEAKING' || isSpeaking) {
        const pulse = wordPulseRef.current;
        const newBars = new Array(BAR_COUNT).fill(8);

        for (let i = 0; i <= centerIdx; i++) {
          const dist = (centerIdx - i) / centerIdx;
          const envelope = Math.cos(dist * (Math.PI / 2));
          // Vocal formants simulation with sine harmonics
          const wave1 = Math.sin(tick * 0.35 + i * 0.4);
          const wave2 = Math.cos(tick * 0.22 - i * 0.6);
          const vocalEnergy = (wave1 * 0.5 + wave2 * 0.5 + 1) / 2;
          const height = Math.max(
            8,
            Math.min(98, (vocalEnergy * 55 + pulse * 45) * envelope + 10)
          );

          newBars[centerIdx + i] = Math.round(height);
          newBars[centerIdx - i] = Math.round(height);
        }
        setBars(newBars);
        setMicAmplitude(Math.min(1, 0.4 + pulse * 0.6));
      }
      // Case C: Thinking state (flowing computational wave)
      else if (hudState === 'THINKING') {
        const newBars = new Array(BAR_COUNT).fill(6);
        for (let i = 0; i <= centerIdx; i++) {
          const dist = (centerIdx - i) / centerIdx;
          const wave = Math.sin(tick * 0.28 + i * 0.6) * 0.5 + 0.5;
          const height = Math.max(6, Math.round(wave * 42 * (1 - dist * 0.5) + 8));

          newBars[centerIdx + i] = height;
          newBars[centerIdx - i] = height;
        }
        setBars(newBars);
        setMicAmplitude(0.25);
      }
      // Case D: Listening but without mic stream (armed standby)
      else if (isListening) {
        const newBars = new Array(BAR_COUNT).fill(6);
        for (let i = 0; i <= centerIdx; i++) {
          const dist = (centerIdx - i) / centerIdx;
          const pulse = Math.sin(tick * 0.15) * 0.5 + 0.5;
          const height = Math.max(6, Math.round((pulse * 25 + 10) * (1 - dist * 0.6)));

          newBars[centerIdx + i] = height;
          newBars[centerIdx - i] = height;
        }
        setBars(newBars);
        setMicAmplitude(0.15);
      }
      // Case E: Idle resting state (subtle minimal breathing)
      else {
        const newBars = new Array(BAR_COUNT).fill(6);
        const breath = Math.sin(tick * 0.08) * 4 + 8;
        for (let i = 0; i <= centerIdx; i++) {
          const dist = (centerIdx - i) / centerIdx;
          const height = Math.max(5, Math.round(breath * (1 - dist * 0.65)));
          newBars[centerIdx + i] = height;
          newBars[centerIdx - i] = height;
        }
        setBars(newBars);
        setMicAmplitude(0.05);
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [hudState, isListening, hasRealMicStream, isSpeaking]);

  const audioMode: AudioAnalyzerResult['audioMode'] =
    isListening && hasRealMicStream
      ? 'REAL_MIC'
      : hudState === 'SPEAKING' || isSpeaking
      ? 'TTS_SPEAKING'
      : hudState === 'THINKING'
      ? 'THINKING'
      : 'IDLE';

  return {
    hasRealMicStream,
    micAmplitude,
    bars,
    isSpeaking,
    audioMode,
  };
}
