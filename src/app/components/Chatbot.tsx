"use client";

import React, { useState, useEffect, useRef } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface Product {
  name: string;
  price: number | null;
  images: string[];
}

interface Message {
  _id?: string;
  sessionId: string;
  role: "user" | "model";
  content: string;
  file?: { data: string; mime_type: string } | null;
  timestamp: string;
  products?: Product[]; // Thêm trường products vào interface
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
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
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
      console.log('Request URL:', `${API_BASE_URL}/send`);
      console.log('Request body:', JSON.stringify(sendData, null, 2));

      const response = await fetch(`${API_BASE_URL}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error:', errorText);
            throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
            throw new Error("Response is not JSON");
        }
        const data = await response.json();
        // Thêm cả message và products (nếu có) vào tin nhắn của bot
        setMessages((prev) => [
            ...prev,
            {
                sessionId,
                role: "model",
                content: data.message,
                timestamp: new Date().toISOString(),
                products: data.products || [], // Lưu danh sách sản phẩm
            },
        ]);
    } catch (error) {
        console.error('Send message error:', error);
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

  // Render with error handling
  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", padding: "10px" }}>
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
            <div key={index} className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}>
              {msg.role === "model" && (
                <img
                  src="https://res.cloudinary.com/dgud3sqyn/image/upload/v1756088068/uploads/1756088067315-e2a6w0.png"
                  alt="Bot Avatar"
                  className="bot-avatar"
                />
              )}
              <div className="message-text">{msg.content}</div>
              {msg.file?.data && (
                <img
                  src={`data:${msg.file.mime_type};base64,${msg.file.data}`}
                  alt="Attachment"
                  className="attachment"
                />
              )}
              {/* Hiển thị danh sách sản phẩm nếu có */}
              {msg.products && msg.products.length > 0 && (
                <div className="products-list">
                  <h4>Gợi ý sản phẩm:</h4>
                  <div className="products-container">
                    {msg.products.map((product, idx) => (
                      <div key={idx} className="product-item">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="product-image"
                            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                          />
                        ) : (
                          <div className="no-image" style={{ width: "100px", height: "100px", background: "#f0f0f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            Không có ảnh
                          </div>
                        )}
                        <div className="product-info">
                          <p className="product-name">{product.name}</p>
                          <p className="product-price">
                            {product.price ? `${product.price.toLocaleString("vi-VN")} VNĐ` : "Liên hệ"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              placeholder="Message..."
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
                    <img src={`data:${file.mime_type};base64,${file.data}`} alt="Uploaded" />
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
            <div>
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