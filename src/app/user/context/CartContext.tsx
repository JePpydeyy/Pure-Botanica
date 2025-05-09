"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Tạo Context
const CartContext = createContext<{
  checkoutData: any;
  setCheckoutData: (data: any) => void;
} | undefined>(undefined);

// Tạo Provider để bao bọc ứng dụng
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [checkoutData, setCheckoutData] = useState<any>(() => {
    // Chỉ khởi tạo từ localStorage nếu chạy ở client-side
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("checkoutData");
      return savedData ? JSON.parse(savedData) : null;
    }
    return null;
  });

  // Đồng bộ checkoutData với localStorage chỉ ở client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (checkoutData) {
        localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      } else {
        localStorage.removeItem("checkoutData");
      }
    }
  }, [checkoutData]);

  return (
    <CartContext.Provider value={{ checkoutData, setCheckoutData }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook để sử dụng Context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}