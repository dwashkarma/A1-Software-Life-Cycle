"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditItineraryModal({
  itineraryId,
  currentName,
  currentStartDate,
  currentEndDate,
}: {
  itineraryId: string;
  currentName: string;
  currentStartDate: string;
  currentEndDate: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: currentName,
    startDate: new Date(currentStartDate).toISOString().split("T")[0],
    endDate: new Date(currentEndDate).toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/itineraries/${itineraryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update itinerary");
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="h-10.5 rounded-lg border border-[#D4D9DE] bg-white px-6 text-sm font-semibold text-[#1A1F24] transition hover:border-[#0A786E] hover:text-[#0A786E]"
      >
        Edit Details
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[#1A1F24]">
              Edit Trip Details
            </h2>

            {error && (
              <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1A1F24]">
                  Trip name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-sm outline-none focus:border-[#0A786E]"
                />
              </div>

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

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-[#0A786E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#08675F] disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  className="flex-1 rounded-lg border border-[#D4D9DE] bg-white px-4 py-2 text-sm font-semibold text-[#1A1F24] hover:bg-[#F6F8F9]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
