import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Attraction from "@/models/Attraction";

// The stored categories, used to fill the category selection list.
// Public like /api/destinations, because it only lists category names.
export async function GET() {
    try {
        await connectDB();

        const stored: string[] = await Attraction.distinct("category");
        const categories = stored
            .filter((category) => typeof category === "string" && category.length > 0)
            .sort((a, b) => a.localeCompare(b));

        return NextResponse.json({ success: true, categories });
    } catch (error) {
        console.error("Get categories error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch categories" },
            { status: 500 },
        );
    }
}