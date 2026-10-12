
import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import fc from "fast-check";

import { WeatherService } from "../../lib/weather/WeatherService";
import type { WeatherData, WeatherProvider } from "../../lib/weather/WeatherProvider";

const mockWeather: WeatherData = {
  city: "Brisbane",
  temperature: 28,
  feelsLike: 30,
  description: "clear sky",
  humidity: 65,
  windSpeed: 4.2,
  icon: "01d",
};

function createWeatherService() {
  const getWeatherStub = sinon.stub().resolves(mockWeather);
  const service = new WeatherService({
    getWeather: getWeatherStub,
  } as WeatherProvider);
  return { service, getWeatherStub };
}

describe("TravelMate Weather Integration - Fuzz Testing", function () {
  this.timeout(20000);

  it("TC-07: rejects empty and whitespace-only destinations without calling the provider", async () => {
    const whitespaceDestination = fc
      .array(fc.constantFrom(" ", "\t", "\n", "\r"), { minLength: 0, maxLength: 200 })
      .map((characters) => characters.join(""));

    await fc.assert(
      fc.asyncProperty(whitespaceDestination, async (destination) => {
        const { service, getWeatherStub } = createWeatherService();
        let caughtError: unknown;

        try {
          await service.getWeather(destination);
        } catch (error) {
          caughtError = error;
        }

        expect(caughtError).to.be.instanceOf(Error);
        expect((caughtError as Error).message).to.equal("Destination is required");
        expect(getWeatherStub.notCalled).to.equal(true);
      }),
      { numRuns: 100 }
    );
  });

  it("TC-08: preserves Unicode characters and handles unexpected symbols", async () => {
    const unicodeOrSymbol = fc.constantFrom(
      "കൊച്ചി", "東京", "北京", "Zürich", "São Paulo", "München",
      "دبي", "Αθήνα", "🗺️", "@#$%!", "🌏Sydney🌏"
    );

    await fc.assert(
      fc.asyncProperty(
        fc.array(unicodeOrSymbol, { minLength: 1, maxLength: 20 }),
        async (pieces) => {
          const destination = pieces.join("");
          const { service, getWeatherStub } = createWeatherService();
          const result = await service.getWeather(destination);

          expect(result).to.deep.equal(mockWeather);
          expect(getWeatherStub.calledOnceWithExactly(destination.trim())).to.equal(true);
        }
      ),
      { numRuns: 100 }
    );
  });


  it("TC-09: handles destinations containing hundreds or thousands of characters", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 100, max: 5000 }),
        fc.constantFrom("A", "é", "中", "7", "#"),
        async (length, character) => {
          const destination = character.repeat(length);
          const { service, getWeatherStub } = createWeatherService();
          const result = await service.getWeather(destination);

          expect(result).to.deep.equal(mockWeather);
          expect(getWeatherStub.calledOnceWithExactly(destination)).to.equal(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("TC-10: trims randomly generated leading and trailing whitespace", async () => {
    const padding = fc
      .array(fc.constantFrom(" ", "\t", "\n", "\r"), { minLength: 1, maxLength: 60 })
      .map((characters) => characters.join(""));
    const coreName = fc.constantFrom("Brisbane", "Sydney", "Kochi", "東京", "São Paulo");

    await fc.assert(
      fc.asyncProperty(padding, coreName, padding, async (before, city, after) => {
        const { service, getWeatherStub } = createWeatherService();
        const result = await service.getWeather(before + city + after);

        expect(result).to.deep.equal(mockWeather);
        expect(getWeatherStub.calledOnceWithExactly(city)).to.equal(true);
      }),
      { numRuns: 100 }
    );
  });
});
