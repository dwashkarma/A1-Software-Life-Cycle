"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAttractionButton({
  attractionId,
}: {
  attractionId: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this attraction?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/attractions/${attractionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete attraction");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-10 rounded-lg border border-red-200 px-5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
