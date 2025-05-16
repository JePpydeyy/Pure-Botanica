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
    address: {
      ward: string;
      district: string;
      city: string;
      province: string;
    };
    sdt: string;
    note: string;
    paymentMethod: string;
  }>({
    fullName: "",
    address: {
      ward: "",
      district: "",
      city: "",
      province: "",
    },
    sdt: "",
    note: "",
    paymentMethod: "cod",
  });

  const [useDifferentInfo, setUseDifferentInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [hasCheckedOut, setHasCheckedOut] = useState(false); // Thêm trạng thái để theo dõi thanh toán

  useEffect(() => {
    setIsMounted(true);

    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://api-zeal.onrender.com/api/users/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Không thể lấy thông tin người dùng");
          return res.json();
        })
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            fullName: data.username || "",
            sdt: data.phone || "",
            address: {
              ward: data.address?.ward || "",
              district: data.address?.district || "",
              city: data.address?.city || "",
              province: data.address?.province || "",
            },
          }));
          setLoadingUser(false);
        })
        .catch(() => {
          setLoadingUser(false);
        });
    } else {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    // Chỉ kiểm tra và hiển thị thông báo nếu chưa thanh toán thành công
    if (!hasCheckedOut && (!checkoutData || !checkoutData.cart || !checkoutData.cart.items)) {
      alert("Không tìm thấy thông tin giỏ hàng! Vui lòng kiểm tra lại giỏ hàng của bạn.");
      router.push("/user/cart");
    }
  }, [checkoutData, router, hasCheckedOut]);

  if (!isMounted || !checkoutData || !checkoutData.cart || !checkoutData.cart.items) {
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
    const { name, value } = e.target;
    if (["ward", "district", "city", "province"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUseDifferentInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseDifferentInfo(e.target.checked);
    if (!e.target.checked) {
      const token = localStorage.getItem("token");
      if (token) {
        fetch("https://api-zeal.onrender.com/api/users/userinfo", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Không thể lấy thông tin người dùng");
            return res.json();
          })
          .then((data) => {
            setFormData({
              ...formData,
              fullName: data.username || "",
              sdt: data.phone || "",
              address: {
                ward: data.address?.ward || "",
                district: data.address?.district || "",
                city: data.address?.city || "",
                province: data.address?.province || "",
              },
            });
          });
      }
    }
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vui lòng đăng nhập để thanh toán");
      }

      if (!userId) {
        throw new Error("Không tìm thấy userId");
      }

      const attemptCheckout = async (useCoupon: boolean) => {
        const requestData = {
          userId: userId,
          address: formData.address,
          sdt: formData.sdt,
          paymentMethod: formData.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Chuyển khoản ngân hàng",
          note: formData.note || "",
          couponCode: useCoupon && couponCode ? couponCode : undefined,
        };

        console.log("Sending request data:", requestData);

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
          throw new Error(errorData.error || `Không thể thanh toán: ${response.statusText}`);
        }

        return await response.json();
      };

      try {
        const result = await attemptCheckout(true);
        setCheckoutData(null);
        localStorage.removeItem("checkoutData");
        setHasCheckedOut(true); // Đánh dấu đã thanh toán thành công
        alert("Đặt hàng thành công!");
        router.push("/user/");
      } catch (err) {
        const errorMessage = (err as Error).message;
        if (errorMessage.includes("Mã giảm giá") || errorMessage.includes("coupon")) {
          setError("Mã giảm giá không hợp lệ, đơn hàng sẽ được thanh toán với giá gốc.");
          const result = await attemptCheckout(false);
          setCheckoutData(null);
          localStorage.removeItem("checkoutData");
          setHasCheckedOut(true); // Đánh dấu đã thanh toán thành công
          alert("Đặt hàng thành công!");
          router.push("/user/");
        } else {
          throw err;
        }
      }
    } catch (err) {
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
        <form id="checkoutForm" onSubmit={handleConfirmOrder}>
          <div className={styles.formSection}>
            <h3 className={styles.formTitle}>Nhập thông tin giao hàng</h3>
            {loadingUser ? (
              <p>Đang tải thông tin...</p>
            ) : (
              <>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={useDifferentInfo}
                    onChange={handleUseDifferentInfo}
                  />
                  Gửi đến thông tin khác (người thân, bạn bè)
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và Tên"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !loadingUser}
                />
                <input
                  type="text"
                  name="ward"
                  placeholder="Xã/Phường (ví dụ: 391 Tô Ký)"
                  value={formData.address.ward}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !loadingUser}
                />
                <input
                  type="text"
                  name="district"
                  placeholder="Quận/Huyện (ví dụ: Quận 12)"
                  value={formData.address.district}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !loadingUser}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Thành phố (ví dụ: TP Hồ Chí Minh)"
                  value={formData.address.city}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !loadingUser}
                />
                <input
                  type="text"
                  name="province"
                  placeholder="Tỉnh (ví dụ: Hồ Chí Minh)"
                  value={formData.address.province}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !loadingUser}
                />
                <input
                  type="text"
                  name="sdt"
                  placeholder="Số điện thoại (ví dụ: 0342031354)"
                  value={formData.sdt}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !loadingUser}
                />
                <textarea
                  name="note"
                  placeholder="Ghi chú cho đơn hàng của bạn (ví dụ: Giao nhanh lên cho tao)"
                  value={formData.note}
                  onChange={handleChange}
                />
              </>
            )}
          </div>
        </form>

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
                form="checkoutForm"
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
                form="checkoutForm"
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
            <p className={styles.errorMessage}>{error}</p>
          )}

          <button form="checkoutForm" type="submit" className={styles.submitBtn}>
            Đặt hàng
          </button>

          <div className={styles.disclaimer}>
            Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý đơn đặt hàng của bạn, hỗ trợ trải nghiệm của bạn trên trang web này và cho các mục đích khác được mô tả trong chính sách bảo mật của chúng tôi.
          </div>
        </div>
      </div>
    </div>
  );
}