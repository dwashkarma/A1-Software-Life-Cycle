import Link from "next/link";
import { notFound } from "next/navigation";

import { connectDB } from "@/lib/mongodb";
import Attraction from "@/models/Attraction";
import AddToItineraryModal from "@/components/add-to-itinerary-modal";
import Image from "next/image";

export default async function AttractionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectDB();
  const { id } = await params;

  const attraction = await Attraction.findById(id).populate("destination");

  if (!attraction) {
    notFound();
  }

  const relatedAttractions = await Attraction.find({
    destination: attraction.destination?._id,
    _id: { $ne: attraction._id },
  })
    .limit(3)
    .sort({ createdAt: -1 });

  console.log(attraction);
  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 max-w-7xl mx-auto py-10 grid gap-6">
        <section className="flex h-98 w-full items-center justify-center rounded-[14px] bg-[#D6DEE0]">
          {attraction?.image ? (
            <img
              src={attraction?.image}
              alt="Attraction preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <p className="text-[13px] font-semibold text-[#636E75]">
              Image placeholder
            </p>
          )}
        </section>

        <section className="gap-6 grid">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div>
              <h1 className="text-[32px] font-bold text-[#1A1F24]">
                {attraction.name}
              </h1>

              <div className="flex gap-3 mt-3">
                <span className="rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-primary">
                  {attraction.category}
                </span>

                <span className="rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-foreground">
                  {attraction.destination?.name || "Unknown destination"}
                </span>
              </div>
            </div>

            <AddToItineraryModal attractionId={attraction._id.toString()} />
          </div>

          <p className="max-w-4xl text-sm leading-6 text-[#636E75]">
            {attraction.description}
          </p>
        </section>

        <section className="max-w-190 rounded-xl border border-[#D4D9DE] bg-white p-6">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-[#636E75]">Location</p>
              <p className="mt-3 text-sm font-semibold text-[#1A1F24]">
                {attraction.location}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#636E75]">
                Destination
              </p>
              <p className="mt-3 text-sm font-semibold text-[#1A1F24]">
                {attraction.destination?.name || "Unknown destination"}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-semibold text-[#1A1F24]">
            Related attractions
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {relatedAttractions.length === 0 ? (
              <div className="col-span-full rounded-xl border border-[#D4D9DE] bg-white p-6 text-center text-sm text-[#636E75]">
                No related attractions found.
              </div>
            ) : (
              relatedAttractions.map((item: any) => (
                <article
                  key={item._id.toString()}
                  className="flex min-h-20.5 items-center justify-between rounded-xl border border-[#D4D9DE] bg-white p-3"
                >
                  <div className="flex items-center gap-4">
                    {item?.image ? (
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        className="h-15 w-15 object-cover overflow-clip rounded-xl"
                        height={10}
                        width={10}
                      />
                    ) : (
                      <p className="text-[13px] font-semibold text-[#636E75]">
                        Image placeholder
                      </p>
                    )}

                    <div>
                      <h3 className="text-sm font-semibold text-[#1A1F24]">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-xs text-[#636E75]">
                        {item.destination?.name || "Unknown destination"} ·{" "}
                        {item.category}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/attractions/${item._id}`}
                    className="flex h-11 items-center justify-center rounded-lg border border-[#D4D9DE] px-8 text-sm font-semibold text-[#1A1F24] transition hover:border-[#0A786E] hover:text-[#0A786E]"
                  >
                    View
                  </Link>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
