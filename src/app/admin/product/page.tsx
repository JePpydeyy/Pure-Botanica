"use client";
import { useEffect, useState } from "react";
import styles from "./product.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
  
interface Category {
  _id: string;
  name: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images?: string[];
  category?: Category;
  description?: string;
  ingredients?: string[];
  usage_instructions?: string[];
  special?: string[];
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const productsPerPage = 9;

  const router = useRouter();

  // Kiểm tra quyền admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  // Lấy danh sách sản phẩm và danh mục
  useEffect(() => {
    fetchProducts();
    fetchCategories();
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
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        router.push("/login");
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
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        router.push("/login");
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

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleting(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`https://api-zeal.onrender.com/api/products/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401 || response.status === 403) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi HTTP: ${response.status} - ${errorText}`);
      }

      setProducts(products.filter((product) => product._id !== deleteId));
      setIsDeleting(false);
      setDeleteId(null);
      showNotification("Xóa sản phẩm thành công", "success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      console.error("Lỗi khi xóa sản phẩm:", errorMessage);
      showNotification("Đã xảy ra lỗi khi xóa sản phẩm", "error");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}
      {loading && products.length > 0 && (
        <div className={styles.processingIndicator}>Đang xử lý...</div>
      )}
      <div className={styles.titleContainer}>
        <h1>SẢN PHẨM</h1>
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
              <th>Số lượng</th>
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
                  <td className={styles.actionButtons}>
                    <button
                      className={styles.editBtn}
                      onClick={() => router.push(`/admin/edit_product/${product._id}`)}
                      disabled={loading}
                    >
                      Sửa
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => confirmDelete(product._id)}
                      disabled={loading}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
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
          <button
            className={styles.pageLink}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`${styles.pageLink} ${
                currentPage === index + 1 ? styles.pageLinkActive : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
              disabled={loading}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={styles.pageLink}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Sau
          </button>
        </div>
      )}
      {isDeleting && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Xác nhận xóa sản phẩm</h2>
            <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
            <div className={styles.modalActions}>
              <button className={styles.confirmBtn} onClick={handleDelete}>
                Xóa
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsDeleting(false)}
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