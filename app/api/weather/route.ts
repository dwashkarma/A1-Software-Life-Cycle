import { NextRequest, NextResponse } from "next/server";

import { WeatherService } from "@/lib/weather/WeatherService";
import { OpenWeatherAdapter } from "@/lib/weather/OpenWeatherAdapter";

export async function GET(request: NextRequest) {
  try {
    const destination =
      request.nextUrl.searchParams.get("destination");

    if (!destination) {
      return NextResponse.json(
        {
          success: false,
          message: "Destination is required",
        },
        {
          status: 400,
        },
      );
    }

    const weatherProvider =
      new OpenWeatherAdapter();

    const weatherService =
      new WeatherService(weatherProvider);

    const weather =
      await weatherService.getWeather(destination);

    return NextResponse.json({
      success: true,
      weather,
    });
  } catch (error) {
    console.error("Weather error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Weather information is currently unavailable. Please try again later.",
      },
      {
        status: 503,
      },
    );
  }
}