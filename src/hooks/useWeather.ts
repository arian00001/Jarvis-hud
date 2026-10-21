import { useState, useEffect, useCallback } from 'react';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  locationName: string;
  isDay: boolean;
  daily: {
    day: string;
    code: number;
    max: number;
    min: number;
  }[];
  lastUpdated: string;
  loading: boolean;
  error: string | null;
}

function getWeatherCondition(code: number): string {
  if (code === 0) return 'CLEAR SKY';
  if (code === 1) return 'MAINLY CLEAR';
  if (code === 2) return 'PARTLY CLOUDY';
  if (code === 3) return 'OVERCAST';
  if ([45, 48].includes(code)) return 'FOG';
  if ([51, 53, 55, 61, 63, 65].includes(code)) return 'RAIN SHOWER';
  if ([71, 73, 75, 77].includes(code)) return 'SNOWFALL';
  if ([80, 81, 82].includes(code)) return 'HEAVY SHOWERS';
  if ([95, 96, 99].includes(code)) return 'THUNDERSTORM';
  return 'ATMOSPHERIC NOMINAL';
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 21.4,
    humidity: 48,
    windSpeed: 12.8,
    weatherCode: 1,
    condition: 'MAINLY CLEAR',
    locationName: 'SECTOR LOCAL',
    isDay: true,
    daily: [
      { day: 'TODAY', code: 1, max: 24, min: 14 },
      { day: 'TOMORROW', code: 2, max: 23, min: 15 },
      { day: 'THURSDAY', code: 61, max: 19, min: 12 },
    ],
    lastUpdated: 'JUST NOW',
    loading: false,
    error: null,
  });

  const fetchWeather = useCallback(async () => {
    setWeather((prev) => ({ ...prev, loading: true, error: null }));

    let lat = 40.7128;
    let lon = -74.006;
    let locLabel = 'SECTOR LOCAL';

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 60000,
          });
        });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        locLabel = `GEO [${lat.toFixed(2)}°, ${lon.toFixed(2)}°]`;
      } catch {
        // Fallback to default coordinates
        locLabel = 'STANDBY LOC';
      }
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Atmospheric telemetry unreachable');
      const data = await res.json();

      const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const dailyForecast = (data.daily?.time || []).slice(0, 3).map((t: string, i: number) => {
        const date = new Date(t);
        const day = i === 0 ? 'TODAY' : i === 1 ? 'TOMORROW' : daysOfWeek[date.getDay()];
        return {
          day,
          code: data.daily.weather_code[i] ?? 0,
          max: Math.round(data.daily.temperature_2m_max[i] ?? 20),
          min: Math.round(data.daily.temperature_2m_min[i] ?? 12),
        };
      });

      setWeather({
        temperature: Math.round(data.current.temperature_2m * 10) / 10,
        humidity: Math.round(data.current.relative_humidity_2m),
        windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
        weatherCode: data.current.weather_code,
        condition: getWeatherCondition(data.current.weather_code),
        locationName: locLabel,
        isDay: data.current.is_day === 1,
        daily: dailyForecast.length ? dailyForecast : prevDaily(),
        lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        loading: false,
        error: null,
      });
    } catch (err) {
      setWeather((prev) => ({
        ...prev,
        loading: false,
        error: 'Offline sensor cache active',
      }));
    }
  }, []);

  function prevDaily() {
    return [
      { day: 'TODAY', code: 1, max: 24, min: 14 },
      { day: 'TOMORROW', code: 2, max: 23, min: 15 },
      { day: 'THURSDAY', code: 61, max: 19, min: 12 },
    ];
  }

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weather, refreshWeather: fetchWeather };
}
