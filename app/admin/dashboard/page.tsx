import Link from "next/link";

const recentAttractions = [
  {
    id: "south-bank",
    name: "South Bank Parklands",
    destination: "Brisbane",
    category: "Park",
  },
  {
    id: "story-bridge",
    name: "Story Bridge",
    destination: "Brisbane",
    category: "Landmark",
  },
  {
    id: "lone-pine",
    name: "Lone Pine Koala Sanctuary",
    destination: "Brisbane",
    category: "Wildlife",
  },
];

export default function AdminDashboardPage() {
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

            <p className="mt-3 text-3xl font-bold text-[#1A1F24]">3</p>
          </div>

          <div className="rounded-xl border border-[#D4D9DE] bg-white p-6">
            <p className="text-sm text-[#636E75]">Attractions</p>

            <p className="mt-3 text-3xl font-bold text-[#1A1F24]">5</p>
          </div>

          <div className="rounded-xl border border-[#D4D9DE] bg-white p-6">
            <p className="text-sm text-[#636E75]">Users</p>

            <p className="mt-3 text-3xl font-bold text-[#1A1F24]">12</p>
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
            {recentAttractions.map((attraction) => (
              <div
                key={attraction.id}
                className="grid gap-3 border-b border-[#E5E8EA] px-6 py-5 last:border-b-0 md:grid-cols-3"
              >
                <p className="font-semibold text-[#1A1F24]">
                  {attraction.name}
                </p>

                <p className="text-sm text-[#636E75]">
                  {attraction.destination}
                </p>

                <p className="text-sm text-[#636E75]">{attraction.category}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
