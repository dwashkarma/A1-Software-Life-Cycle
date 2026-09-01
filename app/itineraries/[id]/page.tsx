import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/mongodb";
import { decodeSession } from "@/lib/auth";
import Itinerary from "@/models/Itinearary";
import RemoveAttractionButton from "@/components/remove-attraction-button";
import EditItineraryModal from "@/components/edit-itinerary-modal";

const formatDate = (dateValue: string | Date) => {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default async function ItineraryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectDB();
  const { id } = await params;
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get("travel_mate_session")?.value);

  const itinerary = await Itinerary.findById(id)
    .populate("destination")
    .populate("attractions");

  if (!itinerary) {
    notFound();
  }

  // Verify user owns this itinerary
  if (session?.id !== itinerary.user.toString()) {
    notFound();
  }

  const savedAttractions = itinerary.attractions || [];
  const startDate = formatDate(itinerary.startDate);
  const endDate = formatDate(itinerary.endDate);
  const destinationName =
    itinerary.destination && typeof itinerary.destination === "object"
      ? itinerary.destination.name
      : "Unknown";

  return (
    <div className="min-h-screen bg-[#F6F8F9]">
      <main className="px-6 py-10 max-w-7xl mx-auto grid gap-6">
        {/* Back */}
        <Link
          href="/itineraries"
          className="text-sm font-semibold text-[#0A786E]"
        >
          ← Back to My Itinerary
        </Link>

        {/* Trip heading */}
        <section className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-[30px] font-bold text-[#1A1F24]">
                {itinerary.name}
              </h1>

              <span className="rounded-full bg-[#E3F5F2] px-4 py-1.5 text-xs font-semibold text-[#0A786E]">
                Active trip
              </span>
            </div>

            <p className="mt-2 text-sm text-[#636E75]">
              {destinationName} · {startDate}–{endDate}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/explore"
              className="flex h-11 items-center rounded-lg bg-[#0A786E] px-6 text-sm font-semibold text-white"
            >
              + Add attraction
            </Link>

            <EditItineraryModal
              itineraryId={itinerary._id.toString()}
              currentName={itinerary.name}
              currentStartDate={itinerary.startDate}
              currentEndDate={itinerary.endDate}
            />
          </div>
        </section>

        {/* Trip summary */}
        <section className="mt-8 grid gap-5 rounded-[14px] border border-[#D4D9DE] bg-white p-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-[#636E75]">Destination</p>
            <p className="mt-2 text-sm font-semibold text-[#1A1F24]">
              {destinationName}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#636E75]">Travel dates</p>
            <p className="mt-2 text-sm font-semibold text-[#1A1F24]">
              {startDate}–{endDate}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#636E75]">
              Saved attractions
            </p>
            <p className="mt-2 text-sm font-semibold text-[#1A1F24]">
              {savedAttractions.length} places
            </p>
          </div>
        </section>

        {/* Main itinerary content */}
        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2.5fr)_minmax(320px,1fr)]">
          {/* Saved attractions */}
          <div className="rounded-[14px] border border-[#D4D9DE] bg-white p-8">
            <h2 className="text-[22px] font-semibold text-[#1A1F24]">
              Saved attractions
            </h2>

            <p className="mt-2 text-sm text-[#636E75]">
              These are the places currently included in this itinerary.
            </p>

            {savedAttractions.length === 0 ? (
              <div className="mt-7 rounded-xl border border-[#D4D9DE] bg-[#F6F8F9] p-8 text-center text-sm text-[#636E75]">
                No attractions added yet. Explore destinations to add
                attractions to your itinerary.
              </div>
            ) : (
              <div className="mt-7 space-y-3">
                {savedAttractions.map((attraction: any) => (
                  <article
                    key={attraction._id.toString()}
                    className="flex flex-col gap-4 rounded-xl border border-[#D4D9DE] p-4 sm:flex-row sm:items-center"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/attractions/${attraction._id}`}
                      className="h-[68px] w-[103px] shrink-0 rounded-lg bg-[#D6DEE0]"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <Link
                        href={`/attractions/${attraction._id}`}
                        className="text-sm font-semibold text-[#1A1F24] hover:text-[#0A786E]"
                      >
                        {attraction.name}
                      </Link>

                      <p className="mt-2 text-xs text-[#636E75]">
                        {attraction.category} · {attraction.location}
                      </p>

                      <span className="mt-3 inline-block rounded-full bg-[#E3F5F2] px-4 py-1.5 text-xs font-semibold text-[#0A786E]">
                        Saved
                      </span>
                    </div>

                    {/* Remove */}
                    <RemoveAttractionButton
                      itineraryId={itinerary._id.toString()}
                      attractionId={attraction._id.toString()}
                    />
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Trip overview */}
          <aside className="h-fit rounded-[14px] border border-[#D4D9DE] bg-white p-8">
            <h2 className="text-[22px] font-semibold text-[#1A1F24]">
              Trip overview
            </h2>

            <div className="mt-6 rounded-xl bg-[#F6F8F9] p-7">
              <p className="font-semibold text-[#1A1F24]">
                {savedAttractions.length} attractions planned
              </p>

              <p className="mt-3 text-sm text-[#636E75]">
                {savedAttractions.length === 0
                  ? "Add attractions to start planning your trip."
                  : "Your itinerary is ready to review."}
              </p>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-[#1A1F24]">
                Quick actions
              </p>

              <Link
                href="/explore"
                className="mt-4 flex h-[42px] items-center justify-center rounded-lg bg-[#0A786E] text-sm font-semibold text-white"
              >
                Add another attraction
              </Link>

              <Link
                href="/explore"
                className="mt-3 flex h-[42px] items-center justify-center rounded-lg border border-[#D4D9DE] text-sm font-semibold text-[#1A1F24]"
              >
                Back to destinations
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
