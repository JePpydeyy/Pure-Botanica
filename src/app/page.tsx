"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/user");
    }, 2000); // Chuyển trang sau 2 giây

    return () => clearTimeout(timer); // Cleanup nếu component unmount
  }, [router]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      fontSize: "1.5rem"
    }}>
      <p>Đang chuyển trang, vui lòng chờ...</p>
    </div>
  );
}
