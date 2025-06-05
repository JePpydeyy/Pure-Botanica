"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./checkout.module.css";
import { useCart } from "../context/CartContext";
import { FormData, CheckoutData, CartItem } from "@/app/components/checkout_interface"; 

export default function CheckoutPage() {
  const router = useRouter();
  const { checkoutData, setCheckoutData } = useCart();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    address: {
      addressLine: "",
      ward: "",
      district: "",
      cityOrProvince: "",
    },
    sdt: "",
    note: "",
    paymentMethod: "cod",
  });

  const [useDifferentInfo, setUseDifferentInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:10000/api/users/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Không thể lấy thông tin người dùng");
          return res.json();
        })
        .then((data) => {
          console.log("User data from API:", data);
          setFormData((prev) => ({
            ...prev,
            fullName: data.username || "",
            sdt: data.phone || "",
            address: {
              addressLine: data.address?.addressLine || "",
              ward: data.address?.ward || "",
              district: data.address?.district || "",
              cityOrProvince: data.address?.cityOrProvince || "",
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
    if (!hasCheckedOut && (!checkoutData || !checkoutData.cart || !checkoutData.cart.items)) {
      alert("Không tìm thấy thông tin giỏ hàng! Vui lòng kiểm tra lại giỏ hàng của bạn.");
      router.push("/user/cart");
    }
  }, [checkoutData, router, hasCheckedOut]);

  if (!isMounted || !checkoutData || !checkoutData.cart || !checkoutData.cart.items) {
    return null;
  }

  const { cart, couponCode, subtotal, discount, total, userId } = checkoutData as CheckoutData;
  console.log("Checkout data:", checkoutData);

  const formatPrice = (price: number) => {
    const numericPrice = Number(price) || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericPrice);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (["addressLine", "ward", "district", "cityOrProvince"].includes(name)) {
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
        fetch("http://localhost:10000/api/users/userinfo", {
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
                addressLine: data.address?.addressLine || "",
                ward: data.address?.ward || "",
                district: data.address?.district || "",
                cityOrProvince: data.address?.cityOrProvince || "",
              },
            });
          });
      }
    }
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.sdt)) {
      setError("Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.");
      setIsLoading(false);
      return;
    }

    if (
      !formData.address.addressLine ||
      !formData.address.ward ||
      !formData.address.district ||
      !formData.address.cityOrProvince
    ) {
      setError("Vui lòng cung cấp đầy đủ thông tin địa chỉ.");
      setIsLoading(false);
      return;
    }

    if (!formData.paymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán.");
      setIsLoading(false);
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      setError("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
      setIsLoading(false);
      return;
    }

    const attemptCheckout = async (useCoupon: boolean) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vui lòng đăng nhập để thanh toán");
      }
      if (!userId) {
        throw new Error("Không tìm thấy userId");
      }
      const requestData = {
        userId: userId,
        address: formData.address,
        sdt: formData.sdt,
        paymentMethod: formData.paymentMethod === "cod" ? "cod" : "bank",
        note: formData.note || "",
        couponCode: useCoupon && couponCode ? couponCode : undefined,
        productDetails: cart.items.map((item: CartItem) => ({
          productId: item.product._id,
          details: item.details || {},
        })),
      };

      console.log("Sending request data:", requestData);

      const response = await fetch(`http://localhost:10000/api/carts/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Không thể thanh toán: ${response.statusText}`);
      }

      return data;
    };

    try {
      const result = await attemptCheckout(true);
      setCheckoutData(null);
      localStorage.removeItem("checkoutData");
      setHasCheckedOut(true);
      alert("Đặt hàng thành công!");
      router.push("/user/");
    } catch (err) {
      const errorMessage = (err as Error).message;
      if (errorMessage.includes("Mã giảm giá") || errorMessage.includes("coupon")) {
        setError("Mã giảm giá không hợp lệ, đơn hàng sẽ được thanh toán với giá gốc.");
        const result = await attemptCheckout(false);
        setCheckoutData(null);
        localStorage.removeItem("checkoutData");
        setHasCheckedOut(true);
        alert("Đặt hàng thành công!");
        router.push("/user/");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
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
                  name="addressLine"
                  placeholder="Địa chỉ cụ thể (số nhà, đường)"
                  value={formData.address.addressLine}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !loadingUser}
                />
                <input
                  type="text"
                  name="ward"
                  placeholder="Xã/Phường (ví dụ: Phường Tân Chánh Hiệp)"
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
                  name="cityOrProvince"
                  placeholder="Tỉnh/Thành phố (ví dụ: TP Hồ Chí Minh)"
                  value={formData.address.cityOrProvince}
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
                  pattern="[0-9]{10}"
                  title="Số điện thoại phải có 10 chữ số"
                  disabled={!useDifferentInfo && !loadingUser}
                />
                <textarea
                  name="note"
                  placeholder="Ghi chú cho đơn hàng của bạn (ví dụ: Giao nhanh lên nhé)"
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

          {cart.items.map((item: CartItem, index: number) => (
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
            <p className={styles.errorMessage} style={{ color: "red" }}>
              {error}
            </p>
          )}

          <button
            form="checkoutForm"
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đặt hàng"}
          </button>

          <div className={styles.disclaimer}>
            Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý đơn đặt hàng của bạn, hỗ trợ trải nghiệm của bạn trên trang web này và cho các mục đích khác được mô tả trong chính sách bảo mật của chúng tôi.
          </div>
        </div>
      </div>
    </div>
  );
}