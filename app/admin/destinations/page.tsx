"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Destination = {
  _id: string;
  name: string;
  state: string;
  description?: string;
  image?: string;
};

function DestinationPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    async function loadDestinations() {
      try {
        const response = await fetch("/api/destinations");
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load destinations.");
        }

        const data = await response.json();
        setDestinations(Array.isArray(data) ? data : (data.destinations ?? []));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load destinations.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDestinations();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please choose a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    setFormError("");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        setFormError("Could not read the selected image.");
        return;
      }
      setFormData((previous) => ({ ...previous, image: result }));
    };
    reader.onerror = () => setFormError("Could not read the selected image.");
    reader.readAsDataURL(file);
  };

  async function handleCreateDestination(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const form = event.currentTarget;
    const newDestination = {
      name: formData.name.trim(),
      state: formData.state.trim(),
      description: formData.description.trim(),
      image: formData.image,
    };

    if (!newDestination.name || !newDestination.state || !newDestination.description) {
      setFormError("Name, state, and description are required.");
      return;
    }

    setIsSaving(true);
    setFormError("");
    try {
      const response = await fetch("/api/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDestination),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to add destination.");
      }

      const created = data.destination ?? data;
      setDestinations((current) => [created, ...current]);
      form.reset();
      setFormData({ name: "", state: "", description: "", image: "" });
      setShowCreateForm(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to add destination.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F6F8F9] w-full">
      <main className="flex-1 px-12 py-12">
        <section className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1F24]">Destinations</h1>
            <p className="mt-2 text-sm text-[#636E75]">
              Manage the places that travellers can discover.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm((visible) => !visible)}
            className="flex h-12 items-center rounded-lg bg-[#0A786E] px-8 text-sm font-semibold text-white hover:bg-[#08675F]"
          >
            {showCreateForm ? "Cancel" : "+ Add destination"}
          </button>
        </section>

        {showCreateForm && (
          <form
            onSubmit={handleCreateDestination}
            className="mt-6 grid gap-4 rounded-lg border border-[#E1E6E8] bg-white p-5 sm:grid-cols-2"
          >
            <label className="text-sm font-medium text-[#1A1F24]">
              Name
              <input
                name="name"
                value={formData.name}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                required
                className="mt-1 w-full rounded border border-[#E1E6E8] px-3 py-2 font-normal"
              />
            </label>
            <label className="text-sm font-medium text-[#1A1F24]">
              State
              <input
                name="state"
                value={formData.state}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    state: event.target.value,
                  }))
                }
                required
                className="mt-1 w-full rounded border border-[#E1E6E8] px-3 py-2 font-normal"
              />
            </label>
            <label className="text-sm font-medium text-[#1A1F24] sm:col-span-2">
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                rows={3}
                required
                className="mt-1 w-full rounded border border-[#E1E6E8] px-3 py-2 font-normal"
              />
            </label>
            {/* Image section */}
            <aside className="w-[250px] shrink-0">
              <div className="flex h-[250px] items-center justify-center rounded-[14px] bg-[#EDF2F2] overflow-hidden">
                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt="Destination preview"
                    width={500}
                    height={500}
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
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
            </aside>
            {formError && (
              <p role="alert" className="text-sm text-red-600 sm:col-span-2">
                {formError}
              </p>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="h-11 rounded-lg bg-[#0A786E] px-6 text-sm font-semibold text-white hover:bg-[#08675F] disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
            >
              {isSaving ? "Saving..." : "Save destination"}
            </button>
          </form>
        )}

        <section className="mt-8">
          {isLoading ? (
            <p className="text-sm text-[#636E75]">Loading destinations...</p>
          ) : error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : destinations.length === 0 ? (
            <p className="text-sm text-[#636E75]">No destinations found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination) => (
                <article
                  key={destination._id}
                  className="rounded-lg border border-[#E1E6E8] bg-white p-5"
                >
                  {destination.image && (
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      width={600}
                      height={400}
                      className="mb-4 h-40 w-full rounded-md object-cover"
                    />
                  )}
                  <h2 className="text-lg font-semibold text-[#1A1F24]">
                    {destination.name || "Untitled destination"}
                  </h2>
                  {destination.state && (
                    <p className="mt-1 text-sm text-[#636E75]">
                      {destination.state}
                    </p>
                  )}
                  {destination.description && (
                    <p className="mt-3 text-sm text-[#636E75]">
                      {destination.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DestinationPage;
