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
 * Connects the database to the recommendation engine.
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

    // Only published attractions have a details page, so only they are recommended.
    const docs: any[] = await Attraction.find({ status: "PUBLISHED" })
        .select("name category destination location image")
        .lean();

    const docById = new Map(docs.map((doc) => [String(doc._id), doc]));
    const attractions: AttractionData[] = docs.map((doc) => ({
        id: String(doc._id),
        name: doc.name,
        category: doc.category,
        destinationId: String(doc.destination),
    }));

    const service = new RecommendationService();
    const ranked = service.rank(attractions, preference);
    const topDestinations = service
        .rankDestinations(ranked)
        .slice(0, MAX_DESTINATIONS);

    const destinationDocs: any[] = await Destination.find({
        _id: { $in: topDestinations.map((d) => d.destinationId) },
    }).lean();
    const destinationById = new Map(
        destinationDocs.map((doc) => [String(doc._id), doc]),
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