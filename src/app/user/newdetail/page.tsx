"use client";
import image from "next/image";
import Link from "next/link";
import styles from "./newdetail.module.css"; // Tạo file CSS module này, copy các class từ all2.css và đổi sang camelCase

export default function NewsDetailPage() {
  return (
    <div className={styles.news}>
      <section className={styles.newsArticle}>
        <div className={styles.newsHeader}>
          <p className={styles.newsTitle}>
            Gội Đầu Không Dùng Dầu Gội Có Sao Không? Ưu Điểm Và Nhược Điểm
          </p>
          <p className={styles.newsDate}>12/05/2025</p>
          <p className={styles.newsIntro}>
            Ngày nay, với xu hướng chăm sóc sức khỏe và làm đẹp tự nhiên ngày càng được ưa chuộng, nhiều người bắt đầu tìm kiếm các phương pháp thay thế dầu gội hóa học khi làm sạch tóc. Một trong số đó là việc gội đầu không dùng dầu gội. Phương pháp này có thực sự hiệu quả hay chỉ là một xu hướng nhất thời? Bài viết này sẽ phân tích rõ ưu nhược điểm của phương pháp này để bạn có cái nhìn chính xác và an toàn hơn.
          </p>
        </div>

        <div className={styles.newsSection}>
          <p className={styles.newsSubtitle}>Gội đầu không dùng dầu gội là như thế nào?</p>
          <p className={styles.newsText}>
            Gội đầu không dùng dầu gội là phương pháp làm sạch tóc và da đầu mà không sử dụng các sản phẩm dầu gội thương mại chứa hóa chất tẩy mạnh. Thay vào đó, người dùng sẽ áp dụng các kỹ thuật tự nhiên như gội bằng nước ấm, baking soda hoặc bồ kết, kết hợp massage da đầu kỹ lưỡng để loại bỏ bụi bẩn, dầu nhờn. Phương pháp này được ưa chuộng vì tính tự nhiên, ít gây kích ứng da đầu, thân thiện với môi trường và tiết kiệm chi phí.
          </p>
          <div className={styles.newsimageWrapper}>
            <img
              src="/images/image159.png"
              alt="Gội đầu không dầu gội"
              width={690}
              height={448}
              className={styles.newsimage}
            />
          </div>
        </div>

        <div className={styles.newsSection}>
          <p className={styles.newsSubtitle}>Gội đầu khô có làm sạch hiệu quả không?</p>
          <p className={styles.newsText}>
            Gội đầu khô không phải là một giải pháp giúp loại bỏ hoàn toàn bụi bẩn và tế bào chết tích tụ ở da đầu như dầu gội phổ biến trên thị trường. Tuy nhiên, đây lại là một cách hiệu quả để giảm tình trạng tóc bết tạm thời khi không có thời gian để gội đầu. Hãy nhớ rằng bạn vẫn cần gội đầu bằng nước và sản phẩm làm sạch định kỳ để bảo vệ da đầu và mái tóc khỏe mạnh nhé!
          </p>
          <div className={styles.newsimageWrapper}>
            <img
              src="/images/image159.png"
              alt="Sử dụng sản phẩm khô"
              width={690}
              height={448}
              className={styles.newsimage}
            />
          </div>
          <p className={styles.newsText}>
            Có thể nói đây không phải là một phương pháp mới mà đã tồn tại từ rất lâu trước cả khi công nghệ dầu gội phát triển như hiện nay. Theo đó, trước khi biết đến dầu gội đầu thông dụng, người ta thường sử dụng nước lã hoặc các loại thảo dược để làm sạch da đầu đồng thời giữ cho mái tóc luôn sạch bóng và khoẻ mạnh.<br /><br />
            Như vậy có thể kết luật cho câu hỏi: “Gội đầu không dùng dầu gội có sao không?” là KHÔNG nhé! Tuy nhiên phương pháp nào cũng sẽ tồn tại những ưu và nhược điểm khác nhau, mời bạn cùng tìm hiểu những phần nội dung tiếp theo để hiểu hơn về vấn đề này nhé!
          </p>
        </div>

        <div className={styles.newsRelated}>
          <p className={styles.newsRelatedTitle}>Xem Thêm</p>
          <div className={styles.newsRelatedGrid}>
            {[
              { text: "10 cách trị nấm da đầu hiệu quả", alt: "Nấm da đầu" },
              { text: "Cách để trẻ lâu từ các thành phần tự nhiên", alt: "Chống lão hóa" },
              { text: "Xu hướng làm đẹp phải nữ năm 2025", alt: "Xu hướng 2025" },
              { text: "Bôi Vitamin E lên mặt có thể dùng mỗi đêm?", alt: "Vitamin E" },
              { text: "Vitamin E có trong thực phẩm nào nhiều nhất?", alt: "Thực phẩm giàu vitamin" },
              { text: "Salicylic Acid là gì? Tác dụng của nó với da dầu mụn", alt: "Salicylic acid" },
            ].map((item, idx) => (
              <Link href="#" className={styles.newsRelatedLink} key={idx}>
                <div className={styles.newsRelatedItem}>
                  <img
                    src="/images/image159.png"
                    alt={item.alt}
                    width={410}
                    height={250}
                    className={styles.newsRelatedimage}
                  />
                  <p className={styles.newsRelatedText}>{item.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}