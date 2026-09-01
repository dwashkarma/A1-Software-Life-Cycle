import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { decodeSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";

import Itinerary from "@/models/Itinearary";
import Destination from "@/models/Destinations";
import Attraction from "@/models/Attraction";

const formatDate = (dateValue: string | Date) => {
  const date = new Date(dateValue);

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default async function DashboardPage() {
  // Connect MongoDB
  await connectDB();

  // Get login session
  const cookieStore = await cookies();

  const session = decodeSession(cookieStore.get("travel_mate_session")?.value);

  // Not logged in
  if (!session) {
    redirect("/authentication/login");
  }

  // Admin should not use traveller dashboard
  if (session.role === "admin") {
    redirect("/admin/dashboard");
  }

  // Get logged-in traveller itineraries
  const itineraries = await Itinerary.find({
    user: session.id,
  })
    .populate({
      path: "destination",
      model: Destination,
      select: "name state description image",
    })
    .populate({
      path: "attractions",
      model: Attraction,
      select: "name category location description image destination",
    })
    .sort({
      createdAt: -1,
    });

  // Get destinations from MongoDB
  const destinations = await Destination.find()
    .sort({
      createdAt: -1,
    })
    .limit(6);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-10">
        {/* Welcome */}
        <section className="grid gap-4">
          <p className="text-xs font-bold text-primary">
            <span className="rounded-full bg-secondary p-2">
              Traveller Dashboard
            </span>
          </p>

          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>

          <p className="text-sm text-gray-500">
            Discover new places and continue planning your next trip.
          </p>
        </section>

        {/* Your trips */}
        <section className="mt-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your trips</h2>

              <p className="mt-1 text-sm text-gray-500">
                Continue planning your saved itinerary.
              </p>
            </div>

            <Link
              href="/itineraries"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-4">
            {itineraries.length === 0 ? (
              <div className="rounded-[14px] border border-[#D4D9DE] bg-white p-8">
                <p className="text-sm text-[#636E75]">
                  No itineraries yet. Create your first trip to get started.
                </p>

                <Link
                  href="/itineraries/create"
                  className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  + Create itinerary
                </Link>
              </div>
            ) : (
              itineraries.map((itinerary: any) => {
                const destinationName =
                  itinerary.destination &&
                  typeof itinerary.destination === "object"
                    ? itinerary.destination.name
                    : "Unknown destination";

                const attractionCount = itinerary.attractions?.length ?? 0;

                return (
                  <article
                    key={itinerary._id.toString()}
                    className="rounded-[14px] border border-[#D4D9DE] bg-white px-6 py-6"
                  >
                    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr_1.2fr_1.2fr_160px] lg:items-center">
                      {/* Trip name */}
                      <div>
                        <h3 className="text-[22px] font-semibold text-[#1A1F24]">
                          {itinerary.name}
                        </h3>

                        <span className="mt-3 inline-block rounded-full bg-[#E3F5F2] px-3 py-1 text-[11px] font-semibold text-[#0A786E]">
                          Active trip
                        </span>
                      </div>

                      {/* Destination */}
                      <div>
                        <p className="text-[11px] font-semibold text-[#636E75]">
                          Destination
                        </p>

                        <p className="mt-2 text-[14px] font-semibold text-[#1A1F24]">
                          {destinationName}
                        </p>
                      </div>

                      {/* Dates */}
                      <div>
                        <p className="text-[11px] font-semibold text-[#636E75]">
                          Travel dates
                        </p>

                        <p className="mt-2 text-[14px] font-semibold text-[#1A1F24]">
                          {formatDate(itinerary.startDate)} –{" "}
                          {formatDate(itinerary.endDate)}
                        </p>
                      </div>

                      {/* Attractions */}
                      <div>
                        <p className="text-[11px] font-semibold text-[#636E75]">
                          Saved attractions
                        </p>

                        <p className="mt-2 text-[14px] font-semibold text-[#1A1F24]">
                          {attractionCount}{" "}
                          {attractionCount === 1 ? "place" : "places"}
                        </p>
                      </div>

                      {/* View */}
                      <Link
                        href={`/itineraries/${itinerary._id.toString()}`}
                        className="flex h-11 w-full items-center justify-center rounded-[9px] border border-[#D4D9DE] bg-white text-[13px] font-semibold text-[#1A1F24] transition hover:border-[#0A786E] hover:text-[#0A786E]"
                      >
                        View trip
                      </Link>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* Popular destinations */}
        <section className="mt-6">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Popular destinations
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Explore places for your next itinerary.
              </p>
            </div>

            <Link
              href="/explore"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Explore all
            </Link>
          </div>

          {destinations.length === 0 ? (
            <div className="rounded-xl border border-[#D4D9DE] bg-white p-8 text-center text-sm text-[#636E75]">
              No destinations available.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination: any) => (
                <article
                  key={destination._id.toString()}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-[#DDE5E3]">
                    {destination.image ? (
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                        No image available
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {destination.name}
                      </h3>

                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                        {destination.state}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                      {destination.description}
                    </p>

                    <Link
                      href={`/destinations/${destination._id.toString()}`}
                      className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
                    >
                      Explore destination →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
