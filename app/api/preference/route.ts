import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getSessionFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import UserPreference from "@/models/UserPreference";

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