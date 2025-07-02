"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./order.module.css";

interface Option {
  stock: number;
  value: string;
  price: number;
  discount_price: number | null;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  images?: string[];
  option: Option[];
}

interface Address {
  addressLine?: string;
  ward?: string;
  district?: string;
  cityOrProvince?: string;
}

interface Order {
  paymentMethod: string;
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  } | null;
  createdAt: string;
  paymentStatus: string;
  address: Address | null;
  items: { product: Product | null; optionId: string; quantity: number; images?: string[] }[];
}

export default function OrderPage() {
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

  const formatAddress = (address: Address | null) => {
    if (!address) return "Chưa có địa chỉ";
    const { addressLine, ward, district, cityOrProvince } = address;
    return [addressLine, ward, district, cityOrProvince].filter(Boolean).join(", ") || "Chưa có địa chỉ";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<Order[]>("https://api-zeal.onrender.com/api/orders/admin/all");
        console.log("API Response:", response.data); // Log để kiểm tra dữ liệu
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
    return isNaN(date.getTime())
      ? "Ngày không hợp lệ"
      : `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
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
    setSelectedOrder(null);
  };

  const getProductPrice = (product: Product | null, optionId: string) => {
    if (!product || !product.option || !optionId) {
      return 0;
    }
    const selectedOption = product.option.find((opt) => opt._id === optionId);
    if (!selectedOption) {
      return 0;
    }
    return selectedOption.discount_price ?? selectedOption.price ?? 0;
  };

  const calculateProductTotal = (product: Product | null, optionId: string, quantity: number) => {
    const price = getProductPrice(product, optionId);
    return price * quantity;
  };

  const calculateOrderTotal = (items: { product: Product | null; optionId: string; quantity: number }[]) => {
    if (!items || !Array.isArray(items)) {
      return 0;
    }
    return items.reduce((total, item) => {
      if (!item || !item.product) {
        return total;
      }
      return total + calculateProductTotal(item.product, item.optionId, item.quantity);
    }, 0);
  };

  const getProductImage = (product: Product | null) => {
    if (product?.images && product.images.length > 0) {
      return `https://api-zeal.onrender.com/${product.images[0]}`;
    }
    return "https://via.placeholder.com/60x60?text=No+Image";
  };

  if (error) return <div className={styles.errorMessage}>{error}</div>;

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
              <th>Phương thức thanh toán</th> {/* Thêm cột này */}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  Chưa có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order._id} onClick={(e) => handleOrderClick(order, e)}>
                  <td>{index + 1}</td>
                  <td>{order.user?.username || "Không xác định"}</td>
                  <td>{formatAddress(order.address)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <select
                      value={getVietnameseStatus(order.paymentStatus)}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          order.user?._id || "",
                          e.target.value,
                          order.paymentStatus
                        )
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
                  <td>
                    {order.paymentMethod === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : order.paymentMethod === "bank"
                      ? "Chuyển khoản"
                      : order.paymentMethod || "Không xác định"}
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
              <strong>Khách hàng:</strong> {selectedOrder.user?.username || "Không xác định"}
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
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item, idx) => (
                  <li key={idx}>
                    <img
                      src={getProductImage(item.product)}
                      alt={item.product?.name || "Không xác định"}
                      className={styles.productImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/60x60?text=Error";
                      }}
                    />
                    <div className={styles.productInfo}>
                      <div className={styles.productName}>{item.product?.name || "Không xác định"}</div>
                      <div className={styles.productPrice}>
                        {item.quantity} x {getProductPrice(item.product, item.optionId).toLocaleString()} VND ={" "}
                        {calculateProductTotal(item.product, item.optionId, item.quantity).toLocaleString()} VND
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li>Không có sản phẩm trong đơn hàng</li>
              )}
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