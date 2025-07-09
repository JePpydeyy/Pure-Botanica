"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./customer.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

interface Customer {
  _id: string;
  username: string;
  phone: string;
  email: string;
  address: string;
  birthday: string | null;
  listOrder: any[];
  status: string;
  role: string;
  createdAt: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export default function Customer() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
  const [isConfirmUpdateModalOpen, setIsConfirmUpdateModalOpen] = useState(false);
  const [isConfirmCreateAdminModalOpen, setIsConfirmCreateAdminModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<"user" | "admin">("user");
  const [newAdmin, setNewAdmin] = useState({ username: "", email: "", phone: "", password: "" });
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "success" });
  const customersPerPage = 9;
  const router = useRouter();

  // Check admin privileges
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/user/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Fetch customers
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const res = await fetch("https://api-zeal.onrender.com/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (res.status === 401 || res.status === 403) {
          throw new Error("Phiên đăng nhập hết hạn");
        }

        if (!res.ok) {
          throw new Error("Lỗi khi tải dữ liệu khách hàng");
        }

        const data = await res.json();
        setCustomers(data);
        setFilteredCustomers(data.filter((customer: Customer) => customer.role === roleFilter));
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message === "Phiên đăng nhập hết hạn"
              ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!"
              : err.message || "Lỗi khi tải dữ liệu khách hàng!"
            : "Đã xảy ra lỗi không xác định";
        setError(errorMessage);
        setNotification({ show: true, message: errorMessage, type: "error" });
        setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
        setLoading(false);

        if (err instanceof Error && err.message === "Phiên đăng nhập hết hạn") {
          localStorage.clear();
          router.push("/user/login");
        }
      }
    };

    fetchCustomers();
  }, [isAuthorized, roleFilter, router]);

  // Handle search and role filter
  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.role === roleFilter &&
        (customer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [searchQuery, customers, roleFilter]);

  // Toggle role filter
  const toggleRoleFilter = () => {
    setRoleFilter((prev) => (prev === "user" ? "admin" : "user"));
  };

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

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

  const openModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const confirmUpdate = () => {
    setIsModalOpen(false);
    setIsConfirmUpdateModalOpen(true);
  };

  const updateCustomerInfo = async () => {
    if (!selectedCustomer) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const res = await fetch(
        `https://api-zeal.onrender.com/api/users/update/${selectedCustomer._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: selectedCustomer.status,
            role: selectedCustomer.role,
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        throw new Error("Phiên đăng nhập hết hạn");
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Cập nhật thất bại");
      }

      const updatedCustomer = await res.json();
      setCustomers((prev) =>
        prev.map((c) => (c._id === updatedCustomer._id ? updatedCustomer : c))
      );
      setFilteredCustomers((prev) =>
        prev.map((c) => (c._id === updatedCustomer._id ? updatedCustomer : c))
      );
      setIsConfirmUpdateModalOpen(false);
      setSelectedCustomer(null);
      setNotification({
        show: true,
        message: "Cập nhật thông tin khách hàng thành công!",
        type: "success",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message === "Phiên đăng nhập hết hạn"
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!"
            : err.message || "Có lỗi xảy ra khi cập nhật!"
          : "Đã xảy ra lỗi không xác định";
      setNotification({ show: true, message: errorMessage, type: "error" });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      if (err instanceof Error && err.message === "Phiên đăng nhập hết hạn") {
        localStorage.clear();
        router.push("/user/login");
      }
    }
  };

  const confirmCreateAdmin = () => {
    // Client-side validation
    if (!newAdmin.username || !newAdmin.email || !newAdmin.phone || !newAdmin.password) {
      setNotification({
        show: true,
        message: "Vui lòng điền đầy đủ tất cả các trường!",
        type: "error",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      return;
    }

    if (newAdmin.password.length < 8) {
      setNotification({
        show: true,
        message: "Mật khẩu phải có ít nhất 8 ký tự!",
        type: "error",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdmin.email)) {
      setNotification({
        show: true,
        message: "Email không hợp lệ!",
        type: "error",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      return;
    }

    setIsCreateAdminModalOpen(false);
    setIsConfirmCreateAdminModalOpen(true);
  };

  const createAdminAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const res = await fetch("https://api-zeal.onrender.com/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newAdmin,
          role: "admin",
          status: "active",
          address: "",
          birthday: null,
          listOrder: [],
        }),
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("Phiên đăng nhập hết hạn");
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Tạo tài khoản admin thất bại");
      }

      const newUser = await res.json();
      setCustomers((prev) => [...prev, newUser.user]);
      setFilteredCustomers((prev) => [...prev, newUser.user]);
      setIsConfirmCreateAdminModalOpen(false);
      setNewAdmin({ username: "", email: "", phone: "", password: "" });
      setNotification({
        show: true,
        message: "Tạo tài khoản admin thành công!",
        type: "success",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message === "Phiên đăng nhập hết hạn"
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!"
            : err.message || "Có lỗi xảy ra khi tạo tài khoản!"
          : "Đã xảy ra lỗi không xác định";
      setNotification({ show: true, message: errorMessage, type: "error" });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      if (err instanceof Error && err.message === "Phiên đăng nhập hết hạn") {
        localStorage.clear();
        router.push("/user/login");
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.customerPage}>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Đang tải dữ liệu khách hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.customerPage}>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className={styles.customerPage}>
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}
      <div className={styles.titleContainer}>
        <h1>{roleFilter === "user" ? "KHÁCH HÀNG" : "QUẢN TRỊ VIÊN"}</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder={`Tìm kiếm ${roleFilter === "user" ? "khách hàng" : "quản trị viên"} theo tên hoặc email...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button onClick={toggleRoleFilter} className={styles.btn}>
          {roleFilter === "user" ? "Xem Quản Trị Viên" : "Xem Khách Hàng"}
        </button>
        <button
          onClick={() => setIsCreateAdminModalOpen(true)}
          className={styles.btn}
        >
          Tạo Tài Khoản Admin
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Trạng thái</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer, index) => (
                <tr key={customer._id}>
                  <td>{indexOfFirstCustomer + index + 1}</td>
                  <td>{customer.username}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.status === "active" ? "Hoạt động" : "Không hoạt động"}</td>
                  <td>{customer.role === "user" ? "Khách hàng" : "Quản trị viên"}</td>
                  <td>{new Date(customer.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <button
                      className={styles.editBtn}
                      onClick={() => openModal(customer)}
                      title="Sửa thông tin"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  Không có {roleFilter === "user" ? "khách hàng" : "quản trị viên"} nào
                </td>
              </tr>
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
                    className={`${styles.pageLink} ${
                      currentPage === page ? styles.pageLinkActive : ""
                    }`}
                    onClick={() => handlePageChange(page)}
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

      {/* Modal for editing customer */}
      {isModalOpen && selectedCustomer && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Chỉnh sửa thông tin {roleFilter === "user" ? "khách hàng" : "quản trị viên"}</h3>
            <label>
              Trạng thái:
              <select
                value={selectedCustomer.status}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, status: e.target.value })
                }
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </label>
            <label>
              Vai trò:
              <select
                value={selectedCustomer.role}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, role: e.target.value })
                }
              >
                <option value="user">Khách hàng</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </label>
            <div className={styles.modalActions}>
              <button className={styles.confirmBtn} onClick={confirmUpdate}>
                Lưu
              </button>
              <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal for updating customer */}
      {isConfirmUpdateModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Xác nhận cập nhật</h3>
            <p>Bạn có chắc muốn cập nhật thông tin {roleFilter === "user" ? "khách hàng" : "quản trị viên"} này?</p>
            <div className={styles.modalActions}>
              <button className={styles.confirmBtn} onClick={updateCustomerInfo}>
                Xác nhận
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setIsConfirmUpdateModalOpen(false);
                  setIsModalOpen(true);
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for creating admin account */}
      {isCreateAdminModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Tạo Tài Khoản Quản Trị Viên</h3>
            <label>
              Tên:
              <input
                type="text"
                required
                value={newAdmin.username}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, username: e.target.value })
                }
                placeholder="Nhập tên"
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                required
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                placeholder="Nhập email"
              />
            </label>
            <label>
              Số điện thoại:
              <input
                type="text"
                required
                value={newAdmin.phone}
                onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                placeholder="Nhập số điện thoại"
              />
            </label>
            <label>
              Mật khẩu:
              <input
                type="password"
                required
                minLength={8}
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
              />
            </label>
            <p>Vai trò: Quản trị viên</p>
            <div className={styles.modalActions}>
              <button className={styles.confirmBtn} onClick={confirmCreateAdmin}>
                Tạo
              </button>
              <button className={styles.cancelBtn} onClick={() => setIsCreateAdminModalOpen(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal for creating admin account */}
      {isConfirmCreateAdminModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Xác nhận tạo tài khoản</h3>
            <p>Bạn có chắc muốn tạo tài khoản quản trị viên này?</p>
            <div className={styles.modalActions}>
              <button className={styles.confirmBtn} onClick={createAdminAccount}>
                Xác nhận
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setIsConfirmCreateAdminModalOpen(false);
                  setIsCreateAdminModalOpen(true);
                }}
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