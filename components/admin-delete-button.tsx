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
    if (!window.confirm("Are you sure you want to delete this attraction?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/attractions/${attractionId}`, {
        method: "DELETE",
      });
      const data: { error?: string; message?: string } =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to delete attraction",
        );
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label={isDeleting ? "Deleting attraction" : "Delete attraction"}
        aria-busy={isDeleting}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-linear-to-b from-white to-red-50 px-4 text-sm font-semibold text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/15 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-60"
      >
        {isDeleting ? (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-700"
          />
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
          >
            <path
              d="M3.5 5.5h13m-11.5 0 .8 11h9.4l.8-11M8 5.5V3.8h4v1.7m-3 3v5m3-5v5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      {error && (
        <p
          role="alert"
          className="absolute right-0 top-full z-10 mt-1 w-48 rounded-md border border-red-200 bg-white p-2 text-xs text-red-700 shadow-lg"
        >
          {error}
        </p>
      )}
    </div>
  );
}
