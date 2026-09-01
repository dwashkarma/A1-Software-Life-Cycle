import Link from "next/link";

const destinations = [
  {
    id: 1,
    name: "Brisbane",
    description: "River walks, culture and city attractions",
  },
  {
    id: 2,
    name: "Gold Coast",
    description: "Beaches, entertainment and coastal views",
  },
  {
    id: 3,
    name: "Sunshine Coast",
    description: "Relaxed beaches and natural attractions",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Welcome section */}
        <section className="grid gap-4">
          <p className="text-xs font-bold text-primary ">
            <span className="bg-secondary p-1 lg:p-2 rounded-full">
              Traveller Dashboard
            </span>
          </p>

          <h1 className=" text-3xl font-bold text-gray-900">Welcome back</h1>

          <p className=" text-gray-500 text-sm">
            Discover new places and continue planning your next trip.
          </p>
        </section>

        {/* Your Trips */}
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your trips</h2>

              <p className="mt-1 text-sm text-gray-500">
                Continue planning your saved itinerary.
              </p>
            </div>

            <Link
              href="/itineraries"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {/* Trip card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <span className="rounded-full bg-[#E7F6F3] px-3 py-1 text-xs font-semibold text-primary">
                  Active trip
                </span>

                <h3 className="mt-4 text-xl font-bold text-gray-900">
                  Brisbane Weekend
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Brisbane, Queensland
                </p>

                <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-800">Dates:</span>{" "}
                    20–22 Sep 2026
                  </p>

                  <p>
                    <span className="font-semibold text-gray-800">
                      Attractions:
                    </span>{" "}
                    3 places
                  </p>
                </div>
              </div>

              <Link
                href="/itineraries/1"
                className="rounded-lg border border-primary px-5 py-3 text-center text-sm font-semibold text-primary transition hover:bg-[#E7F6F3]"
              >
                View itinerary
              </Link>
            </div>
          </div>
        </section>

        {/* Popular destinations */}
        <section className="mt-12">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Popular destinations
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Explore places for your next itinerary.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <article
                key={destination.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image placeholder */}
                <div className="flex h-44 items-center justify-center bg-[#DDE5E3] text-sm font-medium text-gray-500">
                  Destination image
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900">
                    {destination.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {destination.description}
                  </p>

                  <Link
                    href={`/destinations/${destination.id}`}
                    className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
                  >
                    Explore destination →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
