"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  city: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon?: string;
};

type WeatherCardProps = {
  destination: string;
};

export default function WeatherCard({
  destination,
}: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      if (!destination) {
        setError("Destination is not available.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/weather?destination=${encodeURIComponent(destination)}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to retrieve weather information.",
          );
        }

        setWeather(data.weather);
      } catch (err) {
        console.error("Weather fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Weather information is currently unavailable.",
        );

        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination]);

  if (loading) {
    return (
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Loading weather information...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">
          Weather
        </h3>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Weather in
          </p>

          <h3 className="mt-1 text-xl font-bold text-gray-900">
            {weather.city}
          </h3>
        </div>

        {weather.icon ? (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="h-16 w-16"
          />
        ) : null}
      </div>

      <div className="mt-4">
        <p className="text-4xl font-bold text-gray-900">
          {weather.temperature}°C
        </p>

        <p className="mt-1 capitalize text-sm text-gray-600">
          {weather.description}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-gray-500">
            Feels like
          </p>

          <p className="mt-1 font-semibold text-gray-900">
            {weather.feelsLike}°C
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Humidity
          </p>

          <p className="mt-1 font-semibold text-gray-900">
            {weather.humidity}%
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Wind
          </p>

          <p className="mt-1 font-semibold text-gray-900">
            {weather.windSpeed} m/s
          </p>
        </div>
      </div>
    </div>
  );
}