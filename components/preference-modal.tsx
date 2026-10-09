"use client";

import { useEffect, useState } from "react";
import CheckboxGroup, { CheckboxOption } from "@/components/checkbox-group";

/**
 * Popup that asks a logged-in traveller for destination and category preferences.
 * It shows nothing to visitors who are not logged in.
 */
export default function PreferenceModal() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [open, setOpen] = useState(false);
    const [destinationOptions, setDestinationOptions] = useState<CheckboxOption[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<CheckboxOption[]>([]);
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
        } catch (err) {
            console.error("Failed to load preferences:", err);
        }
        };

        load();
    }, []);

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

                        <div className="mt-4 grid gap-5">
                        <CheckboxGroup
                            legend="Destinations"
                            options={destinationOptions}
                            selected={selectedDestinations}
                            onChange={(values) => {
                            setSelectedDestinations(values);
                            }}
                                emptyMessage="No destinations available yet."
                        />
                        <CheckboxGroup
                            legend="Categories"
                            options={categoryOptions}
                            selected={selectedCategories}
                            onChange={(values) => {
                            setSelectedCategories(values);
                            }}
                            emptyMessage="No categories available yet."
                        />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}