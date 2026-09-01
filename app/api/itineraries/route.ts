import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getSessionFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Itinerary from "@/models/Itinearary";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const itineraries = await Itinerary.find({ user: session.id })
      .populate("destination")
      .populate("attractions")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, itineraries });
  } catch (error) {
    console.error("Get itineraries error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch itineraries" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { name, destination, startDate, endDate, attractions } = body;

    if (!name || !destination || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, destination, startDate and endDate are required",
        },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(destination)) {
      return NextResponse.json(
        { success: false, message: "Invalid destination id" },
        { status: 400 },
      );
    }

    if (new Date(endDate) < new Date(startDate)) {
      return NextResponse.json(
        {
          success: false,
          message: "endDate must be greater than or equal to startDate",
        },
        { status: 400 },
      );
    }

    const itinerary = await Itinerary.create({
      user: session.id,
      name,
      destination,
      startDate,
      endDate,
      attractions: Array.isArray(attractions)
        ? attractions.filter((id: string) =>
            mongoose.Types.ObjectId.isValid(id),
          )
        : [],
    });

    return NextResponse.json(
      { success: true, message: "Itinerary created", itinerary },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create itinerary error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create itinerary" },
      { status: 500 },
    );
  }
}
