"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import styles from "./addnews.module.css";

config.autoAddCss = false;

const AddArticle = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    thumbnailFile: null as File | null,
  });

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const [activeFormats, setActiveFormats] = useState<any>({});
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
        "bold", "italic", "underline",
        "strikeThrough", "justifyLeft", "justifyCenter",
        "justifyRight", "justifyFull",
        "insertUnorderedList", "insertOrderedList"
      ];
      const newStates: any = {};
      commands.forEach((cmd) => {
        newStates[cmd] = document.queryCommandState(cmd);
      });
      setActiveFormats(newStates);
    };

    const handleSelectionChange = () => updateFormatStates();
    const handleKeyUp = () => updateFormatStates();
    const handleMouseUp = () => updateFormatStates();

    document.addEventListener("selectionchange", handleSelectionChange);
    editor.addEventListener("keyup", handleKeyUp);
    editor.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      editor.removeEventListener("keyup", handleKeyUp);
      editor.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    let displayMessage = message;
    if (message.includes("Trùng lặp slug")) {
      displayMessage = "Slug đã tồn tại. Vui lòng chọn slug khác hoặc để trống để tự động tạo.";
    } else if (message.includes("Không tìm thấy file thumbnail")) {
      displayMessage = "Vui lòng chọn một ảnh thumbnail.";
    }
    setNotification({ show: true, message: displayMessage, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData((prev) => ({ ...prev, thumbnailFile: e.target.files![0] }));
    }
  };

  // UPLOAD ẢNH LÊN SERVER, TRẢ VỀ URL ĐẦY ĐỦ
  const uploadImageToServer = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");
      const response = await fetch("https://api-zeal.onrender.com/api/images", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.imageUrl) {
        // API trả về imageUrl là URL đầy đủ
        return data.imageUrl;
      } else {
        showNotification(data.error || "Lỗi khi upload ảnh", "error");
        return null;
      }
    } catch (err) {
      console.error("Upload error:", err);
      showNotification("Không thể upload ảnh", "error");
      return null;
    }
  };

  // CHÈN ẢNH VÀO EDITOR
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
    // Cập nhật lại content vào state
    setFormData((prev) => ({ ...prev, content: editorRef.current!.innerHTML }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const uploadedUrl = await uploadImageToServer(file);
    if (uploadedUrl) {
      insertImage(uploadedUrl);
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
      <button type="button" onClick={() => execCommand("bold")} className={activeFormats.bold ? styles.active : ""}><FontAwesomeIcon icon={faBold} /></button>
      <button type="button" onClick={() => execCommand("italic")} className={activeFormats.italic ? styles.active : ""}><FontAwesomeIcon icon={faItalic} /></button>
      <button type="button" onClick={() => execCommand("underline")} className={activeFormats.underline ? styles.active : ""}><FontAwesomeIcon icon={faUnderline} /></button>
      <button type="button" onClick={() => insertList("ul")} className={activeFormats.insertUnorderedList ? styles.active : ""}><FontAwesomeIcon icon={faListUl} /></button>
      <button type="button" onClick={() => insertList("ol")} className={activeFormats.insertOrderedList ? styles.active : ""}><FontAwesomeIcon icon={faListOl} /></button>
      <button type="button" onClick={triggerFileInput}><FontAwesomeIcon icon={faImage} /></button>
    </div>
  );

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleContentChange = () => {
    if (editorRef.current) {
      setFormData((prev) => ({ ...prev, content: editorRef.current!.innerHTML }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.thumbnailFile) {
      showNotification("Vui lòng điền đầy đủ các trường bắt buộc.", "error");
      return;
    }

    try {
      const articleData = new FormData();
      articleData.append("title", formData.title);
      articleData.append("slug", formData.slug || "");
      articleData.append("content", formData.content);
      articleData.append("thumbnail", formData.thumbnailFile);

      const token = localStorage.getItem("token");
      const response = await fetch("https://api-zeal.onrender.com/api/news", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: articleData,
      });

      if (response.status === 401 || response.status === 403) {
        showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/user/login");
        return;
      }

      if (response.ok) {
        showNotification("Thêm bài viết thành công", "success");
        setFormData({ title: "", slug: "", content: "", thumbnailFile: null });
        if (editorRef.current) editorRef.current.innerHTML = "";
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
        router.push("/admin/article");
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || "Đã xảy ra lỗi khi thêm bài viết.", "error");
      }
    } catch (err) {
      console.error("Lỗi gửi bài viết:", err);
      showNotification("Có lỗi xảy ra khi gửi bài viết.", "error");
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
          <label className={styles.label}>Thumbnail *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            ref={thumbnailInputRef}
            className={styles.input}
          />
          {formData.thumbnailFile && (
            <Image
              src={URL.createObjectURL(formData.thumbnailFile)}
              alt="Thumbnail"
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
        <button type="submit" className={styles.submitButton}>✓ Thêm bài viết</button>
      </form>
    </div>
  );
};

export default AddArticle;