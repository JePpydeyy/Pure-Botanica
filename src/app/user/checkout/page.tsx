"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./checkout.module.css";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { checkoutData, setCheckoutData } = useCart();

  const [formData, setFormData] = useState({
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
      fetch("https://api-zeal.onrender.com/api/users/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Không thể lấy thông tin người dùng");
          return res.json();
        })
        .then((data) => {
          console.log("User data from API:", data);
          
          let addressObj = {
            addressLine: "",
            ward: "",
            district: "",
            cityOrProvince: "",
          };

          if (data.address) {
            if (typeof data.address === "string") {
              const parts = data.address.split(", ");
              addressObj = {
                addressLine: parts[0] || "",
                ward: parts[1] || "",
                district: parts[2] || "",
                cityOrProvince: parts[3] || "",
              };
            } else if (typeof data.address === "object") {
              addressObj = {
                addressLine: data.address.addressLine || "",
                ward: data.address.ward || "",
                district: data.address.district || "",
                cityOrProvince: data.address.cityOrProvince || "",
              };
            }
          }

          setFormData((prev) => ({
            ...prev,
            fullName: data.username || "",
            sdt: data.phone || "",
            address: addressObj,
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

  const { cart, couponCode, subtotal, discount, total, userId } = checkoutData;
  console.log("Checkout data:", checkoutData);

const formatPrice = (price: number | string) => {
  const numericPrice = Number(price) || 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numericPrice);
};

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
    
    console.log("Form change:", name, value);
    
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
        fetch("https://api-zeal.onrender.com/api/users/userinfo", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Không thể lấy thông tin người dùng");
            return res.json();
          })
          .then((data) => {
            let addressObj = {
              addressLine: "",
              ward: "",
              district: "",
              cityOrProvince: "",
            };

            if (data.address) {
              if (typeof data.address === "string") {
                const parts = data.address.split(", ");
                addressObj = {
                  addressLine: parts[0] || "",
                  ward: parts[1] || "",
                  district: parts[2] || "",
                  cityOrProvince: parts[3] || "",
                };
              } else if (typeof data.address === "object") {
                addressObj = {
                  addressLine: data.address.addressLine || "",
                  ward: data.address.ward || "",
                  district: data.address.district || "",
                  cityOrProvince: data.address.cityOrProvince || "",
                };
              }
            }

            setFormData({
              ...formData,
              fullName: data.username || "",
              sdt: data.phone || "",
              address: addressObj,
            });
          });
      }
    }
  };

const handleConfirmOrder = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
    setError(null);
    setIsLoading(true);

    console.log("=== FORM DATA DEBUG ===");
    console.log("Form Data:", JSON.stringify(formData, null, 2));
    console.log("Address object:", formData.address);
    console.log("Each address field:");
    console.log("- addressLine:", `"${formData.address.addressLine}"`);
    console.log("- ward:", `"${formData.address.ward}"`);
    console.log("- district:", `"${formData.address.district}"`);
    console.log("- cityOrProvince:", `"${formData.address.cityOrProvince}"`);

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.sdt)) {
      setError("Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.");
      setIsLoading(false);
      return;
    }

    const { addressLine, ward, district, cityOrProvince } = formData.address;
    
    console.log("=== VALIDATION DEBUG ===");
    console.log("addressLine value:", addressLine, "- length:", addressLine?.length);
    console.log("ward value:", ward, "- length:", ward?.length);
    console.log("district value:", district, "- length:", district?.length);
    console.log("cityOrProvince value:", cityOrProvince, "- length:", cityOrProvince?.length);
    
    const isAddressLineValid = addressLine && addressLine.trim().length > 0;
    const isWardValid = ward && ward.trim().length > 0;
    const isDistrictValid = district && district.trim().length > 0;
    const isCityValid = cityOrProvince && cityOrProvince.trim().length > 0;

    console.log("Validation results:");
    console.log("- addressLine valid:", isAddressLineValid);
    console.log("- ward valid:", isWardValid);
    console.log("- district valid:", isDistrictValid);
    console.log("- city valid:", isCityValid);

    if (!isAddressLineValid || !isWardValid || !isDistrictValid || !isCityValid) {
      setError("Vui lòng cung cấp đầy đủ thông tin địa chỉ. Tất cả các trường địa chỉ đều bắt buộc.");
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
      
      const cleanAddress = {
        addressLine: formData.address.addressLine.trim(),
        ward: formData.address.ward.trim(),
        district: formData.address.district.trim(),
        cityOrProvince: formData.address.cityOrProvince.trim(),
      };

      const requestDataOptions = [
        {
          userId: userId,
          address: cleanAddress,
          sdt: formData.sdt.trim(),
          paymentMethod: formData.paymentMethod === "cod" ? "cod" : "bank",
          note: formData.note?.trim() || "",
          couponCode: useCoupon && couponCode ? couponCode : undefined,
          productDetails: cart.items.map((item) => ({
            productId: item.product._id,
            details: item.details || {},
          })),
        },
        {
          userId: userId,
          address: `${cleanAddress.addressLine}, ${cleanAddress.ward}, ${cleanAddress.district}, ${cleanAddress.cityOrProvince}`,
          sdt: formData.sdt.trim(),
          paymentMethod: formData.paymentMethod === "cod" ? "cod" : "bank",
          note: formData.note?.trim() || "",
          couponCode: useCoupon && couponCode ? couponCode : undefined,
          productDetails: cart.items.map((item) => ({
            productId: item.product._id,
            details: item.details || {},
          })),
        },
        {
          userId: userId,
          addressLine: cleanAddress.addressLine,
          ward: cleanAddress.ward,
          district: cleanAddress.district,
          cityOrProvince: cleanAddress.cityOrProvince,
          sdt: formData.sdt.trim(),
          paymentMethod: formData.paymentMethod === "cod" ? "cod" : "bank",
          note: formData.note?.trim() || "",
          couponCode: useCoupon && couponCode ? couponCode : undefined,
          productDetails: cart.items.map((item) => ({
            productId: item.product._id,
            details: item.details || {},
          })),
        }
      ];

      console.log("=== TRYING REQUEST OPTIONS ===");
      
      for (let i = 0; i < requestDataOptions.length; i++) {
        const requestData = requestDataOptions[i];
        
        console.log(`Trying option ${i + 1}:`, JSON.stringify(requestData, null, 2));

        try {
          const response = await fetch(`https://api-zeal.onrender.com/api/carts/checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestData),
          });

          console.log(`Option ${i + 1} response:`, response.status, response.statusText);

          if (response.ok) {
            const data = await response.json();
            console.log(`Option ${i + 1} SUCCESS:`, data);
            return data;
          } else {
            const errorData = await response.json();
            console.log(`Option ${i + 1} FAILED:`, errorData);
            
            if (i === requestDataOptions.length - 1) {
              throw new Error(errorData.error || `Không thể thanh toán: ${response.statusText}`);
            }
            continue;
          }
        } catch (fetchError) {
          console.log(`Option ${i + 1} FETCH ERROR:`, fetchError);
          
          if (i === requestDataOptions.length - 1) {
            throw fetchError;
          }
          continue;
        }
      }

      throw new Error("Tất cả các options đều fail");
    };

    try {
      const result = await attemptCheckout(true);
      setCheckoutData(null);
      localStorage.removeItem("checkoutData");
      setHasCheckedOut(true);
      alert("Đặt hàng thành công!");
      router.push("/user/");
    } catch (err) {
      const errorMessage = err.message;
      console.log("Final error:", errorMessage);
      
      if (errorMessage.includes("Mã giảm giá") || errorMessage.includes("coupon")) {
        setError("Mã giảm giá không hợp lệ, đơn hàng sẽ được thanh toán với giá gốc.");
        try {
          const result = await attemptCheckout(false);
          setCheckoutData(null);
          localStorage.removeItem("checkoutData");
          setHasCheckedOut(true);
          alert("Đặt hàng thành công!");
          router.push("/user/");
        } catch (err2) {
          setError(err2.message);
        }
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
        <div style={{ 
          background: '#f0f0f0', 
          padding: '10px', 
          margin: '10px 0', 
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          <strong>Debug Info:</strong>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
          <button 
            type="button" 
            onClick={() => console.log("Current form state:", formData)}
            style={{ margin: '5px', padding: '5px' }}
          >
            Log Form State
          </button>
        </div>

        <form onSubmit={handleConfirmOrder} className={styles.mainForm}>
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
                  placeholder="Họ và Tên *"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !loadingUser}
                />
                
                <input
                  type="text"
                  name="addressLine"
                  placeholder="Địa chỉ cụ thể (số nhà, đường) *"
                  value={formData.address.addressLine}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !loadingUser}
                />
                
                <input
                  type="text"
                  name="ward"
                  placeholder="Xã/Phường (ví dụ: Phường Tân Chánh Hiệp) *"
                  value={formData.address.ward}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !loadingUser}
                />
                
                <input
                  type="text"
                  name="district"
                  placeholder="Quận/Huyện (ví dụ: Quận 12) *"
                  value={formData.address.district}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !loadingUser}
                />
                
                <input
                  type="text"
                  name="cityOrProvince"
                  placeholder="Tỉnh/Thành phố (ví dụ: TP Hồ Chí Minh) *"
                  value={formData.address.cityOrProvince}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !loadingUser}
                />
                
                <input
                  type="text"
                  name="sdt"
                  placeholder="Số điện thoại (ví dụ: 0342031354) *"
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

          <div className={styles.cartSection}>
            <div className={styles.cartTitle}>
              <span>Sản phẩm</span>
              <span>Tổng</span>
            </div>

            {cart.items.map((item, index) => (
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
              <p className={styles.errorMessage} style={{ color: "red" }}>
                {error}
              </p>
            )}

            <button
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
        </form>
      </div>
    </div>
  );
}