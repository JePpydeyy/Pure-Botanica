"use client";
import styles from "./Product.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Category } from "@/app/components/category_interface";
import { Brand } from "@/app/components/Brand_interface";
import { Product } from "@/app/components/product_interface";

const PRICE_RANGES = [
  { label: "100.000đ - 300.000đ", value: "100-300" },
  { label: "300.000đ - 500.000đ", value: "300-500" },
  { label: "500.000đ trở lên", value: "500+" },
];

const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return "0đ";
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const getImageUrl = (image: string): string => {
  if (!image) return "/images/placeholder.png";
  const cleanImage = image.startsWith("/") ? image.substring(1) : image;
  return `https://api-zeal.onrender.com/${cleanImage}`;
};

const getProductPrice = (product: Product): number => {
  if (product.option && product.option.length > 0) {
    return product.option[0].discount_price || product.option[0].price;
  }
  return 0;
};

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
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");

  const productsPerPage = 9;
  const searchParams = useSearchParams();

  // Lấy query tìm kiếm từ URL
  const searchQuery = searchParams.get("query")?.toLowerCase() || "";

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("https://api-zeal.onrender.com/api/brands");
        if (!res.ok) throw new Error("Lỗi tải thương hiệu");
        const data: Brand[] = await res.json();
        setBrands(data);
      } catch {
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  // Fetch products (chờ brands)
  useEffect(() => {
    if (brands.length === 0) return;
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("https://api-zeal.onrender.com/api/products/active");
        if (!response.ok) {
          throw new Error(`Lỗi tải sản phẩm: ${response.status}`);
        }
        const data: Product[] = await response.json();
        // Gán brandName cho từng sản phẩm
        const processedProducts = data.map(product => {
          const brandObj = brands.find(b => b._id === product.id_brand);
          return {
            ...product,
            price: getProductPrice(product),
            stock: getProductStock(product),
            brandName: brandObj ? brandObj.name : "",
          };
        });
        setProducts(processedProducts);
        setFilteredProducts(processedProducts);
      } catch (error) {
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [brands]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api-zeal.onrender.com/api/categories");
        if (!res.ok) {
          throw new Error(`Lỗi tải danh mục: ${res.status}`);
        }
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        setError("Không thể tải danh mục. Vui lòng thử lại sau.");
      }
    };
    fetchCategories();
  }, []);

  // Apply filter based on URL query parameter (category)
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (!categoryFromUrl) {
      setActiveCategory(null);
      setFilteredProducts(products);
      setCurrentPage(1);
      return;
    }
    if (products.length === 0 || categories.length === 0) {
      return;
    }
    const decodedCategory = decodeURIComponent(categoryFromUrl);
    const foundCategory = categories.find(cat => cat.name === decodedCategory);
    if (foundCategory) {
      const filtered = products.filter(
        (product) => product.id_category === foundCategory._id
      );
      setActiveCategory(decodedCategory);
      setFilteredProducts(filtered);
    } else if (decodedCategory === "Tất cả") {
      setActiveCategory(null);
      setFilteredProducts(products);
    } else {
      setActiveCategory(null);
      setFilteredProducts(products);
    }
    setCurrentPage(1);
  }, [searchParams, products, categories]);

  // Lọc sản phẩm theo bộ lọc sidebar (category, brand, price)
  useEffect(() => {
    let filtered = [...products];
    // Lọc theo danh mục
    if (activeCategory) {
      const foundCategory = categories.find(cat => cat.name === activeCategory);
      if (foundCategory) {
        filtered = filtered.filter((product) => product.id_category === foundCategory._id);
      }
    }
    // Lọc theo thương hiệu
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(
        (product) => selectedBrands.includes(product.brandName || "")
      );
    }
    // Lọc theo giá
    if (selectedPriceRange) {
      filtered = filtered.filter((product) => {
        const price = product.price || 0;
        if (selectedPriceRange === "100-300") return price >= 100000 && price <= 300000;
        if (selectedPriceRange === "300-500") return price > 300000 && price <= 500000;
        if (selectedPriceRange === "500+") return price > 500000;
        return true;
      });
    }
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, activeCategory, selectedBrands, selectedPriceRange, categories]);

  // Lọc sản phẩm theo từ khóa tìm kiếm (nếu có)
  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(product =>
        product.name?.toLowerCase().includes(searchQuery)
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, products]);

  const filterProducts = (categoryName: string) => {
    if (activeCategory === categoryName) {
      setActiveCategory(null);
      setFilteredProducts(products);
    } else {
      const foundCategory = categories.find(cat => cat.name === categoryName);
      if (foundCategory) {
        const filtered = products.filter(
          (product) => product.id_category === foundCategory._id
        );
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

  // Xoá bộ lọc
  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceRange("");
    setActiveCategory(null);
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  return (
    <div>
      <section className={styles.productBanner}>
        <img src="/images/productBanner.png" alt="Banner" className={styles["banner-image"]} />
      </section>
      <h1 className={styles["product-main-title"]}>Danh sách sản phẩm</h1>
      <div className={styles.containerBox}>
        <aside className={styles.productSidebar}>
          <h3 className={styles["sidebar-title"]}>DANH MỤC SẢN PHẨM</h3>
              <hr />      
          <ul className={styles["menu-list"]}>
            {categories.length > 0 ? (
              categories.map((category) => (
                <li
                  key={category._id}
                  className={styles["menu-list-item"]}
                  onClick={() => filterProducts(category.name)}
                >
                  <span
                    className={`${styles.filterOption} ${activeCategory === category.name ? styles.active : ""}`}
                  >
                    {category.name}
                  </span>
                </li>
              ))
            ) : (
              <li className={styles["no-products"]}>Không có danh mục nào.</li>
            )}
          </ul>

          <h3 className={styles["sidebar-title"]}>THƯƠNG HIỆU</h3>
          <hr />
          <ul className={styles.filterList}>
            {brands.map((brand) => (
              <li key={brand._id} className={styles.filterItem}>
                <span
                  className={`${styles.filterOption} ${selectedBrands.includes(brand.name) ? styles.active : ""}`}
                  onClick={() => {
                    setSelectedBrands((prev) =>
                      prev.includes(brand.name)
                        ? prev.filter((b) => b !== brand.name)
                        : [...prev, brand.name]
                    );
                  }}
                >
                  {brand.name}
                </span>
              </li>
            ))}
          </ul>

          <h3 className={styles["sidebar-title"]}>PHÂN KHÚC SẢN PHẨM</h3>
          <hr />
          <ul className={styles.filterList}>
            {PRICE_RANGES.map((range) => (
              <li key={range.value} className={styles.filterItem}>
                <span
                  className={`${styles.filterOption} ${selectedPriceRange === range.value ? styles.active : ""}`}
                  onClick={() =>
                    setSelectedPriceRange(selectedPriceRange === range.value ? "" : range.value)
                  }
                >
                  {range.label}
                </span>
              </li>
            ))}
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
                      quality={100}
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
              {searchQuery
                ? `Không tìm thấy sản phẩm với từ khóa "${searchQuery}"`
                : activeCategory
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
                      quality={100}
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