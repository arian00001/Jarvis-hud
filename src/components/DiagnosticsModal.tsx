import React from 'react';
import { HudStateType, HudTelemetry } from '../hooks/useHudState';
import { X, Activity, Cpu, Radio, ShieldAlert, Zap } from 'lucide-react';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hudState: HudStateType;
  telemetry: HudTelemetry;
  audioWaveform: number[];
  onTriggerVoiceQuery: (command: string, targetState: HudStateType) => void;
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({
  isOpen,
  onClose,
  hudState,
  telemetry,
  audioWaveform,
  onTriggerVoiceQuery,
}) => {
  if (!isOpen) return null;

  const isError = hudState === 'ERROR';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none font-mono">
      <div className="relative w-full max-w-2xl bg-[#030919] border border-cyan-400/40 rounded-lg shadow-[0_0_35px_rgba(0,240,255,0.3)] overflow-hidden">
        {/* Holographic Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/25 bg-[#051329]/90">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold tracking-widest text-cyan-200 uppercase font-sans">
              SUB-SYSTEM TELEMETRY MATRIX · SYS-01 / SYS-02
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-950/60 transition-colors cursor-pointer"
            aria-label="Close Diagnostics"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Top Status Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 rounded bg-[#061833]/60 border border-cyan-500/20">
              <span className="text-[10px] text-cyan-400/60 block">CORE TEMP</span>
              <span className="text-sm font-bold text-white tabular-nums">
                {telemetry.coreTempK} K
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#061833]/60 border border-cyan-500/20">
              <span className="text-[10px] text-cyan-400/60 block">FLUX OUTPUT</span>
              <span className="text-sm font-bold text-cyan-300 tabular-nums">
                {telemetry.fluxPercent}%
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#061833]/60 border border-cyan-500/20">
              <span className="text-[10px] text-cyan-400/60 block">HARMONIC FREQ</span>
              <span className="text-sm font-bold text-white tabular-nums">
                {telemetry.harmonicFreqHz} Hz
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#061833]/60 border border-cyan-500/20">
              <span className="text-[10px] text-cyan-400/60 block">QUANTUM SYNC</span>
              <span className="text-sm font-bold text-emerald-400 tabular-nums">
                {(telemetry.quantumSync * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Audio Waveform Spectrum Analyzer */}
          <div className="p-3 rounded bg-[#061833]/40 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" /> AUDIO HARMONIC SPECTRUM
              </span>
              <span className="text-[9px] text-cyan-400/50">
                {hudState === 'SPEAKING' ? 'VOICE RECEPTOR ACTIVE' : 'CARRIER WAVE MONITOR'}
              </span>
            </div>
            <div className="flex items-end justify-between h-14 gap-1 px-2 pt-2 bg-[#020713] rounded border border-cyan-500/15">
              {audioWaveform.map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-t-xs transition-all duration-150"
                  style={{
                    height: `${Math.max(8, val)}%`,
                    backgroundColor:
                      isError
                        ? '#ff2a5f'
                        : hudState === 'SPEAKING'
                        ? '#34d399'
                        : '#00f0ff',
                    opacity: 0.85,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Quick Voice Simulation Directives */}
          <div className="p-3 rounded bg-[#061833]/40 border border-cyan-500/20">
            <span className="text-[10px] text-cyan-400 uppercase tracking-wider block mb-2 font-semibold">
              SIMULATED JARVIS VOICE PROTOCOLS (CLICK TO TEST)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              <button
                onClick={() => onTriggerVoiceQuery('Awaiting your directive, Sir.', 'LISTENING')}
                className="p-2 rounded bg-[#051329] border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-950/40 text-left cursor-pointer transition-colors"
              >
                <div className="text-[11px] font-bold text-cyan-300">"Voice Receptor Active"</div>
                <div className="text-[9px] text-cyan-400/60">Switches to LISTENING state with chime</div>
              </button>

              <button
                onClick={() => onTriggerVoiceQuery('Processing contextual neural heuristics.', 'THINKING')}
                className="p-2 rounded bg-[#051329] border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-950/40 text-left cursor-pointer transition-colors"
              >
                <div className="text-[11px] font-bold text-amber-300">"Heuristic Computation"</div>
                <div className="text-[9px] text-cyan-400/60">Accelerates ring rotation in THINKING state</div>
              </button>

              <button
                onClick={() => onTriggerVoiceQuery('All holographic systems nominal and synchronized.', 'SPEAKING')}
                className="p-2 rounded bg-[#051329] border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-950/40 text-left cursor-pointer transition-colors"
              >
                <div className="text-[11px] font-bold text-emerald-300">"Holographic Status Report"</div>
                <div className="text-[9px] text-cyan-400/60">Pulses core with vocal harmonic modulation</div>
              </button>

              <button
                onClick={() => onTriggerVoiceQuery('Warning: Thermal breach in sector gamma!', 'ERROR')}
                className="p-2 rounded bg-[#051329] border border-rose-500/30 hover:border-rose-400 hover:bg-rose-950/40 text-left cursor-pointer transition-colors"
              >
                <div className="text-[11px] font-bold text-rose-300">"Trigger Alert / Delta-74"</div>
                <div className="text-[9px] text-rose-400/60">Displays Warning triangle & alarm tone</div>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-cyan-500/25 bg-[#051329]/70 flex items-center justify-between text-[10px] text-cyan-400/60">
          <span>JARVIS MK-85 · INTERFACE BUILD 2026</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/40 border border-cyan-400/30 cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
