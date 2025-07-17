"use client"; // Chạy phía client để dùng localStorage và fetch API

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styles from "./wishlist.module.css";
import { useRouter } from "next/navigation";
import ToastNotification from "../ToastNotification/ToastNotification";

// Interface sản phẩm yêu thích, dựa trên API documentation
interface Product {
  _id: string;
  name: string;
  images: string[];
  id_category: { status: string };
  slug: string;
  short_description: string;
}

// Interface cho phản hồi API /api/products/:identifier
interface ProductResponse {
  _id: string;
  name: string;
  images: string[];
  id_category: { status: string };
  slug: string;
  short_description: string;
}

// Hook toast message
const useToast = () => {
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const TOAST_DURATION = 3000;

  const showToast = useCallback((type: "success" | "error" | "info", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), TOAST_DURATION);
  }, []);

  return { message, showToast, hideToast: () => setMessage(null) };
};

// Hàm trả về URL hình ảnh đầy đủ, sử dụng ảnh lỗi nếu không hợp lệ
const getImageUrl = (filename?: string): string => {
  if (!filename || typeof filename !== "string" || filename.trim() === "") {
    console.warn("Invalid image URL detected, using fallback:", "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg");
    return "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg";
  }
  try {
    new URL(filename); // Validate URL
    return filename;
  } catch (e) {
    console.warn("Invalid URL format for image:", filename, "using fallback:", "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg");
    return ("https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg");
  }
};

// Hàm giới hạn số từ của mô tả ngắn
const truncateDescription = (description: string, wordLimit: number = 20) => {
  const words = description.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return description;
};

// Hàm lấy chi tiết sản phẩm nếu thiếu slug hoặc short_description
const fetchProductDetails = async (productId: string, token: string): Promise<Product> => {
  try {
    const { data } = await axios.get<ProductResponse>(`https://api-zeal.onrender.com/api/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      _id: productId,
      slug: data.slug || productId,
      short_description: data.short_description || "Không có mô tả",
      images: data.images || [],
      name: data.name || "Sản phẩm không xác định",
      id_category: data.id_category || { status: "show" },
    };
  } catch (err) {
    console.error(`Lỗi khi lấy chi tiết sản phẩm ${productId}:`, err);
    return {
      _id: productId,
      slug: productId,
      short_description: "Không có mô tả",
      images: [],
      name: "Sản phẩm không xác định",
      id_category: { status: "show" },
    };
  }
};

// Trang danh sách yêu thích của người dùng
export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { message, showToast, hideToast } = useToast();

  // Lấy token từ localStorage
  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  // Hàm chuyển hướng đến trang chi tiết
  const navigateToDetail = (slug: string) => {
    router.push(`/user/detail/${slug}`);
  };

  // Fetch sản phẩm yêu thích
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = getToken();
      if (!token) {
        showToast("error", "Vui lòng đăng nhập để sử dụng chức năng này!");
        setLoading(false);
        setTimeout(() => {
          router.push("/user/login");
        }, 3000);
        return;
      }

      try {
        const { data } = await axios.get<{ favoriteProducts: Product[] }>(
          "https://api-zeal.onrender.com/api/users/favorite-products",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Dữ liệu favoriteProducts:", data.favoriteProducts); // Debug API response
        const productsWithDetails = await Promise.all(
          (data.favoriteProducts || []).map(async (product: Product) => {
            if (!product.slug || !product.short_description) {
              return { ...product, ...(await fetchProductDetails(product._id, token)) };
            }
            return product;
          })
        );
        setProducts(productsWithDetails);
      } catch (err: any) {
        const status = err.response?.status;
        const errorMap: { [key: number]: string } = {
          400: "User ID không hợp lệ.",
          401: "Người dùng không được xác thực hoặc token không hợp lệ.",
          404: "Không tìm thấy người dùng.",
          500: "Lỗi server, có thể do kết nối database.",
        };
        const errorMessage = errorMap[status] || "Không thể tải danh sách yêu thích.";
        showToast("error", errorMessage);
        console.error("Lỗi khi lấy danh sách yêu thích:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Xóa sản phẩm khỏi danh sách yêu thích
  const removeFromWishlist = async (productId: string) => {
    const token = getToken();
    if (!token) {
      showToast("error", "Vui lòng đăng nhập để xóa sản phẩm!");
      setTimeout(() => {
        router.push("/user/login");
      }, 3000);
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

  return (
    <div className={styles.container}>
      <h1 className={styles["wishlist-title"]}>Danh sách yêu thích</h1>

      {products.length === 0 ? (
        <p className="text-center py-10">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.</p>
      ) : (
        <ul className={styles.productList}>
          {products.map((product) => (
            <li key={product._id} className={styles.productItem}>
              <button onClick={() => navigateToDetail(product.slug)} className={styles.productImageButton}>
                <img
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  className={styles.productImage}
                  onError={(e) => {
                    console.log(`Image load failed for ${product.name}, switched to 404 fallback`);
                    (e.target as HTMLImageElement).src = "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg";
                  }}
                />
              </button>
              <div className={styles.productDetails}>
                <button onClick={() => navigateToDetail(product.slug)} className={styles.productNameButton}>
                  <h2>{product.name}</h2>
                </button>
                <p className={styles.productDescription}>
                  {truncateDescription(product.short_description || "Không có mô tả", 20)}
                </p>
                <div className={styles.buttonGroup}>
                  <button onClick={() => navigateToDetail(product.slug)} className={styles.detailButton}>
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className={styles.removeButton}
                  >
                    Xóa
                  </button>
                </div>
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