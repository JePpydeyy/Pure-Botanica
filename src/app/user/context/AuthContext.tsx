"use client";
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: {
    id?: string;
    email?: string;
    role?: string;
  } | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<AuthContextType["userInfo"]>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token) as any;
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          throw new Error("Token hết hạn");
        }
        setUserInfo({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        });
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid or expired token:", error);
        logout();
      }
    }
  }, []);

  const login = async (token: string) => {
    try {
      const decoded = jwtDecode(token) as any;
      const currentTime = Date.now() / 1000;
      if (!decoded.id || !decoded.email || !decoded.role) {
        throw new Error("Token thiếu thông tin cần thiết");
      }
      if (decoded.exp && decoded.exp < currentTime) {
        throw new Error("Token hết hạn");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("email", decoded.email);

      let userData = { id: decoded.id, email: decoded.email, role: decoded.role };
      try {
        const res = await fetch("http:///api/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          userData = await res.json();
          console.log("Fetch user success:", userData);
        } else {
          console.warn("Fetch user failed, using decoded token:", res.status, await res.text());
        }
      } catch (fetchError) {
        console.warn("Fetch user error, using decoded token:", fetchError);
      }

      setUserInfo({
        id: userData.id,
        email: userData.email,
        role: userData.role,
      });
      setIsLoggedIn(true);

      console.log("Redirecting to:", decoded.role === "admin" ? "/admin?refresh=true" : "/user?refresh=true"); // Debug log
      router.push(decoded.role === "admin" ? "/admin?refresh=true" : "/user?refresh=true");
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      setIsLoggedIn(false);
      setUserInfo(null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setUserInfo(null);
    router.push("/user/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout }}>
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