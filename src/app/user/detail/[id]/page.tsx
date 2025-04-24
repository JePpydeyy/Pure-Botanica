"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./Detail.module.css";
import { Product } from "@/app/components/product_interface";
import Image from "next/image"; 

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const getImageUrl = (image: string): string => {
  if (!image) return "/images/placeholder.png"; // Hình ảnh dự phòng
  return `https://api-zeal.onrender.com/images/${image}`;
};

interface Comment {
  _id: string;
  user: { username: string };
  content: string;
  createdAt: string;
}

export default function DetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("Người dùng"); // Lưu username từ token
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]); // Danh sách bình luận
  const [newComment, setNewComment] = useState(""); // Nội dung bình luận mới
  const [commentError, setCommentError] = useState<string | null>(null); // Lỗi khi gửi bình luận
  const [submittingComment, setSubmittingComment] = useState(false); // Trạng thái gửi bình luận

  useEffect(() => {
    // Lấy userId và username từ token JWT
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
        const res = await fetch(`https://api-zeal.onrender.com/api/comments/product/${id}`);
        if (!res.ok) throw new Error("Không thể tải bình luận");
        const data = await res.json();
        console.log("Comments data:", data); // Debug dữ liệu bình luận
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
        setComments([]);
      }
    };

    if (id) {
      fetchProduct();
      fetchComments();
    }
  }, [id]);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const addToCart = async () => {
    if (!product) return;

    if (!userId) {
      setCartMessage({
        type: 'error',
        text: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng'
      });

      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItemIndex = cartItems.findIndex((item: any) => item.id === product._id);

      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push({
          id: product._id,
          name: product.name,
          price: product.discountPrice || product.price,
          image: product.images?.[0] || "",
          quantity,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cartItems));
      alert("Đã thêm vào giỏ hàng (localStorage)!");
      return;
    }

    setAddingToCart(true);

    try {
      const productId = product._id;
      if (!productId) throw new Error("ID sản phẩm không hợp lệ");

      const response = await fetch(
        `https://api-zeal.onrender.com/api/carts/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            productId: productId,
            quantity: quantity
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Không thể thêm sản phẩm vào giỏ hàng");

      setCartMessage({
        type: 'success',
        text: 'Đã thêm sản phẩm vào giỏ hàng!'
      });

      setTimeout(() => setCartMessage(null), 3000);
    } catch (error: any) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      setCartMessage({
        type: 'error',
        text: `Lỗi: ${error.message}`
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const submitComment = async () => {
    if (!userId) {
      setCommentError("Vui lòng đăng nhập để viết bình luận.");
      return;
    }

    if (!newComment.trim()) {
      setCommentError("Bình luận không được để trống.");
      return;
    }

    setSubmittingComment(true);
    setCommentError(null);

    try {
      const response = await fetch(`https://api-zeal.onrender.com/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          productId: id,
          content: newComment,
        }),
      });

      const responseData = await response.json();
      console.log("New comment response:", responseData); // Debug dữ liệu trả về
      if (!response.ok) throw new Error(responseData.message || "Không thể gửi bình luận.");

      // Thêm bình luận mới với thông tin từ token
      setComments((prev) => [
        {
          _id: responseData._id,
          user: { username: username }, // Sử dụng username từ token
          content: newComment,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNewComment("");

      // Gọi lại API để đồng bộ danh sách bình luận
      const res = await fetch(`https://api-zeal.onrender.com/api/comments/product/${id}`);
      if (res.ok) {
        const updatedComments = await res.json();
        setComments(Array.isArray(updatedComments) ? updatedComments : []);
      }
    } catch (error: any) {
      setCommentError(`Lỗi: ${error.message}`);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <p className="text-center py-10">Đang tải chi tiết sản phẩm...</p>;
  if (!product) return <p className="text-center py-10">Không tìm thấy sản phẩm.</p>;

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
                <img
                  src={getImageUrl(image)}
                  alt={`${product.name} thumbnail ${index + 1}`}
                />
              </div>
            ))}
          </div>

          <div className={styles["product-image-container"]}>
            <div className={styles["product-main-image"]}>
              <img
                src={getImageUrl(product.images?.[currentImageIndex] || "")}
                alt={product.name}
              />
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
            <p className={styles["product-price"]}>
              {product.discountPrice ? (
                <>
                  <span className={styles["discount-price"]}>{formatPrice(product.discountPrice)}</span>
                  <span className={styles["original-price"]}>{formatPrice(product.price)}</span>
                  <span className={styles["discount-percent"]}>
                    {`-${Math.round(
                      ((product.price - product.discountPrice) / product.price) * 100
                    )}%`}
                  </span>
                </>
              ) : (
                <>{formatPrice(product.price)}</>
              )}
            </p>
            <p className={styles["product-description"]}>
              {product.description || "Chưa có mô tả cho sản phẩm này."}
            </p>

            <div className={styles["product-features"]}>
              {product.special?.map((feature, index) => (
                <div key={`feature-${index}`} className={styles.feature}>
                  {feature}
                </div>
              ))}
            </div>

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
                />
                <button className={`${styles["quantity-btn"]} ${styles.increase}`} onClick={increaseQty}>
                  +
                </button>
              </div>
              <button 
                className={styles["add-to-cart"]} 
                onClick={addToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
              </button>
            </div>

            {cartMessage && (
              <div className={`${styles["cart-message"]} ${styles[cartMessage.type]}`}>
                {cartMessage.text}
              </div>
            )}
          </div>
        </section>

        <div className={styles["product-info"]}>
          <h2 className={styles["product-info-title"]}>Thông tin sản phẩm:</h2>
          <h3 className={styles["ingredients-title"]}>Thành phần:</h3>
          <p>{product.ingredients?.join(", ") || "Không có thông tin thành phần."}</p>

          <h3 className={styles["usage-title"]}>Hướng dẫn sử dụng:</h3>
          <ul className={styles["usage-list"]}>
            {product.usage_instructions?.map((instruction, index) => (
              <li key={`instruction-${index}`} className={styles["usage-item"]}>
                {instruction}
              </li>
            ))}
          </ul>
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
              <p className={styles["comment-error"]}>{commentError}</p>
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