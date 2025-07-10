"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  content: string;
  views?: number;
}

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | ''>('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Check admin authentication
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      setNotificationMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      setNotificationType('error');
      setShowNotification(true);
      setTimeout(() => {
        router.push('/user/login');
      }, 3000);
    }
  }, [router, token]);

  // Normalize image URLs
  const normalizeImageUrl = (path: string): string => {
    if (!path) return '/images/placeholder.png';
    return path.startsWith('/images/')
      ? `https://api-zeal.onrender.com${path}`
      : `https://api-zeal.onrender.com/images/${path.replace(/^images\//, '')}`;
  };

  // Process HTML content to normalize image URLs
  const normalizeContentImages = (content: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const images = doc.querySelectorAll('img');
    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (src) {
        img.setAttribute('src', normalizeImageUrl(src));
      }
    });
    return doc.body.innerHTML;
  };

  // Show notification with auto-dismiss
  const showNotificationMessage = (message: string, type: 'success' | 'error') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage('');
      setNotificationType('');
    }, 3000);
  };

  useEffect(() => {
    if (!id) {
      setError("Slug không được cung cấp.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
      setLoading(false);
      router.push('/user/login');
      return;
    }

    const slugString = Array.isArray(id) ? id[0] : id;

    const fetchNews = async () => {
      try {
        const res = await fetch(`https://api-zeal.onrender.com/api/news/${slugString}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (res.status === 401 || res.status === 403) {
          showNotificationMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('email');
          setTimeout(() => router.push('/user/login'), 3000);
          return;
        }
        if (!res.ok) {
          throw new Error(`Lỗi ${res.status}: ${await res.text()}`);
        }
        const data: NewsDetail = await res.json();
        if (!data._id || !data.title || !data.slug) {
          throw new Error("Dữ liệu bài viết không đầy đủ.");
        }
        setNews({
          ...data,
          thumbnailUrl: normalizeImageUrl(data.thumbnailUrl),
          content: normalizeContentImages(data.content),
        });

        // Fetch related news
        const allNewsRes = await fetch('https://api-zeal.onrender.com/api/news', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (allNewsRes.status === 401 || allNewsRes.status === 403) {
          showNotificationMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('email');
          setTimeout(() => router.push('/user/login'), 3000);
          return;
        }
        if (!allNewsRes.ok) {
          throw new Error(`Lỗi khi lấy danh sách bài viết: ${await allNewsRes.text()}`);
        }
        const allNews: NewsDetail[] = await allNewsRes.json();
        const others = allNews
          .filter((item) => item.slug !== data.slug)
          .map((item) => ({
            ...item,
            thumbnailUrl: normalizeImageUrl(item.thumbnailUrl),
          }));
        const shuffled = others.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        setRelatedNews(selected);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        showNotificationMessage(`Lỗi: ${err.message}`, 'error');
        setLoading(false);
      }
    };

    fetchNews();
  }, [id, token, router]);

  if (loading) return <p className={styles.errorContainer}>Đang tải bài viết...</p>;
  if (error) return <p className={styles.errorContainer}>Lỗi: {error}</p>;
  if (!news) return <p className={styles.errorContainer}>Không tìm thấy bài viết.</p>;

  return (
    <div className={styles.news}>
      {showNotification && (
        <div className={`${styles.notification} ${styles[notificationType]}`}>
          {notificationMessage}
        </div>
      )}
      <section className={styles.newsArticle}>
        <div className={styles.newsHeader}>
          <p className={styles.newsTitle}>{news.title}</p>
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
              src={news.thumbnailUrl}
              alt={news.thumbnailCaption}
              width={690}
              height={448}
              className={styles.newsimage}
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder.png';
                console.error(`Error loading thumbnail for news ${news.title}: ${news.thumbnailUrl}`);
              }}
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
                    src={item.thumbnailUrl}
                    alt={item.thumbnailCaption}
                    width={410}
                    height={250}
                    className={styles.newsRelatedimage}
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder.png';
                      console.error(`Error loading related news image for ${item.title}: ${item.thumbnailUrl}`);
                    }}
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