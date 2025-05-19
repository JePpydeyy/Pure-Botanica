"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const refresh = searchParams.get("refresh");
    // Chuyển hướng đến /user với tham số refresh nếu có
    router.push(`/user${refresh === "true" ? "?refresh=true" : ""}`);

    // Không cần setTimeout vì router.push hoạt động ngay lập tức
  }, [router, searchParams]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        fontSize: "1.5rem",
      }}
    >
      <p>Đang chuyển trang, vui lòng chờ...</p>
    </div>
  );
}