"use client";

import AdminLayout from "./layouts/adminLayout";

export default function AdminSubLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>{children}</AdminLayout>
  );
}