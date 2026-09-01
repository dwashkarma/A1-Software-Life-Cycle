import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Destination from "@/models/Destinations";
import Attraction from "@/models/Attraction";
import User from "@/models/Users";

export default async function AdminDashboardPage() {
  await connectDB();
  const destinationCount = await Destination.countDocuments();
  const attractionCount = await Attraction.countDocuments();
  const userCount = await User.countDocuments();
  const recentAttractions = await Attraction.find()
    .populate("destination")
    .limit(3)
    .sort({ createdAt: -1 });
  return (
    <div className="min-h-screen bg-[#F6F8F9] w-full">
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Heading */}
        <section>
          <h1 className="mt-2 text-3xl font-bold text-[#1A1F24]">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-[#636E75]">
            Manage attraction information available to travellers.
          </p>
        </section>

        {/* Summary cards */}
        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-[#D4D9DE] bg-white p-6">
            <p className="text-sm text-[#636E75]">Destinations</p>

            <p className="mt-3 text-3xl font-bold text-[#1A1F24]">
              {destinationCount}
            </p>
          </div>

          <div className="rounded-xl border border-[#D4D9DE] bg-white p-6">
            <p className="text-sm text-[#636E75]">Attractions</p>

            <p className="mt-3 text-3xl font-bold text-[#1A1F24]">
              {attractionCount}
            </p>
          </div>

          <div className="rounded-xl border border-[#D4D9DE] bg-white p-6">
            <p className="text-sm text-[#636E75]">Users</p>

            <p className="mt-3 text-3xl font-bold text-[#1A1F24]">
              {userCount}
            </p>
          </div>
        </section>

        {/* Attraction management */}
        <section className="mt-10 rounded-xl border border-[#D4D9DE] bg-white p-7">
          <h2 className="text-xl font-semibold text-[#1A1F24]">
            Attraction Management
          </h2>

          <p className="mt-2 text-sm text-[#636E75]">
            Manage the places travellers can discover.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/admin/attractions"
              className="flex h-11 items-center rounded-lg bg-[#0A786E] px-6 text-sm font-semibold text-white"
            >
              Manage Attractions
            </Link>

            <Link
              href="/admin/attractions/create"
              className="flex h-11 items-center rounded-lg border border-[#D4D9DE] px-6 text-sm font-semibold text-[#1A1F24]"
            >
              + Add Attraction
            </Link>
          </div>
        </section>

        {/* Recent attractions */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-[#1A1F24]">
            Recent Attractions
          </h2>

          <div className="mt-5 overflow-hidden rounded-xl border border-[#D4D9DE] bg-white">
            {recentAttractions.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-[#636E75]">
                No attractions yet. Create your first attraction to get started.
              </div>
            ) : (
              recentAttractions.map((attraction: any) => {
                const destinationName =
                  attraction.destination &&
                  typeof attraction.destination === "object"
                    ? attraction.destination.name
                    : "Unknown";
                return (
                  <div
                    key={attraction._id.toString()}
                    className="grid gap-3 border-b border-[#E5E8EA] px-6 py-5 last:border-b-0 md:grid-cols-3"
                  >
                    <p className="font-semibold text-[#1A1F24]">
                      {attraction.name}
                    </p>

                    <p className="text-sm text-[#636E75]">{destinationName}</p>

                    <p className="text-sm text-[#636E75]">
                      {attraction.category}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
