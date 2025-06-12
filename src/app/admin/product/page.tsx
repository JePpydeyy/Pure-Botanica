"use client";
import { useEffect, useState } from "react";
import styles from "./product.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { Product } from "@/app/components/product_interface";
import { Category } from "@/app/components/category_interface";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [toggleId, setToggleId] = useState<string | null>(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const productsPerPage = 9;

  const router = useRouter();

  // Check admin privileges
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/user/login");
    }
  }, [router]);

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await fetch("https://api-zeal.onrender.com/api/products", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401 || res.status === 403) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        router.push("/user/login");
        return;
      }
      if (!res.ok) {
        throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu sản phẩm không hợp lệ");
      }
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      console.error("Lỗi khi tải danh sách sản phẩm:", errorMessage);
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      showNotification("Không thể tải danh sách sản phẩm", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://api-zeal.onrender.com/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401 || res.status === 403) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        router.push("/user/login");
        return;
      }
      if (!res.ok) {
        throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu danh mục không hợp lệ");
      }
      setCategories(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      console.error("Lỗi khi tải danh mục:", errorMessage);
      showNotification("Không thể tải danh mục", "error");
    }
  };

  // Handle search and category filter
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category && product.category.name
          ? product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
          : false);
      const matchesCategory =
        selectedCategory === "all" || product.category?._id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, products]);

  const confirmToggleStatus = (id: string, currentStatus: string) => {
    setToggleId(id);
    setIsTogglingStatus(true);
  };

  const handleToggleStatus = async () => {
    if (!toggleId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://api-zeal.onrender.com/api/products/${toggleId}/toggle-visibility`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 401 || response.status === 403) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        router.push("/user/login");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi HTTP: ${response.status} - ${errorText}`);
      }

      const { product } = await response.json();
      setProducts(
        products.map((p) => (p._id === toggleId ? { ...p, status: product.status } : p))
      );
      setFilteredProducts(
        filteredProducts.map((p) =>
          p._id === toggleId ? { ...p, status: product.status } : p
        )
      );
      setIsTogglingStatus(false);
      setToggleId(null);
      showNotification(
        `Sản phẩm đã được ${product.status === "show" ? "hiển thị" : "ẩn"}`,
        "success"
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      console.error("Lỗi khi thay đổi trạng thái sản phẩm:", errorMessage);
      showNotification("Đã xảy ra lỗi khi thay đổi trạng thái sản phẩm", "error");
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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

  if (loading && products.length === 0) {
    return <p className="text-center py-10">Đang tải danh sách sản phẩm...</p>;
  }

  if (error && products.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button className={styles.retryButton} onClick={fetchProducts}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className={styles.productManagementContainer}>
      <Head>
        <title>Quản Lý Sản Phẩm</title>
      </Head>
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}
      {loading && products.length > 0 && (
        <div className={styles.processingIndicator}>Đang xử lý...</div>
      )}
      <div className={styles.titleContainer}>
        <h1>QUẢN LÝ SẢN PHẨM</h1>
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm hoặc danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <Link href="/admin/add_product" className={styles.addProductBtn}>
          Thêm Sản Phẩm +
        </Link>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.productTable}>
          <thead className={styles.productTableThead}>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn Kho</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <Image
                      src={
                        product.images && product.images.length > 0
                          ? `https://api-zeal.onrender.com/images/${product.images[0]}`
                          : "/images/placeholder.png"
                      }
                      alt={product.name}
                      width={50}
                      height={50}
                      className={styles.productTableImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/placeholder.png";
                      }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category?.name || "Chưa phân loại"}</td>
                  <td>{product.price.toLocaleString()}₫</td>
                  <td className={styles.productTableQuantity}>{product.stock}</td>
                  <td>{product.status === "show" ? "Hiển thị" : "Ẩn"}</td>
                  <td className={styles.actionButtons}>
                    <button
                      className={styles.editBtn}
                      onClick={() => router.push(`/admin/edit_product/${product._id}`)}
                      disabled={loading}
                    >
                      Sửa
                    </button>
                    <button
                      className={styles.toggleStatusBtn}
                      onClick={() => confirmToggleStatus(product._id, product.status || "show")}
                      disabled={loading}
                    >
                      {product.status === "show" ? "Ẩn" : "Hiển thị"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Không có sản phẩm nào
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
                    className={`${styles.pageLink} ${
                      currentPage === page ? styles.pageLinkActive : ""
                    }`}
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
      {isTogglingStatus && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Xác nhận thay đổi trạng thái</h2>
            <p>
              Bạn có chắc chắn muốn{" "}
              {products.find((p) => p._id === toggleId)?.status === "show"
                ? "ẩn"
                : "hiển thị"}{" "}
              sản phẩm này?
            </p>
            <div className={styles.modalActions}>
              <button className={styles.confirmBtn} onClick={handleToggleStatus}>
                Xác nhận
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsTogglingStatus(false)}
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