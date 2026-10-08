"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  attractionId: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export default function AttractionLifecycleActions({
  attractionId,
  status,
}: Props) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function changeLifecycle(action: "publish" | "archive") {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/attractions/${attractionId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data: { error?: string; message?: string } =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.error || data.message || "Unable to update attraction");
        return;
      }

      router.refresh();
    } catch {
      alert("Unable to reach the server. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <>
      {status === "DRAFT" ? (
        <button
          type="button"
          onClick={() => changeLifecycle("publish")}
          disabled={isUpdating}
          aria-busy={isUpdating}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-[#0A786E] to-[#11988B] px-4 text-sm font-semibold text-white shadow-sm shadow-[#0A786E]/20 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0A786E]/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0A786E]/20 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-60"
        >
          {isUpdating ? (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="M10 13V3m0 0L6.5 6.5M10 3l3.5 3.5M4 12.5v3A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5v-3"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {isUpdating ? "Updating..." : "Publish"}
        </button>
      ) : status === "PUBLISHED" ? (
        <button
          type="button"
          onClick={() => changeLifecycle("archive")}
          disabled={isUpdating}
          aria-busy={isUpdating}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-amber-200 bg-gradient-to-b from-white to-amber-50 px-4 text-sm font-semibold text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/15 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-60"
        >
          {isUpdating ? (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-amber-300 border-t-amber-700"
            />
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="M3 6.5h14v10H3v-10ZM2 3.5h16v3H2v-3Zm5 3v3h6v-3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {isUpdating ? "Updating..." : "Archive"}
        </button>
      ) : status === "ARCHIVED" ? (
        <span className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600">
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            className="h-4 w-4"
          >
            <path
              d="m3.5 8 3 3 6-6"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Archived
        </span>
      ) : null}{" "}
    </>
  );
}
