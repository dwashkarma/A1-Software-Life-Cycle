import Link from "next/link";

const relatedAttractions = [
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

export default function AttractionDetailsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 max-w-7xl mx-auto py-10 grid gap-6">
        {/* Attraction image */}
        <section className="flex h-98 w-full items-center justify-center rounded-[14px] bg-[#D6DEE0]">
          <span className="text-sm font-medium text-[#636E75]">
            Attraction image
          </span>
        </section>

        <section className="gap-6 grid">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div>
              <h1 className="text-[32px] font-bold text-[#1A1F24]">
                South Bank Parklands
              </h1>

              {/* Category + Destination */}
              <div className=" flex gap-3">
                <span className="rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-primary">
                  Park
                </span>

                <span className="rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-foreground">
                  Brisbane
                </span>
              </div>
            </div>

            {/* Add button */}
            <Link
              href="/itineraries"
              className="flex h-11 w-[230px] items-center justify-center rounded-lg bg-[#0A786E] text-sm font-semibold text-white transition hover:bg-[#08675F]"
            >
              Add to Itinerary
            </Link>
          </div>

          {/* Description */}
          <p className=" max-w-4xl text-sm leading-6 text-[#636E75]">
            A riverside cultural and recreational precinct with gardens, dining,
            walking paths and public spaces.
          </p>
        </section>

        {/* Location / suggested visit */}
        <section className=" max-w-[760px] rounded-xl border border-[#D4D9DE] bg-white p-6">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-[#636E75]">Location</p>

              <p className="mt-3 text-sm font-semibold text-[#1A1F24]">
                South Brisbane, Queensland
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#636E75]">
                Suggested visit
              </p>

              <p className="mt-3 text-sm font-semibold text-[#1A1F24]">
                1–2 hours
              </p>
            </div>
          </div>
        </section>

        {/* Related attractions */}
        <section className="grid gap-4">
          <h2 className="text-xl font-semibold text-[#1A1F24]">
            Related attractions
          </h2>

          <div className=" grid  gap-5 md:grid-cols-2">
            {relatedAttractions.map((attraction) => (
              <article
                key={attraction.id}
                className="flex min-h-[82px] items-center justify-between rounded-xl border border-[#D4D9DE] bg-white p-3"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="h-[58px] w-[58px] shrink-0 rounded-lg bg-[#D6DEE0]" />

                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1F24]">
                      {attraction.name}
                    </h3>

                    <p className="mt-2 text-xs text-[#636E75]">
                      Brisbane · {attraction.category}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/attractions/${attraction.id}`}
                  className="flex h-11 items-center justify-center rounded-lg border border-[#D4D9DE] px-8 text-sm font-semibold text-[#1A1F24] transition hover:border-[#0A786E] hover:text-[#0A786E]"
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
