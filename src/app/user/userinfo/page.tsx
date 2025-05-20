"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Userinfo.module.css";
import { User } from "@/app/components/user_interface";

interface Order {
  _id: string;
  createdAt: string;
  total: number;
  paymentStatus: string;
  items: { product: { _id: string; name?: string; price?: number }; quantity: number }[];
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedSection, setSelectedSection] = useState<"profile" | "orders">("profile");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Không có token. Vui lòng đăng nhập.");
      setLoading(false);
      return;
    }

    // Lấy thông tin người dùng
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("http://localhost:10000/api/users/userinfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Lỗi khi tải thông tin người dùng.");
        const data = await res.json();
        if (data.address && typeof data.address === "string") {
          const [addressLine, ward, district, cityOrProvince] = data.address
            .split(", ")
            .map((part: string) => part.trim());
          data.address = {
            addressLine: addressLine || "",
            ward: ward || "",
            district: district || "",
            cityOrProvince: cityOrProvince || "",
          };
        }
        setUser(data);
        return data; // Trả về dữ liệu người dùng
      } catch {
        throw new Error("Lỗi khi tải thông tin người dùng.");
      }
    };

    // Lấy danh sách đơn hàng - KHÔNG GỬI TOKEN để server hiểu đây là request lấy theo userId
    const fetchOrders = async (userId: string) => {
      try {
        const res = await fetch(`http://localhost:10000/api/orders/user/${userId}`, {
          // KHÔNG gửi Authorization header để server hiểu đây là request theo userId
          // headers: { Authorization: `Bearer ${token}` }, // BỎ DÒNG NÀY
        });
        if (!res.ok) throw new Error("Lỗi khi tải danh sách đơn hàng.");
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu đơn hàng không hợp lệ.");
        }
        setOrders(data);
      } catch {
        throw new Error("Lỗi khi tải danh sách đơn hàng.");
      }
    };

    // Thực hiện các request
    const fetchData = async () => {
      try {
        const userData = await fetchUserInfo();
        if (userData?._id) {
          await fetchOrders(userData._id); // Gọi fetchOrders với userId
        }
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm lấy chi tiết đơn hàng theo ID - GỬI TOKEN để server hiểu đây là request lấy theo orderId
  const fetchOrderById = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập để xem chi tiết đơn hàng.");
        return;
      }

      setLoading(true);
      setError(null);

      const res = await fetch(`http://localhost:10000/api/orders/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }, // GỬI TOKEN để server hiểu đây là request theo orderId
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Không tìm thấy đơn hàng.");
        } else if (res.status === 401) {
          throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        } else if (res.status === 403) {
          throw new Error("Bạn không có quyền xem đơn hàng này.");
        } else {
          throw new Error("Lỗi khi tải chi tiết đơn hàng.");
        }
      }

      const data = await res.json();
      if (!data || !data._id || !data.items || !Array.isArray(data.items)) {
        throw new Error("Dữ liệu đơn hàng không hợp lệ.");
      }

      setSelectedOrder(data);
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải chi tiết đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className={styles.loading}>Đang tải thông tin...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!user) return <p className={styles.error}>Không tìm thấy thông tin người dùng.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3 className={styles.greeting}>Xin chào, {user.username}</h3>
        <ul className={styles.menu}>
          <li
            className={`${styles.menuItem} ${selectedSection === "profile" ? styles.active : ""}`}
            onClick={() => {
              setSelectedSection("profile");
              setSelectedOrder(null);
            }}
          >
            Thông tin người dùng
          </li>
          <li
            className={`${styles.menuItem} ${selectedSection === "orders" ? styles.active : ""}`}
            onClick={() => {
              setSelectedSection("orders");
              setSelectedOrder(null);
            }}
          >
            Danh sách đơn hàng
          </li>
        </ul>
      </div>

      <div className={styles.content}>
        {selectedSection === "profile" && (
          <>
            <h2 className={styles.title}>Thông tin người dùng</h2>
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
    <h2 className={styles.title}>Danh sách đơn hàng</h2>
    {orders.length === 0 ? (
      <p className={styles.infoRow}>Chưa có đơn hàng</p>
    ) : (
      <div className={styles.tableContainer}>
        <table className={styles.orderTable}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableCell}>Mã đơn hàng</th>
              <th className={styles.tableCell}>Thời gian</th>
              <th className={styles.tableCell}>Tổng tiền</th>
              <th className={styles.tableCell}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className={styles.tableRow}
                onClick={() => fetchOrderById(order._id)}
              >
                <td className={styles.tableCell}>{order._id}</td>
                <td className={styles.tableCell}>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={styles.tableCell}>{order.total.toLocaleString()} VND</td>
                <td className={styles.tableCell}>
                  {(() => {
                    switch (order.paymentStatus) {
                      case 'pending':
                        return 'Đang chờ';
                      case 'completed':
                        return 'Hoàn thành';
                      case 'failed':
                        return 'Thất bại';
                      case 'cancelled':
                        return 'Đã hủy';
                      default:
                        return order.paymentStatus;
                    }
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
                <p><strong>Thời gian:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Tổng tiền:</strong> {selectedOrder.total.toLocaleString()} VND</p>
                <p><strong>Trạng thái:</strong> {selectedOrder.paymentStatus}</p>
                <p><strong>Sản phẩm:</strong></p>
                <ul>
                  {selectedOrder.items.map((item, index) => (
                    <li key={index}>
                      {item.product.name || `Sản phẩm ID: ${item.product._id}`} - Số lượng: {item.quantity}
                      {item.product.price && ` - Giá: ${(item.product.price * item.quantity).toLocaleString()} VND`}
                    </li>
                  ))}
                </ul>
                <button
                  className={styles.backButton}
                  onClick={() => setSelectedOrder(null)}
                >
                  Quay lại danh sách đơn hàng
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}