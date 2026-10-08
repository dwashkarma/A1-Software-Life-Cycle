import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getSessionFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Attraction from "@/models/Attraction";
import Destination from "@/models/Destinations";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (getSessionFromRequest(request)?.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Admin access required" },
      { status: 401 },
    );
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid destination id" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const destination = await Destination.findById(id);
    if (!destination) {
      return NextResponse.json(
        { success: false, error: "Destination not found" },
        { status: 404 },
      );
    }

    if (await Attraction.exists({ destination: id })) {
      return NextResponse.json(
        {
          success: false,
          error: "Remove this destination's attractions before deleting it",
        },
        { status: 409 },
      );
    }

    await destination.deleteOne();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete destination error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to delete destination" },
      { status: 500 },
    );
  }
}
