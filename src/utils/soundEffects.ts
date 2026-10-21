/**
 * Web Audio API synthesizer for cinematic JARVIS HUD sound effects.
 * 100% offline, zero network requests, zero external assets.
 */

class HudAudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.04);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // AudioContext unavailable or error
    }
  }

  public playStateSound(state: 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR') {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      if (state === 'LISTENING') {
        // High-tech ascending activation chirp
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.18); // C6
        osc2.frequency.setValueAtTime(659.25, now); // E5
        osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.18); // E6

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.22);
        osc2.stop(now + 0.22);
      } else if (state === 'THINKING') {
        // Computational data sweep blips
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + i * 0.07;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(800 + i * 300, t);
          osc.frequency.exponentialRampToValueAtTime(1600 + i * 200, t + 0.05);

          gain.gain.setValueAtTime(0.05, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + 0.05);
        }
      } else if (state === 'SPEAKING') {
        // Harmonic resonant vocal surge
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(880, now);
        filter.Q.setValueAtTime(4, now);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      } else if (state === 'ERROR') {
        // Urgent warning dual-tone alarm
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(320, now);
        osc2.frequency.setValueAtTime(460, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.28);
        osc2.stop(now + 0.28);
      } else {
        // IDLE: soft low-pass confirmation
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // AudioContext handling
    }
  }

  private speechListeners: Set<(isSpeaking: boolean, charIndex?: number) => void> = new Set();

  public onSpeechStateChange(callback: (isSpeaking: boolean, charIndex?: number) => void): () => void {
    this.speechListeners.add(callback);
    return () => {
      this.speechListeners.delete(callback);
    };
  }

  private notifySpeech(isSpeaking: boolean, charIndex?: number) {
    this.speechListeners.forEach((listener) => {
      try {
        listener(isSpeaking, charIndex);
      } catch {
        // Ignore listener errors
      }
    });
  }

  public speak(text: string) {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.9;
      utterance.rate = 1.05;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        this.notifySpeech(true);
      };

      utterance.onend = () => {
        this.notifySpeech(false);
      };

      utterance.onerror = () => {
        this.notifySpeech(false);
      };

      utterance.onboundary = (e) => {
        this.notifySpeech(true, e.charIndex);
      };

      // Attempt to pick an English voice with technical tone if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('UK') ||
            v.name.includes('Daniel'))
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      this.notifySpeech(false);
    }
  }
}

export const hudAudio = new HudAudioEngine();
