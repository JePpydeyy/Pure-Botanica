"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

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
        toast.success("Thêm danh mục thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        router.push("/admin/category");
      } else {
        if (res.status === 401) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(data.message || "Thêm danh mục thất bại!", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      toast.error("Đã xảy ra lỗi khi thêm danh mục.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containerCategory}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className={styles.titleContainer}>
        <h1>Thêm Danh Mục</h1>
        <form onSubmit={handleSubmit} className={styles.addCategoryForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Tên Danh Mục</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Nhập tên danh mục"
                className={`${styles.searchInput} ${loading ? styles.inputDisabled : ""}`}
                disabled={loading}
              />
              <div className={styles.formButtons}>
                <button
                  type="submit"
                  className={`${styles.btnAdd} ${loading ? styles.btnDisabled : ""}`}
                  disabled={loading}
                  title="Thêm danh mục"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => router.push("/admin/category")}
                  disabled={loading}
                  title="Hủy"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}