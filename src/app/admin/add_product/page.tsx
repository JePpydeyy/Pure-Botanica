"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./add_product.module.css";

const AddProduct = () => {
  const [categories, setCategories] = useState<any[]>([]);
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://api-zeal.onrender.com/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

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
      if (files.length + formData.images.length > 4) {
        alert("Chỉ được chọn tối đa 4 ảnh.");
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

  const removeImage = (index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
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

      formData.images.forEach((file) => {
        productData.append("images", file);
      });

      const response = await fetch("https://api-zeal.onrender.com/api/products", {
        method: "POST",
        body: productData,
      });

      if (response.ok) {
        alert("Thêm sản phẩm thành công");
        setFormData({
          name: "",
          price: "",
          discountPrice: "",
          category: "",
          description: "",
          stock: "",
          images: [],
        });
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert(errorData.message || "Đã xảy ra lỗi khi thêm sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi gửi sản phẩm:", error);
      alert("Có lỗi xảy ra khi gửi sản phẩm.");
    }
  };

  return (
    <div className={styles.addProductContainer}>
      <h1 className={styles.title}>Thêm sản phẩm</h1>
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
                title="Căn đều"
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
          <label className={styles.label}>Hình ảnh sản phẩm (tối đa 4 ảnh)</label>
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
                  <img 
                    src={URL.createObjectURL(img)} 
                    alt={`Preview ${idx + 1}`}
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