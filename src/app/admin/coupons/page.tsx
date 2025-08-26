"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "./coupon.module.css";
import type { Coupon, User } from "@/app/components/coupon_interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faTimes,
  faCheck,
  faUsers,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import ToastNotification from "../../user/ToastNotification/ToastNotification";
import CouponForm from "../../components/CouponForm";

// Interfaces
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
  description: string;
}

interface BulkCouponFormData {
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  expiryDays: number;
  usageLimit: number | null;
  target: "all" | "selected";
  selectedUserIds: string[];
  description: string;
  count: number; // Thêm count cho số lượng mã
}

interface SpecialDay {
  date: string;
  description: string;
}

interface AutoSetupFormData {
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  expiryDays: number;
  usageLimit: number | null;
  specialDays: SpecialDay[];
}

interface AutoSetupConfig {
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  expiryDays: number;
  usageLimit: number | null;
  specialDays: SpecialDay[];
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error";
}

// Type guards
function isFormData(
  formData: FormData | BulkCouponFormData | AutoSetupFormData
): formData is FormData {
  return "code" in formData && "isActive" in formData;
}

function isBulkCouponFormData(
  formData: FormData | BulkCouponFormData | AutoSetupFormData
): formData is BulkCouponFormData {
  return "target" in formData && "selectedUserIds" in formData;
}

function isAutoSetupFormData(
  formData: FormData | BulkCouponFormData | AutoSetupFormData
): formData is AutoSetupFormData {
  return "specialDays" in formData;
}

// Custom hook
const useCouponForm = <T extends object>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);
  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);
  const resetForm = useCallback(() => setFormData(initialState), [initialState]);
  return { formData, updateField, resetForm, setFormData };
};

function CouponsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQueryFromUrl = searchParams.get("search") || "";
  const statusFilterFromUrl =
    (searchParams.get("status") as "all" | "active" | "inactive") || "all";

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [notification, setNotification] = useState<Notification>({
    show: false,
    message: "",
    type: "success",
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });
  const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >(statusFilterFromUrl);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkCouponModal, setShowBulkCouponModal] = useState(false);
  const [showAutoSetupModal, setShowAutoSetupModal] = useState(false);
  const [deleteCouponId, setDeleteCouponId] = useState<string | null>(null);

  const initialFormData: FormData = {
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderValue: 0,
    expiryDate: null,
    usageLimit: null,
    isActive: true,
    usedCount: 0,
    description: "",
  };

  const initialBulkCouponFormData: BulkCouponFormData = {
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 0,
    expiryDays: 7,
    usageLimit: 1,
    target: "all",
    selectedUserIds: [],
    description: "",
    count: 5,
  };

  const initialAutoSetupFormData: AutoSetupFormData = {
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 0,
    expiryDays: 7,
    usageLimit: 1,
    specialDays: [
      { date: "2025-09-02", description: "Ngày Quốc Khánh" },
      { date: "2026-01-01", description: "Năm Mới" },
    ],
  };

  const { formData, updateField, resetForm, setFormData } =
    useCouponForm<FormData>(initialFormData);
  const { formData: bulkCouponFormData, updateField: updateBulkField, resetForm: resetBulkForm } =
    useCouponForm<BulkCouponFormData>(initialBulkCouponFormData);
  const {
    formData: autoSetupFormData,
    updateField: updateAutoSetupField,
    resetForm: resetAutoSetupForm,
    setFormData: setAutoSetupFormData,
  } = useCouponForm<AutoSetupFormData>(initialAutoSetupFormData);

  // Xử lý lỗi
  const handleError = useCallback(
    (err: unknown, defaultMessage: string) => {
      let errorMessage = defaultMessage;
      if (err instanceof Error) {
        if (
          err.message.includes("Phiên đăng nhập hết hạn") ||
          err.message.includes("Unauthorized")
        ) {
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
      setTimeout(
        () => setNotification({ show: false, message: "", type: "success" }),
        3000
      );
    },
    [router]
  );

  // Validate form
  const validateForm = useCallback(
    (data: FormData | BulkCouponFormData | AutoSetupFormData) => {
      const errors: string[] = [];
      if (isFormData(data)) {
        if (!data.code.trim()) {
          errors.push("Mã giảm giá là bắt buộc!");
        }
        if (data.code.length > 20) {
          errors.push("Mã giảm giá không được vượt quá 20 ký tự!");
        }
        if (data.description && data.description.length > 200) {
          errors.push("Mô tả không được vượt quá 200 ký tự!");
        }
      }
      if (data.discountValue <= 0) {
        errors.push("Giá trị giảm phải lớn hơn 0!");
      }
      if (
        (isBulkCouponFormData(data) || isAutoSetupFormData(data)) &&
        data.expiryDays < 1
      ) {
        errors.push("Số ngày hiệu lực phải lớn hơn hoặc bằng 1!");
      }
      if (isBulkCouponFormData(data)) {
        if (data.description && data.description.length > 200) {
          errors.push("Mô tả không được vượt quá 200 ký tự!");
        }
        if (data.count < 1) {
          errors.push("Số lượng mã phải lớn hơn hoặc bằng 1!");
        }
      }
      if (isAutoSetupFormData(data)) {
        if (!data.specialDays.length) {
          errors.push("Vui lòng nhập ít nhất một ngày đặc biệt!");
        } else {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          for (const day of data.specialDays) {
            if (!dateRegex.test(day.date)) {
              errors.push(
                "Ngày đặc biệt phải đúng định dạng YYYY-MM-DD (ví dụ: 2025-09-02)!"
              );
              break;
            }
            if (day.description && day.description.length > 200) {
              errors.push(`Mô tả cho ngày ${day.date} không được vượt quá 200 ký tự!`);
            }
          }
        }
      }
      return errors;
    },
    []
  );

  // Làm mới token
  const refreshToken = async (attempts = 0, maxAttempts = 2) => {
    try {
      const response = await fetch("https://api-zeal.onrender.com/api/auth/refresh", {
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
      if (attempts < maxAttempts) {
        return refreshToken(attempts + 1, maxAttempts);
      }
      handleError(err, "Lỗi khi làm mới token!");
      return null;
    }
  };

  // Fetch với token
  const fetchWithToken = async (url: string, options: RequestInit = {}, hasRetried = false) => {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401 && !hasRetried) {
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
        hasRetried = true;
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

  // Lấy cấu hình tự động
  const fetchAutoSetupConfig = useCallback(async () => {
    try {
      const response = await fetchWithToken(
        "https://api-zeal.onrender.com/api/coupons/auto-setup",
        { method: "GET", cache: "no-store" }
      );
      const data = await response.json();
      if (data.success && data.config) {
        const config: AutoSetupConfig = data.config;
        setAutoSetupFormData({
          discountType: config.discountType,
          discountValue: config.discountValue,
          minOrderValue: config.minOrderValue,
          expiryDays: config.expiryDays,
          usageLimit: config.usageLimit,
          specialDays: config.specialDays,
        });
      }
    } catch (err) {
      handleError(err, "Lỗi khi tải cấu hình tự động!");
    }
  }, [handleError, setAutoSetupFormData]);

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

  // Lấy danh sách mã giảm giá
  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { code: searchQuery }),
        ...(statusFilter !== "all" && {
          isActive: statusFilter === "active" ? "true" : "false",
        }),
      });

      const response = await fetchWithToken(
        `https://api-zeal.onrender.com/api/coupons?${queryParams}`,
        { cache: "no-store" }
      );
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
    fetchCoupons();
    fetchAutoSetupConfig();
  }, [
    isAuthorized,
    searchQuery,
    statusFilter,
    fetchCoupons,
    router,
    fetchAutoSetupConfig,
  ]);

  // Quản lý focus cho modal
  useEffect(() => {
    if (
      showModal ||
      showBulkCouponModal ||
      showDeleteModal ||
      showAutoSetupModal
    ) {
      const firstInput = document.querySelector(
        `.${styles.modalContent} input, .${styles.modalContent} select`
      ) as HTMLElement;
      firstInput?.focus();
    }
  }, [
    showModal,
    showBulkCouponModal,
    showDeleteModal,
    showAutoSetupModal,
  ]);

  // Xử lý submit form tạo/sửa mã giảm giá
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actionLoading) return;

    const errors = validateForm(formData);
    if (errors.length > 0) {
      setNotification({ show: true, message: errors.join(", "), type: "error" });
      setTimeout(
        () => setNotification({ show: false, message: "", type: "success" }),
        3000
      );
      return;
    }

    setActionLoading(true);
    try {
      const url = formData._id
        ? `https://api-zeal.onrender.com/api/coupons/${formData._id}`
        : `https://api-zeal.onrender.com/api/coupons`;
      const method = formData._id ? "PUT" : "POST";

      const bodyData = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        minOrderValue: formData.minOrderValue || 0,
        expiryDate: formData.expiryDate || null,
        usageLimit: formData.usageLimit || null,
        isActive: formData.isActive,
        description: formData.description || "",
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
        message: formData._id
          ? "Cập nhật mã giảm giá thành công!"
          : "Thêm mã giảm giá thành công!",
        type: "success",
      });
      setTimeout(
        () => setNotification({ show: false, message: "", type: "success" }),
        3000
      );
      setPagination((prev) => ({ ...prev, page: 1 }));
      await fetchCoupons();
    } catch (err) {
      handleError(err, "Lỗi khi lưu mã giảm giá!");
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
      setTimeout(
        () => setNotification({ show: false, message: "", type: "success" }),
        3000
      );
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
        count: bulkCouponFormData.count,
        description: bulkCouponFormData.description || "",
      };

      const response = await fetchWithToken(
        "https://api-zeal.onrender.com/api/coupons/bulk",
        {
          method: "POST",
          body: JSON.stringify(bodyData),
          cache: "no-store",
        }
      );

      const data = await response.json();
      setShowBulkCouponModal(false);
      resetBulkForm();
      setNotification({
        show: true,
        message: `Tạo ${data.coupons.length} mã giảm giá thành công!`,
        type: "success",
      });
      setTimeout(
        () => setNotification({ show: false, message: "", type: "success" }),
        3000
      );
      setPagination((prev) => ({ ...prev, page: 1 }));
      await fetchCoupons();
    } catch (err) {
      handleError(err, "Lỗi khi tạo mã giảm giá hàng loạt!");
    } finally {
      setBulkLoading(false);
    }
  };

  // Xử lý submit form thiết lập tự động
  const handleAutoSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actionLoading) return;

    const errors = validateForm(autoSetupFormData);
    if (errors.length > 0) {
      setNotification({ show: true, message: errors.join(", "), type: "error" });
      setTimeout(
        () => setNotification({ show: false, message: "", type: "success" }),
        3000
      );
      return;
    }

    setActionLoading(true);
    try {
      const bodyData = {
        discountType: autoSetupFormData.discountType,
        discountValue: autoSetupFormData.discountValue,
        minOrderValue: autoSetupFormData.minOrderValue,
        expiryDays: autoSetupFormData.expiryDays,
        usageLimit: autoSetupFormData.usageLimit,
        specialDays: autoSetupFormData.specialDays,
      };

      const response = await fetchWithToken(
        "https://api-zeal.onrender.com/api/coupons/auto-setup",
        {
          method: "POST",
          body: JSON.stringify(bodyData),
          cache: "no-store",
        }
      );

      const data = await response.json();
      setShowAutoSetupModal(false);
      resetAutoSetupForm();
      setNotification({
        show: true,
        message: "Cài đặt tự động tạo mã giảm giá thành công!",
        type: "success",
      });
      setTimeout(
        () => setNotification({ show: false, message: "", type: "success" }),
        3000
      );
      await fetchAutoSetupConfig();
    } catch (err) {
      handleError(err, "Lỗi khi thiết lập tự động!");
    } finally {
      setActionLoading(false);
    }
  };

  // Sửa mã giảm giá
  const handleEdit = useCallback(
    (coupon: Coupon) => {
      setFormData({
        _id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
        expiryDate: coupon.expiryDate
          ? new Date(coupon.expiryDate).toISOString().split("T")[0]
          : null,
        usageLimit: coupon.usageLimit,
        isActive: coupon.isActive,
        usedCount: coupon.usedCount ?? 0,
        description: coupon.description || "",
      });
      setShowModal(true);
    },
    [setFormData]
  );

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
      const response = await fetchWithToken(
        `https://api-zeal.onrender.com/api/coupons/${deleteCouponId}`,
        {
          method: "DELETE",
          cache: "no-store",
        }
      );

      const data = await response.json();
      setShowDeleteModal(false);
      setDeleteCouponId(null);
      setNotification({
        show: true,
        message: "Xóa mã giảm giá thành công!",
        type: "success",
      });
      setTimeout(
        () => setNotification({ show: false, message: "", type: "success" }),
        3000
      );
      setPagination((prev) => ({ ...prev, page: 1 }));
      await fetchCoupons();
    } catch (err) {
      handleError(err, "Lỗi khi xóa mã giảm giá!");
    } finally {
      setActionLoading(false);
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage > 0 && newPage <= pagination.totalPages) {
        setPagination((prev) => ({ ...prev, page: newPage }));
      }
    },
    [pagination.totalPages]
  );

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

  // Xử lý thêm/xóa ngày đặc biệt
  const addSpecialDay = () => {
    setAutoSetupFormData({
      ...autoSetupFormData,
      specialDays: [...autoSetupFormData.specialDays, { date: "", description: "" }],
    });
  };

  const removeSpecialDay = (index: number) => {
    setAutoSetupFormData({
      ...autoSetupFormData,
      specialDays: autoSetupFormData.specialDays.filter((_, i) => i !== index),
    });
  };

  const updateSpecialDay = (index: number, field: keyof SpecialDay, value: string) => {
    const updatedSpecialDays = [...autoSetupFormData.specialDays];
    updatedSpecialDays[index] = { ...updatedSpecialDays[index], [field]: value };
    updateAutoSetupField("specialDays", updatedSpecialDays);
  };

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
          onClose={() =>
            setNotification({ show: false, message: "", type: "success" })
          }
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
            disabled={actionLoading || bulkLoading}
          />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "active" | "inactive")
            }
            className={styles.categorySelect}
            aria-label="Lọc theo trạng thái mã giảm giá"
            disabled={actionLoading || bulkLoading}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
          {isAdmin && (
            <>
              <button
                className={styles.addProductBtn}
                onClick={() => setShowModal(true)}
                disabled={actionLoading || bulkLoading}
                aria-label="Thêm mã giảm giá mới"
              >
                Thêm mã giảm giá
              </button>
              <button
                className={styles.addProductBtn}
                onClick={() => {
                  setShowAutoSetupModal(true);
                  fetchAutoSetupConfig();
                }}
                disabled={actionLoading || bulkLoading}
                aria-label="Thiết lập tự động tạo mã"
              >
                <FontAwesomeIcon icon={faGear} /> Thiết lập tự động
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
              <th>Mô tả</th>
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
              coupons.map((coupon, index) => {
                if (!coupon._id) {
                  console.error("Invalid coupon ID:", coupon);
                  return null;
                }
                return (
                  <tr key={coupon._id} className={styles.productRow}>
                    <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                    <td>{coupon.code}</td>
                    <td>{coupon.description || "Không có mô tả"}</td>
                    <td>
                      {coupon.discountType === "percentage" ? "Phần trăm" : "Cố định"}
                    </td>
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
                    <td>Tất cả</td>
                    {isAdmin && (
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.editBtn}
                            onClick={() => handleEdit(coupon)}
                            disabled={actionLoading || bulkLoading}
                            title="Sửa mã giảm giá"
                            aria-label={`Sửa mã giảm giá ${coupon.code}`}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => confirmDelete(coupon._id)}
                            disabled={actionLoading || bulkLoading}
                            title="Xóa mã giảm giá"
                            aria-label={`Xóa mã giảm giá ${coupon.code}`}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
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
                  disabled={pagination.page === 1 || loading || actionLoading || bulkLoading}
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
                    disabled={loading || actionLoading || bulkLoading}
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
                  disabled={
                    pagination.page === pagination.totalPages ||
                    loading ||
                    actionLoading ||
                    bulkLoading
                  }
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
          isEdit={!!formData._id}
          users={undefined}
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
          users={undefined}
        />
      )}
      {showAutoSetupModal && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auto-setup-modal-title"
        >
          <div className={styles.modalContent}>
            <button
              className={styles.closePopupBtn}
              onClick={() => {
                setShowAutoSetupModal(false);
                resetAutoSetupForm();
              }}
              disabled={actionLoading}
              title="Đóng"
              aria-label="Đóng thiết lập tự động"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 id="auto-setup-modal-title" className={styles.modalContentTitle}>
              Thiết Lập Tự Động
            </h2>
            <form onSubmit={handleAutoSetupSubmit} className={styles.formContainer}>
              <div className={styles.formGroup}>
                <label htmlFor="discountType">Loại giảm giá:</label>
                <select
                  id="discountType"
                  value={autoSetupFormData.discountType}
                  onChange={(e) =>
                    updateAutoSetupField("discountType", e.target.value as "percentage" | "fixed")
                  }
                  disabled={actionLoading}
                >
                  <option value="percentage">Phần trăm</option>
                  <option value="fixed">Cố định</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="discountValue">Giá trị giảm:</label>
                <input
                  type="number"
                  id="discountValue"
                  value={autoSetupFormData.discountValue}
                  onChange={(e) =>
                    updateAutoSetupField("discountValue", parseInt(e.target.value) || 0)
                  }
                  min="0"
                  disabled={actionLoading}
                />
                <span>{autoSetupFormData.discountType === "percentage" ? "%" : "VNĐ"}</span>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="minOrderValue">Đơn hàng tối thiểu:</label>
                <input
                  type="number"
                  id="minOrderValue"
                  value={autoSetupFormData.minOrderValue}
                  onChange={(e) =>
                    updateAutoSetupField("minOrderValue", parseInt(e.target.value) || 0)
                  }
                  min="0"
                  disabled={actionLoading}
                />
                <span>VNĐ</span>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="expiryDays">Số ngày hiệu lực:</label>
                <input
                  type="number"
                  id="expiryDays"
                  value={autoSetupFormData.expiryDays}
                  onChange={(e) =>
                    updateAutoSetupField("expiryDays", parseInt(e.target.value) || 1)
                  }
                  min="1"
                  disabled={actionLoading}
                />
                <span>ngày</span>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="usageLimit">Giới hạn sử dụng:</label>
                <input
                  type="number"
                  id="usageLimit"
                  value={autoSetupFormData.usageLimit || ""}
                  onChange={(e) =>
                    updateAutoSetupField(
                      "usageLimit",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  min="1"
                  placeholder="Không giới hạn"
                  disabled={actionLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ngày đặc biệt:</label>
                {autoSetupFormData.specialDays.map((day, index) => (
                  <div key={index} className={styles.specialDayRow}>
                    <input
                      type="date"
                      value={day.date}
                      onChange={(e) => updateSpecialDay(index, "date", e.target.value)}
                      disabled={actionLoading}
                      placeholder="YYYY-MM-DD"
                    />
                    <input
                      type="text"
                      value={day.description}
                      onChange={(e) => updateSpecialDay(index, "description", e.target.value)}
                      maxLength={200}
                      placeholder="Mô tả (ví dụ: Ngày Quốc Khánh)"
                      disabled={actionLoading}
                    />
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => removeSpecialDay(index)}
                      disabled={actionLoading}
                      aria-label={`Xóa ngày đặc biệt ${index + 1}`}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className={styles.addProductBtn}
                  onClick={addSpecialDay}
                  disabled={actionLoading}
                  aria-label="Thêm ngày đặc biệt"
                >
                  <FontAwesomeIcon icon={faPlus} /> Thêm ngày
                </button>
              </div>
              <div className={styles.modalActions}>
                <button
                  type="submit"
                  className={styles.confirmBtn}
                  disabled={actionLoading}
                  aria-label="Lưu thiết lập tự động"
                >
                  <FontAwesomeIcon icon={faCheck} />
                  {actionLoading ? " Đang xử lý..." : "Lưu"}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowAutoSetupModal(false);
                    resetAutoSetupForm();
                  }}
                  disabled={actionLoading}
                  aria-label="Hủy thiết lập tự động"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
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
            <h2 id="delete-modal-title" className={styles.modalContentTitle}>
              Xác Nhận Xóa
            </h2>
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
                  {actionLoading ? " Đang xử lý..." : "Xác nhận"}
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
                  Hủy
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