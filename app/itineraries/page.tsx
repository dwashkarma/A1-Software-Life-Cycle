import Link from "next/link";

const itineraries = [
  {
    id: "brisbane-weekend",
    name: "Brisbane Weekend",
    destination: "Brisbane",
    travelDates: "20–22 Sep 2026",
    attractions: 3,
    status: "Active trip",
  },
];

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

export default function MyItineraryPage() {
  return (
    <div className="min-h-screen   bg-background">
      <main className="mx-auto py-10  px-6 max-w-7xl">
        {/* Header */}
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
            className="flex h-[42px] w-[190px] items-center justify-center rounded-[9px] bg-[#0A786E] text-[13px] font-semibold text-white transition hover:bg-[#08675F]"
          >
            + Add Itinerary
          </Link>
        </div>

        {/* Itineraries */}
        <section className="mt-10 max-w-[1264px]">
          {itineraries.map((itinerary) => (
            <article
              key={itinerary.id}
              className="rounded-[14px] border border-[#D4D9DE] bg-white px-6 py-6"
            >
              <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr_1.2fr_1.2fr_160px] lg:items-center">
                {/* Trip name */}
                <div>
                  <h2 className="text-[22px] font-semibold text-[#1A1F24]">
                    {itinerary.name}
                  </h2>

                  <p className="mt-3 text-[11px] font-semibold text-[#0A786E]">
                    {itinerary.status}
                  </p>
                </div>

                {/* Destination */}
                <div>
                  <p className="text-[11px] font-semibold text-[#636E75]">
                    Destination
                  </p>

                  <p className="mt-2 text-[14px] font-semibold text-[#1A1F24]">
                    {itinerary.destination}
                  </p>
                </div>

                {/* Travel dates */}
                <div>
                  <p className="text-[11px] font-semibold text-[#636E75]">
                    Travel dates
                  </p>

                  <p className="mt-2 text-[14px] font-semibold text-[#1A1F24]">
                    {itinerary.travelDates}
                  </p>
                </div>

                {/* Attractions */}
                <div>
                  <p className="text-[11px] font-semibold text-[#636E75]">
                    Saved attractions
                  </p>

                  <p className="mt-2 text-[14px] font-semibold text-[#1A1F24]">
                    {itinerary.attractions} places
                  </p>
                </div>

                {/* Edit button */}
                <Link
                  href={`/itineraries/${itinerary.id}`}
                  className="flex h-[42px] w-full items-center justify-center rounded-[9px] border border-[#D4D9DE] bg-white text-[13px] font-semibold text-[#1A1F24] transition hover:border-[#0A786E] hover:text-[#0A786E]"
                >
                  Edit trip
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* Saved attractions + Trip overview */}
        <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,2.5fr)_minmax(320px,1fr)]">
          {/* Saved Attractions */}
          <div className="rounded-[14px] border border-[#D4D9DE] bg-white p-8">
            <h2 className="text-[22px] font-semibold text-[#1A1F24]">
              Saved attractions
            </h2>

            <p className="mt-2 text-sm text-[#636E75]">
              These are the places currently included in this itinerary.
            </p>

            <div className="mt-7 space-y-3">
              {savedAttractions.map((attraction) => (
                <div
                  key={attraction.id}
                  className="flex flex-col gap-4 rounded-xl border border-[#D4D9DE] bg-white p-4 sm:flex-row sm:items-center"
                >
                  {/* Image placeholder */}
                  <div className="h-[68px] w-[103px] shrink-0 rounded-lg bg-[#D6DEE0]" />

                  {/* Attraction information */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#1A1F24]">
                      {attraction.name}
                    </h3>

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
                    className="h-[42px] rounded-lg border border-[#D4D9DE] px-8 text-sm font-semibold text-[#1A1F24] transition  hover:bg-red-700 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trip Overview */}
          <aside className="rounded-[14px] border border-[#D4D9DE] bg-white p-8">
            <h2 className="text-[22px] font-semibold text-[#1A1F24]">
              Trip overview
            </h2>

            {/* Summary */}
            <div className="mt-6 rounded-xl bg-[#F6F8F9] p-7">
              <p className="text-base font-semibold text-[#1A1F24]">
                3 attractions planned
              </p>

              <p className="mt-3 text-sm text-[#636E75]">
                Your itinerary is ready to review.
              </p>
            </div>

            {/* Quick actions */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-[#1A1F24]">
                Quick actions
              </h3>

              <div className="mt-4 space-y-3">
                <Link
                  href="/destinations"
                  className="flex h-[42px] w-full items-center justify-center rounded-lg bg-[#0A786E] text-sm font-semibold text-white transition hover:bg-primary"
                >
                  Add another attraction
                </Link>

                <Link
                  href="/destinations"
                  className="flex h-[42px] w-full items-center justify-center rounded-lg border border-[#D4D9DE] bg-white text-sm font-semibold text-[#1A1F24] transition hover:border-primary hover:text-primary"
                >
                  Back to destinations
                </Link>
              </div>
            </div>

            {/* Success state example */}
            {/* <div className="mt-5 rounded-lg bg-[#E3F5F2] px-5 py-3 text-xs font-medium text-[#0A786E]">
              Attraction removed successfully
            </div> */}
          </aside>
        </section>
      </main>
    </div>
  );
}
