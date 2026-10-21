/**
 * J.A.R.V.I.S. SYSTEM INTEGRATION BRIDGE
 * Modular interface connecting frontend holographic HUD with real AI APIs,
 * Android hardware sensors, WebRTC display, and atmospheric telemetry.
 * Clean extensible architecture for plugging in production endpoints.
 */

import { GoogleGenAI } from '@google/genai';

export interface JarvisBridgeConfig {
  geminiApiKey?: string;
  customApiUrl?: string;
  telemetryEndpoint?: string;
}

export class JarvisBridgeService {
  private config: JarvisBridgeConfig = {};
  private genAI: GoogleGenAI | null = null;

  constructor(initialConfig?: JarvisBridgeConfig) {
    if (initialConfig) {
      this.configure(initialConfig);
    } else {
      // Auto-detect environment variables
      const envKey =
        (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
        (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
        '';
      if (envKey) {
        this.configure({ geminiApiKey: envKey });
      }
    }
  }

  public configure(config: JarvisBridgeConfig) {
    this.config = { ...this.config, ...config };
    if (this.config.geminiApiKey) {
      try {
        this.genAI = new GoogleGenAI({ apiKey: this.config.geminiApiKey });
      } catch {
        this.genAI = null;
      }
    }
  }

  /**
   * Real AI Intelligence Bridge: Queries Gemini API or falls back to intelligent tactical processor.
   */
  public async queryAI(prompt: string, context?: string): Promise<string> {
    if (this.genAI) {
      try {
        const response = await this.genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction:
              'You are J.A.R.V.I.S., the advanced tactical artificial intelligence built by Tony Stark. Keep responses concise, precise, respectful, and framed in high-tech cinematic Stark Industries style. Answer the operator directly in 1-3 sentences.',
          },
        });
        if (response.text) {
          return response.text;
        }
      } catch (err) {
        console.warn('Gemini API call bypassed or error, using local neural logic:', err);
      }
    }

    // High-fidelity Contextual Heuristics Engine (Runs 100% offline when no API key configured)
    const lower = prompt.toLowerCase();
    if (lower.includes('status') || lower.includes('diagnostic')) {
      return 'All Mark-LXXXV systems operating within nominal tolerances. Arc reactor flux stabilized at 98.4%, quantum synchronization at 99.4%.';
    }
    if (lower.includes('scan') || lower.includes('camera') || lower.includes('target')) {
      return 'Optical telemetry matrix locked onto sector coordinates. Engaging environmental spectrum analysis.';
    }
    if (lower.includes('weather') || lower.includes('temperature') || lower.includes('forecast')) {
      return 'Real-time meteorological satellites polled via Open-Meteo telemetry. Atmospheric readings displayed in the upper HUD module.';
    }
    if (lower.includes('memory') || lower.includes('recall') || lower.includes('directive')) {
      return 'Neural directive repository online. Local encrypted memory storage reflects active mission logs.';
    }
    if (lower.includes('share') || lower.includes('screen') || lower.includes('display')) {
      return 'WebRTC display stream transmitter ready. Requesting operator display permissions.';
    }
    if (lower.includes('who are you') || lower.includes('your name')) {
      return 'I am J.A.R.V.I.S. (Just A Rather Very Intelligent System), your holographic tactical AI assistant.';
    }

    return `Directive acknowledged, Sir. Processing parameters for: "${prompt}". All subroutines synchronized at peak threshold.`;
  }

  /**
   * Weather Bridge: Connects to Open-Meteo real atmospheric satellite service
   */
  public async fetchRealWeather(lat: number, lon: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Atmospheric stream disconnected');
    return res.json();
  }

  /**
   * Android / Hardware Sensor Bridge:
   * Provides hook to plug in real Termux or Android sensors (battery, accelerometer, wifi)
   */
  public async getBatteryStatus(): Promise<{ level: number; charging: boolean } | null> {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      try {
        const battery: any = await (navigator as any).getBattery();
        return {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
        };
      } catch {}
    }
    return null;
  }
}

export const jarvisBridge = new JarvisBridgeService();
