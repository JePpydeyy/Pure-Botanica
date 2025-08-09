"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./Detail.module.css";
import Image from "next/image";
import ToastNotification from "../../ToastNotification/ToastNotification";
import { Product } from "@/app/components/product_interface";
import { Comment } from "@/app/components/comment_interface";

// Biến môi trường
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-zeal.onrender.com";
const ERROR_IMAGE_URL = "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg";

// Hằng số
const TIMEOUT_DURATION = 10000;
const MIN_COMMENT_LENGTH = 3;
const TOAST_DURATION = 3000;
const REVIEW_WINDOW_DAYS = 7; // Thời gian cho phép đánh giá (ngày)

// Hàm tiện ích: Định dạng giá tiền
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

// Hàm tiện ích: Lấy URL hình ảnh
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

// Hàm tiện ích: Giải mã token JWT
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

// Hook tùy chỉnh: Lấy thông tin người dùng từ token
const useUserInfo = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("Người dùng");
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        const userIdFromToken = decoded.id || decoded._id;
        const usernameFromToken = decoded.username || "Người dùng";
        const roleFromToken = decoded.role || null;
        if (userIdFromToken) {
          setUserId(userIdFromToken);
          setUsername(usernameFromToken);
          setRole(roleFromToken);
        }
      }
    }
    setLoading(false);
  }, []);

  return { userId, username, role, loading };
};

// Hook tùy chỉnh: Quản lý thông báo toast
const useToast = () => {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), TOAST_DURATION);
  }, []);

  const hideToast = useCallback(() => setMessage(null), []);

  return { message, showToast, hideToast };
};

// Hàm API: Gửi yêu cầu đến API với xử lý timeout
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const defaultHeaders = {
    "Content-Type": "application/json",
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
      throw new Error(errorData.error || `Lỗi HTTP: ${response.status}`);
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

export default function DetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const identifier = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);
  const [cacheBuster, setCacheBuster] = useState("");
  const [filterRating, setFilterRating] = useState<number | "all">("all");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [replyContent, setReplyContent] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [userReplyContent, setUserReplyContent] = useState<string>("");
  const [replyingToReplyIndex, setReplyingToReplyIndex] = useState<number | null>(null);
  const [canReview, setCanReview] = useState<boolean>(false);

  const { userId, username, role, loading: userLoading } = useUserInfo();
  const { message: cartMessage, showToast: showCartToast, hideToast: hideCartToast } = useToast();
  const { message: commentMessage, showToast: showCommentToast, hideToast: hideCommentToast } = useToast();

  // Tạo cacheBuster sau khi hydration
  useEffect(() => {
    setCacheBuster(`t=${Date.now()}`);
  }, []);

  // Đặt lại số lượng khi thay đổi tùy chọn
  useEffect(() => {
    setQuantity(1);
  }, [selectedOptionIndex]);

  // Kiểm tra điều kiện đánh giá

  // Lấy thông tin sản phẩm và danh sách yêu thích
  useEffect(() => {
    const fetchProduct = async () => {
      if (!identifier) {
        setLoading(false);
        setProduct(null);
        showCartToast("error", "Identifier sản phẩm không hợp lệ!");
        return;
      }

      try {
        setLoading(true);
        const data = await apiRequest(`/api/products/${identifier}`);
        setProduct(data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setProduct(null);
        if (error instanceof Error && error.message.includes("400")) {
          showCartToast("error", "Identifier không hợp lệ!");
        } else if (error instanceof Error && error.message.includes("404")) {
          showCartToast("error", "Không tìm thấy sản phẩm!");
        } else {
          showCartToast("error", "Lỗi khi lấy thông tin sản phẩm!");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchFavoriteProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token || !product?._id) {
        setFavoriteProducts([]);
        setIsFavorite(false);
        localStorage.removeItem("favoriteProducts");
        return;
      }

      try {
        const data = await apiRequest("/api/users/favorite-products");
        const productIds = data.favoriteProducts.map((item: any) => item._id);
        setFavoriteProducts(productIds);
        setIsFavorite(productIds.includes(product._id));
        localStorage.setItem("favoriteProducts", JSON.stringify(productIds));
      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
        const savedFavorites = localStorage.getItem("favoriteProducts");
        if (savedFavorites) {
          const productIds = JSON.parse(savedFavorites);
          setFavoriteProducts(productIds);
          setIsFavorite(productIds.includes(product._id));
        } else {
          setFavoriteProducts([]);
          setIsFavorite(false);
        }
      }
    };

    fetchProduct();
    if (product?._id) {
      fetchFavoriteProducts();
    }
  }, [identifier, product?._id, showCartToast]);

  // Lấy danh sách bình luận
  useEffect(() => {
    const fetchComments = async () => {
      if (!product?._id) {
        console.log("Product ID is undefined or null");
        setComments([]);
        return;
      }
      console.log("Fetching comments for productId:", product._id);
      try {
        const data = await apiRequest(`/api/comments/product/${product._id}`);
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
        setComments([]);
        showCommentToast("error", "Không thể tải bình luận, vui lòng thử lại sau!");
      }
    };
    fetchComments();
  }, [product?._id, showCommentToast]);

  // Tăng số lượng sản phẩm
  const increaseQty = useCallback(() => setQuantity((prev) => prev + 1), []);

  // Giảm số lượng sản phẩm
  const decreaseQty = useCallback(() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1)), []);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = useCallback(async () => {
    if (!product || !product.option.length || !product.option[selectedOptionIndex]) return;

    const selectedOption = product.option[selectedOptionIndex];
    if (selectedOption.stock < quantity) {
      showCartToast("error", "Số lượng vượt quá tồn kho!");
      return;
    }

    if (!userId) {
      try {
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItemIndex = cartItems.findIndex(
          (item: any) => item.id === product._id && item.optionId === selectedOption._id
        );

        if (existingItemIndex !== -1) {
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          cartItems.push({
            id: product._id,
            name: product.name,
            optionId: selectedOption._id,
            price: selectedOption.discount_price || selectedOption.price,
            image: product.images?.[0] || "",
            quantity,
          });
        }

        localStorage.setItem("cart", JSON.stringify(cartItems));
        showCartToast("success", "Đã thêm vào giỏ hàng!");
      } catch (error) {
        showCartToast("error", "Lỗi khi thêm vào giỏ hàng local");
      }
      return;
    }

    setAddingToCart(true);
    try {
      await apiRequest("/api/carts/add", {
        method: "POST",
        body: JSON.stringify({
          userId,
          productId: product._id,
          optionIds: [selectedOption._id],
          quantity,
        }),
      });

      showCartToast("success", "Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      showCartToast("error", `Lỗi: ${error instanceof Error ? error.message : "Không thể thêm vào giỏ hàng"}`);
    } finally {
      setAddingToCart(false);
    }
  }, [product, selectedOptionIndex, quantity, userId, showCartToast]);

  // Thêm hoặc xóa sản phẩm khỏi danh sách yêu thích
  const addToWishlist = useCallback(async () => {
    if (!product?._id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      showCartToast("error", "Vui lòng đăng nhập để sử dụng chức năng này!");
      return;
    }

    try {
      if (isFavorite) {
        const response = await apiRequest(`/api/users/favorite-products/${product._id}`, {
          method: "DELETE",
        });
        const updatedFavorites = favoriteProducts.filter((id) => id !== product._id);
        setFavoriteProducts(updatedFavorites);
        setIsFavorite(false);
        localStorage.setItem("favoriteProducts", JSON.stringify(updatedFavorites));
        showCartToast("success", response.message || "Đã xóa khỏi danh sách yêu thích!");
      } else {
        const response = await apiRequest("/api/users/favorite-products", {
          method: "POST",
          body: JSON.stringify({ productId: product._id }),
        });
        const updatedFavorites = [...favoriteProducts, product._id];
        setFavoriteProducts(updatedFavorites);
        setIsFavorite(true);
        localStorage.setItem("favoriteProducts", JSON.stringify(updatedFavorites));
        showCartToast("success", response.message || "Đã thêm vào danh sách yêu thích!");
      }
    } catch (error) {
      console.error("Lỗi khi quản lý danh sách yêu thích:", error);
      if (error instanceof Error && error.message.includes("401")) {
        showCartToast("error", "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        setTimeout(() => router.push("/user/login"), TOAST_DURATION);
      } else if (error instanceof Error && error.message.includes("400")) {
        showCartToast("error", "ProductId không hợp lệ!");
      } else if (error instanceof Error && error.message.includes("404")) {
        showCartToast("error", "Không tìm thấy người dùng!");
      } else if (error instanceof Error && error.message.includes("500")) {
        showCartToast("error", "Lỗi server. Vui lòng thử lại sau!");
      } else {
        showCartToast("error", "Lỗi khi cập nhật danh sách yêu thích!");
      }
    }
  }, [product?._id, isFavorite, favoriteProducts, showCartToast, router]);

  // Gửi bình luận cho sản phẩm
  const submitComment = useCallback(async () => {
    if (!product?._id || !newComment.trim() || newComment.length < MIN_COMMENT_LENGTH || rating === 0) {
      showCommentToast("error", "Vui lòng nhập đánh giá và chọn số sao (ít nhất 1 sao)!");
      return;
    }
    if (userLoading) {
      showCommentToast("error", "Đang tải thông tin người dùng, vui lòng đợi!");
      return;
    }
    if (!userId) {
      showCommentToast("error", "Vui lòng đăng nhập để gửi bình luận!");
      setTimeout(() => router.push("/user/login"), TOAST_DURATION);
      return;
    }

    setSubmittingComment(true);
    try {
      // Lấy danh sách đơn hàng của người dùng
      const orders = await apiRequest(`/api/orders/user/${userId}`);
      if (!Array.isArray(orders) || orders.length === 0) {
        throw new Error("Bạn chưa có đơn hàng nào!");
      }

      // Lấy danh sách bình luận của sản phẩm
      const existingComments = await apiRequest(`/api/comments/product/${product._id}`);
      const commentedOrderIds = existingComments
        .filter((comment: Comment) => comment.userId === userId && comment.orderId)
        .map((comment: Comment) => comment.orderId);

      // Kiểm tra đơn hàng hợp lệ chưa được bình luận
      const currentDate = new Date();
      const eligibleOrder = orders.find((order: any) => {
        if (
          order.paymentStatus !== "completed" ||
          order.shippingStatus !== "delivered" ||
          commentedOrderIds.includes(order._id)
        ) {
          return false;
        }

        const orderDate = new Date(order.createdAt);
        const daysDiff = (currentDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff > REVIEW_WINDOW_DAYS) {
          return false;
        }

        return order.items.some((item: any) => item.product._id === product._id);
      });

      if (!eligibleOrder) {
        throw new Error("Bạn chỉ có thể đánh giá sản phẩm sau khi mua, thanh toán và nhận hàng trong vòng 7 ngày!");
      }

      // Gửi bình luận với orderId
      const response = await apiRequest("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          userId,
          productId: product._id,
          orderId: eligibleOrder._id,
          content: newComment.trim(),
          rating,
        }),
      });

      const updatedComments = await apiRequest(`/api/comments/product/${product._id}`);
      setComments(Array.isArray(updatedComments) ? updatedComments : []);

      setNewComment("");
      setRating(0);
      showCommentToast("success", "Đánh giá đã được gửi!");
      setCanReview(false); // Ẩn nút sau khi gửi bình luận
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      showCommentToast("error", error instanceof Error ? error.message : "Lỗi khi gửi đánh giá!");
    } finally {
      setSubmittingComment(false);
    }
  }, [product?._id, newComment, rating, userId, userLoading, showCommentToast, router]);

  // Gửi phản hồi từ admin
  const submitReply = useCallback(async (commentId: string) => {
    if (!commentId || !replyContent.trim() || !userId || role !== "admin") {
      showCommentToast("error", "Bạn không có quyền hoặc nội dung phản hồi trống!");
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await apiRequest(`/api/comments/${commentId}/reply`, {
        method: "POST",
        body: JSON.stringify({ content: replyContent.trim() }),
      });

      const updatedComments = await apiRequest(`/api/comments/product/${product?._id}`);
      setComments(Array.isArray(updatedComments) ? updatedComments : []);

      setReplyContent("");
      setReplyingTo(null);
      showCommentToast("success", "Phản hồi đã được gửi!");
    } catch (error) {
      console.error("Lỗi khi gửi phản hồi:", error);
      showCommentToast("error", `Lỗi khi gửi phản hồi: ${error instanceof Error ? error.message : "Không xác định"}`);
    } finally {
      setSubmittingComment(false);
    }
  }, [replyContent, userId, role, product?._id, showCommentToast]);

  // Gửi phản hồi từ user (phản hồi lại admin)
  const submitUserReply = useCallback(async (commentId: string, replyIndex: number) => {
    if (!commentId || !userReplyContent.trim() || !userId || replyIndex === null || replyIndex < 0) {
      showCommentToast("error", "Thông tin không hợp lệ hoặc nội dung phản hồi trống!");
      return;
    }

    const comment = comments.find((c) => c._id === commentId);
    if (!comment || !comment.replies || replyIndex >= comment.replies.length) {
      showCommentToast("error", "Phản hồi không tồn tại hoặc chỉ số không hợp lệ!");
      return;
    }

    if (comment.user?._id !== userId) {
      showCommentToast("error", "Chỉ người tạo bình luận gốc được phép trả lời!");
      return;
    }

    setSubmittingComment(true);
    try {
      console.log("Submitting reply-to-reply with payload:", {
        content: userReplyContent.trim(),
        replyIndex,
        userId,
        commentId,
      });

      const response = await apiRequest(`/api/comments/${commentId}/reply-to-reply`, {
        method: "POST",
        body: JSON.stringify({
          content: userReplyContent.trim(),
          replyIndex,
        }),
      });

      const updatedComments = await apiRequest(`/api/comments/product/${product?._id}`);
      setComments(Array.isArray(updatedComments) ? updatedComments : []);

      setUserReplyContent("");
      showCommentToast("success", "Phản hồi của bạn đã được gửi!");
    } catch (error) {
      console.error("Lỗi khi gửi phản hồi từ user:", error);
      let errorMessage = "Không xác định";
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          errorMessage = errorData.error || error.message;
        } catch {
          errorMessage = error.message;
        }
      }
      showCommentToast("error", `Lỗi khi gửi phản hồi: ${errorMessage}`);
    } finally {
      setSubmittingComment(false);
    }
  }, [userReplyContent, userId, replyingToReplyIndex, product?._id, comments, showCommentToast]);

  const averageRating = useMemo(() => {
    if (comments.length === 0) return 0;
    const total = comments.reduce((sum, comment) => sum + (comment.rating || 0), 0);
    return Number((total / comments.length).toFixed(1));
  }, [comments]);

  // Tính số lượng đánh giá cho mỗi mức sao
  const ratingCounts = useMemo(() => {
    return [5, 4, 3, 2, 1].reduce((acc, star) => {
      acc[star] = comments.filter((c) => c.rating === star).length;
      return acc;
    }, {} as Record<number, number>);
  }, [comments]);

  // Lọc bình luận theo trạng thái và quyền người dùng
  const filteredComments = useMemo(() => {
    return comments
      .filter((comment) => role === "admin" || comment.status === "show")
      .filter((comment) => filterRating === "all" || comment.rating === filterRating);
  }, [comments, filterRating, role]);

  // Logic cuộn khi load trang với hash
  useEffect(() => {
    if (window.location.hash === "#writeReviewForm") {
      const form = document.getElementById("writeReviewForm");
      if (form) {
        form.classList.add(styles.active); // Mở form
        form.scrollIntoView({ behavior: "smooth", block: "start" }); // Cuộn mượt đến đầu form
      }
    }
  }, []);

  // Trạng thái loading và lỗi
  if (loading) return <p className="text-center py-10">Đang tải chi tiết sản phẩm...</p>;
  if (!product) return <p className="text-center py-10">Không tìm thấy sản phẩm.</p>;

  const selectedOption = product.option[selectedOptionIndex] || product.option[0];
  const isOutOfStock = !selectedOption?.stock || selectedOption.stock < quantity;

  return (
    <>
      <div className={styles.container}>
        <section className={styles["product-section"]}>
          <div className={styles["product-thumbnails"]}>
            {product.images?.map((image, index) => (
              <div
                key={`thumbnail-${index}`}
                className={`${styles.thumbnail} ${index === currentImageIndex ? styles.active : ""}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={`${getImageUrl(image)}?${cacheBuster}`}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  quality={100}
                  className={styles.thumbnailImg}
                  onError={(e) => {
                    console.log(`Thumbnail ${index + 1} for ${product.name} load failed, switched to 404 fallback`);
                    (e.target as HTMLImageElement).src = ERROR_IMAGE_URL;
                  }}
                />
              </div>
            ))}
          </div>

          <div className={styles["product-image-container"]}>
            <div className={styles["product-main-image"]}>
              <Image
                src={
                  product.images?.[currentImageIndex]
                    ? `${getImageUrl(product.images[currentImageIndex])}?${cacheBuster}`
                    : ERROR_IMAGE_URL
                }
                alt={product.name}
                width={300}
                height={200}
                quality={100}
                className={styles["mainImg"]}
                onError={(e) => {
                  console.log(`Main image for ${product.name} load failed, switched to 404 fallback`);
                  (e.target as HTMLImageElement).src = ERROR_IMAGE_URL;
                }}
              />
            </div>
            <div className={styles["product-dots"]}>
              {product.images?.map((_, index) => (
                <div
                  key={`dot-${index}`}
                  className={`${styles.dot} ${index === currentImageIndex ? styles.active : ""}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className={styles["product-info"]}>
            <h1 className={styles["product-title"]}>{product.name}</h1>

            {selectedOption && (
              <p className={styles["product-price"]}>
                {selectedOption.discount_price ? (
                  <>
                    <span className={styles["discount-price"]}>
                      {formatPrice(selectedOption.discount_price)}
                    </span>
                    <span className={styles["original-price"]}>
                      {formatPrice(selectedOption.price)}
                    </span>
                    <span className={styles["discount-percent"]}>
                      {`-${Math.round(
                        ((selectedOption.price - selectedOption.discount_price) / selectedOption.price) * 100
                      )}%`}
                    </span>
                  </>
                ) : (
                  <>{formatPrice(selectedOption.price)}</>
                )}
              </p>
            )}

            {product.option.length > 0 && (
              <div style={{ margin: "16px 0" }}>
                <span style={{ fontWeight: 500 }}>Lựa chọn dung tích:</span>
                <div style={{ display: "flex", gap: 12, margin: "12px 0" }}>
                  {product.option.map((opt, idx) => (
                    <button
                      key={opt._id}
                      type="button"
                      className={idx === selectedOptionIndex ? styles["option-button-selected"] : styles["option-button"]}
                      onClick={() => setSelectedOptionIndex(idx)}
                      disabled={!opt.stock}
                    >
                      {opt.value} {opt.stock <= 0 && "(Hết hàng)"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p
              className={styles["product-description"]}
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />

            <div className={styles["quantity-controls"]}>
              <div className={styles["quantity-wrapper"]}>
                <button
                  className={`${styles["quantity-btn"]} ${styles.decrease}`}
                  onClick={decreaseQty}
                  aria-label="Giảm số lượng"
                >
                  −
                </button>
                <input
                  type="number"
                  className={styles["quantity-input"]}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  aria-label="Số lượng sản phẩm"
                />
                <button
                  className={`${styles["quantity-btn"]} ${styles.increase}`}
                  onClick={increaseQty}
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>
              <button
                className={styles["add-to-cart"]}
                onClick={addToCart}
                disabled={addingToCart || isOutOfStock}
                aria-label="Thêm sản phẩm vào giỏ hàng"
              >
                {addingToCart
                  ? "Đang thêm..."
                  : isOutOfStock
                  ? "Hết hàng"
                  : "Thêm vào giỏ hàng"}
              </button>
            </div>

            <div style={{ marginTop: "10px" }}>
              <button
                className={styles["wishlist-button"]}
                onClick={addToWishlist}
                disabled={addingToCart}
                aria-label={isFavorite ? "Đã nằm trong danh sách yêu thích" : "Thêm vào danh sách yêu thích của bạn"}
              >
                <i
                  className={`fas fa-heart ${isFavorite ? styles.favorited : styles.notFavorited}`}
                  style={{ color: isFavorite ? "#ff0000" : "#000000" }}
                ></i>
                <span style={{ marginLeft: "8px" }}>
                  {isFavorite ? "Đã nằm trong danh sách yêu thích" : "Thêm vào danh sách yêu thích của bạn"}
                </span>
              </button>
            </div>

            {cartMessage && (
              <ToastNotification
                message={cartMessage.text}
                type={cartMessage.type}
                onClose={hideCartToast}
              />
            )}
          </div>
        </section>

        <div className={styles["product-info"]}>
          <h2 className={styles["product-info-title"]}>Thông tin sản phẩm:</h2>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>

      <div id="reviewForm" className={styles.cr}>
        <div className={styles["customer-review"]}>
          <h1 className={styles["review-main-title"]}>ĐÁNH GIÁ TỪ KHÁCH HÀNG ĐÃ MUA</h1>

          <div className={styles["rating-overview"]}>
            <div className={styles["rating-summary"]}>
              <div className={styles["average-rating"]}>{averageRating}</div>
              <div className={styles["stars-display"]}>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span
                      key={i}
                      className={`${styles["star-display"]} ${i < Math.floor(averageRating) ? styles["star-filled"] : i < averageRating ? styles["star-half"] : styles["star-empty"]}`}
                    >
                      ★
                    </span>
                  ))}
              </div>
              <div className={styles["rating-text"]}>Theo {filteredComments.length} đánh giá</div>
            </div>

            <div className={styles["rating-breakdown"]}>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className={styles["rating-row"]}>
                  <div className={styles["star-count"]}>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} className={styles["star-icon"]}>{i < star ? "★" : "☆"}</span>
                      ))}
                  </div>
                  <div className={styles["rating-bar-container"]}>
                    <div
                      className={styles["rating-bar"]}
                      style={{ width: `${(ratingCounts[star] / comments.length) * 100 || 0}%` }}
                    ></div>
                  </div>
                  <div className={styles["rating-count"]}>{`(${ratingCounts[star]})`}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles["filter-section"]}>
            <span className={styles["filter-label"]}>Lọc đánh giá:</span>
            {["all", 5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating === "all" ? "all" : rating}
                className={`${styles["filter-button"]} ${
                  filterRating === rating ? styles.active : ""
                }`}
                onClick={() => {
                  console.log(`Filtering by rating: ${rating}`);
                  setFilterRating(rating);
                }}
              >
                {rating === "all" ? "Tất cả" : `${rating} ★`}
              </button>
            ))}
          </div>

          <div className={styles["write-review-container"]}>
            {canReview && (
              <button
                className={styles["write-review"]}
                onClick={() => {
                  const form = document.getElementById("writeReviewForm");
                  if (form) {
                    form.classList.add(styles.active); // Mở form khi nhấp
                  }
                }}
              >
                <span>✏️</span>
                VIẾT ĐÁNH GIÁ
              </button>
            )}
          </div>

          <div className={styles["write-review-section"]} id="writeReviewForm">
            <h2 className={styles["review-form-title"]}>Viết đánh giá của bạn</h2>
            <div className={styles["star-rating"]}>
              {Array(5)
                .fill(0)
                .map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <span
                      key={starValue}
                      className={`${styles.star} ${starValue <= rating ? styles["star-filled"] : ""}`}
                      style={{ color: starValue <= rating ? "#ffa500" : "#ccc", cursor: "pointer", userSelect: "none" }}
                      onClick={() => {
                        console.log(`Clicked star ${starValue}, current rating: ${rating}`);
                        setRating(starValue);
                      }}
                      onMouseEnter={() => console.log(`Hovering star ${starValue}`)}
                    >
                      ★
                    </span>
                  );
                })}
            </div>
            <textarea
              className={styles["comment-input"]}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Nhập đánh giá của bạn..."
              rows={4}
              maxLength={500}
              disabled={submittingComment}
            />
            {commentMessage && (
              <ToastNotification
                message={commentMessage.text}
                type={commentMessage.type}
                onClose={hideCommentToast}
              />
            )}
            <div className={styles["form-buttons"]}>
              <button
                className={styles["submit-comment"]}
                onClick={submitComment}
                disabled={submittingComment || !newComment.trim() || userLoading || rating === 0}
              >
                {submittingComment ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
              <button
                className={styles["cancel-comment"]}
                onClick={() => {
                  const form = document.getElementById("writeReviewForm");
                  if (form) {
                    form.classList.remove(styles.active);
                  }
                  setNewComment("");
                  setRating(0);
                }}
              >
                Hủy
              </button>
            </div>
          </div>

          <div className={styles["reviews-container"]}>
            {filteredComments.length > 0 ? (
              filteredComments.map((comment, index) => (
                <div key={comment._id || `comment-${index}`} className={styles.review}>
                  <h3 className={styles["review-title"]}>
                    {comment.user?.username || "Ẩn danh"}
                  </h3>
                  <div className={styles["star-rating"]}>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span
                          key={i}
                          className={`${styles.star} ${i < (comment.rating || 0) ? styles["star-filled"] : ""}`}
                        >
                          ★
                        </span>
                      ))}
                  </div>
                  <time className={styles["review-date"]}>
                    Ngày: {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                  </time>
                  <p className={styles.comment}>{comment.content}</p>

                  {comment.replies && comment.replies.length > 0 && (
                    <div className={styles.replies}>
                      {comment.replies.map((reply, idx) => (
                        <div key={idx} className={styles.reply}>
                          <h4>
                            <strong>
                              {reply.user?.username || 
                               (userId && reply.user?._id === userId ? "Bạn" : 
                                reply.user?.role === "admin" ? "Admin" : "Khách hàng")}:
                            </strong>{" "}
                            {reply.content}
                          </h4>
                          <time>
                            {new Date(reply.createdAt).toLocaleDateString("vi-VN")}{" "}
                            {new Date(reply.createdAt).toLocaleTimeString("vi-VN")}
                          </time>
                          {reply.user?.role === "admin" && 
                           comment.user?._id === userId && 
                           idx === comment.replies.length - 1 && (
                            <div className={styles.replyForm}>
                              <textarea
                                value={replyingToReplyIndex === idx ? userReplyContent : ""}
                                onChange={(e) => {
                                  console.log("Textarea change:", { idx, value: e.target.value, submittingComment });
                                  setReplyingToReplyIndex(idx);
                                  setUserReplyContent(e.target.value);
                                }}
                                placeholder="Nhập phản hồi của bạn..."
                                rows={2}
                                maxLength={500}
                                disabled={submittingComment}
                              />
                              <div className={styles["form-buttons"]}>
                                <button
                                  onClick={() => {
                                    console.log("Submitting user reply:", { commentId: comment._id, replyIndex: idx, userReplyContent });
                                    submitUserReply(comment._id, idx);
                                  }}
                                  disabled={submittingComment || !userReplyContent.trim()}
                                >
                                  {submittingComment && replyingToReplyIndex === idx ? "Đang gửi..." : "Gửi phản hồi"}
                                </button>
                                <button
                                  className={styles["cancel-comment"]}
                                  onClick={() => {
                                    console.log("Cancel reply form:", { idx });
                                    setUserReplyContent("");
                                    setReplyingToReplyIndex(null);
                                  }}
                                  disabled={submittingComment}
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {role === "admin" && (
                    <div className={styles.replyForm}>
                      <textarea
                        value={replyingTo === comment._id ? replyContent : ""}
                        onChange={(e) => {
                          setReplyingTo(comment._id);
                          setReplyContent(e.target.value);
                        }}
                        placeholder="Nhập phản hồi..."
                        rows={2}
                        maxLength={500}
                        disabled={submittingComment}
                      />
                      <div className={styles["form-buttons"]}>
                        <button
                          onClick={() => submitReply(comment._id)}
                          disabled={submittingComment || !replyContent.trim()}
                        >
                          {submittingComment && replyingTo === comment._id ? "Đang gửi..." : "Gửi phản hồi"}
                        </button>
                        <button
                          className={styles["cancel-comment"]}
                          onClick={() => {
                            setReplyContent("");
                            setReplyingTo(null);
                          }}
                          disabled={submittingComment}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className={styles["no-reviews"]}>
                Chưa có đánh giá nào cho sản phẩm này.
              </div>
            )}
          </div>
        </div>
      </div>

      <section className={styles["product-contact-section"]}>
        <h2 className={styles["contact-section-title"]}>
          Không tìm thấy được dòng sản phẩm mà bạn cần<br />hoặc thích hợp với da của bạn?
        </h2>
        <button className={styles["contact-button"]}>
          Liên hệ với chúng tôi
        </button>
      </section>

      {cartMessage && (
        <ToastNotification
          message={cartMessage.text}
          type={cartMessage.type}
          onClose={hideCartToast}
        />
      )}
      {commentMessage && (
        <ToastNotification
          message={commentMessage.text}
          type={commentMessage.type}
          onClose={hideCommentToast}
        />
      )}
    </>
  );
} 