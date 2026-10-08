import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Attraction from "@/models/Attraction";
import { ContentLifecycleService } from "@/app/services/content-life-cycle";
import type { ContentState } from "@/app/contents/content-state";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const attraction = await Attraction.findById(id);

    if (!attraction) {
      return NextResponse.json(
        { error: "Attraction not found" },
        { status: 404 },
      );
    }

    const currentStatus = (attraction.status || "DRAFT") as ContentState;

    let newStatus: ContentState;

    if (body.action === "publish") {
      newStatus = ContentLifecycleService.publish(currentStatus);
    } else if (body.action === "archive") {
      newStatus = ContentLifecycleService.archive(currentStatus);
    } else {
      return NextResponse.json(
        { error: "Invalid lifecycle action" },
        { status: 400 },
      );
    }

    attraction.status = newStatus;

    await attraction.save();

    return NextResponse.json({
      message: "Attraction status updated",
      status: attraction.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update attraction status",
      },
      { status: 400 },
    );
  }
}
