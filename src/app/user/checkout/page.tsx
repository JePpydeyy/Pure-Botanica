"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./checkout.module.css";
import { useCart } from "../context/CartContext";
import { CartItem } from "../../components/cart_interface";
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
  addresses?: Array<{
    fullName: string;
    sdt: string;
    addressLine: string;
    ward: string;
    district: string;
    cityOrProvince: string;
  }>;
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
  const [loadingUser, setLoadingUser] = useState(true);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [shippingStatus, setShippingStatus] = useState<string | null>(null);


  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [addressTab, setAddressTab] = useState<"saved" | "new">("saved");
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    sdt: "",
    addressLine: "",
    ward: "",
    district: "",
    cityOrProvince: "",
  });
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

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

          const addresses = Array.isArray(data.addresses) ? data.addresses : [];

          const userData: UserInfo = {
            username: data.username || "",
            phone: data.phone || "",
            addressLine,
            ward,
            district,
            cityOrProvince,
            addresses,
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

  // Lấy danh sách tỉnh/thành cho form địa chỉ mới
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => res.json())
      .then((data) => setCities(data));
  }, []);

  // Lấy quận/huyện khi chọn tỉnh/thành
  useEffect(() => {
    if (newAddress.cityOrProvince) {
      const selectedCity = cities.find((c) => c.name === newAddress.cityOrProvince);
      if (selectedCity) {
        fetch(`https://provinces.open-api.vn/api/p/${selectedCity.code}?depth=2`)
          .then((res) => res.json())
          .then((data) => setDistricts(data.districts || []));
      }
    } else {
      setDistricts([]);
    }
    setWards([]);
  }, [newAddress.cityOrProvince, cities]);

  // Lấy phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (newAddress.district) {
      const selectedDistrict = districts.find((d) => d.name === newAddress.district);
      if (selectedDistrict) {
        fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
          .then((res) => res.json())
          .then((data) => setWards(data.wards || []));
      }
    } else {
      setWards([]);
    }
  }, [newAddress.district, districts]);

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

  // Chọn địa chỉ đã lưu
  const handleSelectAddress = (address: any) => {
    setFormData((prev) => ({
      ...prev,
      fullName: address.fullName || "",
      addressLine: address.addressLine || "",
      ward: address.ward || "",
      district: address.district || "",
      cityOrProvince: address.cityOrProvince || "",
      sdt: address.sdt || "",
    }));
    setShowAddressPopup(false);
  };

  // Lưu địa chỉ mới
  const handleSaveNewAddress = () => {
    setFormData((prev) => ({
      ...prev,
      fullName: newAddress.fullName,
      sdt: newAddress.sdt,
      addressLine: newAddress.addressLine,
      ward: newAddress.ward,
      district: newAddress.district,
      cityOrProvince: newAddress.cityOrProvince,
    }));
    setShowAddressPopup(false);
    setAddressTab("saved");
    setNewAddress({
      fullName: "",
      sdt: "",
      addressLine: "",
      ward: "",
      district: "",
      cityOrProvince: "",
    });
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
      couponCode: couponCode || "",
    };

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

      // Lấy orderId và shippingStatus từ phản hồi
      const orderId = checkoutData.order?._id;
      const initialShippingStatus = checkoutData.order?.shippingStatus || "pending";

      if (!orderId) {
        throw new Error("Không nhận được orderId từ phản hồi. Kiểm tra cấu trúc API: " + JSON.stringify(checkoutData));
      }

      setShippingStatus(initialShippingStatus);

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
            toast.error(errorData.message || "Không thể tạo thanh toán");
          } catch {
            toast.error("Không thể phân tích phản hồi từ server");
          }
          throw new Error(errorData?.message || `Không thể tạo thanh toán: ${paymentResponse.statusText}`);
        }

        let paymentData = await paymentResponse.json();

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
      // eslint-disable-next-line no-console
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
                <button
                  type="button"
                  className={styles.selectAddressBtn}
                  onClick={() => setShowAddressPopup(true)}
                  style={{ marginBottom: 12 }}
                >
                  Chọn địa chỉ giao hàng
                </button>

                {/* Popup chọn địa chỉ với 2 tab */}
                {showAddressPopup && (
                  <div className={styles.popupOverlay}>
                    <div className={styles.popupContent}>
                      <h3>Chọn địa chỉ giao hàng</h3>
                      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                        <button
                          type="button"
                          className={addressTab === "saved" ? styles.activeTab : ""}
                          onClick={() => setAddressTab("saved")}
                        >
                          Địa chỉ của tôi
                        </button>
                        <button
                          type="button"
                          className={addressTab === "new" ? styles.activeTab : ""}
                          onClick={() => setAddressTab("new")}
                        >
                          Địa chỉ mới
                        </button>
                      </div>
                      {addressTab === "saved" ? (
                        <>
                          {(userInfo?.addresses || []).length === 0 && (
                            <div>Chưa có địa chỉ nào.</div>
                          )}
                          {(userInfo?.addresses || []).map((address, idx) => (
                            <div key={idx} className={styles.addressItem}>
                              <div>
                                {address.fullName} - {address.sdt}<br />
                                {address.addressLine}, {address.ward}, {address.district}, {address.cityOrProvince}
                              </div>
                              <button type="button" onClick={() => handleSelectAddress(address)}>
                                Chọn
                              </button>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div>
                          <input
                            type="text"
                            placeholder="Họ và tên"
                            value={newAddress.fullName}
                            onChange={e => setNewAddress(f => ({ ...f, fullName: e.target.value }))}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Số điện thoại"
                            value={newAddress.sdt}
                            onChange={e => setNewAddress(f => ({ ...f, sdt: e.target.value }))}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Địa chỉ cụ thể"
                            value={newAddress.addressLine}
                            onChange={e => setNewAddress(f => ({ ...f, addressLine: e.target.value }))}
                            required
                          />
                          <select
                            name="cityOrProvince"
                            value={newAddress.cityOrProvince}
                            onChange={e => setNewAddress(f => ({ ...f, cityOrProvince: e.target.value, district: "", ward: "" }))}
                            required
                          >
                            <option value="">Chọn tỉnh/thành phố</option>
                            {cities.map((city) => (
                              <option key={city.code} value={city.name}>{city.name}</option>
                            ))}
                          </select>
                          <select
                            name="district"
                            value={newAddress.district}
                            onChange={e => setNewAddress(f => ({ ...f, district: e.target.value, ward: "" }))}
                            required
                            disabled={!newAddress.cityOrProvince}
                          >
                            <option value="">Chọn quận/huyện</option>
                            {districts.map((district) => (
                              <option key={district.code} value={district.name}>{district.name}</option>
                            ))}
                          </select>
                          <select
                            name="ward"
                            value={newAddress.ward}
                            onChange={e => setNewAddress(f => ({ ...f, ward: e.target.value }))}
                            required
                            disabled={!newAddress.district}
                          >
                            <option value="">Chọn phường/xã</option>
                            {wards.map((ward) => (
                              <option key={ward.code} value={ward.name}>{ward.name}</option>
                            ))}
                          </select>
                          <button type="button" onClick={handleSaveNewAddress}>Lưu địa chỉ</button>
                        </div>
                      )}
                      <button type="button" onClick={() => setShowAddressPopup(false)}>
                        Đóng
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và Tên *"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="addressLine"
                  placeholder="Địa chỉ cụ thể (số nhà, đường) *"
                  value={formData.addressLine}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="ward"
                  placeholder="Xã/Phường (ví dụ: Phường Tân Chánh Hiệp) *"
                  value={formData.ward}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="district"
                  placeholder="Quận/Huyện (ví dụ: Quận 12) *"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="cityOrProvince"
                  placeholder="Tỉnh/Thành phố (ví dụ: TP Hồ Chí Minh) *"
                  value={formData.cityOrProvince}
                  onChange={handleChange}
                  required
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
                />

                <textarea
                  name="note"
                  placeholder="Ghi chú cho đơn hàng của bạn (ví dụ: Giao nhanh lên nhé)"
                  value={formData.note}
                  onChange={handleChange}
                />

                <div className={styles.paymentMethods}>
                  <div className={styles.paymentTitle} >
                    Chọn hình thức thanh toán
                  </div>
                  <div className={styles.paymentMethodWrapper}>
                    <div className={styles.paymentMethod}>
                      <input
                        type="radio"
                        id="bank"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === "bank"}
                        onChange={handleChange}
                      />
                      <label htmlFor="bank" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <img src="https://img.icons8.com/?size=100&id=VbL8v3mm1qyp&format=png&color=000000" alt="Bank" width={40} height={40} />
                        Chuyển khoản ngân hàng
                      </label>
                    </div>
                    <hr />
                    <div className={styles.paymentMethod}>
                      <input
                        type="radio"
                        id="cod"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleChange}
                      />
                      <label htmlFor="cod" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <img src="https://img.icons8.com/?size=100&id=76948&format=png&color=000000" alt="Tiền mặt" width={40} height={40} />
                        Thanh toán khi nhận hàng
                      </label>
                    </div>
                  </div>
                </div>
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
                    <img
                      src={imageUrl}
                      alt={item.product.name || "Sản phẩm"}
                      width={70}
                      height={70}
                      className={styles.cartItemImage}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/50x50?text=No+Image";
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
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Tổng cộng</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className={styles.summaryNote}>
                (Tổng giá áp dụng giá giao hàng của bạn, bao gồm tất cả các loại thuế và phí)
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