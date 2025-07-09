"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./AddCategory.module.css";

interface ApiResponse {
  message: string;
  category?: {
    _id: string;
    name: string;
    status: "show" | "hidden";
    createdAt: string;
  };
}

export default function AddCategory() {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Retrieve token from localStorage (or your auth mechanism)
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://api-zeal.onrender.com/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data: ApiResponse = await res.json();

      if (res.ok) {
        alert("Thêm danh mục thành công!");
        router.push("/admin/category");
      } else {
        if (res.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          // Optionally redirect to login page
          // router.push("/login");
        } else {
          setError(data.message || "Thêm danh mục thất bại!");
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      setError("Đã xảy ra lỗi khi thêm danh mục.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containerCategory}>
      <h1 className={styles.title}>Thêm Danh Mục</h1>
      <form onSubmit={handleSubmit} className={styles.addCategoryForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Tên Danh Mục</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nhập tên danh mục"
            className={error ? styles.inputError : ""}
            disabled={loading}
          />
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
        <div className={styles.formButtons}>
          <button
            type="submit"
            className={`${styles.btnAdd} ${loading ? styles.btnDisabled : ""}`}
            disabled={loading}
          >
            {loading ? "Đang thêm..." : "Thêm Danh Mục"}
          </button>
          <button
            type="button"
            className={styles.btnCancel}
            onClick={() => router.push("/admin/category")}
            disabled={loading}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}