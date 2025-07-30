"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./comment.module.css";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck, faTimes, faRedo } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const CommentPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isTogglingStatus, setIsTogglingStatus] = useState<boolean>(false);
  const [toggleCommentId, setToggleCommentId] = useState<string | null>(null);
  const [toggleMessage, setToggleMessage] = useState<string>("");
  const commentsPerPage = 9; // Match product.tsx
  const router = useRouter();

  const normalizeImageUrl = (path: string): string => {
    if (path.startsWith("http")) return path;
    return `https://api-zeal.onrender.com${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Check admin access
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      toast.error("Bạn cần quyền admin để truy cập trang này.", {
        className: styles.customToast,
        bodyClassName: styles.customToastBody,
      });
      router.push("/user/login");
    }
  }, [router]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        }

        const res = await fetch("https://api-zeal.onrender.com/api/comments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (res.status === 401 || res.status === 403) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!", {
            className: styles.customToast,
            bodyClassName: styles.customToastBody,
          });
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          router.push("/user/login");
          return;
        }

        if (!res.ok) {
          throw new Error(`Lỗi khi tải danh sách bình luận: ${res.status}`);
        }

        const data: Comment[] = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu bình luận không hợp lệ");
        }
        setComments(data);
        setFilteredComments(data);
      } catch (error: any) {
        const errorMessage = error.message || "Không thể tải danh sách bình luận.";
        toast.error(errorMessage, {
          className: styles.customToast,
          bodyClassName: styles.customToastBody,
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [router]);

  // Filter comments
  useEffect(() => {
    const filtered = comments.filter((comment) => {
      const matchesSearch =
        comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comment.user?.username &&
          comment.user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (comment.product?.name &&
          comment.product.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = selectedStatus === "all" || comment.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredComments(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, comments]);

  const confirmToggleStatus = (commentId: string) => {
    const comment = comments.find((c) => c._id === commentId);
    if (comment) {
      setToggleMessage(
        comment.status === "show"
          ? `Bạn có chắc chắn muốn ẩn bình luận này?`
          : `Bạn có chắc chắn muốn hiển thị bình luận này?`
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
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }

      const comment = comments.find((c) => c._id === toggleCommentId);
      const newStatus = comment?.status === "show" ? "hidden" : "show";

      const res = await fetch(
        `https://api-zeal.onrender.com/api/comments/toggle-visibility/${toggleCommentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!", {
          className: styles.customToast,
          bodyClassName: styles.customToastBody,
        });
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/user/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Lỗi ${res.status}` }));
        throw new Error(errorData.message);
      }

      const updatedComment = await res.json();
      setComments(
        comments.map((c) =>
          c._id === toggleCommentId ? { ...c, status: updatedComment.comment.status } : c
        )
      );
      setFilteredComments(
        filteredComments.map((c) =>
          c._id === toggleCommentId ? { ...c, status: updatedComment.comment.status } : c
        )
      );
      toast.success(`Bình luận đã được ${newStatus === "show" ? "hiển thị" : "ẩn"}`, {
        className: styles.customToast,
        bodyClassName: styles.customToastBody,
      });
    } catch (error: any) {
      toast.error(`Không thể cập nhật trạng thái bình luận: ${error.message}`, {
        className: styles.customToast,
        bodyClassName: styles.customToastBody,
      });
    } finally {
      setIsTogglingStatus(false);
      setToggleCommentId(null);
      setToggleMessage("");
      setLoading(false);
    }
  };

  const handleToggleDetails = (commentId: string) => {
    setSelectedCommentId(selectedCommentId === commentId ? null : commentId);
  };

  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(indexOfFirstComment, indexOfLastComment);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedCommentId(null);
    }
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
      <div className={styles.errorContainer}>
        <div className={styles.processingIndicator}>
          <FontAwesomeIcon icon={faRedo} spin />
          <p>Đang tải danh sách bình luận...</p>
        </div>
      </div>
    );
  }

  if (error && comments.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button
          className={styles.retryButton}
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchComments();
          }}
          title="Thử lại"
        >
          <FontAwesomeIcon icon={faRedo} />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.commentManagementContainer}>
      <Head>
        <title>Quản Lý Bình Luận</title>
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName={styles.customToast}
        bodyClassName={styles.customToastBody}
      />
      {loading && comments.length > 0 && (
        <div className={styles.processingIndicator}>
          <FontAwesomeIcon icon={faRedo} spin /> Đang xử lý...
        </div>
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
            aria-label="Tìm kiếm bình luận"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.categorySelect}
            aria-label="Lọc theo trạng thái bình luận"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="show">Hiển thị</option>
            <option value="hidden">Ẩn</option>
          </select>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.commentTable}>
          <thead className={styles.commentTableThead}>
            <tr>
              <th>Hình ảnh</th>
              <th>Người dùng</th>
              <th>Sản phẩm</th>
              <th>Nội dung</th>
              <th>Ngày bình luận</th>
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
                    className={`${styles.commentRow} ${
                      selectedCommentId === comment._id ? styles.commentRowActive : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <img
                        src={
                          comment.product?.images && comment.product.images.length > 0
                            ? normalizeImageUrl(comment.product.images[0])
                            : "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg"
                        }
                        alt={comment.product?.name || "Sản phẩm"}
                        width={48}
                        height={48}
                        className={styles.commentTableImage}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg";
                        }}
                      />
                    </td>
                    <td>
                      {comment.user
                        ? `${comment.user.username} (${comment.user.email})`
                        : "Người dùng không tồn tại"}
                    </td>
                    <td>{comment.product?.name || "Sản phẩm không tồn tại"}</td>
                    <td>{comment.content}</td>
                    <td>{formatDate(comment.createdAt)}</td>
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
                        aria-label={comment.status === "show" ? "Ẩn bình luận" : "Hiển thị bình luận"}
                      >
                        <FontAwesomeIcon icon={comment.status === "show" ? faEyeSlash : faEye} />
                      </button>
                    </td>
                  </tr>
                  {selectedCommentId === comment._id && (
                    <tr className={styles.detailsRow}>
                      <td colSpan={7}>
                        <div className={styles.commentDetails}>
                          <h3>Chi tiết bình luận</h3>
                          <div className={styles.detailsContainer}>
                            <div className={styles.detailsSection}>
                              <h4>Thông tin người dùng</h4>
                              <div className={styles.detailsGrid}>
                                <p>
                                  <strong>Tên người dùng:</strong>{" "}
                                  {comment.user?.username || "Không có"}
                                </p>
                                <p>
                                  <strong>Email:</strong> {comment.user?.email || "Không có"}
                                </p>
                              </div>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Nội dung bình luận</h4>
                              <p>{comment.content}</p>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Thông tin sản phẩm</h4>
                              <div className={styles.detailsGrid}>
                                <p>
                                  <strong>Tên sản phẩm:</strong>{" "}
                                  {comment.product?.name || "Không có"}
                                </p>
                                <p>
                                  <strong>Giá:</strong>{" "}
                                  {comment.product?.price
                                    ? comment.product.price.toLocaleString() + "₫"
                                    : "Không có"}
                                </p>
                              </div>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Ngày bình luận</h4>
                              <p>{formatDate(comment.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
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
              <button
                className={styles.confirmBtn}
                onClick={handleToggleStatus}
                title="Xác nhận"
                aria-label="Xác nhận thay đổi trạng thái"
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setIsTogglingStatus(false);
                  setToggleCommentId(null);
                  setToggleMessage("");
                }}
                title="Hủy"
                aria-label="Hủy thay đổi trạng thái"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentPage;