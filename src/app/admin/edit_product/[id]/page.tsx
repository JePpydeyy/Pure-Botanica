"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./editproduct.module.css";

const EditProduct = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    category: "",
    description: "",
    stock: "",
    images: [] as File[],
  });
  
  const editorRef = useRef<HTMLDivElement>(null);

  // Load existing product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        const productResponse = await fetch(`https://api-zeal.onrender.com/api/products/${productId}`);
        if (!productResponse.ok) {
          throw new Error("Không thể tải thông tin sản phẩm");
        }
        const productData = await productResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch("https://api-zeal.onrender.com/api/categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        // Set form data
        setFormData({
          name: productData.name || "",
          price: productData.price?.toString() || "",
          discountPrice: productData.discountPrice?.toString() || "",
          category: productData.category?._id || productData.category || "",
          description: productData.description || "",
          stock: productData.stock?.toString() || "",
          images: [], // New images to be uploaded
        });
        
        // Set existing images
        setExistingImages(productData.images || []);
        
        // Set description in editor
        if (editorRef.current && productData.description) {
          editorRef.current.innerHTML = productData.description;
        }
        
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        alert("Không thể tải thông tin sản phẩm");
        router.push("/admin/product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalImages = files.length + formData.images.length + existingImages.length;
      
      if (totalImages > 4) {
        alert("Tổng số ảnh không được vượt quá 4 ảnh.");
        return;
      }
      
      setFormData((prevState) => ({
        ...prevState,
        images: [...prevState.images, ...files],
      }));
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleDescriptionChange = () => {
    if (editorRef.current) {
      setFormData((prevState) => ({
        ...prevState,
        description: editorRef.current!.innerHTML,
      }));
    }
  };

  const insertList = (type: 'ul' | 'ol') => {
    execCommand(`insert${type === 'ul' ? 'UnorderedList' : 'OrderedList'}`);
  };

  const changeFontSize = (size: string) => {
    execCommand('fontSize', size);
  };

  const changeFontFamily = (font: string) => {
    execCommand('fontName', font);
  };

  const insertHeading = (level: string) => {
    execCommand('formatBlock', `<h${level}>`);
  };

  const changeTextAlign = (align: string) => {
    execCommand(`justify${align}`);
  };

  const removeNewImage = (index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("price", formData.price);

      if (formData.discountPrice.trim() !== "") {
        productData.append("discountPrice", String(Number(formData.discountPrice)));
      }

      productData.append("category", formData.category);
      productData.append("description", formData.description);
      productData.append("stock", formData.stock);

      // Add new images
      formData.images.forEach((file) => {
        productData.append("images", file);
      });

      // Add existing images that weren't removed
      productData.append("existingImages", JSON.stringify(existingImages));

      const response = await fetch(`https://api-zeal.onrender.com/api/products/${productId}`, {
        method: "PUT",
        body: productData,
      });

      if (response.ok) {
        alert("Cập nhật sản phẩm thành công");
        router.push("/admin/product");
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert(errorData.message || "Đã xảy ra lỗi khi cập nhật sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm.");
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
          onClick={() => router.push("/admin/product")}
          className={styles.backButton}
        >
          ← Quay lại
        </button>
      </div>
      
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
                name="category" 
                value={formData.category} 
                onChange={handleSelectChange} 
                className={styles.select} 
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Giá gốc *</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleInputChange} 
                className={styles.input} 
                required 
                placeholder="0"
                min="0"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Giá khuyến mãi</label>
              <input 
                type="number" 
                name="discountPrice" 
                value={formData.discountPrice} 
                onChange={handleInputChange} 
                className={styles.input} 
                placeholder="0"
                min="0"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Số lượng *</label>
              <input 
                type="number" 
                name="stock" 
                value={formData.stock} 
                onChange={handleInputChange} 
                className={styles.input} 
                required 
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Rich Text Editor cho mô tả */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Mô tả sản phẩm *</label>
          
          {/* Toolbar */}
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
                onClick={() => execCommand('bold')}
                title="Đậm"
              >
                <strong>B</strong>
              </button>
              <button 
                type="button" 
                className={styles.toolbarBtn}
                onClick={() => execCommand('italic')}
                title="Nghiêng"
              >
                <em>I</em>
              </button>
              <button 
                type="button" 
                className={styles.toolbarBtn}
                onClick={() => execCommand('underline')}
                title="Gạch chân"
              >
                <u>U</u>
              </button>
              <button 
                type="button" 
                className={styles.toolbarBtn}
                onClick={() => execCommand('strikeThrough')}
                title="Gạch ngang"
              >
                <s>S</s>
              </button>
            </div>

            <div className={styles.toolbarGroup}>
              <button 
                type="button" 
                className={styles.toolbarBtn}
                onClick={() => changeTextAlign('Left')}
                title="Căn trái"
              >
                ≡
              </button>
              <button 
                type="button" 
                className={styles.toolbarBtn}
                onClick={() => changeTextAlign('Center')}
                title="Căn giữa"
              >
                ≣
              </button>
              <button 
                type="button" 
                className={styles.toolbarBtn}
                onClick={() => changeTextAlign('Right')}
                title="Căn phải"
              >
                ≡
              </button>
              <button 
                type="button" 
                className={styles.toolbarBtn}
                onClick={() => changeTextAlign('Full')}
                title="Căn ều"
              >
                ≣
              </button>
            </div>

            <div className={styles.toolbarGroup}>
              <button 
                type="button" 
                className={styles.toolbarBtn}
                onClick={() => insertList('ul')}
                title="Danh sách không đánh số"
              >
                • List
              </button>
              <button 
                type="button" 
                className={styles.toolbarBtn}
                onClick={() => insertList('ol')}
                title="Danh sách đánh số"
              >
                1. List
              </button>
            </div>
          </div>

          {/* Editor Content */}
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
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className={styles.imageSection}>
              <h4 className={styles.sectionTitle}>Ảnh hiện tại:</h4>
              <div className={styles.imagePreview}>
                {existingImages.map((img, idx) => (
                  <div key={idx} className={styles.imageItem}>
                    <img 
                      src={`https://api-zeal.onrender.com/images/${img}`}
                      alt={`Existing ${idx + 1}`}
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

          {/* Upload New Images */}
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
                existingImages.length + formData.images.length >= 4 ? styles.disabled : ''
              }`}
            >
              <div className={styles.uploadIcon}>📷</div>
              <span>
                {existingImages.length + formData.images.length >= 4 
                  ? 'Đã đạt giới hạn 4 ảnh' 
                  : 'Thêm ảnh mới'
                }
              </span>
            </label>
          </div>
          
          {/* New Images Preview */}
          {formData.images.length > 0 && (
            <div className={styles.imageSection}>
              <h4 className={styles.sectionTitle}>Ảnh mới sẽ thêm:</h4>
              <div className={styles.imagePreview}>
                {formData.images.map((img, idx) => (
                  <div key={idx} className={styles.imageItem}>
                    <img 
                      src={URL.createObjectURL(img)} 
                      alt={`New Preview ${idx + 1}`}
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
          <button type="submit" className={styles.submitButton}>
            <span>✓</span> Cập nhật sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;