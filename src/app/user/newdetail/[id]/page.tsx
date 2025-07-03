"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faEye } from "@fortawesome/free-solid-svg-icons";
import styles from "./newdetail.module.css";

export interface NewsDetail {
  _id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  thumbnailCaption: string;
  publishedAt: string;
  content: string; // HTML string from React Quill
  views?: number;
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [news, setNews] = useState<NewsDetail | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Slug không được cung cấp.");
      setLoading(false);
      return;
    }

    const slugString = Array.isArray(id) ? id[0] : id;

    fetch(`https://api-zeal.onrender.com/api/news/${slugString}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Lỗi ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        if (!data._id || !data.title || !data.slug) {
          setError("Dữ liệu bài viết không đầy đủ.");
          setLoading(false);
          return;
        }
        setNews(data);
        setLoading(false);

        fetch(`https://api-zeal.onrender.com/api/news`)
          .then((res) => {
            if (!res.ok) throw new Error("Không lấy được danh sách bài viết.");
            return res.json();
          })
          .then((allNews: NewsDetail[]) => {
            const others = allNews.filter((item) => item.slug !== data.slug);
            const shuffled = others.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);
            setRelatedNews(selected);
          })
          .catch((err) => {
            console.error("Lỗi khi lấy bài viết liên quan:", err);
          });
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Đang tải bài viết...</p>;
  if (error) return <p>Lỗi: {error}</p>;
  if (!news) return <p>Không tìm thấy bài viết.</p>;

  return (
    <div className={styles.news}>
      <section className={styles.newsArticle}>
        <div className={styles.newsHeader}>
          <p className={styles.newsTitle}>{news.title}</p>

          {/* 👇 Meta info (date + views) */}
          <div className={styles.newsMeta}>
            <span className={styles.newsDate}>
              <FontAwesomeIcon icon={faCalendarDays} />
              {new Date(news.publishedAt).toLocaleDateString("vi-VN")}
            </span>
            <span className={styles.newsViews}>
              <FontAwesomeIcon icon={faEye} />
              {news.views ?? 0} lượt xem
            </span>
          </div>

          <p className={styles.newsIntro}>
            {news.content.replace(/<[^>]+>/g, "").slice(0, 300)}...
          </p>
        </div>

        <div className={styles.newsSection}>
          <div className={styles.newsimageWrapper}>
            <img
              src={`https://api-zeal.onrender.com/${news.thumbnailUrl}`}
              alt={news.thumbnailCaption}
              width={690}
              height={448}
              className={styles.newsimage}
            />
          </div>

          <div
            className={styles.newsText}
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>

        <div className={styles.newsRelated}>
          <p className={styles.newsRelatedTitle}>Xem Thêm</p>
          <div className={styles.newsRelatedGrid}>
            {relatedNews.map((item) => (
              <Link
                key={item._id}
                href={`/user/newdetail/${item.slug}`}
                className={styles.newsRelatedLink}
              >
                <div className={styles.newsRelatedItem}>
                  <img
                    src={`https://api-zeal.onrender.com/${item.thumbnailUrl}`}
                    alt={item.thumbnailCaption}
                    width={410}
                    height={250}
                    className={styles.newsRelatedimage}
                  />
                  <p className={styles.newsRelatedText}>{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
