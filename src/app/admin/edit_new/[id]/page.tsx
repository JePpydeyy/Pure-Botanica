"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faListUl,
  faListOl,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./editnews.module.css";

config.autoAddCss = false;

const EditNews = () => {
  const { id } = useParams(); // Lấy identifier từ URL (sẽ được xử lý như slug)
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    content: string;
    thumbnailFile: File | null;
    images: File[];
    status: string;
    thumbnailUrl: string;
  }>({
    title: "",
    slug: "",
    content: "",
    thumbnailFile: null,
    images: [],
    status: "show",
    thumbnailUrl: "",
  });

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [activeFormats, setActiveFormats] = useState({});
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/user/login");
    } else {
      fetchNews();
    }
  }, [id, router]);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://api-zeal.onrender.com/api/news/${encodeURIComponent(id)}`, // Sử dụng id như slug
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const news = await response.json();
        setFormData({
          title: news.title,
          slug: news.slug,
          content: news.content,
          thumbnailFile: null,
          images: [],
          status: news.status,
          thumbnailUrl: `https://api-zeal.onrender.com${news.thumbnailUrl}`,
        });
        if (editorRef.current) editorRef.current.innerHTML = news.content;
      } else {
        showNotification("Không tìm thấy tin tức với slug này.", "error");
      }
    } catch (err) {
      console.error("Lỗi tải tin tức:", err);
      showNotification("Có lỗi khi tải tin tức.", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    let displayMessage = message;
    if (message.includes("Trùng lặp slug")) {
      displayMessage = "Slug đã tồn tại. Vui lòng chọn slug khác.";
    } else if (message.includes("Không tìm thấy file thumbnail")) {
      displayMessage = "Vui lòng chọn một ảnh thumbnail.";
    }
    setNotification({ show: true, message: displayMessage, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData((prev) => ({
        ...prev,
        thumbnailFile: e.target.files[0],
        thumbnailUrl: URL.createObjectURL(e.target.files[0]), // Preview ảnh mới
      }));
    }
  };

  const uploadImageToServer = async (file: File) => {
    try {
      const imageData = new FormData();
      imageData.append("image", file);

      const token = localStorage.getItem("token");
      const response = await fetch("https://api-zeal.onrender.com/api/images", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: imageData,
      });

      const data = await response.json();
      if (response.ok && data.imageUrl) {
        return { url: data.imageUrl, file };
      } else {
        showNotification(data.error || "Lỗi khi tải ảnh nội dung", "error");
        return null;
      }
    } catch (err) {
      console.error("Lỗi tải ảnh:", err);
      showNotification("Không thể tải ảnh nội dung", "error");
      return null;
    }
  };

  const insertImage = (imageUrl: string) => {
    if (!editorRef.current || !imageUrl) return;
    const imgTag = `<img src="${imageUrl}" alt="Image" style="max-width:100%; height:auto;" />`;
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(range.createContextualFragment(imgTag));
    } else {
      editorRef.current.innerHTML += imgTag;
    }
    editorRef.current.focus();
    setFormData((prev) => ({ ...prev, content: editorRef.current.innerHTML }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const result = await uploadImageToServer(file);
    if (result) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, result.file],
      }));
      insertImage(result.url);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    setTimeout(() => {
      const event = new Event("input", { bubbles: true });
      editorRef.current?.dispatchEvent(event);
    }, 10);
  };

  const insertHeading = (level: string) => {
    if (level) execCommand("formatBlock", `<h${level}>`);
  };

  const insertList = (type: "ul" | "ol") => {
    execCommand(`insert${type === "ul" ? "UnorderedList" : "OrderedList"}`);
  };

  const renderToolbar = () => (
    <div className={styles.toolbar}>
      <select onChange={(e) => insertHeading(e.target.value)} defaultValue="">
        <option value="">Heading</option>
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
      </select>
      <button
        type="button"
        onClick={() => execCommand("bold")}
        className={activeFormats.bold ? styles.active : ""}
      >
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button
        type="button"
        onClick={() => execCommand("italic")}
        className={activeFormats.italic ? styles.active : ""}
      >
        <FontAwesomeIcon icon={faItalic} />
      </button>
      <button
        type="button"
        onClick={() => execCommand("underline")}
        className={activeFormats.underline ? styles.active : ""}
      >
        <FontAwesomeIcon icon={faUnderline} />
      </button>
      <button
        type="button"
        onClick={() => insertList("ul")}
        className={activeFormats.insertUnorderedList ? styles.active : ""}
      >
        <FontAwesomeIcon icon={faListUl} />
      </button>
      <button
        type="button"
        onClick={() => insertList("ol")}
        className={activeFormats.insertOrderedList ? styles.active : ""}
      >
        <FontAwesomeIcon icon={faListOl} />
      </button>
      <button type="button" onClick={() => fileInputRef.current?.click()}>
        <FontAwesomeIcon icon={faImage} />
      </button>
    </div>
  );

  const handleContentChange = () => {
    if (editorRef.current) {
      setFormData((prev) => ({ ...prev, content: editorRef.current.innerHTML }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showNotification("Vui lòng điền đầy đủ tiêu đề và nội dung.", "error");
      return;
    }

    try {
      const articleData = new FormData();
      articleData.append("title", formData.title);
      articleData.append("slug", formData.slug || ""); // Để BE tự tạo nếu trống
      articleData.append("content", formData.content);
      articleData.append("status", formData.status);
      if (formData.thumbnailFile) {
        articleData.append("thumbnail", formData.thumbnailFile);
      }
      formData.images.forEach((image) => {
        articleData.append("images", image);
      });

      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://api-zeal.onrender.com/api/news/${encodeURIComponent(id)}`, // Sử dụng id như slug
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: articleData,
        }
      );

      if (response.status === 401 || response.status === 403) {
        showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/user/login");
        return;
      }

      const data = await response.json();
      if (response.ok) {
        showNotification("Cập nhật tin tức thành công", "success");
        router.push("/admin/news"); // Quay lại danh sách tin tức
      } else {
        showNotification(data.error || "Đã xảy ra lỗi khi cập nhật.", "error");
      }
    } catch (err) {
      console.error("Lỗi cập nhật tin tức:", err);
      showNotification("Có lỗi xảy ra khi cập nhật tin tức.", "error");
    }
  };

  return (
    <div className={styles.editNewsContainer}>
      <h1 className={styles.title}>Chỉnh sửa tin tức</h1>
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tiêu đề *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Slug (tùy chọn)</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Để trống để tự động tạo slug"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Trạng thái</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className={styles.input}
          >
            <option value="show">Hiển thị</option>
            <option value="hidden">Ẩn</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Thumbnail *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            ref={thumbnailInputRef}
            className={styles.input}
          />
          {formData.thumbnailUrl && (
            <Image
              src={formData.thumbnailUrl}
              alt="Thumbnail Preview"
              width={100}
              height={100}
            />
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nội dung *</label>
          {renderToolbar()}
          <div
            ref={editorRef}
            className={styles.editor}
            contentEditable
            onInput={handleContentChange}
            data-placeholder="Nhập nội dung..."
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          ✓ Cập nhật tin tức
        </button>
      </form>
    </div>
  );
};

export default EditNews;