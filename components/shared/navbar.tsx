// src/components/Navbar.tsx

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 w-full items-center justify-center lg:justify-between px-14">
        {/* Logo */}
        <Link href="/" className="text-2xl lg:text-lg font-bold  text-primary">
          TRAVEL MATE
        </Link>

        {/* Navigation */}
        <div className=" items-center gap-8 text-sm hidden lg:flex">
          <Link
            href="/explore"
            className="text-gray-700 transition hover:text-primary"
          >
            Explore
          </Link>

          <Link
            href="/itineraries"
            className="text-gray-700 transition hover:text-primary"
          >
            My Itinerary
          </Link>

          <Link
            href={"/authentication/login"}
            className="font-medium text-gray-700 transition hover:text-primary"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
