import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Attraction from "@/models/Attraction";
import { ContentLifecycleService } from "@/app/services/content-life-cycle";
import { type ContentState } from "@/app/contents/content-state";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid attraction id" },
        { status: 400 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { success: false, error: "Request body must be valid JSON" },
          { status: 400 },
        );
      }
      throw error;
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("action" in body) ||
      (body.action !== "publish" && body.action !== "archive")
    ) {
      return NextResponse.json(
        { success: false, error: "Action must be 'publish' or 'archive'" },
        { status: 400 },
      );
    }

    await connectDB();

    const attraction = await Attraction.findById(id);

    if (!attraction) {
      return NextResponse.json(
        { success: false, error: "Attraction not found" },
        { status: 404 },
      );
    }

    const currentStatus = attraction.status || "DRAFT";
    if (
      currentStatus !== "DRAFT" &&
      currentStatus !== "PUBLISHED" &&
      currentStatus !== "ARCHIVED"
    ) {
      throw new Error(`Attraction ${id} has an invalid lifecycle status`);
    }

    const newStatus: ContentState =
      body.action === "publish"
        ? ContentLifecycleService.publish(currentStatus)
        : ContentLifecycleService.archive(currentStatus);

    attraction.status = newStatus;

    await attraction.save();

    return NextResponse.json({
      success: true,
      message: "Attraction status updated",
      status: attraction.status,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 },
      );
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, error: "Invalid attraction data" },
        { status: 400 },
      );
    }

    console.error("Update attraction status error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update attraction status",
      },
      { status: 500 },
    );
  }
}
