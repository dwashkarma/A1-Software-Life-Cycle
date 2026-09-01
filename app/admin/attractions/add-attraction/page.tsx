import Link from "next/link";

export default function EditItineraryPage() {
  return (
    <div className="min-h-screen bg-[#F6F8F9]">
      <main className="px-8 py-12 lg:px-[58px]">
        <h1 className="text-[30px] font-bold text-[#1A1F24]">Edit Trip</h1>

        <p className="mt-2 text-sm text-[#636E75]">
          Update your itinerary information.
        </p>

        <section className="mt-10 max-w-[900px] rounded-2xl border border-[#D4D9DE] bg-white p-10">
          <form className="space-y-8">
            {/* Trip name */}
            <div>
              <label
                htmlFor="tripName"
                className="mb-2 block text-sm font-semibold text-[#1A1F24]"
              >
                Trip name
              </label>

              <input
                id="tripName"
                type="text"
                defaultValue="Brisbane Weekend"
                className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-sm outline-none focus:border-[#0A786E]"
              />
            </div>

            {/* Destination */}
            <div>
              <label
                htmlFor="destination"
                className="mb-2 block text-sm font-semibold text-[#1A1F24]"
              >
                Destination
              </label>

              <select
                id="destination"
                defaultValue="Brisbane"
                className="h-11 w-full rounded-lg border border-[#D4D9DE] bg-white px-4 text-sm"
              >
                <option>Brisbane</option>
                <option>Gold Coast</option>
                <option>Sunshine Coast</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-semibold text-[#1A1F24]"
                >
                  Start date
                </label>

                <input
                  id="startDate"
                  type="date"
                  defaultValue="2026-09-20"
                  className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="mb-2 block text-sm font-semibold text-[#1A1F24]"
                >
                  End date
                </label>

                <input
                  id="endDate"
                  type="date"
                  defaultValue="2026-09-22"
                  className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                className="h-11 rounded-lg bg-[#0A786E] px-8 text-sm font-semibold text-white"
              >
                Update trip
              </button>

              <Link
                href="/itineraries/brisbane-weekend"
                className="flex h-11 items-center rounded-lg border border-[#D4D9DE] px-8 text-sm font-semibold text-[#1A1F24]"
              >
                Cancel
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
