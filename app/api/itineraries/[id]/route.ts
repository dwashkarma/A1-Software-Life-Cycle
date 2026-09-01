import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getSessionFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Itinerary from "@/models/Itinearary";

export async function GET(
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid itinerary id" },
        { status: 400 },
      );
    }

    const itinerary = await Itinerary.findOne({ _id: id, user: session.id })
      .populate("destination")
      .populate("attractions");

    if (!itinerary) {
      return NextResponse.json(
        { success: false, message: "Itinerary not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, itinerary });
  } catch (error) {
    console.error("Get itinerary error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch itinerary" },
      { status: 500 },
    );
  }
}

export async function PUT(
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid itinerary id" },
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

    const body = await request.json();
    const { name, destination, startDate, endDate } = body;

    if (name) itinerary.name = name;
    if (destination) itinerary.destination = destination;
    if (startDate) itinerary.startDate = startDate;
    if (endDate) itinerary.endDate = endDate;

    if (itinerary.endDate < itinerary.startDate) {
      return NextResponse.json(
        {
          success: false,
          message: "endDate must be greater than or equal to startDate",
        },
        { status: 400 },
      );
    }

    await itinerary.save();

    return NextResponse.json({
      success: true,
      message: "Itinerary updated",
      itinerary,
    });
  } catch (error) {
    console.error("Update itinerary error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update itinerary" },
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid itinerary id" },
        { status: 400 },
      );
    }

    const itinerary = await Itinerary.findOneAndDelete({
      _id: id,
      user: session.id,
    });
    if (!itinerary) {
      return NextResponse.json(
        { success: false, message: "Itinerary not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Itinerary deleted" });
  } catch (error) {
    console.error("Delete itinerary error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete itinerary" },
      { status: 500 },
    );
  }
}
