import React, { useState, useEffect } from 'react';
import { X, Languages, Volume2, Play, Check } from 'lucide-react';
import { hudAudio } from '../../utils/soundEffects';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>('');
  const [pitch, setPitch] = useState<number>(0.95);
  const [rate, setRate] = useState<number>(1.05);
  const [language, setLanguage] = useState<string>('en-US');

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && !selectedVoiceUri) {
        // Pick English or default
        const defaultVoice = available.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('David')));
        setSelectedVoiceUri(defaultVoice?.voiceURI || available[0].voiceURI);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, [selectedVoiceUri]);

  if (!isOpen) return null;

  const testVoice = () => {
    hudAudio.playClick();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'Voice synthesis calibrated. J.A.R.V.I.S. neural speech protocol verified.'
      );
      utterance.pitch = pitch;
      utterance.rate = rate;
      if (selectedVoiceUri) {
        const found = voices.find((v) => v.voiceURI === selectedVoiceUri);
        if (found) utterance.voice = found;
      }
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const languagesList = [
    { code: 'en-US', label: 'English (United States)' },
    { code: 'en-GB', label: 'English (United Kingdom)' },
    { code: 'es-ES', label: 'Spanish / Español' },
    { code: 'fr-FR', label: 'French / Français' },
    { code: 'de-DE', label: 'German / Deutsch' },
    { code: 'ja-JP', label: 'Japanese / 日本語' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none font-mono">
      <div className="relative w-full max-w-lg bg-[#020713] border border-cyan-400/40 rounded-lg shadow-[0_0_35px_rgba(0,240,255,0.3)] flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/25 bg-[#051329]/90 shrink-0">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold tracking-widest text-cyan-200 uppercase font-sans">
              VOCAL SYNTHESIS & LANGUAGE PROTOCOLS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-950/60 transition-colors cursor-pointer"
            aria-label="Close Language Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Primary Language Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-cyan-300 font-bold uppercase tracking-wider block">
              PRIMARY SYSTEM LANGUAGE
            </label>
            <div className="grid grid-cols-2 gap-2">
              {languagesList.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-2 rounded text-left text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    language === lang.code
                      ? 'bg-cyan-950/80 border border-cyan-400 text-cyan-100 font-bold'
                      : 'bg-[#051329] border border-cyan-500/20 text-cyan-400/70 hover:border-cyan-500/40'
                  }`}
                >
                  <span className="truncate">{lang.label}</span>
                  {language === lang.code && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Engine Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-cyan-300 font-bold uppercase tracking-wider block">
              AVAILABLE NEURAL VOICES ({voices.length} INSTALLED)
            </label>
            {voices.length > 0 ? (
              <select
                value={selectedVoiceUri}
                onChange={(e) => setSelectedVoiceUri(e.target.value)}
                className="w-full bg-[#051329] border border-cyan-500/30 rounded p-2 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400"
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-2 rounded bg-[#051329] border border-cyan-500/20 text-xs text-cyan-400/60">
                Default system speech synthesizer active.
              </div>
            )}
          </div>

          {/* Voice Tuning Controls */}
          <div className="space-y-3 p-3 rounded bg-[#051329]/60 border border-cyan-500/20">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-cyan-300">
                <span>VOCAL PITCH:</span>
                <span className="tabular-nums font-bold">{pitch.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.4"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-cyan-300">
                <span>CADENCE RATE:</span>
                <span className="tabular-nums font-bold">{rate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          {/* Test Voice Button */}
          <button
            onClick={testVoice}
            className="w-full py-2.5 rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>TEST VOICE SYNTHESIS</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-cyan-500/25 bg-[#051329]/90 flex justify-between items-center text-[10px] text-cyan-400/60">
          <span>W3C WEB SPEECH API COMPLIANT</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 hover:bg-cyan-500/30"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};
