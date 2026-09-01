import Link from "next/link";

const savedAttractions = [
  {
    id: "south-bank",
    name: "South Bank Parklands",
    category: "Park",
    location: "South Brisbane",
  },
  {
    id: "lone-pine",
    name: "Lone Pine Koala Sanctuary",
    category: "Wildlife",
    location: "Fig Tree Pocket",
  },
  {
    id: "story-bridge",
    name: "Story Bridge",
    category: "Landmark",
    location: "Kangaroo Point",
  },
];

export default function ItineraryDetailsPage() {
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
                Brisbane Weekend
              </h1>

              <span className="rounded-full bg-[#E3F5F2] px-4 py-1.5 text-xs font-semibold text-[#0A786E]">
                Active trip
              </span>
            </div>

            <p className="mt-2 text-sm text-[#636E75]">
              Brisbane · 20–22 Sep 2026
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/destinations"
              className="flex h-11 items-center rounded-lg bg-[#0A786E] px-6 text-sm font-semibold text-white"
            >
              + Add attraction
            </Link>

            <button
              type="button"
              className="h-11 rounded-lg border border-[#D4D9DE] bg-white px-6 text-sm font-semibold text-[#1A1F24]"
            >
              Edit trip
            </button>
          </div>
        </section>

        {/* Trip summary */}
        <section className="mt-8 grid gap-5 rounded-[14px] border border-[#D4D9DE] bg-white p-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-[#636E75]">Destination</p>
            <p className="mt-2 text-sm font-semibold text-[#1A1F24]">
              Brisbane
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#636E75]">Travel dates</p>
            <p className="mt-2 text-sm font-semibold text-[#1A1F24]">
              20–22 Sep 2026
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

            <div className="mt-7 space-y-3">
              {savedAttractions.map((attraction) => (
                <article
                  key={attraction.id}
                  className="flex flex-col gap-4 rounded-xl border border-[#D4D9DE] p-4 sm:flex-row sm:items-center"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/attractions/${attraction.id}`}
                    className="h-[68px] w-[103px] shrink-0 rounded-lg bg-[#D6DEE0]"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <Link
                      href={`/attractions/${attraction.id}`}
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
                  <button
                    type="button"
                    className="h-[42px] rounded-lg border border-[#D4D9DE] px-8 text-sm font-semibold text-[#1A1F24] transition hover:border-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
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
                Your itinerary is ready to review.
              </p>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-[#1A1F24]">
                Quick actions
              </p>

              <Link
                href="/destinations"
                className="mt-4 flex h-[42px] items-center justify-center rounded-lg bg-[#0A786E] text-sm font-semibold text-white"
              >
                Add another attraction
              </Link>

              <Link
                href="/destinations"
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
