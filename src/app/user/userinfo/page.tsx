"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Thêm import Image
import styles from "./Userinfo.module.css";
import { User } from "@/app/components/user_interface";

interface Order {
  _id: string;
  createdAt: string;
  price: number ;
  total: number;
  paymentStatus: string;
  paymentMethod?: string;
  couponCode?: string; // Thêm trường couponCode
  discount?: number; // Thêm trường discount
  subtotal?: number; // Thêm trường subtotal
  items: { product: { _id: string; name?: string; price?: number; images?: string[] }; quantity: number }[];
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedSection, setSelectedSection] = useState<"profile" | "orders">("profile");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Lấy danh sách đơn hàng
  const fetchOrders = async (userId: string) => {
    if (!userId || userId.trim() === "") {
      console.warn("User ID is empty, skipping orders fetch");
      setOrders([]);
      return;
    }

    setOrdersLoading(true);
    setOrdersError(null);

    try {
      const token = localStorage.getItem("token");
      console.log(`Fetching orders for user: ${userId}`);

      const res = await fetch(`https://api-zeal.onrender.com//api/orders/user/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log(`Orders API response status: ${res.status}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error(`Lỗi ${res.status}:`, errorData);

        if (res.status === 404) {
          console.log("No orders found for user (404), setting empty array");
          setOrders([]);
          return;
        } else if (res.status === 401) {
          throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        } else if (res.status === 403) {
          throw new Error("Bạn không có quyền truy cập danh sách đơn hàng.");
        } else {
          throw new Error(errorData.message || `HTTP ${res.status}: Lỗi khi tải danh sách đơn hàng.`);
        }
      }

      const data = await res.json();
      console.log("Orders data:", data);

      let ordersData: Order[] = [];
      if (Array.isArray(data)) {
        ordersData = data;
      } else if (data && Array.isArray(data.orders)) {
        ordersData = data.orders;
      } else if (data && Array.isArray(data.data)) {
        ordersData = data.data;
      } else {
        console.warn("Unexpected orders data format:", data);
        ordersData = [];
      }

      setOrders(ordersData);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      const errorMessage = err.message || "Lỗi khi tải danh sách đơn hàng.";
      setOrdersError(errorMessage);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Không có token. Vui lòng đăng nhập.");
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const res = await fetch("https://api-zeal.onrender.com/api/users/userinfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${res.status}: Lỗi khi tải thông tin người dùng.`);
        }
        const data = await res.json();
        console.log("User data:", data);

        if (data.address && typeof data.address === "string") {
          const addressParts = data.address.split(", ").map((part: string) => part.trim());
          data.address = {
            addressLine: addressParts[0] || "",
            ward: addressParts[1] || "",
            district: addressParts[2] || "",
            cityOrProvince: addressParts[3] || "",
          };
        }
        setUser(data);
        return data;
      } catch (err: any) {
        console.error("Error fetching user info:", err);
        throw new Error(err.message || "Lỗi khi tải thông tin người dùng.");
      }
    };

    const fetchData = async () => {
      try {
        const userData = await fetchUserInfo();
        if (userData?._id) {
          console.log("User ID found:", userData._id);
          await fetchOrders(userData._id);
        } else {
          console.warn("No user ID found in user data");
          setOrders([]);
        }
      } catch (err: any) {
        console.error("Error in fetchData:", err);
        setError(err.message || "Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchOrderById = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập để xem chi tiết đơn hàng.");
        return;
      }
      setLoading(true);
      setError(null);

      const res = await fetch(`https://api-zeal.onrender.com//api/orders/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 404) {
          throw new Error("Không tìm thấy đơn hàng.");
        } else if (res.status === 401) {
          throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        } else if (res.status === 403) {
          throw new Error("Bạn không có quyền xem đơn hàng này.");
        } else {
          throw new Error(errorData.message || `HTTP ${res.status}: Lỗi khi tải chi tiết đơn hàng.`);
        }
      }

      const data = await res.json();
      if (!data || !data._id || !data.items || !Array.isArray(data.items)) {
        throw new Error("Dữ liệu đơn hàng không hợp lệ.");
      }
      setSelectedOrder(data);
    } catch (err: any) {
      console.error("Error fetching order details:", err);
      setError(err.message || "Lỗi khi tải chi tiết đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const retryFetchOrders = () => {
    if (user?._id) {
      fetchOrders(user._id);
    }
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price) || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numericPrice);
  };

  if (loading) return <p className={styles.loading}>Đang tải thông tin...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!user) return <p className={styles.error}>Không tìm thấy thông tin người dùng.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3 className={styles.greeting}>Xin chào, <br></br> {user.username}</h3>
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
            <Link href={`/user/edituser/${user._id}`} className={styles.editLink}>
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
                          <button
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
                              ? "Chờ xác nhận"
                              : order.paymentStatus === "completed"
                              ? "Đã giao"
                              : order.paymentStatus === "cancelled"
                              ? "Đã hủy"
                              : "Đang xử lý"}
                          </button>
                        </div>
                        <p>Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Tổng tiền: {order.total.toLocaleString()}đ</p>
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
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className={styles.productItem}>
                    <div className={styles.cartItemImage}>
                     <Image
                        src={
                          item.product.images && item.product.images.length > 0
                            ? `https://api-zeal.onrender.com/images/${item.product.images[0]}`
                            : "https://via.placeholder.com/100x100?text=No+Image"
                        }
                        alt={item.product.name || "Sản phẩm"}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <div className={styles.cartItemName}>{item.product.name || `Sản phẩm ${item.product._id}`}</div>
                      <div className={styles.cartItemDesc}>Số lượng: {item.quantity}</div>
                    </div>
                    <div className={styles.productPrice}>
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
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