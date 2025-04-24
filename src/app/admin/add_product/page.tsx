"use client";
import React, { useState, useEffect } from "react";
import "../add_product/add_product.css";

const AddProduct = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    category: "",
    description: "",
    ingredients: "",
    usage_instructions: "",
    special: "",
    stock: "",
    images: [] as File[],
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("price", formData.price);

      // Thêm discountPrice nếu có
      if (formData.discountPrice.trim() !== "") {
        productData.append("discountPrice", String(Number(formData.discountPrice)));
      }

      productData.append("category", formData.category);
      productData.append("description", formData.description);
      productData.append("stock", formData.stock);

      productData.append(
        "ingredients",
        JSON.stringify(formData.ingredients.split("\n").filter(Boolean))
      );
      productData.append(
        "usage_instructions",
        JSON.stringify(formData.usage_instructions.split("\n").filter(Boolean))
      );
      productData.append(
        "special",
        JSON.stringify(formData.special.split("\n").filter(Boolean))
      );

      formData.images.forEach((file) => {
        productData.append("images", file);
      });

      // Debug log
      console.log("FormData gửi đi:");
      for (const [key, value] of productData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch("https://api-zeal.onrender.com/api/products", {
        method: "POST",
        body: productData,
      });

      if (response.ok) {
        alert("✅ Sản phẩm đã được thêm thành công!");
        setFormData({
          name: "",
          price: "",
          discountPrice: "",
          category: "",
          description: "",
          ingredients: "",
          usage_instructions: "",
          special: "",
          stock: "",
          images: [],
        });
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert(errorData.message || "❌ Đã xảy ra lỗi khi thêm sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi gửi sản phẩm:", error);
      alert("❌ Có lỗi xảy ra khi gửi sản phẩm.");
    }
  };

  return (
    <div className="add-product-container">
      <h1>Thêm sản phẩm</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên sản phẩm</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Giá</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Giá khuyến mãi</label>
          <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} />
        </div>
        <div>
          <label>Danh mục</label>
          <select name="category" value={formData.category} onChange={handleSelectChange} required>
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Mô tả</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Thành phần (mỗi dòng một mục)</label>
          <textarea name="ingredients" value={formData.ingredients} onChange={handleInputChange} />
        </div>
        <div>
          <label>Hướng dẫn sử dụng (mỗi dòng một bước)</label>
          <textarea name="usage_instructions" value={formData.usage_instructions} onChange={handleInputChange} />
        </div>
        <div>
          <label>Đặc điểm nổi bật (mỗi dòng một đặc điểm)</label>
          <textarea name="special" value={formData.special} onChange={handleInputChange} />
        </div>
        <div>
          <label>Số lượng</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Hình ảnh (tối đa 4 ảnh)</label>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} />
          {formData.images.length > 0 && (
            <ul>
              {formData.images.map((img, idx) => (
                <li key={idx}>{img.name}</li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">Thêm sản phẩm</button>
      </form>
    </div>
  );
};

export default AddProduct;
