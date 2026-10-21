import React from 'react';
import { HudStateType } from '../../hooks/useHudState';

interface ReactorEnergyCoreProps {
  hudState: HudStateType;
  reducedMotion: boolean;
  audioWaveform: number[];
  isListening?: boolean;
}

export const ReactorEnergyCore: React.FC<ReactorEnergyCoreProps> = ({
  hudState,
  reducedMotion,
  audioWaveform,
  isListening,
}) => {
  const isError = hudState === 'ERROR';
  const isSpeaking = hudState === 'SPEAKING';
  const isThinking = hudState === 'THINKING';
  const activeListening = Boolean(isListening || hudState === 'LISTENING');

  // Compute live waveform dynamic magnitude
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
    <g
      className={`reactor-energy-core ${pulseClass}`}
      style={{
        transformOrigin: '250px 250px',
        transform: isSpeaking && !reducedMotion ? `scale(${speakingScale})` : undefined,
      }}
    >
      <defs>
        {/* Ultra-pure Stark Industries Cyan Bloom Filter */}
        <filter id="coreGlowCyanDetailed" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="blur1" />
          <feGaussianBlur stdDeviation="12" result="blur2" />
          <feGaussianBlur stdDeviation="22" result="blur3" />
          <feMerge>
            <feMergeNode in="blur3" />
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Emergency Crimson Core Filter */}
        <filter id="coreGlowRedDetailed" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur1" />
          <feGaussianBlur stdDeviation="14" result="blur2" />
          <feGaussianBlur stdDeviation="24" result="blur3" />
          <feMerge>
            <feMergeNode in="blur3" />
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Deep Multi-Layered Quantum Plasma Core Gradient */}
        <radialGradient id="cyanCoreSphereDetailed" cx="48%" cy="46%" r="52%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="16%" stopColor="#e0faff" stopOpacity="0.98" />
          <stop offset="34%" stopColor="#38bdf8" stopOpacity="0.92" />
          <stop offset="56%" stopColor="#00f0ff" stopOpacity="0.85" />
          <stop offset="78%" stopColor="#0284c7" stopOpacity="0.65" />
          <stop offset="92%" stopColor="#082f49" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#020713" stopOpacity="0.05" />
        </radialGradient>

        <radialGradient id="redCoreSphereDetailed" cx="48%" cy="46%" r="52%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="20%" stopColor="#ff7b9f" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ff2a5f" stopOpacity="0.9" />
          <stop offset="75%" stopColor="#990526" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#1a0208" stopOpacity="0.1" />
        </radialGradient>

        {/* Spherical Specular Glass Glare Gradient */}
        <linearGradient id="sphericalGlareGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#a5f3fc" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
        </linearGradient>

        {/* Subtle Metallic Aperture Blade Gradient */}
        <linearGradient id="apertureLeafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#04203e" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* 1. Outer Iris Mechanical Perimeter Boundary R=58 */}
      <circle
        cx="250"
        cy="250"
        r="58"
        fill="none"
        stroke={isError ? '#ff2a5f' : '#38bdf8'}
        strokeWidth="1"
        opacity="0.45"
      />

      {/* 2. Micro Azimuth Calibration Ticks (36 divisions) */}
      {Array.from({ length: 36 }).map((_, i) => {
        const deg = i * 10;
        const isMajor = deg % 30 === 0;
        return (
          <line
            key={deg}
            x1="250"
            y1={isMajor ? 193 : 195}
            x2="250"
            y2="198"
            stroke={isError ? '#ff2a5f' : isMajor ? '#ffffff' : '#00f0ff'}
            strokeWidth={isMajor ? 1 : 0.6}
            opacity={isMajor ? 0.8 : 0.4}
            transform={`rotate(${deg} 250 250)`}
          />
        );
      })}

      {/* 3. Primary Holographic Plasma Sphere Core (Deep Spherical Volume) */}
      <circle
        cx="250"
        cy="250"
        r="52"
        fill={isError ? 'url(#redCoreSphereDetailed)' : 'url(#cyanCoreSphereDetailed)'}
        filter={isError ? 'url(#coreGlowRedDetailed)' : 'url(#coreGlowCyanDetailed)'}
        opacity={0.94}
      />

      {/* 4. Cinematic 3D Spherical Glass Lens Highlight (Upper Specular Arc) */}
      <path
        d="M 220 220 C 230 208 270 208 280 220 C 265 214 235 214 220 220 Z"
        fill="url(#sphericalGlareGrad)"
        opacity={isError ? 0.3 : 0.85}
        className="pointer-events-none"
      />
      <ellipse
        cx="238"
        cy="222"
        rx="10"
        ry="4"
        transform="rotate(-25 238 222)"
        fill="#ffffff"
        opacity={0.65}
        className="pointer-events-none"
      />

      {/* 5. Precision Cardinal Crosshair Alignment Marks */}
      <line x1="184" y1="250" x2="218" y2="250" stroke={isError ? '#ff2a5f' : '#00f0ff'} strokeWidth="1.2" opacity="0.75" />
      <line x1="282" y1="250" x2="316" y2="250" stroke={isError ? '#ff2a5f' : '#00f0ff'} strokeWidth="1.2" opacity="0.75" />
      <line x1="250" y1="184" x2="250" y2="218" stroke={isError ? '#ff2a5f' : '#00f0ff'} strokeWidth="1.2" opacity="0.75" />
      <line x1="250" y1="282" x2="250" y2="316" stroke={isError ? '#ff2a5f' : '#00f0ff'} strokeWidth="1.2" opacity="0.75" />

      {/* 6. High-Tech Reticle Concentric Division Ring R=44 */}
      <circle
        cx="250"
        cy="250"
        r="44"
        fill="none"
        stroke={isError ? '#ff2a5f' : '#ffffff'}
        strokeWidth="1.2"
        strokeDasharray="4 6 14 6"
        opacity="0.8"
      />

      {/* 7. Stark Precision Iris Aperture Blades (12 interlocking leaves) */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 250 250)`}>
          <polygon
            points="248,214 252,214 254,232 246,232"
            fill="url(#apertureLeafGrad)"
            stroke={isError ? '#ff2a5f' : '#70f7ff'}
            strokeWidth="0.5"
            opacity="0.7"
          />
        </g>
      ))}

      {/* 8. ERROR STATE: Reference Warning Geometry */}
      {isError ? (
        <g transform="translate(250, 248)" filter="url(#coreGlowRedDetailed)">
          <polygon
            points="0,-22 20,12 -20,12"
            fill="none"
            stroke="#ff2a5f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon
            points="0,-16 14,8 -14,8"
            fill="rgba(255, 42, 95, 0.25)"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <line x1="0" y1="-10" x2="0" y2="-1" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="0" cy="4" r="1.5" fill="#ffffff" />
          <text
            x="0"
            y="23"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="7"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            WARNING
          </text>
          <text
            x="0"
            y="30"
            textAnchor="middle"
            fill="#ff2a5f"
            fontSize="5.5"
            fontFamily="monospace"
            letterSpacing="0.8"
          >
            [DELTA-74]
          </text>
        </g>
      ) : (
        /* NORMAL, LISTENING & SPEAKING STATES: Premium Quantum Aperture & Singularity */
        <g transform="translate(250, 250)">
          {/* Inner Confinement Chamber Rings */}
          <circle cx="0" cy="0" r="30" fill="none" stroke="#ffffff" strokeWidth="1.4" opacity="0.9" />
          <circle
            cx="0"
            cy="0"
            r="20"
            fill="rgba(0, 240, 255, 0.25)"
            stroke="#70f7ff"
            strokeWidth="1.6"
            strokeDasharray={activeListening ? '3 3' : undefined}
          />

          {/* Dynamic Quantum Resonance Ring when Active */}
          {activeListening && (
            <g>
              <circle
                cx="0"
                cy="0"
                r="26"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="1.5"
                className="animate-ping opacity-60"
              />
              <circle
                cx="0"
                cy="0"
                r="36"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.8"
                strokeDasharray="2 6"
                opacity="0.8"
              />
            </g>
          )}

          {/* Central Radiant Singularity Photons */}
          <circle cx="0" cy="0" r="8" fill="#ffffff" filter="url(#coreGlowCyanDetailed)" />
          <circle cx="0" cy="0" r="3" fill="#ffffff" />

          {/* Micro Geometric Singularity Star */}
          {!activeListening && !isSpeaking && (
            <>
              <line x1="-9" y1="0" x2="9" y2="0" stroke="#020713" strokeWidth="1.4" opacity="0.8" />
              <line x1="0" y1="-9" x2="0" y2="9" stroke="#020713" strokeWidth="1.4" opacity="0.8" />
              <circle cx="0" cy="0" r="1.5" fill="#020713" />
            </>
          )}

          {/* Audio Waveform Spectrum Indicators for LISTENING / SPEAKING */}
          {(activeListening || isSpeaking) && (
            <g opacity="0.95">
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
                    opacity="0.9"
                  />
                );
              })}
            </g>
          )}
        </g>
      )}
    </g>
  );
};
