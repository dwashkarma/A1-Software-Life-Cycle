"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RemoveAttractionButton({
  itineraryId,
  attractionId,
}: {
  itineraryId: string;
  attractionId: string;
}) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemove = async () => {
    if (!confirm("Remove this attraction from your itinerary?")) {
      return;
    }

    setIsRemoving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/itineraries/${itineraryId}/attractions`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attractionId,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to remove attraction");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsRemoving(false);
    }
  };

  return (
    <>
      <button
        onClick={handleRemove}
        disabled={isRemoving}
        className="h-[42px] rounded-lg border border-[#D4D9DE] px-8 text-sm font-semibold text-[#1A1F24] transition hover:border-red-400 hover:text-red-600 disabled:opacity-50"
      >
        {isRemoving ? "Removing..." : "Remove"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </>
  );
}
