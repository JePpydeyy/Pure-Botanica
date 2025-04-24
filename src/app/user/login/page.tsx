"use client";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import "./login.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Import useAuth

// Interface định nghĩa kiểu cho payload token
interface CustomJwtPayload {
  id?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { isLoggedIn } = useAuth(); // Sử dụng AuthContext

  // Sử dụng useEffect để thực hiện chuyển hướng sau khi render
  useEffect(() => {
    if (isLoggedIn) {
      // Nếu đã đăng nhập, chuyển hướng đến trang chủ (hoặc trang khác tùy thuộc vào vai trò)
      router.push("/user");
    }
  }, [isLoggedIn, router]); // Thêm dependencies để theo dõi sự thay đổi của isLoggedIn và router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://api-zeal.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng nhập thất bại");
        return;
      }

      // Giải mã token
      const decodedToken: CustomJwtPayload = jwtDecode(data.token);
      const userRole = decodedToken.role;
      const userEmail = decodedToken.email;

      if (!userRole) {
        setError("Không tìm thấy thông tin vai trò người dùng");
        return;
      }

      // Lưu thông tin vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("email", userEmail || "");

      // Force refresh để context được cập nhật và chuyển hướng
      window.location.href = userRole === "admin" ? "/admin" : "/user";
    } catch (err: any) {
      console.error("Lỗi đăng nhập:", err);
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="containerrr">
      <div className="form-box">
        <h2>
          <strong>ĐĂNG NHẬP</strong>
        </h2>

        <button className="google-btn">
          <img src="/images/icons8-google-48.png" alt="Google Logo" /> Đăng nhập với Google
        </button>

        <div className="divider">
          <hr />
          <span>Đăng nhập bằng tài khoản</span>
          <hr />
        </div>

        <form action="#" method="post" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Myname@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot-password">
            <a href="#">Quên mật khẩu?</a>
          </div>

          <button type="submit" className="submit-btn">ĐĂNG NHẬP</button>
          {error && <p className="error-message">{error}</p>}

          <p className="switch-form">
            Chưa có tài khoản? <Link href="/user/register">Đăng ký</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
