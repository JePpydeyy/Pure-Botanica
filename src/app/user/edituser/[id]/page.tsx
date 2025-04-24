// src/app/user/edituser/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react"; // Import React.use để unwrap params

// Định nghĩa interface cho User
interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  status: string;
  listOrder: any[];
  birthday: string | null;
}

export default function EditUser({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params để lấy id
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const router = useRouter();

  // Lấy dữ liệu người dùng từ API dựa trên id
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Không có token. Vui lòng đăng nhập.");
      setLoading(false);
      router.push("/login"); // Chuyển hướng đến trang đăng nhập nếu không có token
      return;
    }

    // Gọi API để lấy thông tin người dùng
    fetch(`https://api-zeal.onrender.com/api/users/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi khi tải thông tin người dùng.");
        }
        return res.json();
      })
      .then((data) => {
        if (data._id !== id) {
          setError("Không tìm thấy người dùng với ID này.");
        } else {
          setUser(data);
          setFormData({
            username: data.username,
            email: data.email,
            phone: data.phone,
            birthday: data.birthday,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Lỗi khi tải thông tin người dùng.");
        setLoading(false);
      });
  }, [id, router]);

  // Xử lý thay đổi input trong form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý gửi form để cập nhật thông tin người dùng
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Không có token. Vui lòng đăng nhập.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`https://api-zeal.onrender.com/api/users/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Gửi dữ liệu form, không cần _id vì id đã trong URL
      });

      if (response.ok) {
        router.push("/user/userinfo"); // Chuyển hướng về trang profile sau khi cập nhật thành công
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Lỗi khi cập nhật thông tin.");
      }
    } catch (err) {
      setError("Lỗi khi gửi yêu cầu cập nhật.");
    }
  };

  // Xử lý giao diện khi đang tải, lỗi hoặc không có dữ liệu
  if (loading) return <p>Đang tải thông tin...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>Không tìm thấy thông tin người dùng.</p>;

  return (
    <div>
      <h2>Chỉnh sửa thông tin người dùng</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên:</label>
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>SĐT:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Ngày sinh:</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday ? formData.birthday.split("T")[0] : ""}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Lưu thay đổi</button>
        <Link href="/user/userinfo">
          <button type="button">Hủy</button>
        </Link>
      </form>
    </div>
  );
}