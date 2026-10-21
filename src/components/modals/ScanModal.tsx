import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Scan, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { hudAudio } from '../../utils/soundEffects';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceSynthesizer: boolean;
}

export const ScanModal: React.FC<ScanModalProps> = ({
  isOpen,
  onClose,
  voiceSynthesizer,
}) => {
  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(true);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setStreamActive(false);
      setAnalysisResult(null);
      return;
    }

    // Start camera stream
    let mounted = true;
    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera hardware interface unavailable');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setStreamActive(true);
        setPermissionError(null);
        hudAudio.playStateSound('THINKING');
      } catch (err: any) {
        setPermissionError(
          err.name === 'NotAllowedError'
            ? 'Optical sensor permission denied by Android/browser.'
            : 'Camera device offline or already in use. Synthetic optical matrix active.'
        );
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerAnalyze = () => {
    hudAudio.playStateSound('THINKING');
    setScanning(true);
    setAnalysisResult(null);

    setTimeout(() => {
      const results = [
        'ENVIRONMENT ANALYSIS: Structural density 94.2%. Atmospheric pressure 1013 hPa. Zero hazardous radiation detected.',
        'OPTICAL SPECTRUM SCAN: Human biometric signature verified. Ambient luminance 420 Lux. Sector nominal.',
        'TACTICAL MATRIX SCAN: Geometrical spatial mapping complete. 3 surface boundaries triangulated.',
      ];
      const selected = results[Math.floor(Math.random() * results.length)];
      setAnalysisResult(selected);
      setScanning(false);
      hudAudio.playStateSound('SPEAKING');

      if (voiceSynthesizer) {
        hudAudio.speak('Optical telemetry analysis complete. ' + selected);
      }
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none font-mono">
      <div className="relative w-full max-w-lg h-[80vh] max-h-[640px] bg-[#020713] border border-cyan-400/40 rounded-lg shadow-[0_0_35px_rgba(0,240,255,0.3)] flex flex-col overflow-hidden">
        {/* Holographic Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/25 bg-[#051329]/90 shrink-0">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold tracking-widest text-cyan-200 uppercase font-sans">
              OPTICAL ENVIRONMENT SCANNER · SYS-09
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-950/60 transition-colors cursor-pointer"
            aria-label="Close Scanner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Viewport with Holographic Targeting Reticles */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${streamActive ? 'opacity-90' : 'hidden'}`}
          />

          {/* Synthetic Optical Fallback Visualizer if no camera stream */}
          {!streamActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#020817]">
              <div className="relative w-44 h-44 rounded-full border border-cyan-500/30 flex items-center justify-center mb-4">
                <div className="absolute inset-2 rounded-full border border-cyan-400/20 border-dashed animate-spin" />
                <div className="absolute inset-8 rounded-full border-2 border-cyan-400/40" />
                <Camera className="w-10 h-10 text-cyan-400/70" />
              </div>
              <span className="text-xs text-cyan-200 font-bold mb-1">
                SYNTHETIC OPTICAL MATRIX
              </span>
              <span className="text-[10px] text-cyan-400/60 max-w-xs">
                {permissionError || 'Hardware optical receptor standing by.'}
              </span>
            </div>
          )}

          {/* HUD Target Reticle Brackets (Always Active) */}
          <div className="absolute inset-6 sm:inset-10 pointer-events-none border border-cyan-400/25">
            {/* Top-left corner */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
            {/* Top-right corner */}
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
            {/* Bottom-left corner */}
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
            {/* Bottom-right corner */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

            {/* Central Target Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-20 h-20 rounded-full border border-cyan-400/40 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 animate-ping" />
                <div className="w-1 h-1 rounded-full bg-white" />
                <div className="absolute -top-3 w-[1px] h-3 bg-cyan-400" />
                <div className="absolute -bottom-3 w-[1px] h-3 bg-cyan-400" />
                <div className="absolute -left-3 h-[1px] w-3 bg-cyan-400" />
                <div className="absolute -right-3 h-[1px] w-3 bg-cyan-400" />
              </div>
            </div>

            {/* Scanning Laser Beam */}
            {scanning && (
              <div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00f0ff]"
                style={{ animation: 'scanline-pass 3s linear infinite' }}
              />
            )}

            {/* Live Telemetry Coordinates */}
            <div className="absolute top-2 left-2 text-[9px] text-cyan-300/80">
              POS: [X: 42.8 | Y: 71.4]
            </div>
            <div className="absolute top-2 right-2 text-[9px] text-cyan-300/80">
              FPS: 60 · HD STREAM
            </div>
            <div className="absolute bottom-2 left-2 text-[9px] text-cyan-300/80">
              ZOOM: 1.0X · FLUX 98%
            </div>
          </div>
        </div>

        {/* Scan Analysis Output Strip */}
        <div className="p-3 border-t border-cyan-500/25 bg-[#051329]/95 shrink-0 flex flex-col gap-2">
          {analysisResult ? (
            <div className="p-2 rounded bg-cyan-950/60 border border-cyan-400/40 text-xs text-cyan-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{analysisResult}</span>
            </div>
          ) : (
            <div className="text-[10px] text-cyan-400/70 text-center">
              Align targeting reticle with environment subject and engage analysis matrix.
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[9px] text-cyan-400/50 uppercase">
              STATUS: {scanning ? 'SCANNING SECTOR...' : 'STANDBY'}
            </span>

            <button
              onClick={triggerAnalyze}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.4)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ENGAGE SCAN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
