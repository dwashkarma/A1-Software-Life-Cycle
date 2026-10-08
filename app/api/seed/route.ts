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
    await Itinerary.deleteMany({});
    await User.deleteMany({});

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
        email: "traveller@gmail.com",
        password: "traveller123",
        role: "traveller",
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      },
    ]);

    // Create sample attractions
    const attractions = await Attraction.create([
      {
        name: "South Bank Parklands",
        destination: destinations[0]._id,
        category: "Park",
        location: "Brisbane CBD",
        description:
          "A riverside leisure precinct with gardens, walking paths, and city views.",
        image: "/attractions/south-bank.webp",
        status: "PUBLISHED",
      },
      {
        name: "Story Bridge",
        destination: destinations[0]._id,
        category: "Landmark",
        location: "Brisbane",
        description:
          "A famous steel bridge offering iconic views of the Brisbane River.",
        image: "/attractions/story-bridge.webp",
        status: "PUBLISHED",
      },
      {
        name: "Sydney Opera House",
        destination: destinations[1]._id,
        category: "Landmark",
        location: "Sydney Harbour",
        description:
          "A world-famous performing arts venue and symbol of Australia.",
        image: "/attractions/opera-house.webp",
        status: "PUBLISHED",
      },
      {
        name: "Bondi Beach",
        destination: destinations[1]._id,
        category: "Beach",
        location: "Eastern Suburbs",
        description:
          "A iconic Sydney beach known for surf culture, coastal walks and sunset views.",
        image: "/attractions/bondi-beach.webp",
        status: "PUBLISHED",
      },
      {
        name: "Federation Square",
        destination: destinations[2]._id,
        category: "Cultural",
        location: "Melbourne CBD",
        description:
          "A vibrant cultural and arts precinct at the heart of Melbourne.",
        image: "/attractions/federation-square.webp",
        status: "PUBLISHED",
      },
      {
        name: "Royal Botanic Gardens",
        destination: destinations[2]._id,
        category: "Garden",
        location: "Melbourne",
        description:
          "A lush collection of gardens and lakes perfect for relaxed city exploration.",
        image: "/attractions/botanic-gardens.webp",
        status: "PUBLISHED",
      },
      {
        name: "Kings Park and Botanic Garden",
        destination: destinations[3]._id,
        category: "Park",
        location: "Perth",
        description:
          "A scenic park overlooking the city with gardens, walking trails and city views.",
        image: "/attractions/kings-park.webp",
        status: "PUBLISHED",
      },
      {
        name: "Cottesloe Beach",
        destination: destinations[3]._id,
        category: "Beach",
        location: "Perth",
        description:
          "A beautiful white-sand beach famous for sunset views and swimming.",
        image: "/attractions/cottesloe.webp",
        status: "PUBLISHED",
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        destinations: destinations.length,
        users: users.length,
        attractions: attractions.length,
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
