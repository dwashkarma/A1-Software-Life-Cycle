"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CreateItineraryPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch destinations for dropdown
    const fetchDestinations = async () => {
      try {
        const response = await fetch("/api/destinations");
        if (response.ok) {
          const data = await response.json();
          setDestinations(data);
          if (data.length > 0) {
            setFormData((prev) => ({ ...prev, destination: data[0]._id }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      }
    };
    fetchDestinations();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create itinerary");
      }

      const data = await response.json();
      router.push(`/itineraries/${data.itinerary._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

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
            <form className="space-y-8" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Trip name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1A1F24]">
                  Trip name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Brisbane Weekend"
                  required
                  className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-sm outline-none focus:border-[#0A786E]"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1A1F24]">
                  Destination
                </label>

                <select
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-lg border border-[#D4D9DE] bg-white px-4 text-sm outline-none focus:border-[#0A786E]"
                >
                  <option value="">Select a destination</option>
                  {destinations.map((dest) => (
                    <option key={dest._id} value={dest._id}>
                      {dest.name}
                    </option>
                  ))}
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
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-sm outline-none focus:border-[#0A786E]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1A1F24]">
                    End date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-sm outline-none focus:border-[#0A786E]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 rounded-lg bg-[#0A786E] px-8 text-sm font-semibold text-white hover:bg-[#08675F] disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create trip"}
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
