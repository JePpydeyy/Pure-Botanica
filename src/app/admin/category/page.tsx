"use client";
import { useEffect, useState } from "react";
import styles from "./category.module.css";
import type { Category } from "@/app/components/category_interface";

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api-zeal.onrender.com/api/categories");
        const data = await res.json();
        // Filter out hidden categories
        setCategories(data.filter((cat: Category) => !cat.isHidden));
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải danh sách danh mục:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xử lý danh mục này không?")) return;

    try {
      // Check if the category has products
      const resProducts = await fetch(`https://api-zeal.onrender.com/api/categories/${id}/products`);
      const products = await resProducts.json();

      if (products.length > 0) {
        // Hide the category instead of deleting
        const resHide = await fetch(`https://api-zeal.onrender.com/api/categories/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isHidden: true }),
        });

        if (resHide.ok) {
          setCategories((prev) => prev.filter((cat) => cat._id !== id));
          alert("Danh mục đã được ẩn vì có sản phẩm!");
        } else {
          alert("Ẩn danh mục thất bại!");
        }
      } else {
        // Delete the category if it has no products
        const resDelete = await fetch(`https://api-zeal.onrender.com/api/categories/${id}`, {
          method: "DELETE",
        });

        if (resDelete.ok) {
          setCategories((prev) => prev.filter((cat) => cat._id !== id));
          alert("Xóa danh mục thành công!");
        } else {
          alert("Xóa danh mục thất bại!");
        }
      }
    } catch (error) {
      console.error("Lỗi khi xử lý danh mục:", error);
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
    try {
      const res = await fetch(`https://api-zeal.onrender.com/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedName }),
      });

      if (res.ok) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === id ? { ...cat, name: updatedName } : cat
          )
        );
        setEditingCategory(null);
        alert("Cập nhật danh mục thành công!");
        window.location.reload();
      } else {
        alert("Cập nhật danh mục thất bại!");
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
          <span>Danh Mục Sản Phẩm</span>
        </div>
        <div className={styles.formBtnAddNewCategory}>
          <button className={styles.btnAddNewCategory}>
            <a href="/admin/add_category">Thêm danh mục sản phẩm</a>
          </button>
        </div>
        <table className={styles.categoryTable}>
          <thead>
            <tr>
              <th>Tên Danh Mục</th>
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
                <td className={styles.categoryTableTdLast}>
                  {editingCategory?._id === category._id ? (
                    <>
                      <button
                        className={styles.btnSave}
                        onClick={() =>
                          handleUpdate(category._id, editingCategory.name)
                        }
                      >
                        Lưu
                      </button>
                      <button
                        className={styles.btnCancel}
                        onClick={() => setEditingCategory(null)}
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={styles.btnEdit}
                        onClick={() => handleEdit(category._id)}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        className={styles.btnRemove}
                        onClick={() => handleDelete(category._id)}
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}