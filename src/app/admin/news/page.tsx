"use client";

import React, { useEffect, useState } from "react";
import styles from "./news.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEdit,
  faTrash,
  faTimes,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  thumbnailCaption?: string;
  status: "show" | "hidden";
  views: number;
  publishedAt: string;
  slug: string;
}

const API_BASE_URL = "https://api-zeal.onrender.com";

const processContentImages = (content: string): string => {
  // Xử lý tất cả các src không bắt đầu bằng http hoặc https
  return content.replace(/src="([^"]+)"/g, (match, src) => {
    if (!src.startsWith("http://") && !src.startsWith("https://")) {
      return `src="${API_BASE_URL}/${src}"`;
    }
    return match;
  });
};

const AdminNewsPage: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "show" | "hidden">("all");
  const [sortOption, setSortOption] = useState<"mostViewed" | "leastViewed">("mostViewed");
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  const fetchNews = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token xác thực không tồn tại. Vui lòng đăng nhập lại!");
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/news`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
      const data: NewsItem[] = await res.json();
      setNewsList(data);
    } catch (err) {
      console.error("Lỗi khi tải tin tức:", err);
      alert("Đã xảy ra lỗi khi tải danh sách tin tức.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = newsList
    .filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      return item.title.toLowerCase().includes(searchTitle.toLowerCase());
    })
    .sort((a, b) => {
      if (sortOption === "mostViewed") return b.views - a.views;
      return a.views - b.views;
    });

  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= Math.ceil(filteredNews.length / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const fetchNewsDetails = async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
      const data: NewsItem = await res.json();
      // Đảm bảo thumbnailUrl là URL đầy đủ và thêm timestamp để tránh caching
      if (data.thumbnailUrl) {
        if (!data.thumbnailUrl.startsWith("http")) {
          data.thumbnailUrl = `${API_BASE_URL}/${data.thumbnailUrl}?t=${new Date().getTime()}`;
        } else {
          data.thumbnailUrl += `?t=${new Date().getTime()}`;
        }
      }
      setSelectedNews(data);
      setIsPopupOpen(true);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết bài viết:", err);
    }
  };

  const toggleVisibility = async (id: string, currentStatus: "show" | "hidden"): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/news/${id}/toggle-visibility`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Cập nhật trạng thái thất bại.");
      const newStatus = currentStatus === "show" ? "hidden" : "show";
      setNewsList((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      alert("Lỗi khi đổi trạng thái.");
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại.");
      setNewsList((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Lỗi khi xóa bài viết.");
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedNews(null);
    setImageError(null);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closePopup();
  };

  if (loading) return <p>Đang tải...</p>;

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
            {paginatedNews.map((news) => (
              <tr
                key={news._id}
                className={styles.productRow}
                onClick={() => fetchNewsDetails(news._id)}
              >
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
                <td onClick={(e) => e.stopPropagation()}>
                  <div className={styles.actionButtons}>
                    <Link href={`/admin/edit_new/${news.slug}`}>
                      <button className={styles.editBtn} title="Chỉnh sửa">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </Link>
                    <button
                      className={styles.toggleStatusBtn}
                      onClick={() => toggleVisibility(news._id, news.status)}
                    >
                      <FontAwesomeIcon icon={news.status === "show" ? faEyeSlash : faEye} />
                    </button>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => handleDelete(news._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedNews.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.errorContainer}>
                  Không có bài viết nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <div className={styles.paginationContainer}>
            <button
              className={styles.pageBtn}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span className={styles.pageIndicator}>
              {currentPage} / {Math.ceil(filteredNews.length / itemsPerPage)}
            </span>
            <button
              className={styles.pageBtn}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>

      {isPopupOpen && selectedNews && (
        <div className={styles.popupOverlay} onClick={handleOverlayClick}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closePopupBtn} onClick={closePopup}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className={styles.popupTitle}>{selectedNews.title}</h2>
            <div className={styles.popupDetails}>
              <p><strong>Trạng thái:</strong> {selectedNews.status}</p>
              <p><strong>Lượt xem:</strong> {selectedNews.views}</p>
              <p><strong>Ngày đăng:</strong> {new Date(selectedNews.publishedAt).toLocaleDateString("vi-VN")}</p>
              {selectedNews.thumbnailUrl && (
                <div className={styles.popupThumbnail}>
                  <img
                    src={selectedNews.thumbnailUrl}
                    alt={selectedNews.thumbnailCaption || selectedNews.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg";
                    }}
                  />
                </div>
              )}
              <div
                className={styles.popupContentBody}
                dangerouslySetInnerHTML={{
                  __html: processContentImages(selectedNews.content),
                }}
                onError={(e) => {
                  setImageError("Không thể tải hình ảnh trong nội dung.");
                  console.error("Image load error:", e);
                }}
              />
              {imageError && <p className={styles.errorContainer}>{imageError}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsPage;