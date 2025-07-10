"use client";
import { useEffect, useState, useCallback } from "react";
import styles from "./category.module.css";
import type { Category } from "@/app/components/category_interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faEyeSlash, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  name: string;
  status: string;
  active: boolean;
  option?: { value: string; stock: number }[];
}

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState<{ id: string; name: string; action: "ẩn" | "hiển thị" } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Token:", storedToken); // Debug
    setToken(storedToken);

    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api-zeal.onrender.com/api/categories", {
          headers: {
            "Content-Type": "application/json",
            ...(storedToken && { Authorization: `Bearer ${storedToken}` }),
          },
        });
        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          throw new Error(`Không thể tải danh mục: ${res.status}`);
        }
        const data: Category[] = await res.json();
        console.log("Categories fetched:", data); // Debug
        setCategories(data);
      } catch (error: any) {
        toast.error(error.message || "Đã xảy ra lỗi khi tải danh sách danh mục.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [router]);

  const checkCategoryCanHide = useCallback(async (categoryId: string): Promise<boolean> => {
    if (!token) {
      toast.error("Vui lòng đăng nhập lại!");
      router.push("/login");
      return false;
    }
    try {
      console.log(`Fetching products for category ${categoryId}`); // Debug
      const res = await fetch(
        `https://api-zeal.onrender.com/api/products?id_category=${categoryId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Products API response for category ${categoryId}:`, {
        status: res.status,
        ok: res.ok,
      }); // Debug
      if (res.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        setToken(null);
        router.push("/login");
        return false;
      }
      if (!res.ok) {
        console.log(`No products found for category ${categoryId} (status: ${res.status})`); // Debug
        return true; // Danh mục rỗng hoặc lỗi, cho phép ẩn
      }
      const products = await res.json();
      console.log(`Products for category ${categoryId}:`, products); // Debug
      if (!Array.isArray(products)) {
        console.error(`Invalid products response for category ${categoryId}:`, products);
        toast.error("Dữ liệu sản phẩm không hợp lệ.");
        return true; // Cho phép ẩn nếu dữ liệu không hợp lệ
      }
      if (products.length === 0) {
        console.log(`Category ${categoryId} is empty, allowing hide`); // Debug
        return true; // Danh mục rỗng, cho phép ẩn
      }
      // Kiểm tra stock nếu có sản phẩm
      const hasStock = products.some((product: Product) =>
        product.option?.some((opt) => opt.stock > 0)
      );
      if (hasStock) {
        console.log(`Category ${categoryId} has products with stock > 0`); // Debug
        setShowWarning("Không thể ẩn danh mục vì vẫn còn sản phẩm có tồn kho. Vui lòng giảm tồn kho về 0 trước.");
        return false;
      }
      console.log(`Category ${categoryId} has products but no stock > 0, allowing hide`); // Debug
      return true;
    } catch (error: any) {
      console.error(`Error checking products for category ${categoryId}:`, error); // Debug
      toast.error(error.message || "Lỗi khi kiểm tra sản phẩm.");
      return true; // Cho phép ẩn trong trường hợp lỗi bất ngờ
    }
  }, [token, router]);

  const handleToggleVisibility = useCallback(async (id: string) => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này!");
      router.push("/login");
      return;
    }
    const category = categories.find((cat) => cat._id === id);
    if (!category) {
      toast.error("Không tìm thấy danh mục!");
      return;
    }
    if (category.status === "show") {
      setShowWarning(null);
      const canHide = await checkCategoryCanHide(id);
      if (!canHide) return;
    }
    setShowConfirmPopup({
      id,
      name: category.name,
      action: category.status === "show" ? "ẩn" : "hiển thị",
    });
  }, [categories, token, checkCategoryCanHide]);

  const confirmToggleVisibility = useCallback(async () => {
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
      if (res.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        setToken(null);
        router.push("/login");
        return;
      }
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Lỗi ${res.status}` }));
        throw new Error(errorData.message);
      }
      const result = await res.json();
      setCategories((prev) => prev.map((cat) => (cat._id === id ? result.category : cat)));
      toast.success(`Danh mục "${name}" đã được ${result.category.status === "show" ? "hiển thị" : "ẩn"} thành công!`);
    } catch (error: any) {
      toast.error(`Không thể ${action} danh mục "${name}": ${error.message}`);
    } finally {
      setShowConfirmPopup(null);
    }
  }, [showConfirmPopup, token, router]);

  const handleEdit = useCallback((id: string) => {
    const category = categories.find((cat) => cat._id === id);
    if (category) {
      setEditingCategory(category);
    }
  }, [categories]);

  const handleUpdate = useCallback(async (id: string, updatedName: string) => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này!");
      router.push("/login");
      return;
    }
    if (!updatedName.trim()) {
      toast.error("Tên danh mục không được để trống!");
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
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        setToken(null);
        router.push("/login");
        return;
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Cập nhật thất bại");
      }
      const { category } = await res.json();
      setCategories((prev) => prev.map((cat) => (cat._id === id ? category : cat)));
      setEditingCategory(null);
      toast.success("Cập nhật danh mục thành công!");
    } catch (error: any) {
      toast.error(`Cập nhật thất bại: ${error.message}`);
    }
  }, [token, router]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className={styles.spinner}></div>
        <p>Đang tải danh sách danh mục...</p>
      </div>
    );
  }

  return (
    <div className={styles.containerCategory}>
      <div className={styles.formTableCategory}>
        <div className={styles.nameTableCategory}>
          <span className={styles.span}>Danh Mục</span>
          <div className={styles.formBtnAddNewCategory}>
            <Link href="/admin/add_category" className={styles.btnAddNewCategory}>
              Thêm danh mục
            </Link>
          </div>
        </div>

        <table className={styles.categoryTable}>
          <thead>
            <tr className={styles.categoryTableTr}>
              <th>Tên Danh Mục</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>
                  {editingCategory?._id === category._id ? (
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, name: e.target.value })
                      }
                      className={styles.editInput}
                      aria-label="Chỉnh sửa tên danh mục"
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td>{category.status === "show" ? "Hiển thị" : "Ẩn"}</td>
                <td className={styles.categoryTableTdLast}>
                  {editingCategory?._id === category._id ? (
                    <>
                      <button
                        className={styles.btnSave}
                        onClick={() => handleUpdate(category._id, editingCategory.name)}
                        title="Lưu"
                        aria-label="Lưu thay đổi danh mục"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        className={styles.btnCancel}
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
                        className={styles.btnEdit}
                        onClick={() => handleEdit(category._id)}
                        title="Chỉnh sửa"
                        aria-label="Chỉnh sửa danh mục"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className={styles.btnRemove}
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
            ))}
          </tbody>
        </table>
      </div>

      {showWarning && (
        <div className={styles.warningPopup}>
          <div className={styles.warningContent}>
            <h3>Cảnh báo</h3>
            <p>{showWarning}</p>
            <button
              className={styles.btnCloseWarning}
              onClick={() => setShowWarning(null)}
              aria-label="Đóng cảnh báo"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showConfirmPopup && (
        <div className={styles.warningPopup}>
          <div className={styles.warningContent}>
            <h3>Xác nhận</h3>
            <p>
              Bạn có chắc chắn muốn {showConfirmPopup.action} danh mục "{showConfirmPopup.name}" không?
            </p>
            <div className={styles.confirmButtons}>
              <button
                className={styles.btnSave}
                onClick={confirmToggleVisibility}
                aria-label="Xác nhận hành động"
              >
                Xác nhận
              </button>
              <button
                className={styles.btnCancel}
                onClick={() => setShowConfirmPopup(null)}
                aria-label="Hủy hành động"
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