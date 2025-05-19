"use client";

import Image from "next/image";
import "./page.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/app/components/product_interface";

// Ánh xạ banner với danh mục
const bannerCategoryMap: { [key: string]: string } = {
  "/images/bannernav1.png": "Hương thơm",
  "/images/bannernav2.png": "Chăm sóc tóc",
  "/images/bannernav3.png": "Mẹ và bé",
  "/images/bannernav4.png": "Trang điểm",
  "/images/bannernav5.png": "Chăm sóc cơ thể",
  "/images/bannernav6.png": "Chăm sóc da",
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const slides = [
    "/images/bannernav1.png",
    "/images/bannernav2.png",
    "/images/bannernav3.png",
    "/images/bannernav4.png",
    "/images/bannernav5.png",
    "/images/bannernav6.png",
  ];

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
      router.replace(newUrl, undefined, { scroll: false });
      // Đợi một chút để đảm bảo URL được cập nhật
      setTimeout(() => {
        localStorage.setItem("hasReloadedAfterLogin", "true");
        console.log("Reloading page now...");
        window.location.reload();
      }, 200); // Tăng delay để đảm bảo router.replace hoàn tất
    }
  }, [searchParams, router]);

  // Reset trạng thái hasReloaded khi rời trang
  useEffect(() => {
    return () => {
      localStorage.removeItem("hasReloadedAfterLogin");
    };
  }, []);

  // Tự động chuyển slide sau mỗi 7 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

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

  // Xử lý khi nhấn mũi tên trái
  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Xử lý khi nhấn mũi tên phải
  const goToNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Xử lý khi nhấn vào chấm (dot)
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      <div className="container">
        <div className="banner">
          <img src="/images/bannerhome1.png" alt="Main Banner" />
        </div>
        <section className="new-products-section">
          <div className="products-row">
            <div className="text-content">
              <h2 className="section-title">Sản phẩm mới</h2>
              <p className="section-description">
                Pure Botanica tự hào giới thiệu các sản phẩm mới, mang đến những trải nghiệm vượt trội và cải thiện làn da, mái tóc của bạn mỗi ngày.
              </p>
            </div>
            <div className="new-products">
              <div className="new-products-grid">
                {loading ? (
                  <p>Đang tải sản phẩm mới...</p>
                ) : newProducts.length > 0 ? (
                  newProducts.map((product) => (
                    <Link href={`/user/detail/${product._id}`} key={product._id}>
                      <div className="new-product-card">
                        <div className="new-product-badge">New</div>
                        <div className="new-product-image">
                          <img src={getImageUrl(product.images?.[0] || "")} alt={product.name} />
                        </div>
                        <div className="new-product-details">
                          <h3 className="new-product-name">{product.name}</h3>
                          <p className="new-product-price">{formatPrice(product.price)}</p>
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
          <div className="features-section">
            <div className="feature-card">
              <h4 className="feature-title">Giao hàng toàn quốc</h4>
              <br />
              <h4 className="feture-2">Miễn phí giao hàng </h4>
            </div>
            <div className="feature-card">
              <h4 className="feature-title">Bảo đảm chất lượng</h4>
              <br />
              <h4 className="feture-2">Sản phẩm làm từ thiên nhiên</h4>
            </div>
            <div className="feature-card">
              <h4 className="feature-title">Đổi trả sản phẩm</h4>
              <br />
              <h4 className="feture-2">Với sản phẩm lỗi sản xuất </h4>
            </div>
            <div className="feature-card">
              <h4 className="feature-title">Hỗ trợ khách hàng</h4>
              <br />
              <h4 className="feture-2">Tư vấn nhiệt tình 24/7 </h4>
            </div>
          </div>
        </section>
        <section className="banner-slideshow">
          {slides.map((slide, index) => {
            const category = bannerCategoryMap[slide];
            return (
              <Link
                key={index}
                href={`/user/product?category=${encodeURIComponent(category)}`}
              >
                <img
                  src={slide}
                  alt={`Banner ${index + 1}`}
                  className={`slide ${index === currentSlide ? "active" : ""}`}
                />
              </Link>
            );
          })}
          <div className="slideshow-dots">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              ></div>
            ))}
          </div>
          <div className="arrow left" onClick={goToPrevious}>
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          <div className="arrow right" onClick={goToNext}>
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </section>
        <div className="container">
          <section className="botanical-gallery">
            <div className="botanical-frame-left">
              <img
                src="/images/cosmetics nature_1.png"
                alt="Sản phẩm Pure Botanica với lá xanh và hoa"
                className="botanical-photo"
              />
              <div className="botanical-caption">
                Hãy để Pure Botanica nâng niu làn da của bạn <br />
                với 100% trích xuất từ thiên nhiên
              </div>
            </div>
            <div className="botanical-frame-right">
              <img
                src="/images/cosmetics-nature-2.png"
                alt="Bộ sưu tập sản phẩm Pure Botanica"
                className="botanical-photo"
              />
              <div className="botanical-caption">
                Chúng tôi chọn thiên nhiên, bạn chọn sự an lành
              </div>
            </div>
          </section>
          <div className="best-selling-products">
            <h2 className="best-selling-section-title">Bạn có thể thích</h2>
            <div className="best-selling-grid">
              {loading ? (
                <p>Đang tải sản phẩm đề xuất...</p>
              ) : bestSellingProducts.length > 0 ? (
                bestSellingProducts.map((product) => (
                  <Link href={`/user/detail/${product._id}`} key={product._id}>
                    <div className="best-selling-card">
                      <div className="best-selling-badge">Hot</div>
                      <div className="best-selling-image">
                        <img src={getImageUrl(product.images?.[0] || "")} alt={product.name} />
                      </div>
                      <div className="best-selling-details">
                        <h3 className="best-selling-name">{product.name}</h3>
                        <p className="best-selling-price">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>Không tìm thấy sản phẩm bán chạy.</p>
              )}
            </div>
          </div>
          <div className="brand-value-section">
            <img
              src="/images/thuonghieu1.png"
              alt="Background with Natural Ingredients"
              className="brand-background"
            />
            <div className="brand-content">
              <h2 className="brand-title">Giá trị thương hiệu</h2>
              <p className="brand-description">
                Pure Botanica tin rằng vẻ đẹp thật sự đến từ thiên nhiên thuần khiết. Chúng tôi mang
                đến sản phẩm an lành cho làn da, hòa quyện với sự bền vững và trách nhiệm với môi
                trường.
              </p>
              <a href="#" className="brand-cta">
                Tìm hiểu thêm
              </a>
            </div>
          </div>
        </div>
        <div className="brands">
          <h2>Thương hiệu nổi bật</h2>
          <div className="brands2">
            <img src="/images/comem 1.png" alt="Thương hiệu Comem" />
            <img src="/images/cocoon 1.png" alt="Thương hiệu Cocoon" />
            <img src="/images/Logo_Bio_LAK 1.png" alt="Thương hiệu Bio LAK" />
            <img src="/images/Logo-Thorakao-Ngang-500-1 1.png" alt="Thương hiệu Thorakao" />
          </div>
        </div>
      </div>
    </div>
  );
}