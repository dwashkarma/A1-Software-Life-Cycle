"use client";

import { useEffect, useState } from "react";

/**
 * Popup that asks a logged-in traveller for destination and category preferences.
 * It shows nothing to visitors who are not logged in.
 */
export default function PreferenceModal() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

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
                </div>
            </div>
        )}
    </>
  );
}