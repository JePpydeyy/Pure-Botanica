"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css"; // ✅ import CSS module

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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

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
        "Authorization": `Bearer ${token}`,
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
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Lỗi khi tải dữ liệu khách hàng!");
      });
  }, [isAuthorized, router]);

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

      const res = await fetch(`https://api-zeal.onrender.com/api/users/update/${selectedCustomer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: selectedCustomer.status,
          role: selectedCustomer.role,
        }),
      });

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
      setIsModalOpen(false);
      alert("Cập nhật thông tin khách hàng thành công!");
      window.location.reload();
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
            {customers.map((customer, index) => (
              <tr key={customer._id}>
                <td>{index + 1}</td>
                <td>{customer.username}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.status}</td>
                <td>{customer.role}</td>
                <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className={styles.btn} onClick={() => openModal(customer)}>Sửa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
