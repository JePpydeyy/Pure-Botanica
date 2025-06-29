"use client";
import styles from "./Product.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Updated Product interface to match the actual API data structure
interface ProductOption {
  _id: string;
  stock: number;
  value: string;
  price: number;
  discount_price?: number;
}

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
  option: ProductOption[];
  createdAt: string;
  updatedAt?: string;
  createdAT?: string;
  // Optional fields for populated data
  category?: {
    _id: string;
    name: string;
  };
  brand?: {
    _id: string;
    name: string;
  };
  // Computed fields
  price?: number;
  stock?: number;
}

interface Category {
  _id: string;
  name: string;
}

const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return "0đ";
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const getImageUrl = (image: string): string => {
  if (!image) return "/images/placeholder.png";
  // Remove leading slash if present
  const cleanImage = image.startsWith('/') ? image.substring(1) : image;
  return `https://api-zeal.onrender.com/${cleanImage}`;
};

// Helper function to extract price from product options
const getProductPrice = (product: Product): number => {
  if (product.option && product.option.length > 0) {
    return product.option[0].discount_price || product.option[0].price;
  }
  return 0;
};

// Helper function to extract stock from product options
const getProductStock = (product: Product): number => {
  if (product.option && product.option.length > 0) {
    return product.option.reduce((total, opt) => total + opt.stock, 0);
  }
  return 0;
};

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const productsPerPage = 9;
  const searchParams = useSearchParams();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("https://api-zeal.onrender.com/api/products");
        if (!response.ok) {
          throw new Error(`Lỗi tải sản phẩm: ${response.status}`);
        }
        const data: Product[] = await response.json();
        
        // Process products to add computed fields
        const processedProducts = data.map(product => ({
          ...product,
          price: getProductPrice(product),
          stock: getProductStock(product)
        }));
        
        console.log("Products:", processedProducts);
        setProducts(processedProducts);
        setFilteredProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api-zeal.onrender.com/api/categories");
        if (!res.ok) {
          throw new Error(`Lỗi tải danh mục: ${res.status}`);
        }
        const data: Category[] = await res.json();
        console.log("Categories from API:", data);
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Không thể tải danh mục. Vui lòng thử lại sau.");
      }
    };
    fetchCategories();
  }, []);

  // Apply filter based on URL query parameter
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    console.log("Raw category from URL:", categoryFromUrl);

    // Reset to all products if no category in URL
    if (!categoryFromUrl) {
      console.log("No category in URL, resetting to all products");
      setActiveCategory(null);
      setFilteredProducts(products);
      setCurrentPage(1);
      return;
    }

    // Wait for products and categories to be loaded
    if (products.length === 0 || categories.length === 0) {
      console.log("Waiting for products/categories to load...");
      return;
    }

    // Decode the category from URL
    const decodedCategory = decodeURIComponent(categoryFromUrl);
    console.log("Decoded category from URL:", decodedCategory);

    // Find category by name
    const foundCategory = categories.find(cat => cat.name === decodedCategory);
    
    if (foundCategory) {
      console.log("Category found:", foundCategory);
      const filtered = products.filter(
        (product) => product.id_category === foundCategory._id
      );
      console.log("Filtered products count:", filtered.length);
      setActiveCategory(decodedCategory);
      setFilteredProducts(filtered);
    } else if (decodedCategory === "Tất cả") {
      console.log("Category is 'Tất cả', showing all products");
      setActiveCategory(null);
      setFilteredProducts(products);
    } else {
      console.log("Category not found, resetting to all products:", decodedCategory);
      setActiveCategory(null);
      setFilteredProducts(products);
    }
    setCurrentPage(1);
  }, [searchParams, products, categories]);

  // Filter products by category (for sidebar clicks)
  const filterProducts = (categoryName: string) => {
    console.log("Filtering category (sidebar):", categoryName);
    if (categoryName === "Tất cả") {
      setFilteredProducts(products);
      setActiveCategory(null);
    } else {
      const foundCategory = categories.find(cat => cat.name === categoryName);
      if (foundCategory) {
        const filtered = products.filter(
          (product) => product.id_category === foundCategory._id
        );
        console.log("Filtered products (sidebar) count:", filtered.length);
        setFilteredProducts(filtered);
        setActiveCategory(categoryName);
      }
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredProducts, currentPage, totalPages]);

  const getTopStockProducts = (products: Product[], count: number): Product[] => {
    const validProducts = products.filter(product => 
      product.stock !== undefined && 
      product.stock !== null && 
      !isNaN(product.stock) &&
      product.stock > 0
    );
    
    const sortedProducts = [...validProducts].sort((a, b) => (b.stock || 0) - (a.stock || 0));
    return sortedProducts.slice(0, count);
  };

  const bestSellingProducts = getTopStockProducts(products, 5);

  return (
    <div>
      <section className={styles.productBanner}>
        <img src="/images/productBanner.png" alt="Banner" className={styles["banner-image"]} />
      </section>
      <h1 className={styles["product-main-title"]}>Danh sách sản phẩm</h1>
      <div className={styles.containerBox}>
        <aside className={styles.productSidebar}>
          <h3 className={styles["sidebar-title"]}>DANH MỤC SẢN PHẨM</h3>
          <ul className={styles["menu-list"]}>
            <li
              className={styles["menu-list-item"]}
              onClick={() => filterProducts("Tất cả")}
            >
              <span
                className={styles["menu-title"]}
                style={{
                  color: activeCategory === null ? "#8D5524" : "#357E38",
                  cursor: "pointer",
                }}
              >
                Tất cả
              </span>
            </li>
            {categories.length > 0 ? (
              categories.map((category) => (
                <li
                  key={category._id}
                  className={styles["menu-list-item"]}
                  onClick={() => {
                    console.log("Clicked category:", category.name);
                    filterProducts(category.name);
                  }}
                >
                  <span
                    className={styles["menu-title"]}
                    style={{
                      color: activeCategory === category.name ? "#8D5524" : "#357E38",
                      cursor: "pointer",
                    }}
                  >
                    {category.name}
                  </span>
                </li>
              ))
            ) : (
              <li className={styles["no-products"]}>Không có danh mục nào.</li>
            )}
          </ul>
        </aside>
        <section className={styles.productContainer}>
          {error ? (
            <p className={styles["no-products"]}>{error}</p>
          ) : isLoading ? (
            <p className={styles["no-products"]}>Đang tải sản phẩm...</p>
          ) : currentProducts.length > 0 ? (
            <div className={styles.productGrid}>
              {currentProducts.map((product) => (
                <Link
                  href={`/user/detail/${product.slug}`}
                  key={product._id}
                  className={`${styles.productItem} ${styles["product-link"]}`}
                >
                  <div>
                    <Image
                      src={
                        product.images && product.images.length > 0
                          ? getImageUrl(product.images[0])
                          : "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={product?.name || "Sản phẩm"}
                      width={300}
                      height={200}
                      className={styles["product-image"]}
                    />
                    <div>
                      <h4 className={styles["product-item-name"]}>{product?.name || "Tên sản phẩm"}</h4>
                      <div className={styles["product-card"]}>
                        <p className={styles.price}>{formatPrice(product?.price)}</p>
                        <span title="Thêm vào Giỏ Hàng" className={styles.cartIcon}>
                          <i className="fas fa-shopping-cart"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles["no-products"]}>
              {activeCategory
                ? `Không tìm thấy sản phẩm trong danh mục "${activeCategory}"`
                : "Không có sản phẩm nào."}
            </p>
          )}
          {totalPages > 1 && (
            <div className={styles.productPagination}>
              <button
                type="button"
                title="Trang trước"
                className={`${styles["page-btn"]} ${currentPage === 1 ? styles.disabled : ""}`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              {(() => {
                const paginationRange = [];
                let start = Math.max(1, currentPage - 1);
                let end = Math.min(totalPages, start + 2);
                if (end - start < 2) {
                  start = Math.max(1, end - 2);
                }
                if (start > 1) {
                  paginationRange.push(
                    <span key="start-ellipsis" className={styles["ellipsis"]}>
                      ...
                    </span>
                  );
                }
                for (let i = start; i <= end; i++) {
                  paginationRange.push(
                    <button
                      key={`page-${i}`}
                      className={`${styles["page-btn"]} ${currentPage === i ? styles.active : ""}`}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i}
                    </button>
                  );
                }
                if (end < totalPages) {
                  paginationRange.push(
                    <span key="end-ellipsis" className={styles["ellipsis"]}>
                      ...
                    </span>
                  );
                }
                return paginationRange;
              })()}
              <button
                type="button"
                title="Trang sau"
                className={`${styles["page-btn"]} ${
                  currentPage === totalPages ? styles.disabled : ""
                }`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                <span className="sr-only">Trang sau</span>
              </button>
            </div>
          )}
        </section>
      </div>
      <div className={styles["best-selling-products"]}>
        <h3 className={styles["slider-title"]}>Có thể bạn sẽ thích</h3>
        <div className={styles["best-selling-grid"]}>
          {bestSellingProducts.length > 0 ? (
            bestSellingProducts.map((product) => (
              <Link
                href={`/user/detail/${product.slug}`}
                key={product._id}
                className={styles["best-selling-link"]}
              >
                <div className={styles["best-selling-card"]}>
                  <div className={styles["best-selling-badge"]}>Sale</div>
                  <div className={styles["best-selling-image"]}>
                    <Image
                      src={getImageUrl(product.images?.[0] || "")}
                      alt={product?.name || "Sản phẩm"}
                      width={200}
                      height={200}
                      className={styles["best-selling-product-image"]}
                    />
                  </div>
                  <div className={styles["best-selling-details"]}>
                    <h3 className={styles["best-selling-product-name"]}>{product?.name || "Tên sản phẩm"}</h3>
                    <p className={styles["best-selling-price"]}>{formatPrice(product?.price)}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className={styles["no-products"]}>Đang tải sản phẩm...</p>
          )}
        </div>
      </div>
    </div>
  );
}