"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./order.module.css";

export default function OrderPage() {
  interface Product {
    name: string;
    price: number;
    discountPrice: number | null;
    images?: string[];
  }

  interface Address {
    ward?: string;
    district?: string;
    city?: string;
    province?: string;
  }

  interface Order {
    _id: string;
    user: {
      _id: string;
      username: string;
    };
    createdAt: string;
    paymentStatus: string;
    address: Address | string | null;
    items: { product: Product; quantity: number }[];
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const statusMapping = {
    pending: "Chờ xử lý",
    completed: "Đã giao hàng",
    failed: "Thất bại",
    cancelled: "Đã hủy",
  };

  const reverseStatusMapping = {
    "Chờ xử lý": "pending",
    "Đã giao hàng": "completed",
    "Thất bại": "failed",
    "Đã hủy": "cancelled",
  };

  const formatAddress = (address: Address | string | null) => {
    if (!address || typeof address === "string") {
      return address || "Chưa có địa chỉ";
    }
    const { ward, district, city, province } = address;
    return [ward, district, city, province].filter(Boolean).join(", ") || "Chưa có địa chỉ";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<Order[]>("https://api-zeal.onrender.com/api/orders/admin/all");
        setOrders(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
        setError("Không thể tải danh sách đơn hàng");
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const getVietnameseStatus = (paymentStatus: string) => {
    return statusMapping[paymentStatus as keyof typeof statusMapping] || paymentStatus;
  };

  const handleStatusChange = async (orderId: string, userId: string, newStatus: string, currentStatus: string) => {
    if (currentStatus === "completed") {
      toast.error("Không thể thay đổi trạng thái đơn hàng đã giao thành công");
      return;
    }

    try {
      const englishStatus = reverseStatusMapping[newStatus as keyof typeof reverseStatusMapping] || newStatus;

      await axios.put(
        `https://api-zeal.onrender.com/api/orders/status/${orderId}?userId=${userId}`,
        { paymentStatus: englishStatus }
      );

      toast.success("Cập nhật trạng thái thành công");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, paymentStatus: englishStatus } : order
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleOrderClick = (order: Order, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "SELECT") {
      return;
    }
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const calculateProductTotal = (product: Product, quantity: number) => {
    const price = product.discountPrice || product.price;
    return price * quantity;
  };

  const calculateOrderTotal = (items: { product: Product; quantity: number }[]) => {
    return items.reduce((total, item) => total + calculateProductTotal(item.product, item.quantity), 0);
  };

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return `https://api-zeal.onrender.com/images/${product.images[0]}`;
    }
    return "https://via.placeholder.com/60x60?text=No+Image";
  };

  if (error) return <div className={styles.errorMessage}>Không thể tải danh sách đơn hàng</div>;

  return (
    <div className={styles.orderContainer}>
      <div className={styles.title}>
        <h1>Danh Sách Đơn Hàng</h1>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Địa Chỉ</th>
              <th>Ngày</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Chưa có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order._id} onClick={(e) => handleOrderClick(order, e)}>
                  <td>{index + 1}</td>
                  <td>{order.user.username}</td>
                  <td>{formatAddress(order.address)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <select
                      value={getVietnameseStatus(order.paymentStatus)}
                      onChange={(e) =>
                        handleStatusChange(order._id, order.user._id, e.target.value, order.paymentStatus)
                      }
                      className={`${styles.statusSelect} ${styles[order.paymentStatus]}`}
                      onClick={(e) => e.stopPropagation()}
                      disabled={order.paymentStatus === "completed"}
                    >
                      <option value="Chờ xử lý">Chờ xử lý</option>
                      <option value="Đã giao hàng">Đã giao hàng</option>
                      <option value="Thất bại">Thất bại</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPopup && selectedOrder && (
        <div className={styles.popupOverlay} onClick={closePopup}>
          <div className={styles.orderDetail} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closePopup}>
              ×
            </button>
            <h2>Chi Tiết Đơn Hàng</h2>
            <p>
              <strong>Khách hàng:</strong> {selectedOrder.user.username}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {formatAddress(selectedOrder.address)}
            </p>
            <p>
              <strong>Ngày:</strong> {formatDate(selectedOrder.createdAt)}
            </p>
            <p>
              <strong>Trạng thái:</strong> {getVietnameseStatus(selectedOrder.paymentStatus)}
            </p>
            <h3>Sản phẩm trong đơn hàng:</h3>
            <ul>
              {selectedOrder.items.map((item, idx) => (
                <li key={idx}>
                  <img
                    src={getProductImage(item.product)}
                    alt={item.product.name}
                    className={styles.productImage}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/60x60?text=Error";
                    }}
                  />
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>{item.product.name}</div>
                    <div className={styles.productPrice}>
                      {item.quantity} x {(item.product.discountPrice || item.product.price).toLocaleString()} VND ={" "}
                      {calculateProductTotal(item.product, item.quantity).toLocaleString()} VND
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.total}>
              Tổng tiền đơn hàng: {calculateOrderTotal(selectedOrder.items).toLocaleString()} VND
            </div>
          </div>
        </div>
      )}
    </div>
  );
}