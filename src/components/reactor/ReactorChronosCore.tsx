import React from 'react';
import { HudStateType } from '../../hooks/useHudState';

interface ReactorChronosCoreProps {
  hudState: HudStateType;
  reducedMotion: boolean;
  audioWaveform: number[];
  isListening?: boolean;
}

export const ReactorChronosCore: React.FC<ReactorChronosCoreProps> = ({
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
    <g className="reactor-chronos-nexus select-none pointer-events-none">
      <defs>
        {/* Emerald Matrix Volumetric Bloom */}
        <filter id="chronosMatrixBloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="blur1" />
          <feGaussianBlur stdDeviation="11" result="blur2" />
          <feGaussianBlur stdDeviation="22" result="blur3" />
          <feMerge>
            <feMergeNode in="blur3" />
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Chronos Emerald Quantum Radial Gradient */}
        <radialGradient id="chronosQuantumGrad" cx="50%" cy="46%" r="54%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="16%" stopColor="#d1fae5" stopOpacity="0.98" />
          <stop offset="36%" stopColor="#34d399" stopOpacity="0.92" />
          <stop offset="60%" stopColor="#00ff88" stopOpacity="0.85" />
          <stop offset="82%" stopColor="#059669" stopOpacity="0.65" />
          <stop offset="94%" stopColor="#064e3b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#021209" stopOpacity="0.05" />
        </radialGradient>

        {/* Crystalline Prism Gradient */}
        <linearGradient id="prismWingGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#059669" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#021209" stopOpacity="0.05" />
        </linearGradient>

        {/* Specular Emerald Lens Glare */}
        <linearGradient id="chronosGlassGlare" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#a7f3d0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 1. LAYER A: Tri-Radial Crystalline Prism Emitter Wings (120-Degree Symmetry) */}
      <g filter="url(#chronosMatrixBloom)">
        {[0, 120, 240].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 250 250)`}>
            {/* Flared Tesseract Wing */}
            <path
              d="M 234 90 L 250 56 L 266 90 L 260 145 L 240 145 Z"
              fill="url(#prismWingGrad)"
              stroke="#00ff88"
              strokeWidth="1.2"
            />
            {/* Inner crystalline spine */}
            <line x1="250" y1="62" x2="250" y2="140" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
            {/* Vertex Emitter Node */}
            <circle cx="250" cy="56" r="3.5" fill="#ffffff" />
            <circle cx="250" cy="56" r="1.5" fill="#042415" />
            {/* Horizontal telemetry notches */}
            <line x1="242" y1="102" x2="258" y2="102" stroke="#34d399" strokeWidth="1" />
            <line x1="244" y1="118" x2="256" y2="118" stroke="#34d399" strokeWidth="1" />
          </g>
        ))}
      </g>

      {/* 2. LAYER B: Nested Hexagonal Quantum Matrix Mesh */}
      <g
        className={reducedMotion ? '' : 'animate-rotate-cw'}
        style={{ transformOrigin: '250px 250px', ['--spin-duration' as string]: '32s' }}
      >
        {/* Outer Hexagon R=162 */}
        <polygon
          points="250,88 390,169 390,331 250,412 110,331 110,169"
          fill="none"
          stroke="#00ff88"
          strokeWidth="1.2"
          strokeDasharray="16 8 24 8"
          opacity="0.8"
        />
        {/* Hexagonal Corner Quantum Nodes */}
        {[
          [250, 88], [390, 169], [390, 331],
          [250, 412], [110, 331], [110, 169],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="2.5" fill="#ffffff" />
            <circle cx={cx} cy={cy} r="6" fill="none" stroke="#00ff88" strokeWidth="0.8" opacity="0.6" />
          </g>
        ))}
      </g>

      <g
        className={reducedMotion ? '' : 'animate-rotate-ccw'}
        style={{ transformOrigin: '250px 250px', ['--spin-duration' as string]: '20s' }}
      >
        {/* Middle Hexagon R=126 */}
        <polygon
          points="250,124 359,187 359,313 250,376 141,313 141,187"
          fill="none"
          stroke="#34d399"
          strokeWidth="1"
          strokeDasharray="4 6 12 6"
          opacity="0.75"
        />
        {/* 12 Hash graduation marks */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="250"
            y1="130"
            x2="250"
            y2="136"
            stroke="#a7f3d0"
            strokeWidth="1"
            transform={`rotate(${i * 30} 250 250)`}
          />
        ))}
      </g>

      {/* 3. LAYER C: Tri-Axis Cardinal Quantum Alignment */}
      {[30, 90, 150, 210, 270, 330].map((deg) => (
        <line
          key={deg}
          x1="250"
          y1="162"
          x2="250"
          y2="188"
          stroke="#00ff88"
          strokeWidth="1.2"
          opacity="0.85"
          transform={`rotate(${deg} 250 250)`}
        />
      ))}

      {/* 4. LAYER D: Central Emerald Singularity & Harmonic Superposition Core */}
      <g
        className={`chronos-core ${pulseClass}`}
        style={{
          transformOrigin: '250px 250px',
          transform: isSpeaking && !reducedMotion ? `scale(${speakingScale})` : undefined,
        }}
      >
        {/* Inner Confinement Hexagon R=56 */}
        <polygon
          points="250,194 298,222 298,278 250,306 202,278 202,222"
          fill="none"
          stroke="#00ff88"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* Primary Emerald Quantum Core Sphere */}
        <circle
          cx="250"
          cy="250"
          r="52"
          fill={isError ? 'url(#redCoreSphereDetailed)' : 'url(#chronosQuantumGrad)'}
          filter="url(#chronosMatrixBloom)"
          opacity={0.95}
        />

        {/* 3D Curved Specular Glass Glare */}
        <path
          d="M 220 220 C 230 208 270 208 280 220 C 265 214 235 214 220 220 Z"
          fill="url(#chronosGlassGlare)"
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

        {/* Tri-Sector Pulse Chevron Accents */}
        {[0, 120, 240].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 250 250)`}>
            <polyline
              points="244,212 250,204 256,212"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.4"
            />
          </g>
        ))}

        {/* Active Resonance Wave */}
        {activeListening && (
          <g>
            <circle
              cx="250"
              cy="250"
              r="28"
              fill="none"
              stroke="#00ff88"
              strokeWidth="1.8"
              className="animate-ping opacity-60"
            />
          </g>
        )}

        {/* Central Quantum Singularity */}
        <circle cx="250" cy="250" r="9" fill="#ffffff" filter="url(#chronosMatrixBloom)" />
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
