// src/components/Navbar.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    console.log(path);
    return pathname === path;
  };

  console.log(pathname);
  console.log(isActive("/explore"));

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

          <Link
            href={"/authentication/login"}
            className={"text-gray-700 transition hover:text-primary"}
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
