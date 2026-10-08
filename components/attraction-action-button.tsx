"use client";

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

  async function changeLifecycle(action: "publish" | "archive") {
    const response = await fetch(
      `/api/admin/attractions/${attractionId}/lifecycle`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || "Unable to update attraction");
      return;
    }

    router.refresh();
  }

  return (
    <>
      {status === "DRAFT" ? (
        <button
          className="h-10 rounded-lg border bg-primary px-5 text-sm font-semibold text-white  cursor-pointer disabled:opacity-50"
          onClick={() => changeLifecycle("publish")}
        >
          Publish
        </button>
      ) : status === "PUBLISHED" ? (
        <button
          className="h-10 rounded-lg border border-blue-200 px-5 text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 disabled:opacity-50"
          onClick={() => changeLifecycle("archive")}
        >
          Archive
        </button>
      ) : status === "ARCHIVED" ? (
        <span>Archived</span>
      ) : null}{" "}
    </>
  );
}
