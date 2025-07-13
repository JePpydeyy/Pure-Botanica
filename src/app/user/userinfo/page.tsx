"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Userinfo.module.css";
import { User } from "@/app/components/user_interface";

interface Order {
  _id: string;
  createdAt: string;
  price: number;
  total: number;
  paymentStatus: string;
  shippingStatus: string;
  paymentMethod?: string;
  couponCode?: string;
  discount?: number;
  subtotal?: number;
  paymentCode?: string;
  items: {
    product: { _id: string; name?: string; price?: number; images?: string[]; option?: any[] };
    optionId?: string;
    quantity: number;
  }[];
}

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Không có token. Vui lòng đăng nhập.");
  }
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

const getImageUrl = (image: string): string => {
  if (!image) return "/images/placeholder.png";
  const cleanImage = image.startsWith("images/") ? image : `images/${image}`;
  return `https://api-zeal.onrender.com/${cleanImage}`;
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedSection, setSelectedSection] = useState<"profile" | "orders">("profile");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [paymentMap, setPaymentMap] = useState<Record<string, string>>({});

  const getProductPrice = (product: any, optionId?: string) => {
    if (!product) return 0;
    if (optionId && Array.isArray(product.option)) {
      const opt = product.option.find((o: any) => o._id === optionId);
      if (opt) return opt.discount_price && opt.discount_price > 0 ? opt.discount_price : opt.price;
    }
    return product.price || 0;
  };

  const fetchUserInfo = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId || userId === "undefined" || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("Không tìm thấy hoặc userId không hợp lệ. Vui lòng đăng nhập lại.");
      }
      const res = await fetchWithAuth(`https://api-zeal.onrender.com/api/users/userinfo?id=${userId}`);
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        } else if (res.status === 400) {
          throw new Error("ID người dùng không hợp lệ.");
        } else if (res.status === 403) {
          throw new Error("Bạn không có quyền truy cập thông tin này.");
        } else if (res.status === 404) {
          throw new Error("Không tìm thấy người dùng.");
        }
        throw new Error("Lỗi khi tải thông tin người dùng.");
      }
      const data = await res.json();
      const { password, passwordResetToken, ...safeUserData } = data;
      if (safeUserData.address && typeof safeUserData.address === "string") {
        const addressParts = safeUserData.address.split(", ").map((part: string) => part.trim());
        safeUserData.address = {
          addressLine: addressParts[0] || "",
          ward: addressParts[1] || "",
          district: addressParts[2] || "",
          cityOrProvince: addressParts[3] || "",
        };
      }
      setUser({ ...safeUserData, id: userId }); // Đảm bảo user.id được gán từ userId
      return safeUserData;
    } catch (err: any) {
      throw new Error(err.message || "Lỗi khi tải thông tin người dùng.");
    }
  };

  const fetchOrders = async (userId: string) => {
    if (!userId || userId.trim() === "" || userId === "undefined") {
      setOrders([]);
      setOrdersError("Không tìm thấy userId.");
      return;
    }
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await fetchWithAuth(`https://api-zeal.onrender.com/api/orders/user/${userId}`);
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        } else if (res.status === 404) {
          setOrders([]);
          return;
        }
        throw new Error("Lỗi khi tải danh sách đơn hàng.");
      }
      const data = await res.json();
      let ordersData: Order[] = [];
      if (data.status === "success" && Array.isArray(data.data)) {
        ordersData = data.data;
      } else if (Array.isArray(data)) {
        ordersData = data;
      } else if (data && Array.isArray(data.orders)) {
        ordersData = data.orders;
      } else {
        ordersData = [];
      }
      setOrders(ordersData);

      const paymentRes = await fetchWithAuth("https://api-zeal.onrender.com/api/payments/get-by-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (paymentRes.ok) {
        const paymentData = await paymentRes.json();
        let map: Record<string, string> = {};
        if (paymentData.status === "success" && Array.isArray(paymentData.data)) {
          paymentData.data.forEach((p: any) => {
            if (p.orderId && p.paymentCode) {
              map[p.orderId] = p.paymentCode;
            }
          });
        } else {
          console.log("Payment data is empty or invalid:", paymentData);
        }
        setPaymentMap(map);
      } else {
        console.warn("Payment request failed:", paymentRes.status, paymentRes.statusText);
        throw new Error("Lỗi khi tải thông tin thanh toán.");
      }
    } catch (err: any) {
      setOrdersError(err.message || "Lỗi khi tải danh sách đơn hàng.");
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchOrderById = async (orderId: string) => {
    try {
      const res = await fetchWithAuth(`https://api-zeal.onrender.com/api/orders/order/${orderId}`);
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        } else if (res.status === 404) {
          throw new Error("Không tìm thấy đơn hàng.");
        }
        throw new Error("Lỗi khi tải chi tiết đơn hàng.");
      }
      const data = await res.json();
      if (!data || !data._id || !data.items || !Array.isArray(data.items)) {
        throw new Error("Dữ liệu đơn hàng không hợp lệ.");
      }
      const paymentCode = paymentMap[data._id];
      setSelectedOrder({ ...data, paymentCode });
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải chi tiết đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const retryFetchOrders = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchOrders(userId);
    }
  };

  const formatPrice = (price: number) => {
    const numericPrice = Number(price) || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericPrice);
  };

  const renderOrderStatus = (order: Order) => (
    <div className={styles.statusGroup}>
      <span
        className={`${styles.statusButton} ${
          order.paymentStatus === "pending"
            ? styles.pending
            : order.paymentStatus === "completed"
            ? styles.completed
            : order.paymentStatus === "cancelled"
            ? styles.cancelled
            : styles.failed
        }`}
      >
        {order.paymentStatus === "pending"
          ? "Chờ thanh toán"
          : order.paymentStatus === "completed"
          ? "Đã thanh toán"
          : order.paymentStatus === "cancelled"
          ? "Đã hủy"
          : "Thanh toán lỗi"}
      </span>
      <span
        className={`${styles.statusButton} ${
          order.shippingStatus === "pending"
            ? styles.pending
            : order.shippingStatus === "in_transit"
            ? styles.intransit
            : order.shippingStatus === "delivered"
            ? styles.delivered
            : styles.returned
        }`}
        style={{ marginLeft: 8 }}
      >
        {order.shippingStatus === "pending"
          ? "Chờ giao hàng"
          : order.shippingStatus === "in_transit"
          ? "Đang giao"
          : order.shippingStatus === "delivered"
          ? "Đã giao"
          : "Đã trả hàng"}
      </span>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token) {
          setError("Không có token. Vui lòng đăng nhập.");
          setLoading(false);
          return;
        }
        if (!userId || userId === "undefined" || !userId.match(/^[0-9a-fA-F]{24}$/)) {
          setError("Không tìm thấy hoặc userId không hợp lệ. Vui lòng đăng nhập lại.");
          setLoading(false);
          return;
        }
        await fetchUserInfo();
        await fetchOrders(userId);
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className={styles.loading}>Đang tải thông tin...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!user) return <p className={styles.error}>Không tìm thấy thông tin người dùng.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3 className={styles.greeting}>
          Xin chào, <br /> {user.username}
        </h3>
        <ul className={styles.menu}>
          <li
            className={`${styles.menuItem} ${selectedSection === "profile" ? styles.active : ""}`}
            onClick={() => {
              setSelectedSection("profile");
              setSelectedOrder(null);
            }}
          >
            Tài khoản
          </li>
          <li
            className={`${styles.menuItem} ${selectedSection === "orders" ? styles.active : ""}`}
            onClick={() => {
              setSelectedSection("orders");
              setSelectedOrder(null);
            }}
          >
            Đơn hàng
          </li>
        </ul>
      </div>

      <div className={styles.content}>
        {selectedSection === "profile" && (
          <>
            <h2 className={styles.title}>Tài khoản</h2>
            <div className={styles.userInfo}>
              <p className={styles.infoRow}><strong>Tên:</strong> {user.username}</p>
              <p className={styles.infoRow}><strong>Email:</strong> {user.email}</p>
              <p className={styles.infoRow}><strong>SĐT:</strong> {user.phone}</p>
              <p className={styles.infoRow}>
                <strong>Địa chỉ:</strong>{" "}
                {user.address && typeof user.address !== "string" && user.address.addressLine
                  ? `${user.address.addressLine}, ${user.address.ward}, ${user.address.district}, ${user.address.cityOrProvince}`
                  : "Chưa cập nhật"}
              </p>
              <p className={styles.infoRow}><strong>Trạng thái:</strong> {user.status}</p>
              <p className={styles.infoRow}>
                <strong>Ngày sinh:</strong>{" "}
                {user.birthday ? new Date(user.birthday).toLocaleDateString() : "Chưa cập nhật"}
              </p>
            </div>
            <Link href={`/user/edituser/${localStorage.getItem("userId") || ""}`} className={styles.editLink}>
              <button className={styles.editButton}>Chỉnh sửa thông tin</button>
            </Link>
          </>
        )}

        {selectedSection === "orders" && !selectedOrder && (
          <>
            <h2 className={styles.title}>Đơn hàng</h2>
            {ordersLoading && <p className={styles.loading}>Đang tải danh sách đơn hàng...</p>}
            {ordersError && (
              <div className={styles.error}>
                <p>{ordersError}</p>
                <button onClick={retryFetchOrders} className={styles.editButton}>
                  Thử lại
                </button>
              </div>
            )}
            {!ordersLoading && !ordersError && (
              <>
                {orders.length === 0 ? (
                  <p className={styles.infoRow}>Chưa có đơn hàng</p>
                ) : (
                  <div className={styles.orderCards}>
                    {orders.map((order) => (
                      <div key={order._id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                          <span>Mã đơn hàng: {order._id}</span>
                          {renderOrderStatus(order)}
                        </div>
                        <p>Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Tổng tiền: {formatPrice(order.total)}</p>
                        <p>Thanh toán: {order.paymentMethod || "COD"}</p>
                        <button
                          className={styles.detailButton}
                          onClick={() => fetchOrderById(order._id)}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {selectedSection === "orders" && selectedOrder && (
          <>
            <h2 className={styles.title}>Chi tiết đơn hàng: {selectedOrder._id}</h2>
            {loading && <p className={styles.loading}>Đang tải chi tiết đơn hàng...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && !error && (
              <div className={styles.orderDetails}>
                <div className={styles.cartTitle}>
                  <span>Sản phẩm</span>
                  <span>Tổng</span>
                </div>
                {selectedOrder.items.map((item, index) => {
                  const price = getProductPrice(item.product, item.optionId);
                  let optionValue = "";
                  if (item.product.option && item.optionId) {
                    const opt = item.product.option.find((o: any) => o._id === item.optionId);
                    if (opt && opt.value) optionValue = opt.value;
                  }
                  return (
                    <div key={index} className={styles.productItem}>
                      <div className={styles.cartItemImage}>
                        <Image
                          src={
                            item.product.images && item.product.images.length > 0
                              ? getImageUrl(item.product.images[0])
                              : "https://via.placeholder.com/100x100?text=No+Image"
                          }
                          alt={item.product.name || "Sản phẩm"}
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className={styles.productInfo}>
                        <div className={styles.cartItemName}>
                          {item.product.name}
                          {optionValue && <span style={{ color: "#888", fontWeight: 400 }}> ({optionValue})</span>}
                        </div>
                        <div className={styles.cartItemDesc}>Số lượng: {item.quantity}</div>
                      </div>
                      <div className={styles.productPrice}>
                        {formatPrice(price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
                <div className={styles.cartSummary}>
                  <div className={styles.summaryRow}>
                    <span>Tổng</span>
                    <span>{formatPrice(selectedOrder.subtotal || selectedOrder.total)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Mã giảm</span>
                    <span>-{formatPrice(selectedOrder.discount || 0)}</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.total}`}>
                    <span>Tổng cộng</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                  <div className={styles.summaryNote}>
                    (Tổng giá bao gồm tất cả các loại thuế và phí)
                  </div>
                </div>
                {selectedOrder.paymentMethod === "bank" && selectedOrder.paymentStatus === "pending" && selectedOrder.paymentCode && (
                  <div className={styles.paymentNotice}>
                    <p style={{ color: "#e67e22", margin: "12px 0" }}>
                      Đơn hàng của bạn chưa được thanh toán. Vui lòng thanh toán online để hoàn tất đơn hàng.
                    </p>
                    <a
                      href={`/user/payment?paymentCode=${encodeURIComponent(selectedOrder.paymentCode)}&amount=${selectedOrder.total}`}
                      className={styles.paymentLink}
                      style={{
                        display: "inline-block",
                        background: "#2d8cf0",
                        color: "#fff",
                        padding: "8px 20px",
                        borderRadius: 6,
                        textDecoration: "none",
                        fontWeight: 500,
                        marginBottom: 16,
                      }}
                    >
                      Thanh toán ngay
                    </a>
                  </div>
                )}
                <div className={styles.addressSection}>
                  <h3>Địa chỉ nhận hàng</h3>
                  <p><strong>Tên:</strong> {user.username}</p>
                  <p><strong>SĐT:</strong> {user.phone}</p>
                  <p>
                    <strong>Địa chỉ:</strong>{" "}
                    {user.address && typeof user.address !== "string" && user.address.addressLine
                      ? `${user.address.addressLine}, ${user.address.ward}, ${user.address.district}, ${user.address.cityOrProvince}`
                      : "Chưa cập nhật"}
                  </p>
                  <p><strong>Giao hàng:</strong> Giao Hàng Nhanh</p>
                </div>
                <button
                  className={styles.backButton}
                  onClick={() => setSelectedOrder(null)}
                >
                  Trở lại
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}