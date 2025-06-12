"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function Customer() {
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

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 9;
  const router = useRouter();

  // Check admin privileges
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Fetch customers
  useEffect(() => {
    if (!isAuthorized) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập lại!");
      router.push("/login");
      return;
    }

    fetch("https://api-zeal.onrender.com/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          localStorage.clear();
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          const filteredData = data.filter((customer: Customer) => customer.role === "admin");
          setCustomers(filteredData);
          setFilteredCustomers(filteredData);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Lỗi khi tải dữ liệu khách hàng!");
      });
  }, [isAuthorized, router]);

  // Handle search
  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [searchQuery, customers]);

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
    const visiblePages = [];
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

  const updateCustomerInfo = async () => {
    if (!selectedCustomer) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập lại!");
        router.push("/login");
        return;
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
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.clear();
        router.push("/login");
        return;
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
      setIsModalOpen(false);
      alert("Cập nhật thông tin khách hàng thành công!");
    } catch (err: any) {
      console.error("Error:", err);
      alert(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  if (!isAuthorized) return null;

  return (
    <>
      <div className={styles.titleContainer}>
        <h1>KHÁCH HÀNG</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
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
                  <td>{customer.status}</td>
                  <td>{customer.role}</td>
                  <td>{new Date(customer.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <button className={styles.btn} onClick={() => openModal(customer)}>
                      Sửa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Không có khách hàng nào
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
      {isModalOpen && selectedCustomer && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Chỉnh sửa thông tin khách hàng</h3>
            <label>
              Trạng thái:
              <select
                value={selectedCustomer.status}
                onChange={(e) =>
                  setSelectedCustomer({ ...selectedCustomer, status: e.target.value })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <div className={styles.modalActions}>
              <button onClick={updateCustomerInfo}>Lưu</button>
              <button onClick={() => setIsModalOpen(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}