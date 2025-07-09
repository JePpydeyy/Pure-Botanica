"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./comment.module.css";
import Image from "next/image";
import Head from "next/head";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface Comment {
  _id: string;
  content: string;
  status: "show" | "hidden";
  createdAt: string;
  updatedAt: string;
  user: User | null;
  product: Product | null;
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error";
}

const CommentPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "success" });
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isTogglingStatus, setIsTogglingStatus] = useState<boolean>(false);
  const [toggleCommentId, setToggleCommentId] = useState<string | null>(null);
  const [toggleMessage, setToggleMessage] = useState<string>("");
  const commentsPerPage = 9;
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

  // Lấy danh sách bình luận
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const res = await fetch("https://api-zeal.onrender.com/api/comments", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (res.status === 401 || res.status === 403) {
          alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          router.push("/user/login");
          return;
        }

        if (!res.ok) {
          throw new Error(`Lỗi HTTP! Trạng thái: ${res.status}`);
        }

        const data: Comment[] = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu bình luận không hợp lệ");
        }
        setComments(data);
        setFilteredComments(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
        console.error("Lỗi khi tải bình luận:", errorMessage);
        setError("Không thể tải danh sách bình luận. Vui lòng thử lại sau.");
        setNotification({ show: true, message: "Không thể tải danh sách bình luận", type: "error" });
        setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [router]);

  // Xử lý tìm kiếm và lọc
  useEffect(() => {
    const filtered = comments.filter((comment) => {
      const matchesSearch =
        comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comment.user?.username && comment.user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (comment.product?.name && comment.product.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = selectedStatus === "all" || comment.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredComments(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, comments]);

  // Cập nhật trạng thái bình luận
  const confirmToggleStatus = (commentId: string) => {
    const comment = comments.find((c) => c._id === commentId);
    if (comment) {
      setToggleMessage(
        comment.status === "show"
          ? "Bạn có chắc chắn muốn ẩn bình luận này?"
          : "Bạn có chắc chắn muốn hiển thị bình luận này?"
      );
      setToggleCommentId(commentId);
      setIsTogglingStatus(true);
    }
  };

  const handleToggleStatus = async () => {
    if (!toggleCommentId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const comment = comments.find((c) => c._id === toggleCommentId);
      const newStatus = comment?.status === "show" ? "hidden" : "show";

      const res = await fetch(`https://api-zeal.onrender.com/api/comments/toggle-visibility/${toggleCommentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401 || res.status === 403) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/user/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Lỗi HTTP! Trạng thái: ${res.status}`);
      }

      const updatedComment = await res.json();
      setComments(comments.map((c) =>
        c._id === toggleCommentId ? { ...c, status: updatedComment.comment.status } : c
      ));
      setFilteredComments(filteredComments.map((c) =>
        c._id === toggleCommentId ? { ...c, status: updatedComment.comment.status } : c
      ));
      setNotification({
        show: true,
        message: `Bình luận đã được ${newStatus === "show" ? "hiển thị" : "ẩn"}`,
        type: "success",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      console.error("Lỗi khi cập nhật trạng thái:", errorMessage);
      setNotification({
        show: true,
        message: "Không thể cập nhật trạng thái bình luận",
        type: "error",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
    } finally {
      setIsTogglingStatus(false);
      setToggleCommentId(null);
      setToggleMessage("");
      setLoading(false);
    }
  };

  // Xử lý mở rộng/thu gọn chi tiết bình luận
  const handleToggleDetails = (commentId: string) => {
    setSelectedCommentId(selectedCommentId === commentId ? null : commentId);
  };

  // Phân trang
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(indexOfFirstComment, indexOfLastComment);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  if (loading && comments.length === 0) {
    return (
      <div className={styles.productManagementContainer}>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Đang tải danh sách bình luận...</p>
        </div>
      </div>
    );
  }

  if (error && comments.length === 0) {
    return (
      <div className={styles.productManagementContainer}>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productManagementContainer}>
      <Head>
        <title>Quản Lý Bình Luận</title>
      </Head>
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}
      {loading && comments.length > 0 && (
        <div className={styles.processingIndicator}>Đang xử lý...</div>
      )}
      <div className={styles.titleContainer}>
        <h1>QUẢN LÝ BÌNH LUẬN</h1>
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm theo nội dung, người dùng, sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="show">Hiển thị</option>
            <option value="hidden">Ẩn</option>
          </select>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.productTable}>
          <thead className={styles.productTableThead}>
            <tr>
              <th>Hình ảnh sản phẩm</th>
              <th>Người dùng</th>
              <th>Sản phẩm</th>
              <th>Nội dung</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentComments.length > 0 ? (
              currentComments.map((comment) => (
                <React.Fragment key={comment._id}>
                  <tr
                    onClick={() => handleToggleDetails(comment._id)}
                    className={`${styles.productRow} ${
                      selectedCommentId === comment._id ? styles.productRowActive : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <Image
                        src={
                          comment.product?.images && comment.product.images.length > 0
                            ? normalizeImageUrl(comment.product.images[0])
                            : "/images/placeholder.png"
                        }
                        alt={comment.product?.name || "Sản phẩm"}
                        width={50}
                        height={50}
                        className={styles.productTableImage}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/placeholder.png";
                        }}
                      />
                    </td>
                    <td>{comment.user ? `${comment.user.username} (${comment.user.email})` : "Người dùng không tồn tại"}</td>
                    <td>{comment.product?.name || "Sản phẩm không tồn tại"}</td>
                    <td>{comment.content}</td>
                    <td>{comment.status === "show" ? "Hiển thị" : "Ẩn"}</td>
                    <td className={styles.actionButtons}>
                      <button
                        className={styles.toggleStatusBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmToggleStatus(comment._id);
                        }}
                        disabled={loading}
                        title={comment.status === "show" ? "Ẩn bình luận" : "Hiển thị bình luận"}
                      >
                        <FontAwesomeIcon icon={comment.status === "show" ? faEyeSlash : faEye} />
                      </button>
                    </td>
                  </tr>
                  {selectedCommentId === comment._id && (
                    <tr className={styles.detailsRow}>
                      <td colSpan={6}>
                        <div className={styles.productDetails}>
                          <h3>Chi tiết bình luận</h3>
                          <div className={styles.detailsContainer}>
                            <div className={styles.detailsSection}>
                              <h4>Thông tin người dùng</h4>
                              <div className={styles.detailsGrid}>
                                <p><strong>Tên người dùng:</strong> {comment.user?.username || "Không có"}</p>
                                <p><strong>Email:</strong> {comment.user?.email || "Không có"}</p>
                              </div>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Thông tin sản phẩm</h4>
                              <div className={styles.detailsGrid}>
                                <p><strong>Tên sản phẩm:</strong> {comment.product?.name || "Không có"}</p>
                                <p><strong>Giá sản phẩm:</strong> {comment.product?.price ? comment.product.price.toLocaleString("vi-VN") + " VNĐ" : "Không có"}</p>
                              </div>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Nội dung bình luận</h4>
                              <div className={styles.descriptionContent}>{comment.content}</div>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Trạng thái và thời gian</h4>
                              <div className={styles.detailsGrid}>
                                <p><strong>Trạng thái:</strong> {comment.status === "show" ? "Hiển thị" : "Ẩn"}</p>
                                <p><strong>Ngày tạo:</strong> {comment.createdAt ? new Date(comment.createdAt).toLocaleString("vi-VN") : "Không có"}</p>
                                <p><strong>Ngày cập nhật:</strong> {comment.updatedAt ? new Date(comment.updatedAt).toLocaleString("vi-VN") : "Không có"}</p>
                              </div>
                            </div>
                            {comment.product?.images && comment.product.images.length > 0 && (
                              <div className={styles.detailsSection}>
                                <h4>Hình ảnh sản phẩm</h4>
                                <div className={styles.imageGallery}>
                                  {comment.product.images.map((img, index) => (
                                    <Image
                                      key={index}
                                      src={normalizeImageUrl(img)}
                                      alt={`Hình ${index + 1}`}
                                      width={120}
                                      height={120}
                                      className={styles.detailImage}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/images/placeholder.png";
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  <h3>Không có bình luận</h3>
                  <p>Chưa có bình luận nào phù hợp với bộ lọc.</p>
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
            <p>{toggleMessage}</p>
            <div className={styles.modalActions}>
              <button className={styles.confirmBtn} onClick={handleToggleStatus}>
                Xác nhận
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setIsTogglingStatus(false);
                  setToggleCommentId(null);
                  setToggleMessage("");
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentPage;