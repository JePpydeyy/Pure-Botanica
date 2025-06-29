"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Cart.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const { setCheckoutData } = useCart();

  // Giải mã token để lấy userId
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

  // Lấy dữ liệu giỏ hàng và fetch chi tiết sản phẩm nếu cần
  const fetchCart = async () => {
    if (!userId) return;
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
      const cartData = await cartResponse.json();

      // Nếu items chỉ có product là _id, fetch chi tiết từng sản phẩm
      const itemsWithProduct = await Promise.all(
        (cartData.items || []).map(async (item: any) => {
          let productDetail = null;
          let productId = item.product?._id || item.product?.$oid || item.product;
          try {
            const res = await fetch(`https://api-zeal.onrender.com/api/products/${productId}`);
            if (res.ok) {
              productDetail = await res.json();
            }
          } catch (e) {
            // Nếu lỗi thì productDetail = null
          }
          return {
            ...item,
            product: productDetail,
          };
        })
      );

      setCart({
        ...cartData,
        items: itemsWithProduct,
      });
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchCart();
    // eslint-disable-next-line
  }, [userId]);

  // Lấy giá từ option
  const getProductPrice = (product: any, optionId: string) => {
    if (!product || !product.option || !Array.isArray(product.option)) {
      return 0;
    }
    const selectedOption = product.option.find((opt: any) => opt._id === optionId);
    if (selectedOption) {
      return selectedOption.discount_price && selectedOption.discount_price > 0
        ? selectedOption.discount_price
        : selectedOption.price || 0;
    }
    const firstOption = product.option[0];
    if (firstOption) {
      return firstOption.discount_price && firstOption.discount_price > 0
        ? firstOption.discount_price
        : firstOption.price || 0;
    }
    return 0;
  };

  // Tính subtotal dựa trên giá của option
  const calculateSubtotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total: number, item: any) => {
      const price = getProductPrice(item.product, item.optionId || "");
      return total + price * item.quantity;
    }, 0);
  };

  // Cập nhật total khi cart hoặc discount thay đổi
  useEffect(() => {
    const subtotal = calculateSubtotal();
    const finalTotal = subtotal - discount;
    setTotal(finalTotal > 0 ? finalTotal : subtotal);
    // eslint-disable-next-line
  }, [cart, discount]);

  // Tăng số lượng item
  const increaseQuantity = async (
    productId: string,
    optionId: string,
    currentQuantity: number
  ) => {
    const newQuantity = currentQuantity + 1;
    try {
      const response = await fetch(
        `https://api-zeal.onrender.com/api/carts/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId,
            productId,
            optionId,
            quantity: newQuantity,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Không thể cập nhật số lượng: ${errorData.message || response.statusText}`
        );
      }

      await fetchCart();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Giảm số lượng item
  const decreaseQuantity = async (
    productId: string,
    optionId: string,
    currentQuantity: number
  ) => {
    if (currentQuantity <= 1) {
      await removeItem(productId, optionId);
      return;
    }

    const newQuantity = currentQuantity - 1;
    try {
      const response = await fetch(
        `https://api-zeal.onrender.com/api/carts/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId,
            productId,
            optionId,
            quantity: newQuantity,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Không thể cập nhật số lượng: ${errorData.message || response.statusText}`
        );
      }

      await fetchCart();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Xóa item khỏi giỏ hàng
  const removeItem = async (productId: string, optionId: string) => {
    try {
      const response = await fetch(
        `https://api-zeal.onrender.com/api/carts/remove`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId,
            productId,
            optionId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Không thể xóa sản phẩm: ${errorData.message || response.statusText}`
        );
      }

      await fetchCart();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Định dạng giá
  const formatPrice = (price: number) => {
    const numericPrice = Number(price) || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericPrice);
  };

  // Áp dụng mã giảm giá
  const updatePrice = async () => {
    if (!userId || !couponCode.trim()) {
      setCouponError("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const response = await fetch(
        `https://api-zeal.onrender.com/api/carts/update-price`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId,
            couponCode,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setCouponError(errorData.error || "Mã giảm giá không hợp lệ");
        setDiscount(0);
        return;
      }

      const data = await response.json();
      setDiscount(data.discount || 0);
      setCouponError(null);
    } catch (err) {
      setCouponError("Lỗi khi áp dụng mã giảm giá");
      setDiscount(0);
    }
  };

  const handleApplyCoupon = () => {
    updatePrice();
  };

  // Xử lý thanh toán
  const handleCheckout = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setError("Giỏ hàng trống, không thể thanh toán");
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
                {cart.items.map((item: any, index: number) => {
                  if (!item.product) {
                    return (
                      <tr key={index} className={styles["cart-row"]}>
                        <td colSpan={5} className={styles["cart-cell"]}>
                          Sản phẩm không hợp lệ
                        </td>
                      </tr>
                    );
                  }
                  const itemPrice = getProductPrice(item.product, item.optionId || "");
                  const option = item.product.option?.find((opt: any) => opt._id === item.optionId) || item.product.option?.[0];
                  return (
                    <tr
                      key={`${item.product._id}-${item.optionId || index}`}
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
                          {option && ` - ${option.value}`}
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
                              option?._id || "",
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
                              option?._id || "",
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
                            removeItem(item.product._id, option?._id || "")
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
          {couponError && (
            <p
              className={styles.error}
              style={{ color: "red", fontSize: "14px", marginTop: "5px" }}
            >
              {couponError}
            </p>
          )}
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
    </div>
  );
}