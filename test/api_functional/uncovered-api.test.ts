import { expect } from "chai";
import { afterEach, describe, it } from "mocha";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import sinon from "sinon";

process.env.MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/travelmate-test";
process.env.OPENWEATHER_API_KEY = "test-only-key";

mongoose.connect = (async () => mongoose) as typeof mongoose.connect;

import Attraction from "../../models/Attraction";
import Destination from "../../models/Destinations";
import Itinerary from "../../models/Itinearary";
import User from "../../models/User";
import { encodeSession, SESSION_COOKIE } from "../../lib/auth";
import * as attractionRoutes from "../../app/api/attractions/route";
import * as attractionByIdRoutes from "../../app/api/attractions/[id]/route";
import * as destinationRoutes from "../../app/api/destinations/route";
import * as destinationByIdRoutes from "../../app/api/destinations/[id]/route";
import * as destinationStatusRoutes from "../../app/api/destinations/[id]/status/route";
import * as itineraryRoutes from "../../app/api/itineraries/route";
import * as itineraryByIdRoutes from "../../app/api/itineraries/[id]/route";
import * as itineraryAttractionRoutes from "../../app/api/itineraries/[id]/attractions/route";
import * as authSignupRoutes from "../../app/api/auth/signup/route";
import * as authLoginRoutes from "../../app/api/auth/login/route";
import * as authLogoutRoutes from "../../app/api/auth/logout/route";
import * as authMeRoutes from "../../app/api/auth/me/route";
import * as weatherRoutes from "../../app/api/weather/route";
import * as testDbRoutes from "../../app/api/test-db/route";
import { WeatherService } from "../../lib/weather/WeatherService";

const ADMIN_ID = "000000000000000000000001";
const USER_ID = "000000000000000000000002";
const DESTINATION_ID = "000000000000000000000003";
const ATTRACTION_ID = "000000000000000000000004";
const ITINERARY_ID = "000000000000000000000005";

function request(
  method: string,
  url: string,
  options: {
    role?: "admin" | "traveller";
    body?: unknown;
  } = {},
): NextRequest {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (options.role) {
    headers.set(
      "Cookie",
      `${SESSION_COOKIE}=${encodeSession({
        id: options.role === "admin" ? ADMIN_ID : USER_ID,
        role: options.role,
      })}`,
    );
  }

  return new NextRequest(url, {
    method,
    headers,
    ...(options.body === undefined
      ? {}
      : {
          body:
            typeof options.body === "string"
              ? options.body
              : JSON.stringify(options.body),
        }),
  });
}

function context(id: string) {
  return { params: Promise.resolve({ id }) };
}

function queryResult<T>(value: T) {
  const query = {
    populate: () => query,
    sort: () => Promise.resolve(value),
  };
  return query;
}

afterEach(() => {
  sinon.restore();
});

describe("Uncovered API functional tests", () => {
  describe("Attraction catalogue APIs", () => {
    it("GET /api/attractions returns the attraction list", async () => {
      const attractions = [{ _id: ATTRACTION_ID, name: "South Bank" }];
      sinon.stub(Attraction, "find").returns(queryResult(attractions) as never);

      const response = await attractionRoutes.GET();

      expect(response.status).to.equal(200);
      expect(await response.json()).to.deep.equal({ success: true, attractions });
    });

    it("POST /api/attractions creates an attraction for an admin", async () => {
      const created = { _id: ATTRACTION_ID, name: "South Bank" };
      const create = sinon.stub(Attraction, "create").resolves(created as never);

      const response = await attractionRoutes.POST(
        request("POST", "http://localhost/api/attractions", {
          role: "admin",
          body: {
            name: "South Bank",
            destination: DESTINATION_ID,
            category: "Park",
            location: "Brisbane",
            description: "A riverside park",
          },
        }),
      );

      expect(response.status).to.equal(201);
      expect((await response.json()).attraction).to.deep.equal(created);
      expect(create.calledOnce).to.equal(true);
    });

    it("POST /api/attractions rejects non-admins", async () => {
      const response = await attractionRoutes.POST(
        request("POST", "http://localhost/api/attractions", {
          role: "traveller",
          body: {},
        }),
      );

      expect(response.status).to.equal(401);
      expect((await response.json()).message).to.equal("Admin access required");
    });

    it("GET /api/attractions/[id] returns the selected attraction", async () => {
      const attraction = { _id: ATTRACTION_ID, name: "South Bank" };
      sinon
        .stub(Attraction, "findById")
        .returns({ populate: () => Promise.resolve(attraction) } as never);

      const response = await attractionByIdRoutes.GET(
        request("GET", `http://localhost/api/attractions/${ATTRACTION_ID}`),
        context(ATTRACTION_ID),
      );

      expect(response.status).to.equal(200);
      expect((await response.json()).attraction).to.deep.equal(attraction);
    });

    it("PUT /api/attractions/[id] updates an attraction for an admin", async () => {
      const attraction = {
        name: "Old name",
        save: sinon.stub().resolves(),
      };
      sinon.stub(Attraction, "findById").resolves(attraction as never);

      const response = await attractionByIdRoutes.PUT(
        request("PUT", `http://localhost/api/attractions/${ATTRACTION_ID}`, {
          role: "admin",
          body: { name: "New name" },
        }),
        context(ATTRACTION_ID),
      );

      expect(response.status).to.equal(200);
      expect(attraction.name).to.equal("New name");
      expect(attraction.save.calledOnce).to.equal(true);
    });

    it("DELETE /api/attractions/[id] deletes an attraction for an admin", async () => {
      sinon
        .stub(Attraction, "findByIdAndDelete")
        .resolves({ _id: ATTRACTION_ID } as never);

      const response = await attractionByIdRoutes.DELETE(
        request("DELETE", `http://localhost/api/attractions/${ATTRACTION_ID}`, {
          role: "admin",
        }),
        context(ATTRACTION_ID),
      );

      expect(response.status).to.equal(200);
      expect((await response.json()).message).to.equal("Attraction deleted");
    });
  });

  describe("Destination administration APIs", () => {
    it("GET /api/destinations returns destinations", async () => {
      const destinations = [{ _id: DESTINATION_ID, name: "Brisbane" }];
      sinon
        .stub(Destination, "find")
        .returns(queryResult(destinations) as never);

      const response = await destinationRoutes.GET();

      expect(response.status).to.equal(200);
      expect(await response.json()).to.deep.equal(destinations);
    });

    it("POST /api/destinations validates and creates a destination", async () => {
      const created = { _id: DESTINATION_ID, name: "Brisbane" };
      const create = sinon.stub(Destination, "create").resolves(created as never);

      const response = await destinationRoutes.POST(
        request("POST", "http://localhost/api/destinations", {
          role: "admin",
          body: {
            name: " Brisbane ",
            state: " Queensland ",
            description: "River city",
          },
        }),
      );

      expect(response.status).to.equal(201);
      expect(create.firstCall.args[0]).to.deep.equal({
        name: "Brisbane",
        state: "Queensland",
        description: "River city",
        image: "",
      });
    });

    it("POST /api/destinations rejects missing required fields", async () => {
      const response = await destinationRoutes.POST(
        request("POST", "http://localhost/api/destinations", {
          role: "admin",
          body: { name: "Brisbane" },
        }),
      );

      expect(response.status).to.equal(400);
      expect((await response.json()).error).to.equal(
        "Name, state, and description are required",
      );
    });

    it("PATCH /api/destinations/[id]/status publishes a draft", async () => {
      const destination = {
        status: "DRAFT",
        save: sinon.stub().resolves(),
      };
      sinon.stub(Destination, "findById").resolves(destination as never);

      const response = await destinationStatusRoutes.PATCH(
        request("PATCH", `http://localhost/api/destinations/${DESTINATION_ID}/status`, {
          role: "admin",
          body: { status: "PUBLISHED" },
        }),
        context(DESTINATION_ID),
      );

      expect(response.status).to.equal(200);
      expect(destination.status).to.equal("PUBLISHED");
      expect(destination.save.calledOnce).to.equal(true);
    });

    it("DELETE /api/destinations/[id]/status deletes a destination", async () => {
      sinon
        .stub(Destination, "findByIdAndDelete")
        .resolves({ _id: DESTINATION_ID } as never);

      const response = await destinationStatusRoutes.DELETE(
        request("DELETE", `http://localhost/api/destinations/${DESTINATION_ID}/status`, {
          role: "admin",
        }),
        context(DESTINATION_ID),
      );

      expect(response.status).to.equal(200);
      expect((await response.json()).message).to.equal(
        "Destination deleted successfully",
      );
    });

    it("DELETE /api/destinations/[id] blocks deleting a destination with attractions", async () => {
      sinon.stub(Destination, "findById").resolves({ deleteOne: sinon.stub() } as never);
      sinon.stub(Attraction, "exists").resolves(true as never);

      const response = await destinationByIdRoutes.DELETE(
        request("DELETE", `http://localhost/api/destinations/${DESTINATION_ID}`, {
          role: "admin",
        }),
        context(DESTINATION_ID),
      );

      expect(response.status).to.equal(409);
      expect((await response.json()).error).to.equal(
        "Remove this destination's attractions before deleting it",
      );
    });
  });

  describe("Itinerary APIs", () => {
    it("GET /api/itineraries returns the signed-in user's itineraries", async () => {
      const itineraries = [{ _id: ITINERARY_ID, name: "Weekend" }];
      const find = sinon
        .stub(Itinerary, "find")
        .returns(queryResult(itineraries) as never);

      const response = await itineraryRoutes.GET(
        request("GET", "http://localhost/api/itineraries", {
          role: "traveller",
        }),
      );

      expect(response.status).to.equal(200);
      expect((await response.json()).itineraries).to.deep.equal(itineraries);
      expect(find.firstCall.args[0]).to.deep.equal({ user: USER_ID });
    });

    it("POST /api/itineraries rejects an end date before the start date", async () => {
      const response = await itineraryRoutes.POST(
        request("POST", "http://localhost/api/itineraries", {
          role: "traveller",
          body: {
            name: "Weekend",
            destination: DESTINATION_ID,
            startDate: "2026-10-20",
            endDate: "2026-10-19",
          },
        }),
      );

      expect(response.status).to.equal(400);
      expect((await response.json()).message).to.equal(
        "endDate must be greater than or equal to startDate",
      );
    });

    it("POST /api/itineraries creates an itinerary for the session user", async () => {
      const created = { _id: ITINERARY_ID, name: "Weekend" };
      const create = sinon.stub(Itinerary, "create").resolves(created as never);

      const response = await itineraryRoutes.POST(
        request("POST", "http://localhost/api/itineraries", {
          role: "traveller",
          body: {
            name: "Weekend",
            destination: DESTINATION_ID,
            startDate: "2026-10-19",
            endDate: "2026-10-20",
            attractions: [ATTRACTION_ID, "bad-id"],
          },
        }),
      );

      expect(response.status).to.equal(201);
      expect(create.firstCall.args[0]).to.deep.equal({
        user: USER_ID,
        name: "Weekend",
        destination: DESTINATION_ID,
        startDate: "2026-10-19",
        endDate: "2026-10-20",
        attractions: [ATTRACTION_ID],
      });
    });

    it("GET /api/itineraries/[id] only returns an itinerary owned by the user", async () => {
      const itinerary = { _id: ITINERARY_ID, name: "Weekend" };
      const findOne = sinon
        .stub(Itinerary, "findOne")
        .returns({
          populate: () => ({
            populate: () => Promise.resolve(itinerary),
          }),
        } as never);

      const response = await itineraryByIdRoutes.GET(
        request("GET", `http://localhost/api/itineraries/${ITINERARY_ID}`, {
          role: "traveller",
        }),
        context(ITINERARY_ID),
      );

      expect(response.status).to.equal(200);
      expect(findOne.firstCall.args[0]).to.deep.equal({
        _id: ITINERARY_ID,
        user: USER_ID,
      });
      expect((await response.json()).itinerary).to.deep.equal(itinerary);
    });

    it("PUT /api/itineraries/[id] updates the owned itinerary", async () => {
      const itinerary = {
        name: "Old",
        startDate: "2026-10-19",
        endDate: "2026-10-20",
        save: sinon.stub().resolves(),
      };
      sinon.stub(Itinerary, "findOne").resolves(itinerary as never);

      const response = await itineraryByIdRoutes.PUT(
        request("PUT", `http://localhost/api/itineraries/${ITINERARY_ID}`, {
          role: "traveller",
          body: { name: "Updated" },
        }),
        context(ITINERARY_ID),
      );

      expect(response.status).to.equal(200);
      expect(itinerary.name).to.equal("Updated");
      expect(itinerary.save.calledOnce).to.equal(true);
    });

    it("DELETE /api/itineraries/[id] deletes only the signed-in user's itinerary", async () => {
      const findOneAndDelete = sinon
        .stub(Itinerary, "findOneAndDelete")
        .resolves({ _id: ITINERARY_ID } as never);

      const response = await itineraryByIdRoutes.DELETE(
        request("DELETE", `http://localhost/api/itineraries/${ITINERARY_ID}`, {
          role: "traveller",
        }),
        context(ITINERARY_ID),
      );

      expect(response.status).to.equal(200);
      expect(findOneAndDelete.firstCall.args[0]).to.deep.equal({
        _id: ITINERARY_ID,
        user: USER_ID,
      });
    });

    it("POST /api/itineraries/[id]/attractions adds an attraction", async () => {
      const itinerary = {
        attractions: [],
        save: sinon.stub().resolves(),
      };
      sinon.stub(Itinerary, "findOne").resolves(itinerary as never);

      const response = await itineraryAttractionRoutes.POST(
        request(
          "POST",
          `http://localhost/api/itineraries/${ITINERARY_ID}/attractions`,
          { role: "traveller", body: { attractionId: ATTRACTION_ID } },
        ),
        context(ITINERARY_ID),
      );

      expect(response.status).to.equal(200);
      expect(itinerary.attractions.map((id: { toString(): string }) => id.toString()))
        .to.deep.equal([ATTRACTION_ID]);
      expect(itinerary.save.calledOnce).to.equal(true);
    });

    it("DELETE /api/itineraries/[id]/attractions removes an attraction", async () => {
      const itinerary = {
        attractions: [new mongoose.Types.ObjectId(ATTRACTION_ID)],
        save: sinon.stub().resolves(),
      };
      sinon.stub(Itinerary, "findOne").resolves(itinerary as never);

      const response = await itineraryAttractionRoutes.DELETE(
        request(
          "DELETE",
          `http://localhost/api/itineraries/${ITINERARY_ID}/attractions`,
          { role: "traveller", body: { attractionId: ATTRACTION_ID } },
        ),
        context(ITINERARY_ID),
      );

      expect(response.status).to.equal(200);
      expect(itinerary.attractions).to.have.length(0);
      expect(itinerary.save.calledOnce).to.equal(true);
    });
  });

  describe("Authentication APIs", () => {
    it("POST /api/auth/signup creates a user with a hashed password", async () => {
      sinon.stub(User, "findOne").resolves(null);
      sinon.stub(bcrypt, "hash").resolves("hashed-password");
      const create = sinon.stub(User, "create").resolves({
        _id: USER_ID,
        name: "Traveller",
        email: "traveller@example.com",
        role: "traveller",
      } as never);

      const response = await authSignupRoutes.POST(
        request("POST", "http://localhost/api/auth/signup", {
          body: {
            name: "Traveller",
            email: "TRAVELLER@example.com",
            password: "password123",
          },
        }),
      );

      expect(response.status).to.equal(201);
      expect(create.firstCall.args[0]).to.deep.equal({
        name: "Traveller",
        email: "traveller@example.com",
        password: "hashed-password",
        role: "traveller",
      });
    });

    it("POST /api/auth/login returns user details and sets a session cookie", async () => {
      sinon.stub(User, "findOne").resolves({
        _id: USER_ID,
        name: "Traveller",
        email: "traveller@example.com",
        password: "hashed-password",
        role: "traveller",
      } as never);
      sinon.stub(bcrypt, "compare").resolves(true);

      const response = await authLoginRoutes.POST(
        request("POST", "http://localhost/api/auth/login", {
          body: { email: "traveller@example.com", password: "password123" },
        }),
      );

      expect(response.status).to.equal(200);
      expect((await response.json()).user.id).to.equal(USER_ID);
      expect(response.headers.get("set-cookie")).to.include(SESSION_COOKIE);
      expect(response.headers.get("set-cookie")).not.to.include("Secure");
    });

    it("POST /api/auth/login does not mark session cookies secure over HTTP in production", async () => {
      sinon.stub(User, "findOne").resolves({
        _id: USER_ID,
        name: "Traveller",
        email: "traveller@example.com",
        password: "hashed-password",
        role: "traveller",
      } as never);
      sinon.stub(bcrypt, "compare").resolves(true);
      sinon.stub(process, "env").value({
        ...process.env,
        NODE_ENV: "production",
      });

      const response = await authLoginRoutes.POST(
        request("POST", "http://localhost/api/auth/login", {
          body: { email: "traveller@example.com", password: "password123" },
        }),
      );

      expect(response.status).to.equal(200);
      expect(response.headers.get("set-cookie")).not.to.include("Secure");
    });

    it("POST /api/auth/logout clears the session cookie", async () => {
      const response = await authLogoutRoutes.POST();

      expect(response.status).to.equal(200);
      expect(response.headers.get("set-cookie")).to.include("Max-Age=0");
    });

    it("GET /api/auth/me returns the authenticated session", async () => {
      const response = await authMeRoutes.GET(
        request("GET", "http://localhost/api/auth/me", { role: "traveller" }),
      );

      expect(response.status).to.equal(200);
      expect(await response.json()).to.deep.equal({
        authenticated: true,
        user: { id: USER_ID, role: "traveller" },
      });
    });
  });

  describe("Weather and database diagnostic APIs", () => {
    it("GET /api/weather rejects a missing destination", async () => {
      const response = await weatherRoutes.GET(
        request("GET", "http://localhost/api/weather"),
      );

      expect(response.status).to.equal(400);
      expect((await response.json()).message).to.equal("Destination is required");
    });

    it("GET /api/weather returns provider weather data", async () => {
      const weather = { city: "Brisbane", temperature: 28 };
      const getWeather = sinon
        .stub(WeatherService.prototype, "getWeather")
        .resolves(weather as never);

      const response = await weatherRoutes.GET(
        request(
          "GET",
          "http://localhost/api/weather?destination=Brisbane",
        ),
      );

      expect(response.status).to.equal(200);
      expect((await response.json()).weather).to.deep.equal(weather);
      expect(getWeather.calledOnceWithExactly("Brisbane")).to.equal(true);
    });

    it("GET /api/test-db reports a successful database connection", async () => {
      const response = await testDbRoutes.GET();

      expect(response.status).to.equal(200);
      expect((await response.json()).success).to.equal(true);
    });
  });
});
