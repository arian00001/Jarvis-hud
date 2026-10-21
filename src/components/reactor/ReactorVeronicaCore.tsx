import React from 'react';
import { HudStateType } from '../../hooks/useHudState';

interface ReactorVeronicaCoreProps {
  hudState: HudStateType;
  reducedMotion: boolean;
  audioWaveform: number[];
  isListening?: boolean;
}

export const ReactorVeronicaCore: React.FC<ReactorVeronicaCoreProps> = ({
  hudState,
  reducedMotion,
  audioWaveform,
  isListening,
}) => {
  const isError = hudState === 'ERROR';
  const isSpeaking = hudState === 'SPEAKING';
  const isThinking = hudState === 'THINKING';
  const activeListening = Boolean(isListening || hudState === 'LISTENING');

  const avgWave = audioWaveform.length > 0
    ? audioWaveform.reduce((a, b) => a + b, 0) / audioWaveform.length
    : 0;
  const speakingScale = 1 + (avgWave / 100) * 0.18;

  const pulseClass = reducedMotion
    ? ''
    : isError
    ? 'animate-[error-flash_1.2s_ease-in-out_infinite]'
    : activeListening
    ? 'animate-[core-pulse-listening_1.4s_ease-in-out_infinite]'
    : isThinking
    ? 'animate-[core-pulse-thinking_1.2s_linear_infinite]'
    : isSpeaking
    ? 'animate-[core-pulse-speaking_0.8s_ease-in-out_infinite]'
    : 'animate-breathe';

  return (
    <g className="reactor-veronica-protocol select-none pointer-events-none">
      <defs>
        {/* Warm Solar Gold Volumetric Bloom */}
        <filter id="veronicaSolarBloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="blur1" />
          <feGaussianBlur stdDeviation="10" result="blur2" />
          <feGaussianBlur stdDeviation="20" result="blur3" />
          <feMerge>
            <feMergeNode in="blur3" />
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Veronica Solar Plasma Radial Gradient */}
        <radialGradient id="veronicaSolarGrad" cx="50%" cy="46%" r="54%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="15%" stopColor="#fef08a" stopOpacity="0.98" />
          <stop offset="35%" stopColor="#fbbf24" stopOpacity="0.92" />
          <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.85" />
          <stop offset="82%" stopColor="#d97706" stopOpacity="0.65" />
          <stop offset="94%" stopColor="#78350f" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0a0702" stopOpacity="0.05" />
        </radialGradient>

        {/* Heavy Blast Plate Linear Gradient */}
        <linearGradient id="heavyPlateGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#d97706" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1f1404" stopOpacity="0.05" />
        </linearGradient>

        {/* Specular Curved Glare */}
        <linearGradient id="veronicaGlassGlare" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#fde68a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 1. LAYER A: 8 Heavy Interlocking Orbital Blast Plates (Octagonal Geometry) */}
      <g opacity="0.85">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 250 250)`}>
            <polygon
              points="232,54 268,54 282,78 218,78"
              fill="url(#heavyPlateGrad)"
              stroke="#fbbf24"
              strokeWidth="1.2"
            />
            {/* Vent slots */}
            <line x1="242" y1="64" x2="258" y2="64" stroke="#fef08a" strokeWidth="1.2" />
            <line x1="240" y1="70" x2="260" y2="70" stroke="#fbbf24" strokeWidth="0.8" />
            {/* Rivet nodes */}
            <circle cx="236" cy="60" r="1.5" fill="#ffffff" />
            <circle cx="264" cy="60" r="1.5" fill="#ffffff" />
          </g>
        ))}
      </g>

      {/* 2. LAYER B: Dual Counter-Rotating Solar Flux Rings */}
      <g
        className={reducedMotion ? '' : 'animate-rotate-cw'}
        style={{ transformOrigin: '250px 250px', ['--spin-duration' as string]: '28s' }}
      >
        {/* Outer segmented ring R=165 */}
        <circle
          cx="250"
          cy="250"
          r="165"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.6"
          strokeDasharray="18 10 32 10"
          opacity="0.85"
        />
        {/* Heavy caliber teeth (24 angular tooth brackets) */}
        {Array.from({ length: 24 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 15} 250 250)`}>
            <line x1="250" y1="80" x2="250" y2="88" stroke="#fef08a" strokeWidth="1.5" />
            {i % 2 === 0 && (
              <polygon points="248,82 252,82 250,88" fill="#fbbf24" />
            )}
          </g>
        ))}
      </g>

      <g
        className={reducedMotion ? '' : 'animate-rotate-ccw'}
        style={{ transformOrigin: '250px 250px', ['--spin-duration' as string]: '22s' }}
      >
        {/* Inner solar flux track R=130 */}
        <circle
          cx="250"
          cy="250"
          r="130"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeDasharray="4 8 20 8"
          opacity="0.75"
        />
        {/* 8 Satellite Telemetry Nodes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 250 250)`}>
            <circle cx="250" cy="120" r="2.5" fill="#ffffff" filter="url(#veronicaSolarBloom)" />
            <circle cx="250" cy="120" r="1" fill="#0a0702" />
          </g>
        ))}
      </g>

      {/* 3. LAYER C: 4 Heavy Cardinal Targeting Armor Brackets */}
      {[0, 90, 180, 270].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 250 250)`}>
          <path
            d="M 230 148 L 250 134 L 270 148 L 262 154 L 250 146 L 238 154 Z"
            fill="#d97706"
            stroke="#fef08a"
            strokeWidth="1"
            opacity="0.9"
          />
          <line x1="250" y1="146" x2="250" y2="182" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="3 3" />
        </g>
      ))}

      {/* 4. LAYER D: Central Solar Energy Core & Octagonal Confinement Iris */}
      <g
        className={`veronica-core ${pulseClass}`}
        style={{
          transformOrigin: '250px 250px',
          transform: isSpeaking && !reducedMotion ? `scale(${speakingScale})` : undefined,
        }}
      >
        {/* Octagonal Outer Frame */}
        <polygon
          points="212,192 288,192 308,212 308,288 288,308 212,308 192,288 192,212"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
          opacity="0.85"
        />

        {/* Solar Plasma Core Sphere */}
        <circle
          cx="250"
          cy="250"
          r="54"
          fill={isError ? 'url(#redCoreSphereDetailed)' : 'url(#veronicaSolarGrad)'}
          filter="url(#veronicaSolarBloom)"
          opacity={0.95}
        />

        {/* 3D Curved Specular Glare */}
        <path
          d="M 220 220 C 230 208 270 208 280 220 C 265 214 235 214 220 220 Z"
          fill="url(#veronicaGlassGlare)"
          opacity={0.8}
        />
        <ellipse
          cx="238"
          cy="222"
          rx="10"
          ry="4"
          transform="rotate(-25 238 222)"
          fill="#ffffff"
          opacity={0.65}
        />

        {/* Heavy Cardinal Target Reticles */}
        <line x1="184" y1="250" x2="218" y2="250" stroke="#fbbf24" strokeWidth="1.4" opacity="0.85" />
        <line x1="282" y1="250" x2="316" y2="250" stroke="#fbbf24" strokeWidth="1.4" opacity="0.85" />
        <line x1="250" y1="184" x2="250" y2="218" stroke="#fbbf24" strokeWidth="1.4" opacity="0.85" />
        <line x1="250" y1="282" x2="250" y2="316" stroke="#fbbf24" strokeWidth="1.4" opacity="0.85" />

        {/* Concentric Precision Calibrations */}
        <circle
          cx="250"
          cy="250"
          r="38"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeDasharray="6 4 12 4"
          opacity="0.85"
        />

        {/* Active Resonance Wave or Waveform */}
        {activeListening && (
          <g>
            <circle
              cx="250"
              cy="250"
              r="28"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.8"
              className="animate-ping opacity-60"
            />
          </g>
        )}

        {/* Central Solar Singularity */}
        <circle cx="250" cy="250" r="9" fill="#ffffff" filter="url(#veronicaSolarBloom)" />
        <circle cx="250" cy="250" r="4" fill="#ffffff" />

        {/* Audio Waveform Spectrum Indicators */}
        {(activeListening || isSpeaking) && (
          <g opacity="0.95" transform="translate(250, 250)">
            {[-28, -20, -12, -4, 4, 12, 20, 28].map((x, idx) => {
              const height = Math.max(3, (audioWaveform[idx % audioWaveform.length] / 100) * 22);
              return (
                <line
                  key={idx}
                  x1={x}
                  y1={-height / 2}
                  x2={x}
                  y2={height / 2}
                  stroke="#ffffff"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        )}
      </g>
    </g>
  );
};
