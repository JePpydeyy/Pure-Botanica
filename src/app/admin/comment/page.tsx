"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo, faReply } from "@fortawesome/free-solid-svg-icons";
import ToastNotification from "../../user/ToastNotification/ToastNotification";
import styles from "./comment.module.css";

// Interface definitions
interface User {
  _id: string;
  username: string;
  email: string;
  role?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface Reply {
  _id: string;
  content: string;
  createdAt: string;
  user: User | null;
}

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User | null;
  product: Product | null;
  rating: number;
  images: string[]; // Thêm trường images từ schema
  status: "show" | "hidden";
  adminReply?: Reply;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-zeal.onrender.com";
const TIMEOUT_DURATION = 10000;
const TOAST_DURATION = 3000;
const ERROR_IMAGE_URL = "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg";

// Hàm tiện ích: Lấy URL hình ảnh (tái sử dụng từ DetailPage)
const getImageUrl = (image: string): string => {
  if (!image || typeof image !== "string" || image.trim() === "") {
    console.warn("Invalid image URL detected, using fallback:", ERROR_IMAGE_URL);
    return ERROR_IMAGE_URL;
  }
  try {
    new URL(image);
    return image;
  } catch (e) {
    console.warn("Invalid URL format for image:", image, "using fallback:", ERROR_IMAGE_URL);
    return ERROR_IMAGE_URL;
  }
};

// Hàm giải mã token JWT (tái sử dụng từ DetailPage)
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Lỗi khi giải mã token:", error);
    return null;
  }
};

// Hook lấy thông tin người dùng (tái sử dụng từ DetailPage)
const useUserInfo = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUserId(decoded.id || decoded._id);
        setRole(decoded.role || "user");
      }
    }
    setLoading(false);
  }, []);

  return { userId, role, loading };
};

// Hook quản lý toast (tái sử dụng từ DetailPage)
const useToast = () => {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), TOAST_DURATION);
  };

  const hideToast = () => setMessage(null);

  return { message, showToast, hideToast };
};

// Hàm gọi API với timeout (tái sử dụng từ DetailPage)
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("token");

  const defaultHeaders: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Lỗi HTTP: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Yêu cầu bị timeout");
    }
    throw error;
  }
};

const CommentPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [adminReplyContent, setAdminReplyContent] = useState<string>("");
  const [submittingAdminReply, setSubmittingAdminReply] = useState<boolean>(false);
  const [cacheBuster, setCacheBuster] = useState<string>("");
  const commentsPerPage = 9;

  const router = useRouter();
  const { role, loading: userLoading } = useUserInfo();
  const { message, showToast, hideToast } = useToast();

  // Tạo cacheBuster để tránh cache hình ảnh
  useEffect(() => {
    setCacheBuster(`t=${Date.now()}`);
  }, []);

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!userLoading && role !== "admin") {
      showToast("error", "Bạn cần quyền admin để truy cập trang này.");
      router.push("/user/login");
    }
  }, [role, userLoading, router, showToast]);

  // Lấy danh sách bình luận
  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/api/comments");
      const sanitizedData = data
        .filter((comment: Comment) => comment.user && comment.product)
        .map((comment: Comment) => ({
          ...comment,
          user: comment.user ?? null,
          product: comment.product ?? null,
          images: Array.isArray(comment.images) ? comment.images : [],
          adminReply: comment.adminReply ?? undefined,
        }));
      setComments(sanitizedData);
      setFilteredComments(sanitizedData);
    } catch (error: any) {
      showToast("error", error.message || "Không thể tải danh sách bình luận.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      fetchComments();
    }
  }, [role]);

  // Lọc bình luận theo tìm kiếm
  useEffect(() => {
    const filtered = comments.filter((comment) => {
      const matchesSearch =
        (comment.content || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comment.user?.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comment.product?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    setFilteredComments(filtered);
    setCurrentPage(1);
    setSelectedCommentId(null);
    setShowReplyForm(null);
  }, [searchQuery, comments]);

  // Gửi phản hồi admin
  const submitAdminReply = async (commentId: string) => {
    if (!adminReplyContent.trim()) {
      showToast("error", "Vui lòng nhập nội dung phản hồi!");
      return;
    }
    if (role !== "admin") {
      showToast("error", "Bạn không có quyền gửi phản hồi admin!");
      return;
    }

    setSubmittingAdminReply(true);
    try {
      await apiRequest(`/api/comments/${commentId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: adminReplyContent.trim() }),
      });

      const updatedComments = await apiRequest("/api/comments");
      const sanitizedData = updatedComments
        .filter((comment: Comment) => comment.user && comment.product)
        .map((comment: Comment) => ({
          ...comment,
          user: comment.user ?? null,
          product: comment.product ?? null,
          images: Array.isArray(comment.images) ? comment.images : [],
          adminReply: comment.adminReply ?? undefined,
        }));
      setComments(sanitizedData);
      setFilteredComments(sanitizedData);
      setAdminReplyContent("");
      setShowReplyForm(null);
      showToast("success", "Phản hồi đã được gửi!");
    } catch (error: any) {
      showToast("error", error.message || "Lỗi khi gửi phản hồi admin!");
    } finally {
      setSubmittingAdminReply(false);
    }
  };

  // Toggle hiển thị chi tiết
  const handleToggleDetails = (commentId: string) => {
    setSelectedCommentId(selectedCommentId === commentId ? null : commentId);
    setShowReplyForm(null);
    setAdminReplyContent("");
  };

  // Toggle form trả lời
  const toggleReplyForm = (commentId: string) => {
    setShowReplyForm((prev) => (prev === commentId ? null : commentId));
    setAdminReplyContent("");
  };

  const normalizeImageUrl = (path: string): string => {
    return getImageUrl(path);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating: number | undefined): JSX.Element => {
    const stars = rating ? Math.min(Math.max(rating, 0), 5) : 0;
    return (
      <>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <span key={i} style={{ color: i < stars ? "#ffa500" : "#ccc" }}>
              ★
            </span>
          ))}
      </>
    );
  };

  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(indexOfFirstComment, indexOfLastComment);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedCommentId(null);
      setShowReplyForm(null);
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

  return (
    <div className={styles.commentManagementContainer}>
      <Head>
        <title>Quản Lý Bình Luận</title>
      </Head>
      {message && (
        <ToastNotification message={message.text} type={message.type} onClose={hideToast} />
      )}
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
              <th>Số sao</th>
              <th>Ngày đánh giá</th>
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
                          comment.product?.images?.length
                            ? normalizeImageUrl(comment.product.images[0])
                            : ERROR_IMAGE_URL
                        }
                        alt={comment.product?.name || "Sản phẩm"}
                        width={48}
                        height={48}
                        className={styles.commentTableImage}
                        onError={(e) => {
                          console.log(`Product image load failed, switched to 404 fallback`);
                          (e.target as HTMLImageElement).src = ERROR_IMAGE_URL;
                        }}
                      />
                    </td>
                    <td>
                      {comment.user?.username && comment.user?.email
                        ? `${comment.user.username} (${comment.user.email})`
                        : "Người dùng không tồn tại"}
                    </td>
                    <td>{comment.product?.name || "Sản phẩm không tồn tại"}</td>
                    <td>{comment.content}</td>
                    <td>{renderStars(comment.rating)}</td>
                    <td>{formatDate(comment.createdAt)}</td>
                  </tr>
                  {selectedCommentId === comment._id && (
                    <tr className={styles.detailsRow}>
                      <td colSpan={6}>
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
                                  <strong>Email:</strong>{" "}
                                  {comment.user?.email || "Không có"}
                                </p>
                              </div>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Nội dung bình luận</h4>
                              <p>{comment.content}</p>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Số sao</h4>
                              <p>{renderStars(comment.rating)} ({comment.rating || 0}/5)</p>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Thông tin sản phẩm</h4>
                              <div className={styles.detailsGrid}>
                                <p>
                                  <strong>Tên sản phẩm:</strong>{" "}
                                  {comment.product?.name || "Không có"}
                                </p>
                              </div>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Hình ảnh đánh giá</h4>
                              {comment.images && comment.images.length > 0 ? (
                                <div className={styles.commentImages}>
                                  {comment.images.map((image, imgIndex) => (
                                    <Image
                                      key={`comment-img-${imgIndex}`}
                                      src={`${getImageUrl(image)}?${cacheBuster}`}
                                      alt={`Comment image ${imgIndex + 1}`}
                                      width={100}
                                      height={100}
                                      className={styles.commentImg}
                                      onError={(e) => {
                                        console.log(`Comment image ${imgIndex + 1} load failed, switched to 404 fallback`);
                                        (e.target as HTMLImageElement).src = ERROR_IMAGE_URL;
                                      }}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <p>Không có hình ảnh.</p>
                              )}
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Ngày đánh giá</h4>
                              <p>{formatDate(comment.createdAt)}</p>
                            </div>
                            <div className={styles.detailsSection}>
                              <h4>Phản hồi</h4>
                              {comment.adminReply ? (
                                <div className={styles.adminReply}>
                                  <p>
                                    <strong>Admin:</strong> {comment.adminReply.content}
                                  </p>
                                  <p>{formatDate(comment.adminReply.createdAt)}</p>
                                </div>
                              ) : (
                                <>
                                  <button
                                    className={styles.replyButton}
                                    onClick={() => toggleReplyForm(comment._id)}
                                    disabled={submittingAdminReply}
                                  >
                                    <FontAwesomeIcon icon={faReply} /> Trả lời
                                  </button>
                                  {showReplyForm === comment._id && (
                                    <div className={styles.adminReplyForm}>
                                      <textarea
                                        value={adminReplyContent}
                                        onChange={(e) => setAdminReplyContent(e.target.value)}
                                        placeholder="Nhập phản hồi của bạn..."
                                        rows={2}
                                        maxLength={500}
                                        disabled={submittingAdminReply}
                                        className={styles.replyInput}
                                      />
                                      <div className={styles.formButtons}>
                                        <button
                                          onClick={() => submitAdminReply(comment._id)}
                                          disabled={submittingAdminReply || !adminReplyContent.trim()}
                                          className={styles.replyButton}
                                        >
                                          {submittingAdminReply ? "Đang gửi..." : "Gửi phản hồi"}
                                        </button>
                                        <button
                                          onClick={() => toggleReplyForm(comment._id)}
                                          disabled={submittingAdminReply}
                                          className={styles.cancelButton}
                                        >
                                          Hủy
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
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
                    >
                      1
                    </button>
                    <div
                      className={styles.ellipsis}
                      onClick={() => handlePageChange(Math.max(1, currentPage - 3))}
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
                  >
                    {page}
                  </button>
                ))}
                {showNextEllipsis && (
                  <>
                    <div
                      className={styles.ellipsis}
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 3))}
                    >
                      ...
                    </div>
                    <button
                      className={`${styles.pageLink} ${styles.firstLastPage}`}
                      onClick={() => handlePageChange(totalPages)}
                      disabled={loading}
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
    </div>
  );
};

export default CommentPage;