"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "./coupon.module.css";
import type { Coupon, User } from "@/app/components/coupon_interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faTimes, faCheck, faUsers } from "@fortawesome/free-solid-svg-icons";
import ToastNotification from "../../user/ToastNotification/ToastNotification";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FormData {
  _id?: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  expiryDate: string | null;
  usageLimit: number | null;
  isActive: boolean;
  usedCount?: number;
  userId?: string | null;
}

interface SingleCouponFormData {
  userId: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  expiryDays: number;
  usageLimit: number | null;
}

interface BulkCouponFormData {
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  expiryDays: number;
  usageLimit: number | null;
  target: "all" | "selected";
  selectedUserIds: string[];
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error";
}

// Type guard
function isFormData(formData: FormData | SingleCouponFormData | BulkCouponFormData): formData is FormData {
  return "code" in formData && "isActive" in formData;
}

function isSingleCouponFormData(formData: FormData | SingleCouponFormData | BulkCouponFormData): formData is SingleCouponFormData {
  return "userId" in formData && "expiryDays" in formData;
}

function isBulkCouponFormData(formData: FormData | SingleCouponFormData | BulkCouponFormData): formData is BulkCouponFormData {
  return "target" in formData && "selectedUserIds" in formData;
}

// Custom hook để quản lý form state
const useCouponForm = <T extends object>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);
  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);
  const resetForm = useCallback(() => setFormData(initialState), [initialState]);
  return { formData, updateField, resetForm, setFormData };
};

// Component CouponForm (đã sửa ở trên, giữ nguyên)

// Component CouponsContent
function CouponsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQueryFromUrl = searchParams.get("search") || "";
  const statusFilterFromUrl = (searchParams.get("status") as "all" | "active" | "inactive") || "all";

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "success" });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 9, total: 0, totalPages: 1 });
  const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(statusFilterFromUrl);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSingleCouponModal, setShowSingleCouponModal] = useState(false);
  const [showBulkCouponModal, setShowBulkCouponModal] = useState(false);
  const [deleteCouponId, setDeleteCouponId] = useState<string | null>(null);
  const [checkCouponCode, setCheckCouponCode] = useState<string>("");
  const [checkUserId, setCheckUserId] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  const initialFormData: FormData = {
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderValue: 0,
    expiryDate: null,
    usageLimit: null,
    isActive: true,
    usedCount: 0,
    userId: null,
  };

  const initialSingleCouponFormData: SingleCouponFormData = {
    userId: "",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 0,
    expiryDays: 7,
    usageLimit: 1,
  };

  const initialBulkCouponFormData: BulkCouponFormData = {
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 0,
    expiryDays: 7,
    usageLimit: 1,
    target: "all",
    selectedUserIds: [],
  };

  const { formData, updateField, resetForm, setFormData } = useCouponForm<FormData>(initialFormData);
  const { formData: singleCouponFormData, updateField: updateSingleField, resetForm: resetSingleForm } = useCouponForm<SingleCouponFormData>(initialSingleCouponFormData);
  const { formData: bulkCouponFormData, updateField: updateBulkField, resetForm: resetBulkForm } = useCouponForm<BulkCouponFormData>(initialBulkCouponFormData);

  // Xử lý lỗi
  const handleError = useCallback((err: unknown, defaultMessage: string) => {
    let errorMessage = defaultMessage;
    if (err instanceof Error) {
      if (err.message.includes("Phiên đăng nhập hết hạn") || err.message.includes("Unauthorized")) {
        errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!";
        localStorage.clear();
        setTimeout(() => router.push("/user/login"), 3000);
      } else if (err.message.includes("already exists")) {
        errorMessage = "Mã giảm giá đã tồn tại!";
      } else if (err.message.includes("limit exceeded")) {
        errorMessage = "Đã vượt quá giới hạn mã giảm giá!";
      } else if (err.message.includes("Không có người dùng hợp lệ")) {
        errorMessage = "Không có người dùng hợp lệ để tạo mã giảm giá!";
      } else {
        errorMessage = err.message || defaultMessage;
      }
    }
    setNotification({ show: true, message: errorMessage, type: "error" });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  }, [router]);

  // Validate form
  const validateForm = useCallback((data: FormData | SingleCouponFormData | BulkCouponFormData) => {
    const errors: string[] = [];
    if (isFormData(data) && !data.code.trim()) {
      errors.push("Mã giảm giá là bắt buộc!");
    }
    if (data.discountValue <= 0) {
      errors.push("Giá trị giảm phải lớn hơn 0!");
    }
    if ((isSingleCouponFormData(data) || isBulkCouponFormData(data)) && data.expiryDays < 1) {
      errors.push("Số ngày hiệu lực phải lớn hơn hoặc bằng 1!");
    }
    if (isSingleCouponFormData(data) && !data.userId) {
      errors.push("Vui lòng chọn người dùng!");
    }
    if (isBulkCouponFormData(data) && data.target === "selected" && !data.selectedUserIds.length) {
      errors.push("Vui lòng chọn ít nhất một người dùng!");
    }
    if (isFormData(data) && data.code.length > 20) {
      errors.push("Mã giảm giá không được vượt quá 20 ký tự!");
    }
    return errors;
  }, []);

  // Làm mới token
  const refreshToken = async () => {
    try {
      const response = await fetch("http://localhost:10000/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Không thể làm mới token!");
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      return data.token;
    } catch (err) {
      handleError(err, "Lỗi khi làm mới token!");
      return null;
    }
  };

  // Fetch với token
  const fetchWithToken = async (url: string, options: RequestInit = {}) => {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      token = await refreshToken();
      if (token) {
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        throw new Error("Không thể làm mới token!");
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Lỗi khi gọi API!");
    }

    return response;
  };

  // Kiểm tra quyền truy cập
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotification({
        show: true,
        message: "Bạn không có quyền truy cập. Vui lòng đăng nhập.",
        type: "error",
      });
      setTimeout(() => router.push("/user/login"), 3000);
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (decoded.role !== "admin") {
        setNotification({
          show: true,
          message: "Yêu cầu quyền admin để truy cập trang này.",
          type: "error",
        });
        setTimeout(() => router.push("/user/login"), 3000);
      } else {
        setIsAuthorized(true);
        setIsAdmin(true);
      }
    } catch (err) {
      handleError(err, "Lỗi xác thực token!");
    }
  }, [router, handleError]);

  // Lấy danh sách người dùng
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetchWithToken("http://localhost:10000/api/users", {
        cache: "no-store",
      });
      const data = await response.json();
      console.log("Users data:", data); // Debug
      setUsers(data.users || data || []);
    } catch (err) {
      handleError(err, "Lỗi khi tải danh sách người dùng!");
    }
  }, [handleError]);

  // Lấy danh sách mã giảm giá
  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { code: searchQuery }),
        ...(statusFilter !== "all" && { isActive: statusFilter === "active" ? "true" : "false" }),
      });

      const response = await fetchWithToken(`http://localhost:10000/api/coupons?${queryParams}`, {
        cache: "no-store",
      });
      const data = await response.json();
      setCoupons(data.coupons || []);
      setPagination(data.pagination || pagination);
    } catch (err) {
      handleError(err, "Lỗi khi tải dữ liệu khuyến mãi!");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, statusFilter, handleError]);

  // Đồng bộ query params và gọi API
  useEffect(() => {
    if (!isAuthorized) return;

    const params = new URLSearchParams({
      search: searchQuery,
      status: statusFilter,
    });
    router.push(`?${params.toString()}`, { scroll: false });
    fetchUsers();
    fetchCoupons();
  }, [isAuthorized, searchQuery, statusFilter, fetchUsers, fetchCoupons, router]);

  // Quản lý focus cho modal
  useEffect(() => {
    if (showModal || showSingleCouponModal || showBulkCouponModal || showDeleteModal) {
      const firstInput = document.querySelector(`.${styles.modalContent} input, .${styles.modalContent} select`) as HTMLElement;
      firstInput?.focus();
    }
  }, [showModal, showSingleCouponModal, showBulkCouponModal, showDeleteModal]);

  // Xử lý submit form tạo/sửa mã giảm giá
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actionLoading) return;

    const errors = validateForm(formData);
    if (errors.length > 0) {
      setNotification({ show: true, message: errors.join(", "), type: "error" });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      return;
    }

    setActionLoading(true);
    try {
      const url = formData._id
        ? `http://localhost:10000/api/coupons/${formData._id}`
        : `http://localhost:10000/api/coupons`;
      const method = formData._id ? "PUT" : "POST";

      const bodyData = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        minOrderValue: formData.minOrderValue || 0,
        expiryDate: formData.expiryDate || null,
        usageLimit: formData.usageLimit || null,
        isActive: formData.isActive,
        userId: formData.userId || null,
      };

      const response = await fetchWithToken(url, {
        method,
        body: JSON.stringify(bodyData),
        cache: "no-store",
      });

      const data = await response.json();
      setShowModal(false);
      resetForm();
      setNotification({
        show: true,
        message: formData._id ? "Cập nhật mã giảm giá thành công!" : "Thêm mã giảm giá thành công!",
        type: "success",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      setPagination((prev) => ({ ...prev, page: 1 }));
      await fetchCoupons();
    } catch (err) {
      handleError(err, "Lỗi khi lưu mã giảm giá!");
    } finally {
      setActionLoading(false);
    }
  };

  // Xử lý submit form tạo mã giảm giá đơn lẻ
  const handleSingleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actionLoading) return;

    const errors = validateForm(singleCouponFormData);
    if (errors.length > 0) {
      setNotification({ show: true, message: errors.join(", "), type: "error" });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetchWithToken("http://localhost:10000/api/coupons/single", {
        method: "POST",
        body: JSON.stringify(singleCouponFormData),
        cache: "no-store",
      });

      const data = await response.json();
      setShowSingleCouponModal(false);
      resetSingleForm();
      setNotification({
        show: true,
        message: "Tạo mã giảm giá thành công!",
        type: "success",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      setPagination((prev) => ({ ...prev, page: 1 }));
      await fetchCoupons();
    } catch (err) {
      handleError(err, "Lỗi khi tạo mã giảm giá!");
    } finally {
      setActionLoading(false);
    }
  };

  // Xử lý submit form tạo mã giảm giá hàng loạt
  const handleBulkCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkLoading) return;

    const errors = validateForm(bulkCouponFormData);
    if (errors.length > 0) {
      setNotification({ show: true, message: errors.join(", "), type: "error" });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      return;
    }

    setBulkLoading(true);
    try {
      const bodyData = {
        discountType: bulkCouponFormData.discountType,
        discountValue: bulkCouponFormData.discountValue,
        minOrderValue: bulkCouponFormData.minOrderValue,
        expiryDays: bulkCouponFormData.expiryDays,
        usageLimit: bulkCouponFormData.usageLimit,
        target: bulkCouponFormData.target,
        userIds: bulkCouponFormData.target === "selected" ? bulkCouponFormData.selectedUserIds : null,
      };

      console.log("Sending bulk coupon data:", bodyData); // Debug

      const response = await fetchWithToken("http://localhost:10000/api/coupons/bulk", {
        method: "POST",
        body: JSON.stringify(bodyData),
        cache: "no-store",
      });

      const data = await response.json();
      setShowBulkCouponModal(false);
      resetBulkForm();
      setNotification({
        show: true,
        message: `Tạo ${data.coupons.length} mã giảm giá thành công!`,
        type: "success",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      setPagination((prev) => ({ ...prev, page: 1 }));
      await fetchCoupons();
    } catch (err) {
      handleError(err, "Lỗi khi tạo mã giảm giá hàng loạt!");
    } finally {
      setBulkLoading(false);
    }
  };

  // Kiểm tra mã giảm giá
  const handleCheckCoupon = async () => {
    if (!checkCouponCode.trim()) {
      setNotification({
        show: true,
        message: "Vui lòng nhập mã giảm giá để kiểm tra!",
        type: "error",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      return;
    }
    if (checkLoading) return;
    setCheckLoading(true);
    try {
      const response = await fetchWithToken(
        `http://localhost:10000/api/coupons/check/${encodeURIComponent(checkCouponCode)}`,
        {
          method: "POST",
          body: JSON.stringify({
            userId: checkUserId || null,
            orderValue: 0,
          }),
          cache: "no-store",
        }
      );

      const data = await response.json();
      setNotification({
        show: true,
        message: data.message || "Mã giảm giá hợp lệ!",
        type: "success",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      setCheckCouponCode("");
      setCheckUserId("");
    } catch (err) {
      handleError(err, "Lỗi khi kiểm tra mã giảm giá!");
    } finally {
      setCheckLoading(false);
    }
  };

  // Sửa mã giảm giá
  const handleEdit = useCallback((coupon: Coupon) => {
    setFormData({
      _id: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split("T")[0] : null,
      usageLimit: coupon.usageLimit,
      isActive: coupon.isActive,
      usedCount: coupon.usedCount ?? 0,
      userId: coupon.userId?._id || null,
    });
    setShowModal(true);
  }, [setFormData]);

  // Xác nhận xóa mã giảm giá
  const confirmDelete = useCallback((id: string) => {
    setDeleteCouponId(id);
    setShowDeleteModal(true);
  }, []);

  // Xóa mã giảm giá
  const handleDelete = async () => {
    if (!deleteCouponId || actionLoading) return;
    setActionLoading(true);
    try {
      const response = await fetchWithToken(`http://localhost:10000/api/coupons/${deleteCouponId}`, {
        method: "DELETE",
        cache: "no-store",
      });

      const data = await response.json();
      setShowDeleteModal(false);
      setDeleteCouponId(null);
      setNotification({ show: true, message: "Xóa mã giảm giá thành công!", type: "success" });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      setPagination((prev) => ({ ...prev, page: 1 }));
      await fetchCoupons();
    } catch (err) {
      handleError(err, "Lỗi khi xóa mã giảm giá!");
    } finally {
      setActionLoading(false);
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  }, [pagination.totalPages]);

  // Tạo thông tin phân trang
  const getPaginationInfo = useCallback(() => {
    const visiblePages: number[] = [];
    const maxPages = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxPages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    const showPrevEllipsis = startPage > 1;
    const showNextEllipsis = endPage < pagination.totalPages;

    return { visiblePages, showPrevEllipsis, showNextEllipsis };
  }, [pagination.page, pagination.totalPages]);

  if (loading) {
    return (
      <div className={styles.productManagementContainer}>
        <div className={styles.errorContainer}>
          <div className={styles.processingIndicator}>
            <FontAwesomeIcon icon={faCheck} spin />
            <p>Đang tải mã giảm giá...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productManagementContainer}>
      {notification.show && (
        <ToastNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: "", type: "success" })}
        />
      )}
      <div className={styles.titleContainer}>
        <h1>QUẢN LÝ MÃ GIẢM GIÁ</h1>
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm mã giảm giá theo mã..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Tìm kiếm mã giảm giá"
            disabled={actionLoading || bulkLoading || checkLoading}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className={styles.categorySelect}
            aria-label="Lọc theo trạng thái mã giảm giá"
            disabled={actionLoading || bulkLoading || checkLoading}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
          <div className={styles.checkCouponContainer}>
            <input
              type="text"
              placeholder="Nhập mã để kiểm tra..."
              value={checkCouponCode}
              onChange={(e) => setCheckCouponCode(e.target.value)}
              className={styles.searchInput}
              disabled={checkLoading}
              aria-label="Kiểm tra mã giảm giá"
            />
            <select
              value={checkUserId}
              onChange={(e) => setCheckUserId(e.target.value)}
              className={styles.categorySelect}
              disabled={checkLoading}
              aria-label="Chọn người dùng để kiểm tra mã"
            >
              <option value="">Không chọn người dùng</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
            <button
              className={styles.addProductBtn}
              onClick={handleCheckCoupon}
              disabled={checkLoading}
              aria-label="Kiểm tra mã giảm giá"
            >
              {checkLoading ? "Đang kiểm tra..." : "Kiểm tra mã"}
            </button>
          </div>
          {isAdmin && (
            <>
              <button
                className={styles.addProductBtn}
                onClick={() => setShowModal(true)}
                disabled={actionLoading || bulkLoading || checkLoading}
                aria-label="Thêm mã giảm giá mới"
              >
                Thêm mã giảm giá
              </button>
              <button
                className={styles.addProductBtn}
                onClick={() => setShowSingleCouponModal(true)}
                disabled={actionLoading || bulkLoading || checkLoading}
                aria-label="Tạo mã giảm giá cho một người"
              >
                <FontAwesomeIcon icon={faPlus} /> Tạo mã cho một người
              </button>
              <button
                className={styles.addProductBtn}
                onClick={() => setShowBulkCouponModal(true)}
                disabled={actionLoading || bulkLoading || checkLoading}
                aria-label="Tạo mã giảm giá hàng loạt"
              >
                <FontAwesomeIcon icon={faUsers} /> Tạo mã hàng loạt
              </button>
            </>
          )}
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.productTable}>
          <thead className={styles.productTableThead}>
            <tr>
              <th>STT</th>
              <th>Mã giảm giá</th>
              <th>Loại giảm giá</th>
              <th>Giá trị giảm</th>
              <th>Đơn hàng tối thiểu</th>
              <th>Ngày hết hạn</th>
              <th>Số lượt sử dụng</th>
              <th>Số lượt đã dùng</th>
              <th>Trạng thái</th>
              <th>Người dùng</th>
              {isAdmin && <th>Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {coupons.length > 0 ? (
              coupons.map((coupon, index) => (
                <tr key={coupon._id} className={styles.productRow}>
                  <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td>{coupon.code}</td>
                  <td>{coupon.discountType === "percentage" ? "Phần trăm" : "Cố định"}</td>
                  <td>
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `${coupon.discountValue.toLocaleString()} VNĐ`}
                  </td>
                  <td>{(coupon.minOrderValue || 0).toLocaleString()} VNĐ</td>
                  <td>
                    {coupon.expiryDate
                      ? new Date(coupon.expiryDate).toLocaleDateString("vi-VN")
                      : "Không có"}
                  </td>
                  <td>{coupon.usageLimit ?? "Không giới hạn"}</td>
                  <td>{coupon.usedCount ?? 0}</td>
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
                    {coupon.userId
                      ? `${coupon.userId.username} (${coupon.userId.email})`
                      : "Không giới hạn"}
                  </td>
                  {isAdmin && (
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(coupon)}
                          disabled={actionLoading || bulkLoading || checkLoading}
                          title="Sửa mã giảm giá"
                          aria-label={`Sửa mã giảm giá ${coupon.code}`}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => confirmDelete(coupon._id)}
                          disabled={actionLoading || bulkLoading || checkLoading}
                          title="Xóa mã giảm giá"
                          aria-label={`Xóa mã giảm giá ${coupon.code}`}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 11 : 10} className={styles.emptyState}>
                  <h3>Không có mã giảm giá</h3>
                  <p>Chưa có mã giảm giá nào phù hợp với bộ lọc.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          {(() => {
            const { visiblePages, showPrevEllipsis, showNextEllipsis } = getPaginationInfo();
            return (
              <>
                <button
                  className={styles.pageLink}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading || actionLoading || bulkLoading || checkLoading}
                  title="Trang trước"
                  aria-label="Trang trước"
                >
                  Trước
                </button>
                {showPrevEllipsis && (
                  <div className={styles.ellipsis} role="presentation">
                    ...
                  </div>
                )}
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    className={`${styles.pageLink} ${
                      pagination.page === page ? styles.pageLinkActive : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                    disabled={loading || actionLoading || bulkLoading || checkLoading}
                    title={`Trang ${page}`}
                    aria-label={`Trang ${page}`}
                  >
                    {page}
                  </button>
                ))}
                {showNextEllipsis && (
                  <div className={styles.ellipsis} role="presentation">
                    ...
                  </div>
                )}
                <button
                  className={styles.pageLink}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages || loading || actionLoading || bulkLoading || checkLoading}
                  title="Trang sau"
                  aria-label="Trang sau"
                >
                  Sau
                </button>
              </>
            );
          })()}
        </div>
      )}
      {showModal && (
        <CouponForm
          formData={formData}
          updateField={updateField}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false);
            resetForm();
          }}
          title={formData._id ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}
          isLoading={actionLoading}
          users={users}
          isEdit={!!formData._id}
        />
      )}
      {showSingleCouponModal && (
        <CouponForm
          formData={singleCouponFormData}
          updateField={updateSingleField}
          onSubmit={handleSingleCouponSubmit}
          onCancel={() => {
            setShowSingleCouponModal(false);
            resetSingleForm();
          }}
          title="Tạo mã giảm giá cho một người"
          isLoading={actionLoading}
          users={users}
        />
      )}
      {showBulkCouponModal && (
        <CouponForm
          formData={bulkCouponFormData}
          updateField={updateBulkField}
          onSubmit={handleBulkCouponSubmit}
          onCancel={() => {
            setShowBulkCouponModal(false);
            resetBulkForm();
          }}
          title="Tạo mã giảm giá hàng loạt"
          isLoading={bulkLoading}
          users={users}
        />
      )}
      {showDeleteModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
          <div className={styles.modalContent}>
            <button
              className={styles.closePopupBtn}
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteCouponId(null);
              }}
              disabled={actionLoading}
              title="Đóng"
              aria-label="Đóng xác nhận xóa mã giảm giá"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 id="delete-modal-title" className={styles.modalContentTitle}>Xác Nhận Xóa</h2>
            <div className={styles.popupDetails}>
              <p>Bạn có chắc muốn xóa mã giảm giá này?</p>
              <div className={styles.modalActions}>
                <button
                  className={styles.confirmBtn}
                  onClick={handleDelete}
                  disabled={actionLoading}
                  aria-label="Xác nhận xóa mã giảm giá"
                >
                  <FontAwesomeIcon icon={faCheck} />
                  {actionLoading ? " Đang xử lý..." : ""}
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteCouponId(null);
                  }}
                  disabled={actionLoading}
                  aria-label="Hủy xóa mã giảm giá"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CouponPage() {
  return (
    <Suspense fallback={<div className="loading">Đang tải...</div>}>
      <CouponsContent />
    </Suspense>
  );
}