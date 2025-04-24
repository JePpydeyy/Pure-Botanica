"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import "./editproduct.css";

interface Category {
  _id: string;
  name: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images?: string[];
  category?: Category;
  description?: string;
  ingredients?: string[];
  usage_instructions?: string[];
  special?: string[];
  newImages?: File[];
}

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]); // Xem trước ảnh mới
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  // Kiểm tra quyền admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  // Lấy dữ liệu sản phẩm và danh mục
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const res = await fetch(`https://api-zeal.onrender.com/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (res.status === 401 || res.status === 403) {
          alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("email");
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
        const data = await res.json();
        setProduct({ ...data, newImages: [] });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
        console.error("Lỗi khi tải sản phẩm:", errorMessage);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        showNotification("Không thể tải thông tin sản phẩm", "error");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://api-zeal.onrender.com/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (res.status === 401 || res.status === 403) {
          alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("email");
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Dữ liệu danh mục không hợp lệ");
        setCategories(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
        console.error("Lỗi khi tải danh mục:", errorMessage);
        showNotification("Không thể tải danh mục", "error");
      }
    };

    fetchProduct();
    fetchCategories();
  }, [productId, router]);

  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const validateForm = () => {
    if (product?.discountPrice != null && product.discountPrice < 0) return "Giá khuyến mãi không hợp lệ";
    if (!product?.name?.trim()) return "Tên sản phẩm không được để trống";
    if (product?.price == null || product.price < 0) return "Giá sản phẩm không hợp lệ";
    if (product?.stock == null || product.stock < 0) return "Số lượng không hợp lệ";
    if (!product?.category || !product.category._id) return "Vui lòng chọn danh mục";
    if (product?.newImages && product.newImages.length > 4) return "Chỉ được chọn tối đa 4 ảnh";
    if ((product?.images?.length || 0) + (product?.newImages?.length || 0) > 4)
      return "Tổng số ảnh không được vượt quá 4";
    return null;
  };

  // Xử lý chọn ảnh mới và xem trước
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showNotification(`Ảnh ${file.name} vượt quá giới hạn 5MB`, "error");
        return false;
      }
      if (!file.type.match(/image\/(jpg|jpeg|png|gif|webp)/)) {
        showNotification(`Ảnh ${file.name} không đúng định dạng (jpg, jpeg, png, gif, webp)`, "error");
        return false;
      }
      return true;
    });

    // Tạo URL xem trước cho ảnh mới
    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previews);

    setProduct({
      ...product!,
      newImages: validFiles,
    });
  };

  // Xóa ảnh hiện tại
  const removeCurrentImage = (index: number) => {
    setProduct({
      ...product!,
      images: product!.images?.filter((_, i) => i !== index),
    });
  };

  // Xóa ảnh mới
  const removeNewImage = (index: number) => {
    setProduct({
      ...product!,
      newImages: product!.newImages?.filter((_, i) => i !== index),
    });
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product || !product._id) {
      showNotification("Không tìm thấy sản phẩm để cập nhật", "error");
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const validationError = validateForm();
      if (validationError) throw new Error(validationError);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập lại!");
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("name", product.name || "");
      formData.append("price", product.price?.toString() || "0");
      formData.append("stock", product.stock?.toString() || "0");
      if (product.category?._id) formData.append("category_id", product.category._id);
      if (product.description) formData.append("description", product.description);
      if (product.ingredients && product.ingredients.length > 0)
        formData.append("ingredients", JSON.stringify(product.ingredients));
      if (product.usage_instructions && product.usage_instructions.length > 0)
        formData.append("usage_instructions", JSON.stringify(product.usage_instructions));
      if (product.special && product.special.length > 0)
        formData.append("special", JSON.stringify(product.special));
      if (product.discountPrice != null && product.discountPrice !== 0)
        formData.append("discountPrice", product.discountPrice.toString());

      // Gửi danh sách ảnh hiện tại
      if (product.images && product.images.length > 0) {
        formData.append("images", JSON.stringify(product.images));
      }

      // Gửi ảnh mới
      if (product.newImages && product.newImages.length > 0) {
        product.newImages.forEach((file) => {
          formData.append("newImages", file);
        });
      }

      const response = await fetch(`https://api-zeal.onrender.com/api/products/${product._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Lỗi API:", errorText);
        throw new Error(`Lỗi HTTP: ${response.status} - ${errorText}`);
      }

      await response.json();
      showNotification("Cập nhật sản phẩm thành công", "success");
      router.push("/admin/products");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật sản phẩm.";
      console.error("Lỗi cập nhật sản phẩm:", error);
      setError(errorMessage);
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
      // Dọn dẹp URL xem trước
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setNewImagePreviews([]);
    }
  };

  if (loading && !product) {
    return <p className="text-center py-10">Đang tải thông tin sản phẩm...</p>;
  }

  if (error && !product) {
    return (
      <div className="error-container text-center py-10">
        <p className="error-message">{error}</p>
        <button
          className="retry-button mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center py-10">Không tìm thấy sản phẩm.</p>;
  }

  return (
    <div className="product-management-container">
      {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}
      {loading && <div className="processing-indicator">Đang xử lý...</div>}
      <div className="title_container">
        <h1>CHỈNH SỬA SẢN PHẨM</h1>
      </div>
      <div className="form-container">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleUpdate}>
          <label>Tên sản phẩm</label>
          <input
            type="text"
            value={product.name || ""}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
          <label>Giá</label>
          <input
            type="number"
            value={product.price || 0}
            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
            required
            min="0"
          />
          <label>Giá khuyến mãi (nếu có)</label>
          <input
            type="number"
            value={product.discountPrice ?? ""}
            onChange={(e) =>
              setProduct({ ...product, discountPrice: Number(e.target.value) || undefined })
            }
            min="0"
          />
          <label>Số lượng</label>
          <input
            type="number"
            value={product.stock || 0}
            onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
            required
            min="0"
          />
          <label>Danh mục</label>
          <select
            value={product.category?._id || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                category: categories.find((cat) => cat._id === e.target.value) || undefined,
              })
            }
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <label>Mô tả</label>
          <textarea
            value={product.description || ""}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
          <label>Thành phần (phân cách bằng dấu phẩy)</label>
          <input
            type="text"
            value={product.ingredients?.join(", ") || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                ingredients: e.target.value.split(",").map((item) => item.trim()).filter(Boolean),
              })
            }
          />
          <label>Hướng dẫn sử dụng (phân cách bằng dấu phẩy)</label>
          <input
            type="text"
            value={product.usage_instructions?.join(", ") || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                usage_instructions: e.target.value.split(",").map((item) => item.trim()).filter(Boolean),
              })
            }
          />
          <label>Điểm đặc biệt (phân cách bằng dấu phẩy)</label>
          <input
            type="text"
            value={product.special?.join(", ") || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                special: e.target.value.split(",").map((item) => item.trim()).filter(Boolean),
              })
            }
          />
          <label>Ảnh hiện tại</label>
          <div className="image-preview">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, index) => (
                <div key={index} className="image-container">
                  <img
                    src={`https://api-zeal.onrender.com/images/${img}`}
                    alt={`Ảnh hiện tại ${index + 1}`}
                    width="100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/placeholder.png";
                    }}
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeCurrentImage(index)}
                  >
                    Xóa
                  </button>
                </div>
              ))
            ) : (
              <p>Không có ảnh hiện tại</p>
            )}
          </div>
          <label>Ảnh mới (tối đa 4 ảnh)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {newImagePreviews.length > 0 && (
            <div className="image-preview">
              {newImagePreviews.map((preview, index) => (
                <div key={index} className="image-container">
                  <img src={preview} alt={`Ảnh mới ${index + 1}`} width="100" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeNewImage(index)}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="form-actions">
            <button className="confirm-btn" type="submit" disabled={loading}>
              Cập nhật
            </button>
            <button
              className="cancel-btn"
              type="button"
              onClick={() => router.push("/admin/products")}
              disabled={loading}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}