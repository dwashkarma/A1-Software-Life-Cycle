import Link from "next/link";

const destinations = [
  {
    id: "brisbane",
    name: "Brisbane",
    description: "River walks, culture, food and city attractions.",
  },
  {
    id: "gold-coast",
    name: "Gold Coast",
    description: "Beaches, entertainment and family activities.",
  },
  {
    id: "sunshine-coast",
    name: "Sunshine Coast",
    description: "Coastal towns, beaches and hinterland escapes.",
  },
];

const attractions = [
  {
    id: "south-bank",
    name: "South Bank Parklands",
    location: "Brisbane",
    category: "Park",
  },
  {
    id: "story-bridge",
    name: "Story Bridge",
    location: "Brisbane",
    category: "Landmark",
  },
  {
    id: "lone-pine",
    name: "Lone Pine",
    location: "Brisbane",
    category: "Wildlife",
  },
];

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-10 grid gap-6">
        <section className="grid gap-4">
          <h1 className="text-3xl font-bold text-[#1A1F24]">
            Where do you want to go?
          </h1>

          <p className=" text-sm text-[#636E75]">
            Discover a destination, then add attractions to your trip.
          </p>
        </section>

        {/* Search */}
        <section className="">
          <div className="flex max-w-4xl  gap-4 flex-row items-center">
            <input
              type="text"
              placeholder="Search Brisbane, Gold Coast, Sunshine Coast..."
              className="h-10 flex-1 p-2 rounded-xl border border-secondary bg-white px-5 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <button
              type="button"
              className="h-9 rounded-lg bg-primary px-10 text-sm font-semibold text-white "
            >
              Search
            </button>
          </div>
        </section>

        <section className="">
          <h2 className="text-xl font-semibold text-[#1A1F24]">
            Popular destinations
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <article
                key={destination.id}
                className="rounded-xl border border-[#D4D9DE] bg-white p-3"
              >
                {/* Image placeholder */}
                <div className="flex h-[122px] items-center rounded-[10px] bg-[#D6DEE0] px-4">
                  <span className="text-xs font-semibold text-[#636E75]">
                    Destination photo
                  </span>
                </div>

                <div className="px-1 pt-3">
                  <h3 className="text-lg font-semibold text-[#1A1F24]">
                    {destination.name}
                  </h3>

                  <p className="mt-1 text-xs text-[#636E75]">
                    {destination.description}
                  </p>

                  <Link
                    href={`/destinations/${destination.id}`}
                    className="mt-4 flex h-11 items-center justify-center rounded-lg border border-[#D4D9DE] text-sm font-semibold text-[#1A1F24] transition hover:border-primary hover:text-primary"
                  >
                    Explore
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Suggested attractions */}
        <section className="">
          <h2 className="text-xl font-semibold text-[#1A1F24]">
            Suggested attractions
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {attractions.map((attraction) => (
              <article
                key={attraction.id}
                className="flex min-h-[94px] items-center gap-4 rounded-xl border border-[#D4D9DE] bg-white p-3"
              >
                {/* Attraction image placeholder */}
                <Link
                  href={`/attractions/${attraction.id}`}
                  className="h-[70px] w-[70px] shrink-0 rounded-lg bg-[#D6DEE0]"
                />

                <div>
                  <Link
                    href={`/attractions/${attraction.id}`}
                    className="text-sm font-semibold text-[#1A1F24] hover:text-primary"
                  >
                    {attraction.name}
                  </Link>

                  <p className="mt-2 text-xs text-[#636E75]">
                    {attraction.location} · {attraction.category}
                  </p>

                  <button
                    type="button"
                    className="mt-2 rounded-full bg-[#E3F5F2] px-4 py-1.5 text-xs font-semibold text-primary"
                  >
                    Add to trip
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
