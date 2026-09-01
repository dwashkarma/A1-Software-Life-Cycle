"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AddToItineraryModal({
  attractionId,
}: {
  attractionId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItineraryId, setSelectedItineraryId] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchItineraries();
    }
  }, [isOpen]);

  const fetchItineraries = async () => {
    try {
      const response = await fetch("/api/itineraries");
      if (response.ok) {
        const data = await response.json();
        const itinerariesList = data.itineraries || data;
        setItineraries(itinerariesList);
        if (itinerariesList.length > 0) {
          setSelectedItineraryId(itinerariesList[0]._id);
        }
      }
    } catch (err) {
      setError("Failed to load itineraries");
    }
  };

  const handleAddToItinerary = async () => {
    if (!selectedItineraryId) {
      setError("Please select an itinerary");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/itineraries/${selectedItineraryId}/attractions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attractionId,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add attraction to itinerary");
      }

      setIsOpen(false);
      alert("Attraction added to itinerary!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-11 w-57.5 items-center justify-center rounded-lg bg-[#0A786E] text-sm font-semibold text-white transition hover:bg-[#08675F]"
      >
        Add to Itinerary
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[#1A1F24]">
              Add to Itinerary
            </h2>

            <p className="mt-2 text-sm text-[#636E75]">
              Choose an existing itinerary or create a new one
            </p>

            {error && (
              <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-4">
              {itineraries.length === 0 ? (
                <div className="rounded-lg border border-[#D4D9DE] bg-[#F6F8F9] p-4 text-center text-sm text-[#636E75]">
                  No itineraries yet. Create one to add this attraction.
                </div>
              ) : (
                <select
                  value={selectedItineraryId}
                  onChange={(e) => setSelectedItineraryId(e.target.value)}
                  className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-sm outline-none focus:border-[#0A786E]"
                >
                  <option value="">Select an itinerary...</option>
                  {itineraries.map((itinerary) => (
                    <option key={itinerary._id} value={itinerary._id}>
                      {itinerary.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAddToItinerary}
                disabled={isLoading || !selectedItineraryId}
                className="flex-1 rounded-lg bg-[#0A786E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#08675F] disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add to Itinerary"}
              </button>

              {itineraries.length === 0 ? (
                <Link
                  href="/itineraries/create"
                  className="flex flex-1 items-center justify-center rounded-lg border border-[#D4D9DE] bg-white px-4 py-2 text-sm font-semibold text-[#1A1F24] hover:bg-[#F6F8F9]"
                >
                  Create New
                </Link>
              ) : (
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-lg border border-[#D4D9DE] bg-white px-4 py-2 text-sm font-semibold text-[#1A1F24] hover:bg-[#F6F8F9]"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
