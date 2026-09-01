import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { decodeSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Itinerary from "@/models/Itinearary";

const formatDate = (dateValue: string | Date) => {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default async function MyItineraryPage() {
  await connectDB();

  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get("travel_mate_session")?.value);

  if (!session) {
    redirect("/authentication/login");
  }

  const itineraries = await Itinerary.find({ user: session.id })
    .populate("destination")
    .populate("attractions")
    .sort({ createdAt: -1 });

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto py-10 px-6 max-w-7xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[30px] font-bold text-[#1A1F24]">
              My Itinerary
            </h1>

            <p className="mt-2 text-sm text-[#636E75]">
              Review your saved trip and manage the attractions you want to
              visit.
            </p>
          </div>

          <Link
            href="/itineraries/create"
            className="flex h-10.5 w-47.5 items-center justify-center rounded-[9px] bg-[#0A786E] text-[13px] font-semibold text-white transition hover:bg-[#08675F]"
          >
            + Add Itinerary
          </Link>
        </div>

        <section className="mt-10 max-w-316 grid gap-2">
          {itineraries.length === 0 ? (
            <div className="rounded-[14px] border border-[#D4D9DE] bg-white p-8 text-sm text-[#636E75]">
              No itineraries yet. Create your first trip to get started.
            </div>
          ) : (
            itineraries.map((itinerary: any) => {
              const destinationName =
                itinerary.destination &&
                typeof itinerary.destination === "object"
                  ? itinerary.destination.name
                  : "Unknown";

              return (
                <article
                  key={itinerary._id.toString()}
                  className="rounded-[14px] border border-[#D4D9DE] bg-white px-6 py-6"
                >
                  <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr_1.2fr_1.2fr_160px] lg:items-center">
                    <div>
                      <h2 className="text-[22px] font-semibold text-[#1A1F24]">
                        {itinerary.name}
                      </h2>

                      <p className="mt-3 text-[11px] font-semibold text-[#0A786E]">
                        Active trip
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-[#636E75]">
                        Destination
                      </p>
                      <p className="mt-2 text-[14px] font-semibold text-[#1A1F24]">
                        {destinationName}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-[#636E75]">
                        Travel dates
                      </p>
                      <p className="mt-2 text-[14px] font-semibold text-[#1A1F24]">
                        {formatDate(itinerary.startDate)} –{" "}
                        {formatDate(itinerary.endDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-[#636E75]">
                        Saved attractions
                      </p>
                      <p className="mt-2 text-[14px] font-semibold text-[#1A1F24]">
                        {itinerary.attractions.length} places
                      </p>
                    </div>

                    <Link
                      href={`/itineraries/${itinerary._id}`}
                      className="flex h-10.5 w-full items-center justify-center rounded-[9px] border border-[#D4D9DE] bg-white text-[13px] font-semibold text-[#1A1F24] transition hover:border-[#0A786E] hover:text-[#0A786E]"
                    >
                      View trip
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}
