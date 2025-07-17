"use client";

import React, { useState, useEffect } from "react";
import "../layout.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [logo, setLogo] = useState<string>("https://via.placeholder.com/200?text=Logo+Not+Found");
  const [isMounted, setIsMounted] = useState(false);

  const validateToken = (token: string | null): boolean => {
    if (!token) return false;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);
      const exp = decoded.exp ? new Date(decoded.exp * 1000) : null;
      const role = decoded.role || "user";

      return !(exp && exp < new Date()) && role === "admin";
    } catch {
      return false;
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    if (!validateToken(token)) {
      router.push("/user/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchLogo = async () => {
      const token = localStorage.getItem("token");
      if (!validateToken(token)) return;

      try {
        const res = await fetch("https://api-zeal.onrender.com/api/interfaces/logo-shop", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const data = await res.json();

        if (res.ok && data.paths && data.paths[0]) {
          setLogo(data.paths[0]); // sử dụng full URL trả về
        }
      } catch (error) {
        console.error("Lỗi khi tải logo:", error);
      }
    };

    if (isMounted) fetchLogo();
  }, [isMounted]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/user");
  };

  if (!isMounted) return <div>Đang tải...</div>;

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <div className="logo">
          <Link href="/admin">
          <img
            style={{ width: "200px" }}
            src={`${logo}?v=${Date.now()}`}
            alt="Logo"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg";
            }}
          />


          </Link>
        </div>

        <div className="menu">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/category", label: "Danh mục" },
            { href: "/admin/product", label: "Sản phẩm" },
            { href: "/admin/brand", label: "Thương hiệu" },
            { href: "/admin/order", label: "Danh sách order" },
            { href: "/admin/comment", label: "Bình luận" },
            { href: "/admin/news", label: "Tin tức" },
            { href: "/admin/coupons", label: "Khuyến mãi" },
            { href: "/admin/customer", label: "Khách hàng" },
            { href: "/admin/interface_config", label: "Cấu hình giao diện" },
            { href: "/admin/payment", label: "Thanh toán online" },
            { href: "/admin/contact", label: "Liên hệ" },
            { href: "/", label: "Truy cập trang khách" },

          ].map((item) => (
            <Link key={item.href} href={item.href} className="menu-item">
              <span>{item.label}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="menu-item logout-button">
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      <div className="content">{children}</div>
    </div>
  );
};

export default AdminLayout;
