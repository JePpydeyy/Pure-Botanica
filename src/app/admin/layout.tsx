"use client";

import AdminLayout from "./layouts/adminLayout";

export default function AdminSubLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}