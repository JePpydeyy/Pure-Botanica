"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
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

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api-zeal.onrender.com/api/news")
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <img
        src="/images/banner.png"
        alt="Banner"
        width={1600}
        height={400}
        className={styles.banner}
      />

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

        {/* Hot News */}
        <section className={styles.hotNewPage}>
          {news.slice(0, 3).map((item) => (
            <Link href={`/user/newdetail/${item.slug}`} key={item._id}>
              <div className={styles.hotNew}>
                <img
                  src={item.thumbnailUrl}
                  alt={item.thumbnailCaption}
                  width={430}
                  height={250}
                />
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

        {/* News Post */}
        <section className={styles.newsPost}>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            news.map((item) => (
              <div className={styles.news} key={item._id}>
                <img
                  src={item.thumbnailUrl}
                  alt={item.thumbnailCaption}
                  width={350}
                  height={220}
                />
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
                      __html:
                        item.content
                          .replace(/<(?!\/?(b|strong)\b)[^>]*>/gi, "")
                          .slice(0, 200) + "..."
                    }}
                  />
                  <Link
                    href={`/user/newdetail/${item.slug}`}
                    className={styles.btn}
                  >
                    Xem Thêm <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))
          )}
        </section>
      </section>
    </>
  );
}