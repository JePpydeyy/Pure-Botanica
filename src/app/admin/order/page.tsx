"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./order.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  addressLine: string;
  ward: string;
  district: string;
  cityOrProvince: string;
}

interface Order {
  paymentMethod: string;
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  paymentStatus: string;
  shippingStatus: string;
  address: Address;
  total: number;
  items: { product: Product | null; optionId: string; quantity: number; images: string[] }[];
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error";
}

const API_BASE_URL = "https://api-zeal.onrender.com";
const FALLBACK_IMAGE_URL = "https://via.placeholder.com/60x60?text=Error";

const normalizeImageUrl = (url: string): string => {
  if (url.startsWith("https://res.cloudinary.com")) {
    return url; // Giữ nguyên URL từ Cloudinary
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `${API_BASE_URL}/${url}?_t=${Date.now()}`; // Thêm timestamp để phá cache
  }
  return url;
};

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<{
    orderId: string;
    newStatus: string;
    currentStatus: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [shippingStatusFilter, setShippingStatusFilter] = useState<string>("all");
  const [notification, setNotification] = useState<Notification>({
    show: false,
    message: "",
    type: "success",
  });
  const router = useRouter();

  const paymentStatusMapping = {
    pending: "Chờ xử lý",
    completed: "Đã thanh toán",
    failed: "Thất bại",
    cancelled: "Đã hoàn",
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

  const statusProgression: { [key: string]: string[] } = {
    pending: ["in_transit"],
    in_transit: ["delivered"],
    delivered: ["returned"],
    returned: [],
  };

  const allStatuses = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "in_transit", label: "Đang vận chuyển" },
    { value: "delivered", label: "Đã giao hàng" },
    { value: "returned", label: "Đã hoàn" },
  ];

  const formatAddress = (address: Address) => {
    const { addressLine, ward, district, cityOrProvince } = address;
    return [addressLine, ward, district, cityOrProvince].filter(Boolean).join(", ") || "Chưa có địa chỉ";
  };

  // Show notification and auto-hide after 3 seconds
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Check admin role and token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      showNotification("Vui lòng đăng nhập với quyền admin!", "error");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      router.push("/user/login");
    }
  }, [router]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/orders/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (res.status === 401 || res.status === 403) {
          showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!", "error");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("email");
          router.push("/user/login");
          return;
        }
        if (!res.ok) {
          throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
        }
        const data: Order[] = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu đơn hàng không hợp lệ");
        }
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
        console.error("Lỗi khi tải danh sách đơn hàng:", errorMessage);
        setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
        showNotification("Không thể tải danh sách đơn hàng", "error");
      }
    };
    fetchOrders();
  }, [router]);

  // Debounce filter function
  const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Filter orders based on search query and shipping status
  const filterOrders = useCallback(
    (query: string, shippingStatus: string) => {
      const filtered = orders.filter((order) => {
        const searchLower = query.toLowerCase();
        const username = order.user.username?.toLowerCase() || "";
        const orderId = order._id.toLowerCase();
        const address = formatAddress(order.address).toLowerCase();
        const matchesSearch =
          username.includes(searchLower) || orderId.includes(searchLower) || address.includes(searchLower);
        const matchesShippingStatus = shippingStatus === "all" || order.shippingStatus === shippingStatus;
        return matchesSearch && matchesShippingStatus;
      });
      setFilteredOrders(filtered);
    },
    [orders]
  );

  const debouncedFilter = useMemo(
    () => debounce((query: string, shippingStatus: string) => {
      filterOrders(query, shippingStatus);
    }, 300),
    [filterOrders]
  );

  useEffect(() => {
    debouncedFilter(searchQuery, shippingStatusFilter);
  }, [searchQuery, shippingStatusFilter, debouncedFilter]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setShippingStatusFilter("all");
    setFilteredOrders(orders);
  };

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

  const handleShippingStatusChange = async (orderId: string, newStatus: string, currentStatus: string) => {
    if (currentStatus === "returned") {
      showNotification("Không thể thay đổi trạng thái đơn hàng Đã hoàn", "error");
      return;
    }

    const englishStatus =
      reverseShippingStatusMapping[newStatus as keyof typeof reverseShippingStatusMapping] || newStatus;

    if (!statusProgression[currentStatus].includes(englishStatus)) {
      showNotification("Trạng thái không hợp lệ hoặc không thể chuyển về trạng thái trước đó", "error");
      return;
    }

    setShowConfirm({ orderId, newStatus, currentStatus });
  };

  const confirmStatusChange = async () => {
    if (!showConfirm) return;

    const { orderId, newStatus, currentStatus } = showConfirm;
    const englishStatus =
      reverseShippingStatusMapping[newStatus as keyof typeof reverseShippingStatusMapping] || newStatus;

    try {
      const updatePayload: { shippingStatus: string; paymentStatus?: string } = {
        shippingStatus: englishStatus,
      };

      if (englishStatus === "delivered") {
        updatePayload.paymentStatus = "completed";
      } else if (englishStatus === "returned") {
        updatePayload.paymentStatus = "cancelled";
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/orders/update/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (response.status === 401 || response.status === 403) {
        showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        router.push("/user/login");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi API: ${response.status} ${errorText}`);
      }

      const { order }: { order: Order } = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === orderId
            ? {
                ...o,
                shippingStatus: order.shippingStatus,
                paymentStatus: order.paymentStatus,
              }
            : o
        )
      );
      setFilteredOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === orderId
            ? {
                ...o,
                shippingStatus: order.shippingStatus,
                paymentStatus: order.paymentStatus,
              }
            : o
        )
      );
      showNotification("Cập nhật trạng thái vận chuyển thành công", "success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      console.error("Lỗi cập nhật trạng thái vận chuyển:", errorMessage);
      showNotification("Không thể cập nhật trạng thái vận chuyển", "error");
    } finally {
      setShowConfirm(null);
    }
  };

  const cancelConfirm = () => {
    setShowConfirm(null);
  };

  const handleOrderClick = (order: Order, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "SELECT" || (e.target as HTMLElement).tagName === "INPUT") {
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

  const getProductImage = (item: { product: Product | null; images: string[] }) => {
    if (item.images && item.images.length > 0) {
      return normalizeImageUrl(item.images[0]);
    }
    return FALLBACK_IMAGE_URL;
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button className={styles.retryButton} onClick={() => window.location.reload()}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className={styles.orderContainer}>
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}
      <div className={styles.title}>
        <h1>Danh Sách Đơn Hàng</h1>
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, ID đơn hàng hoặc địa chỉ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={shippingStatusFilter}
          onChange={(e) => setShippingStatusFilter(e.target.value)}
          className={styles.statusFilter}
        >
          {allStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={resetFilters} className={styles.resetButton}>
          Xóa bộ lọc
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th data-label="ID">ID</th>
              <th data-label="Tên">Tên</th>
              <th data-label="Tổng Tiền">Tổng Tiền</th>
              <th data-label="Ngày">Ngày</th>
              <th data-label="Trạng Thái Thanh Toán">Trạng Thái Thanh Toán</th>
              <th data-label="Trạng Thái Vận Chuyển">Trạng Thái Vận Chuyển</th>
              <th data-label="Phương Thức Thanh Toán"></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  <h3>{searchQuery || shippingStatusFilter !== "all" ? "Không tìm thấy đơn hàng" : "Chưa có đơn hàng"}</h3>
                  <p>
                    {(searchQuery || shippingStatusFilter !== "all")
                      ? "Không có đơn hàng nào khớp với bộ lọc."
                      : "Hiện tại không có đơn hàng nào để hiển thị."}
                  </p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <tr key={order._id} onClick={(e) => handleOrderClick(order, e)}>
                  <td data-label="ID">{index + 1}</td>
                  <td data-label="Tên">{order.user.username || "Không xác định"}</td>
                  <td data-label="Tổng Tiền">{order.total.toLocaleString()} VND</td>
                  <td data-label="Ngày">{formatDate(order.createdAt)}</td>
                  <td data-label="Trạng Thái Thanh Toán">{getVietnamesePaymentStatus(order.paymentStatus)}</td>
                  <td data-label="Trạng Thái Vận Chuyển">
                    <select
                      value={getVietnameseShippingStatus(order.shippingStatus)}
                      onChange={(e) =>
                        handleShippingStatusChange(order._id, e.target.value, order.shippingStatus)
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
                  <td data-label="Phương Thức Thanh Toán">
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
            <button className={styles.closeButton} onClick={closePopup} aria-label="Đóng chi tiết đơn hàng">
              ×
            </button>
            <h2>Chi Tiết Đơn Hàng</h2>
            <p>
              <strong>Khách hàng:</strong> {selectedOrder.user.username || "Không xác định"}
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
                    <Image
                      src={getProductImage(item)}
                      alt={item.product?.name || "Không xác định"}
                      width={60}
                      height={60}
                      className={styles.productImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE_URL;
                        console.log(`Image load failed for ${item.product?.name || "Không xác định"}:`, item.images[0]);
                      }}
                    />
                    <div className={styles.productInfo}>
                      <div className={styles.productName}>{item.product?.name || "Không xác định"}</div>
                      <div className={styles.productPrice}>
                        {item.quantity} x {getProductPrice(item.product, item.optionId).toLocaleString()} VND
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li>Không có sản phẩm trong đơn hàng</li>
              )}
            </ul>
            <div className={styles.total}>
              Tổng tiền đơn hàng: {selectedOrder.total.toLocaleString()} VND
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className={styles.popupOverlay} onClick={cancelConfirm}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <h2>Xác Nhận Thay Đổi Trạng Thái</h2>
            <p>
              Bạn có chắc chắn muốn chuyển trạng thái vận chuyển sang{" "}
              <strong>{showConfirm.newStatus}</strong>?{" "}
              {showConfirm.newStatus === "Đã giao hàng" ? (
                <>
                  Trạng thái thanh toán sẽ được cập nhật thành <strong>Đã thanh toán</strong>.
                </>
              ) : showConfirm.newStatus === "Đã hoàn" ? (
                <>
                  Trạng thái thanh toán sẽ được cập nhật thành <strong>Đã hoàn</strong>.
                </>
              ) : null}
            </p>
            <div className={styles.confirmButtons}>
              <button
                className={styles.confirmButton}
                onClick={confirmStatusChange}
                aria-label="Xác nhận thay đổi trạng thái"
              >
                Xác Nhận
              </button>
              <button
                className={styles.cancelButton}
                onClick={cancelConfirm}
                aria-label="Hủy thay đổi trạng thái"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}