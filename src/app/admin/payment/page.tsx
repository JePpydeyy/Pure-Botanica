"use client";
import { useState, useEffect } from "react";
import styles from "./PaymentHistoryPage.module.css";
import { useRouter } from "next/navigation";

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
  const [notification, setNotification] = useState<Notification>({
    show: false,
    message: "",
    type: "success",
  });
  const router = useRouter();

  const statusMapping = {
    pending: "Chờ xử lý",
    success: "Thành công",
    expired: "Hết hạn",
    failed: "Thất bại",
  };

  const formatDate = (dateString: string | null) => {
    // Kiểm tra null, undefined, hoặc chuỗi rỗng
    if (!dateString || dateString.trim() === "") return "Chưa có";

    // Thử phân tích định dạng dd/mm/yyyy hh:mm:ss
    const dateTimeMatch = dateString.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (dateTimeMatch) {
      const [, day, month, year] = dateTimeMatch;
      const testDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(testDate.getTime())) {
        return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
      }
    }

    // Thử phân tích định dạng ISO 8601 (dự phòng)
    const isoMatch = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      const testDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(testDate.getTime())) {
        return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
      }
    }

    // Thử phân tích bằng Date trực tiếp
    const parsedDate = new Date(dateString);
    if (!isNaN(parsedDate.getTime())) {
      return `${parsedDate.getDate().toString().padStart(2, "0")}-${(parsedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${parsedDate.getFullYear()}`;
    }

    console.warn("Ngày không hợp lệ từ API:", dateString); // Log để debug
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
        setError(null);
        const token = localStorage.getItem("token");
        const res = await fetch("https://api-zeal.onrender.com/api/payments/get-payments", {
          headers: { Authorization: `Bearer ${token}` },
          method: "POST",
          body: JSON.stringify({}),
        });
        if (res.status === 401 || res.status === 403) {
          showNotification("Phiên đăng nhập hết hạn!", "error");
          localStorage.removeItem("token");
          localStorage.removeItem29
          localStorage.removeItem("role");
          localStorage.removeItem("email");
          router.push("/user/login");
          return;
        }
        if (!res.ok) throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
        const data = await res.json();
        if (!Array.isArray(data.data)) throw new Error("Dữ liệu không hợp lệ");
        console.log("Dữ liệu từ API:", data.data); // Log để debug
        setPayments(data.data);
        setFilteredPayments(data.data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
        console.error("Lỗi khi tải lịch sử thanh toán:", errorMessage);
        setError("Không thể tải lịch sử thanh toán.");
        showNotification("Không thể tải lịch sử thanh toán", "error");
      }
    };
    fetchPayments();
  }, [router]);

  useEffect(() => {
    const filtered = payments.filter((payment) => {
      const searchLower = searchQuery.toLowerCase();
      const paymentCode = payment.paymentCode.toLowerCase();
      const bankUserName = payment.bankUserName.toLowerCase();
      const orderId = payment.orderId.toLowerCase();
      return (
        paymentCode.includes(searchLower) ||
        bankUserName.includes(searchLower) ||
        orderId.includes(searchLower)
      );
    });
    setFilteredPayments(filtered);
  }, [searchQuery, payments]);

  const handlePaymentClick = (payment: Payment, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    setSelectedPayment(payment);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPayment(null);
  };

  if (error) {
    return (
      <div className={styles.paymentHistoryContainer}>
        <p className={styles.paymentErrorMessage}>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className={styles.paymentHistoryContainer}>
      {notification.show && (
        <div className={`${styles.paymentNotification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}
      <div className={styles.paymentTitle}>
        <h1>Lịch Sử Thanh Toán</h1>
      </div>
      <div className={styles.paymentSearchContainer}>
        <input
          type="text"
          placeholder="Tìm kiếm theo mã thanh toán, tên người chuyển hoặc ID đơn hàng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.paymentSearchInput}
        />
      </div>
      <div className={styles.paymentTableContainer}>
        <table className={styles.paymentTable}>
          <thead>
            <tr>
              <th data-label="STT">STT</th>
              <th data-label="Mã Thanh Toán">Mã Thanh Toán</th>
              <th data-label="Số Tiền">Số Tiền</th>
              <th data-label="Ngày Giao Dịch">Ngày Giao Dịch</th>
              <th data-label="Tên Người Chuyển">Tên Người Chuyển</th>
              <th data-label="Nội Dung Chuyển Khoản">Nội Dung Chuyển Khoản</th>
              <th data-label="Trạng Thái">Trạng Thái</th>
              <th data-label="ID Đơn Hàng">ID Đơn Hàng</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.paymentEmptyState}>
                  <h3>{searchQuery ? "Không tìm thấy thanh toán" : "Chưa có thanh toán"}</h3>
                  <p>
                    {searchQuery
                      ? "Không có thanh toán nào khớp với từ khóa tìm kiếm."
                      : "Hiện tại không có thanh toán nào để hiển thị."}
                  </p>
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment, index) => (
                <tr key={payment.paymentCode} onClick={(e) => handlePaymentClick(payment, e)}>
                  <td data-label="STT">{index + 1}</td>
                  <td data-label="Mã Thanh Toán">{payment.paymentCode}</td>
                  <td data-label="Số Tiền">{payment.amount.toLocaleString()} VND</td>
                  <td data-label="Ngày Giao Dịch">{formatDate(payment.transactionDate)}</td>
                  <td data-label="Tên Người Chuyển">{payment.bankUserName}</td>
                  <td data-label="Nội Dung Chuyển Khoản">{payment.description}</td>
                  <td data-label="Trạng Thái">{statusMapping[payment.status] || payment.status}</td>
                  <td data-label="ID Đơn Hàng">{payment.orderId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPopup && selectedPayment && (
        <div className={styles.paymentPopupOverlay} onClick={closePopup}>
          <div className={styles.paymentDetail} onClick={(e) => e.stopPropagation()}>
            <button className={styles.paymentCloseButton} onClick={closePopup} aria-label="Đóng chi tiết thanh toán">
              ×
            </button>
            <h2>Chi Tiết Thanh Toán</h2>
            <p><strong>Mã Thanh Toán:</strong> {selectedPayment.paymentCode}</p>
            <p><strong>ID Đơn Hàng:</strong> {selectedPayment.orderId}</p>
            <p><strong>Ngày Giao Dịch:</strong> {formatDate(selectedPayment.transactionDate)}</p>

            <p><strong>Số Tiền:</strong> {selectedPayment.amount.toLocaleString()} VND</p>
            <p><strong>Tên Người Chuyển:</strong> {selectedPayment.bankUserName}</p>
            <p><strong>Nội Dung Chuyển Khoản:</strong> {selectedPayment.description}</p>
            <p><strong>Trạng Thái:</strong> {statusMapping[selectedPayment.status] || selectedPayment.status}</p>
          </div>
        </div>
      )}
    </div>
  );
}