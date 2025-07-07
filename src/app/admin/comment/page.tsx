"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface Comment {
  _id: string;
  content: string;
  status: "show" | "hidden";
  createdAt: string;
  updatedAt: string;
  user: User;
  product: Product;
}

const CommentPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchComments = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || role !== "admin") {
        setAuthChecked(false);
        router.push("/user/login");
        return;
      }

      try {
        const res = await fetch("https://api-zeal.onrender.com/api/comments", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401 || res.status === 403) {
          alert("Bạn không có quyền truy cập. Vui lòng đăng nhập lại.");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          router.push("/user/login");
          return;
        }

        if (!res.ok) {
          throw new Error(`Lỗi HTTP! Trạng thái: ${res.status}`);
        }

        const data: Comment[] = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Lỗi khi tải bình luận:", error);
        alert("Không thể tải bình luận. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    fetchComments();
  }, [router]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">Đang tải bình luận...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý bình luận</h1>
      {comments.length === 0 ? (
        <p className="text-gray-600">Không có bình luận nào.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment._id}
              className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow"
            >
              <p>
                <strong className="text-gray-700">User:</strong>{" "}
                {comment.user.username} ({comment.user.email})
              </p>
              <p>
                <strong className="text-gray-700">Sản phẩm:</strong>{" "}
                {comment.product.name}
              </p>
              <p>
                <strong className="text-gray-700">Nội dung:</strong>{" "}
                {comment.content}
              </p>
              <p>
                <strong className="text-gray-700">Trạng thái:</strong>{" "}
                {comment.status === "show" ? "Hiển thị" : "Ẩn"}
              </p>
              <p>
                <strong className="text-gray-700">Ngày:</strong>{" "}
                {new Date(comment.createdAt).toLocaleString("vi-VN")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentPage;