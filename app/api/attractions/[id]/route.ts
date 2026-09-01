import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getSessionFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Attraction from "@/models/Attraction";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid attraction id" },
        { status: 400 },
      );
    }

    const attraction = await Attraction.findById(id).populate("destination");

    if (!attraction) {
      return NextResponse.json(
        { success: false, message: "Attraction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, attraction });
  } catch (error) {
    console.error("Get attraction error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch attraction" },
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
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 401 },
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid attraction id" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { name, destination, category, location, description, image } = body;

    const attraction = await Attraction.findById(id);
    if (!attraction) {
      return NextResponse.json(
        { success: false, message: "Attraction not found" },
        { status: 404 },
      );
    }

    if (name) attraction.name = name;
    if (destination) attraction.destination = destination;
    if (category) attraction.category = category;
    if (location) attraction.location = location;
    if (description) attraction.description = description;
    if (image !== undefined) attraction.image = image;

    await attraction.save();

    return NextResponse.json({
      success: true,
      message: "Attraction updated",
      attraction,
    });
  } catch (error) {
    console.error("Update attraction error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update attraction" },
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
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 401 },
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid attraction id" },
        { status: 400 },
      );
    }

    const attraction = await Attraction.findByIdAndDelete(id);

    if (!attraction) {
      return NextResponse.json(
        { success: false, message: "Attraction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Attraction deleted" });
  } catch (error) {
    console.error("Delete attraction error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete attraction" },
      { status: 500 },
    );
  }
}
