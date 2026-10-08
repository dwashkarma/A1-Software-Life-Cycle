import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { decodeSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Attraction from "@/models/Attraction";
import DeleteAttractionButton from "@/components/admin-delete-button";
import AttractionLifecycleActions from "@/components/attraction-action-button";

export default async function AdminAttractionsPage() {
  await connectDB();

  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get("travel_mate_session")?.value);

  if (!session || session.role !== "admin") {
    redirect("/authentication/login");
  }

  const attractions = await Attraction.find()
    .populate("destination")
    .sort({ createdAt: -1 });

  console.log(attractions);
  return (
    <div className="flex min-h-screen bg-[#F6F8F9] w-full">
      <main className="flex-1 px-12 py-12">
        <section className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1F24]">Attractions</h1>

            <p className="mt-2 text-sm text-[#636E75]">
              Manage the places that travellers can discover.
            </p>
          </div>

          <Link
            href="/admin/attractions/create"
            className="flex h-12 items-center rounded-lg bg-[#0A786E] px-8 text-sm font-semibold text-white hover:bg-[#08675F]"
          >
            + Add attraction
          </Link>
        </section>

        <section className="mt-10 overflow-hidden rounded-xl border border-[#D4D9DE] bg-white">
          {attractions.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-[#636E75]">
              No attractions found. Create your first attraction to get started.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] border-b border-[#D4D9DE] bg-[#F6F8F9] px-6 py-4 text-sm font-semibold text-[#636E75]">
                <span>Attraction</span>
                <span>Destination</span>
                <span>Category</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {attractions.map((attraction: any) => {
                const destinationName =
                  attraction.destination &&
                  typeof attraction.destination === "object"
                    ? attraction.destination.name
                    : "Unknown";

                return (
                  <div
                    key={attraction._id.toString()}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] items-center border-b border-[#E5E8EA] px-6 py-5 last:border-b-0"
                  >
                    <p className="font-semibold text-[#1A1F24]">
                      {attraction.name}
                    </p>

                    <p className="text-sm text-[#636E75]">{destinationName}</p>

                    <p className="text-sm text-[#636E75]">
                      {attraction.category}
                    </p>
                    {attraction.status || "null"}

                    <div className="flex gap-3">
                      <Link
                        href={`/admin/attractions/${attraction._id}/edit`}
                        className="flex h-10 items-center rounded-lg border border-[#D4D9DE] px-5 text-sm font-semibold text-[#1A1F24] hover:border-[#0A786E]"
                      >
                        Edit
                      </Link>

                      <AttractionLifecycleActions
                        status={attraction.status || "DRAFT"}
                        attractionId={attraction?._id}
                      />

                      <DeleteAttractionButton
                        attractionId={attraction._id.toString()}
                      />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
