import Link from "next/link";

const attractions = [
  {
    id: "south-bank",
    name: "South Bank Parklands",
    category: "Park",
  },
  {
    id: "story-bridge",
    name: "Story Bridge",
    category: "Landmark",
  },
  {
    id: "lone-pine",
    name: "Lone Pine Koala Sanctuary",
    category: "Wildlife",
  },
];

export default function DestinationDetailsPage() {
  return (
    <div className="min-h-screen bg-[#F6F8F9]">
      <main className="px-6  mx-auto max-w-7xl py-10 grid gap-6">
        {/* Destination image */}
        <section className="flex h-[392px] w-full items-center justify-center rounded-[14px] bg-[#D6DEE0]">
          <span className="text-sm font-medium text-[#636E75]">
            Destination image
          </span>
        </section>

        {/* Destination information */}
        <section className="">
          <div className="flex items-center gap-5">
            <h1 className="text-[30px] font-bold text-[#1A1F24]">Brisbane</h1>

            <span className="rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-primary">
              Queensland
            </span>
          </div>

          <p className=" max-w-3xl text-sm leading-6 text-[#636E75]">
            A vibrant river city with cultural precincts, parks, food and easy
            day trips.
          </p>
        </section>

        {/* Top attractions */}
        <section className="grid gap-4">
          <h2 className="text-xl font-semibold text-[#1A1F24]">
            Top attractions
          </h2>

          <div className=" grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {attractions.map((attraction) => (
              <article
                key={attraction.id}
                className="flex min-h-[80px] items-center justify-between rounded-xl border border-[#D4D9DE] bg-white p-3"
              >
                {/* Left side */}
                <div className="flex items-center gap-4">
                  {/* Image */}
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-[#D6DEE0]" />

                  {/* Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1F24]">
                      {attraction.name}
                    </h3>

                    <p className="mt-1 text-xs text-[#636E75]">
                      {attraction.category}
                    </p>
                  </div>
                </div>

                {/* View button */}
                <Link
                  href={`/attractions/${attraction.id}`}
                  className="flex h-8 items-center justify-center rounded-lg border border-[#D4D9DE] px-4 text-xs font-semibold text-[#1A1F24] transition hover:border-[#0A786E] hover:text-[#0A786E]"
                >
                  View
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
