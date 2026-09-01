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
