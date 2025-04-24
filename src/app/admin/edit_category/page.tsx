"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./edit_category.css";

export default function EditCategory() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        const res = await fetch(`https://api-zeal.onrender.com/api/categories/${id}`);
        if (!res.ok) throw new Error("Không tìm thấy danh mục");
        const data = await res.json();
        setName(data.name);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3002/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        router.push("/admin/category");
      } else {
        setError("Cập nhật thất bại");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi gửi yêu cầu");
    }
  };

  if (loading) return <p className="edit-loading">Đang tải danh mục...</p>;
  if (error) return <p className="edit-error">{error}</p>;

  return (
    <div className="edit-container">
      <h2 className="edit-title">Chỉnh sửa danh mục</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <label htmlFor="name">Tên danh mục</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="edit-actions">
          <button type="submit" className="btn-save">Lưu</button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => router.push("/admin/category")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
