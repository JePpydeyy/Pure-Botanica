"use client";

import React from "react";
import "./layout.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/user"); // Redirect to the user page after logout
  };

  return (
    <html lang="en">
      <body>
        <div className="sidebar">
          <div className="logo">
            <a href="/admin">
              <img
                style={{ width: "200px" }}
                src="https://api-zeal.onrender.com/images/logo_web.png"
                alt="Logo"
              />
            </a>
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
            <Link href="/admin/order" className="menu-item">
              <span>Danh sách oder</span>
            </Link>
            <Link href="/admin/comment" className="menu-item">
              <span>Bình Luận</span>
            </Link>
            <Link href="/admin/coupons" className="menu-item">
              <span>Khuyến mãi</span>
            </Link>
            <Link href="/admin/customer" className="menu-item">
              <span>Khách hàng</span>
            </Link>
            <button onClick={handleLogout} className="menu-item logout-button">
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        <div className="header">
          {/* <div className="search-box">
            <img
              style={{ width: "20px", height: "20px" }}
              src="/images/search.png"
              alt="Search Icon"
            />
            <input type="text" placeholder="Search..." />
          </div> */}

          {/* <div className="user-menu">
            <div className="notification">
              <img
                style={{ width: "40px", height: "40px" }}
                src="/images/notification.png"
                alt="Notification Icon"
              />
              <span className="notification-badge">2</span>
            </div>
            <div className="language-selector">
              <img
                style={{ width: "60px", height: "40px" }}
                src="/images/vietnam.png"
                alt="Vietnamese flag"
              />
              <span>Việt Nam</span>
            </div>

            <div className="user-profile">
              <div className="user-info">
                <div className="user-name">The Nhan</div>
                <div className="user-role">Admin</div>
              </div>
              <div className="user-avatar">👤</div>
            </div>
          </div> */}
        </div>

        {/* Hiển thị nội dung con */}
        {children}
      </body>
    </html>
  );
};

export default AdminLayout;