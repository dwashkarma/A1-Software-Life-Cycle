import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Destination from "@/models/Destinations";
import Attraction from "@/models/Attraction";
import ExploreAttractionCard from "@/components/explore-attraction-card";
import ExploreSearch from "@/components/explore-search";

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await connectDB();
  const { q } = await searchParams;
  const searchQuery = q ? q.trim() : "";

  let destinations;
  let attractions;

  if (searchQuery) {
    // Search both destinations and attractions by name, description, location, etc.
    destinations = await Destination.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { state: { $regex: searchQuery, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    attractions = await Attraction.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });
  } else {
    destinations = await Destination.find().sort({ createdAt: -1 });
    attractions = await Attraction.find().limit(6).sort({ createdAt: -1 });
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-10 grid gap-6">
        <section className="grid gap-4">
          <h1 className="text-3xl font-bold text-[#1A1F24]">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : "Where do you want to go?"}
          </h1>

          <p className=" text-sm text-[#636E75]">
            {searchQuery
              ? `Found ${destinations.length} destinations and ${attractions.length} attractions`
              : "Discover a destination, then add attractions to your trip."}
          </p>
        </section>

        {/* Search */}
        <section className="">
          <ExploreSearch initialQuery={searchQuery} />
        </section>

        <section className="">
          <h2 className="text-xl font-semibold text-[#1A1F24]">
            {searchQuery ? "Destinations" : "Popular destinations"}
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {destinations.length === 0 ? (
              <div className="col-span-full rounded-xl border border-[#D4D9DE] bg-white p-8 text-center text-sm text-[#636E75]">
                {searchQuery
                  ? "No destinations found matching your search."
                  : "No destinations available yet."}
                {searchQuery && (
                  <>
                    <br />
                    <Link
                      href="/explore"
                      className="mt-4 inline-block text-[#0A786E] font-semibold hover:underline"
                    >
                      Clear search
                    </Link>
                  </>
                )}
              </div>
            ) : (
              destinations.map((destination: any) => {
                return (
                  <article
                    key={destination._id.toString()}
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
                        href={`/destinations/${destination._id}`}
                        className="mt-4 flex h-11 items-center justify-center rounded-lg border border-[#D4D9DE] text-sm font-semibold text-[#1A1F24] transition hover:border-primary hover:text-primary"
                      >
                        Explore
                      </Link>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* Suggested attractions */}
        <section className="">
          <h2 className="text-xl font-semibold text-[#1A1F24]">
            {searchQuery ? "Attractions" : "Suggested attractions"}
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {attractions.length === 0 ? (
              <div className="col-span-full rounded-xl border border-[#D4D9DE] bg-white p-8 text-center text-sm text-[#636E75]">
                {searchQuery
                  ? "No attractions found matching your search."
                  : "No attractions available yet."}
                {searchQuery && (
                  <>
                    <br />
                    <Link
                      href="/explore"
                      className="mt-4 inline-block text-[#0A786E] font-semibold hover:underline"
                    >
                      Clear search
                    </Link>
                  </>
                )}
              </div>
            ) : (
              attractions.map((attraction: any) => {
                return (
                  <ExploreAttractionCard
                    key={attraction._id.toString()}
                    attractionId={attraction._id.toString()}
                    attractionName={attraction.name}
                    location={attraction.location}
                    category={attraction.category}
                  />
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
