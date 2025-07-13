"use client";

import React, { useState, useEffect } from "react";
import "./layout.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [logo, setLogo] = useState<string>("https://via.placeholder.com/200?text=Logo+Not+Found");
  const [isMounted, setIsMounted] = useState(false); // Track client-side mount

  // Hàm xác thực token
  const validateToken = (token: string | null) => {
    if (!token) {
      console.log("No token found");
      return false;
    }
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

      if (exp && exp < new Date()) {
        console.log("Token expired");
        return false;
      }
      if (role !== "admin") {
        console.log("Non-admin role");
        return false;
      }
      return true;
    } catch (err) {
      console.log("Invalid token:", err);
      return false;
    }
  };

  // Set isMounted to true after client-side mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Tải logo từ API
  useEffect(() => {
    const fetchImages = async () => {
      const token = localStorage.getItem("token");
      if (!validateToken(token)) {
        setLogo("https://via.placeholder.com/200?text=Logo+Not+Found");
        return;
      }

      const url = "https://api-zeal.onrender.com/api/interfaces/logo-shop";
      try {
        console.log("Fetching logo from:", url);
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Logo data:", data);
          if (data.paths && data.paths.length > 0) {
            const imageUrl = `https://api-zeal.onrender.com/${data.paths[0]}`;
            setLogo(imageUrl);
          } else {
            console.warn("No logo paths returned");
          }
        } else {
          console.warn(`No logo found: ${res.status} ${res.statusText}`);
        }
      } catch (error) {
        console.error("Lỗi khi tải logo:", error);
      }
    };

    fetchImages();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/user"); // Chuyển hướng đến trang user sau khi đăng xuất
  };

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <div className="logo">
          <Link href="/admin">
            <img
              style={{ width: "200px" }}
              src={isMounted ? `${logo}?v=${Date.now()}` : logo}
              alt="Logo"
              onError={(e) => {
                console.log("Logo image load failed:", logo);
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/200?text=Logo+Not+Found";
              }}
            />
          </Link>
        </div>

        <div className="menu">
          <Link href="/admin" className="menu-item">
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/category" className="menu-item">
            <span>Danh mục</span>
          </Link>
          <Link href="/admin/product" className="menu-item">
            <span>Sản phẩm</span>
          </Link>
          <Link href="/admin/brand" className="menu-item">
            <span>Thương hiệu</span>
          </Link>
          <Link href="/admin/order" className="menu-item">
            <span>Danh sách oder</span>
          </Link>
          <Link href="/admin/comment" className="menu-item">
            <span>Bình Luận</span>
          </Link>
          <Link href="/admin/news" className="menu-item">
            <span>Tin tức</span>
          </Link>
          <Link href="/admin/coupons" className="menu-item">
            <span>Khuyến mãi</span>
          </Link>
          <Link href="/admin/customer" className="menu-item">
            <span>Khách hàng</span>
          </Link>
          <Link href="/admin/interface_config" className="menu-item">
            <span>Cấu hình giao diện</span>
          </Link>
          <button onClick={handleLogout} className="menu-item logout-button">
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Hiển thị nội dung con */}
      <div className="content">{children}</div>
    </div>
  );
};

export default AdminLayout;