"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCalendarDays, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./new.module.css";

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  thumbnailCaption: string;
  content: string;
  views?: number;
  publishedAt?: string;
}

const API_BASE_URL = "https://api-zeal.onrender.com";
const POSTS_PER_PAGE = 6;

const processContentImages = (content: string): string => {
  return content.replace(
    /src="images\/([^"]+)"/g,
    `src="${API_BASE_URL}/images/$1"`
  );
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<string>("/images/banner.png"); // Mặc định là banner tĩnh
  const [bannerLoading, setBannerLoading] = useState<boolean>(true);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [cacheBuster, setCacheBuster] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: string }>({});

  // Tạo cacheBuster để tránh cache hình ảnh
  useEffect(() => {
    setCacheBuster(`v=${Date.now()}`);
  }, []);

  // Fetch banner từ API
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setBannerLoading(true);
        setBannerError(null);
        const response = await fetch(`${API_BASE_URL}/api/interfaces/banner-news`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.paths && data.paths.length > 0) {
          setBanner(`${API_BASE_URL}/${data.paths[0]}`);
        } else {
          throw new Error("Không tìm thấy banner trong dữ liệu API");
        }
      } catch (error: any) {
        console.error("Lỗi khi lấy banner:", error);
        setBannerError(error.message || "Không thể tải banner");
        setBanner("/images/banner.png"); // Fallback về banner tĩnh
      } finally {
        setBannerLoading(false);
      }
    };

    fetchBanner();
  }, []);

  // Fetch danh sách tin tức
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/news`)
      .then((res) => res.json())
      .then((data) => {
        const sortedNews = data.sort((a: NewsItem, b: NewsItem) => (b.views ?? 0) - (a.views ?? 0));
        setNews(sortedNews);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(news.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentNews = news.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleImageError = (newsId: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [newsId]: "Hình ảnh không tồn tại hoặc không thể tải",
    }));
  };

  return (
    <>
      {/* Hiển thị banner */}
      {bannerLoading ? (
        <p>Đang tải banner...</p>
      ) : bannerError ? (
        <p className={styles.errorContainer}>Lỗi: {bannerError}</p>
      ) : (
        <img
          src={banner ? `${banner}?${cacheBuster}` : "/images/banner.png"}
          alt="Banner"
          className={styles.banner}
          loading="lazy"
          onError={(e) => {
            setBannerError("Không thể tải hình ảnh banner.");
            (e.target as HTMLImageElement).src = "/images/banner.png";
          }}
        />
      )}

      <section className={styles.namePage}>
        <p className={styles.nameTagPage}>
          <strong>Tin Tức</strong>
        </p>
      </section>

      <section className={styles.container}>
        <p className={styles.sectionTitle}>
          <strong>Tin Tức Nổi Bật</strong>
        </p>
        <p className={styles.herro}>
          Cùng nhau khám phá xu hướng làm đẹp mới nhất cùng
          <br />
          Pure Botanica
        </p>

        <section className={styles.hotNewPage}>
          {news.slice(0, 3).map((item) => (
            <Link href={`/user/newdetail/${item.slug}`} key={item._id}>
              <div className={styles.hotNew}>
                {imageErrors[item._id] ? (
                  <div className={styles.imageError}>
                    {imageErrors[item._id]}
                  </div>
                ) : (
                  <img
                    src={`${API_BASE_URL}/${item.thumbnailUrl}`}
                    alt={item.thumbnailCaption}
                    className={styles.hotNewImage}
                    onError={() => handleImageError(item._id)}
                    loading="lazy"
                  />
                )}
                <div className={styles.hotNewInfo}>
                  <p className={styles.hotNewTitle}>
                    <strong>{item.title}</strong>
                  </p>
                  <p className={styles.views}>
                    <FontAwesomeIcon icon={faEye} /> {item.views ?? 0} lượt xem
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <h1 className={styles.sectionTitle}>
          <strong>Tin Tức Hữu Ích</strong>
        </h1>

        <section className={styles.newsPost}>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            currentNews.map((item) => (
              <div className={styles.news} key={item._id}>
                {imageErrors[item._id] ? (
                  <div className={styles.imageError}>
                    {imageErrors[item._id]}
                  </div>
                ) : (
                  <img
                    src={`${API_BASE_URL}/${item.thumbnailUrl}`}
                    alt={item.thumbnailCaption}
                    className={styles.newsImage}
                    onError={() => handleImageError(item._id)}
                    loading="lazy"
                  />
                )}
                <div className={styles.tt}>
                  <h2>
                    <strong>{item.title}</strong>
                  </h2>

                  <div className={styles.metaInfo}>
                    <span>
                      <FontAwesomeIcon icon={faCalendarDays} />{" "}
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString("vi-VN")
                        : "Chưa rõ"}
                    </span>
                    <span>
                      <FontAwesomeIcon icon={faEye} /> {item.views ?? 0} lượt xem
                    </span>
                  </div>

                  <p
                    className={styles.sectionDescription}
                    dangerouslySetInnerHTML={{
                      __html: processContentImages(
                        item.content
                          .replace(/<(?!\/?(b|strong)\b)[^>]*>/gi, "")
                          .slice(0, 200) + "..."
                      ),
                    }}
                  />
                  <Link
                    href={`/user/newdetail/${item.slug}`}
                    className={styles.btn}
                  >
                    Xem Thêm <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </section>

        {totalPages > 1 && (
          <section className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              Trang trước
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`${styles.pageButton} ${
                  currentPage === index + 1 ? styles.activePage : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              Trang sau
            </button>
          </section>
        )}
      </section>
    </>
  );
}