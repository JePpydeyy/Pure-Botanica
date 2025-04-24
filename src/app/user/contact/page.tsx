"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  email: string | null;
  role: string | null;
  login: (token: string, email: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  email: null,
  role: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    if (storedToken && storedEmail && storedRole) {
      setToken(storedToken);
      setEmail(storedEmail);
      setRole(storedRole);
    }
  }, []);

  const login = (token: string, email: string, role: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
    setToken(token);
    setEmail(email);
    setRole(role);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setEmail(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, email, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
