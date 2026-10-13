/**
 * Functional tests - Story 3.4: Show recommendations (uses the Story 3.1 engine)
 *
 * GET /api/recommendations is called directly with a real NextRequest and the three database reads (saved preference, published destinations, published attractions) are replaced by Sinon stubs.
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

// Prevent connectDB() from opening a real MongoDB connection.
// Apply this before loading the API route and recommendation service.
mongoose.connect = (async () => mongoose) as typeof mongoose.connect;

// Load the route after replacing mongoose.connect.
const { GET } = require("../../app/api/recommendations/route");

const {
    PUT: PUT_PREFERENCES,
    GET: GET_PREFERENCES,
} = require("../../app/api/preferences/route");


afterEach(function () {
    sinon.restore();
});

// test data 
const SYD = oid(0xd001);
const MEL = oid(0xd002);
const PER = oid(0xd003);
const HOB = oid(0xd004); // published, but has no attractions

const destination = (id: string, name: string) => ({
    _id: id,
    name,
    state: "x",
    description: `About ${name}`,
    image: "/x.webp",
    status: "PUBLISHED",
});

let nextId = 0x1000;
const attraction = (name: string, destinationId: string, category: string) => ({
    _id: oid(nextId++),
    name,
    destination: destinationId,
    category,
    location: "x",
    image: "/x.webp",
});

const DESTINATIONS = [
    destination(SYD, "Sydney"),
    destination(MEL, "Melbourne"),
    destination(PER, "Perth"),
    destination(HOB, "Hobart"),
];

const ATTRACTIONS = [
    attraction("Bondi Beach", SYD, "Beach"),
    attraction("Sydney Opera House", SYD, "Landmark"),
    attraction("Royal Botanic Garden", SYD, "Park"),
    attraction("St Kilda Beach", MEL, "Beach"),
    attraction("Fitzroy Gardens", MEL, "Park"),
    attraction("Cottesloe Beach", PER, "Beach"),
    attraction("Kings Park", PER, "Park"),
    attraction("Fremantle Prison", PER, "Landmark"),
];

interface Arrangement {
    preference: unknown;
    destinations?: unknown[];
    attractions?: unknown[];
}

/** Replaces the three database reads used by getRecommendations. */
function arrange({ preference, destinations = DESTINATIONS, attractions = ATTRACTIONS }: Arrangement) {
    return {
        findPreference: sinon.stub(UserPreference, "findOne").returns(lean(preference) as never),
        findDestinations: sinon.stub(Destination, "find").returns(lean(destinations) as never),
        findAttractions: sinon.stub(Attraction, "find").returns(selectLean(attractions) as never),
    };
}

const saved = (destinations: string[], categories: string[]) => ({
    user: USER_A,
    destinations,
    categories,
    completed: true,
});

const get = (cookie?: string, url = "http://localhost/api/recommendations") =>
    GET(request("GET", { cookie, url }));

const names = (items: { doc: { name: string } }[]) => items.map((item) => item.doc.name);

// tests 
describe(`${REQ.SECURITY} | GET /api/recommendations`, () => {
    it("TC-REC-07: returns 401 without a session and never reads the database", async () => {
        const db = arrange({ preference: null });

        const res = await get(undefined);

        expect(res.status).to.equal(401);
        expect((await res.json()).message).to.equal("Authentication required");
        expect(db.findPreference.called).to.equal(false);
        expect(db.findAttractions.called).to.equal(false);
    });

    it("TC-REC-07: returns 401 for a forged session whose user id is not valid", async () => {
        const db = arrange({ preference: null });

        const res = await get(forgedSession());

        expect(res.status).to.equal(401);
        expect(db.findPreference.called).to.equal(false);
    });

    it("TC-REC-08: uses only the caller's own preference, even if another user id is sent", async () => {
        const db = arrange({ preference: saved([], ["Beach"]) });

        await get(asUser(USER_B), `http://localhost/api/recommendations?userId=${USER_A}&user=${USER_A}`);

        expect(db.findPreference.calledOnceWith({ user: USER_B })).to.equal(true);
        expect(db.findPreference.calledWith({ user: USER_A })).to.equal(false);
    });
});

describe(`${REQ.DISPLAY} | GET /api/recommendations (when there is nothing to show)`, () => {
    it("TC-REC-03 (API): no saved preference gives preferenceSet false and empty lists", async () => {
        const db = arrange({ preference: null });

        const res = await get(asUser());
        const json = await res.json();

        expect(res.status).to.equal(200);
        expect(json.preferenceSet).to.equal(false);
        expect(json.destinations).to.deep.equal([]);
        expect(json.attractions).to.deep.equal([]);
        expect(db.findAttractions.called).to.equal(false); // nothing is queried for nothing
    });

    it("TC-REC-03 (API): a skipped setup (no choices saved) behaves like no preference", async () => {
        arrange({ preference: { user: USER_A, destinations: [], categories: [], completed: true } });

        const json = await (await get(asUser())).json();

        expect(json.preferenceSet).to.equal(false);
        expect(json.attractions).to.deep.equal([]);
    });
});

describe(`${REQ.RECOMMEND} + ${REQ.DISPLAY} | GET /api/recommendations (results)`, () => {
    it("TC-REC-09: matches on both criteria come first as 'best', single matches follow as 'partial'", async () => {
        arrange({ preference: saved([SYD, HOB], ["Beach", "Park"]) });

        const json = await (await get(asUser())).json();

        expect(json.preferenceSet).to.equal(true);
        expect(names(json.attractions)).to.deep.equal([
        "Bondi Beach", // Sydney + Beach
        "Royal Botanic Garden", // Sydney + Park
        "Cottesloe Beach", // Beach only
        "Fitzroy Gardens", // Park only
        "Kings Park", // Park only
        ]);
        expect(json.attractions.map((a: { tier: string }) => a.tier)).to.deep.equal([
        "best",
        "best",
        "partial",
        "partial",
        "partial",
        ]);
        expect(json.attractions[0].matched).to.deep.equal(["destination", "category"]);
        expect(json.attractions[2].matched).to.deep.equal(["category"]);
        expect(json.attractions[0].score).to.equal(1);
        expect(json.attractions[2].score).to.equal(0.5);
    });

    it("TC-REC-09: an attraction that matches nothing is never returned", async () => {
        arrange({ preference: saved([SYD], ["Beach", "Park"]) });

        const json = await (await get(asUser())).json();

        expect(names(json.attractions)).to.not.include("Fremantle Prison"); // Perth + Landmark
    });

    it("TC-REC-09: every attraction carries what the cards need to link to its details page", async () => {
        arrange({ preference: saved([SYD], []) });

        const json = await (await get(asUser())).json();

        expect(json.attractions[0].doc).to.include.keys("_id", "name", "category", "location", "image");
    });

    it("TC-REC-09: with categories only, every match is 'best' and none is 'partial'", async () => {
        arrange({ preference: saved([], ["Beach"]) });

        const json = await (await get(asUser())).json();

        expect(names(json.attractions)).to.deep.equal(["Bondi Beach", "Cottesloe Beach", "St Kilda Beach"]);
        expect(json.attractions.every((a: { tier: string }) => a.tier === "best")).to.equal(true);
        expect(json.attractions[0].matched).to.deep.equal(["category"]);
    });

    it("TC-REC-10: destinations are ranked by the attractions that matched in them", async () => {
        arrange({ preference: saved([SYD, HOB], ["Beach", "Park"]) });

        const json = await (await get(asUser())).json();

        expect(names(json.destinations)).to.deep.equal(["Sydney", "Hobart", "Melbourne", "Perth"]);
        expect(json.destinations[0]).to.deep.include({ score: 2.5, matchedCount: 3 }); // 1 + 1 + 0.5
    });

    it("TC-REC-11: a chosen published destination without attractions is still returned", async () => {
        arrange({ preference: saved([HOB], []) });

        const json = await (await get(asUser())).json();

        expect(json.preferenceSet).to.equal(true);
        expect(names(json.destinations)).to.deep.equal(["Hobart"]);
        expect(json.destinations[0]).to.deep.include({ score: 0, matchedCount: 0 });
        expect(json.attractions).to.deep.equal([]); // the page shows the empty-state message
    });

    it("TC-REC-12: returns at most 4 destinations and 5 attractions", async () => {
        const manyDestinations = [1, 2, 3, 4, 5, 6].map((n) => destination(oid(0xe000 + n), `Dest${n}`));
        const manyAttractions = manyDestinations.map((d, i) => attraction(`Beach ${i + 1}`, d._id, "Beach"));
        arrange({
        preference: saved([], ["Beach"]),
        destinations: manyDestinations,
        attractions: manyAttractions,
        });

        const json = await (await get(asUser())).json();

        expect(json.attractions).to.have.length(5);
        expect(json.destinations).to.have.length(4);
    });
});

describe(`${REQ.DISPLAY} | GET /api/recommendations (published content only)`, () => {
    it("TC-REC-13: reads only published destinations and published attractions", async () => {
        const db = arrange({ preference: saved([SYD], ["Beach"]) });

        await get(asUser());

        expect(db.findDestinations.calledOnceWith({ status: "PUBLISHED" })).to.equal(true);
        expect(db.findAttractions.calledOnceWith({ status: "PUBLISHED" })).to.equal(true);
    });

    it("TC-REC-13: an attraction whose destination is not published is never recommended", async () => {
        const ARCHIVED = oid(0xd999);
        const hidden = attraction("Archived Beach", ARCHIVED, "Beach");
        arrange({
        preference: saved([], ["Beach"]),
        destinations: DESTINATIONS, // the archived destination is not in the published list
        attractions: [...ATTRACTIONS, hidden],
        });

        const json = await (await get(asUser())).json();

        expect(names(json.attractions)).to.not.include("Archived Beach");
    });

    it("TC-REC-13: a chosen destination that is no longer published is not shown", async () => {
        const ARCHIVED = oid(0xd999);
        arrange({ preference: saved([ARCHIVED], []) });

        const json = await (await get(asUser())).json();

        expect(json.preferenceSet).to.equal(true);
        expect(json.destinations).to.deep.equal([]);
        expect(json.attractions).to.deep.equal([]);
    });
});

describe(`${REQ.RELIABILITY} | GET /api/recommendations`, () => {
    it("TC-REC-14 (API): a database failure gives 500 with a clear message and is logged", async () => {
        sinon.stub(UserPreference, "findOne").throws(new Error("DB Error"));
        const errorLog = sinon.stub(console, "error");

        const res = await get(asUser());
        const json = await res.json();

        expect(res.status).to.equal(500);
        expect(json.success).to.equal(false);
        expect(json.message).to.equal("Failed to fetch recommendations");
        expect(errorLog.calledOnce).to.equal(true);
    });

    it("TC-REC-14 (API): a failure while reading attractions also gives 500, not a crash", async () => {
            sinon.stub(UserPreference, "findOne").returns(lean(saved([SYD], ["Beach"])) as never);
            sinon.stub(Destination, "find").returns(lean(DESTINATIONS) as never);
            sinon.stub(Attraction, "find").throws(new Error("DB Error"));
            sinon.stub(console, "error");

            const res = await get(asUser());

            expect(res.status).to.equal(500);
    });
});


describe(`${REQ.STORE} + ${REQ.DISPLAY} | save a preference, then see recommendations`, () => {
    it("TC-REC-02 (API): saves a destination and category, then returns matching recommendations", async () => {
        // Store the preference in memory so subsequent API calls can read it.
        let stored: Record<string, unknown> | null = null;

        sinon.stub(UserPreference, "findOneAndUpdate").callsFake(
            ((filter: { user: string }, update: Record<string, unknown>) => {
                stored = {
                    user: filter.user,
                    ...update,
                };

                return Promise.resolve(stored);
            }) as never,
        );

        sinon.stub(UserPreference, "findOne").callsFake(
            (() => lean(stored)) as never,
        );

        // Mock database operations used by PUT /api/preferences.
        sinon.stub(Destination, "countDocuments").resolves(1 as never);

        sinon.stub(Attraction, "distinct").resolves(
            ["Beach", "Park", "Landmark"] as never,
        );

        // Mock database reads used by GET /api/recommendations.
        sinon.stub(Destination, "find").returns(
            lean(DESTINATIONS) as never,
        );

        sinon.stub(Attraction, "find").returns(
            selectLean(ATTRACTIONS) as never,
        );

        // 1. Save the preference.
        const saveRes = await PUT_PREFERENCES(
            request("PUT", {
                cookie: asUser(),
                url: "http://localhost/api/preferences",
                body: {
                    destinations: [SYD],
                    categories: ["Beach"],
                },
            }),
        );

        expect(saveRes.status).to.equal(200);

        // 2. Read the saved preference.
        const preferenceRes = await GET_PREFERENCES(
            request("GET", {
                cookie: asUser(),
                url: "http://localhost/api/preferences",
            }),
        );

        const preferenceJson = await preferenceRes.json();

        expect(preferenceRes.status).to.equal(200);
        expect(preferenceJson.preference.completed).to.equal(true);
        expect(preferenceJson.preference.destinations).to.deep.equal([SYD]);
        expect(preferenceJson.preference.categories).to.deep.equal(["Beach"]);

        // 3. Request recommendations using the saved preference.
        const recommendationRes = await get(asUser());
        const rec = await recommendationRes.json();

        expect(recommendationRes.status).to.equal(200);
        expect(rec.preferenceSet).to.equal(true);
        expect(names(rec.attractions)).to.include("Bondi Beach");
        expect(rec.attractions[0].tier).to.equal("best");
    });
});
