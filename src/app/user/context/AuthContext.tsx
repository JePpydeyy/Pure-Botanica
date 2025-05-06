"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation"; // Sử dụng useRouter để chuyển hướng

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
  const router = useRouter(); // Khởi tạo useRouter

  useEffect(() => {
    // Kiểm tra token trong localStorage khi component được mount
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token) as any;
        
        // Kiểm tra thời gian hết hạn của token
        const currentTime = Date.now() / 1000; // Thời gian hiện tại (giây)
        if (decoded.exp && decoded.exp < currentTime) {
          throw new Error("Token hết hạn");
        }

        setUserInfo({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        });
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid or expired token:", error);
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
    router.push("/user"); // Sử dụng router.push thay vì window.location.href
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
