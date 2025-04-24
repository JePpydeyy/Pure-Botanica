"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import "./comment.css";

export default function Comment() {
  interface Comment {
    _id: string;
    user: {
      _id: string;
      username: string;
      email: string;
    };
    product: {
      _id: string;
      name: string;
      price: number;
      images: string[];
    };
    content: string;
    createdAt: string;
    updatedAt?: string;
  }

  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (!token) {
          setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
          return;
        }

        const response = await axios.get<Comment[]>("https://api-zeal.onrender.com/api/comments/", {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        });

        setComments(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bình luận:", error);
        setError("Không thể tải danh sách bình luận");
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  // Handle delete comment
  const handleDelete = async (commentId: string, userId: string) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bình luận này?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      if (!token) {
        alert("Không tìm thấy token. Vui lòng đăng nhập lại.");
        return;
      }

      await axios.request({
        url: `https://api-zeal.onrender.com/api/comments/${commentId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
          "Content-Type": "application/json",
        },
        data: { userId }, // Truyền userId trong body
      });

      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
      alert("Xóa bình luận thành công!");
    } catch (error: any) {
      console.error("Lỗi khi xóa bình luận:", error);
      const errorMessage =
        error.response?.data?.error || "Không thể xóa bình luận. Vui lòng thử lại.";
      alert(errorMessage);
    }
  };

  if (loading) return <div className="loading-message">Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <div className="title_container">
        <h1>BÌNH LUẬN</h1>
      </div>
      <div className="comments-container">
        <ul className="tabs">
          <li className="active">Tất cả bình luận</li>
        </ul>
        <table className="comments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Sản Phẩm</th>
              <th>Hình Ảnh</th>
              <th>Nội Dung</th>
              <th>Ngày</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment, index) => (
              <tr key={comment._id}>
                <td>{index + 1}</td>
                <td>{comment.user.username}</td>
                <td>{comment.user.email}</td>
                <td>{comment.product.name}</td>
                <td>
                  <img
                    src={`https://api-zeal.onrender.com/images/${comment.product.images[0]}`}
                    alt={comment.product.name}
                    className="product-image"
                  />
                </td>
                <td>{comment.content}</td>
                <td>{formatDate(comment.createdAt)}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(comment._id, comment.user._id)} // Truyền comment._id và comment.user._id
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}