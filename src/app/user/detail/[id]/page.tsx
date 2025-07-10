"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import styles from "./Detail.module.css";
import Image from "next/image";
import ToastNotification from "../../ToastNotification/ToastNotification";
import { Product} from "@/app/components/product_interface";
import {Comment} from  "@/app/components/comment_interface";

// Environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-zeal.onrender.com";

// Constants
const TIMEOUT_DURATION = 10000;
const MIN_COMMENT_LENGTH = 3;
const TOAST_DURATION = 3000;

// Utility functions
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const getImageUrl = (image: string): string => {
  if (!image) return "/images/placeholder.png";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("images/")) return `https://api-zeal.onrender.com/${image}`;
  if (image.startsWith("/images/")) return `https://api-zeal.onrender.com${image}`;
  return `https://api-zeal.onrender.com/images/${image}`;
};

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
    console.error("Error decoding token:", error);
    return null;
  }
};

const isValidObjectId = (id: string): boolean => {
  return /^[a-f\d]{24}$/i.test(id);
};

// Custom hooks
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

const useToast = () => {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), TOAST_DURATION);
  }, []);

  const hideToast = useCallback(() => setMessage(null), []);

  return { message, showToast, hideToast };
};

// API functions
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
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
};

export default function DetailPage() {
  const { id } = useParams();
  const productId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  const { userId, username } = useUserInfo();
  const { message: cartMessage, showToast: showCartToast, hideToast: hideCartToast } = useToast();
  const { message: commentError, showToast: showCommentError, hideToast: hideCommentError } = useToast();

  // Reset quantity when option changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedOptionIndex]);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const data = await apiRequest(`/api/products/${productId}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fetch comments
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
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };

    fetchComments();
  }, [product?._id]);

  // Quantity controls
  const increaseQty = useCallback(() => setQuantity(prev => prev + 1), []);
  const decreaseQty = useCallback(() => setQuantity(prev => prev > 1 ? prev - 1 : 1), []);

  // Add to cart with localStorage fallback
  const addToCart = useCallback(async () => {
    if (!product || !product.option.length || !product.option[selectedOptionIndex]) return;

    const selectedOption = product.option[selectedOptionIndex];
    if (selectedOption.stock < quantity) {
      showCartToast("error", "Số lượng vượt quá tồn kho!");
      return;
    }

    // Handle localStorage cart for non-authenticated users
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
      console.error("Error adding to cart:", error);
      showCartToast("error", `Lỗi: ${error instanceof Error ? error.message : "Không thể thêm vào giỏ hàng"}`);
    } finally {
      setAddingToCart(false);
    }
  }, [product, selectedOptionIndex, quantity, userId, showCartToast]);

  // Submit comment
  const submitComment = useCallback(async () => {
    if (!userId) {
      showCommentError("error", "Vui lòng đăng nhập để viết bình luận.");
      return;
    }

    if (!newComment.trim() || newComment.length < MIN_COMMENT_LENGTH) {
      showCommentError("error", `Bình luận phải có ít nhất ${MIN_COMMENT_LENGTH} ký tự.`);
      return;
    }

    if (!product?._id || !isValidObjectId(product._id)) {
      showCommentError("error", "ID sản phẩm không hợp lệ.");
      return;
    }

    setSubmittingComment(true);
    try {
      await apiRequest("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          userId,
          productId: product._id,
          content: newComment,
        }),
      });

      // Refresh comments
      const updatedComments = await apiRequest(`/api/comments/product/${product._id}`);
      setComments(Array.isArray(updatedComments) ? updatedComments : []);
      setNewComment("");
    } catch (error) {
      console.error("Comment submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "Không thể gửi bình luận";
      showCommentError("error", `Lỗi: ${errorMessage}`);
    } finally {
      setSubmittingComment(false);
    }
  }, [userId, newComment, product?._id, showCommentError]);

  // Loading and error states
  if (loading) return <p className="text-center py-10">Đang tải chi tiết sản phẩm...</p>;
  if (!product) return <p className="text-center py-10">Không tìm thấy sản phẩm.</p>;

  const selectedOption = product.option[selectedOptionIndex] || product.option[0];
  const isOutOfStock = !selectedOption?.stock || selectedOption.stock < quantity;

  return (
    <>
      <div className={styles.container}>
        <section className={styles["product-section"]}>
          {/* Product Images */}
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

          {/* Product Info */}
          <div className={styles["product-info"]}>
            <h1 className={styles["product-title"]}>{product.name}</h1>

            {/* Price Display */}
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

            {/* Options */}
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

            {/* Quantity and Add to Cart */}
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

            {/* Toast Messages */}
            {cartMessage && (
              <ToastNotification
                message={cartMessage.text}
                type={cartMessage.type}
                onClose={hideCartToast}
              />
            )}
          </div>
        </section>

        {/* Product Description */}
        <div className={styles["product-info"]}>
          <h2 className={styles["product-info-title"]}>Thông tin sản phẩm:</h2>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>

      {/* Comments Section */}
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

          {/* Comments List */}
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

      {/* Contact Section */}
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