"use client";
import image from "next/image";
import Link from "next/link";
import styles from "./new.module.css"; // Đảm bảo file này đã chuyển sang dạng module như hướng dẫn

export default function NewsPage() {
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

        <section className={styles.hotNewPage}>
          {[1, 2, 3].map((_, idx) => (
            <Link href="/details-hot-new" key={idx}>
              <div className={styles.hotNew}>
                <img
                  src="/images/image161.png"
                  alt="Nấm da đầu do dầu"
                  width={430}
                  height={250}
                />
                <p className={styles.sectionDescription}>
                  <strong>10 cách trị nấm da đầu hiệu quả</strong>
                </p>
              </div>
            </Link>
          ))}
        </section>

        <h1 className={styles.sectionTitle}>
          <strong>Tin Tức Hữu Ích</strong>
        </h1>

        <section className={styles.newsPost}>
          {[1, 2, 3, 4].map((_, idx) => (
            <div className={styles.news} key={idx}>
              <img
                src="/images/image159.png"
                alt="Vitamin E"
                width={350}
                height={220}
              />
              <div className={styles.tt}>
                <h2>
                  <strong>Bôi Vitamin E lên mặt có tác dụng gì ?</strong>
                </h2>
                <p className={styles.sectionDescription}>
                  Vitamin E từ lâu đã được biết đến là một chất có công dụng tuyệt vời đối với sức khoẻ và làn da. Tuy nhiên công dụng khi bôi vitamin E lên mặt có lẽ nhiều người còn chưa biết.
                  <br />
                  Hãy cùng tham khảo bài viết dưới đây để tìm hiểu nhé.
                </p>
                <Link href="/user/newdetail" className={styles.btn}>
                  Xem Thêm <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </section>
      </section>
    </>
  );
}