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
          className="h-10 rounded-lg border bg-primary px-5 text-sm font-semibold text-white  cursor-pointer disabled:opacity-50"
          onClick={() => changeLifecycle("publish")}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Publish"}
        </button>
      ) : status === "PUBLISHED" ? (
        <button
          className="h-10 rounded-lg border border-blue-200 px-5 text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 disabled:opacity-50"
          onClick={() => changeLifecycle("archive")}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Archive"}
        </button>
      ) : status === "ARCHIVED" ? (
        <span>Archived</span>
      ) : null}{" "}
    </>
  );
}
