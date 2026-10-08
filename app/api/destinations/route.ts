import { type NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Destination from "@/models/Destinations";

export async function GET() {
  try {
    await connectDB();
    const destinations = await Destination.find().sort({ createdAt: -1 });
    return Response.json(destinations);
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    return Response.json(
      { error: "Failed to fetch destinations" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (getSessionFromRequest(request)?.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 401 },
    );
  }

  let body: {
    name?: unknown;
    state?: unknown;
    description?: unknown;
    image?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, state, description, image } = body;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof state !== "string" ||
    !state.trim() ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return NextResponse.json(
      { error: "Name, state, and description are required" },
      { status: 400 },
    );
  }
  if (image !== undefined && typeof image !== "string") {
    return NextResponse.json(
      { error: "Image must be a string" },
      { status: 400 },
    );
  }
  if (typeof image === "string" && image.length > 7_000_000) {
    return NextResponse.json(
      { error: "Image must be 5 MB or smaller" },
      { status: 413 },
    );
  }

  try {
    await connectDB();
    const destination = await Destination.create({
      name: name.trim(),
      state: state.trim(),
      description: description.trim(),
      image: image || "",
    });
    return NextResponse.json({ success: true, destination }, { status: 201 });
  } catch (error) {
    console.error("Failed to create destination:", error);
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 },
    );
  }
}
