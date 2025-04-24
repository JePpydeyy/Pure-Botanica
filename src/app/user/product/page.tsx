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
  if (!image) return "/images/placeholder.png"; // Fallback image if none provided
  return `https://api-zeal.onrender.com/images/${image}`;
};

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const productsPerPage = 9;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://api-zeal.onrender.com/api/products");
        const data: Product[] = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api-zeal.onrender.com/api/categories");
        const data = await res.json();
        const categoryNames = data.map((cat: any) => cat.name);
        setCategories(["Tất cả", ...categoryNames]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const filterProducts = (category: string) => {
    if (category === "Tất cả" || activeCategory === category) {
      setFilteredProducts(products);
      setActiveCategory(null);
    } else {
      const filtered = products.filter((product) => {
        return product.category && product.category === category;
      });
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

  const getRandomProducts = (products: Product[], count: number): Product[] => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const bestSellingProducts = getRandomProducts(products, 4);

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
            {categories.map((category) => (
              <li
                key={category}
                className={styles["menu-list-item"]}
                onClick={() => filterProducts(category)}
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
            ))}
          </ul>
        </aside>
        <section className={styles.productContainer}>
          <div className={styles.productGrid}>
            {isLoading ? (
              <p className={styles["no-products"]}>Đang tải sản phẩm...</p>
            ) : currentProducts.length > 0 ? (
              currentProducts.map((product) => (
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
              ))
            ) : (
              <p className={styles["no-products"]}>
                {activeCategory
                  ? `Không tìm thấy sản phẩm trong danh mục "${activeCategory}"`
                  : "Không có sản phẩm nào."}
              </p>
            )}
          </div>
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