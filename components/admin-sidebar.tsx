"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
export default function AdminSideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const IsActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // Continue to login even if the logout request fails.
    }
    router.push("/login");
  };
  return (
    <aside className="w-[238px] border-r border-[#D4D9DE] bg-primary px-5 py-6">
      <Link
        href="/admin/dashboard"
        className="text-xl font-bold text-slate-200"
      >
        TRAVELMATE
      </Link>

      <p className="text-sm text-orange">Admin</p>

      <nav className="mt-6 space-y-3">
        <Link
          href="/admin/dashboard"
          className={
            IsActive("/admin/dashboard")
              ? "flex h-11 items-center rounded-lg bg-[#E3F5F2] px-5 font-semibold text-[#0A786E]"
              : "flex h-11 items-center rounded-lg px-5 text-left text-slate-200 hover:text-[#0A786E]"
          }
        >
          Dashboard
        </Link>
        <Link
          href="/admin/attractions"
          className={
            IsActive("/admin/attractions")
              ? "flex h-11 items-center rounded-lg bg-[#E3F5F2] px-5 font-semibold text-[#0A786E]"
              : "flex h-11 items-center rounded-lg px-5 text-left text-slate-200 hover:text-[#0A786E]"
          }
        >
          Attractions
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className=" hover:cursor-pointer flex h-11 w-full items-center rounded-lg px-5 text-left text-slate-200 hover:text-[#0A786E]"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
