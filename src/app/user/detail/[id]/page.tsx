"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./Detail.module.css";
import Image from "next/image";
import ToastNotification from "../../ToastNotification/ToastNotification";

interface Product {
  _id: string;
  name: string;
  slug: string;
  status: string;
  view: number;
  id_brand: string;
  id_category: string;
  images: string[];
  short_description: string;
  description: string;
  option: {
    stock: number;
    value: string;
    price: number;
    discount_price?: number;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  user: { username: string };
  content: string;
  createdAt: string;
}

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const getImageUrl = (image: string): string => {
  if (!image) return "/images/placeholder.png";
  const cleanImage = image.startsWith("images/") ? image : `images/${image}`;
  return `https://api-zeal.onrender.com/${cleanImage}`;
};

export default function DetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("Người dùng");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  // Reset quantity to 1 when option changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedOptionIndex]);

  useEffect(() => {
    const getUserInfoFromToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const decoded = JSON.parse(jsonPayload);
          const userIdFromToken = decoded.id || decoded._id;
          const usernameFromToken = decoded.username || "Người dùng";
          if (userIdFromToken) {
            setUserId(userIdFromToken);
            setUsername(usernameFromToken);
          }
        } catch (err) {
          console.error("Lỗi khi giải mã token:", err);
        }
      }
    };

    getUserInfoFromToken();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://api-zeal.onrender.com/api/products/${id}`);
        if (!res.ok) throw new Error("Không thể tải sản phẩm");
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`https://api-zeal.onrender.com/api/comments/product/${product?._id || ""}`);
        if (!res.ok) {
          setComments([]);
          return;
        }
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        setComments([]);
        console.error("Lỗi khi lấy bình luận:", error);
      }
    };

    if (id) {
      fetchProduct();
      if (product?._id) fetchComments();
    }
  }, [id, product?._id]);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const addToCart = async () => {
    if (!product || !product.option.length || !product.option[selectedOptionIndex]) return;

    const selectedOption = product.option[selectedOptionIndex];
    if (selectedOption.stock < quantity) {
      setCartMessage({
        type: "error",
        text: "Số lượng vượt quá tồn kho!",
      });
      return;
    }

    if (!userId) {
      setCartMessage({
        type: "error",
        text: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
      });
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItemIndex = cartItems.findIndex((item: any) => item.id === product._id && item.optionId === selectedOption._id);
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
      setCartMessage({
        type: "success",
        text: "Đã thêm vào giỏ hàng (localStorage)!",
      });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    setAddingToCart(true);

    try {
      const response = await fetch(`https://api-zeal.onrender.com/api/carts/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId: product._id,
          optionIds: [selectedOption._id],
          quantity,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Không thể thêm sản phẩm vào giỏ hàng");

      setCartMessage({
        type: "success",
        text: "Đã thêm sản phẩm vào giỏ hàng!",
      });
      setTimeout(() => setCartMessage(null), 3000);
    } catch (error: any) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      setCartMessage({
        type: "error",
        text: `Lỗi: ${error.message}`,
      });
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const submitComment = async () => {
    if (!userId) {
      setCommentError("Vui lòng đăng nhập để viết bình luận.");
      setTimeout(() => setCommentError(null), 3000); // Auto-clear after 3 seconds
      return;
    }

    if (!newComment.trim() || newComment.length < 3) {
      setCommentError("Bình luận phải có ít nhất 3 ký tự.");
      setTimeout(() => setCommentError(null), 3000); // Auto-clear after 3 seconds
      return;
    }

    if (!product || !product._id || !/^[a-f\d]{24}$/i.test(product._id)) {
      setCommentError("ID sản phẩm không hợp lệ.");
      setTimeout(() => setCommentError(null), 3000); // Auto-clear after 3 seconds
      return;
    }

    setSubmittingComment(true);
    setCommentError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập.");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      console.log("Sending comment request:", { userId, productId: product._id, content: newComment });

      const response = await fetch(`https://api-zeal.onrender.com/api/comments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId,
          productId: product._id,
          content: newComment,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          `Lỗi: ${response.status} - ${response.statusText || "Không rõ"}`
        );
      }

      const updatedCommentsRes = await fetch(`https://api-zeal.onrender.com/api/comments/product/${product._id}`);
      if (updatedCommentsRes.ok) {
        const updatedCommentsData = await updatedCommentsRes.json();
        setComments(Array.isArray(updatedCommentsData) ? updatedCommentsData : []);
      }

      setNewComment("");
    } catch (error: any) {
      console.error("Comment submission error:", error, error.response?.data || error.message);
      setCommentError(
        error.name === "AbortError"
          ? "Yêu cầu hết thời gian, vui lòng thử lại."
          : error.message.includes("401")
          ? "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại."
          : error.message.includes("400")
          ? "Dữ liệu không hợp lệ, vui lòng kiểm tra lại."
          : `Lỗi: ${error.message || "Không thể gửi bình luận"}`
      );
      setTimeout(() => setCommentError(null), 3000); // Auto-clear after 3 seconds
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <p className="text-center py-10">Đang tải chi tiết sản phẩm...</p>;
  if (!product) return <p className="text-center py-10">Không tìm thấy sản phẩm.</p>;

  const selectedOption = product.option[selectedOptionIndex] || product.option[0];

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
                <img src={getImageUrl(image)} alt={`${product.name} thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>

          <div className={styles["product-image-container"]}>
            <div className={styles["product-main-image"]}>
              <img src={getImageUrl(product.images?.[currentImageIndex] || "")} alt={product.name} />
            </div>
            <div className={styles["product-dots"]}>
              {product.images?.map((_, index) => (
                <div
                  key={`dot-${index}`}
                  className={`${styles.dot} ${index === currentImageIndex ? styles.active : ""}`}
                  onClick={() => setCurrentImageIndex(index)}
                ></div>
              ))}
            </div>
          </div>

          <div className={styles["product-info"]}>
            <h1 className={styles["product-title"]}>{product.name}</h1>

            {selectedOption && (
              <p className={styles["product-price"]}>
                {selectedOption.discount_price ? (
                  <>
                    <span className={styles["discount-price"]}>{formatPrice(selectedOption.discount_price)}</span>
                    <span className={styles["original-price"]}>{formatPrice(selectedOption.price)}</span>
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
            <p className={styles["product-description"]} dangerouslySetInnerHTML={{ __html: product.short_description }} />

            <div className={styles["quantity-controls"]}>
              <div className={styles["quantity-wrapper"]}>
                <button className={`${styles["quantity-btn"]} ${styles.decrease}`} onClick={decreaseQty}>
                  −
                </button>
                <input
                  type="text"
                  className={styles["quantity-input"]}
                  value={quantity}
                  readOnly
                  aria-label="Số lượng sản phẩm"
                  placeholder="Số lượng"
                />
                <button className={`${styles["quantity-btn"]} ${styles.increase}`} onClick={increaseQty}>
                  +
                </button>
              </div>
              <button
                className={styles["add-to-cart"]}
                onClick={addToCart}
                disabled={addingToCart || !selectedOption?.stock || selectedOption.stock < quantity}
              >
                {addingToCart
                  ? "Đang thêm..."
                  : !selectedOption?.stock || selectedOption.stock < quantity
                  ? "Hết hàng"
                  : "Thêm vào giỏ hàng"}
              </button>
            </div>

            {cartMessage && (
              <ToastNotification
                message={cartMessage.text}
                type={cartMessage.type}
                onClose={() => setCartMessage(null)}
              />
            )}
          </div>
        </section>

        <div className={styles["product-info"]}>
          <h2 className={styles["product-info-title"]}>Thông tin sản phẩm:</h2>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>

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
            />
            {commentError && (
              <ToastNotification
                message={commentError}
                type="error"
                onClose={() => setCommentError(null)}
              />
            )}
            <button
              className={styles["submit-comment"]}
              onClick={submitComment}
              disabled={submittingComment}
            >
              {submittingComment ? "Đang gửi..." : "Gửi bình luận"}
            </button>
          </div>

          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={comment._id || `comment-${index}`} className={styles.review}>
                <h2 className={styles["review-title"]}>{comment.user?.username || "Ẩn danh"}</h2>
                <span className={styles["review-date"]}>
                  Ngày: {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                </span>
                <p className={styles.comment}>{comment.content}</p>
              </div>
            ))
          ) : (
            <p>Chưa có bình luận nào cho sản phẩm này.</p>
          )}
        </div>
      </div>

      <section className={styles["product-contact-section"]}>
        <h2 className={styles["contact-section-title"]}>
          Không tìm thấy được dòng sản phẩm mà bạn cần<br />hoặc thích hợp với da của bạn?
        </h2>
        <button className={styles["contact-button"]}>Liên hệ với chúng tôi</button>
      </section>
    </>
  );
}