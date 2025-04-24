// components/UserMenu.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "../user/login/login.css"

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Kiểm tra token trong localStorage khi component được mount
    const token = localStorage.getItem("token");
  
    
    if (token ) {
      setIsLoggedIn(true);
  
    }

    // Thêm sự kiện click bên ngoài để đóng dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    
    setIsLoggedIn(false);
    window.location.href = "/user";
  };

  return (
    <div className="user-menu-container" ref={dropdownRef}>
      <div className="user-icon" onClick={() => isLoggedIn && setIsOpen(!isOpen)}>
        <Link href={isLoggedIn ? "#" : "/user/login"}>
          <i className="fa-solid fa-user"></i>
        </Link>
      </div>
      
      {isLoggedIn && isOpen && (
        <div className="user-dropdown">
       
          <ul>
            <li>
              <Link href="/user/userinfo">
                <i className="fa-solid fa-user-circle"></i> Thông tin khách hàng
              </Link>
            </li>
            <li className="logout-item">
              <button onClick={handleLogout}>
                <i className="fa-solid fa-sign-out-alt"></i> Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}