import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getSessionFromRequest } from "@/lib/auth";
import { getRecommendations } from "@/lib/recommendation/getRecommendations";

// Recommendations for the logged-in traveller only.
// The user id comes from the session cookie, never from the request, so a traveller can only ever see results built from their own preference.
export async function GET(request: NextRequest) {
    try {
        const session = getSessionFromRequest(request);
        if (!session || !mongoose.Types.ObjectId.isValid(session.id)) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 },
            );
        }

        const result = await getRecommendations(session.id);

        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error("Get recommendations error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch recommendations" },
            { status: 500 },
        );
    }
}