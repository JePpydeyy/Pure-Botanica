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
  shippingStatus: string;
  address: Address | null;
  items: { product: Product | null; optionId: string; quantity: number; images?: string[] }[];
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<{
    orderId: string;
    userId: string;
    newStatus: string;
    currentStatus: string;
  } | null>(null);

  const paymentStatusMapping = {
    pending: "Chờ xử lý",
    completed: "Đã thanh toán",
    failed: "Thất bại",
    cancelled: "Đã hủy",
  };

  const shippingStatusMapping = {
    pending: "Chờ xử lý",
    in_transit: "Đang vận chuyển",
    delivered: "Đã giao hàng",
    returned: "Đã hoàn",
  };

  const reverseShippingStatusMapping = {
    "Chờ xử lý": "pending",
    "Đang vận chuyển": "in_transit",
    "Đã giao hàng": "delivered",
    "Đã hoàn": "returned",
  };

  // Define valid next statuses for progressive updates
  const statusProgression: { [key: string]: string[] } = {
    pending: ["in_transit"],
    in_transit: ["delivered"],
    delivered: ["returned"],
    returned: [],
  };

  // All possible statuses for the dropdown
  const allStatuses = [
    { value: "pending", label: "Chờ xử lý" },
    { value: "in_transit", label: "Đang vận chuyển" },
    { value: "delivered", label: "Đã giao hàng" },
    { value: "returned", label: "Đã hoàn" },
  ];

  const formatAddress = (address: Address | null) => {
    if (!address) return "Chưa có địa chỉ";
    const { addressLine, ward, district, cityOrProvince } = address;
    return [addressLine, ward, district, cityOrProvince].filter(Boolean).join(", ") || "Chưa có địa chỉ";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<Order[]>("https://api-zeal.onrender.com/api/orders/admin/all");
        console.log("API Response:", response.data);
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

  const getVietnamesePaymentStatus = (paymentStatus: string) => {
    return paymentStatusMapping[paymentStatus as keyof typeof paymentStatusMapping] || paymentStatus;
  };

  const getVietnameseShippingStatus = (shippingStatus: string) => {
    return shippingStatusMapping[shippingStatus as keyof typeof shippingStatusMapping] || shippingStatus;
  };

  const handleShippingStatusChange = async (orderId: string, userId: string, newStatus: string, currentStatus: string) => {
    if (currentStatus === "returned") {
      toast.error("Không thể thay đổi trạng thái đơn hàng Đã hoàn");
      return;
    }

    const englishStatus = reverseShippingStatusMapping[newStatus as keyof typeof reverseShippingStatusMapping] || newStatus;

    // Prevent invalid status transitions
    if (!statusProgression[currentStatus].includes(englishStatus)) {
      toast.error("Trạng thái không hợp lệ hoặc không thể chuyển về trạng thái trước đó");
      return;
    }

    // Show confirmation modal for 'delivered' or 'returned'
    setShowConfirm({ orderId, userId, newStatus, currentStatus });
  };

  const confirmStatusChange = async () => {
    if (!showConfirm) return;

    const { orderId, userId, newStatus, currentStatus } = showConfirm;
    const englishStatus = reverseShippingStatusMapping[newStatus as keyof typeof reverseShippingStatusMapping] || newStatus;

    try {
      // Prepare update payload
      const updatePayload: { shippingStatus: string; paymentStatus?: string } = {
        shippingStatus: englishStatus,
      };

      // Update paymentStatus based on shippingStatus
      if (englishStatus === "delivered") {
        updatePayload.paymentStatus = "completed";
      } else if (englishStatus === "returned") {
        updatePayload.paymentStatus = "cancelled";
      }

      await axios.put(
        `https://api-zeal.onrender.com/api/orders/update/${orderId}?userId=${userId}`,
        updatePayload
      );

      toast.success("Cập nhật trạng thái vận chuyển thành công");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                shippingStatus: englishStatus,
                paymentStatus:
                  englishStatus === "delivered" ? "completed" : englishStatus === "returned" ? "cancelled" : order.paymentStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái vận chuyển:", error);
      toast.error("Không thể cập nhật trạng thái vận chuyển");
    } finally {
      setShowConfirm(null);
    }
  };

  const cancelConfirm = () => {
    setShowConfirm(null);
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
              <th>Trạng Thái Thanh Toán</th>
              <th>Trạng Thái Vận Chuyển</th>
              <th>Phương Thức Thanh Toán</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
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
                  <td>{getVietnamesePaymentStatus(order.paymentStatus)}</td>
                  <td>
                    <select
                      value={getVietnameseShippingStatus(order.shippingStatus)}
                      onChange={(e) =>
                        handleShippingStatusChange(
                          order._id,
                          order.user?._id || "",
                          e.target.value,
                          order.shippingStatus
                        )
                      }
                      className={styles.statusSelect}
                      onClick={(e) => e.stopPropagation()}
                      disabled={order.shippingStatus === "returned"}
                    >
                      {allStatuses.map((status) => (
                        <option
                          key={status.value}
                          value={status.label}
                          disabled={
                            order.shippingStatus === "returned" ||
                            (!statusProgression[order.shippingStatus].includes(status.value) &&
                              status.value !== order.shippingStatus)
                          }
                        >
                          {status.label}
                        </option>
                      ))}
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
              <strong>Trạng thái thanh toán:</strong> {getVietnamesePaymentStatus(selectedOrder.paymentStatus)}
            </p>
            <p>
              <strong>Trạng thái vận chuyển:</strong> {getVietnameseShippingStatus(selectedOrder.shippingStatus)}
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

      {showConfirm && (
        <div className={styles.popupOverlay} onClick={cancelConfirm}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <h2>Xác nhận thay đổi trạng thái</h2>
            <p>
              {showConfirm.newStatus === "Đã giao hàng"
                ? `Xác nhận chuyển trạng thái sang 'Đã giao hàng'? 
                Trạng thái thanh toán sẽ được cập nhật thành 'Đã thanh toán'.`
                : `Xác nhận chuyển trạng thái sang 'Đã hoàn'? 
                Trạng thái thanh toán sẽ được cập nhật thành 'Đã hủy'.`}
            </p>
            <div className={styles.confirmButtons}>
              <button className={styles.confirmButton} onClick={confirmStatusChange}>
                Xác nhận
              </button>
              <button className={styles.cancelButton} onClick={cancelConfirm}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}