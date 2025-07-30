"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./order.module.css";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faRedo } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  user: { _id: string; username: string; email: string } | null;
  createdAt: string;
  paymentStatus: string;
  shippingStatus: string;
  address: Address;
  total: number;
  items: { product: Product | null; optionId: string; quantity: number; images: string[] }[];
}

const API_BASE_URL = "https://api-zeal.onrender.com";
const FALLBACK_IMAGE_URL = "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg";

const normalizeImageUrl = (url: string): string => {
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<{
    orderId: string;
    newStatus: string;
    currentStatus: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [shippingStatusFilter, setShippingStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 9; // Match product.tsx
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

  const showNotification = (message: string, type: "success" | "error") => {
    if (type === "success") {
      toast.success(message, {
        className: styles.customToast,
        bodyClassName: styles.customToastBody,
      });
    } else {
      toast.error(message, {
        className: styles.customToast,
        bodyClassName: styles.customToastBody,
      });
    }
  };

  // Check admin access
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      showNotification("Bạn cần quyền admin để truy cập trang này.", "error");
      router.push("/user/login");
    }
  }, [router]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        }
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
        const invalidOrders = data.filter((order) => !order.user);
        if (invalidOrders.length > 0) {
          console.warn("Found orders with null user:", invalidOrders);
        }
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
        showNotification("Không thể tải danh sách đơn hàng", "error");
        setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router]);

  const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const filterOrders = useCallback(
    (query: string, shippingStatus: string) => {
      const filtered = orders.filter((order) => {
        const searchLower = query.toLowerCase();
        const username = order.user?.username?.toLowerCase() || "";
        const orderId = order._id.toLowerCase();
        const address = formatAddress(order.address).toLowerCase();
        const matchesSearch =
          username.includes(searchLower) ||
          orderId.includes(searchLower) ||
          address.includes(searchLower);
        const matchesShippingStatus = shippingStatus === "all" || order.shippingStatus === shippingStatus;
        return matchesSearch && matchesShippingStatus;
      });
      setFilteredOrders(filtered);
      setCurrentPage(1);
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

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Ngày không hợp lệ"
      : date.toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
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
      setLoading(true);
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
            ? { ...o, shippingStatus: order.shippingStatus, paymentStatus: order.paymentStatus }
            : o
        )
      );
      setFilteredOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === orderId
            ? { ...o, shippingStatus: order.shippingStatus, paymentStatus: order.paymentStatus }
            : o
        )
      );
      showNotification("Cập nhật trạng thái vận chuyển thành công", "success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      showNotification(`Không thể cập nhật trạng thái vận chuyển: ${errorMessage}`, "error");
    } finally {
      setShowConfirm(null);
      setLoading(false);
    }
  };

  const handleToggleDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
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

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setExpandedOrderId(null);
    }
  };

  const getPaginationInfo = () => {
    const visiblePages: number[] = [];
    let showPrevEllipsis = false;
    let showNextEllipsis = false;

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (currentPage === 1) {
        visiblePages.push(1, 2, 3);
        showNextEllipsis = totalPages > 3;
      } else if (currentPage === totalPages) {
        visiblePages.push(totalPages - 2, totalPages - 1, totalPages);
        showPrevEllipsis = totalPages > 3;
      } else {
        visiblePages.push(currentPage - 1, currentPage, currentPage + 1);
        showPrevEllipsis = currentPage > 2;
        showNextEllipsis = currentPage < totalPages - 1;
      }
    }

    return { visiblePages, showPrevEllipsis, showNextEllipsis };
  };

  if (loading && orders.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.processingIndicator}>
          <FontAwesomeIcon icon={faRedo} spin />
          <p>Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button
          className={styles.retryButton}
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchOrders();
          }}
          title="Thử lại"
          aria-label="Thử lại tải danh sách đơn hàng"
        >
          <FontAwesomeIcon icon={faRedo} />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.orderManagementContainer}>
      <Head>
        <title>Quản Lý Đơn Hàng</title>
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName={styles.customToast}
        bodyClassName={styles.customToastBody}
      />
      {loading && orders.length > 0 && (
        <div className={styles.processingIndicator}>
          <FontAwesomeIcon icon={faRedo} spin /> Đang xử lý...
        </div>
      )}
      <div className={styles.titleContainer}>
        <h1>QUẢN LÝ ĐƠN HÀNG</h1>
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, ID đơn hàng hoặc địa chỉ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Tìm kiếm đơn hàng"
          />
          <select
            value={shippingStatusFilter}
            onChange={(e) => setShippingStatusFilter(e.target.value)}
            className={styles.categorySelect}
            aria-label="Lọc theo trạng thái vận chuyển"
          >
            {allStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.orderTable}>
          <thead className={styles.orderTableThead}>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Tổng Tiền</th>
              <th>Ngày</th>
              <th>Trạng Thái Thanh Toán</th>
              <th>Trạng Thái Vận Chuyển</th>
              <th>Phương Thức Thanh Toán</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length === 0 ? (
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
              currentOrders.map((order, index) => (
                <React.Fragment key={order._id}>
                  <tr
                    onClick={() => handleToggleDetails(order._id)}
                    className={`${styles.orderRow} ${
                      expandedOrderId === order._id ? styles.orderRowActive : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{(currentPage - 1) * ordersPerPage + index + 1}</td>
                    <td>{order.user?.username || "Không xác định"}</td>
                    <td>{order.total.toLocaleString()}₫</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{getVietnamesePaymentStatus(order.paymentStatus)}</td>
                    <td>
                      <select
                        value={getVietnameseShippingStatus(order.shippingStatus)}
                        onChange={(e) =>
                          handleShippingStatusChange(order._id, e.target.value, order.shippingStatus)
                        }
                        className={styles.categorySelect}
                        onClick={(e) => e.stopPropagation()}
                        disabled={order.shippingStatus === "returned" || loading}
                        aria-label={`Thay đổi trạng thái vận chuyển cho đơn hàng ${order._id}`}
                      >
                        {allStatuses
                          .filter((status) => status.value !== "all")
                          .map((status) => (
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
                  {expandedOrderId === order._id && (
                    <tr className={styles.detailsRow}>
                      <td colSpan={7}>
                        <div className={styles.orderDetails}>
                          <h3>Chi tiết đơn hàng</h3>
                          <div className={styles.detailsContainer}>
                            <div className={styles.detailsSection}>
                              <h4>Thông tin khách hàng</h4>
                              <div className={styles.detailsGrid}>
                                <p>
                                  <strong>Tên:</strong> {order.user?.username || "Không xác định"}
                                </p>
                                <p>
                                  <strong>Email:</strong> {order.user?.email || "Không xác định"}
                                </p>
                                <p>
                                  <strong>Địa chỉ:</strong> {formatAddress(order.address)}
                                </p>
                              </div>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Thông tin đơn hàng</h4>
                              <div className={styles.detailsGrid}>
                                <p>
                                  <strong>Ngày:</strong> {formatDate(order.createdAt)}
                                </p>
                                <p>
                                  <strong>Trạng thái thanh toán:</strong>{" "}
                                  {getVietnamesePaymentStatus(order.paymentStatus)}
                                </p>
                                <p>
                                  <strong>Trạng thái vận chuyển:</strong>{" "}
                                  {getVietnameseShippingStatus(order.shippingStatus)}
                                </p>
                                <p>
                                  <strong>Phương thức thanh toán:</strong>{" "}
                                  {order.paymentMethod === "cod"
                                    ? "Thanh toán khi nhận hàng"
                                    : order.paymentMethod === "bank"
                                    ? "Chuyển khoản"
                                    : order.paymentMethod || "Không xác định"}
                                </p>
                              </div>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Sản phẩm trong đơn hàng</h4>
                              <table className={styles.itemsTable}>
                                <thead>
                                  <tr>
                                    <th>Hình ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items && order.items.length > 0 ? (
                                    order.items.map((item, idx) => (
                                      <tr key={idx}>
                                        <td>
                                          <img
                                            src={getProductImage(item)}
                                            alt={item.product?.name || "Không xác định"}
                                            width={48}
                                            height={48}
                                            className={styles.orderTableImage}
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = FALLBACK_IMAGE_URL;
                                            }}
                                          />
                                        </td>
                                        <td>{item.product?.name || "Không xác định"}</td>
                                        <td>{item.quantity}</td>
                                        <td>{getProductPrice(item.product, item.optionId).toLocaleString()}₫</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className="text-center">
                                        Không có sản phẩm trong đơn hàng
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Tổng tiền</h4>
                              <p>{order.total.toLocaleString()}₫</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {(() => {
            const { visiblePages, showPrevEllipsis, showNextEllipsis } = getPaginationInfo();
            return (
              <>
                {showPrevEllipsis && (
                  <>
                    <button
                      className={`${styles.pageLink} ${styles.firstLastPage}`}
                      onClick={() => handlePageChange(1)}
                      disabled={loading}
                      title="Trang đầu tiên"
                    >
                      1
                    </button>
                    <div
                      className={styles.ellipsis}
                      onClick={() => handlePageChange(Math.max(1, currentPage - 3))}
                      title="Trang trước đó"
                    >
                      ...
                    </div>
                  </>
                )}
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    className={`${styles.pageLink} ${currentPage === page ? styles.pageLinkActive : ""}`}
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                    title={`Trang ${page}`}
                  >
                    {page}
                  </button>
                ))}
                {showNextEllipsis && (
                  <>
                    <div
                      className={styles.ellipsis}
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 3))}
                      title="Trang tiếp theo"
                    >
                      ...
                    </div>
                    <button
                      className={`${styles.pageLink} ${styles.firstLastPage}`}
                      onClick={() => handlePageChange(totalPages)}
                      disabled={loading}
                      title="Trang cuối cùng"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </>
            );
          })()}
        </div>
      )}
      {showConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Xác nhận thay đổi trạng thái</h2>
            <p>
              Bạn có chắc chắn muốn chuyển trạng thái vận chuyển sang{" "}
              <strong>{showConfirm.newStatus}</strong>?{" "}
              {showConfirm.newStatus === "Đã giao hàng" && (
                <>
                  Trạng thái thanh toán sẽ được cập nhật thành <strong>Đã thanh toán</strong>.
                </>
              )}
              {showConfirm.newStatus === "Đã hoàn" && (
                <>
                  Trạng thái thanh toán sẽ được cập nhật thành <strong>Đã hoàn</strong>.
                </>
              )}
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.confirmBtn}
                onClick={confirmStatusChange}
                disabled={loading}
                title="Xác nhận"
                aria-label="Xác nhận thay đổi trạng thái"
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowConfirm(null)}
                disabled={loading}
                title="Hủy"
                aria-label="Hủy thay đổi trạng thái"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;