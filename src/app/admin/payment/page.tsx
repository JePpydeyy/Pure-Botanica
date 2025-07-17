"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./PaymentHistoryPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface Payment {
  paymentCode: string;
  amount: number;
  transactionDate: string | null;
  bankUserName: string;
  description: string;
  status: string;
  orderId: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "success" | "expired" | "failed">("all");
  const [notification, setNotification] = useState<Notification>({
    show: false,
    message: "",
    type: "success",
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 9;
  const router = useRouter();

  const statusMapping: { [key: string]: string } = {
    pending: "Chờ xử lý",
    success: "Thành công",
    expired: "Hết hạn",
    failed: "Thất bại",
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString || dateString.trim() === "") return "Chưa có";

    // Thử định dạng dd/mm/yyyy
    const dateTimeMatch = dateString.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (dateTimeMatch) {
      const [, day, month, year] = dateTimeMatch;
      const testDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(testDate.getTime())) {
        return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
      }
    }

    // Thử định dạng ISO 8601
    const parsedDate = new Date(dateString);
    if (!isNaN(parsedDate.getTime())) {
      return `${parsedDate.getDate().toString().padStart(2, "0")}-${(parsedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${parsedDate.getFullYear()}`;
    }

    console.warn("Ngày không hợp lệ từ API:", dateString);
    return "Ngày không hợp lệ";
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  };

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

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const res = await fetch("https://api-zeal.onrender.com/api/payments/get-payments", {
          headers: { Authorization: `Bearer ${token}` },
          method: "POST",
          body: JSON.stringify({}),
          cache: "no-store",
        });
        if (res.status === 401 || res.status === 403) {
          showNotification("Phiên đăng nhập hết hạn!", "error");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("email");
          router.push("/user/login");
          return;
        }
        if (!res.ok) throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
        const data = await res.json();
        if (!Array.isArray(data.data)) throw new Error("Dữ liệu không hợp lệ");
        console.log("Dữ liệu từ API:", data.data);
        setPayments(data.data);
        setFilteredPayments(data.data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
        console.error("Lỗi khi tải lịch sử thanh toán:", errorMessage);
        setError("Không thể tải lịch sử thanh toán.");
        showNotification("Không thể tải lịch sử thanh toán", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [router]);

  const filterPayments = useCallback(
    (query: string, status: "all" | "pending" | "success" | "expired" | "failed") => {
      const filtered = payments.filter((payment) => {
        const searchLower = query.toLowerCase();
        const paymentCode = payment.paymentCode.toLowerCase();
        const bankUserName = payment.bankUserName.toLowerCase();
        const orderId = payment.orderId.toLowerCase();
        return (
          (status === "all" || payment.status === status) &&
          (paymentCode.includes(searchLower) ||
            bankUserName.includes(searchLower) ||
            orderId.includes(searchLower))
        );
      });
      setFilteredPayments(filtered);
      setCurrentPage(1);
    },
    [payments]
  );

  const debouncedFilter = useMemo(
    () =>
      (function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout;
        return (...args: Parameters<T>) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func(...args), wait);
        };
      })(filterPayments, 300),
    [filterPayments]
  );

  useEffect(() => {
    debouncedFilter(searchQuery, statusFilter);
  }, [searchQuery, statusFilter, debouncedFilter]);

  const handlePaymentClick = (payment: Payment, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "SELECT") return;
    setSelectedPayment(payment);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPayment(null);
  };

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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

  if (error) {
    return (
      <div className={styles.productManagementContainer}>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.confirmBtn}
            aria-label="Thử lại"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.productManagementContainer}>
        <div className={styles.errorContainer}>
          <div className={styles.processingIndicator}>
            <div className={styles.spinner}></div>
            <p>Đang tải dữ liệu thanh toán...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productManagementContainer}>
      {notification.show && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles[notification.type]}`}>
            <p>{notification.message}</p>
            <button
              className={styles.cancelBtn}
              onClick={() => setNotification({ show: false, message: "", type: "success" })}
              aria-label="Đóng thông báo"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}
      <div className={styles.titleContainer}>
        <h1>Quản Lý Lịch Sử Thanh Toán</h1>
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã thanh toán, tên người chuyển hoặc ID đơn hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Tìm kiếm thanh toán"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "pending" | "success" | "expired" | "failed")}
            className={styles.categorySelect}
            aria-label="Lọc theo trạng thái"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="success">Thành công</option>
            <option value="expired">Hết hạn</option>
            <option value="failed">Thất bại</option>
          </select>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.productTable}>
          <thead className={styles.productTableThead}>
            <tr>
              <th>STT</th>
              <th>Mã Thanh Toán</th>
              <th>Số Tiền</th>
              <th>Ngày Giao Dịch</th>
              <th>Tên Người Chuyển</th>
              <th>Nội Dung</th>
              <th>Trạng Thái</th>
              <th>ID Đơn Hàng</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  <h3>{searchQuery || statusFilter !== "all" ? "Không tìm thấy thanh toán" : "Chưa có thanh toán"}</h3>
                  <p>
                    {searchQuery || statusFilter !== "all"
                      ? "Không có thanh toán nào khớp với bộ lọc."
                      : "Hiện tại không có thanh toán nào để hiển thị."}
                  </p>
                </td>
              </tr>
            ) : (
              currentPayments.map((payment, index) => (
                <tr
                  key={payment.paymentCode}
                  className={styles.productRow}
                  onClick={(e) => handlePaymentClick(payment, e)}
                >
                  <td>{indexOfFirstPayment + index + 1}</td>
                  <td>{payment.paymentCode}</td>
                  <td>{payment.amount.toLocaleString()} VND</td>
                  <td>{formatDate(payment.transactionDate)}</td>
                  <td>{payment.bankUserName}</td>
                  <td className={styles.descriptionCell}>{payment.description}</td>
                  <td>
                    <span
                      className={
                        payment.status === "success"
                          ? styles.statusActive
                          : payment.status === "pending"
                          ? styles.statusPending
                          : styles.statusInactive
                      }
                    >
                      {statusMapping[payment.status] || payment.status}
                    </span>
                  </td>
                  <td>{payment.orderId}</td>
                </tr>
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
                      type="button"
                      className={`${styles.pageLink} ${styles.firstLastPage}`}
                      onClick={() => handlePageChange(1)}
                      title="Trang đầu tiên"
                      aria-label="Trang đầu tiên"
                    >
                      1
                    </button>
                    <div
                      className={styles.ellipsis}
                      onClick={() => handlePageChange(Math.max(1, currentPage - 3))}
                      title="Trang trước đó"
                      role="button"
                      aria-label="Trang trước đó"
                    >
                      ...
                    </div>
                  </>
                )}
                {visiblePages.map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={`${styles.pageLink} ${
                      currentPage === page ? styles.pageLinkActive : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                    title={`Trang ${page}`}
                    aria-label={`Trang ${page}`}
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
                      role="button"
                      aria-label="Trang tiếp theo"
                    >
                      ...
                    </div>
                    <button
                      type="button"
                      className={`${styles.pageLink} ${styles.firstLastPage}`}
                      onClick={() => handlePageChange(totalPages)}
                      title="Trang cuối cùng"
                      aria-label="Trang cuối cùng"
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
      {showPopup && selectedPayment && (
        <div className={styles.modalOverlay} onClick={closePopup}>
          <div className={`${styles.modalContent} ${styles.paymentDetail}`} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.cancelBtn}
              onClick={closePopup}
              aria-label="Đóng chi tiết thanh toán"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2>Chi Tiết Thanh Toán</h2>
            <dl className={styles.detailList}>
              <div className={styles.detailItem}>
                <dt>Mã Thanh Toán</dt>
                <dd>{selectedPayment.paymentCode}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>ID Đơn Hàng</dt>
                <dd>{selectedPayment.orderId}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Ngày Giao Dịch</dt>
                <dd>{formatDate(selectedPayment.transactionDate)}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Số Tiền</dt>
                <dd className={styles.amount}>{selectedPayment.amount.toLocaleString()} VND</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Tên Người Chuyển</dt>
                <dd>{selectedPayment.bankUserName}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Nội Dung</dt>
                <dd className={styles.description}>{selectedPayment.description}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Trạng Thái</dt>
                <dd>
                  <span
                    className={
                      selectedPayment.status === "success"
                        ? styles.statusActive
                        : selectedPayment.status === "pending"
                        ? styles.statusPending
                        : styles.statusInactive
                    }
                  >
                    {statusMapping[selectedPayment.status] || selectedPayment.status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}