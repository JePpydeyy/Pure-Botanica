"use client";
import styles from "./Product.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/components/product_interface";

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const getImageUrl = (image: string): string => {
  if (!image) return "/images/placeholder.png";
  return `https://api-zeal.onrender.com/images/${image}`;
};

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const productsPerPage = 9;

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
        console.log("Products:", data);
        console.log(
          "Categories in products:",
          data.map((p) => ({ id: p._id, category: p.category?.name }))
        );
        setProducts(data);
        setFilteredProducts(data);
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
        const data = await res.json();
        console.log("Categories:", data);
        const categoryNames = data.map((cat: any) => cat.name);
        setCategories(["Tất cả", ...categoryNames]);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Không thể tải danh mục. Vui lòng thử lại sau.");
      }
    };
    fetchCategories();
  }, []);

  // Filter products by category
  const filterProducts = (category: string) => {
    console.log("Filtering category:", category);
    if (category === "Tất cả" || activeCategory === category) {
      setFilteredProducts(products);
      setActiveCategory(null);
    } else {
      const filtered = products.filter((product) => {
        if (!product.category || typeof product.category.name !== "string") return false;
        return product.category.name === category;
      });
      console.log("Filtered products:", filtered);
      setFilteredProducts(filtered.length > 0 ? filtered : []);
      setActiveCategory(category);
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
    const sortedProducts = [...products].sort((a, b) => b.stock - a.stock);
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
            {categories.length > 0 ? (
              categories.map((category) => (
                <li
                  key={category}
                  className={styles["menu-list-item"]}
                  onClick={() => {
                    console.log("Clicked category:", category);
                    filterProducts(category);
                  }}
                >
                  <span
                    className={styles["menu-title"]}
                    style={{
                      color: activeCategory === category ? "#8D5524" : "#357E38",
                      cursor: "pointer",
                    }}
                  >
                    {category}
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
                  href={`/user/detail/${product._id}`}
                  key={product._id}
                  className={`${styles.productItem} ${styles["product-link"]}`}
                >
                  <div>
                    <Image
                      src={
                        product.images && product.images.length > 0
                          ? `https://api-zeal.onrender.com/images/${product.images[0]}`
                          : "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={product.name}
                      width={300}
                      height={200}
                      className={styles["product-image"]}
                    />
                    <div>
                      <h4 className={styles["product-item-name"]}>{product.name}</h4>
                      <div className={styles["product-card"]}>
                        <p className={styles.price}>{formatPrice(product.price)}</p>
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
                className={`${styles["page-btn"]} ${
                  currentPage === totalPages ? styles.disabled : ""
                }`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <i className="fa-solid fa-chevron-right"></i>
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
                href={`/user/detail/${product._id}`}
                key={product._id}
                className={styles["best-selling-link"]}
              >
                <div className={styles["best-selling-card"]}>
                  <div className={styles["best-selling-badge"]}>Sale</div>
                  <div className={styles["best-selling-image"]}>
                    <Image
                      src={getImageUrl(product.images?.[0] || "")}
                      alt={product.name}
                      width={200}
                      height={200}
                      className={styles["best-selling-product-image"]}
                    />
                  </div>
                  <div className={styles["best-selling-details"]}>
                    <h3 className={styles["best-selling-product-name"]}>{product.name}</h3>
                    <p className={styles["best-selling-price"]}>{formatPrice(product.price)}</p>
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