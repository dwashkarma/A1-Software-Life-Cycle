import Link from "next/link";

export default function EditAttractionPage() {
  return (
    <div className="flex min-h-screen bg-[#F6F8F9]">
      {/* Sidebar */}
      <aside className="w-[238px] shrink-0 bg-[#0A786E] px-5 py-6">
        <Link href="/admin" className="text-[25px] font-bold text-white">
          TRAVELMATE
        </Link>

        <p className="mt-2 text-sm text-yellow-300">Admin</p>

        <nav className="mt-6 space-y-3">
          <Link
            href="/admin/attractions"
            className="flex h-11 items-center justify-center rounded-full bg-[#E3F5F2] text-sm font-bold text-[#0A786E]"
          >
            Attraction
          </Link>

          <button
            type="button"
            className="flex h-11 w-full items-center justify-center text-sm font-bold text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 px-12 py-14">
        <h1 className="text-[30px] font-bold text-[#1A1F24]">
          Edit Attraction
        </h1>

        <p className="mt-2 text-[13px] text-[#636E75]">
          Update traveller-facing attraction information.
        </p>

        <div className="mt-10 flex gap-8">
          <section className="w-full max-w-[1066px] rounded-2xl border border-[#D4D9DE] bg-white p-10">
            <form>
              {/* Name */}
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
                  defaultValue="South Bank Parklands"
                  className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-sm outline-none focus:border-[#0A786E]"
                />
              </div>

              {/* Destination + category */}
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
                    defaultValue="Brisbane"
                    className="h-11 w-full rounded-lg border border-[#D4D9DE] bg-white px-4 text-sm"
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
                    defaultValue="Park"
                    className="h-11 w-full rounded-lg border border-[#D4D9DE] bg-white px-4 text-sm"
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
                  defaultValue="South Brisbane, QLD"
                  className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-sm outline-none"
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
                  defaultValue="A riverside parkland and cultural precinct with gardens, dining and walking paths."
                  className="w-full resize-none rounded-lg border border-[#D4D9DE] px-4 py-4 text-sm outline-none"
                />
              </div>

              {/* Actions */}
              <div className="mt-10 flex gap-4">
                <button
                  type="submit"
                  className="h-11 w-[200px] rounded-lg bg-[#0A786E] text-sm font-semibold text-white"
                >
                  Update attraction
                </button>

                <Link
                  href="/admin/attractions"
                  className="flex h-11 w-[140px] items-center justify-center rounded-lg border border-[#D4D9DE] text-sm font-semibold text-[#1A1F24]"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </section>

          {/* Image */}
          <aside className="w-[250px] shrink-0">
            <div className="flex h-[250px] items-center justify-center rounded-[14px] bg-[#EDF2F2]">
              <span className="text-sm text-[#636E75]">Current image</span>
            </div>

            <button
              type="button"
              className="mt-6 h-11 w-full rounded-lg border border-[#D4D9DE] bg-white text-sm font-semibold"
            >
              Change image
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
