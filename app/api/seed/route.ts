import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Destination from "@/models/Destinations";
import Attraction from "@/models/Attraction";
import User from "@/models/Users";
import Itinerary from "@/models/Itinearary";

export async function GET() {
  try {
    await connectDB();

    // Clear existing data
    await Destination.deleteMany({});
    await Attraction.deleteMany({});
    await User.deleteMany({});
    await Itinerary.deleteMany({});

    // Create destinations
    const destinations = await Destination.create([
      {
        name: "Brisbane",
        state: "Queensland",
        description:
          "A vibrant river city with cultural precincts, parks, food and easy day trips.",
        image: "/brisbane.webp",
      },
      {
        name: "Sydney",
        state: "New South Wales",
        description:
          "Australia's most iconic city with the Opera House, Harbour Bridge, and stunning beaches.",
        image: "/sdney.webp",
      },
      {
        name: "Melbourne",
        state: "Victoria",
        description:
          "A cultural hub known for its art, music, food scene, and unique laneways.",
        image: "/melbourne.webp",
      },
      {
        name: "Perth",
        state: "Western Australia",
        description:
          "A isolated gem on the west coast with beautiful beaches and wine regions.",
        image: "/perth.webp",
      },
    ]);

    // Create sample users
    const users = await User.create([
      {
        name: "John Traveller",
        email: "john@example.com",
        password: "hashedpassword123",
        role: "traveller",
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "hashedpassword123",
        role: "admin",
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        destinations: destinations.length,
        users: users.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database seeding failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
