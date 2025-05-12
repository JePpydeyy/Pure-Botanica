// app/coupons/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./coupon.module.css";

interface Coupon {
  _id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  usageLimit: number | null;
  isActive: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FormData {
  _id?: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  usageLimit: number | null;
  isActive: boolean;
}

export default function CouponPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderValue: 0,
    expiryDate: "",
    usageLimit: null,
    isActive: true,
  });
  const router = useRouter();

  // Check authorization
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Fetch coupons
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchCoupons = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          `https://api-zeal.onrender.com/api/coupons?page=${pagination.page}&limit=${pagination.limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Phiên đăng nhập hết hạn");
          }
          throw new Error("Failed to fetch coupons");
        }

        const data = await response.json();
        console.log("API response:", data);
        setCoupons(data.coupons || []);
        setPagination(data.pagination || pagination);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error
            ? err.message === "Phiên đăng nhập hết hạn"
              ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!"
              : "Lỗi khi tải dữ liệu khuyến mãi!"
            : "Đã xảy ra lỗi không xác định"
        );
        setLoading(false);

        if (err instanceof Error && err.message === "Phiên đăng nhập hết hạn") {
          localStorage.clear();
          router.push("/login");
        }
      }
    };

    fetchCoupons();
  }, [isAuthorized, pagination.page, router]);

  // Handle form submission (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const url = formData._id
        ? `https://api-zeal.onrender.com/api/coupons/${formData._id}`
        : `https://api-zeal.onrender.com/api/coupons`;
      const method = formData._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          expiryDate: formData.expiryDate || undefined,
          usageLimit: formData.usageLimit || null,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      console.log("Submit response:", data);
      setShowModal(false);
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        minOrderValue: 0,
        expiryDate: "",
        usageLimit: null,
        isActive: true,
      });
      // Refresh data
      const fetchCoupons = async () => {
        const response = await fetch(
          `https://api-zeal.onrender.com/api/coupons?page=${pagination.page}&limit=${pagination.limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newData = await response.json();
        setCoupons(newData.coupons || []);
        setPagination(newData.pagination || pagination);
      };
      fetchCoupons();
    } catch (err) {
      console.error("Submit error:", err);
      setError(
        err instanceof Error
          ? err.message === "Phiên đăng nhập hết hạn"
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!"
            : err.message || "Lỗi khi lưu mã giảm giá!"
          : "Đã xảy ra lỗi không xác định"
      );
    }
  };

  // Edit coupon
  const handleEdit = (coupon: Coupon) => {
    setFormData({
      _id: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      expiryDate: coupon.expiryDate,
      usageLimit: coupon.usageLimit,
      isActive: coupon.isActive,
    });
    setShowModal(true);
  };

  // Delete coupon
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa mã giảm giá này?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`https://api-zeal.onrender.com/api/coupons/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      console.log("Delete response:", data);
      // Refresh data
      const fetchCoupons = async () => {
        const response = await fetch(
          `https://api-zeal.onrender.com/api/coupons?page=${pagination.page}&limit=${pagination.limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newData = await response.json();
        setCoupons(newData.coupons || []);
        setPagination(newData.pagination || pagination);
      };
      fetchCoupons();
    } catch (err) {
      console.error("Delete error:", err);
      setError(
        err instanceof Error
          ? err.message === "Phiên đăng nhập hết hạn"
            ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!"
            : err.message || "Lỗi khi xóa mã giảm giá!"
          : "Đã xảy ra lỗi không xác định"
      );
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải mã giảm giá...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.couponPage}>
      <div className={styles.titleContainer}>
        <h1>KHÁM PHÁ MÃ GIẢM GIÁ</h1>
        <button className={styles.button} onClick={() => setShowModal(true)}>
          Thêm mã giảm giá
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Mã giảm giá</th>
              <th>Loại giảm giá</th>
              <th>Giảm giá (%)</th>
              <th>Đơn hàng tối thiểu</th>
              <th>Ngày hết hạn</th>
              <th>Số lần sử dụng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length > 0 ? (
              coupons.map((coupon, index) => (
                <tr key={coupon._id}>
                  <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td>{coupon.code}</td>
                  <td>{coupon.discountType}</td>
                  <td>{coupon.discountValue}%</td>
                  <td>{(coupon.minOrderValue || 0).toLocaleString()} VNĐ</td>
                  <td>
                    {coupon.expiryDate
                      ? new Date(coupon.expiryDate).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td>{coupon.usageLimit ?? "Không giới hạn"}</td>
                  <td>
                    <span
                      className={
                        coupon.isActive ? styles.statusActive : styles.statusInactive
                      }
                    >
                      {coupon.isActive ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(coupon)}
                      >
                        Sửa
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(coupon._id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className={styles.emptyState}>
                  Không có mã giảm giá nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </button>
      </div>
      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{formData._id ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Mã giảm giá:</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Loại giảm giá:</label>
                <select
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData({ ...formData, discountType: e.target.value })
                  }
                  required
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Giá trị giảm (% hoặc VNĐ):</label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({ ...formData, discountValue: Number(e.target.value) })
                  }
                  required
                  min="0"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Đơn hàng tối thiểu (VNĐ):</label>
                <input
                  type="number"
                  value={formData.minOrderValue}
                  onChange={(e) =>
                    setFormData({ ...formData, minOrderValue: Number(e.target.value) })
                  }
                  min="0"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ngày hết hạn:</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Số lần sử dụng:</label>
                <input
                  type="number"
                  value={formData.usageLimit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimit: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  min="0"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Trạng thái:</label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
                <span>Hoạt động</span>
              </div>
              <div className={styles.formActions}>
                <button type="submit">
                  {formData._id ? "Cập nhật" : "Thêm"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      code: "",
                      discountType: "percentage",
                      discountValue: 0,
                      minOrderValue: 0,
                      expiryDate: "",
                      usageLimit: null,
                      isActive: true,
                    });
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}