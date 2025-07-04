
"use client";
import { useEffect, useState } from "react";
import styles from "./product.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import React from "react";

// Định nghĩa các giao diện TypeScript
interface Option {
  _id: string;
  value: string;
  price: number;
  stock: number;
  discount_price?: number;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  status: "show" | "hidden";
  view: number;
  id_brand: string;
  id_category: string;
  images: string[];
  short_description: string;
  description: string;
  option: Option[];
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  createdAt: string;
}

interface Brand {
  _id: string;
  name: string;
  status: "show" | "hidden";
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isTogglingStatus, setIsTogglingStatus] = useState<boolean>(false);
  const [toggleSlug, setToggleSlug] = useState<string | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "success" });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const productsPerPage = 9;

  const router = useRouter();

  // Chuẩn hóa URL hình ảnh
  const normalizeImageUrl = (path: string): string => {
    return path.startsWith("/images/")
      ? `https://api-zeal.onrender.com${path}`
      : `https://api-zeal.onrender.com/images/${path.replace(/^images\//, "")}`;
  };

  // Kiểm tra quyền admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/user/login");
    }
  }, [router]);

  // Lấy dữ liệu sản phẩm, danh mục và thương hiệu
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await fetch("https://api-zeal.onrender.com/api/products?status=all", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401 || res.status === 403) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        router.push("/user/login");
        return;
      }
      if (!res.ok) {
        throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
      }
      const data: Product[] = await res.json();
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
      const data: Category[] = await res.json();
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

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://api-zeal.onrender.com/api/brands", {
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
      const data: Brand[] = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu thương hiệu không hợp lệ");
      }
      setBrands(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      console.error("Lỗi khi tải thương hiệu:", errorMessage);
      showNotification("Không thể tải thương hiệu", "error");
    }
  };

  // Xử lý tìm kiếm và lọc theo danh mục và trạng thái
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.id_category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || product.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus, products]);

  const confirmToggleStatus = (slug: string) => {
    setToggleSlug(slug);
    setIsTogglingStatus(true);
  };

  const handleToggleStatus = async () => {
    if (!toggleSlug) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://api-zeal.onrender.com/api/products/${toggleSlug}/toggle-visibility`,
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

      const { product }: { product: Product } = await response.json();
      setProducts(
        products.map((p) => (p.slug === toggleSlug ? { ...p, status: product.status } : p))
      );
      setFilteredProducts(
        filteredProducts.map((p) =>
          p.slug === toggleSlug ? { ...p, status: product.status } : p
        )
      );
      setIsTogglingStatus(false);
      setToggleSlug(null);
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

  // Hàm xử lý nhấp để mở rộng/thu gọn chi tiết sản phẩm
  const handleToggleDetails = (productId: string) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setExpandedProductId(null); // Đóng tất cả chi tiết khi đổi trang
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
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="show">Hiển thị</option>
            <option value="hidden">Ẩn</option>
          </select>
          <Link href="/admin/add_product" className={styles.addProductBtn}>
            Thêm Sản Phẩm +
          </Link>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.productTable}>
          <thead className={styles.productTableThead}>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Brand</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <React.Fragment key={product._id}>
                  <tr
                    onClick={() => handleToggleDetails(product._id)}
                    className={`${styles.productRow} ${
                      expandedProductId === product._id ? styles.productRowActive : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <Image
                        src={
                          product.images && product.images.length > 0
                            ? normalizeImageUrl(product.images[0])
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
                    <td>{categories.find((cat) => cat._id === product.id_category)?.name || "Chưa phân loại"}</td>
                    <td>{brands.find((brand) => brand._id === product.id_brand)?.name || "Chưa phân loại"}</td>
                    <td>{product.status === "show" ? "Hiển thị" : "Ẩn"}</td>
                    <td className={styles.actionButtons}>
                      <button
                        className={styles.editBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/edit_product/${product.slug}`);
                        }}
                        disabled={loading}
                      >
                        Sửa
                      </button>
                      <button
                        className={styles.toggleStatusBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmToggleStatus(product.slug);
                        }}
                        disabled={loading}
                      >
                        {product.status === "show" ? "Ẩn" : "Hiển thị"}
                      </button>
                    </td>
                  </tr>
                  {expandedProductId === product._id && (
                    <tr className={styles.detailsRow}>
                      <td colSpan={6}>
                        <div className={styles.productDetails}>
                          <h3>Chi tiết sản phẩm</h3>
                          <p><strong>Tên sản phẩm:</strong> {product.name}</p>
                          <p><strong>Slug:</strong> {product.slug}</p>
                          <p><strong>Danh mục:</strong> {categories.find((cat) => cat._id === product.id_category)?.name || "Chưa phân loại"}</p>
                          <p><strong>Brand:</strong> {brands.find((brand) => brand._id === product.id_brand)?.name || "Chưa phân loại"}</p>
                          <p><strong>Mô tả ngắn:</strong> {product.short_description}</p>
                          <p><strong>Mô tả chi tiết:</strong></p>
                          <div dangerouslySetInnerHTML={{ __html: product.description }} />
                          <p><strong>Giá:</strong> {product.option[0]?.price.toLocaleString()}₫</p>
                          <p><strong>Giá khuyến mãi:</strong> {product.option[0]?.discount_price ? product.option[0].discount_price.toLocaleString() + "₫" : "Không có"}</p>
                          <p><strong>Tồn kho:</strong> {product.option[0]?.stock}</p>
                          <p><strong>Kích thước:</strong> {product.option[0]?.value}</p>
                          <p><strong>Trạng thái:</strong> {product.status === "show" ? "Hiển thị" : "Ẩn"}</p>
                          <p><strong>Lượt xem:</strong> {product.view}</p>
                          <p><strong>Ngày tạo:</strong> {new Date(product.createdAt).toLocaleString()}</p>
                          <p><strong>Ngày cập nhật:</strong> {new Date(product.updatedAt).toLocaleString()}</p>
                          <p><strong>Hình ảnh:</strong></p>
                          <div className={styles.imageGallery}>
                            {product.images.map((img, index) => (
                              <Image
                                key={index}
                                src={normalizeImageUrl(img)}
                                alt={`${product.name} hình ${index + 1}`}
                                width={100}
                                height={100}
                                className={styles.detailImage}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/images/placeholder.png";
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
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
              {products.find((p) => p.slug === toggleSlug)?.status === "show"
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