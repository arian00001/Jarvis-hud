import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, Bot, User, Sparkles } from 'lucide-react';
import { hudAudio } from '../../utils/soundEffects';
import { jarvisBridge } from '../../bridge/jarvisBridge';

interface ChatMessage {
  id: string;
  sender: 'JARVIS' | 'USER';
  text: string;
  timestamp: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandTrigger: (cmd: string) => void;
  voiceSynthesizer: boolean;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  onCommandTrigger,
  voiceSynthesizer,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'JARVIS',
      text: 'Good day, Sir. All holographic subroutines are online. How may I facilitate your operations?',
      timestamp: 'SYSTEM ONLINE',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    hudAudio.playClick();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'USER',
      text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Check system triggers
    const lower = text.toLowerCase();
    if (lower.includes('status') || lower.includes('diagnostic')) onCommandTrigger('DIAGNOSTICS');
    else if (lower.includes('scan') || lower.includes('camera')) onCommandTrigger('SCAN');
    else if (lower.includes('weather') || lower.includes('atmosphere')) onCommandTrigger('WEATHER');
    else if (lower.includes('memory') || lower.includes('recall')) onCommandTrigger('MEMORIES');
    else if (lower.includes('share') || lower.includes('screen')) onCommandTrigger('SCREEN_SHARE');
    else if (lower.includes('error') || lower.includes('alert')) onCommandTrigger('ERROR');

    // Query real Gemini AI or smart bridge
    jarvisBridge.queryAI(text).then((reply) => {
      const jarvisMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'JARVIS',
        text: reply,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, jarvisMsg]);
      setIsTyping(false);

      if (voiceSynthesizer) {
        hudAudio.speak(reply);
      }
    });
  };

  const suggestions = [
    'System status report',
    'Open environmental scan',
    'Atmospheric weather check',
    'Recall neural memories',
    'Share screen telemetry',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none font-mono">
      <div className="relative w-full max-w-xl h-[85vh] max-h-[680px] bg-[#020713] border border-cyan-400/40 rounded-lg shadow-[0_0_35px_rgba(0,240,255,0.3)] flex flex-col overflow-hidden">
        {/* Holographic Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/25 bg-[#051329]/90 shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold tracking-widest text-cyan-200 uppercase font-sans">
              J.A.R.V.I.S. NEURAL COMMUNICATIONS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-950/60 transition-colors cursor-pointer"
            aria-label="Close Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Stream */}
        <div ref={scrollRef} className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'USER' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[9px] text-cyan-400/60 uppercase">
                {m.sender === 'USER' ? (
                  <>
                    <span>OPERATOR</span>
                    <User className="w-2.5 h-2.5 text-cyan-300" />
                  </>
                ) : (
                  <>
                    <Bot className="w-2.5 h-2.5 text-cyan-400" />
                    <span>J.A.R.V.I.S.</span>
                  </>
                )}
                <span>·</span>
                <span className="tabular-nums">{m.timestamp}</span>
              </div>
              <div
                className={`max-w-[85%] px-3 py-2 rounded text-xs leading-relaxed ${
                  m.sender === 'USER'
                    ? 'bg-cyan-950/70 border border-cyan-400/40 text-cyan-100 rounded-br-none'
                    : 'bg-[#051636]/80 border border-cyan-500/25 text-white rounded-bl-none shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-cyan-400/70 italic px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>JARVIS is formulating tactical response...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestions Strip */}
        <div className="px-3 py-1.5 border-t border-cyan-500/15 bg-[#030d21]/60 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
          {suggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/20 text-cyan-300 hover:border-cyan-400 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Chat Input Deck */}
        <div className="p-2.5 sm:p-3 border-t border-cyan-500/25 bg-[#051329]/90 shrink-0 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Transmit directive to J.A.R.V.I.S..."
            className="flex-1 bg-[#020713] border border-cyan-500/30 rounded px-3 py-2 text-xs text-cyan-100 placeholder:text-cyan-600/60 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2 rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
