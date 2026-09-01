import AdminSideBar from "@/components/admin-sidebar";
import Link from "next/link";

const attractions = [
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
  {
    id: "surfers-paradise",
    name: "Surfers Paradise",
    destination: "Gold Coast",
    category: "Beach",
  },
  {
    id: "noosa-main-beach",
    name: "Noosa Main Beach",
    destination: "Sunshine Coast",
    category: "Beach",
  },
];

export default function AdminAttractionsPage() {
  return (
    <div className="flex min-h-screen bg-[#F6F8F9] w-full">
      {/* Main */}
      <main className="flex-1 px-12 py-12">
        {/* Heading */}
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

        {/* Search and filters */}
        <section className="mt-10 flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search attractions..."
            className="h-[53px] max-w-[705px] flex-1 rounded-lg border border-[#D4D9DE] bg-white px-5 text-sm outline-none focus:border-[#0A786E]"
          />

          <select className="h-10 rounded-lg border border-[#D4D9DE] bg-white px-4 text-sm">
            <option>Brisbane</option>
            <option>Gold Coast</option>
            <option>Sunshine Coast</option>
          </select>

          <select className="h-10 rounded-lg border border-[#D4D9DE] bg-white px-4 text-sm">
            <option>All categories</option>
            <option>Park</option>
            <option>Landmark</option>
            <option>Wildlife</option>
            <option>Beach</option>
          </select>
        </section>

        {/* Table */}
        <section className="mt-10 overflow-hidden rounded-xl border border-[#D4D9DE] bg-white">
          {/* Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-[#D4D9DE] bg-[#F6F8F9] px-6 py-4 text-sm font-semibold text-[#636E75]">
            <span>Attraction</span>
            <span>Destination</span>
            <span>Category</span>
            <span>Actions</span>
          </div>

          {/* Rows */}
          {attractions.map((attraction) => (
            <div
              key={attraction.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center border-b border-[#E5E8EA] px-6 py-5 last:border-b-0"
            >
              <p className="font-semibold text-[#1A1F24]">{attraction.name}</p>

              <p className="text-sm text-[#636E75]">{attraction.destination}</p>

              <p className="text-sm text-[#636E75]">{attraction.category}</p>

              <div className="flex gap-3">
                <Link
                  href={`/admin/attractions/${attraction.id}/edit`}
                  className="flex h-10 items-center rounded-lg border border-[#D4D9DE] px-5 text-sm font-semibold text-[#1A1F24] hover:border-[#0A786E]"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  className="h-10 rounded-lg border border-red-200 px-5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
