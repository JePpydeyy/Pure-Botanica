"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import styles from "./editproduct.module.css";

// Định nghĩa các giao diện TypeScript
interface Option {
  value: string;
  price: number;
  stock: number;
  discount_price?: number;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  status: "show" | "hidden";
  view: number;
  id_brand: string;
  id_category: string;
  images: string[];
  short_description: string;
  description: string;
  option: Option[];
}

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error";
}

const EditProduct = () => {
  const router = useRouter();
  const { id: slug } = useParams(); // Sử dụng slug làm tham số
  const editorRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "success" });
  const [formData, setFormData] = useState({
    name: "",
    status: "show" as "show" | "hidden",
    id_category: "",
    id_brand: "",
    short_description: "",
    description: "",
    option: [{ value: "", price: 0, stock: 0, discount_price: 0 }],
    images: [] as File[],
  });

  // Chuẩn hóa URL hình ảnh
  const normalizeImageUrl = (path: string): string => {
    return path.startsWith("/images/")
      ? `https://api-zeal.onrender.com${path}`
      : `https://api-zeal.onrender.com/images/${path.replace(/^images\//, "")}`;
  };

  // Kiểm tra quyền admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/user/login");
    }
  }, [router]);

  // Load dữ liệu sản phẩm, danh mục và thương hiệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch product details
        const productResponse = await fetch(`https://api-zeal.onrender.com/api/products/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (productResponse.status === 401 || productResponse.status === 403) {
          alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("email");
          router.push("/user/login");
          return;
        }
        if (!productResponse.ok) {
          throw new Error("Không thể tải thông tin sản phẩm");
        }
        const productData: Product = await productResponse.json();

        // Fetch categories
        const categoriesResponse = await fetch("https://api-zeal.onrender.com/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!categoriesResponse.ok) throw new Error("Không thể tải danh mục");
        const categoriesData: Category[] = await categoriesResponse.json();

        // Fetch brands
        const brandsResponse = await fetch("https://api-zeal.onrender.com/api/brands", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!brandsResponse.ok) throw new Error("Không thể tải thương hiệu");
        const brandsData: Brand[] = await brandsResponse.json();

        // Set state
        setCategories(categoriesData);
        setBrands(brandsData);
        setFormData({
          name: productData.name || "",
          status: productData.status || "show",
          id_category: productData.id_category || "",
          id_brand: productData.id_brand || "",
          short_description: productData.short_description || "",
          description: productData.description || "",
          option: productData.option && productData.option.length > 0
            ? productData.option.map(opt => ({
                ...opt,
                discount_price: typeof opt.discount_price === "number" ? opt.discount_price : 0,
              }))
            : [{ value: "", price: 0, stock: 0, discount_price: 0 }],
          images: [],
        });
        setExistingImages(productData.images || []);

        // Set description in editor
        if (editorRef.current && productData.description) {
          editorRef.current.innerHTML = productData.description;
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        showNotification("Không thể tải thông tin sản phẩm hoặc danh mục/thương hiệu", "error");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug, router]);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, field: string, value: string | number) => {
    setFormData((prev) => {
      const newOptions = [...prev.option];
      newOptions[index] = { ...newOptions[index], [field]: value };
      return { ...prev, option: newOptions };
    });
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      option: [...prev.option, { value: "", price: 0, stock: 0, discount_price: 0 }],
    }));
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      option: prev.option.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalImages = files.length + formData.images.length + existingImages.length;
      if (totalImages > 4) {
        showNotification("Tổng số ảnh không được vượt quá 4 ảnh", "error");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleDescriptionChange = () => {
    if (editorRef.current) {
      setFormData((prev) => ({
        ...prev,
        description: editorRef.current!.innerHTML,
      }));
    }
  };

  const insertList = (type: "ul" | "ol") => {
    execCommand(`insert${type === "ul" ? "UnorderedList" : "OrderedList"}`);
  };

  const changeFontSize = (size: string) => {
    execCommand("fontSize", size);
  };

  const changeFontFamily = (font: string) => {
    execCommand("fontName", font);
  };

  const insertHeading = (level: string) => {
    execCommand("formatBlock", `<h${level}>`);
  };

  const changeTextAlign = (align: string) => {
    execCommand(`justify${align}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("status", formData.status);
      productData.append("id_category", formData.id_category);
      productData.append("id_brand", formData.id_brand);
      productData.append("short_description", formData.short_description);
      productData.append("description", formData.description);
      productData.append("option", JSON.stringify(formData.option));

      // Thêm hình ảnh mới
      formData.images.forEach((file) => {
        productData.append("images", file);
      });

      // Thêm danh sách hình ảnh hiện tại
      productData.append("existingImages", JSON.stringify(existingImages));

      const response = await fetch(`https://api-zeal.onrender.com/api/products/${slug}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: productData,
      });

      if (response.status === 401 || response.status === 403) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        router.push("/user/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Lỗi API: ${response.status} ${response.statusText}`);
      }

      showNotification("Cập nhật sản phẩm thành công", "success");
      router.push("/admin/products");
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      showNotification("Đã xảy ra lỗi khi cập nhật sản phẩm", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className={styles.editProductContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Chỉnh sửa sản phẩm</h1>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className={styles.backButton}
        >
          ← Quay lại
        </button>
      </div>

      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Thông tin cơ bản */}
        <div className={styles.basicInfo}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tên sản phẩm *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
                required
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Danh mục *</label>
              <select
                name="id_category"
                value={formData.id_category}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Thương hiệu *</label>
              <select
                name="id_brand"
                value={formData.id_brand}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">-- Chọn thương hiệu --</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Trạng thái *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="show">Hiển thị</option>
                <option value="hidden">Ẩn</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Mô tả ngắn</label>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Nhập mô tả ngắn"
            />
          </div>
        </div>

        {/* Tùy chọn sản phẩm */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Tùy chọn sản phẩm</label>
          {formData.option.map((opt, index) => (
            <div key={index} className={styles.optionGroup}>
              <input
                type="text"
                placeholder="Kích thước/Màu sắc (VD: M, L, XL)"
                value={opt.value}
                onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                className={styles.input}
                required
              />
              <input
                type="number"
                placeholder="Giá"
                value={opt.price}
                onChange={(e) => handleOptionChange(index, "price", Number(e.target.value))}
                className={styles.input}
                required
                min="0"
              />
              <input
                type="number"
                placeholder="Tồn kho"
                value={opt.stock}
                onChange={(e) => handleOptionChange(index, "stock", Number(e.target.value))}
                className={styles.input}
                required
                min="0"
              />
              <input
                type="number"
                placeholder="Giá khuyến mãi (tùy chọn)"
                value={opt.discount_price || ""}
                onChange={(e) => handleOptionChange(index, "discount_price", Number(e.target.value))}
                className={styles.input}
                min="0"
              />
              {formData.option.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className={styles.removeOptionBtn}
                >
                  Xóa
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOption} className={styles.addOptionBtn}>
            Thêm tùy chọn
          </button>
        </div>

        {/* Rich Text Editor cho mô tả */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Mô tả chi tiết *</label>
          <div className={styles.toolbar}>
            <div className={styles.toolbarGroup}>
              <select
                className={styles.toolbarSelect}
                onChange={(e) => changeFontFamily(e.target.value)}
                defaultValue=""
              >
                <option value="">Font</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
              <select
                className={styles.toolbarSelect}
                onChange={(e) => changeFontSize(e.target.value)}
                defaultValue=""
              >
                <option value="">Size</option>
                <option value="1">8pt</option>
                <option value="2">10pt</option>
                <option value="3">12pt</option>
                <option value="4">14pt</option>
                <option value="5">18pt</option>
                <option value="6">24pt</option>
                <option value="7">36pt</option>
              </select>
              <select
                className={styles.toolbarSelect}
                onChange={(e) => insertHeading(e.target.value)}
                defaultValue=""
              >
                <option value="">Heading</option>
                <option value="1">H1</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
                <option value="4">H4</option>
                <option value="5">H5</option>
                <option value="6">H6</option>
              </select>
            </div>
            <div className={styles.toolbarGroup}>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={() => execCommand("bold")}
                title="Đậm"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={() => execCommand("italic")}
                title="Nghiêng"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={() => execCommand("underline")}
                title="Gạch chân"
              >
                <u>U</u>
              </button>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={() => execCommand("strikeThrough")}
                title="Gạch ngang"
              >
                <s>S</s>
              </button>
            </div>
            <div className={styles.toolbarGroup}>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={() => changeTextAlign("Left")}
                title="Căn trái"
              >
                ≡
              </button>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={() => changeTextAlign("Center")}
                title="Căn giữa"
              >
                ≣
              </button>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={() => changeTextAlign("Right")}
                title="Căn phải"
              >
                ≡
              </button>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={() => changeTextAlign("Full")}
                title="Căn đều"
              >
                ≣
              </button>
            </div>
            <div className={styles.toolbarGroup}>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={() => insertList("ul")}
                title="Danh sách không đánh số"
              >
                • List
              </button>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={() => insertList("ol")}
                title="Danh sách đánh số"
              >
                1. List
              </button>
            </div>
          </div>
          <div
            ref={editorRef}
            className={styles.editor}
            contentEditable
            onInput={handleDescriptionChange}
            data-placeholder="Nhập mô tả sản phẩm chi tiết, thành phần, hướng dẫn sử dụng, đặc điểm nổi bật..."
          />
        </div>

        {/* Hình ảnh */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Hình ảnh sản phẩm</label>
          {existingImages.length > 0 && (
            <div className={styles.imageSection}>
              <h4 className={styles.sectionTitle}>Ảnh hiện tại:</h4>
              <div className={styles.imagePreview}>
                {existingImages.map((img, idx) => (
                  <div key={idx} className={styles.imageItem}>
                    <Image
                      src={normalizeImageUrl(img)}
                      alt={`Existing ${idx + 1}`}
                      width={100}
                      height={100}
                      className={styles.previewImage}
                    />
                    <div className={styles.imageInfo}>
                      <span className={styles.imageName}>Ảnh {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className={styles.removeBtn}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className={styles.imageUploadArea}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className={styles.fileInput}
              id="imageInput"
              disabled={existingImages.length + formData.images.length >= 4}
            />
            <label
              htmlFor="imageInput"
              className={`${styles.uploadLabel} ${
                existingImages.length + formData.images.length >= 4 ? styles.disabled : ""
              }`}
            >
              <div className={styles.uploadIcon}>📷</div>
              <span>
                {existingImages.length + formData.images.length >= 4
                  ? "Đã đạt giới hạn 4 ảnh"
                  : "Thêm ảnh mới"}
              </span>
            </label>
          </div>
          {formData.images.length > 0 && (
            <div className={styles.imageSection}>
              <h4 className={styles.sectionTitle}>Ảnh mới sẽ thêm:</h4>
              <div className={styles.imagePreview}>
                {formData.images.map((img, idx) => (
                  <div key={idx} className={styles.imageItem}>
                    <Image
                      src={URL.createObjectURL(img)}
                      alt={`New Preview ${idx + 1}`}
                      width={100}
                      height={100}
                      className={styles.previewImage}
                    />
                    <div className={styles.imageInfo}>
                      <span className={styles.imageName}>{img.name}</span>
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className={styles.removeBtn}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => router.push("/admin/product")}
            className={styles.cancelButton}
          >
            Hủy
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            <span>✓</span> Cập nhật sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;