"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Cart.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import ToastNotification from "../ToastNotification/ToastNotification";
import { Cart, CartItem } from "@/app/components/cart_interface";

// Biến môi trường
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-zeal.onrender.com";
const ERROR_IMAGE_URL = "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg";
const TIMEOUT_DURATION = 10000;

// Hàm tiện ích: Lấy URL hình ảnh
const getImageUrl = (image: string): string => {
  if (!image || typeof image !== "string" || image.trim() === "") {
    console.warn("Invalid image URL detected, using fallback:", ERROR_IMAGE_URL);
    return ERROR_IMAGE_URL;
  }
  try {
    new URL(image);
    return image;
  } catch (e) {
    const cleanImage = image.startsWith("/") ? image.substring(1) : image;
    const fullUrl = `${API_BASE_URL}/${cleanImage}`;
    console.log("Constructed image URL:", fullUrl);
    return fullUrl;
  }
};

// Hàm API: Gửi yêu cầu đến API với xử lý timeout
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Yêu cầu bị timeout");
    }
    throw error;
  }
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [cartMessage, setCartMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();
  const { setCheckoutData } = useCart();
  const [cacheBuster, setCacheBuster] = useState("");

  // Tạo cacheBuster sau khi hydration
  useEffect(() => {
    setCacheBuster(`t=${Date.now()}`);
  }, []);

  // Decode token to get userId
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartMessage({ type: "error", text: "Vui lòng đăng nhập để xem giỏ hàng" });
      setLoading(false);
      setTimeout(() => router.push("/user/login"), 3000);
      return;
    }

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/, "+").replace(/_/, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);
      const userIdFromToken = decoded.id || decoded._id;
      if (!userIdFromToken) {
        setCartMessage({ type: "error", text: "Không tìm thấy userId trong token" });
        setLoading(false);
        setTimeout(() => router.push("/user/login"), 3000);
        return;
      }
      setUserId(userIdFromToken);
    } catch (err) {
      setCartMessage({ type: "error", text: "Lỗi khi giải mã token" });
      setLoading(false);
      setTimeout(() => router.push("/user/login"), 3000);
    }
  }, [router]);

  // Fetch cart data
  const fetchCart = async () => {
    if (!userId) return;

    try {
      const cartData = await apiRequest(`/api/carts?userId=${userId}`);
      // Validate cart items
      if (cartData && Array.isArray(cartData.items)) {
        const validItems = cartData.items.filter(
          (item: CartItem) =>
            item.product &&
            item.product._id &&
            item.product.name &&
            Array.isArray(item.product.images) &&
            item.option &&
            typeof item.option._id === "string" &&
            typeof item.option.price === "number" &&
            typeof item.option.stock === "number"
        );
        setCart({ ...cartData, items: validItems });
        console.log("Fetched cart data:", { ...cartData, items: validItems });
      } else {
        setCart({ ...cartData, items: [] });
        console.warn("Invalid cart data, setting empty items:", cartData);
      }
      setLoading(false);
    } catch (err) {
      setCartMessage({ type: "error", text: (err as Error).message || "Lỗi không xác định khi tải giỏ hàng" });
      setLoading(false);
      setTimeout(() => setCartMessage(null), 3000);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  // Get product price from option
  const getProductPrice = (option: CartItem["option"] | null | undefined): number => {
    if (!option || typeof option.price !== "number") return 0;
    return option.discount_price && option.discount_price > 0 ? option.discount_price : option.price;
  };

  // Calculate subtotal, excluding out-of-stock or invalid items
  const calculateSubtotal = (): number => {
    if (!cart || !cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => {
      if (!item.option || (item.option.stock ?? 0) <= 0) return total; // Skip invalid or out-of-stock items
      const price = getProductPrice(item.option);
      return total + price * item.quantity;
    }, 0);
  };

  // Update total when cart or discount changes
  useEffect(() => {
    const subtotal = calculateSubtotal();
    const finalTotal = subtotal - discount;
    setTotal(finalTotal > 0 ? finalTotal : subtotal);
  }, [cart, discount]);

  // Increase item quantity
  const increaseQuantity = async (productId: string, optionId: string, currentQuantity: number) => {
    if (!userId) {
      setCartMessage({ type: "error", text: "Vui lòng đăng nhập để cập nhật số lượng" });
      return;
    }

    const item = cart?.items.find((i) => i.product._id === productId && i.option?._id === optionId);
    if (!item || !item.option) {
      setCartMessage({ type: "error", text: "Sản phẩm không hợp lệ" });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }
    if ((item.option.stock ?? 0) <= currentQuantity) {
      setCartMessage({ type: "error", text: "Sản phẩm đã hết hàng hoặc số lượng vượt quá tồn kho" });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    const newQuantity = currentQuantity + 1;
    try {
      await apiRequest(`/api/carts/update`, {
        method: "PUT",
        body: JSON.stringify({
          userId,
          productId,
          optionId,
          quantity: newQuantity,
        }),
      });
      await fetchCart();
    } catch (err) {
      setCartMessage({ type: "error", text: (err as Error).message || "Lỗi không xác định khi tăng số lượng" });
      setTimeout(() => setCartMessage(null), 3000);
    }
  };

  // Decrease item quantity
  const decreaseQuantity = async (productId: string, optionId: string, currentQuantity: number) => {
    if (!userId) {
      setCartMessage({ type: "error", text: "Vui lòng đăng nhập để cập nhật số lượng" });
      return;
    }

    if (!productId || !optionId) {
      setCartMessage({ type: "error", text: "Thiếu productId hoặc optionId" });
      return;
    }

    if (currentQuantity <= 1) {
      await removeItem(cart?._id || "", productId, optionId);
      return;
    }

    const item = cart?.items.find((i) => i.product._id === productId && i.option?._id === optionId);
    if (!item || !item.option) {
      setCartMessage({ type: "error", text: "Sản phẩm không hợp lệ" });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    const newQuantity = currentQuantity - 1;
    try {
      await apiRequest(`/api/carts/update`, {
        method: "PUT",
        body: JSON.stringify({
          userId,
          productId,
          optionId,
          quantity: newQuantity,
        }),
      });
      await fetchCart();
    } catch (err) {
      setCartMessage({ type: "error", text: (err as Error).message || "Lỗi không xác định khi giảm số lượng" });
      setTimeout(() => setCartMessage(null), 3000);
    }
  };

  // Remove item from cart
  const removeItem = async (cartId: string, productId: string, optionId: string) => {
    if (!userId) {
      setCartMessage({ type: "error", text: "Vui lòng đăng nhập để xóa sản phẩm" });
      return;
    }

    if (!cartId || !productId || !optionId) {
      setCartMessage({ type: "error", text: "Thiếu cartId, productId hoặc optionId" });
      return;
    }

    try {
      console.log("Removing item:", { userId, cartId, productId, optionId });
      const responseData = await apiRequest(`/api/carts/remove/${cartId}/${productId}/${optionId}?userId=${userId}`, {
        method: "DELETE",
      });
      console.log("Remove response:", responseData);
      await fetchCart();
      setCartMessage({ type: "success", text: "Sản phẩm đã được xóa khỏi giỏ hàng!" });
      setTimeout(() => setCartMessage(null), 3000);
    } catch (err) {
      console.error("Remove error:", { error: err, cartId, productId, optionId });
      setCartMessage({ type: "error", text: (err as Error).message || "Lỗi không xác định khi xóa sản phẩm" });
      setTimeout(() => setCartMessage(null), 3000);
    }
  };

  // Format price
  const formatPrice = (price: number): string => {
    const numericPrice = Number(price) || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericPrice);
  };

  // Apply coupon code
  const updatePrice = async () => {
    if (!userId || !couponCode.trim()) {
      setCartMessage({ type: "error", text: "Vui lòng nhập mã giảm giá" });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    try {
      const data = await apiRequest(`/api/carts/update-price`, {
        method: "POST",
        body: JSON.stringify({
          userId,
          couponCode,
        }),
      });
      setDiscount(data.discount || 0);
      setCartMessage({ type: "success", text: "Mã giảm giá đã được áp dụng!" });
      setTimeout(() => setCartMessage(null), 3000);
    } catch (err) {
      setCartMessage({ type: "error", text: "Lỗi khi áp dụng mã giảm giá" });
      setDiscount(0);
      setTimeout(() => setCartMessage(null), 3000);
    }
  };

  const handleApplyCoupon = () => {
    updatePrice();
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setCartMessage({ type: "error", text: "Giỏ hàng trống, không thể thanh toán" });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    // Exclude out-of-stock or invalid items from checkout
    const validItems = cart.items.filter((item) => item.option && (item.option.stock ?? 0) > 0);
    if (validItems.length === 0) {
      setCartMessage({ type: "error", text: "Không có sản phẩm nào trong giỏ hàng có sẵn để thanh toán" });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    const subtotal = calculateSubtotal();
    const finalTotal = total || subtotal;

    const checkoutData = {
      cart: { ...cart, items: validItems },
      userId,
      couponCode,
      subtotal,
      discount,
      total: finalTotal,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    }

    setCheckoutData(checkoutData);
    router.push("/user/checkout");
  };

  return (
    <div className={styles["cart-container"]}>
      <div className={styles["progress-container"]}>
        <div className={`${styles.step} ${styles.active}`}>1</div>
        <span className={styles["progress-label"]}>Giỏ hàng</span>
        <i className="fa-solid fa-chevron-right"></i>
        <div className={styles.step}>2</div>
        <span className={styles["progress-label"]}>Chi tiết đơn hàng</span>
        <i className="fa-solid fa-chevron-right"></i>
        <div className={styles.step}>3</div>
        <span className={styles["progress-label"]}>Đơn hàng hoàn tất</span>
      </div>
      <div className={styles["cart-content"]}>
        <div className={styles["cart-left"]}>
          {loading ? (
            <p>Đang tải giỏ hàng...</p>
          ) : !cart || !cart.items || cart.items.length === 0 ? (
            <p>Giỏ hàng trống</p>
          ) : (
            <table className={styles["cart-table"]}>
              <thead className={styles["cart-thead"]}>
                <tr className={styles["cart-row"]}>
                  <th className={styles["cart-header"]}>Sản phẩm</th>
                  <th className={styles["cart-header"]}>Giá</th>
                  <th className={styles["cart-header"]}>Số lượng</th>
                  <th className={styles["cart-header"]}>Tổng</th>
                  <th className={styles["cart-header"]}></th>
                </tr>
              </thead>
              <tbody className={styles["cart-tbody"]}>
                {cart.items.map((item, index) => {
                  const itemPrice = getProductPrice(item.option);
                  const isOutOfStock = !item.option || (item.option.stock ?? 0) <= 0;
                  return (
                    <tr
                      key={`${item.product._id}-${item.option?._id ?? index}-${index}`}
                      className={`${styles["cart-row"]} ${isOutOfStock ? styles["out-of-stock"] : ""}`}
                    >
                      <td className={`${styles["cart-cell"]} ${styles.product}`}>
                        <Image
                          src={
                            item.product.images && item.product.images.length > 0
                              ? `${getImageUrl(item.product.images[0])}?${cacheBuster}`
                              : ERROR_IMAGE_URL
                          }
                          alt={item.product.name || "Sản phẩm"}
                          width={100}
                          height={100}
                          quality={100}
                          className={styles["cart-image"]}
                          onError={(e) => {
                            console.error(`Image load failed for ${item.product.name}, switched to fallback`);
                            e.currentTarget.src = ERROR_IMAGE_URL;
                          }}
                        />
                        <span>
                          {item.product.name || "Sản phẩm không xác định"}
                          {item.option && ` - ${item.option.value}`}
                          {isOutOfStock && <span className={styles["out-of-stock-label"]}>(Hết hàng)</span>}
                        </span>
                      </td>
                      <td className={styles["cart-cell"]}>
                        {itemPrice > 0 ? formatPrice(itemPrice) : "N/A"}
                      </td>
                      <td className={`${styles["cart-cell"]} ${styles["quantity-controls"]}`}>
                        <button
                          className={`${styles["quantity-btn"]} ${styles.minus}`}
                          onClick={() => decreaseQuantity(item.product._id, item.option?._id ?? "", item.quantity)}
                          disabled={isOutOfStock}
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          className={`${styles["quantity-btn"]} ${styles.plus}`}
                          onClick={() => increaseQuantity(item.product._id, item.option?._id ?? "", item.quantity)}
                          disabled={isOutOfStock}
                        >
                          +
                        </button>
                      </td>
                      <td className={styles["cart-cell"]}>
                        {isOutOfStock ? "N/A" : formatPrice(itemPrice * item.quantity)}
                      </td>
                      <td className={styles["cart-cell"]}>
                        <i
                          className="fa-solid fa-trash"
                          onClick={() => removeItem(cart._id, item.product._id, item.option?._id ?? "")}
                          style={{ cursor: isOutOfStock ? "not-allowed" : "pointer", opacity: isOutOfStock ? 0.5 : 1 }}
                        ></i>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <Link href="/user" className={styles["continue-shopping"]}>
            ← Tiếp tục mua sắm
          </Link>
        </div>
        <div className={styles["cart-right"]}>
          <div className={styles.discount}>
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              className={styles["discount-input"]}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              className={`${styles["discount-btn"]} ${styles.apply}`}
              onClick={handleApplyCoupon}
            >
              Sử dụng
            </button>
          </div>
          <div className={styles.summary}>
            <p className={styles["summary-item"]}>
              Tổng: <span>{formatPrice(calculateSubtotal())}</span>
            </p>
            <p className={styles["summary-item"]}>
              Mã giảm: <span>-{formatPrice(discount)}</span>
            </p>
            <div className={`${styles.total} ${styles["summary-total"]}`}>
              <strong className={styles.total2}>
                Tổng cộng: <span>{formatPrice(total)}</span>
              </strong>
            </div>
          </div>
          <button
            className={styles.checkout}
            onClick={handleCheckout}
            disabled={!cart || !cart.items || cart.items.every((item) => !item.option || (item.option.stock ?? 0) <= 0)}
          >
            Thanh toán
          </button>
        </div>
      </div>
      {cartMessage && (
        <ToastNotification
          message={cartMessage.text}
          type={cartMessage.type}
          onClose={() => setCartMessage(null)}
        />
      )}
    </div>
  );
}