"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Cart.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import ToastNotification from "../ToastNotification/ToastNotification";

// Define TypeScript interfaces for type safety
interface CartItem {
  product: { _id: string; name: string; images: string[] };
  option: { _id: string; value: string; price: number; discount_price?: number };
  quantity: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
}

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
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
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
      const response = await fetch(
        `https://api-zeal.onrender.com/api/carts?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ''}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể lấy dữ liệu giỏ hàng");
      }

      const cartData = await response.json();
      setCart(cartData);
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
  const getProductPrice = (option: CartItem["option"]): number => {
    if (!option) return 0;
    return option.discount_price && option.discount_price > 0
      ? option.discount_price
      : option.price || 0;
  };

  // Calculate subtotal
  const calculateSubtotal = (): number => {
    if (!cart || !cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => {
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

    const newQuantity = currentQuantity + 1;
    try {
      const response = await fetch(`https://api-zeal.onrender.com/api/carts/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ''}`,
        },
        body: JSON.stringify({
          userId,
          productId,
          optionId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể cập nhật số lượng");
      }

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
      await removeItem(cart?._id || '', productId, optionId);
      return;
    }

    const newQuantity = currentQuantity - 1;
    try {
      const response = await fetch(`https://api-zeal.onrender.com/api/carts/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ''}`,
        },
        body: JSON.stringify({
          userId,
          productId,
          optionId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể cập nhật số lượng");
      }

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
      console.log("Removing item:", { userId, cartId, productId, optionId }); // Debug log
      const response = await fetch(
        `https://api-zeal.onrender.com/api/carts/remove/${cartId}/${productId}/${optionId}?userId=${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ''}`,
          },
        }
      );

      const responseData = await response.json();
      console.log("Remove response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || "Không thể xóa sản phẩm");
      }

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
      const response = await fetch(
        `https://api-zeal.onrender.com/api/carts/update-price`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ''}`,
          },
          body: JSON.stringify({
            userId,
            couponCode,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setCartMessage({ type: "error", text: errorData.error || "Mã giảm giá không hợp lệ" });
        setDiscount(0);
        setTimeout(() => setCartMessage(null), 3000);
        return;
      }

      const data = await response.json();
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

    const subtotal = calculateSubtotal();
    const finalTotal = total || subtotal;

    const checkoutData = {
      cart,
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

  // Get image URL
  const getImageUrl = (image: string): string => {
    if (!image) return "https://via.placeholder.com/100x100?text=No+Image";
    return image.startsWith("http") ? image : `https://api-zeal.onrender.com/${image}`;
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
                  return (
                    <tr
                      key={`${item.product._id}-${item.option._id}-${index}`}
                      className={styles["cart-row"]}
                    >
                      <td className={`${styles["cart-cell"]} ${styles.product}`}>
                        <Image
                          src={
                            item.product.images && item.product.images.length > 0
                              ? getImageUrl(item.product.images[0])
                              : "https://via.placeholder.com/100x100?text=No+Image"
                          }
                          alt={item.product.name || "Sản phẩm"}
                          width={100}
                          height={100}
                          className={styles["cart-image"]}
                        />
                        <span>
                          {item.product.name || "Sản phẩm không xác định"}
                          {item.option && ` - ${item.option.value}`}
                        </span>
                      </td>
                      <td className={styles["cart-cell"]}>
                        {formatPrice(itemPrice)}
                      </td>
                      <td
                        className={`${styles["cart-cell"]} ${styles["quantity-controls"]}`}
                      >
                        <button
                          className={`${styles["quantity-btn"]} ${styles.minus}`}
                          onClick={() =>
                            decreaseQuantity(
                              item.product._id,
                              item.option._id,
                              item.quantity
                            )
                          }
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          className={`${styles["quantity-btn"]} ${styles.plus}`}
                          onClick={() =>
                            increaseQuantity(
                              item.product._id,
                              item.option._id,
                              item.quantity
                            )
                          }
                        >
                          +
                        </button>
                      </td>
                      <td className={styles["cart-cell"]}>
                        {formatPrice(itemPrice * item.quantity)}
                      </td>
                      <td className={styles["cart-cell"]}>
                        <i
                          className="fa-solid fa-trash"
                          onClick={() =>
                            removeItem(cart._id, item.product._id, item.option._id)
                          }
                          style={{ cursor: "pointer" }}
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
            disabled={!cart || !cart.items || cart.items.length === 0}
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