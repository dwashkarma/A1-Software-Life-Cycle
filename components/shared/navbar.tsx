"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const syncUser = () => {
      try {
        const storedUser = localStorage.getItem("travelMateUser");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch {
        setUser(null);
      }
    };

    syncUser();
    window.addEventListener("travelmate-auth-change", syncUser);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("travelmate-auth-change", syncUser);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // Ignore request failure and still clear local state
    }

    localStorage.removeItem("travelMateUser");
    setUser(null);
    setOpenMenu(false);
    window.dispatchEvent(new Event("travelmate-auth-change"));
    router.push("/authentication/login");
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 w-full items-center justify-center lg:justify-between px-14">
        <Link href="/" className="text-2xl lg:text-lg font-bold text-primary">
          TRAVEL MATE
        </Link>

        <div className="items-center gap-8 text-sm hidden lg:flex">
          <Link
            href="/explore"
            className={
              isActive("/explore")
                ? "text-primary font-bold"
                : "text-gray-700 transition hover:text-primary"
            }
          >
            Explore
          </Link>

          <Link
            href="/itineraries"
            className={
              isActive("/itineraries")
                ? "text-primary font-bold"
                : "text-gray-700 transition hover:text-primary"
            }
          >
            My Itinerary
          </Link>

          {user ? (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((prev) => !prev)}
                className="flex items-center gap-2 rounded-full bg-[#E7F6F3] px-3 py-1.5 font-semibold text-primary"
              >
                <span>{user.name}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-4 w-4 transition-transform ${openMenu ? "rotate-180" : ""}`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 7.47a.75.75 0 0 1 1.06 0L10 11.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.53a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {openMenu ? (
                <div className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                  <div className="border-b border-gray-200 px-2 py-2 text-sm text-gray-600">
                    {user.email}
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-md px-2 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/authentication/login"
              className="text-gray-700 transition hover:text-primary"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
