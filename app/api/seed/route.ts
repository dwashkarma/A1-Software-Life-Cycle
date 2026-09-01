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
        image: "https://example.com/brisbane.jpg",
      },
      {
        name: "Gold Coast",
        state: "Queensland",
        description:
          "Australia's premier beach destination with stunning coastlines and theme parks.",
        image: "https://example.com/goldcoast.jpg",
      },
      {
        name: "Sunshine Coast",
        state: "Queensland",
        description:
          "A relaxed coastal paradise known for its beautiful beaches and hinterland.",
        image: "https://example.com/sunshinecoast.jpg",
      },
      {
        name: "Sydney",
        state: "New South Wales",
        description:
          "Australia's most iconic city with the Opera House, Harbour Bridge, and stunning beaches.",
        image: "https://example.com/sydney.jpg",
      },
      {
        name: "Melbourne",
        state: "Victoria",
        description:
          "A cultural hub known for its art, music, food scene, and unique laneways.",
        image: "https://example.com/melbourne.jpg",
      },
      {
        name: "Perth",
        state: "Western Australia",
        description:
          "A isolated gem on the west coast with beautiful beaches and wine regions.",
        image: "https://example.com/perth.jpg",
      },
    ]);

    // Create attractions
    const attractions = await Attraction.create([
      {
        name: "South Bank Parklands",
        destination: destinations[0]._id,
        category: "Park",
        location: "South Brisbane",
        description:
          "A riverside cultural and recreational precinct with gardens, dining, walking paths and public spaces.",
        image: "https://example.com/southbank.jpg",
      },
      {
        name: "Story Bridge",
        destination: destinations[0]._id,
        category: "Landmark",
        location: "Kangaroo Point",
        description:
          "An iconic bridge offering panoramic views of Brisbane River and city skyline.",
        image: "https://example.com/storybridge.jpg",
      },
      {
        name: "Lone Pine Koala Sanctuary",
        destination: destinations[0]._id,
        category: "Wildlife",
        location: "Fig Tree Pocket",
        description:
          "Australia's best-loved zoo and wildlife sanctuary featuring native animals.",
        image: "https://example.com/lonepine.jpg",
      },
      {
        name: "Surfers Paradise",
        destination: destinations[1]._id,
        category: "Beach",
        location: "Gold Coast",
        description:
          "The most famous beach on the Gold Coast with pristine sands and vibrant atmosphere.",
        image: "https://example.com/surfers.jpg",
      },
      {
        name: "Sea World",
        destination: destinations[1]._id,
        category: "Theme Park",
        location: "Main Beach",
        description:
          "Marine life theme park featuring shows, attractions and water rides.",
        image: "https://example.com/seaworld.jpg",
      },
      {
        name: "Noosa Main Beach",
        destination: destinations[2]._id,
        category: "Beach",
        location: "Noosa",
        description:
          "Picturesque beach town with cafes, restaurants and stunning coastal walks.",
        image: "https://example.com/noosa.jpg",
      },
      {
        name: "Opera House",
        destination: destinations[3]._id,
        category: "Landmark",
        location: "Bennelong Point",
        description:
          "Australia's most iconic building and world-class performing arts venue.",
        image: "https://example.com/operahouse.jpg",
      },
      {
        name: "Bondi Beach",
        destination: destinations[3]._id,
        category: "Beach",
        location: "Bondi",
        description:
          "One of Australia's most famous beaches with golden sand and coastal walks.",
        image: "https://example.com/bondi.jpg",
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

    // Create sample itineraries
    const itineraries = await Itinerary.create([
      {
        user: users[0]._id,
        name: "Brisbane City Adventure",
        destination: destinations[0]._id,
        startDate: new Date("2026-09-10"),
        endDate: new Date("2026-09-13"),
        attractions: [
          attractions[0]._id,
          attractions[1]._id,
          attractions[2]._id,
        ],
      },
      {
        user: users[0]._id,
        name: "Gold Coast Escape",
        destination: destinations[1]._id,
        startDate: new Date("2026-09-20"),
        endDate: new Date("2026-09-25"),
        attractions: [attractions[3]._id, attractions[4]._id],
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        destinations: destinations.length,
        attractions: attractions.length,
        users: users.length,
        itineraries: itineraries.length,
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
