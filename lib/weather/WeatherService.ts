import {
  WeatherData,
  WeatherProvider,
} from "./WeatherProvider";

export class WeatherService {
  constructor(
    private readonly weatherProvider: WeatherProvider,
  ) {}

  async getWeather(
    destination: string,
  ): Promise<WeatherData> {
    if (!destination || destination.trim() === "") {
      throw new Error("Destination is required");
    }

    return this.weatherProvider.getWeather(
      destination.trim(),
    );
  }
}