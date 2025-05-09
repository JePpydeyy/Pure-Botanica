"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./checkout.module.css";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { checkoutData, setCheckoutData } = useCart();

  const [formData, setFormData] = useState<{
    fullName: string;
    address: string;
    sdt: string;
    note: string;
    paymentMethod: string;
  }>({
    fullName: "",
    address: "",
    sdt: "",
    note: "",
    paymentMethod: "cod",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkoutData || !checkoutData.cart || !checkoutData.cart.items) {
      alert("Không tìm thấy thông tin giỏ hàng! Vui lòng kiểm tra lại giỏ hàng của bạn.");
      router.push("/user/cart");
    }
  }, [checkoutData, router]);

  if (!checkoutData || !checkoutData.cart || !checkoutData.cart.items) {
    return null;
  }

  const { cart, couponCode, subtotal, discount, total, userId } = checkoutData;

  const formatPrice = (price: number) => {
    const numericPrice = Number(price) || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericPrice);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Kiểm tra token
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        throw new Error("Vui lòng đăng nhập để thanh toán");
      }

      // Kiểm tra userId
      if (!userId) {
        throw new Error("Không tìm thấy userId");
      }

      const requestData = {
        userId: userId,
        address: formData.address,
        sdt: formData.sdt,
        paymentMethod: formData.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Chuyển khoản ngân hàng",
        note: formData.note || "",
        couponCode: couponCode || "",
      };

      console.log("Request data to backend:", requestData);

      const response = await fetch(`https://api-zeal.onrender.com/api/carts/checkout`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error response:", errorData); // Log chi tiết lỗi từ backend
        throw new Error(errorData.error || `Không thể thanh toán: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Checkout response:", result);

      setCheckoutData(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("checkoutData");
      }

      alert("Đặt hàng thành công!");
      router.push("/user/order-complete");
    } catch (err) {
      console.error("Checkout error:", err);
      setError((err as Error).message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepText}>Giỏ hàng</div>
        </div>
        <div className={styles.stepArrow}>›</div>
        <div className={styles.step}>
          <div className={`${styles.stepNumber} ${styles.active}`}>2</div>
          <div className={styles.stepText}>Chi tiết đơn hàng</div>
        </div>
        <div className={styles.stepArrow}>›</div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepText}>Đơn hàng hoàn tất</div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <h3 className={styles.formTitle}>Nhập thông tin của bạn</h3>
          <form onSubmit={handleConfirmOrder}>
            <input
              type="text"
              name="fullName"
              placeholder="Họ và Tên"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ (ví dụ: 391 Tô Ký, Quận 12, TP Hồ Chí Minh)"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="sdt"
              placeholder="Số điện thoại (ví dụ: 0342031354)"
              value={formData.sdt}
              onChange={handleChange}
              required
            />

            <textarea
              name="note"
              placeholder="Ghi chú cho đơn hàng của bạn (ví dụ: Giao nhanh lên cho tao)"
              value={formData.note}
              onChange={handleChange}
            ></textarea>

            <div className={styles.cartSection}>
              <div className={styles.cartTitle}>
                <span>Sản phẩm</span>
                <span>Tổng</span>
              </div>

              {cart.items.map((item: any, index: number) => (
                <div key={index} className={styles.cartItem}>
                  <div className={styles.cartItemImage}>
                    <Image
                      src={
                        item.product.images && item.product.images.length > 0
                          ? `https://api-zeal.onrender.com/images/${item.product.images[0]}`
                          : "https://via.placeholder.com/50x50?text=No+Image"
                      }
                      alt={item.product.name || "Sản phẩm"}
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className={styles.cartItemDetails}>
                    <div className={styles.cartItemName}>{item.product.name || "Sản phẩm không xác định"}</div>
                    <div className={styles.cartItemDesc}>Số lượng: {item.quantity}</div>
                  </div>
                  <div className={styles.cartItemPrice}>
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}

              <div className={styles.cartSummary}>
                <div className={styles.summaryRow}>
                  <span>Tổng</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Mã giảm</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.total}`}>
                  <span>Tổng cộng</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className={styles.summaryNote}>
                  (Tổng giá áp dụng giá giao hàng của bạn, bao gồm tất cả các loại thuế và phí)
                </div>
              </div>

              <div className={styles.paymentMethods}>
                <div className={styles.paymentMethod}>
                  <input
                    type="radio"
                    id="bank"
                    name="paymentMethod"
                    value="bank"
                    checked={formData.paymentMethod === "bank"}
                    onChange={handleChange}
                  />
                  <label htmlFor="bank">Chuyển khoản ngân hàng</label>
                  <div className={styles.paymentDescription}>
                    Thực hiện thanh toán vào ngay tài khoản ngân hàng của chúng tôi. Vui lòng sử dụng Mã đơn hàng của bạn trong phần Nội dung thanh toán. Đơn hàng sẽ được giao sau khi tiền đã chuyển.
                  </div>
                </div>

                <div className={styles.paymentMethod}>
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                  />
                  <label htmlFor="cod">Thanh toán khi nhận hàng</label>
                  <div className={styles.paymentDescription}>
                    Thanh toán khi nhận hàng
                  </div>
                </div>
              </div>

              {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
              )}

              <button type="submit" className={styles.submitBtn}>
                Đặt hàng
              </button>

              <div className={styles.disclaimer}>
                Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý đơn đặt hàng của bạn, hỗ trợ trải nghiệm của bạn trên trang web này và cho các mục đích khác được mô tả trong chính sách bảo mật của chúng tôi.
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}