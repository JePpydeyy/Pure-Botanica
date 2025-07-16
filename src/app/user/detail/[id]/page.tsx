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

// Hằng số
const TIMEOUT_DURATION = 10000;
const MIN_COMMENT_LENGTH = 3;
const TOAST_DURATION = 3000;
const LOGIN_REDIRECT_DELAY = 3000; // Thời gian chờ trước khi chuyển hướng đến trang đăng nhập (3 giây)

// Hàm tiện ích: Định dạng giá tiền
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

// Hàm tiện ích: Lấy URL hình ảnh
const getImageUrl = (image: string): string => {
  if (!image) return "/images/placeholder.png";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("images/")) return `https://api-zeal.onrender.com/${image}`;
  if (image.startsWith("/images/")) return `https://api-zeal.onrender.com${image}`;
  return `https://api-zeal.onrender.com/images/${image}`;
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        const userIdFromToken = decoded.id || decoded._id;
        const usernameFromToken = decoded.username || "Người dùng";
        if (userIdFromToken) {
          setUserId(userIdFromToken);
          setUsername(usernameFromToken);
        }
      }
    }
  }, []);

  return { userId, username };
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
      throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
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

  const { userId, username } = useUserInfo();
  const { message: cartMessage, showToast: showCartToast, hideToast: hideCartToast } = useToast();
  const { message: commentError, showToast: showCommentError, hideToast: hideCommentError } = useToast();

  // Đặt lại số lượng khi thay đổi tùy chọn
  useEffect(() => {
    setQuantity(1);
  }, [selectedOptionIndex]);

  // Lấy thông tin sản phẩm và danh sách yêu thích
  useEffect(() => {
    // Hàm lấy thông tin sản phẩm theo identifier (ID hoặc slug)
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

    // Hàm lấy danh sách sản phẩm yêu thích của người dùng
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

  // Lấy danh sách bình luận của sản phẩm
  useEffect(() => {
    const fetchComments = async () => {
      if (!product?._id) {
        setComments([]);
        return;
      }

      try {
        const data = await apiRequest(`/api/comments/product/${product._id}`);
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
        setComments([]);
      }
    };

    fetchComments();
  }, [product?._id]);

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
      showCartToast("error", "Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
      setTimeout(() => {
        router.push("/user/login");
      }, LOGIN_REDIRECT_DELAY);
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
        setTimeout(() => {
          router.push("/user/login");
        }, LOGIN_REDIRECT_DELAY);
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
    if (!product?._id || !newComment.trim() || newComment.length < MIN_COMMENT_LENGTH) {
      showCommentError("error", "Bình luận phải có ít nhất 3 ký tự!");
      return;
    }
    if (!userId) {
      showCommentError("error", "Vui lòng đăng nhập để gửi bình luận!");
      setTimeout(() => {
        router.push("/user/login");
      }, LOGIN_REDIRECT_DELAY);
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await apiRequest("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          userId,
          productId: product._id,
          content: newComment.trim(),
        }),
      });

      setComments((prev) => [
        {
          ...response,
          user: { username },
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNewComment("");
      showCommentError("success", "Bình luận đã được gửi!");
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      showCommentError("error", "Lỗi khi gửi bình luận!");
    } finally {
      setSubmittingComment(false);
    }
  }, [product?._id, newComment, userId, username, showCommentError, router]);

  // Trạng thái loading và lỗi
  if (loading) return <p className="text-center py-10">Đang tải chi tiết sản phẩm...</p>;
  if (!product) return <p className="text-center py-10">Không tìm thấy sản phẩm.</p>;

  const selectedOption = product.option[selectedOptionIndex] || product.option[0];
  const isOutOfStock = !selectedOption?.stock || selectedOption.stock < quantity;

  return (
    <>
      <div className={styles.container}>
        <section className={styles["product-section"]}>
          {/* Hình ảnh sản phẩm */}
          <div className={styles["product-thumbnails"]}>
            {product.images?.map((image, index) => (
              <div
                key={`thumbnail-${index}`}
                className={`${styles.thumbnail} ${index === currentImageIndex ? styles.active : ""}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={getImageUrl(image)}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  quality={100}
                  className={styles.thumbnailImg}
                />
              </div>
            ))}
          </div>

          <div className={styles["product-image-container"]}>
            <div className={styles["product-main-image"]}>
              <Image
                src={getImageUrl(product.images?.[currentImageIndex] || "")}
                alt={product.name}
                width={300}
                height={200}
                quality={100}
                className={styles["mainImg"]}
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

          {/* Thông tin sản phẩm */}
          <div className={styles["product-info"]}>
            <h1 className={styles["product-title"]}>{product.name}</h1>

            {/* Hiển thị giá */}
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

            {/* Tùy chọn sản phẩm */}
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

            {/* Kiểm soát số lượng và thêm vào giỏ hàng */}
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

            {/* Nút thêm/xóa khỏi danh sách yêu thích */}
            <div style={{ marginTop: "10px" }}>
              <button
                className={styles["wishlist-button"]}
                onClick={addToWishlist}
                disabled={!userId && !addingToCart} // Vô hiệu hóa nếu chưa đăng nhập
                aria-label={isFavorite ? "Đã nằm trong danh sách yêu thích" : "Đưa vào danh sách yêu thích của bạn"}
              >
                <i
                  className={`fas fa-heart ${isFavorite ? styles.favorited : styles.notFavorited}`}
                  style={{ color: isFavorite ? "#ff0000" : "#000000" }}
                ></i>
                <span style={{ marginLeft: "8px" }}>
                  {isFavorite ? "Đã nằm trong danh sách yêu thích" : "Đưa vào danh sách yêu thích của bạn"}
                </span>
              </button>
            </div>

            {/* Thông báo toast */}
            {cartMessage && (
              <ToastNotification
                message={cartMessage.text}
                type={cartMessage.type}
                onClose={hideCartToast}
              />
            )}
          </div>
        </section>

        {/* Mô tả sản phẩm */}
        <div className={styles["product-info"]}>
          <h2 className={styles["product-info-title"]}>Thông tin sản phẩm:</h2>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>

      {/* Phần bình luận */}
      <div className={styles.cr}>
        <div className={styles["customer-review"]}>
          <h1 className={styles["review-main-title"]}>Đánh giá từ khách hàng</h1>

          <div className={styles["write-review-section"]}>
            <h2 className={styles["review-title"]}>Viết bình luận của bạn</h2>
            <textarea
              className={styles["comment-input"]}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Nhập bình luận của bạn..."
              rows={4}
              maxLength={500}
            />
            {commentError && (
              <ToastNotification
                message={commentError.text}
                type={commentError.type}
                onClose={hideCommentError}
              />
            )}
            <button
              className={styles["submit-comment"]}
              onClick={submitComment}
              disabled={submittingComment || !newComment.trim()}
            >
              {submittingComment ? "Đang gửi..." : "Gửi bình luận"}
            </button>
          </div>

          {/* Danh sách bình luận */}
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={comment._id || `comment-${index}`} className={styles.review}>
                <h3 className={styles["review-title"]}>
                  {comment.user?.username || "Ẩn danh"}
                </h3>
                <time className={styles["review-date"]}>
                  Ngày: {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                </time>
                <p className={styles.comment}>{comment.content}</p>
              </div>
            ))
          ) : (
            <p>Chưa có bình luận nào cho sản phẩm này.</p>
          )}
        </div>
      </div>

      {/* Phần liên hệ */}
      <section className={styles["product-contact-section"]}>
        <h2 className={styles["contact-section-title"]}>
          Không tìm thấy được dòng sản phẩm mà bạn cần<br />
          hoặc thích hợp với da của bạn?
        </h2>
        <button className={styles["contact-button"]}>
          Liên hệ với chúng tôi
        </button>
      </section>
    </>
  );
}