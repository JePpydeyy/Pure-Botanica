// contexts/AuthContext.tsx
"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: {
    id?: string;
    email?: string;
    role?: string; 
  } | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<AuthContextType["userInfo"]>(null);

  useEffect(() => {
    // Kiểm tra token trong localStorage khi component được mount
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token) as any;
        setUserInfo({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        });
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setUserInfo(null);
    window.location.href = "/user"; // Chuyển về trang chủ
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}