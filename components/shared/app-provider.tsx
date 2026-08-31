"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/navbar";
import type { ReactNode } from "react";

export default function AppProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const authRoutes = ["/authentication/login", "/authentication/register"];
  const showNavbar = !authRoutes.includes(pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}
