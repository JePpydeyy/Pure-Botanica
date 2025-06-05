"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/app/components/product_interface";

export default function Home() {
  const [setCurrentSlide] = useState(0);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Xử lý reload trang khi có refresh=true
  useEffect(() => {
    const refresh = searchParams.get("refresh");
    console.log("Checking refresh param:", refresh); // Debug log

    // Kiểm tra xem đã reload chưa bằng localStorage
    const hasReloaded = localStorage.getItem("hasReloadedAfterLogin");

    if (refresh === "true" && !hasReloaded) {
      console.log("Preparing to reload page..."); // Debug log
      // Xóa tham số refresh ngay lập tức
      const newUrl = window.location.pathname;
      router.replace(newUrl); // Bỏ tham số thứ 3
      // Đợi một chút để đảm bảo URL được cập nhật
      setTimeout(() => {
        localStorage.setItem("hasReloadedAfterLogin", "true");
        console.log("Reloading page now...");
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

  // Lấy dữ liệu sản phẩm mới nhất từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://api-zeal.onrender.com/api/products", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu sản phẩm");
        }
        const allProducts: Product[] = await response.json();

        // Sắp xếp sản phẩm mới nhất theo _id (timestamp)
        const sortedProducts = allProducts.sort((a, b) => {
          const timestampA = parseInt(a._id.substring(0, 8), 16);
          const timestampB = parseInt(b._id.substring(0, 8), 16);
          return timestampB - timestampA;
        });

        // Lấy 3 sản phẩm mới nhất
        const latestProducts = sortedProducts.slice(0, 3);
        setNewProducts(latestProducts);

        // Lọc và sắp xếp sản phẩm theo stock (giảm dần)
        const productsWithStock = allProducts.filter(
          (product) => typeof product.stock === "number" && product.stock > 0
        );

        const sortedByStock = [...productsWithStock].sort((a, b) => b.stock - a.stock);
        const topStockProducts = sortedByStock.slice(0, 4);
        setBestSellingProducts(topStockProducts);

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Định dạng giá tiền
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  // Xử lý URL ảnh
  const getImageUrl = (image: string): string => {
    if (!image) return "/api/placeholder/200/200";
    if (image.startsWith("/")) return image;
    return `/images/${image}`;
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
                  <Link href={`/user/detail/${product._id}`} key={product._id}>
                    <div className={styles.newProductCard}>
                      <div className={styles.newProductBadge}>New</div>
                      <div className={styles.newProductImage}>
                        <img src={getImageUrl(product.images?.[0] || "")} alt={product.name} />
                      </div>
                      <div className={styles.newProductDetails}>
                        <h3 className={styles.newProductName}>{product.name}</h3>
                        <p className={styles.newProductPrice}>{formatPrice(product.price)}</p>
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
              <Link href={`/user/detail/${product._id}`} key={product._id}>
                <div className={styles.bestSellingCard}>
                  <div className={styles.bestSellingBadge}>Hot</div>
                  <div className={styles.bestSellingImage}>
                    <img src={getImageUrl(product.images?.[0] || "")} alt={product.name} />
                  </div>
                  <div className={styles.bestSellingDetails}>
                    <h3 className={styles.bestSellingName}>{product.name}</h3>
                    <p className={styles.bestSellingPrice}>{formatPrice(product.price)}</p>
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
          <img src="/images/comem 1.png" alt="Thương hiệu Comem" />
          <img src="/images/cocoon 1.png" alt="Thương hiệu Cocoon" />
          <img src="/images/Logo_Bio_LAK 1.png" alt="Thương hiệu Bio LAK" />
          <img src="/images/Logo-Thorakao-Ngang-500-1 1.png" alt="Thương hiệu Thorakao" />
        </div>
      </div>
    </div>
  );
}