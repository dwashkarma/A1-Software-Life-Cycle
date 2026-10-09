"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CheckboxGroup, { CheckboxOption } from "@/components/checkbox-group";

/**
 * Popup that asks a logged-in traveller for destination and category preferences.
 * It shows nothing to visitors who are not logged in.
 */
export default function PreferenceModal() {
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(false);
    const [open, setOpen] = useState(false);
    const [destinationOptions, setDestinationOptions] = useState<CheckboxOption[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<CheckboxOption[]>([]);
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [firstTime, setFirstTime] = useState(false); // true until saved or skipped
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
    const load = async () => {
        try {
            const res = await fetch("/api/preferences");
            if (!res.ok) return; // 401: not logged in, so nothing is shown
            setLoggedIn(true);

            const data = await res.json();
            const preference = data.preference;

            // Open for a traveller who has neither saved nor skipped yet.
            if (!preference || !preference.completed) {
                setFirstTime(true);
                setOpen(true);
            }

            const [destinationsRes, categoriesRes] = await Promise.all([
                fetch("/api/destinations"),
                fetch("/api/attractions/categories"),
            ]);

            if (destinationsRes.ok) {
                const destinations = await destinationsRes.json();
                setDestinationOptions(
                    destinations.map((d: { _id: string; name: string; state?: string }) => ({
                        value: String(d._id),
                        label: d.state ? `${d.name} (${d.state})` : d.name,
                    })),
                );
            }

            if (categoriesRes.ok) {
                const categoriesData = await categoriesRes.json();
                setCategoryOptions(
                    (categoriesData.categories ?? []).map((c: string) => ({
                        value: c,
                        label: c,
                    })),
                );
            }

            if (!destinationsRes.ok || !categoriesRes.ok) {
                setError("Failed to load destinations or categories");
            }
        } catch (err) {
            console.error("Failed to load preferences:", err);
            setError("Failed to load your preferences");
        }
        };

        load();
    }, []);

    const send = async (payload: object) => {
        const res = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message ?? "Failed to save preferences");
    };

    const handleSave = async () => {
        // Validation happens here, before any request is sent.
        if (selectedDestinations.length === 0 && selectedCategories.length === 0) {
            setError("Select at least one destination or category");
        return;
        }

        setSaving(true);
        setError(null);
        try {
            await send({
                destinations: selectedDestinations,
                categories: selectedCategories,
            });
            setFirstTime(false);
            setOpen(false);
            router.refresh(); // re-render the recommendations without a manual refresh
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setSaving(false);
        }
    };

    const handleSkipOrCancel = async () => {
        setError(null);

        // Cancel (editing later): close without touching the saved preference.
        if (!firstTime) {
            setOpen(false);
            return;
        }

        // Skip (first time): remember it on the server so the popup is not shown again.
        setSaving(true);
        try {
        await send({ skip: true });
            setFirstTime(false);
            setOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (!loggedIn) return null;

    return (
        <>
            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="preference-modal-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                >
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
                        <h2
                            id="preference-modal-title"
                            className="text-lg font-semibold text-[#1A1F24]"
                        >
                            Personalise your recommendations
                        </h2>
                        <p className="mt-2 text-sm text-[#636E75]">
                            Tick the destinations and categories you are interested in. Leave a
                            list empty if you do not want to filter by it.
                        </p>

                        {error && (
                        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                        )}

                        <div className="mt-4 grid gap-5">
                            <CheckboxGroup
                                legend="Destinations"
                                options={destinationOptions}
                                selected={selectedDestinations}
                                onChange={(values) => {
                                    setSelectedDestinations(values);
                                    setError(null);
                                }}
                                emptyMessage="No destinations available yet."
                            />
                            <CheckboxGroup
                                legend="Categories"
                                options={categoryOptions}
                                selected={selectedCategories}
                                onChange={(values) => {
                                    setSelectedCategories(values);
                                    setError(null);
                                }}
                                emptyMessage="No categories available yet."
                            />
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 rounded-lg bg-[#0A786E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#08675F] disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={handleSkipOrCancel}
                                disabled={saving}
                                className="flex-1 rounded-lg border border-[#D4D9DE] bg-white px-4 py-2 text-sm font-semibold text-[#1A1F24] hover:bg-[#F6F8F9] disabled:opacity-50"
                            >
                                {firstTime ? "Skip for now" : "Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}