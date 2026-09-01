import AdminSideBar from "@/components/admin-sidebar";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F6F8F9]">
      <AdminSideBar />
      {children}
    </div>
  );
}
