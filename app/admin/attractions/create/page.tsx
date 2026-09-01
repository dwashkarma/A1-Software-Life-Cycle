import Link from "next/link";

export default function AddAttractionPage() {
  return (
    <div className="flex min-h-screen bg-[#F6F8F9] w-full">
      {/* Main content */}
      <main className="flex-1 px-12 py-10">
        <p>
          <Link
            href="/admin/attractions"
            className="hover:text-primary text-sm font-light text-[#0A786E]"
          >
            Back to attractions
          </Link>
        </p>
        {/* Heading */}
        <section>
          <h1 className="text-[30px] font-bold text-[#1A1F24]">
            Add Attractions
          </h1>

          <p className="mt-2 text-[13px] text-[#636E75]">
            Create traveller-facing attraction information.
          </p>
        </section>

        <div className="mt-10 flex gap-8">
          {/* Form card */}
          <section className="w-full max-w-[1066px] rounded-2xl border border-[#D4D9DE] bg-white p-10">
            <form>
              {/* Attraction name */}
              <div className="max-w-[676px]">
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-semibold text-[#1A1F24]"
                >
                  Attraction name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="South Bank Parklands"
                  className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-[13px] text-[#636E75] outline-none focus:border-[#0A786E]"
                />
              </div>

              {/* Destination + Category */}
              <div className="mt-8 grid max-w-[676px] gap-7 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="destination"
                    className="mb-2 block text-xs font-semibold text-[#1A1F24]"
                  >
                    Destination
                  </label>

                  <select
                    id="destination"
                    className="h-11 w-full rounded-lg border border-[#D4D9DE] bg-white px-4 text-[13px] text-[#636E75] outline-none focus:border-[#0A786E]"
                  >
                    <option>Brisbane</option>
                    <option>Gold Coast</option>
                    <option>Sunshine Coast</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-xs font-semibold text-[#1A1F24]"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    className="h-11 w-full rounded-lg border border-[#D4D9DE] bg-white px-4 text-[13px] text-[#636E75] outline-none focus:border-[#0A786E]"
                  >
                    <option>Park</option>
                    <option>Landmark</option>
                    <option>Wildlife</option>
                    <option>Beach</option>
                    <option>Museum</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="mt-8 max-w-[676px]">
                <label
                  htmlFor="location"
                  className="mb-2 block text-xs font-semibold text-[#1A1F24]"
                >
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  placeholder="South Brisbane, QLD"
                  className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-[13px] text-[#636E75] outline-none focus:border-[#0A786E]"
                />
              </div>

              {/* Description */}
              <div className="mt-8 max-w-[676px]">
                <label
                  htmlFor="description"
                  className="mb-2 block text-xs font-semibold text-[#1A1F24]"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  rows={4}
                  placeholder="A riverside parkland and cultural precinct..."
                  className="w-full resize-none rounded-lg border border-[#D4D9DE] px-4 py-4 text-[13px] text-[#636E75] outline-none focus:border-[#0A786E]"
                />
              </div>

              {/* Buttons */}
              <div className="mt-10 flex gap-4">
                <button
                  type="button"
                  className="h-11 w-[200px] rounded-[9px] bg-[#0A786E] text-[13px] font-semibold text-white transition hover:bg-[#08675F]"
                >
                  Save attraction
                </button>

                <Link
                  href="/admin/attractions"
                  className="flex h-11 w-[140px] items-center justify-center rounded-[9px] border border-[#D4D9DE] bg-white text-[13px] font-semibold text-[#1A1F24]"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </section>

          {/* Image section */}
          <aside className="w-[250px] shrink-0">
            <div className="flex h-[250px] items-center justify-center rounded-[14px] bg-[#EDF2F2]">
              <p className="text-[13px] font-semibold text-[#636E75]">
                Image placeholder
              </p>
            </div>

            <button
              type="button"
              className="mx-auto mt-6 flex h-11 w-[190px] items-center justify-center rounded-[9px] border border-[#D4D9DE] bg-white text-[13px] font-semibold text-[#1A1F24]"
            >
              Upload image
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
