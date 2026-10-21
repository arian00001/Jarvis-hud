import React, { useState, useEffect, useMemo } from 'react';
import { HudStateType } from '../hooks/useHudState';
import { useAudioAnalyzer } from '../hooks/useAudioAnalyzer';
import { Mic, Cpu, Radio, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface VoiceVisualizerPanelProps {
  hudState: HudStateType;
  isListening: boolean;
  reducedMotion: boolean;
}

// Generate realistic technical binary strings
function randomBinary(length = 8): string {
  let res = '';
  for (let i = 0; i < length; i++) {
    res += Math.random() > 0.5 ? '1' : '0';
  }
  return res;
}

// Short technical ASCII symbols for futuristic HUD flair
const ASCII_TOKENS = ['0x8F', '::99', '<OK>', '[#]', '0x4A', '::85', '>>14', '0xFA'];

export const VoiceVisualizerPanel: React.FC<VoiceVisualizerPanelProps> = ({
  hudState,
  isListening,
  reducedMotion,
}) => {
  const { hasRealMicStream, micAmplitude, bars, isSpeaking, audioMode } =
    useAudioAnalyzer(hudState, isListening, reducedMotion);

  // Dynamic binary strings state
  const [binLeft1, setBinLeft1] = useState<string>('01001000');
  const [binLeft2, setBinLeft2] = useState<string>('01001001');
  const [binRight1, setBinRight1] = useState<string>('01001110');
  const [binRight2, setBinRight2] = useState<string>('01010100');
  const [asciiTokenLeft, setAsciiTokenLeft] = useState<string>('0x4A');
  const [asciiTokenRight, setAsciiTokenRight] = useState<string>('::85');

  // Interval speed depends on state:
  // - IDLE: slow (800ms)
  // - LISTENING: moderate (200ms)
  // - THINKING: flowing (120ms)
  // - SPEAKING: rapid kinetic (70ms)
  useEffect(() => {
    let intervalMs = 800;
    if (hudState === 'SPEAKING' || isSpeaking) {
      intervalMs = 70;
    } else if (hudState === 'THINKING') {
      intervalMs = 120;
    } else if (isListening) {
      intervalMs = 200;
    }

    const timer = setInterval(() => {
      setBinLeft1(randomBinary(8));
      setBinLeft2(randomBinary(8));
      setBinRight1(randomBinary(8));
      setBinRight2(randomBinary(8));

      if (Math.random() > 0.6) {
        setAsciiTokenLeft(ASCII_TOKENS[Math.floor(Math.random() * ASCII_TOKENS.length)]);
        setAsciiTokenRight(ASCII_TOKENS[Math.floor(Math.random() * ASCII_TOKENS.length)]);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [hudState, isListening, isSpeaking]);

  const isError = hudState === 'ERROR';

  // Status badge copy & icon
  const statusInfo = useMemo(() => {
    if (isError) {
      return {
        text: 'SYSTEM ALERT // ANOMALY',
        icon: <AlertTriangle className="w-3 h-3 text-[#ff2a5f] animate-pulse" />,
        color: 'text-[#ff2a5f]',
        border: 'border-[#ff2a5f]/40',
        bg: 'bg-[#ff2a5f]/10',
      };
    }
    if (hudState === 'SPEAKING' || isSpeaking) {
      return {
        text: 'JARVIS SPEAKING',
        icon: <Mic className="w-3 h-3 text-cyan-300 animate-pulse" />,
        color: 'text-cyan-300',
        border: 'border-cyan-400/50',
        bg: 'bg-cyan-500/10',
      };
    }
    if (isListening) {
      return {
        text: hasRealMicStream ? 'JARVIS LISTENING · MIC ACTIVE' : 'JARVIS LISTENING · AWAITING VOICE',
        icon: <Mic className="w-3 h-3 text-cyan-400 animate-bounce" />,
        color: 'text-cyan-400',
        border: 'border-cyan-400/40',
        bg: 'bg-cyan-500/10',
      };
    }
    if (hudState === 'THINKING') {
      return {
        text: 'NEURAL PROCESSING // THINKING',
        icon: <Cpu className="w-3 h-3 text-cyan-300 animate-spin" />,
        color: 'text-cyan-300',
        border: 'border-cyan-400/40',
        bg: 'bg-cyan-500/10',
      };
    }
    return {
      text: 'STANDBY // AUDIO MATRIX IDLE',
      icon: <Radio className="w-3 h-3 text-cyan-400/60" />,
      color: 'text-cyan-400/70',
      border: 'border-cyan-500/30',
      bg: 'bg-[#020b18]/60',
    };
  }, [hudState, isListening, isSpeaking, isError, hasRealMicStream]);

  // Visualizer height and glow variables
  const isHighEnergy = hudState === 'SPEAKING' || isSpeaking || (isListening && micAmplitude > 0.2);

  return (
    <div className="w-full max-w-[420px] mx-auto flex flex-col items-center select-none font-mono my-1 px-2 z-20">
      {/* 1. Header Label with Brackets: { [Icon] JARVIS SPEAKING } */}
      <div className="flex items-center gap-1.5 mb-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300">
        <span className="text-cyan-400/60">{'{'}</span>
        <div className="flex items-center gap-1.5">
          {statusInfo.icon}
          <span
            className={`${statusInfo.color} font-sans drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]`}
          >
            {statusInfo.text}
          </span>
        </div>
        <span className="text-cyan-400/60">{'}'}</span>
      </div>

      {/* 2. Main Visualizer Container with Angular Chamfered Frame (matching reference mockup) */}
      <div className="relative w-full h-[54px] sm:h-[62px] flex items-center justify-between px-3 sm:px-4 py-1.5 bg-[#030d22]/85 rounded-lg border border-cyan-500/35 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.12)]">
        {/* Angular HUD Corner Highlights */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

        {/* Outer Hairline Cut Corner Accents */}
        <div className="absolute -top-[1px] left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />
        <div className="absolute -bottom-[1px] left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

        {/* LEFT ZONE: Changing Binary Digits & Short ASCII */}
        <div className="flex flex-col items-start justify-center shrink-0 w-16 sm:w-20 text-[9px] sm:text-[10px] leading-tight text-cyan-300/80 font-mono tracking-wider">
          <div className="flex items-center gap-1">
            <span
              className={`transition-colors duration-150 tabular-nums ${
                isHighEnergy ? 'text-cyan-100 font-bold' : 'text-cyan-400/90'
              }`}
            >
              {binLeft1}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`transition-colors duration-150 tabular-nums ${
                isHighEnergy ? 'text-cyan-200' : 'text-cyan-400/70'
              }`}
            >
              {binLeft2}
            </span>
          </div>
          <span className="text-[7px] text-cyan-500/50 tracking-widest uppercase">
            {asciiTokenLeft}
          </span>
        </div>

        {/* CENTER ZONE: Symmetrical Responsive Cyan Waveform Equalizer */}
        <div className="flex-1 flex items-center justify-center px-1 sm:px-2 h-full">
          {/* Subtle Outer Dot Endcaps */}
          <div className="flex items-center gap-1 text-cyan-400/40 mr-1 sm:mr-1.5 text-[8px] select-none">
            <span>·</span>
            <span>·</span>
          </div>

          {/* Symmetrical Waveform Bars (25 bars) */}
          <div className="flex items-center justify-center gap-[2px] sm:gap-[3px] h-[32px] sm:h-[40px] px-1">
            {bars.map((heightPercent, idx) => {
              const isCenter = idx >= 10 && idx <= 14;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-center h-full w-[2px] sm:w-[2.5px]"
                >
                  <div
                    style={{
                      height: `${Math.max(4, heightPercent)}%`,
                      transition: reducedMotion ? 'none' : 'height 0.08s ease-out',
                    }}
                    className={`w-full rounded-full transition-all duration-75 ${
                      isError
                        ? 'bg-[#ff2a5f] shadow-[0_0_6px_#ff2a5f]'
                        : isHighEnergy
                        ? isCenter
                          ? 'bg-white shadow-[0_0_10px_#00f0ff,0_0_18px_#ffffff]'
                          : 'bg-cyan-300 shadow-[0_0_8px_#00f0ff]'
                        : 'bg-cyan-400/70'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Subtle Outer Dot Endcaps */}
          <div className="flex items-center gap-1 text-cyan-400/40 ml-1 sm:ml-1.5 text-[8px] select-none">
            <span>·</span>
            <span>·</span>
          </div>
        </div>

        {/* RIGHT ZONE: Changing Binary Digits & Short ASCII */}
        <div className="flex flex-col items-end justify-center shrink-0 w-16 sm:w-20 text-[9px] sm:text-[10px] leading-tight text-cyan-300/80 font-mono tracking-wider">
          <div className="flex items-center gap-1">
            <span
              className={`transition-colors duration-150 tabular-nums ${
                isHighEnergy ? 'text-cyan-100 font-bold' : 'text-cyan-400/90'
              }`}
            >
              {binRight1}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`transition-colors duration-150 tabular-nums ${
                isHighEnergy ? 'text-cyan-200' : 'text-cyan-400/70'
              }`}
            >
              {binRight2}
            </span>
          </div>
          <span className="text-[7px] text-cyan-500/50 tracking-widest uppercase">
            {asciiTokenRight}
          </span>
        </div>
      </div>

      {/* 3. Small Hardware Status Indicator (truth in engineering: real mic vs synthesis) */}
      <div className="w-full flex items-center justify-between px-2 mt-0.5 text-[7px] sm:text-[7.5px] text-cyan-400/50 tracking-widest uppercase">
        <div className="flex items-center gap-1">
          <span
            className={`w-1 h-1 rounded-full ${
              audioMode === 'REAL_MIC'
                ? 'bg-emerald-400 shadow-[0_0_6px_#10b981] animate-ping'
                : audioMode === 'TTS_SPEAKING'
                ? 'bg-cyan-300 shadow-[0_0_6px_#00f0ff]'
                : 'bg-cyan-500/40'
            }`}
          />
          <span>
            {audioMode === 'REAL_MIC'
              ? 'LIVE MIC STREAM // ANALYZER ACTIVE'
              : audioMode === 'TTS_SPEAKING'
              ? 'SYNTHESIS // VOCAL AMPLITUDE'
              : 'AUDIO MATRIX // READY'}
          </span>
        </div>
        <span>RATE · 48.0 kHz</span>
      </div>
    </div>
  );
};
