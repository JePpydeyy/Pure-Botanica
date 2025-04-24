"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Userinfo.module.css";

interface User {
    _id: string;
    username: string;
    email: string;
    phone: string;
    status: string;
    listOrder: any[];
    birthday: string | null;
}

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Không có token. Vui lòng đăng nhập.");
            setLoading(false);
            return;
        }

        fetch("https://api-zeal.onrender.com/api/users/userinfo", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Lỗi khi tải thông tin người dùng.");
                setLoading(false);
            });
    }, []);

    if (loading) return <p className={styles.loading}>Đang tải thông tin...</p>;

    if (error) return <p className={styles.error}>{error}</p>;

    if (!user) return <p className={styles.error}>Không tìm thấy thông tin người dùng.</p>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Thông tin người dùng</h2>
            <div className={styles.userInfo}>
                <p className={styles.infoRow}><strong>Tên:</strong> {user.username}</p>
                <p className={styles.infoRow}><strong>Email:</strong> {user.email}</p>
                <p className={styles.infoRow}><strong>SĐT:</strong> {user.phone}</p>
                <p className={styles.infoRow}><strong>Trạng thái:</strong> {user.status}</p>
                <p className={styles.infoRow}><strong>Ngày sinh:</strong> {user.birthday ? new Date(user.birthday).toLocaleDateString() : "Chưa cập nhật"}</p>
                <p className={styles.infoRow}>
                <strong>Đơn hàng:</strong> 
                {user?.listOrder?.length === 0 
                    ? "Chưa có đơn hàng" 
                    : user?.listOrder?.length + " đơn hàng"}
                </p>

            </div>

            <Link href={`/user/edituser/${user._id}`} className={styles.editLink}>
                <button className={styles.editButton}>Chỉnh sửa thông tin</button>
            </Link>
        </div>
    );
}