"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExploreSearch({
  initialQuery,
}: {
  initialQuery?: string;
}) {
  const [searchInput, setSearchInput] = useState(initialQuery || "");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex max-w-4xl gap-4 flex-row items-center"
    >
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search Brisbane, Gold Coast, Sunshine Coast..."
        className="h-10 flex-1 p-2 rounded-xl border border-secondary bg-white px-5 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      <button
        type="submit"
        className="h-9 rounded-lg bg-primary px-10 text-sm font-semibold text-white hover:bg-[#0A786E] transition"
      >
        Search
      </button>
    </form>
  );
}
