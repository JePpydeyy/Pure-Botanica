"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./addnews.module.css";

config.autoAddCss = false;

const AddArticle = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnailFile: null as File | null,
    status: "show" as "show" | "hidden",
    contentImages: [] as File[],
  });

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const [activeFormats, setActiveFormats] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [previewContentImages, setPreviewContentImages] = useState<string[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/user/login");
    }
  }, [router]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const updateFormatStates = () => {
      const commands = [
        "bold",
        "italic",
        "underline",
        "strikeThrough",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "insertUnorderedList",
        "insertOrderedList",
      ];
      const newStates: any = {};
      commands.forEach((cmd) => {
        newStates[cmd] = document.queryCommandState(cmd);
      });
      setActiveFormats(newStates);
    };

    document.addEventListener("selectionchange", updateFormatStates);
    editor.addEventListener("keyup", updateFormatStates);
    editor.addEventListener("mouseup", updateFormatStates);

    return () => {
      document.removeEventListener("selectionchange", updateFormatStates);
      editor.removeEventListener("keyup", updateFormatStates);
      editor.removeEventListener("mouseup", updateFormatStates);
    };
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    let displayMessage = message;
    if (message.includes("Trùng lặp slug") || message.includes("duplicate key")) {
      displayMessage = "Slug đã tồn tại. Vui lòng thử lại với tiêu đề khác.";
    } else if (message.includes("Không tìm thấy file thumbnail")) {
      displayMessage = "Vui lòng chọn một ảnh thumbnail.";
    } else if (message.includes("Invalid file type")) {
      displayMessage = "Loại file không hợp lệ. Chỉ chấp nhận JPG, PNG, GIF, WebP.";
    } else if (message.includes("File too large")) {
      displayMessage = "Kích thước file quá lớn. Tối đa 10MB.";
    } else if (message.includes("Unauthorized") || message.includes("Forbidden")) {
      displayMessage = "Bạn không có quyền thực hiện thao tác này.";
      router.push("/user/login");
    } else if (message.includes("Cannot destructure property")) {
      displayMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
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
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        showNotification("Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)", "error");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showNotification("Kích thước file không được vượt quá 10MB", "error");
        return;
      }
      setFormData((prev) => ({ ...prev, thumbnailFile: file }));
      setPreviewThumbnail(URL.createObjectURL(file)); // Preview thumbnail
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const files = Array.from(e.target.files);
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
      const validFiles = files.filter((file) => allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024);

      if (validFiles.length !== files.length) {
        showNotification("Một số file không hợp lệ hoặc quá lớn.", "error");
        return;
      }

      if (editorRef.current) {
        validFiles.forEach((file) => {
          const imgTag = `<img src="${URL.createObjectURL(file)}" alt="Image" style="max-width:100%; height:auto;" />`;
          editorRef.current!.innerHTML += imgTag;
        });
        setFormData((prev) => ({
          ...prev,
          content: editorRef.current!.innerHTML,
          contentImages: [...prev.contentImages, ...validFiles],
        }));
        setPreviewContentImages(validFiles.map((file) => URL.createObjectURL(file))); // Preview content images
      }
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
      <button type="button" onClick={() => execCommand("bold")} className={activeFormats.bold ? styles.active : ""}>
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button type="button" onClick={() => execCommand("italic")} className={activeFormats.italic ? styles.active : ""}>
        <FontAwesomeIcon icon={faItalic} />
      </button>
      <button type="button" onClick={() => execCommand("underline")} className={activeFormats.underline ? styles.active : ""}>
        <FontAwesomeIcon icon={faUnderline} />
      </button>
      <button type="button" onClick={() => insertList("ul")} className={activeFormats.insertUnorderedList ? styles.active : ""}>
        <FontAwesomeIcon icon={faListUl} />
      </button>
      <button type="button" onClick={() => insertList("ol")} className={activeFormats.insertOrderedList ? styles.active : ""}>
        <FontAwesomeIcon icon={faListOl} />
      </button>
      <button type="button" onClick={() => fileInputRef.current?.click()}>
        <FontAwesomeIcon icon={faImage} />
      </button>
    </div>
  );

  const handleContentChange = () => {
    if (editorRef.current) {
      const cleanedContent = editorRef.current.innerHTML
        .replace(/ data-placeholder="true"/g, "")
        .trim();
      setFormData((prev) => ({ ...prev, content: cleanedContent }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.title.trim()) {
      showNotification("Vui lòng nhập tiêu đề bài viết.", "error");
      return;
    }
    if (!formData.content.trim() || formData.content.trim() === "<br>") {
      showNotification("Vui lòng nhập nội dung bài viết.", "error");
      return;
    }
    if (!formData.thumbnailFile) {
      showNotification("Vui lòng chọn ảnh thumbnail.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Vui lòng đăng nhập lại.", "error");
        router.push("/user/login");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("content", formData.content.trim());
      formDataToSend.append("thumbnail", formData.thumbnailFile);
      formDataToSend.append("thumbnailCaption", formData.title.trim());
      formDataToSend.append("status", formData.status);
      formDataToSend.append("views", "0");

      formData.contentImages.forEach((file) => {
        formDataToSend.append("contentImages", file);
      });

      const response = await fetch("https://api-zeal.onrender.com/api/news", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();
      if (!response.ok) {
        showNotification(result.error || "Lỗi khi thêm bài viết", "error");
        return;
      }

      showNotification("Thêm bài viết thành công!", "success");
      setFormData({ title: "", content: "", thumbnailFile: null, status: "show", contentImages: [] });
      setPreviewThumbnail(null);
      setPreviewContentImages([]);
      if (editorRef.current) editorRef.current.innerHTML = "";
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => {
        router.push("/admin/article");
      }, 1500);
    } catch (error) {
      console.error("Lỗi yêu cầu:", error);
      showNotification("Lỗi kết nối. Vui lòng kiểm tra mạng.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.addArticleContainer}>
      <h1 className={styles.title}>Thêm bài viết</h1>

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
            placeholder="Nhập tiêu đề"
            maxLength={100}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Trạng thái *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className={styles.input}
            required
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
            required
          />
          {previewThumbnail && (
            <div className={styles.preview}>
              <FontAwesomeIcon icon={faEye} /> Preview:
              <img src={previewThumbnail} alt="Thumbnail Preview" className={styles.previewImage} />
            </div>
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
            multiple
          />
          {previewContentImages.length > 0 && (
            <div className={styles.preview}>
              <FontAwesomeIcon icon={faEye} /> Preview Content Images:
              {previewContentImages.map((src, index) => (
                <img key={index} src={src} alt={`Content Image ${index}`} className={styles.previewImage} />
              ))}
            </div>
          )}
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => router.push("/admin/article")}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang thêm..." : "✓ Thêm bài viết"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArticle;