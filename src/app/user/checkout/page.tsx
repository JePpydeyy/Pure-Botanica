"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./checkout.module.css";
import { useCart } from "../context/CartContext";
import { CartItem, Cart } from "../../components/cart_interface";
import { CheckoutData } from "../../components/checkout_interface";

interface FormData {
  fullName: string;
  addressLine: string;
  ward: string;
  district: string;
  cityOrProvince: string;
  sdt: string;
  note: string;
  paymentMethod: "bank" | "cod";
}

interface UserInfo {
  username: string;
  phone: string;
  addressLine: string;
  ward: string;
  district: string;
  cityOrProvince: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { checkoutData, setCheckoutData } = useCart();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    addressLine: "",
    ward: "",
    district: "",
    cityOrProvince: "",
    sdt: "",
    note: "",
    paymentMethod: "cod",
  });

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [useDifferentInfo, setUseDifferentInfo] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [shippingStatus, setShippingStatus] = useState<string | null>(null); // Thêm trạng thái vận chuyển

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

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
          let addressLine = "";
          let ward = "";
          let district = "";
          let cityOrProvince = "";

          if (data.address) {
            if (typeof data.address === "string") {
              const parts = data.address.split(", ");
              addressLine = parts[0] || "";
              ward = parts[1] || "";
              district = parts[2] || "";
              cityOrProvince = parts[3] || "";
            } else if (typeof data.address === "object") {
              addressLine = data.address.addressLine || "";
              ward = data.address.ward || "";
              district = data.address.district || "";
              cityOrProvince = data.address.cityOrProvince || "";
            }
          }

          const userData: UserInfo = {
            username: data.username || "",
            phone: data.phone || "",
            addressLine,
            ward,
            district,
            cityOrProvince,
          };

          setUserInfo(userData);
          setFormData((prev) => ({
            ...prev,
            fullName: userData.username,
            addressLine: userData.addressLine,
            ward: userData.ward,
            district: userData.district,
            cityOrProvince: userData.cityOrProvince,
            sdt: userData.phone,
          }));
          setLoadingUser(false);
        })
        .catch((err) => {
          toast.error("Lỗi khi lấy thông tin người dùng: " + err.message);
          setLoadingUser(false);
        });
    } else {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      setLoadingUser(false);
      setTimeout(() => router.push("/user/login"), 3000);
    }
  }, [router, isClient]);

  useEffect(() => {
    if (!isClient || hasCheckedOut) return;
    if (!checkoutData || !checkoutData.cart || !checkoutData.cart.items) {
      toast.error("Không tìm thấy thông tin giỏ hàng! Vui lòng kiểm tra lại.");
      setTimeout(() => router.push("/user/cart"), 3000);
    }
  }, [checkoutData, router, hasCheckedOut, isClient]);

  if (!isClient || !checkoutData || !checkoutData.cart || !checkoutData.cart.items) {
    return null;
  }

  const { cart, couponCode, subtotal, discount, total, userId } = checkoutData as CheckoutData;

  const formatPrice = (price: number | string) => {
    const numericPrice = Number(price) || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericPrice);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "paymentMethod" && value !== "bank" && value !== "cod") return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUseDifferentInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseDifferentInfo(e.target.checked);
    if (!e.target.checked && userInfo) {
      setFormData((prev) => ({
        ...prev,
        fullName: userInfo.username,
        addressLine: userInfo.addressLine,
        ward: userInfo.ward,
        district: userInfo.district,
        cityOrProvince: userInfo.cityOrProvince,
        sdt: userInfo.phone,
      }));
      setIsEditing(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    setUserInfo(formData as unknown as UserInfo);
    setIsEditing(false);
    toast.success("Thông tin đã được cập nhật!");
  };

  const handleCancelEdit = () => {
    if (userInfo) {
      setFormData({
        ...formData,
        fullName: userInfo.username,
        addressLine: userInfo.addressLine,
        ward: userInfo.ward,
        district: userInfo.district,
        cityOrProvince: userInfo.cityOrProvince,
        sdt: userInfo.phone,
      });
    }
    setIsEditing(false);
  };

  const handleConfirmOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Kiểm tra số điện thoại
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    if (!phoneRegex.test(formData.sdt)) {
      toast.error("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ (bắt đầu bằng 03, 05, 07, 08, 09).");
      setIsLoading(false);
      return;
    }

    // Kiểm tra thông tin địa chỉ
    const { addressLine, ward, district, cityOrProvince } = formData;
    const isAddressLineValid = addressLine && addressLine.trim().length > 0;
    const isWardValid = ward && ward.trim().length > 0;
    const isDistrictValid = district && district.trim().length > 0;
    const isCityValid = cityOrProvince && cityOrProvince.trim().length > 0;

    if (!isAddressLineValid || !isWardValid || !isDistrictValid || !isCityValid) {
      toast.error("Vui lòng cung cấp đầy đủ thông tin địa chỉ.");
      setIsLoading(false);
      return;
    }

    // Kiểm tra phương thức thanh toán
    if (!formData.paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán.");
      setIsLoading(false);
      return;
    }

    // Kiểm tra giỏ hàng
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
      setIsLoading(false);
      return;
    }

    // Kiểm tra token
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      setIsLoading(false);
      return;
    }

    // Kiểm tra userId
    if (!userId) {
      toast.error("Không tìm thấy userId");
      setIsLoading(false);
      return;
    }

    // Kiểm tra items
    for (const item of cart.items) {
      if (!item.product?._id) {
        toast.error("Một hoặc nhiều sản phẩm trong giỏ hàng không hợp lệ.");
        setIsLoading(false);
        return;
      }
      if (item.option && !item.option._id) {
        toast.error("Tùy chọn sản phẩm không hợp lệ.");
        setIsLoading(false);
        return;
      }
      if (item.quantity <= 0) {
        toast.error("Số lượng sản phẩm phải lớn hơn 0.");
        setIsLoading(false);
        return;
      }
    }

    // Dữ liệu gửi đi
    const cleanData = {
      userId,
      addressLine: formData.addressLine.trim(),
      ward: formData.ward.trim(),
      district: formData.district.trim(),
      cityOrProvince: formData.cityOrProvince.trim(),
      sdt: formData.sdt.trim(),
      paymentMethod: formData.paymentMethod,
      note: formData.note?.trim() || "",
      couponCode: couponCode || "", // Thêm couponCode nếu có
    };

    console.log("Dữ liệu gửi đến API /carts/checkout:", cleanData);

    try {
      let checkoutResponse = await fetch(`https://api-zeal.onrender.com/api/carts/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanData),
      });

      if (!checkoutResponse.ok) {
        let errorData;
        try {
          errorData = await checkoutResponse.json();
          console.error("Lỗi từ API /carts/checkout:", errorData);
          if (errorData.message.includes("required")) {
            toast.error("Thiếu thông tin bắt buộc: " + errorData.message);
          } else if (errorData.message.includes("invalid")) {
            toast.error("Dữ liệu không hợp lệ: " + errorData.message);
          } else {
            toast.error(errorData.message || "Không thể tạo đơn hàng");
          }
        } catch {
          toast.error("Không thể phân tích phản hồi từ server");
        }
        throw new Error(errorData?.message || `Không thể tạo đơn hàng: ${checkoutResponse.statusText}`);
      }

      let checkoutData = await checkoutResponse.json();
      console.log("Phản hồi từ API /carts/checkout:", checkoutData);

      // Lấy orderId và shippingStatus từ phản hồi
      const orderId = checkoutData.order?._id;
      const initialShippingStatus = checkoutData.order?.shippingStatus || "pending";

      if (!orderId) {
        throw new Error("Không nhận được orderId từ phản hồi. Kiểm tra cấu trúc API: " + JSON.stringify(checkoutData));
      }

      setShippingStatus(initialShippingStatus); // Cập nhật trạng thái vận chuyển ban đầu

      if (formData.paymentMethod === "bank") {
        let paymentResponse = await fetch(`https://api-zeal.onrender.com/api/payments/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId,
            amount: total,
          }),
        });

        if (!paymentResponse.ok) {
          let errorData;
          try {
            errorData = await paymentResponse.json();
            console.error("Lỗi từ API /create:", errorData);
            toast.error(errorData.message || "Không thể tạo thanh toán");
          } catch {
            toast.error("Không thể phân tích phản hồi từ server");
          }
          throw new Error(errorData?.message || `Không thể tạo thanh toán: ${paymentResponse.statusText}`);
        }

        let paymentData = await paymentResponse.json();
        console.log("Phản hồi từ API /create:", paymentData);

        const { paymentCode, amount } = paymentData.data || paymentData || {};
        if (!paymentCode || !amount) {
          throw new Error("Thiếu thông tin thanh toán từ server. Kiểm tra phản hồi: " + JSON.stringify(paymentData));
        }

        toast.success("Đang tạo thanh toán!");
        setTimeout(() => {
          router.push(`/user/payment?paymentCode=${encodeURIComponent(paymentCode)}&amount=${encodeURIComponent(amount)}&shippingStatus=${encodeURIComponent(initialShippingStatus)}`);
        }, 2000);
      } else {
        setCheckoutData(null);
        localStorage.removeItem("checkoutData");
        setHasCheckedOut(true);
        toast.success("Đặt hàng thành công! Trạng thái vận chuyển: " + initialShippingStatus);
        setTimeout(() => router.push("/user/"), 3000);
      }
    } catch (err) {
      console.error("Lỗi chi tiết:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (image: string | undefined): string => {
    if (!image) return "https://via.placeholder.com/50x50?text=No+Image";
    const baseUrl = "https://api-zeal.onrender.com/";
    return `${baseUrl}${image}`;
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
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
                  disabled={!useDifferentInfo && !isEditing}
                />

                <input
                  type="text"
                  name="addressLine"
                  placeholder="Địa chỉ cụ thể (số nhà, đường) *"
                  value={formData.addressLine}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !isEditing}
                />

                <input
                  type="text"
                  name="ward"
                  placeholder="Xã/Phường (ví dụ: Phường Tân Chánh Hiệp) *"
                  value={formData.ward}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !isEditing}
                />

                <input
                  type="text"
                  name="district"
                  placeholder="Quận/Huyện (ví dụ: Quận 12) *"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !isEditing}
                />

                <input
                  type="text"
                  name="cityOrProvince"
                  placeholder="Tỉnh/Thành phố (ví dụ: TP Hồ Chí Minh) *"
                  value={formData.cityOrProvince}
                  onChange={handleChange}
                  required
                  disabled={!useDifferentInfo && !isEditing}
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
                  disabled={!useDifferentInfo && !isEditing}
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

            {cart.items.map((item: CartItem, index: number) => {
              const itemPrice = item.option?.discount_price || item.option?.price || 0;
              const imageUrl = getImageUrl(item.product.images?.[0]);
              return (
                <div key={index} className={styles.cartItem}>
                  <div className={styles.cartItemImage}>
                    <Image
                      src={imageUrl}
                      alt={item.product.name || "Sản phẩm"}
                      width={50}
                      height={50}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/50x50?text=Error";
                      }}
                    />
                  </div>
                  <div className={styles.cartItemDetails}>
                    <div className={styles.cartItemName}>{item.product.name || "Sản phẩm không xác định"}</div>
                    <div className={styles.cartItemDesc}>Số lượng: {item.quantity}</div>
                    {item.option && (
                      <div className={styles.cartItemDesc}>Tùy chọn: {item.option.value}</div>
                    )}
                  </div>
                  <div className={styles.cartItemPrice}>
                    {formatPrice(itemPrice * item.quantity)}
                  </div>
                </div>
              );
            })}

            <div className={styles.cartSummary}>
              <div className={styles.summaryRow}>
                <span>Tổng</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Mã giảm</span>
                <span>-{formatPrice(discount)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Trạng thái vận chuyển</span>
                <span>{shippingStatus || "Chưa xác định"}</span>
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