"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./edit_new.module.css";

config.autoAddCss = false;

const EditArticle = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnailFile: null as File | null,
    thumbnailCaption: "",
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
  const [isLoading, setIsLoading] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const fileToDataURL = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const fetchNewsBySlug = useCallback(async (slug: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Vui lòng đăng nhập lại.", "error");
        router.push("/user/login");
        return;
      }

      const response = await fetch(`https://api-zeal.onrender.com/api/news/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/user/login");
        return;
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        setFormData({
          title: result.title || "",
          content: result.content || "",
          thumbnailFile: null,
          thumbnailCaption: result.thumbnailCaption || "",
          status: result.status || "show",
          contentImages: [],
        });
        setPreviewThumbnail(result.thumbnailUrl ? `https://api-zeal.onrender.com/${result.thumbnailUrl}` : null);
        if (editorRef.current) {
          editorRef.current.innerHTML = result.content || "";
        }
      } else {
        showNotification(result.message || "Không tìm thấy bài viết với slug này.", "error");
      }
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
      showNotification("Lỗi kết nối khi tải bài viết. Vui lòng kiểm tra mạng và thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/user/login");
      return;
    }
    if (slug) {
      fetchNewsBySlug(slug);
    } else {
      setIsLoading(false);
      showNotification("Slug không hợp lệ. Vui lòng kiểm tra URL.", "error");
    }
  }, [router, slug, fetchNewsBySlug]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || isLoading) return;

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
        "createLink",
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
  }, [isLoading]);

  const showNotification = useCallback((message: string, type: "success" | "error") => {
    let displayMessage = message;
    if (message.includes("Trùng lặp slug") || message.includes("duplicate key")) {
      displayMessage = "Slug đã tồn tại. Vui lòng thử lại với tiêu đề khác.";
    } else if (message.includes("Không tìm thấy file thumbnail")) {
      displayMessage = "Vui lòng chọn một ảnh thumbnail.";
    } else if (message.includes("Invalid file type")) {
      displayMessage = "Loại file không hợp lệ. Chỉ chấp nhận JPG, PNG, GIF, WebP, SVG.";
    } else if (message.includes("File too large")) {
      displayMessage = "Kích thước file quá lớn. Tối đa 20MB.";
    } else if (message.includes("Unauthorized") || message.includes("Forbidden")) {
      displayMessage = "Bạn không có quyền thực hiện thao tác này.";
      router.push("/user/login");
    }
    setNotification({ show: true, message: displayMessage, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  }, [router]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleThumbnailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];
      if (!allowedTypes.includes(file.type)) {
        showNotification("Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP, SVG)", "error");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        showNotification("Kích thước file không được vượt quá 20MB", "error");
        return;
      }
      setFormData((prev) => ({ ...prev, thumbnailFile: file }));
      setPreviewThumbnail(URL.createObjectURL(file));
    }
  }, [showNotification]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length && editorRef.current) {
      const files = Array.from(e.target.files);
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];
      const validFiles = files.filter((file) => allowedTypes.includes(file.type) && file.size <= 20 * 1024 * 1024);

      if (validFiles.length !== files.length) {
        showNotification("Một số file không hợp lệ hoặc quá lớn.", "error");
        return;
      }

      for (const file of validFiles) {
        const dataUrl = await fileToDataURL(file);
        const imgTag = `<img src="${dataUrl}" alt="Image" style="max-width:100%; height:auto;" />`;
        editorRef.current.innerHTML += imgTag;
      }
      setFormData((prev) => ({
        ...prev,
        content: editorRef.current!.innerHTML,
        contentImages: [...prev.contentImages, ...validFiles],
      }));
    }
  }, [fileToDataURL, showNotification]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    setTimeout(() => {
      const event = new Event("input", { bubbles: true });
      editorRef.current?.dispatchEvent(event);
    }, 10);
  }, []);

  const insertHeading = useCallback((level: string) => {
    if (level) execCommand("formatBlock", `<h${level}>`);
  }, [execCommand]);

  const insertList = useCallback((type: "ul" | "ol") => {
    execCommand(`insert${type === "ul" ? "UnorderedList" : "OrderedList"}`);
  }, [execCommand]);

  const insertLink = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const url = prompt("Nhập URL liên kết:", "https://");
      if (url) {
        const validUrl = url.startsWith("http") ? url : `https://${url}`;
        execCommand("createLink", validUrl);
      } else {
        showNotification("URL không hợp lệ.", "error");
      }
    } else {
      showNotification("Vui lòng chọn văn bản để tạo liên kết.", "error");
    }
  }, [execCommand, showNotification]);

  const renderToolbar = useCallback(() => (
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
      <button type="button" onClick={insertLink} className={activeFormats.createLink ? styles.active : ""}>
        <FontAwesomeIcon icon={faLink} />
      </button>
    </div>
  ), [activeFormats, execCommand, insertHeading, insertList, insertLink]);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const cleanedContent = editorRef.current.innerHTML
        .replace(/ data-placeholder="true"/g, "")
        .trim();
      setFormData((prev) => ({ ...prev, content: cleanedContent }));
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
      if (formData.thumbnailFile) {
        formDataToSend.append("thumbnail", formData.thumbnailFile);
      }
      formDataToSend.append("thumbnailCaption", formData.thumbnailCaption.trim() || formData.title.trim());
      formDataToSend.append("status", formData.status);
      formData.contentImages.forEach((file) => {
        formDataToSend.append("contentImages", file);
      });

      const response = await fetch(`https://api-zeal.onrender.com/api/news/${slug}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();
      if (!response.ok) {
        showNotification(result.error || "Lỗi khi cập nhật bài viết.", "error");
        return;
      }

      showNotification("Cập nhật bài viết thành công!", "success");
      setTimeout(() => {
        router.push("/admin/news");
      }, 1500);
    } catch (error) {
      console.error("Lỗi yêu cầu:", error);
      showNotification("Lỗi kết nối. Vui lòng kiểm tra mạng.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, router, showNotification, slug]);

  return (
    <div className={styles.editNewsContainer}>
      <h1 className={styles.title}>Chỉnh sửa bài viết</h1>

      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>Đang tải...</div>
      ) : (
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
              placeholder="Nhập tiêu đề bài viết"
              maxLength={100}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Chú thích thumbnail (tùy chọn)</label>
            <input
              type="text"
              name="thumbnailCaption"
              value={formData.thumbnailCaption}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Nhập chú thích cho thumbnail"
              maxLength={200}
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
            />
            {previewThumbnail && (
              <div className={styles.thumbnailPreview}>
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
              data-placeholder="Nhập nội dung bài viết..."
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              multiple
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.push("/admin/news")}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang cập nhật..." : "✓ Cập nhật bài viết"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditArticle;