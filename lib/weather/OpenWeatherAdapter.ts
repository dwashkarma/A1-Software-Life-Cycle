import {
  WeatherData,
  WeatherProvider,
} from "./WeatherProvider";

type GeocodingResult = {
  name: string;
  lat: number;
  lon: number;
  country: string;
};

type OpenWeatherResponse = {
  name: string;

  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };

  weather: {
    description: string;
    icon: string;
  }[];

  wind: {
    speed: number;
  };
};

export class OpenWeatherAdapter implements WeatherProvider {
  private readonly apiKey: string;

  constructor() {
    const apiKey = process.env.OPENWEATHER_API_KEY;

      console.log(
    "API key loaded:",
    !!process.env.OPENWEATHER_API_KEY
  );

    if (!apiKey) {
      throw new Error("OPENWEATHER_API_KEY is not configured");
    }

    this.apiKey = apiKey;
  }

  async getWeather(destination: string): Promise<WeatherData> {
    const coordinates =
      await this.getCoordinates(destination);

    const weather =
      await this.getOpenWeatherData(
        coordinates.lat,
        coordinates.lon,
      );

    // Adapter converts OpenWeather format
    // into TravelMate's standard WeatherData format.
    return {
      city: weather.name,
      temperature: Math.round(weather.main.temp),
      feelsLike: Math.round(weather.main.feels_like),
      description:
        weather.weather[0]?.description ?? "Unknown",
      humidity: weather.main.humidity,
      windSpeed: weather.wind.speed,
      icon: weather.weather[0]?.icon,
    };
  }

  private async getCoordinates(destination: string) {
    const url =
      `https://api.openweathermap.org/geo/1.0/direct` +
      `?q=${encodeURIComponent(destination)}` +
      `&limit=1` +
      `&appid=${this.apiKey}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

  console.error(
    "OpenWeather geocoding error:",
    response.status,
    errorText
  );

  throw new Error(
    `Failed to retrieve destination coordinates. Status: ${response.status}`,
  );
    }

    const data: GeocodingResult[] =
      await response.json();

    if (data.length === 0) {
      throw new Error("Destination not found");
    }

    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  }

  private async getOpenWeatherData(
    latitude: number,
    longitude: number,
  ): Promise<OpenWeatherResponse> {
    const url =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${latitude}` +
      `&lon=${longitude}` +
      `&units=metric` +
      `&appid=${this.apiKey}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        "Failed to retrieve weather information",
      );
    }

    return response.json();
  }
}