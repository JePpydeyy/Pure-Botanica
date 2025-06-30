"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./add_product.module.css";

// Định nghĩa giao diện TypeScript
interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
  status: "show" | "hidden";
}

interface Option {
  value: string;
  price: string;
  discount_price: string;
  stock: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error";
}

interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  justifyLeft: boolean;
  justifyCenter: boolean;
  justifyRight: boolean;
  justifyFull: boolean;
  insertUnorderedList: boolean;
  insertOrderedList: boolean;
}

const AddProduct = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    id_category: "",
    id_brand: "",
    short_description: "",
    description: "",
    options: [{ value: "", price: "", discount_price: "", stock: "" }] as Option[],
    images: [] as File[],
  });
  const [notification, setNotification] = useState<Notification>({ 
    show: false, 
    message: "", 
    type: "success" 
  });
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
    insertUnorderedList: false,
    insertOrderedList: false
  });
  
  const editorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Kiểm tra quyền admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/user/login");
    }
  }, [router]);

  // Lấy danh mục và thương hiệu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://api-zeal.onrender.com/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (response.status === 401 || response.status === 403) {
          alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          localStorage.removeItem("token");
          router.push("/user/login");
          return;
        }
        if (!response.ok) throw new Error(`Lỗi API: ${response.status}`);
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        showNotification("Không thể tải danh mục", "error");
      }
    };

    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://api-zeal.onrender.com/api/brands", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (response.status === 401 || response.status === 403) {
          alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          localStorage.removeItem("token");
          router.push("/user/login");
          return;
        }
        if (!response.ok) throw new Error(`Lỗi API: ${response.status}`);
        const data: Brand[] = await response.json();
        setBrands(data);
      } catch (error) {
        console.error("Lỗi khi tải thương hiệu:", error);
        showNotification("Không thể tải thương hiệu", "error");
      }
    };

    fetchCategories();
    fetchBrands();
  }, [router]);

  // Event listeners cho editor để theo dõi trạng thái formatting
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleSelectionChange = () => {
      updateFormatStates();
    };

    const handleKeyUp = () => {
      updateFormatStates();
    };

    const handleMouseUp = () => {
      updateFormatStates();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    editor.addEventListener('keyup', handleKeyUp);
    editor.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      if (editor) {
        editor.removeEventListener('keyup', handleKeyUp);
        editor.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, []);

  // Hàm kiểm tra trạng thái format hiện tại
  const updateFormatStates = () => {
    if (!editorRef.current) return;
    
    const newStates: ActiveFormats = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      justifyLeft: document.queryCommandState('justifyLeft'),
      justifyCenter: document.queryCommandState('justifyCenter'),
      justifyRight: document.queryCommandState('justifyRight'),
      justifyFull: document.queryCommandState('justifyFull'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList')
    };
    
    setActiveFormats(newStates);
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOptionChange = (index: number, field: string, value: string) => {
    setFormData((prevState) => {
      const newOptions = [...prevState.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      return { ...prevState, options: newOptions };
    });
  };

  const addOption = () => {
    setFormData((prevState) => ({
      ...prevState,
      options: [...prevState.options, { value: "", price: "", discount_price: "", stock: "" }],
    }));
  };

  const removeOption = (index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      options: prevState.options.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + formData.images.length > 4) {
        showNotification("Chỉ được chọn tối đa 4 ảnh.", "error");
        return;
      }
      setFormData((prevState) => ({
        ...prevState,
        images: [...prevState.images, ...files],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    // Cập nhật trạng thái sau khi thực hiện lệnh
    setTimeout(updateFormatStates, 10);
  };

  const handleDescriptionChange = () => {
    if (editorRef.current) {
      setFormData((prevState) => ({
        ...prevState,
        description: editorRef.current!.innerHTML,
      }));
    }
    updateFormatStates();
  };

  const insertList = (type: "ul" | "ol") => {
    execCommand(`insert${type === "ul" ? "UnorderedList" : "OrderedList"}`);
  };

  const changeFontSize = (size: string) => {
    if (size) {
      execCommand("fontSize", size);
    }
  };

  const changeFontFamily = (font: string) => {
    if (font) {
      execCommand("fontName", font);
    }
  };

  const insertHeading = (level: string) => {
    if (level) {
      execCommand("formatBlock", `<h${level}>`);
    }
  };

  const changeTextAlign = (align: string) => {
    execCommand(`justify${align}`);
  };

  // Render toolbar với trạng thái active
  const renderToolbar = () => (
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
          className={`${styles.toolbarBtn} ${activeFormats.bold ? styles.active : ''}`}
          onClick={() => execCommand("bold")}
          title="Đậm"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={`${styles.toolbarBtn} ${activeFormats.italic ? styles.active : ''}`}
          onClick={() => execCommand("italic")}
          title="Nghiêng"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={`${styles.toolbarBtn} ${activeFormats.underline ? styles.active : ''}`}
          onClick={() => execCommand("underline")}
          title="Gạch chân"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          className={`${styles.toolbarBtn} ${activeFormats.strikeThrough ? styles.active : ''}`}
          onClick={() => execCommand("strikeThrough")}
          title="Gạch ngang"
        >
          <s>S</s>
        </button>
      </div>

      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={`${styles.toolbarBtn} ${activeFormats.insertUnorderedList ? styles.active : ''}`}
          onClick={() => insertList("ul")}
          title="Danh sách không đánh số"
        >
          • List
        </button>
        <button
          type="button"
          className={`${styles.toolbarBtn} ${activeFormats.insertOrderedList ? styles.active : ''}`}
          onClick={() => insertList("ol")}
          title="Danh sách đánh số"
        >
          1. List
        </button>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Xác thực dữ liệu
    if (!formData.name || !formData.id_category || !formData.id_brand || !formData.short_description || !formData.description) {
      showNotification("Vui lòng điền đầy đủ các trường bắt buộc.", "error");
      return;
    }
    if (formData.options.some(opt => !opt.value || !opt.price || !opt.stock)) {
      showNotification("Vui lòng điền đầy đủ thông tin cho tất cả tùy chọn.", "error");
      return;
    }
    if (formData.images.length === 0) {
      showNotification("Vui lòng chọn ít nhất một hình ảnh.", "error");
      return;
    }

    try {
      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("id_category", formData.id_category);
      productData.append("id_brand", formData.id_brand);
      productData.append("short_description", formData.short_description);
      productData.append("description", formData.description);
      productData.append(
        "option",
        JSON.stringify(
          formData.options.map(opt => ({
            value: opt.value,
            price: Number(opt.price),
            discount_price: opt.discount_price ? Number(opt.discount_price) : undefined,
            stock: Number(opt.stock),
          }))
        )
      );
      formData.images.forEach((file) => {
        productData.append("images", file);
      });

      const token = localStorage.getItem("token");
      const response = await fetch("https://api-zeal.onrender.com/api/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: productData,
      });

      if (response.status === 401 || response.status === 403) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/user/login");
        return;
      }

      if (response.ok) {
        showNotification("Thêm sản phẩm thành công", "success");
        setFormData({
          name: "",
          id_category: "",
          id_brand: "",
          short_description: "",
          description: "",
          options: [{ value: "", price: "", discount_price: "", stock: "" }],
          images: [],
        });
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }
        // Reset active formats
        setActiveFormats({
          bold: false,
          italic: false,
          underline: false,
          strikeThrough: false,
          justifyLeft: false,
          justifyCenter: false,
          justifyRight: false,
          justifyFull: false,
          insertUnorderedList: false,
          insertOrderedList: false
        });
        router.push("/admin/product");
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || "Đã xảy ra lỗi khi thêm sản phẩm.", "error");
      }
    } catch (error) {
      console.error("Lỗi gửi sản phẩm:", error);
      showNotification("Có lỗi xảy ra khi gửi sản phẩm.", "error");
    }
  };

  return (
    <div className={styles.addProductContainer}>
      <h1 className={styles.title}>Thêm sản phẩm</h1>
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
                onChange={handleSelectChange}
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
            <div className={styles.formGroup}>
              <label className={styles.label}>Thương hiệu *</label>
              <select
                name="id_brand"
                value={formData.id_brand}
                onChange={handleSelectChange}
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
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Mô tả ngắn *</label>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              className={styles.textarea}
              required
              placeholder="Nhập mô tả ngắn (tối đa 200 ký tự)"
              maxLength={200}
            />
          </div>
        </div>

        {/* Tùy chọn sản phẩm */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Tùy chọn sản phẩm *</label>
          {formData.options.map((option, index) => (
            <div key={index} className={styles.optionRow}>
              <input
                type="text"
                placeholder="Kích thước (e.g., 50ml)"
                value={option.value}
                onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                className={styles.input}
                required
              />
              <input
                type="number"
                placeholder="Giá gốc"
                value={option.price}
                onChange={(e) => handleOptionChange(index, "price", e.target.value)}
                className={styles.input}
                required
                min="0"
              />
              <input
                type="number"
                placeholder="Giá khuyến mãi (tùy chọn)"
                value={option.discount_price}
                onChange={(e) => handleOptionChange(index, "discount_price", e.target.value)}
                className={styles.input}
                min="0"
              />
              <input
                type="number"
                placeholder="Số lượng"
                value={option.stock}
                onChange={(e) => handleOptionChange(index, "stock", e.target.value)}
                className={styles.input}
                required
                min="0"
              />
              {formData.options.length > 1 && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeOption(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addOptionBtn} onClick={addOption}>
            Thêm tùy chọn +
          </button>
        </div>

        {/* Rich Text Editor cho mô tả */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Mô tả chi tiết *</label>
          {renderToolbar()}
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
          <label className={styles.label}>Hình ảnh sản phẩm (tối đa 4 ảnh) *</label>
          <div className={styles.imageUploadArea}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className={styles.fileInput}
              id="imageInput"
            />
            <label htmlFor="imageInput" className={styles.uploadLabel}>
              <div className={styles.uploadIcon}>📷</div>
              <span>Chọn hình ảnh</span>
            </label>
          </div>
          {formData.images.length > 0 && (
            <div className={styles.imagePreview}>
              {formData.images.map((img, idx) => (
                <div key={idx} className={styles.imageItem}>
                  <Image
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${idx + 1}`}
                    width={100}
                    height={100}
                    className={styles.previewImage}
                  />
                  <div className={styles.imageInfo}>
                    <span className={styles.imageName}>{img.name}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className={styles.submitButton}>
          <span>✓</span> Thêm sản phẩm
        </button>
      </form>
    </div>
  );
};

export default AddProduct;