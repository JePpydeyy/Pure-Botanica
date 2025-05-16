"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from './verifyemail.module.css';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query as { token: string };
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) return;

      try {
        const res = await fetch(`http://localhost:10000/api/users/verify-email/${token}`, {
          method: "GET",
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Có lỗi xảy ra trong quá trình xác thực");
          return;
        }

        setMessage(data.message || "Xác thực email thành công! Bạn có thể đăng nhập.");
        // Chuyển hướng sau 3 giây
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err) {
        console.error("Lỗi xác thực email:", err);
        setError("Có lỗi xảy ra, vui lòng thử lại!");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className={styles.container}>
      <div className={styles["form-box"]}>
        <h2 className={styles["form-title"]}>Xác Thực Email</h2>
        {message && <p className={styles["success-message"]}>{message}</p>}
        {error && <p className={styles["error-message"]}>{error}</p>}
        {!message && !error && <p>Đang xác thực email...</p>}
      </div>
    </div>
  );
}