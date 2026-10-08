import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getSessionFromRequest } from "@/lib/auth";
import { ContentLifecycleService } from "@/app/services/content-life-cycle";
import { connectDB } from "@/lib/mongodb";
import Destination from "@/models/Destinations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (getSessionFromRequest(request)?.role !== "admin")
    return NextResponse.json(
      { success: false, error: "Admin access required" },
      { status: 401 },
    );
  if (!mongoose.Types.ObjectId.isValid(id))
    return NextResponse.json(
      { success: false, error: "Invalid destination id" },
      { status: 400 },
    );

  try {
    await connectDB();

    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("status" in body) ||
      (body.status !== "PUBLISHED" && body.status !== "ARCHIVED")
    )
      return NextResponse.json(
        { success: false, error: "Status must be PUBLISHED or ARCHIVED" },
        { status: 400 },
      );

    const destination = await Destination.findById(id);
    if (!destination)
      return NextResponse.json(
        { success: false, error: "Destination not found" },
        { status: 404 },
      );

    const currentStatus = destination.status || "DRAFT";
    if (
      !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(currentStatus) ||
      (currentStatus === "PUBLISHED" && body.status === "PUBLISHED") ||
      currentStatus === "ARCHIVED"
    )
      return NextResponse.json(
        {
          success: false,
          error: `Cannot change destination from ${currentStatus} to ${body.status}`,
        },
        { status: 409 },
      );

    destination.status =
      body.status === "PUBLISHED"
        ? ContentLifecycleService.publish(currentStatus)
        : ContentLifecycleService.archive(currentStatus);
    await destination.save();

    return NextResponse.json({ success: true, status: destination.status });
  } catch (error) {
    if (error instanceof SyntaxError)
      return NextResponse.json(
        { success: false, error: "Request body must be valid JSON" },
        { status: 400 },
      );
    console.error("Update destination status error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to update destination status" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (getSessionFromRequest(request)?.role !== "admin")
    return NextResponse.json(
      { success: false, error: "Admin access required" },
      { status: 401 },
    );
  if (!mongoose.Types.ObjectId.isValid(id))
    return NextResponse.json(
      { success: false, error: "Invalid destination id" },
      { status: 400 },
    );

  try {
    await connectDB();
    const destination = await Destination.findByIdAndDelete(id);
    if (!destination)
      return NextResponse.json(
        { success: false, error: "Destination not found" },
        { status: 404 },
      );
    return NextResponse.json({
      success: true,
      message: "Destination deleted successfully",
    });
  } catch (error) {
    console.error("Delete destination error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to delete destination" },
      { status: 500 },
    );
  }
}
