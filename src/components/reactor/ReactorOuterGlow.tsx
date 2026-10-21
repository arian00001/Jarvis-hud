import React from 'react';
import { HudStateType } from '../../hooks/useHudState';

interface ReactorOuterGlowProps {
  hudState: HudStateType;
  reducedMotion: boolean;
}

export const ReactorOuterGlow: React.FC<ReactorOuterGlowProps> = ({ hudState, reducedMotion }) => {
  const isError = hudState === 'ERROR';

  return (
    <div
      className={`absolute inset-0 rounded-full pointer-events-none transition-all duration-700 ${
        reducedMotion ? '' : 'animate-ambient'
      }`}
      style={{
        background: isError
          ? 'radial-gradient(circle, rgba(255, 42, 95, 0.35) 0%, rgba(255, 42, 95, 0.15) 45%, rgba(0, 0, 0, 0) 72%)'
          : hudState === 'THINKING'
          ? 'radial-gradient(circle, rgba(0, 240, 255, 0.45) 0%, rgba(0, 102, 255, 0.28) 45%, rgba(0, 0, 0, 0) 72%)'
          : hudState === 'SPEAKING'
          ? 'radial-gradient(circle, rgba(112, 247, 255, 0.5) 0%, rgba(0, 102, 255, 0.3) 50%, rgba(0, 0, 0, 0) 75%)'
          : 'radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, rgba(0, 102, 255, 0.18) 48%, rgba(0, 0, 0, 0) 70%)',
      }}
    />
  );
};
