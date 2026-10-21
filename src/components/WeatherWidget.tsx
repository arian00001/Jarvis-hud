import React, { useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, RefreshCw, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { WeatherData } from '../hooks/useWeather';
import { hudAudio } from '../utils/soundEffects';

interface WeatherWidgetProps {
  weather: WeatherData;
  onRefresh: () => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, onRefresh }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="w-3.5 h-3.5 text-amber-300" />;
    if ([51, 53, 55, 61, 63, 65, 80, 81].includes(code)) return <CloudRain className="w-3.5 h-3.5 text-cyan-300" />;
    return <Cloud className="w-3.5 h-3.5 text-cyan-200" />;
  };

  const handleToggle = () => {
    hudAudio.playClick();
    setExpanded((prev) => !prev);
  };

  return (
    <div className="relative select-none font-mono z-30">
      {/* COMPACT COLLAPSIBLE TRIGGER CHIP */}
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#051329]/80 border border-cyan-500/30 hover:border-cyan-400/60 backdrop-blur-xs transition-all duration-200 cursor-pointer text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.15)]"
        title="Toggle atmospheric weather telemetry"
        aria-label="Toggle Weather Details"
      >
        {getWeatherIcon(weather.weatherCode)}
        <span className="text-[10px] sm:text-[11px] font-bold tabular-nums">
          {weather.temperature}°C
        </span>
        <span className="hidden sm:inline text-[9px] text-cyan-400/70 tracking-wider">
          {weather.condition}
        </span>
        {expanded ? (
          <ChevronUp className="w-3 h-3 text-cyan-400" />
        ) : (
          <ChevronDown className="w-3 h-3 text-cyan-400/60" />
        )}
      </button>

      {/* EXPANDED COMPACT COLLAPSIBLE PANEL */}
      {expanded && (
        <div className="absolute top-full mt-1.5 right-0 sm:right-auto sm:left-0 w-64 sm:w-72 bg-[#020713]/95 border border-cyan-400/40 rounded-lg p-3 shadow-[0_0_25px_rgba(0,240,255,0.25)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20 text-[10px]">
            <div className="flex items-center gap-1 text-cyan-300">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span className="font-bold">{weather.locationName}</span>
            </div>
            <button
              onClick={() => {
                hudAudio.playClick();
                onRefresh();
              }}
              disabled={weather.loading}
              className="p-1 rounded text-cyan-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Poll latest satellite data"
            >
              <RefreshCw className={`w-3 h-3 ${weather.loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Current Breakdown */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded bg-cyan-950/50 border border-cyan-500/20">
                {getWeatherIcon(weather.weatherCode)}
              </div>
              <div>
                <div className="text-lg font-bold text-white tabular-nums leading-none">
                  {weather.temperature}°C
                </div>
                <div className="text-[9px] text-cyan-400 font-medium tracking-wide mt-1">
                  {weather.condition}
                </div>
              </div>
            </div>

            <div className="space-y-1 text-right text-[10px]">
              <div className="flex items-center justify-end gap-1 text-cyan-300">
                <Droplets className="w-3 h-3 text-cyan-400" />
                <span>{weather.humidity}% HUMIDITY</span>
              </div>
              <div className="flex items-center justify-end gap-1 text-cyan-300">
                <Wind className="w-3 h-3 text-cyan-400" />
                <span>{weather.windSpeed} km/h WIND</span>
              </div>
            </div>
          </div>

          {/* 3-Day Forecast Strip */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-cyan-500/20">
            {weather.daily.map((d, i) => (
              <div
                key={i}
                className="p-1.5 rounded bg-[#051329]/70 border border-cyan-500/15 text-center flex flex-col items-center gap-0.5"
              >
                <span className="text-[8px] text-cyan-400/70 font-bold">{d.day}</span>
                <div className="my-0.5">{getWeatherIcon(d.code)}</div>
                <span className="text-[9px] font-bold text-white tabular-nums">
                  {d.max}° / {d.min}°
                </span>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-2 text-[8px] text-cyan-400/40 text-center tracking-wider">
            OPEN-METEO REALTIME TELEMETRY · UPDATED {weather.lastUpdated}
          </div>
        </div>
      )}
    </div>
  );
};
