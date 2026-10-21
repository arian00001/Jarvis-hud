import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Monitor, Play, Square, ShieldCheck, AlertCircle } from 'lucide-react';
import { hudAudio } from '../../utils/soundEffects';

interface ScreenShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceSynthesizer: boolean;
}

export const ScreenShareModal: React.FC<ScreenShareModalProps> = ({
  isOpen,
  onClose,
  voiceSynthesizer,
}) => {
  const [sharing, setSharing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [streamStats, setStreamStats] = useState<{ res: string; fps: number; time: number }>({
    res: '1920x1080',
    fps: 60,
    time: 0,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopShare = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSharing(false);
    setStreamStats((prev) => ({ ...prev, time: 0 }));
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopShare();
    }
    return () => {
      stopShare();
    };
  }, [isOpen, stopShare]);

  const startShare = async () => {
    setErrorMsg(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Screen sharing API not supported on this browser/platform');
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      setSharing(true);
      hudAudio.playStateSound('LISTENING');

      if (voiceSynthesizer) {
        hudAudio.speak('Display link established. Tactical screen share active.');
      }

      // Handle user stopping share via native browser bar
      stream.getVideoTracks()[0].onended = () => {
        stopShare();
      };

      // Timer
      let sec = 0;
      timerRef.current = window.setInterval(() => {
        sec++;
        setStreamStats((prev) => ({
          ...prev,
          time: sec,
        }));
      }, 1000);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setErrorMsg('Screen share permission was denied by the operator or system.');
      } else {
        setErrorMsg(err.message || 'Unable to establish screen capture stream.');
      }
    }
  };

  const formatSec = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none font-mono">
      <div className="relative w-full max-w-xl h-[80vh] max-h-[640px] bg-[#020713] border border-cyan-400/40 rounded-lg shadow-[0_0_35px_rgba(0,240,255,0.3)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/25 bg-[#051329]/90 shrink-0">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold tracking-widest text-cyan-200 uppercase font-sans">
              TACTICAL SCREEN SHARE TRANSMITTER
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-950/60 transition-colors cursor-pointer"
            aria-label="Close Screen Share"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-contain ${sharing ? 'block' : 'hidden'}`}
          />

          {!sharing && (
            <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm">
              <div className="w-20 h-20 rounded-full border border-cyan-500/30 flex items-center justify-center mb-3 bg-[#051329]/60">
                <Monitor className="w-8 h-8 text-cyan-400" />
              </div>
              <span className="text-sm font-bold text-white mb-1">
                SCREEN STREAM BROADCAST
              </span>
              <p className="text-[11px] text-cyan-300/70 mb-4 leading-relaxed">
                Mirror your Android display, app workspace, or active tab into the J.A.R.V.I.S. neural telemetry pipeline.
              </p>

              {errorMsg && (
                <div className="mb-4 p-2 rounded bg-rose-950/50 border border-rose-500/40 text-[10px] text-rose-300 flex items-center gap-1.5 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                onClick={startShare}
                className="flex items-center gap-2 px-4 py-2 rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>REQUEST DISPLAY PERMISSION</span>
              </button>
            </div>
          )}

          {/* Holographic Watermark / Stream Telemetry Frame */}
          {sharing && (
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none text-[9px] text-cyan-300 bg-[#051329]/80 px-2 py-1 rounded border border-cyan-500/25">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">LIVE WEBRTC BUFFER</span>
              </div>
              <div className="flex items-center gap-3 tabular-nums">
                <span>TIME: {formatSec(streamStats.time)}</span>
                <span>FPS: 60</span>
                <span>ENC: H.264</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-3 border-t border-cyan-500/25 bg-[#051329]/95 shrink-0 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-cyan-400/70 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SECURE PEER STREAM ENCRYPTION</span>
          </div>

          {sharing && (
            <button
              onClick={stopShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-500 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-[0_0_10px_rgba(244,63,94,0.4)]"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>TERMINATE STREAM</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
