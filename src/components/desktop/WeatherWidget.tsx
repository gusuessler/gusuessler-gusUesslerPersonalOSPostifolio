import React, { useState, useEffect } from "react";

export default function WeatherWidget({ isDarkMode }: { isDarkMode: boolean }) {
    const [weather, setWeather] = useState<{ temp: number; code: number; precip: number } | null>(null);
    const [locationName, setLocationName] = useState("Blumenau");

    useEffect(() => {
        // Defaults (Blumenau, SC)
        const defaultLat = -26.9194;
        const defaultLon = -49.0661;

        async function fetchWeather(lat: number, lon: number) {
            try {
                // Fetch weather
                const weatherRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=precipitation_probability_max&timezone=auto`
                );
                const weatherData = await weatherRes.json();

                // Get today's max precip probability
                const precip = weatherData.daily?.precipitation_probability_max?.[0] ?? 0;

                setWeather({
                    temp: weatherData.current_weather.temperature,
                    code: weatherData.current_weather.weathercode,
                    precip,
                });
            } catch (e) {
                console.error("Failed to fetch weather", e);
            }
        }

        async function fetchCity(lat: number, lon: number) {
            try {
                // Free reverse geocoding (no key required for basic usage)
                const res = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
                );
                const data = await res.json();
                if (data.city || data.locality) {
                    setLocationName(data.city || data.locality);
                }
            } catch (e) {
                console.error("Failed to fetch city name", e);
            }
        }

        function initialize() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchWeather(latitude, longitude);
                        fetchCity(latitude, longitude);
                    },
                    (error) => {
                        console.warn("Geolocation denied or error, using default", error);
                        fetchWeather(defaultLat, defaultLon);
                    }
                );
            } else {
                fetchWeather(defaultLat, defaultLon);
            }
        }

        initialize();

        // Refresh weather every 30 mins
        const interval = setInterval(initialize, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (!weather) return <div className="text-xs opacity-50">...</div>;

    // WMO Weather Codes Simplified
    // 0: Clear sky
    // 1-3: Partly cloud
    // 45,48: Fog
    // 51-67: Drizzle/Rain
    // 71-77: Snow
    // 80-82: Showers
    // 95-99: Thunderstorm
    const { code, temp, precip } = weather;

    let icon;
    let label = "Sunny";

    if (code === 0) {
        label = "Clear";
        icon = (
            <svg className="w-5 h-5 text-amber-500 animate-[spin_10s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
        );
    } else if (code >= 1 && code <= 3) {
        label = "Cloudy";
        icon = (
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>
        );
    } else if (code >= 51 && code <= 67) {
        label = "Rain";
        icon = (
            <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="16" y1="13" x2="16" y2="21" />
                <line x1="8" y1="13" x2="8" y2="21" />
                <line x1="12" y1="15" x2="12" y2="23" />
                <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
            </svg>
        );
    } else if (code >= 95) {
        label = "Storm";
        icon = (
            <svg className="w-5 h-5 text-purple-500 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
                <polyline points="13 11 9 17 15 17 11 23" />
            </svg>
        );
    } else {
        // Fallback (Fog/Snow/Etc)
        label = "Cloudy";
        icon = (
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.5 10H8a2.5 2.5 0 0 1 2.5 2.5V14h-5v-1.5A2.5 2.5 0 0 1 5.5 10z" />
                <path d="M16 10h2.5a2.5 2.5 0 0 1 2.5 2.5V14h-5v-1.5a2.5 2.5 0 0 1 2.5-2.5z" />
            </svg>
        );
    }

    return (
        <div className={`flex items-center gap-2 select-none hover:opacity-80 transition-opacity cursor-default font-sans font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} title={`${locationName} - ${label}`}>
            {icon}
            <div className="flex flex-col leading-none justify-center">
                <span className="font-bold text-sm">{Math.round(temp)}°C</span>
                <span className="text-[10px] opacity-70 flex items-center gap-1">
                    <span className="max-w-[80px] truncate">{locationName}</span>
                    {precip > 0 && (
                        <>
                            <span>•</span>
                            <span title="Chance of rain">{precip}% </span>
                        </>
                    )}
                </span>
            </div>
        </div>
    );
}
