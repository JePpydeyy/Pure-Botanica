"use client";

import React, { useEffect, useState } from "react";
import styles from "./policy.module.css";
import ScrollInView from "../../components/ScrollInView";

const PolicyPage = () => {
  const [logoLoading, setLogoLoading] = useState<boolean>(true);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [cacheBuster, setCacheBuster] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    setCacheBuster(`_t=${Date.now()}`);
  }, []);

  const getImageUrl = (image: string | null): string => {
    if (!image) return "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg";
    return image.startsWith("http") ? `${image}?${cacheBuster}` : image;
  };

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setLogoLoading(true);
        setLogoError(null);
        const logoResponse = await fetch("https://api-zeal.onrender.com/api/interfaces/logo-shop", { cache: "no-store" });
        if (!logoResponse.ok) throw new Error(`Lỗi HTTP: ${logoResponse.status} ${logoResponse.statusText}`);
        const logoData = await logoResponse.json();
        setLogoUrl(logoData.paths && logoData.paths.length > 0 ? logoData.paths[0] : null);
      } catch (error: any) {
        console.error("Lỗi tải logo:", error);
        setLogoError(error.message || "Không thể tải logo");
        setLogoUrl(null);
      } finally {
        setLogoLoading(false);
      }
    };

    fetchLogo();
  }, []);

  const handleScroll = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    const heading = section?.querySelector("h2");
    if (heading) {
      const navHeight = document.querySelector(`.${styles.navBar}`)?.getBoundingClientRect().height || 50;
      const offsetTop = heading.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.container}>
      {logoLoading && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      )}
      <ScrollInView>
        <section className={styles.header}>
          {logoError ? (
            <p className={styles.error}>Lỗi: {logoError}</p>
          ) : (
            <img src={getImageUrl(logoUrl)} alt="Logo Pure Botanica" className={styles.logo} />
          )}
          <h1>Chính Sách</h1>
        </section>
      </ScrollInView>

      <nav className={styles.navBar}>
        <ul className={styles.navList}>
          <li><a href="#privacy-policy" className={styles.navLink} onClick={(e) => { e.preventDefault(); handleScroll("privacy-policy"); }}>Chính Sách Bảo Mật</a></li>
          <li><a href="#return-policy" className={styles.navLink} onClick={(e) => { e.preventDefault(); handleScroll("return-policy"); }}>Chính Sách Đổi Trả</a></li>
          <li><a href="#delivery-policy" className={styles.navLink} onClick={(e) => { e.preventDefault(); handleScroll("delivery-policy"); }}>Chính Sách Giao Hàng</a></li>
          <li><a href="#information-policy" className={styles.navLink} onClick={(e) => { e.preventDefault(); handleScroll("information-policy"); }}>Chính Sách Bảo Mật Thông Tin</a></li>
        </ul>
      </nav>

      <section className={styles.content}>
        <ScrollInView>
          <section id="privacy-policy" className={styles.section}>
            <h2 className={styles.sectionHeading}>Chính Sách Bảo Mật</h2>
            <p>
              Tại Pure Botanica, chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng theo các nguyên tắc nghiêm ngặt:
            </p>
            <ul>
              <li><strong>Thu thập:</strong> Thu thập họ tên, địa chỉ, email khi đặt hàng hoặc đăng ký.</li>
              <li><strong>Sử dụng:</strong> Dùng để xử lý đơn hàng và gửi thông tin khuyến mãi (nếu đồng ý).</li>
              <li><strong>Bảo mật:</strong> Sử dụng mã hóa SSL và tuân thủ GDPR.</li>
              <li><strong>Chia sẻ:</strong> Không chia sẻ với bên thứ ba trừ khi pháp luật yêu cầu.</li>
              <li><strong>Quyền lợi:</strong> Liên hệ <a href="mailto:purebotanica@gmail.com" className={styles.link}>purebotanica@gmail.com</a> hoặc <a href="https://purebotanica.online/" className={styles.link}>https://purebotanica.online/</a>.</li>
            </ul>
            <p>Cập nhật: 21/08/2025 14:16 (giờ Việt Nam).</p>
          </section>
        </ScrollInView>

        <ScrollInView>
          <section id="return-policy" className={styles.section}>
            <h2 className={styles.sectionHeading}>Chính Sách Đổi Trả</h2>
            <p>
              Chúng tôi hỗ trợ đổi trả sản phẩm với các điều kiện sau:
            </p>
            <ul>
              <li><strong>Thời hạn:</strong> Trong 7 ngày kể từ ngày nhận hàng.</li>
              <li><strong>Điều kiện:</strong> Sản phẩm lỗi, sai kích cỡ, hoặc không đúng mô tả.</li>
              <li><strong>Quy trình:</strong> Liên hệ <a href="mailto:purebotanica@gmail.com" className={styles.link}>purebotanica@gmail.com</a> hoặc <a href="https://purebotanica.online/" className={styles.link}>https://purebotanica.online/</a>.</li>
              <li><strong>Chi phí:</strong> Miễn phí nếu lỗi từ nhà cung cấp, khách hàng chịu phí nếu đổi ý.</li>
            </ul>
            <p>Cập nhật: 21/08/2025 14:16 (giờ Việt Nam).</p>
          </section>
        </ScrollInView>

        <ScrollInView>
          <section id="delivery-policy" className={styles.section}>
            <h2 className={styles.sectionHeading}>Chính Sách Giao Hàng</h2>
            <p>
              Dịch vụ giao hàng của chúng tôi bao gồm:
            </p>
            <ul>
              <li><strong>Thời gian:</strong> 2-5 ngày (nội thành), 5-7 ngày (ngoại thành).</li>
              <li><strong>Phí:</strong> Miễn phí từ 1.000.000 VNĐ, 30.000 VNĐ dưới mức này.</li>
              <li><strong>Khu vực:</strong> Toàn quốc.</li>
              <li><strong>Theo dõi:</strong> Nhận mã qua email/SMS.</li>
            </ul>
            <p>Cập nhật: 21/08/2025 14:16 (giờ Việt Nam).</p>
          </section>
        </ScrollInView>

        <ScrollInView>
          <section id="information-policy" className={styles.section}>
            <h2 className={styles.sectionHeading}>Chính Sách Bảo Mật Thông Tin</h2>
            <p>
              Chính sách bảo mật thông tin chi tiết:
            </p>
            <ul>
              <li><strong>Thu thập:</strong> Họ tên, email, số điện thoại khi đăng ký.</li>
              <li><strong>Mục đích:</strong> Xử lý đơn hàng, hỗ trợ khách hàng.</li>
              <li><strong>Bảo vệ:</strong> Mã hóa SSL, tuân thủ GDPR.</li>
              <li><strong>Quyền lợi:</strong> Liên hệ <a href="mailto:purebotanica@gmail.com" className={styles.link}>purebotanica@gmail.com</a> hoặc <a href="https://purebotanica.online/" className={styles.link}>https://purebotanica.online/</a>.</li>
            </ul>
            <p>Cập nhật: 21/08/2025 14:16 (giờ Việt Nam).</p>
          </section>
        </ScrollInView>
      </section>
    </div>
  );
};

export default PolicyPage;