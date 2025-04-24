"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Cart.module.css";
import { Cart, CartItem, Product } from "@/app/components/cart_interface";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
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
        if (userIdFromToken) {
          setUserId(userIdFromToken);
        } else {
          setError("Không tìm thấy userId trong token");
          setLoading(false);
        }
      } catch (err) {
        setError("Lỗi khi giải mã token");
        setLoading(false);
      }
    } else {
      setError("Vui lòng đăng nhập để xem giỏ hàng");
      setLoading(false);
    }
  }, []);

  const fetchCart = async () => {
    try {
      const cartResponse = await fetch(
        `https://api-zeal.onrender.com/api/carts?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!cartResponse.ok) {
        throw new Error("Không thể lấy dữ liệu giỏ hàng");
      }
      const cartData: Cart = await cartResponse.json();
      setCart(cartData);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchCart();
  }, [userId]);

  const increaseQuantity = async (productId: string, currentQuantity: number) => {
    const newQuantity = currentQuantity + 1;
    try {
      const response = await fetch(`https://api-zeal.onrender.com/api/carts/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Không thể cập nhật số lượng: ${errorData.message || response.statusText}`
        );
      }

      await fetchCart();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định");
      }
    }
  };

  const decreaseQuantity = async (productId: string, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      await removeItem(productId);
      return;
    }

    const newQuantity = currentQuantity - 1;
    try {
      const response = await fetch(`https://api-zeal.onrender.com/api/carts/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Không thể cập nhật số lượng: ${errorData.message || response.statusText}`
        );
      }

      await fetchCart();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định");
      }
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const response = await fetch(`https://api-zeal.onrender.com/api/carts/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          productId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Không thể xóa sản phẩm: ${errorData.message || response.statusText}`
        );
      }

      await fetchCart();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định");
      }
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => {
      const price = Number(item.product.price) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const formatPrice = (price: number) => {
    const numericPrice = Number(price) || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericPrice);
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
          ) : error ? (
            <p className={styles.error}>Lỗi: {error}</p>
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
                {cart.items.map((item, index) => (
                  <tr
                    key={item._id || `${item.product._id}-${index}`}
                    className={styles["cart-row"]}
                  >
                    <td className={`${styles["cart-cell"]} ${styles.product}`}>
                      <Image
                        src={
                          item.product.images && item.product.images.length > 0
                            ? `https://api-zeal.onrender.com/images/${item.product.images[0]}`
                            : "https://via.placeholder.com/100x100?text=No+Image"
                        }
                        alt={item.product.name || "Sản phẩm"}
                        width={100}
                        height={100}
                        className={styles["cart-image"]}
                      />
                      <span>{item.product.name || "Sản phẩm không xác định"}</span>
                    </td>
                    <td className={styles["cart-cell"]}>{formatPrice(item.product.price)}</td>
                    <td className={`${styles["cart-cell"]} ${styles["quantity-controls"]}`}>
                      <button
                        className={`${styles["quantity-btn"]} ${styles.minus}`}
                        onClick={() => decreaseQuantity(item.product._id, item.quantity)}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={`${styles["quantity-btn"]} ${styles.plus}`}
                        onClick={() => increaseQuantity(item.product._id, item.quantity)}
                      >
                        +
                      </button>
                    </td>
                    <td className={styles["cart-cell"]}>
                      {formatPrice(item.product.price * item.quantity)}
                    </td>
                    <td className={styles["cart-cell"]}>
                      <i
                        className="fa-solid fa-trash"
                        onClick={() => removeItem(item.product._id)}
                        style={{ cursor: "pointer" }}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button className={styles["continue-shopping"]}>← Tiếp tục mua sắm</button>
        </div>

        <div className={styles["cart-right"]}>
          <div className={styles.discount}>
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              className={styles["discount-input"]}
            />
            <button className={`${styles["discount-btn"]} ${styles.apply}`}>
              Sử dụng
            </button>
          </div>
          <div className={styles.summary}>
            <p className={styles["summary-item"]}>
              Tổng: <span>{formatPrice(calculateTotal())}</span>
            </p>
            <p className={styles["summary-item"]}>
              Mã giảm: <span>-0đ</span>
            </p>
            <div className={`${styles.total} ${styles["summary-total"]}`}>
              <strong className={styles.total2}>
                Tổng cộng: <span>{formatPrice(calculateTotal())}</span>
              </strong>
            </div>
          </div>
          <button className={styles.checkout}>Thanh toán</button>
        </div>
      </div>
    </div>
  );
}