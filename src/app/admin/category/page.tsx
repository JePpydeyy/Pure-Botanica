"use client";
import { useEffect, useState } from "react";
import styles from "./category.module.css";
import type { Category } from "@/app/components/category_interface";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faEyeSlash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api-zeal.onrender.com/api/categories");
        if (!res.ok) throw new Error(`Không thể tải danh mục: ${res.status}`);
        const data = await res.json();
        console.log("Danh mục tải được:", data);
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải danh sách danh mục:", error);
        setLoading(false);
        alert("Đã xảy ra lỗi khi tải danh sách danh mục.");
      }
    };

    fetchCategories();
  }, []);

  const checkCategoryStock = async (categoryId: string) => {
    try {
      console.log(`Kiểm tra stock cho danh mục ${categoryId}`);
      const res = await fetch(
        `https://api-zeal.onrender.com/api/products?id_category=${categoryId}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Không thể kiểm tra sản phẩm: ${res.status}`);
      }
      const products = await res.json();
      console.log(`Sản phẩm trả về cho danh mục ${categoryId}:`, products);

      if (!products || !Array.isArray(products) || products.length === 0) {
        console.log(`Không có sản phẩm trong danh mục ${categoryId}`);
        return false;
      }

      const hasStock = products.some((product: any) => {
        if (!product.option || !Array.isArray(product.option) || product.option.length === 0) {
          console.log(`Sản phẩm ${product._id} không có option hoặc option rỗng`);
          return false;
        }
        const hasStockInOptions = product.option.some((opt: any) => {
          const stock = opt.stock || 0;
          console.log(`Sản phẩm ${product._id}, option ${opt._id}: stock = ${stock}`);
          return stock > 0;
        });
        return hasStockInOptions;
      });

      console.log(`Kết quả kiểm tra stock cho danh mục ${categoryId}: ${hasStock ? "Có stock" : "Không có stock"}`);
      return hasStock;
    } catch (error) {
      console.error(`Lỗi khi kiểm tra stock cho danh mục ${categoryId}:`, error);
      setShowWarning("Lỗi khi kiểm tra tồn kho sản phẩm. Vui lòng thử lại.");
      return false;
    }
  };

  const handleToggleVisibility = async (id: string) => {
    if (!token) {
      alert("Vui lòng đăng nhập để thực hiện thao tác này!");
      return;
    }

    const category = categories.find((cat) => cat._id === id);
    if (!category) {
      console.error(`Không tìm thấy danh mục với ID ${id}`);
      alert("Không tìm thấy danh mục!");
      return;
    }

    if (category.status === "show") {
      setShowWarning(null);
      const hasStock = await checkCategoryStock(id);
      if (hasStock) {
        setShowWarning("Sản phẩm còn tồn kho, bạn không được ẩn");
        return;
      }
    }

    if (!confirm("Bạn có chắc chắn muốn ẩn/hiển thị danh mục này không?")) return;

    try {
      console.log(`Gửi yêu cầu toggle-visibility cho danh mục ${id}`);
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

      if (res.ok) {
        const { category } = await res.json();
        console.log(`Danh mục ${id} đã được cập nhật:`, category);
        setCategories((prev) =>
          prev.map((cat) => (cat._id === id ? category : cat))
        );
        alert(`Danh mục đã được ${category.status === "show" ? "hiển thị" : "ẩn"}!`);
      } else {
        const { message } = await res.json();
        console.error(`Thao tác thất bại cho danh mục ${id}: ${message}`);
        alert(`Thao tác thất bại: ${message}`);
      }
    } catch (error) {
      console.error(`Lỗi khi xử lý danh mục ${id}:`, error);
      alert("Đã xảy ra lỗi khi xử lý danh mục.");
    }
  };

  const handleEdit = (id: string) => {
    const category = categories.find((cat) => cat._id === id);
    if (category) {
      setEditingCategory(category);
    }
  };

  const handleUpdate = async (id: string, updatedName: string) => {
    if (!token) {
      alert("Vui lòng đăng nhập để thực hiện thao tác này!");
      return;
    }

    if (!updatedName.trim()) {
      alert("Tên danh mục không được để trống!");
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

      if (res.ok) {
        const { category } = await res.json();
        setCategories((prev) =>
          prev.map((cat) => (cat._id === id ? category : cat))
        );
        setEditingCategory(null);
        alert("Cập nhật danh mục thành công!");
      } else {
        const { message } = await res.json();
        alert(`Cập nhật thất bại: ${message}`);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      alert("Đã xảy ra lỗi khi cập nhật danh mục.");
    }
  };

  if (loading) {
    return <p className="text-center py-10">Đang tải danh sách danh mục...</p>;
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
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                      className={styles.editInput}
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
                        onClick={() =>
                          handleUpdate(category._id, editingCategory.name)
                        }
                        title="Lưu"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        className={styles.btnCancel}
                        onClick={() => setEditingCategory(null)}
                        title="Hủy"
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
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className={styles.btnRemove}
                        onClick={() => handleToggleVisibility(category._id)}
                        title={category.status === "show" ? "Ẩn danh mục" : "Hiển thị danh mục"}
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
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}