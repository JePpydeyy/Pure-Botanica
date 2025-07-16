"use client"; // Chạy phía client để dùng localStorage và fetch API

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./wishlist.module.css";
import { useRouter } from "next/navigation";
import ToastNotification from "../ToastNotification/ToastNotification";

// Interface sản phẩm yêu thích
interface Product {
  _id: string;
  name: string;
  images: string[];
  id_category: { status: string };
}

// Hook toast message
const useToast = () => {
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const TOAST_DURATION = 3000;

  const showToast = (type: "success" | "error" | "info", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), TOAST_DURATION);
  };

  return { message, showToast, hideToast: () => setMessage(null) };
};

// Hàm trả về URL hình ảnh đầy đủ
const getImageUrl = (filename?: string) =>
  filename ? `https://api-zeal.onrender.com/${filename}` : "/placeholder-image.jpg";

// Trang danh sách yêu thích của người dùng
export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { message, showToast, hideToast } = useToast();

  // Lấy token từ localStorage
  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  // Fetch sản phẩm yêu thích
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = getToken();
      if (!token) {
        setError("Vui lòng đăng nhập để xem danh sách yêu thích.");
        showToast("error", "Vui lòng đăng nhập để xem danh sách yêu thích!");
        setLoading(false);
        setTimeout(() => router.push("/user/login"), 3000);
        return;
      }

      try {
        const { data } = await axios.get<{ favoriteProducts: Product[] }>(
          "https://api-zeal.onrender.com/api/users/favorite-products",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(data.favoriteProducts || []);
      } catch (err: any) {
        const status = err.response?.status;
        const errorMap: { [key: number]: string } = {
          400: "User ID không hợp lệ.",
          401: "Người dùng không được xác thực hoặc token không hợp lệ.",
          404: "Không tìm thấy người dùng.",
          500: "Lỗi server, có thể do kết nối database.",
        };
        const errorMessage = errorMap[status] || "Không thể tải danh sách yêu thích.";
        setError(errorMessage);
        showToast("error", errorMessage);
        console.error("Lỗi khi lấy danh sách yêu thích:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [router, showToast]);

  // Xóa sản phẩm khỏi danh sách yêu thích
  const removeFromWishlist = async (productId: string) => {
    const token = getToken();
    if (!token) {
      showToast("error", "Vui lòng đăng nhập để xóa sản phẩm!");
      return;
    }

    try {
      await axios.delete(
        `https://api-zeal.onrender.com/api/users/favorite-products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      showToast("success", "Đã xóa sản phẩm khỏi danh sách yêu thích!");
    } catch (err) {
      showToast("error", "Không thể xóa sản phẩm khỏi danh sách yêu thích!");
      console.error("Lỗi xóa sản phẩm:", err);
    }
  };

  // UI hiển thị
  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles["wishlist-title"]}>Danh sách yêu thích</h1>

      {products.length === 0 ? (
        <p className="text-center py-10">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.</p>
      ) : (
        <ul className={styles.productList}>
          {products.map((product) => (
            <li key={product._id} className={styles.productItem}>
              <img
                src={getImageUrl(product.images[0])}
                alt={product.name}
                className={styles.productImage}
              />
              <div className={styles.productDetails}>
                <h2>{product.name}</h2>
                <button onClick={() => removeFromWishlist(product._id)} className={styles.removeButton}>
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {message && (
        <ToastNotification
          message={message.text}
          type={message.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
