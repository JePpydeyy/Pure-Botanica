"use client";
import { useEffect, useState, useCallback } from "react";
import styles from "./category.module.css";
import type { Category } from "@/app/components/category_interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faEyeSlash, faCheck, faTimes, faPlus, faRedo } from "@fortawesome/free-solid-svg-icons";
import ToastNotification from "../../user/ToastNotification/ToastNotification";

// Define interfaces
interface Product {
  _id: string;
  name: string;
  status: string;
  active: boolean;
  id_category: string | { _id: string; name: string; status: string };
  option?: { value: string; stock: number }[];
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error";
}

interface ConfirmPopup {
  id: string;
  name: string;
  action: "ẩn" | "hiển thị";
}

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState<ConfirmPopup | null>(null);
  const [showStockWarning, setShowStockWarning] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "show" | "hidden">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(9);
  const router = useRouter();
  const [notification, setNotification] = useState<Notification>({
    show: false,
    message: "",
    type: "success",
  });

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
  };

  // Fetch product counts for each category
  const fetchProductCounts = useCallback(async () => {
    if (!token || categories.length === 0) {
      console.log("Skipping fetchProductCounts: No token or categories available");
      return;
    }
    try {
      console.log("Fetching products from API...");
      const productsRes = await fetch("https://api-zeal.onrender.com/api/products", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!productsRes.ok) {
        console.error("API Error:", productsRes.status, productsRes.statusText);
        throw new Error(`Lỗi khi tải danh sách sản phẩm: ${productsRes.status}`);
      }

      const productsData: Product[] = await productsRes.json();
      console.log("Products Data:", productsData);

      const categoryIds = categories.map((cat) => cat._id);
      console.log("Category IDs:", categoryIds);

      const counts = productsData.reduce(
        (acc: { [key: string]: number }, product: Product) => {
          const categoryId = typeof product.id_category === "string" ? product.id_category : product.id_category?._id;
          if (categoryId && categoryIds.includes(categoryId)) {
            acc[categoryId] = (acc[categoryId] || 0) + 1;
          } else {
            console.warn(`Product ${product._id} has invalid or missing id_category: ${categoryId}`);
          }
          return acc;
        },
        {}
      );

      console.log("Product Counts:", counts);
      setProductCounts(counts);
    } catch (error: any) {
      console.error("Error in fetchProductCounts:", error);
      showNotification(`Lỗi khi tải số lượng sản phẩm: ${error.message}`, "error");
    }
  }, [token, categories]);

  // Fetch categories and token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    const fetchCategories = async () => {
      if (!storedToken) {
        showNotification("Vui lòng đăng nhập để truy cập trang này.", "error");
        router.push("/login");
        return;
      }
      try {
        const res = await fetch("https://api-zeal.onrender.com/api/categories/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          cache: "no-store",
        });
        if (!res.ok) {
          if (res.status === 401) {
            showNotification("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "error");
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          if (res.status === 404) {
            setCategories([]);
            return;
          }
          throw new Error(`Không thể tải danh mục: ${res.status}`);
        }
        const data: Category[] = await res.json();
        console.log("Fetched Categories:", data);
        setCategories(data);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        showNotification(error.message || "Đã xảy ra lỗi khi tải danh sách danh mục.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [router]);

  // Fetch product counts when token or categories change
  useEffect(() => {
    fetchProductCounts();
  }, [fetchProductCounts]);

  const handleToggleVisibility = useCallback((id: string) => {
    if (!token) {
      showNotification("Vui lòng đăng nhập để thực hiện thao tác này!", "error");
      router.push("/login");
      return;
    }
    console.log("Toggle visibility called with ID:", id);
    const category = categories.find((cat) => cat._id === id);
    if (!category) {
      console.error("Category not found for ID:", id);
      showNotification("Không tìm thấy danh mục!", "error");
      return;
    }

    setShowConfirmPopup({
      id,
      name: category.name,
      action: category.status === "show" ? "ẩn" : "hiển thị",
    });
  }, [categories, token]);

  const confirmAction = useCallback(async () => {
    if (!showConfirmPopup || !token) return;
    const { id, name, action } = showConfirmPopup;

    try {
      const res = await fetch(
        `https://api-zeal.onrender.com/api/categories/${id}/toggle-visibility`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Không tìm thấy danh mục");
        }
        throw new Error(result.message || `Không thể ${action} danh mục "${name}"`);
      }
      if (result.warning) {
        setShowStockWarning(result.warning);
      }
      setCategories((prev) => prev.map((cat) => (cat._id === id ? result.category : cat)));
      await fetchProductCounts();
      showNotification(
        `Danh mục "${name}" đã được ${result.category.status === "show" ? "hiển thị" : "ẩn"} thành công!`,
        "success"
      );
    } catch (error: any) {
      console.error(`Error performing action ${action}:`, error);
      showNotification(error.message || `Không thể ${action} danh mục "${name}"`, "error");
    } finally {
      setShowConfirmPopup(null);
    }
  }, [showConfirmPopup, token, fetchProductCounts, router]);

  const handleEdit = useCallback((id: string) => {
    const category = categories.find((cat) => cat._id === id);
    if (category) {
      setEditingCategory(category);
    }
  }, [categories]);

  const handleUpdate = useCallback(
    async (id: string, updatedName: string) => {
      if (!token) {
        showNotification("Vui lòng đăng nhập để thực hiện thao tác này!", "error");
        router.push("/login");
        return;
      }
      if (!updatedName.trim()) {
        showNotification("Tên danh mục không được để trống!", "error");
        return;
      }
      try {
        const res = await fetch(`https://api-zeal.onrender.com/api/categories/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: updatedName }),
        });
        if (res.status === 401) {
          showNotification("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "error");
          localStorage.removeItem("token");
          setToken(null);
          router.push("/login");
          return;
        }
        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 400) {
            throw new Error("ID danh mục không hợp lệ hoặc tên không hợp lệ");
          }
          if (res.status === 404) {
            throw new Error("Không tìm thấy danh mục để cập nhật");
          }
          throw new Error(errorData.message || "Cập nhật thất bại");
        }
        const { category } = await res.json();
        setCategories((prev) => prev.map((cat) => (cat._id === id ? category : cat)));
        await fetchProductCounts();
        showNotification("Cập nhật danh mục thành công!", "success");
        setEditingCategory(null);
      } catch (error: any) {
        console.error("Error updating category:", error);
        showNotification(`Cập nhật thất bại: ${error.message}`, "error");
      }
    },
    [token, router, fetchProductCounts]
  );

  const filteredCategories = categories
    .filter((cat) => (statusFilter === "all" ? true : cat.status === statusFilter))
    .filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

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

  if (loading) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.processingIndicator}>
          <FontAwesomeIcon icon={faRedo} spin />
          <p>Đang tải danh sách danh mục...</p>
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
        <h1>Quản Lý Danh Mục</h1>
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
            aria-label="Tìm kiếm danh mục"
          />
          <select
            className={styles.categorySelect}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "all" | "show" | "hidden");
              setCurrentPage(1);
            }}
            aria-label="Lọc theo trạng thái"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="show">Hiển thị</option>
            <option value="hidden">Ẩn</option>
          </select>
          <Link href="/admin/add_category" className={styles.addProductBtn}>
            <FontAwesomeIcon icon={faPlus} />
          </Link>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.productTable}>
          <thead className={styles.productTableThead}>
            <tr>
              <th>Tên Danh Mục</th>
              <th>Số Sản Phẩm</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.emptyState}>
                  <h3>Không có danh mục</h3>
                  <p>Vui lòng thêm danh mục mới hoặc điều chỉnh bộ lọc/tìm kiếm.</p>
                </td>
              </tr>
            ) : (
              currentCategories.map((category) => (
                <tr key={category._id} className={styles.productRow}>
                  <td data-full-text={category.name}>
                    {editingCategory?._id === category._id ? (
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, name: e.target.value })
                        }
                        className={styles.searchInput}
                        aria-label="Chỉnh sửa tên danh mục"
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td>{productCounts[category._id] || 0}</td>
                  <td>
                    <span
                      className={`${category.status === "show" ? "text-green-600" : "text-red-600"}`}
                    >
                      {category.status === "show" ? "Hiển thị" : "Ẩn"}
                    </span>
                  </td>
                  <td className={styles.actionButtons}>
                    {editingCategory?._id === category._id ? (
                      <>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleUpdate(category._id, editingCategory.name)}
                          title="Lưu"
                          aria-label="Lưu thay đổi danh mục"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          className={styles.toggleStatusBtn}
                          onClick={() => setEditingCategory(null)}
                          title="Hủy"
                          aria-label="Hủy chỉnh sửa danh mục"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(category._id)}
                          title="Chỉnh sửa"
                          aria-label="Chỉnh sửa danh mục"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className={styles.toggleStatusBtn}
                          onClick={() => handleToggleVisibility(category._id)}
                          title={category.status === "show" ? "Ẩn danh mục" : "Hiển thị danh mục"}
                          aria-label={category.status === "show" ? "Ẩn danh mục" : "Hiển thị danh mục"}
                        >
                          <FontAwesomeIcon icon={category.status === "show" ? faEyeSlash : faEye} />
                        </button>
                      </>
                    )}
                  </td>
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
      {showConfirmPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Xác nhận</h2>
            <p>
              Bạn có chắc chắn muốn {showConfirmPopup.action} danh mục "{showConfirmPopup.name}" không?
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.confirmBtn}
                onClick={confirmAction}
                aria-label="Xác nhận hành động"
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowConfirmPopup(null)}
                aria-label="Hủy hành động"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        </div>
      )}
      {showStockWarning && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Cảnh báo</h2>
            <p>{showStockWarning}</p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowStockWarning(null)}
                aria-label="Đóng cảnh báo"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}