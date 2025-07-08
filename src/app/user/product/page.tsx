"use client";
import styles from "./Product.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Product interfaces
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
  brandName?: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
  status: string;
}

const PRICE_RANGES = [
  { label: "50 - 100.000 VND", value: "50-100" },
  { label: "101 - 300.000 VND", value: "101-300" },
  { label: "301 - 500.000 VND", value: "301-500" },
  { label: "Trên 500.000 VND", value: "500+" },
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
        const response = await fetch("https://api-zeal.onrender.com/api/products");
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
        if (selectedPriceRange === "50-100") return price >= 50000 && price <= 100000;
        if (selectedPriceRange === "101-300") return price >= 101000 && price <= 300000;
        if (selectedPriceRange === "301-500") return price >= 301000 && price <= 500000;
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
          <ul className={styles["menu-list"]}>
            {categories.length > 0 ? (
              categories.map((category) => (
                <li
                  key={category._id}
                  className={styles["menu-list-item"]}
                  onClick={() => filterProducts(category.name)}
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

          {/* Bộ lọc thương hiệu */}
          <h3 className={styles["sidebar-title"]} style={{ marginTop: 32 }}>THƯƠNG HIỆU</h3>
          <hr />
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 18 }}>
            {brands.map((brand) => (
              <li key={brand._id} style={{ marginBottom: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.name)}
                  onChange={() => {
                    setSelectedBrands((prev) =>
                      prev.includes(brand.name)
                        ? prev.filter((b) => b !== brand.name) // Bỏ lọc nếu đã chọn
                        : [...prev, brand.name]
                    );
                  }}
                  />
                  <span style={{ color: "#357E38", fontWeight: 500 }}>{brand.name}</span>
                </label>
              </li>
            ))}
          </ul>

          {/* Bộ lọc phân khúc giá */}
          <h3 className={styles["sidebar-title"]}>PHÂN KHÚC SẢN PHẨM</h3>
          <hr />
        <ul style={{ listStyle: "none", padding: 0 }}>
          {PRICE_RANGES.map((range) => (
            <li key={range.value} style={{ marginBottom: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="priceRange"
                  checked={selectedPriceRange === range.value}
                  onChange={() => {
                    setSelectedPriceRange(
                      selectedPriceRange === range.value ? "" : range.value
                    );
                  }}
                />
                <span style={{ color: "#357E38", fontWeight: 500 }}>{range.label}</span>
              </label>
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