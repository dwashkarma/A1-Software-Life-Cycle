"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ExploreAttractionCard({
  attractionId,
  attractionName,
  location,
  category,
  image,
}: {
  attractionId: string;
  attractionName: string;
  location: string;
  category: string;
  image: string;
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
      alert("✓ Attraction added to your trip!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <article className="flex min-h-[94px] items-center gap-4 rounded-xl border border-[#D4D9DE] bg-white p-3">
        <Link href={`/attractions/${attractionId}`}>
          {image ? (
            <Image
              src={image}
              height={70}
              width={70}
              alt={attractionName}
              className="h-15 w-15 object-cover overflow-clip rounded-xl"
            />
          ) : (
            <p className="text-xs text-[#636E75]">No Image</p>
          )}
        </Link>

        <div className="flex-1">
          <Link
            href={`/attractions/${attractionId}`}
            className="text-sm font-semibold text-[#1A1F24] hover:text-primary"
          >
            {attractionName}
          </Link>

          <p className="mt-2 text-xs text-[#636E75]">
            {location} · {category}
          </p>

          {/* <button
            onClick={() => setIsOpen(true)}
            type="button"
            className="mt-2 rounded-full bg-[#E3F5F2] px-4 py-1.5 text-xs font-semibold text-primary hover:bg-[#D1EDEA]"
          >
            Add to trip
          </button> */}
        </div>
      </article>
    </>
  );
}
