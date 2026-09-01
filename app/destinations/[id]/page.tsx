import Link from "next/link";
import { notFound } from "next/navigation";

import { connectDB } from "@/lib/mongodb";
import Attraction from "@/models/Attraction";
import Destination from "@/models/Destinations";

export default async function DestinationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectDB();
  const { id } = await params;

  const destination = await Destination.findById(id);

  if (!destination) {
    notFound();
  }

  const attractions = await Attraction.find({
    destination: destination._id,
  }).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen bg-[#F6F8F9]">
      <main className="px-6 mx-auto max-w-7xl py-10 grid gap-6">
        <section className="flex h-98 w-full items-center justify-center rounded-[14px] bg-[#D6DEE0]">
          <span className="text-sm font-medium text-[#636E75]">
            {destination.image ? "Destination image" : "Destination image"}
          </span>
        </section>

        <section>
          <div className="flex items-center gap-5">
            <h1 className="text-[30px] font-bold text-[#1A1F24]">
              {destination.name}
            </h1>

            <span className="rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-primary">
              {destination.state}
            </span>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-[#636E75]">
            {destination.description}
          </p>
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-semibold text-[#1A1F24]">
            Top attractions
          </h2>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {attractions.length === 0 ? (
              <div className="col-span-full rounded-xl border border-[#D4D9DE] bg-white p-6 text-center text-sm text-[#636E75]">
                No attractions available in this destination yet.
              </div>
            ) : (
              attractions.map((attraction: any) => (
                <article
                  key={attraction._id.toString()}
                  className="flex min-h-20 items-center justify-between rounded-xl border border-[#D4D9DE] bg-white p-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 shrink-0 rounded-lg bg-[#D6DEE0]" />

                    <div>
                      <h3 className="text-sm font-semibold text-[#1A1F24]">
                        {attraction.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#636E75]">
                        {attraction.category}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/attractions/${attraction._id}`}
                    className="flex h-8 items-center justify-center rounded-lg border border-[#D4D9DE] px-4 text-xs font-semibold text-[#1A1F24] transition hover:border-[#0A786E] hover:text-[#0A786E]"
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
