/**
 * TravelMate weather functional tests (TC-01 to TC-06).
 * Tests the real WeatherCard React component with mocked responses from
 * TravelMate's /api/weather endpoint. No live API key or server is required.
 *
 * Install:
 * npm install --save-dev mocha chai sinon tsx jsdom \
 *   @types/mocha @types/chai @types/sinon @types/jsdom
 *
 * Run from project root:
 * node --import tsx ./node_modules/mocha/bin/mocha.js tests/weather.test.ts
 */
import { before, beforeEach, afterEach, describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';

// Create a browser-like environment BEFORE importing the React UI.
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost:3000',
});
Object.defineProperty(globalThis, "navigator", {
  configurable: true, value: dom.window.navigator,
});
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  Node: dom.window.Node,
  MutationObserver: dom.window.MutationObserver,
  IS_REACT_ACT_ENVIRONMENT: true,
});

type Weather = {
  city: string;
  temperature: number;
  feelsLike?: number;
  description: string;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
};

const brisbane: Weather = {
  city: 'Brisbane', temperature: 28, description: 'clear sky',
  feelsLike: 30, humidity: 65, windSpeed: 4.2, icon: '01d',
};
const sydney: Weather = {
  city: 'Sydney', temperature: 19, description: 'light rain',
  feelsLike: 18, humidity: 82, windSpeed: 6.1, icon: '10d',
};

function apiResponse(
  payload: unknown,
  status = 200,
): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  } as Response;
}

function success(weather: Weather): Response {
  return apiResponse({ success: true, weather });
}

const friendlyError =
  'Weather information is currently unavailable. Please try again later.';

describe('TravelMate – Weather Information Integration (Functional Tests)', function () {
  let root: import('react-dom/client').Root;
  let container: HTMLDivElement;
  let fetchStub: sinon.SinonStub;
  let WeatherCard: typeof import('../../components/weather-card').default;
  let React: typeof import('react');
  let act: typeof import('react').act;

  before(async () => {
    React = await import('react');
    act = React.act;
    WeatherCard = (await import('../../components/weather-card')).default;
  });

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const client = await import('react-dom/client');
    root = client.createRoot(container);
    fetchStub = sinon.stub(globalThis, 'fetch');
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    sinon.restore();
  });

  async function renderDestination(destination: string) {
    await act(async () => {
      root.render(React.createElement(WeatherCard, { destination }));
    });
  }

  it('TC-01 POSITIVE: displays Brisbane temperature, condition, humidity, wind and feels-like', async () => {
    fetchStub.resolves(success(brisbane));
    await renderDestination('Brisbane');

    const display = container.textContent ?? '';
    expect(fetchStub.calledOnce).to.equal(true);
    expect(String(fetchStub.firstCall.args[0])).to.include('destination=Brisbane');
    expect(display).to.include('Brisbane');
    expect(display).to.include('28°C');
    expect(display).to.include('clear sky');
    expect(display).to.include('30°C');
    expect(display).to.include('65%');
    expect(display).to.include('4.2 m/s');
  });

  it('TC-02 POSITIVE: updates the displayed weather when destination changes to Sydney', async () => {
    fetchStub.onFirstCall().resolves(success(brisbane));
    fetchStub.onSecondCall().resolves(success(sydney));

    await renderDestination('Brisbane');
    expect(container.textContent).to.include('Brisbane');
    await renderDestination('Sydney');

    const display = container.textContent ?? '';
    expect(fetchStub.calledTwice).to.equal(true);
    expect(String(fetchStub.secondCall.args[0])).to.include('destination=Sydney');
    expect(display).to.include('Sydney');
    expect(display).to.include('19°C');
    expect(display).to.include('light rain');
    expect(display).not.to.include('Brisbane');
  });

  it('TC-03 NEGATIVE: displays a friendly message for an invalid destination', async () => {
    // The existing API route responds with a generic 503 error for a bad city.
    fetchStub.resolves(apiResponse({ success: false, message: friendlyError }, 503));
    await renderDestination('Abcd');

    expect(fetchStub.calledOnce).to.equal(true);
    expect(String(fetchStub.firstCall.args[0])).to.include('destination=Abcd');
    expect(container.textContent).to.include(friendlyError);
    expect(container.textContent).not.to.include('undefined');
  });

  it('TC-04 NEGATIVE: handles lost internet connection without crashing', async () => {
    fetchStub.rejects(new TypeError('Failed to fetch'));
    await renderDestination('Brisbane');

    expect(container.textContent).to.include('Weather');
    expect(container.textContent).to.include('Failed to fetch');
    expect(container.textContent).not.to.include('28°C');
  });

  it('TC-05 NEGATIVE: handles unavailable additional weather fields without invalid text', async () => {
    // Deliberately omit humidity, windSpeed and feelsLike.
    // The test exposes an existing defect if UI renders "undefined".
    fetchStub.resolves(success({
      city: 'Brisbane', temperature: 28, description: 'clear sky',
    }));
    await renderDestination('Brisbane');

    const display = container.textContent ?? '';
    expect(display).to.include('Brisbane');
    expect(display).to.include('28°C');
    expect(display).not.to.include('undefined');
    expect(display).not.to.include('NaN');
    expect(display).not.to.include('null');
  });

  it('TC-06 NEGATIVE: displays a friendly message when weather information is unavailable', async () => {
    fetchStub.resolves(apiResponse({ success: false, message: friendlyError }, 503));
    await renderDestination('Brisbane');

    const display = container.textContent ?? '';
    expect(display).to.include(friendlyError);
    expect(display).not.to.include('undefined');
    expect(display).not.to.include('28°C');
  });
});
