import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Attraction from "@/models/Attraction";
import Destination from "@/models/Destinations";
import UserPreference from "@/models/UserPreference";
import { TravelPreference } from "./TravelPreference";
import { RecommendationService } from "./RecommendationService";
import { AttractionData } from "./type";

export const MAX_DESTINATIONS = 4;
export const MAX_ATTRACTIONS = 5;

export interface RecommendationResult {
    /** false when the traveller has no saved preference (never set, or skipped). */
    preferenceSet: boolean;
    destinations: { score: number; matchedCount: number; doc: any }[];
    attractions: {
        score: number;
        /** "best" matches every criterion the traveller chose, "partial" matches only some. */
        tier: "best" | "partial";
        matched: string[];
        doc: any;
    }[];
}

const notSet = (): RecommendationResult => ({
    preferenceSet: false,
    destinations: [],
    attractions: [],
});

/**
 * Connects the database to the recommendation engine (Story 3.1).
 * It only reads the preference that belongs to the given user.
 */
export async function getRecommendations(
    userId: string,
): Promise<RecommendationResult> {
    if (!mongoose.Types.ObjectId.isValid(userId)) return notSet();

    await connectDB();

    const saved: any = await UserPreference.findOne({ user: userId }).lean();
    if (!saved || (!saved.destinations?.length && !saved.categories?.length)) {
        return notSet(); // never set, or skipped
    }

    let preference: TravelPreference;
    try {
        preference = new TravelPreference(
        (saved.destinations ?? []).map(String),
        saved.categories ?? [],
        );
    } catch {
        return notSet();
    }

    // Only published destinations are shown on the explore page, so only they are recommended.
    const destinationDocs: any[] = await Destination.find({
        status: "PUBLISHED",
    }).lean();
    const destinationById = new Map(
        destinationDocs.map((doc) => [String(doc._id), doc]),
    );

    // Only published attractions have a details page. Attractions that belong to
    // an unpublished destination are left out as well.
    const allDocs: any[] = await Attraction.find({ status: "PUBLISHED" })
        .select("name category destination location image")
        .lean();
    const docs = allDocs.filter((doc) =>
        destinationById.has(String(doc.destination)),
    );

    const docById = new Map(docs.map((doc) => [String(doc._id), doc]));
    const attractions: AttractionData[] = docs.map((doc) => ({
        id: String(doc._id),
        name: doc.name,
        category: doc.category,
        destinationId: String(doc.destination),
    }));

    const service = new RecommendationService();
    const ranked = service.rank(attractions, preference);
    const rankedDestinations = service.rankDestinations(ranked);

    // A destination the traveller ticked is always shown, even when none of its
    // attractions matched (or it has no attractions yet). Destinations found only
    // through matching attractions come after them.
    const scoreById = new Map(rankedDestinations.map((d) => [d.destinationId, d]));
    const chosenDestinations = preference.destinationIds
        .filter((id) => destinationById.has(id))
        .map(
        (id) => scoreById.get(id) ?? { destinationId: id, score: 0, matchedCount: 0 },
        )
        .sort(
        (a, b) =>
            b.score - a.score ||
            b.matchedCount - a.matchedCount ||
            String(destinationById.get(a.destinationId).name).localeCompare(
            String(destinationById.get(b.destinationId).name),
            ),
        );
    const otherDestinations = rankedDestinations.filter(
        (d) => !preference.destinationIds.includes(d.destinationId),
    );
    const topDestinations = [...chosenDestinations, ...otherDestinations].slice(
        0,
        MAX_DESTINATIONS,
    );

    return {
        preferenceSet: true,
        destinations: topDestinations
        .filter((d) => destinationById.has(d.destinationId))
        .map((d) => ({
            score: d.score,
            matchedCount: d.matchedCount,
            doc: destinationById.get(d.destinationId),
        })),
        attractions: ranked.slice(0, MAX_ATTRACTIONS).map((item) => ({
        score: item.score,
        tier: item.score === 1 ? ("best" as const) : ("partial" as const),
        matched: item.matched,
        doc: docById.get(item.attraction.id),
        })),
    };
}