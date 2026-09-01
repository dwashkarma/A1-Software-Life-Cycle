import Link from "next/link";

export default function CreateItineraryPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 py-10 max-w-7xl mx-auto grid gap-6">
        {/* Heading */}
        <div>
          <h1 className="text-[30px] font-bold text-[#1A1F24]">
            Create a new Trip
          </h1>

          <p className="text-sm text-[#636E75]">
            Give your itinerary a name and travel date.
          </p>
        </div>

        <div className=" grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          {/* Form */}
          <section className="rounded-[14px] border border-[#D4D9DE] bg-white p-10">
            <form className="space-y-8">
              {/* Trip name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1A1F24]">
                  Trip name
                </label>

                <input
                  type="text"
                  placeholder="Brisbane Weekend"
                  className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-sm outline-none focus:border-[#0A786E]"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1A1F24]">
                  Destination
                </label>

                <select className="h-11 w-full rounded-lg border border-[#D4D9DE] bg-white px-4 text-sm outline-none focus:border-[#0A786E]">
                  <option>Brisbane</option>
                  <option>Gold Coast</option>
                  <option>Sunshine Coast</option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1A1F24]">
                    Start date
                  </label>

                  <input
                    type="date"
                    className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-sm outline-none focus:border-[#0A786E]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1A1F24]">
                    End date
                  </label>

                  <input
                    type="date"
                    className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-sm outline-none focus:border-[#0A786E]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="h-11 rounded-lg bg-[#0A786E] px-8 text-sm font-semibold text-white hover:bg-[#08675F]"
                >
                  Create trip
                </button>

                <Link
                  href="/itineraries"
                  className="flex h-11 items-center rounded-lg border border-[#D4D9DE] px-8 text-sm font-semibold text-[#1A1F24]"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </section>

          {/* What happens next */}
          <aside className="h-fit rounded-[14px] border border-[#D4D9DE] bg-white p-8">
            <h2 className="text-lg font-semibold text-[#1A1F24]">
              What happens next?
            </h2>

            <div className="mt-6 space-y-5 text-sm text-[#636E75]">
              <p>
                <span className="mr-2 font-semibold text-[#0A786E]">1</span>
                Your itinerary is created
              </p>

              <p>
                <span className="mr-2 font-semibold text-[#0A786E]">2</span>
                Add attractions from your destination
              </p>

              <p>
                <span className="mr-2 font-semibold text-[#0A786E]">3</span>
                Review your saved attractions
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
