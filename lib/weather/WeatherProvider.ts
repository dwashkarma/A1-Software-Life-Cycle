export type WeatherData = {
  city: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon?: string;
};

export interface WeatherProvider {
  getWeather(destination: string): Promise<WeatherData>;
}