import { useState, useEffect, useCallback, useRef } from 'react';

// Browser SpeechRecognition typing
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

export function useSpeechRecognition(onSpeechFinal?: (text: string) => void) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [supported, setSupported] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      setSupported(true);
      try {
        const recognition: SpeechRecognitionInstance = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setPermissionError(null);
        };

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            current += event.results[i][0].transcript;
          }
          setTranscript(current);

          if (event.results[0]?.isFinal) {
            const final = event.results[0][0].transcript;
            if (onSpeechFinal) {
              onSpeechFinal(final);
            }
          }
        };

        recognition.onerror = (event: any) => {
          if (event.error === 'not-allowed') {
            setPermissionError('Microphone permission required on Android/browser.');
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        setSupported(false);
      }
    }
  }, [onSpeechFinal]);

  const startListening = useCallback(() => {
    setTranscript('');
    setPermissionError(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Recognition already started or error
      }
    } else {
      // Simulate fallback voice directive if browser lacks SpeechRecognition
      setIsListening(true);
      setTimeout(() => {
        const mockPrompt = 'Run diagnostic system status check';
        setTranscript(mockPrompt);
        setIsListening(false);
        if (onSpeechFinal) onSpeechFinal(mockPrompt);
      }, 2500);
    }
  }, [onSpeechFinal]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    supported,
    permissionError,
    startListening,
    stopListening,
    toggleListening,
  };
}
