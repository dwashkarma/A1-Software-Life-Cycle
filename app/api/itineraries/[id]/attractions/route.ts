import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getSessionFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Itinerary from "@/models/Itinearary";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const { attractionId } = await request.json();

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(attractionId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid ids provided" },
        { status: 400 },
      );
    }

    const itinerary = await Itinerary.findOne({ _id: id, user: session.id });
    if (!itinerary) {
      return NextResponse.json(
        { success: false, message: "Itinerary not found" },
        { status: 404 },
      );
    }

    if (
      !itinerary.attractions.includes(new mongoose.Types.ObjectId(attractionId))
    ) {
      itinerary.attractions.push(new mongoose.Types.ObjectId(attractionId));
      await itinerary.save();
    }

    return NextResponse.json({
      success: true,
      message: "Attraction added to itinerary",
      itinerary,
    });
  } catch (error) {
    console.error("Add attraction to itinerary error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add attraction" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const { attractionId } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(attractionId)) {
      return NextResponse.json(
        { success: false, message: "Invalid attraction id" },
        { status: 400 },
      );
    }

    const itinerary = await Itinerary.findOne({ _id: id, user: session.id });

    if (!itinerary) {
      return NextResponse.json(
        { success: false, message: "Itinerary not found" },
        { status: 404 },
      );
    }

    itinerary.attractions = itinerary.attractions.filter(
      (item: any) => item.toString() !== attractionId,
    );

    await itinerary.save();

    return NextResponse.json({
      success: true,
      message: "Attraction removed from itinerary",
      itinerary,
    });
  } catch (error) {
    console.error("Remove attraction from itinerary error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove attraction" },
      { status: 500 },
    );
  }
}
