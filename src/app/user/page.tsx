"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
  option: {
    stock: number;
    value: string;
    price: number;
    discount_price?: number;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface Brand {
  _id: string;
  name: string;
  status: string;
  logoImg: string;
}

export default function Home() {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Xử lý reload trang khi có refresh=true
  useEffect(() => {
    const refresh = searchParams.get("refresh");
    const hasReloaded = localStorage.getItem("hasReloadedAfterLogin");

    if (refresh === "true" && !hasReloaded) {
      const newUrl = window.location.pathname;
      router.replace(newUrl);
      setTimeout(() => {
        localStorage.setItem("hasReloadedAfterLogin", "true");
        window.location.reload();
      }, 200);
    }
  }, [searchParams, router]);

  // Reset trạng thái hasReloaded khi rời trang
  useEffect(() => {
    return () => {
      localStorage.removeItem("hasReloadedAfterLogin");
    };
  }, []);

  // Lấy dữ liệu sản phẩm và thương hiệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productResponse = await fetch("https://api-zeal.onrender.com/api/products/active", {
          cache: "no-store",
        });
        if (!productResponse.ok) {
          throw new Error("Không thể lấy dữ liệu sản phẩm");
        }
        const allProducts: Product[] = await productResponse.json();

        // Filter valid products with valid option data
        const validProducts = allProducts.filter(
          (product) =>
            product.option?.[0] &&
            typeof product.option[0].price === "number" &&
            !isNaN(product.option[0].price)
        );

        // Sắp xếp sản phẩm mới nhất theo createdAt
        const sortedProducts = validProducts.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        // Lấy 3 sản phẩm mới nhất
        const latestProducts = sortedProducts.slice(0, 3);
        setNewProducts(latestProducts);

        // Lọc và sắp xếp sản phẩm theo stock (giảm dần)
        const productsWithStock = validProducts.filter(
          (product) => product.option[0].stock > 0
        );
        const sortedByStock = [...productsWithStock].sort(
          (a, b) => b.option[0].stock - a.option[0].stock
        );
        const topStockProducts = sortedByStock.slice(0, 4);
        setBestSellingProducts(topStockProducts);

        // Fetch brands
        const brandResponse = await fetch("https://api-zeal.onrender.com/api/brands", {
          cache: "no-store",
        });
        if (!brandResponse.ok) {
          throw new Error("Không thể lấy dữ liệu thương hiệu");
        }
        const allBrands: Brand[] = await brandResponse.json();
        // Filter brands with status "show"
        const visibleBrands = allBrands.filter((brand) => brand.status === "show");
        setBrands(visibleBrands);

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Định dạng giá tiền
  const formatPrice = (price: number | undefined | null): string => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A";
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  // Xử lý URL ảnh
  const getImageUrl = (image: string): string => {
    if (!image) return "/api/placeholder/200/200";
    return image.startsWith("http") ? image : `https://api-zeal.onrender.com/${image}`;
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.banner}>
        <img src="/images/bannerhome1.png" alt="Main Banner" />
      </div>

      <section className={styles.newProductsSection}>
        <div className={styles.productsRow}>
          <div className={styles.textContent}>
            <h2 className={styles.sectionTitle}>Sản phẩm mới</h2>
            <p className={styles.sectionDescription}>
              Pure Botanica tự hào giới thiệu các sản phẩm mới, mang đến những trải nghiệm vượt trội và cải thiện làn da, mái tóc của bạn mỗi ngày.
            </p>
          </div>
          <div className={styles.newProducts}>
            <div className={styles.newProductsGrid}>
              {loading ? (
                <p>Đang tải sản phẩm mới...</p>
              ) : newProducts.length > 0 ? (
                newProducts.map((product) => (
                  <Link href={`/user/detail/${product.slug}`} key={product._id}>
                    <div className={styles.newProductCard}>
                      <div className={styles.newProductBadge}>New</div>
                      <div className={styles.newProductImage}>
                        <img
                          src={getImageUrl(product.images?.[0] || "")}
                          alt={product.name}
                        />
                      </div>
                      <div className={styles.newProductDetails}>
                        <h3 className={styles.newProductName}>{product.name}</h3>
                        <p className={styles.newProductPrice}>
                          {product.option[0].discount_price
                            ? formatPrice(product.option[0].discount_price)
                            : formatPrice(product.option[0].price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>Không tìm thấy sản phẩm mới.</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.featuresSection}>
          <div className={styles.featureCard}>
            <h4 className={styles.featureTitle}>Giao hàng toàn quốc</h4>
            <br />
            <h4 className={styles.featureSubtitle}>Miễn phí giao hàng</h4>
          </div>
          <div className={styles.featureCard}>
            <h4 className={styles.featureTitle}>Bảo đảm chất lượng</h4>
            <br />
            <h4 className={styles.featureSubtitle}>Sản phẩm làm từ thiên nhiên</h4>
          </div>
          <div className={styles.featureCard}>
            <h4 className={styles.featureTitle}>Đổi trả sản phẩm</h4>
            <br />
            <h4 className={styles.featureSubtitle}>Với sản phẩm lỗi sản xuất</h4>
          </div>
          <div className={styles.featureCard}>
            <h4 className={styles.featureTitle}>Hỗ trợ khách hàng</h4>
            <br />
            <h4 className={styles.featureSubtitle}>Tư vấn nhiệt tình 24/7</h4>
          </div>
        </div>
      </section>

      <div className={styles.bannerContainer}>
        <img
          src="/images/bannersale.png"
          alt="Banner Sale"
          className={styles.bannerImage}
        />
      </div>

      <section className={styles.botanicalGallery}>
        <div className={styles.botanicalFrameLeft}>
          <img
            src="/images/cosmetics nature_1.png"
            alt="Sản phẩm Pure Botanica với lá xanh và hoa"
            className={styles.botanicalPhoto}
          />
          <div className={styles.botanicalCaption}>
            Hãy để Pure Botanica nâng niu làn da của bạn <br />
            với 100% trích xuất từ thiên nhiên
          </div>
        </div>
        <div className={styles.botanicalFrameRight}>
          <img
            src="/images/cosmetics-nature-2.png"
            alt="Bộ sưu tập sản phẩm Pure Botanica"
            className={styles.botanicalPhoto}
          />
          <div className={styles.botanicalCaption}>
            Chúng tôi chọn thiên nhiên, bạn chọn sự an lành
          </div>
        </div>
      </section>

      <div className={styles.bestSellingProducts}>
        <h2 className={styles.bestSellingSectionTitle}>Bạn có thể thích</h2>
        <div className={styles.bestSellingGrid}>
          {loading ? (
            <p>Đang tải sản phẩm đề xuất...</p>
          ) : bestSellingProducts.length > 0 ? (
            bestSellingProducts.map((product) => (
              <Link href={`/user/detail/${product.slug}`} key={product._id}>
                <div className={styles.bestSellingCard}>
                  <div className={styles.bestSellingBadge}>Hot</div>
                  <div className={styles.bestSellingImage}>
                    <img
                      src={getImageUrl(product.images?.[0] || "")}
                      alt={product.name}
                    />
                  </div>
                  <div className={styles.bestSellingDetails}>
                    <h3 className={styles.bestSellingName}>{product.name}</h3>
                    <p className={styles.bestSellingPrice}>
                      {product.option[0].discount_price
                        ? formatPrice(product.option[0].discount_price)
                        : formatPrice(product.option[0].price)}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>Không tìm thấy sản phẩm bán chạy.</p>
          )}
        </div>
      </div>

      <div className={styles.brandValueSection}>
        <img
          src="/images/thuonghieu1.png"
          alt="Background with Natural Ingredients"
          className={styles.brandBackground}
        />
        <div className={styles.brandContent}>
          <h2 className={styles.brandTitle}>Giá trị thương hiệu</h2>
          <p className={styles.brandDescription}>
            Pure Botanica tin rằng vẻ đẹp thật sự đến từ thiên nhiên thuần khiết. Chúng tôi mang
            đến sản phẩm an lành cho làn da, hòa quyện với sự bền vững và trách nhiệm với môi
            trường.
          </p>
          <a href="#" className={styles.brandCta}>
            Tìm hiểu thêm
          </a>
        </div>
      </div>

      <div className={styles.brands}>
        <h2>Thương hiệu nổi bật</h2>
        <div className={styles.brandsGrid}>
          {loading ? (
            <p>Đang tải thương hiệu...</p>
          ) : brands.length > 0 ? (
            brands.map((brand) => (
              <img
                key={brand._id}
                src={getImageUrl(brand.logoImg)}
                alt={`Thương hiệu ${brand.name}`}
              />
            ))
          ) : (
            <p>Không tìm thấy thương hiệu.</p>
          )}
        </div>
      </div>
    </div>
  );
}