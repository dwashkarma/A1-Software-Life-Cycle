import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getSessionFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Attraction from "@/models/Attraction";

export async function GET() {
  try {
    await connectDB();

    const attractions = await Attraction.find()
      .populate("destination")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, attractions });
  } catch (error) {
    console.error("Get attractions error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch attractions" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const session = getSessionFromRequest(request);

    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { name, destination, category, location, description, image } = body;

    if (!name || !destination || !category || !location || !description) {
      return NextResponse.json(
        { success: false, message: "All attraction fields are required" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(destination)) {
      return NextResponse.json(
        { success: false, message: "Invalid destination id" },
        { status: 400 },
      );
    }

    const attraction = await Attraction.create({
      name,
      destination,
      category,
      location,
      description,
      image: image || "",
    });

    return NextResponse.json(
      { success: true, message: "Attraction created", attraction },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create attraction error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create attraction" },
      { status: 500 },
    );
  }
}
