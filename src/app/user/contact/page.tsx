"use client";

import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import styles from "./contact.module.css";

const SERVICE_ID = "service_trjvfth"; // Thay bằng SERVICE_ID của bạn
const TEMPLATE_ID = "template_kzvwn07"; // Thay bằng TEMPLATE_ID của bạn
const PUBLIC_KEY = "5fm4LNMvD5wK_zt6a"; // Thay bằng PUBLIC_KEY của bạn
const API_BASE_URL = "https://api-zeal.onrender.com";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [logo, setLogo] = useState<string | null>(null); // Không dùng logo tĩnh mặc định
  const [loading, setLoading] = useState(true);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [cacheBuster, setCacheBuster] = useState<string>("");

  // Tạo cacheBuster để tránh cache hình ảnh
  useEffect(() => {
    setCacheBuster(`_t=${Date.now()}`);
  }, []);

  // Hàm xử lý URL ảnh
  const getImageUrl = (image: string | null): string => {
    if (!image) return "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg";
    // Thêm cache buster cho URL từ MongoDB (bắt đầu bằng http)
    return image.startsWith("http") ? `${image}?${cacheBuster}` : image;
  };

  // Fetch logo từ API khi component mount
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setLoading(true);
        setLogoError(null);
        const response = await fetch(`${API_BASE_URL}/api/interfaces/logo-shop`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.paths && data.paths.length > 0) {
          setLogo(data.paths[0]); // Sử dụng URL trực tiếp từ MongoDB
        } else {
          setLogo(null); // Không có logo, hiển thị 404
        }
      } catch (error: any) {
        console.error("Lỗi khi lấy logo:", error);
        setLogoError(error.message || "Không thể tải logo");
        setLogo(null); // Hiển thị hình ảnh 404 nếu lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, formData, PUBLIC_KEY)
      .then(() => {
        alert("Cảm ơn bạn đã liên hệ với Pure Botanica!");
        setFormData({ name: "", phone: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        alert("Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại sau.");
      });
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.contactHeader}>
        <h1>THÔNG TIN LIÊN HỆ</h1>
        <p>Liên hệ ngay để được tư vấn bí quyết làm đẹp hoàn hảo với sản phẩm của chúng tôi!</p>
      </div>

      <div className={styles.contactContent}>
        <div className={styles.contactInfo}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              {loading ? (
                <p>Đang tải logo...</p>
              ) : logoError ? (
                <p className={styles.errorContainer}>Lỗi: {logoError}</p>
              ) : (
                <img
                  src={getImageUrl(logo)} // Sử dụng getImageUrl để thêm cache buster
                  alt="Pure Botanica Logo"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg";
                    console.log("Không thể tải hình ảnh logo:", logo);
                  }}
                />
              )}
              <div className={styles.slogan}>
                <p>"Nurtured by Nature</p>
                <p>Perfected for You"</p>
              </div>
            </div>

            <div className={styles.infoDetails}>
              <div className={styles.infoItem}>
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Trụ sở chính:</strong> Tòa nhà QTSC9 (tòa T), đường Tô Ký, phường Tân Chánh Hiệp, Quận 12, TP Hồ Chí Minh
                </div>
              </div>

              <div className={styles.infoItem}>
                <i className="fas fa-phone"></i>
                <div>
                  <strong>Số điện thoại:</strong> 097 806 1649
                </div>
              </div>

              <div className={styles.infoItem}>
                <i className="fas fa-envelope"></i>
                <div>
                  <strong>Email:</strong> purebotanica@gmail.com
                </div>
              </div>

              <div className={styles.infoItem}>
                <i className="fas fa-clock"></i>
                <div>
                  <strong>Khung giờ làm việc:</strong> 8h-18h thứ 2 - thứ 7
                </div>
              </div>
            </div>
          </div>

          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4472468502183!2d106.62525307589173!3d10.853826857697598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529f8997a2f31%3A0xe30e97e8f50eb8c5!2zRlBUIFBvbHl0ZWNobmljIC0gVG_DoG4gUXXhuq1uIDExLCBUUC5IQ00!5e0!3m2!1svi!2s!4v1713703520970!5m2!1svi!2s"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className={styles.contactForm}>
          <div className={styles.formHeader}>
            <h2>Bạn cần hỗ trợ?</h2>
            <p>Hãy gửi mail cho chúng tôi.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Mô tả vấn đề"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className={styles.submitBtn}>
              Gửi cho Pure Botanica
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;