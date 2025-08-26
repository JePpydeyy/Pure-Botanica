"use client";

import React, { useState, useEffect, useRef } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Hàm chuyển đổi chuỗi có dấu thành không dấu và định dạng slug (thêm lại làm dự phòng)
const convertToSlug = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-"); // Thay khoảng trắng bằng dấu gạch ngang
};

interface Product {
  _id?: string;
  name: string;
  price: number | null;
  images: string[];
  slug?: string; // Thêm optional để xử lý trường hợp undefined
}

interface Coupon {
  code: string;
  discountValue: number;
  discountType: string;
  minOrderValue: number;
  expiryDate?: string;
}

interface News {
  title: string;
  slug: string;
  thumbnailUrl: string;
  publishedAt: string;
}

interface Brand {
  name: string;
  logoImg: string;
}

interface Category {
  name: string;
}

interface Message {
  _id?: string;
  sessionId: string;
  role: "user" | "model";
  content: string;
  file?: { data: string; mime_type: string } | null;
  timestamp: string;
  products?: Product[];
  coupons?: Coupon[];
  news?: News[];
  brands?: Brand[];
  categories?: Category[];
}

const API_BASE_URL = "https://api-zeal.onrender.com/api/chatbot";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<{ data: string; mime_type: string } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const createOrGetSession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionId || "" }),
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setSessionId(data.sessionId);
        fetchChatHistory(data.sessionId);
      } catch (error) {
        const errorMsg = (error as Error).message;
        console.error("Lỗi tạo session:", error);
        setError(`Không thể khởi tạo Chatbot: ${errorMsg}`);
        MySwal.fire({
          icon: "error",
          title: "Lỗi",
          text: `Không thể khởi tạo Chatbot: ${errorMsg}`,
        });
      }
    };
    createOrGetSession();
  }, [sessionId]);

  const fetchChatHistory = async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/history/${sessionId}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) throw new Error("Response is not JSON");
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Lỗi lấy lịch sử chat:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || error) return;

    const newMessage: Message = {
      sessionId: sessionId,
      role: "user",
      content: input,
      file: file ? file : null,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setFile(null);

    try {
      const sendData = {
        sessionId,
        message: newMessage.content,
        ...(file && { file: file }),
      };
      console.log("Request URL:", `${API_BASE_URL}/send`);
      console.log("Request body:", JSON.stringify(sendData, null, 2));

      const response = await fetch(`${API_BASE_URL}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) throw new Error("Response is not JSON");
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          sessionId,
          role: "model",
          content: data.message,
          timestamp: new Date().toISOString(),
          products: data.products || [],
          coupons: data.coupons || [],
          news: data.news || [],
          brands: data.brands || [],
          categories: data.categories || [],
        },
      ]);
    } catch (error) {
      console.error("Send message error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sessionId,
          role: "model",
          content: `Lỗi: ${(error as Error).message}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ behavior: "smooth", top: chatBodyRef.current.scrollHeight });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target.files?.[0];
    if (!fileInput) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(fileInput.type)) {
      MySwal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      setFile({ data: base64String, mime_type: fileInput.type });
    };
    reader.readAsDataURL(fileInput);
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setInput((prev) => prev + emoji.native);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && input.trim() && window.innerWidth > 768) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
        Chatbot không khả dụng: {error}
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        <img
          src="https://app.preny.ai/gif/preny_2.gif"
          alt="Chatbot Toggle"
          className="chatbot-toggle-img"
        />
      </button>
      <div className={`chatbot-popup ${isOpen ? "scale-100" : "scale-20"}`}>
        <div className="chat-header">
          <div className="header-info">
            <img
              src="https://res.cloudinary.com/dgud3sqyn/image/upload/v1756088068/uploads/1756088067315-e2a6w0.png"
              alt="Bot Avatar"
              className="chatbot-logo"
            />
            <h2 className="logo-text">PURE BOTANICA - BOT</h2>
          </div>
          <button id="close-chatbot" onClick={() => setIsOpen(false)}>
            ↓
          </button>
        </div>
        <div ref={chatBodyRef} className="chat-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}
            >
              {msg.role === "model" && (
                <img
                  src="https://res.cloudinary.com/dgud3sqyn/image/upload/v1756088068/uploads/1756088067315-e2a6w0.png"
                  alt="Bot Avatar"
                  className="bot-avatar"
                />
              )}
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                {msg.file?.data && (
                  <img
                    src={`data:${msg.file.mime_type};base64,${msg.file.data}`}
                    alt="Attachment"
                    className="attachment"
                  />
                )}
                {/* Hiển thị sản phẩm */}
                {msg.products && msg.products.length > 0 && (
                  <div className="products-list">
                    <h4 className="section-title">Gợi ý sản phẩm</h4>
                    <div className="products-grid">
                      {msg.products.map((product, idx) => (
                        <div key={idx} className="product-card">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="product-image"
                            />
                          ) : (
                            <div className="no-image">Không có ảnh</div>
                          )}
                          <div className="product-info">
                            <h5 className="product-name">{product.name}</h5>
                            <p className="product-price">
                              {product.price ? `${product.price.toLocaleString("vi-VN")} VNĐ` : "Liên hệ"}
                            </p>
                            <a
                              href={`/user/detail/${product.slug || convertToSlug(product.name)}`}
                              className="product-link"
                            >
                              Xem chi tiết
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Hiển thị mã giảm giá */}
                {msg.coupons && msg.coupons.length > 0 && (
                  <div className="coupons-list">
                    <h4 className="section-title">Mã giảm giá</h4>
                    <div className="coupons-grid">
                      {msg.coupons.map((coupon, idx) => (
                        <div key={idx} className="coupon-card">
                          <div className="coupon-code">{coupon.code}</div>
                          <div className="coupon-details">
                            <p>
                              Giảm:{" "}
                              {coupon.discountType === "percentage"
                                ? `${coupon.discountValue}%`
                                : `${coupon.discountValue.toLocaleString("vi-VN")} VNĐ`}
                            </p>
                            <p>Đơn tối thiểu: {coupon.minOrderValue.toLocaleString("vi-VN")} VNĐ</p>
                            <p>
                              Hết hạn:{" "}
                              {coupon.expiryDate
                                ? new Date(coupon.expiryDate).toLocaleDateString("vi-VN")
                                : "Không thời hạn"}
                            </p>
                          </div>
                          <button
                            className="copy-coupon-btn"
                            onClick={() => navigator.clipboard.writeText(coupon.code)}
                          >
                            Sao chép mã
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Hiển thị tin tức */}
                {msg.news && msg.news.length > 0 && (
                  <div className="news-list">
                    <h4 className="section-title">Tin tức mới nhất</h4>
                    <div className="news-grid">
                      {msg.news.map((news, idx) => (
                        <div key={idx} className="news-card">
                          {news.thumbnailUrl && (
                            <img
                              src={news.thumbnailUrl}
                              alt={news.title}
                              className="news-image"
                            />
                          )}
                          <div className="news-info">
                            <h5 className="news-title">{news.title}</h5>
                            <p className="news-date">
                              Ngày đăng: {new Date(news.publishedAt).toLocaleDateString("vi-VN")}
                            </p>
                            <a
                              href={`https://purebotanice.com/news/${news.slug}`}
                              className="news-link"
                            >
                              Đọc thêm
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Hiển thị thương hiệu */}
                {msg.brands && msg.brands.length > 0 && (
                  <div className="brands-list">
                    <h4 className="section-title">Thương hiệu</h4>
                    <div className="brands-grid">
                      {msg.brands.map((brand, idx) => (
                        <div key={idx} className="brand-card">
                          {brand.logoImg && (
                            <img
                              src={brand.logoImg}
                              alt={brand.name}
                              className="brand-image"
                            />
                          )}
                          <p className="brand-name">{brand.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Hiển thị danh mục */}
                {msg.categories && msg.categories.length > 0 && (
                  <div className="categories-list">
                    <h4 className="section-title">Danh mục</h4>
                    <div className="categories-grid">
                      {msg.categories.map((category, idx) => (
                        <div key={idx} className="category-card">
                          <p className="category-name">{category.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <form onSubmit={handleSendMessage} className="chat-form">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              className="message-input"
              required
            />
            <div className="chat-controls">
              <button type="button" id="emoji-picker" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                😊
              </button>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="file-input"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                />
                {file?.data ? (
                  <>
                    <img src={`data:${file.mime_type};base64,${file.data}`} alt="Uploaded" className="file-preview" />
                    <button type="button" id="file-cancel" onClick={() => setFile(null)}>
                      ✕
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    id="file-upload"
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    📎
                  </button>
                )}
              </div>
              <button type="submit" id="send-message">
                ↑
              </button>
            </div>
          </form>
          {showEmojiPicker && (
            <div className="emoji-picker">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                onClickOutside={() => setShowEmojiPicker(false)}
                theme="light"
                previewPosition="none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;