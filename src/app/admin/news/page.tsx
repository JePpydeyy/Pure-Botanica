"use client";

import React, { useEffect, useState } from "react";
import styles from "./news.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface NewsItem {
  _id: string;
  title: string;
  status: "show" | "hidden";
  views: number;
  publishedAt: string;
  slug: string;
}

const AdminNewsPage: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "show" | "hidden">("all");
  const [sortOption, setSortOption] = useState<"mostViewed" | "leastViewed">("mostViewed");
  const [searchTitle, setSearchTitle] = useState<string>("");

  const fetchNews = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token xác thực không tồn tại. Vui lòng đăng nhập lại!");
        return;
      }
      const res = await fetch("https://api-zeal.onrender.com/api/news", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Không thể tải danh sách tin tức");
      const data: NewsItem[] = await res.json();
      setNewsList(data);
    } catch (err) {
      console.error("Lỗi khi tải tin tức:", err);
      alert("Đã xảy ra lỗi khi tải danh sách tin tức. Vui lòng kiểm tra kết nối hoặc đăng nhập lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const toggleVisibility = async (idOrSlug: string, currentStatus: "show" | "hidden"): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token xác thực không tồn tại. Vui lòng đăng nhập lại!");
      return;
    }

    const newStatus = currentStatus === "show" ? "hidden" : "show";
    try {
      const res = await fetch(`https://api-zeal.onrender.com/api/news/${idOrSlug}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        throw new Error(`Yêu cầu thất bại với mã: ${res.status}`);
      }
      const updatedNews = await res.json();
      setNewsList((prev) =>
        prev.map((item) => (item._id === idOrSlug || item.slug === idOrSlug ? { ...item, status: newStatus } : item))
      );
      alert(`Cập nhật trạng thái thành công! Hiện tại: ${newStatus === "show" ? "Hiển thị" : "Ẩn"}`);
    } catch (err) {
      console.error("Lỗi khi thay đổi trạng thái:", err);
      if (err instanceof Error && err.message.includes("401")) {
        alert("Token xác thực không hợp lệ. Vui lòng đăng nhập lại!");
      } else {
        alert("Đã xảy ra lỗi khi thay đổi trạng thái.");
      }
    }
  };

  const handleDelete = async (idOrSlug: string): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token xác thực không tồn tại. Vui lòng đăng nhập lại!");
      return;
    }

    if (!confirm("Bạn có chắc chắn muốn xử lý bài viết này không?")) return;

    try {
      const newsRes = await fetch(`https://api-zeal.onrender.com/api/news/${idOrSlug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!newsRes.ok) throw new Error("Không thể lấy thông tin bài viết");
      const newsItem: NewsItem = await newsRes.json();

      if (newsItem.views > 0) {
        await toggleVisibility(idOrSlug, newsItem.status);
        alert("Bài viết đã được ẩn vì có lượt xem!");
      } else {
        const resDelete = await fetch(`https://api-zeal.onrender.com/api/news/${idOrSlug}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resDelete.ok) {
          setNewsList((prev) => prev.filter((item) => item._id !== idOrSlug && item.slug !== idOrSlug));
          alert("Xóa bài viết thành công!");
        } else {
          alert("Xóa bài viết thất bại!");
        }
      }
    } catch (err) {
      console.error("Lỗi khi xử lý bài viết:", err);
      if (err instanceof Error && err.message.includes("401")) {
        alert("Token xác thực không hợp lệ. Vui lòng đăng nhập lại!");
      } else {
        alert("Đã xảy ra lỗi khi xử lý bài viết.");
      }
    }
  };

  const filteredNews = newsList
    .filter((item: NewsItem) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      return item.title.toLowerCase().includes(searchTitle.toLowerCase());
    })
    .sort((a: NewsItem, b: NewsItem) => {
      if (sortOption === "mostViewed") return b.views - a.views;
      if (sortOption === "leastViewed") return a.views - b.views;
      return 0;
    });

  if (loading) {
    return <p className="text-center py-10">Đang tải danh sách tin tức...</p>;
  }

  return (
    <div className={styles.NewManagementContainer}>
      <div className={styles.titleContainer}>
        <h1>QUẢN LÝ TIN TỨC</h1>
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Tìm theo tiêu đề..."
            className={styles.searchInput}
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <select
            className={styles.categorySelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "show" | "hidden")}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="show">Hiển thị</option>
            <option value="hidden">Ẩn</option>
          </select>
          <select
            className={styles.categorySelect}
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as "mostViewed" | "leastViewed")}
          >
            <option value="mostViewed">Xem nhiều nhất</option>
            <option value="leastViewed">Xem ít nhất</option>
          </select>
          <Link href="/admin/add_news" className={styles.addProductBtn}>
            Thêm bài viết
          </Link>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.productTable}>
          <thead className={styles.productTableThead}>
            <tr>
              <th>Tiêu đề</th>
              <th>Trạng thái</th>
              <th>Lượt xem</th>
              <th>Ngày đăng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.map((news) => (
              <tr key={news._id} className={styles.productRow}>
                <td>{news.title}</td>
                <td>
                  <span className={news.status === "show" ? styles.statusShow : styles.statusHidden}>
                    {news.status === "show" ? "Hiển thị" : "Ẩn"}
                  </span>
                </td>
                <td>
                  <FontAwesomeIcon icon={faEye} /> {news.views}
                </td>
                <td>{new Date(news.publishedAt).toLocaleDateString("vi-VN")}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <Link href={`/admin/edit_news/${news.slug}`}>
                      <button className={styles.editBtn} title="Chỉnh sửa">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </Link>
                    <button
                      className={styles.toggleStatusBtn}
                      onClick={() => toggleVisibility(news._id, news.status)}
                      title={news.status === "show" ? "Ẩn bài viết" : "Hiển thị bài viết"}
                    >
                      <FontAwesomeIcon icon={news.status === "show" ? faEye : faEyeSlash} />
                    </button>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => handleDelete(news._id)}
                      title="Xóa hoặc ẩn bài viết"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredNews.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.errorContainer}>
                  Không có bài viết nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminNewsPage;