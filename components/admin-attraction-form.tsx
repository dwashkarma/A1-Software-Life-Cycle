"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AttractionFormProps {
  attractionId?: string;
  initialData?: {
    name: string;
    destination: string;
    category: string;
    location: string;
    description: string;
    image: string;
  };
  isEdit?: boolean;
}

export default function AttractionForm({
  attractionId,
  initialData,
  isEdit = false,
}: AttractionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    destination: initialData?.destination || "",
    category: initialData?.category || "",
    location: initialData?.location || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
  });

  const categories = [
    "Park",
    "Landmark",
    "Wildlife",
    "Beach",
    "Museum",
    "Restaurant",
    "Shopping",
    "Entertainment",
  ];

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch("/api/destinations");
        if (response.ok) {
          const data = await response.json();
          setDestinations(data.destinations || data);
          // Set default destination if not already set
          if (!formData.destination && data.destinations?.length > 0) {
            setFormData((prev) => ({
              ...prev,
              destination: data.destinations[0]._id,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      }
    };

    fetchDestinations();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (
        !formData.name ||
        !formData.destination ||
        !formData.category ||
        !formData.location ||
        !formData.description
      ) {
        setError("All fields are required");
        setIsLoading(false);
        return;
      }

      const url = isEdit
        ? `/api/attractions/${attractionId}`
        : "/api/attractions";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save attraction");
      }

      router.push("/admin/attractions");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F6F8F9] w-full">
      <main className="flex-1 px-12 py-10">
        <p>
          <Link
            href="/admin/attractions"
            className="hover:text-primary text-sm font-light text-[#0A786E]"
          >
            Back to attractions
          </Link>
        </p>

        <section className="mt-8">
          <h1 className="text-[30px] font-bold text-[#1A1F24]">
            {isEdit ? "Edit Attraction" : "Add Attraction"}
          </h1>

          <p className="mt-2 text-[13px] text-[#636E75]">
            {isEdit
              ? "Update traveller-facing attraction information."
              : "Create traveller-facing attraction information."}
          </p>
        </section>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-10 flex gap-8">
          <section className="w-full max-w-[1066px] rounded-2xl border border-[#D4D9DE] bg-white p-10">
            <form onSubmit={handleSubmit}>
              {/* Attraction name */}
              <div className="max-w-[676px]">
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-semibold text-[#1A1F24]"
                >
                  Attraction name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="South Bank Parklands"
                  className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-[13px] text-[#636E75] outline-none focus:border-[#0A786E]"
                />
              </div>

              {/* Destination + Category */}
              <div className="mt-8 grid max-w-[676px] gap-7 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="destination"
                    className="mb-2 block text-xs font-semibold text-[#1A1F24]"
                  >
                    Destination
                  </label>

                  <select
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-[#D4D9DE] bg-white px-4 text-[13px] text-[#636E75] outline-none focus:border-[#0A786E]"
                  >
                    <option value="">Select a destination...</option>
                    {destinations.map((dest) => (
                      <option key={dest._id} value={dest._id}>
                        {dest.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-xs font-semibold text-[#1A1F24]"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-[#D4D9DE] bg-white px-4 text-[13px] text-[#636E75] outline-none focus:border-[#0A786E]"
                  >
                    <option value="">Select a category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="mt-8 max-w-[676px]">
                <label
                  htmlFor="location"
                  className="mb-2 block text-xs font-semibold text-[#1A1F24]"
                >
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="South Brisbane, QLD"
                  className="h-11 w-full rounded-lg border border-[#D4D9DE] px-4 text-[13px] text-[#636E75] outline-none focus:border-[#0A786E]"
                />
              </div>

              {/* Description */}
              <div className="mt-8 max-w-[676px]">
                <label
                  htmlFor="description"
                  className="mb-2 block text-xs font-semibold text-[#1A1F24]"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="A riverside parkland and cultural precinct..."
                  className="w-full resize-none rounded-lg border border-[#D4D9DE] px-4 py-4 text-[13px] text-[#636E75] outline-none focus:border-[#0A786E]"
                />
              </div>

              {/* Buttons */}
              <div className="mt-10 flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 w-[200px] rounded-[9px] bg-[#0A786E] text-[13px] font-semibold text-white transition hover:bg-[#08675F] disabled:opacity-50"
                >
                  {isLoading
                    ? "Saving..."
                    : isEdit
                      ? "Update attraction"
                      : "Save attraction"}
                </button>

                <Link
                  href="/admin/attractions"
                  className="flex h-11 w-[140px] items-center justify-center rounded-[9px] border border-[#D4D9DE] bg-white text-[13px] font-semibold text-[#1A1F24]"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </section>

          {/* Image section */}
          <aside className="w-[250px] shrink-0">
            <div className="flex h-[250px] items-center justify-center rounded-[14px] bg-[#EDF2F2] overflow-hidden">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Attraction preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <p className="text-[13px] font-semibold text-[#636E75]">
                  Image placeholder
                </p>
              )}
            </div>

            <label
              htmlFor="imageInput"
              className="mx-auto mt-6 flex h-11 w-[190px] cursor-pointer items-center justify-center rounded-[9px] border border-[#D4D9DE] bg-white text-[13px] font-semibold text-[#1A1F24] hover:border-[#0A786E]"
            >
              Upload image
            </label>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
