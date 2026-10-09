import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getSessionFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Attraction from "@/models/Attraction";
import Destination from "@/models/Destinations";
import UserPreference from "@/models/UserPreference";
import { TravelPreference } from "@/lib/recommendation/TravelPreference";

// Returns the logged-in user's id, or null when there is no usable session.
function getUserId(request: NextRequest): string | null {
    const session = getSessionFromRequest(request);
    if (!session || !mongoose.Types.ObjectId.isValid(session.id)) return null;
    return session.id;
}

const unauthorized = () =>
    NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
    );

const badRequest = (message: string) =>
    NextResponse.json({success: false, message}, {status: 400});

// Read the logged-in user's saved preference.
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const userId = getUserId(request);
        if (!userId) return unauthorized();

        const preference = await UserPreference.findOne({ user: userId }).lean();

        return NextResponse.json({ success: true, preference: preference ?? null });
    } catch (error) {
        console.error("Get preference error:", error);
        return NextResponse.json(
        { success: false, message: "Failed to fetch preferences" },
        { status: 500 },
        );
    }
}

// Save (replace) the logged-in user's preference, or skip the setup.
export async function PUT(request: NextRequest) {
    try {
        await connectDB();

        const userId = getUserId(request);
        if (!userId) return unauthorized();

        const body = await request.json().catch(() => null);
        if (!body || typeof body !== "object") 
        {
            return badRequest("Invalid request body");
        }

        // Skip: mark the setup as completed. Nothing else is stored, and an
        // existing preference is left untouched.
        if (body.skip === true) 
        {
            const skipped = await UserPreference.findOneAndUpdate(
                { user: userId },
                { completed: true },
                { upsert: true, new: true },
        );
        return NextResponse.json({
            success: true,
            message: "Preferences skipped",
            preference: skipped,
        });
        }

        const rawDestinations: unknown = body.destinations ?? [];
        const rawCategories: unknown = body.categories ?? [];

        if (
            !Array.isArray(rawDestinations) ||
            !rawDestinations.every(
                (id) => typeof id === "string" && mongoose.Types.ObjectId.isValid(id),
            )
        ) {
            return badRequest("Invalid destination id");
        }

        if (
            !Array.isArray(rawCategories) ||
            !rawCategories.every((category) => typeof category === "string")
        ) {
            return badRequest("Invalid category");
        }

        // The TravelPreference class (Story 3.1) rejects an empty preference.
        let preference: TravelPreference;
        try {
            preference = new TravelPreference(rawDestinations, rawCategories);
        } catch (error) {
            return badRequest(
                error instanceof Error ? error.message : "Invalid preference",
        );
        }

        // Every selected destination must exist.
        const destinationIds = [...preference.destinationIds];
        const foundDestinations = await Destination.countDocuments({
            _id: { $in: destinationIds },
        });
        if (foundDestinations !== destinationIds.length) {
            return badRequest("Destination not found");
        }

        // Every selected category must exist in the attraction data.
        const storedCategories: string[] = await Attraction.distinct("category");
        const unknown = preference.categories.filter(
            (category) => !storedCategories.includes(category),
        );
        if (unknown.length > 0) {
            return badRequest(`Unknown category: ${unknown.join(", ")}`);
        }

        // One preference per user: create it, or replace the previous one.
        const saved = await UserPreference.findOneAndUpdate(
        { user: userId },
        {
            destinations: destinationIds,
            categories: [...preference.categories],
            completed: true,
        },
        { upsert: true, new: true, runValidators: true },
        );

        return NextResponse.json({
            success: true,
            message: "Preferences saved",
            preference: saved,
        });
    } catch (error) {
        console.error("Save preference error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to save preferences" },
            { status: 500 },
        );
    }
}