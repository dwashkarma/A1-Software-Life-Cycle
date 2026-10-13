/**
 * Functional tests - Story 3.2: Save travel preferences
 *
 * The controller-level code is called directly, and the database is replaced, so the tests check behaviour (status codes, messages, what is written) without MongoDB.
 */
import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

// Set this before loading application modules: lib/moongodb.ts validates it at import time.
// Tests mock database operations and do not require a running MongoDB server.
process.env.MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/travelmate-test";

// Load application modules after setting MONGODB_URI to avoid import-time failure.
const Attraction = require("../../models/Attraction").default;
const Destination = require("../../models/Destinations").default;
const UserPreference = require("../../models/UserPreference").default;
const { encodeSession, SESSION_COOKIE } = require("../../lib/auth");

const REQ = {
    RECOMMEND: "Rank attractions by match (Story 3.1)",
    STORE: "Store travel preferences (Story 3.2)",
    DISPLAY: "Show recommendations (Story 3.4)",
    SECURITY: "Security - own data only",
    VALIDATION: "Input validation",
    RELIABILITY: "Reliability",
};

/** Create a valid 24-character ObjectId string from a number. */
const oid = (n: number): string => n.toString(16).padStart(24, "0");
const USER_A = oid(0xa1);
const USER_B = oid(0xa2);

/** Cookie header for a logged-in traveller. */
const asUser = (id: string = USER_A): string =>
    `${SESSION_COOKIE}=${encodeSession({ id, role: "traveller" })}`;

/** Cookie whose user id is not a valid ObjectId. */
const forgedSession = (): string =>
    `${SESSION_COOKIE}=${encodeSession({ id: "not-an-object-id", role: "traveller" })}`;

interface RequestOptions {
    cookie?: string;
    body?: unknown;
    url?: string;
}

/** Build a real NextRequest, as received by the route handlers. */
const request = (
    method: "GET" | "PUT" | "POST",
    { cookie, body, url = "http://localhost/api/test" }: RequestOptions = {},
): NextRequest =>
    new NextRequest(url, {
        method,
        headers: {
        "content-type": "application/json",
        ...(cookie ? { cookie } : {}),
        },
        body:
        body === undefined
            ? undefined
            : typeof body === "string"
            ? body
            : JSON.stringify(body),
    });

/** Mimic Model.find(...).lean() and Model.findOne(...).lean(). */
const lean = (value: unknown) => ({ lean: () => Promise.resolve(value) });

/** Mimic Model.find(...).select(...).lean(). */
const selectLean = (value: unknown) => ({ select: () => lean(value) });

// // Keep the database connection mocked and restore all Sinon stubs after each test.
beforeEach(function () {
    // sinon.stub(mongoose, "connect").resolves(mongoose);

    const originalLog = console.log;
    sinon.stub(console, "log").callsFake((...args: unknown[]) => {
        if (args[0] !== "MongoDB connected") {
            originalLog(...args);
        }
    });
});

// Prevent connectDB() from opening a real MongoDB connection.
mongoose.connect = (async () => mongoose) as typeof mongoose.connect;

// Load the routes after replacing mongoose.connect.
const { GET, PUT } = require("../../app/api/preferences/route");
const { GET: GET_CATEGORIES } =
    require("../../app/api/attractions/categories/route");

afterEach(function () {
    sinon.restore();
});

const SYDNEY = oid(0xd001);
const MELBOURNE = oid(0xd002);

/** Stubs every database call that PUT /api/preferences makes. */
function stubDatabaseForSave() {
    return {
        // By default every destination id exists and is published.
        countDocuments: sinon
        .stub(Destination, "countDocuments")
        .callsFake(((query: { _id: { $in: string[] } }) =>
            Promise.resolve(query._id.$in.length)) as never),
        distinct: sinon
        .stub(Attraction, "distinct")
        .resolves(["Beach", "Park", "Landmark"] as never),
        save: sinon
        .stub(UserPreference, "findOneAndUpdate")
        .resolves({ _id: oid(1), completed: true } as never),
    };
}

// cookie = null means "no session" (undefined would fall back to the default logged-in user).
const put = (body: unknown, cookie: string | null = asUser()) =>
    PUT(request("PUT", { cookie: cookie ?? undefined, body, url: "http://localhost/api/preferences" }));

describe(`${REQ.STORE} | PUT /api/preferences`, () => {
    it("TC-REC-04: saves a valid preference for the logged-in user (200)", async () => {
        const db = stubDatabaseForSave();

        const res = await put({ destinations: [SYDNEY, MELBOURNE], categories: ["Beach"] });
        const json = await res.json();

        expect(res.status).to.equal(200);
        expect(json.success).to.equal(true);
        expect(json.message).to.equal("Preferences saved");

        expect(db.save.calledOnce).to.equal(true);
        const [filter, update, options] = db.save.firstCall.args as unknown as [
        unknown,
        unknown,
        unknown,
        ];
        expect(filter).to.deep.equal({ user: USER_A }); // linked to the logged-in user
        expect(update).to.deep.equal({
        destinations: [SYDNEY, MELBOURNE],
        categories: ["Beach"],
        completed: true,
        });
        expect(options).to.deep.include({ upsert: true, returnDocument: "after" });
    });

    it("TC-REC-04: saving again replaces the previous preference (one record per user)", async () => {
        const db = stubDatabaseForSave();

        await put({ destinations: [SYDNEY], categories: [] });
        await put({ destinations: [], categories: ["Park"] });

        expect(db.save.callCount).to.equal(2);
        const [firstFilter] = db.save.firstCall.args as unknown as [unknown];
        const [secondFilter, secondUpdate] = db.save.secondCall.args as unknown as [
        unknown,
        unknown,
        ];
        expect(firstFilter).to.deep.equal({ user: USER_A });
        expect(secondFilter).to.deep.equal({ user: USER_A }); // same user key, upsert replaces it
        expect(secondUpdate).to.deep.equal({
        destinations: [],
        categories: ["Park"],
        completed: true,
        });
    });

    it("TC-REC-04: accepts a destination only, or a category only", async () => {
        stubDatabaseForSave();

        expect((await put({ destinations: [SYDNEY] })).status).to.equal(200);
        expect((await put({ categories: ["Beach"] })).status).to.equal(200);
    });

    it("TC-REC-04: removes duplicate and blank values before saving", async () => {
        const db = stubDatabaseForSave();

        await put({ destinations: [SYDNEY, SYDNEY], categories: ["Beach", "Beach", " "] });

        const [, update] = db.save.firstCall.args as unknown as [unknown, unknown];
        expect(update).to.deep.equal({
        destinations: [SYDNEY],
        categories: ["Beach"],
        completed: true,
        });
    });

    it("TC-REC-03 (API): skip marks the setup as completed without storing a choice", async () => {
        const db = stubDatabaseForSave();

        const res = await put({ skip: true });
        const json = await res.json();

        expect(res.status).to.equal(200);
        expect(json.message).to.equal("Preferences skipped");
        const [filter, update] = db.save.firstCall.args as unknown as [unknown, unknown];
        expect(filter).to.deep.equal({ user: USER_A });
        expect(update).to.deep.equal({ completed: true }); // no destinations, no categories
        expect(db.countDocuments.called).to.equal(false);
    });
});

describe(`${REQ.VALIDATION} | PUT /api/preferences (invalid input is rejected)`, () => {
    it("TC-REC-05: rejects an empty preference with 400 and does not save", async () => {
        const db = stubDatabaseForSave();

        for (const body of [{}, { destinations: [], categories: [] }, { categories: [" "] }]) {
        const res = await put(body);
        const json = await res.json();
        expect(res.status, JSON.stringify(body)).to.equal(400);
        expect(json.success).to.equal(false);
        expect(json.message).to.equal("Select at least one destination or category");
        }
        expect(db.save.called).to.equal(false);
    });

    it("TC-REC-06: rejects a malformed destination id with 400 and does not save", async () => {
        const db = stubDatabaseForSave();

        for (const destinations of [["not-an-id"], [12345], ["abc", SYDNEY]]) {
        const res = await put({ destinations });
        expect(res.status).to.equal(400);
        expect((await res.json()).message).to.equal("Invalid destination id");
        }
        expect(db.save.called).to.equal(false);
    });

    it("TC-REC-06: rejects categories that are not a list of text values", async () => {
        const db = stubDatabaseForSave();

        for (const categories of ["Beach", [5], [{ name: "Beach" }]]) {
        const res = await put({ destinations: [SYDNEY], categories });
        expect(res.status).to.equal(400);
        expect((await res.json()).message).to.equal("Invalid category");
        }
        expect(db.save.called).to.equal(false);
    });

    it("TC-REC-06: rejects an unknown category with 400 and names it", async () => {
        const db = stubDatabaseForSave();

        const res = await put({ categories: ["Beach", "Wildlife"] });
        const json = await res.json();

        expect(res.status).to.equal(400);
        expect(json.message).to.equal("Unknown category: Wildlife");
        expect(db.save.called).to.equal(false);
    });

    it("TC-REC-06: rejects a destination that does not exist or is not published", async () => {
        const db = stubDatabaseForSave();
        db.countDocuments.resolves(1 as never); // only one of the two ids is a published destination

        const res = await put({ destinations: [SYDNEY, MELBOURNE] });

        expect(res.status).to.equal(400);
        expect((await res.json()).message).to.equal("Destination not found");
        expect(db.save.called).to.equal(false);
    });

    it("TC-REC-13 (API): only published destinations and categories of published attractions are accepted", async () => {
        const db = stubDatabaseForSave();

        await put({ destinations: [SYDNEY], categories: ["Beach"] });

        expect(
            db.countDocuments.calledOnceWith({
                _id: { $in: [SYDNEY] },
            }),
        ).to.equal(true);
        expect(db.distinct.calledOnceWith("category", { status: "PUBLISHED" })).to.equal(true);
    });

    it("TC-REC-06: rejects a request body that is not valid JSON with 400", async () => {
        const db = stubDatabaseForSave();

        const res = await put("{ this is not json");

        expect(res.status).to.equal(400);
        expect((await res.json()).message).to.equal("Invalid request body");
        expect(db.save.called).to.equal(false);
    });
});

describe(`${REQ.SECURITY} | PUT /api/preferences`, () => {
    it("TC-REC-07: returns 401 without a session and never touches the database", async () => {
        const db = stubDatabaseForSave();

        const res = await put({ destinations: [SYDNEY] }, null);

        expect(res.status).to.equal(401);
        expect((await res.json()).message).to.equal("Authentication required");
        expect(db.save.called).to.equal(false);
        expect(db.countDocuments.called).to.equal(false);
    });

    it("TC-REC-07: returns 401 for a forged session whose user id is not valid", async () => {
        const db = stubDatabaseForSave();

        const res = await put({ destinations: [SYDNEY] }, forgedSession());

        expect(res.status).to.equal(401);
        expect(db.save.called).to.equal(false);
    });
});

describe(`${REQ.RELIABILITY} | PUT /api/preferences`, () => {
    it("TC-REC-14 (API): a database failure gives 500 with a clear message and is logged", async () => {
        const db = stubDatabaseForSave();
        db.save.rejects(new Error("DB Error") as never);
        const errorLog = sinon.stub(console, "error");

        const res = await put({ destinations: [SYDNEY] });
        const json = await res.json();

        expect(res.status).to.equal(500);
        expect(json.success).to.equal(false);
        expect(json.message).to.equal("Failed to save preferences");
        expect(errorLog.calledOnce).to.equal(true);
    });
});

describe(`${REQ.STORE} | GET /api/preferences`, () => {
    const request_ = (cookie?: string, url = "http://localhost/api/preferences") =>
        GET(request("GET", { cookie, url }));

    it("TC-REC-04: returns the saved preference of the logged-in user (200)", async () => {
        const saved = { destinations: [SYDNEY], categories: ["Beach"], completed: true };
        const findOne = sinon.stub(UserPreference, "findOne").returns(lean(saved) as never);

        const res = await request_(asUser());
        const json = await res.json();

        expect(res.status).to.equal(200);
        expect(json.preference).to.deep.equal(saved);
        expect(findOne.calledOnceWith({ user: USER_A })).to.equal(true);
    });

    it("TC-REC-04: returns preference null when nothing has been saved yet", async () => {
        sinon.stub(UserPreference, "findOne").returns(lean(null) as never);

        const res = await request_(asUser());

        expect(res.status).to.equal(200);
        expect((await res.json()).preference).to.equal(null);
    });

    it("TC-REC-08: reads only the caller's own preference, even if another user id is sent", async () => {
        const findOne = sinon.stub(UserPreference, "findOne").returns(lean(null) as never);

        await request_(asUser(USER_B), `http://localhost/api/preferences?userId=${USER_A}&user=${USER_A}`);

        expect(findOne.calledOnceWith({ user: USER_B })).to.equal(true);
        expect(findOne.calledWith({ user: USER_A })).to.equal(false);
    });

    it("TC-REC-07: returns 401 without a session and never touches the database", async () => {
        const findOne = sinon.stub(UserPreference, "findOne");

        const res = await request_(undefined);

        expect(res.status).to.equal(401);
        expect(findOne.called).to.equal(false);
    });

    it("TC-REC-14 (API): a database failure gives 500 with a clear message", async () => {
        sinon.stub(UserPreference, "findOne").throws(new Error("DB Error"));
        const errorLog = sinon.stub(console, "error");

        const res = await request_(asUser());

        expect(res.status).to.equal(500);
        expect((await res.json()).message).to.equal("Failed to fetch preferences");
        expect(errorLog.calledOnce).to.equal(true);
    });
});

describe(`${REQ.STORE} | GET /api/attractions/categories`, () => {
    it("TC-REC-01 (API): returns each category once, sorted, without blank values", async () => {
        sinon.stub(Attraction, "distinct").resolves(["Park", "Beach", "", "Landmark"] as never);

        const res = await GET_CATEGORIES();
        const json = await res.json();

        expect(res.status).to.equal(200);
        expect(json.categories).to.deep.equal(["Beach", "Landmark", "Park"]);
    });

    it("TC-REC-13 (API): lists only categories of published attractions", async () => {
        const distinct = sinon.stub(Attraction, "distinct").resolves(["Beach"] as never);

        await GET_CATEGORIES();

        expect(distinct.calledOnceWith("category", { status: "PUBLISHED" })).to.equal(true);
    });

    it("TC-REC-14 (API): a database failure gives 500 with a clear message", async () => {
        sinon.stub(Attraction, "distinct").rejects(new Error("DB Error") as never);
        sinon.stub(console, "error");

        const res = await GET_CATEGORIES();

        expect(res.status).to.equal(500);
        expect((await res.json()).message).to.equal("Failed to fetch categories");
    });
});