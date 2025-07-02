"use client";

import styles from "./page.module.css";
import { Chart } from "react-google-charts";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// Interfaces
interface Product { _id: string; name: string; }
interface OrderItem { product: Product | null; quantity: number; _id: string; option?: string; }
interface User { _id: string; username: string; email: string; createdAt: string; }
interface Comment { _id: string; createdAt: string; }
interface Order {
  _id: string;
  user: User | null;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon: string | null;
  sdt: string;
  paymentMethod: string;
  note: string;
  paymentStatus: "pending" | "completed" | "delivering" | "failed";
  createdAt: string;
}
interface Stats {
  orders: number;
  newUsers: number;
  revenue: number;
  newComments: number;
}

export default function AD_Home() {
  const router = useRouter();
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">("week");
  const [chartData, setChartData] = useState<[string, number][]>([["", 0]]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({ orders: 0, newUsers: 0, revenue: 0, newComments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const chartOptions = useMemo(() => ({
    title: `Doanh thu theo ${timePeriod === "week" ? "tuần" : timePeriod === "month" ? "ngày" : "tháng"}`,
    hAxis: { title: "Thời gian" },
    vAxis: { title: "Doanh thu (VNĐ)", minValue: 0 },
    legend: "none",
    curveType: "function",
    pointSize: 4,
    lineWidth: 3,
    colors: ["#3b82f6"],
    backgroundColor: "transparent",
    chartArea: { left: 60, top: 50, width: "85%", height: "70%" },
  }), [timePeriod]);

  const calculateRevenue = useMemo(() => {
    return (orders: Order[], period: string): [string, number][] => {
      const validOrders = orders.filter(o => o.paymentStatus === "completed" && o.total >= 0);

      if (period === "week") {
        const revenueByDay = Array(7).fill(0);
        const now = new Date();

        for (let i = 0; i < 7; i++) {
          const day = new Date(now);
          day.setDate(now.getDate() - (6 - i));
          const dayStr = day.toISOString().slice(0, 10);

          validOrders.forEach(order => {
            const orderDay = new Date(order.createdAt).toISOString().slice(0, 10);
            if (orderDay === dayStr) revenueByDay[i] += order.total;
          });
        }

        const labels = Array.from({ length: 7 }, (_, i): [string, number] => {
          const day = new Date(now);
          day.setDate(now.getDate() - (6 - i));
          return [`${day.getDate()}/${day.getMonth() + 1}`, revenueByDay[i]];
        });

        return [["Ngày", "Doanh thu (VNĐ)"], ...labels];
      }

      if (period === "month") {
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const revenueByDay = Array(daysInMonth).fill(0);

        validOrders.forEach(order => {
          const d = new Date(order.createdAt);
          if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            revenueByDay[d.getDate() - 1] += order.total;
          }
        });

        return [
          ["Ngày", "Doanh thu (VNĐ)"],
          ...revenueByDay.map((v, i): [string, number] => [`${i + 1}/${currentMonth + 1}`, v])
        ];
      }

      if (period === "year") {
        const currentYear = today.getFullYear();
        const revenueByMonth = Array(12).fill(0);

        validOrders.forEach(order => {
          const d = new Date(order.createdAt);
          if (d.getFullYear() === currentYear) {
            revenueByMonth[d.getMonth()] += order.total;
          }
        });

        return [
          ["Tháng", "Doanh thu (VNĐ)"],
          ...revenueByMonth.map((v, i): [string, number] => [`Tháng ${i + 1}`, v])
        ];
      }

      return [["", 0]];
    };
  }, [today]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/user/login");

    // Optional: Kiểm tra role từ token
    try {
      const decoded = jwtDecode(token) as any;
      if (decoded.role !== "admin") {
        setError("Bạn không có quyền truy cập trang này.");
        return;
      }
    } catch (err) {
      console.error("Lỗi khi giải mã token:", err);
      setError("Token không hợp lệ.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, usersRes, commentsRes] = await Promise.all([
          fetch("https://api-zeal.onrender.com/api/orders/admin/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://api-zeal.onrender.com/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://api-zeal.onrender.com/api/comments/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [orders, users] = await Promise.all([
          ordersRes.json() as Promise<Order[]>,
          usersRes.json() as Promise<User[]>,
        ]);

        let comments: Comment[] = [];
        if (commentsRes.status === 403) {
          console.warn("Không có quyền xem bình luận. Fallback 0.");
        } else if (commentsRes.ok) {
          comments = await commentsRes.json();
        }

        const isInPeriod = (date: Date) => {
          if (timePeriod === "week") {
            const start = new Date(today);
            start.setDate(today.getDate() - 6);
            return date >= start;
          }
          if (timePeriod === "month") {
            return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
          }
          return date.getFullYear() === today.getFullYear();
        };

        const ordersInPeriod = orders.filter(o => isInPeriod(new Date(o.createdAt)));
        const revenue = ordersInPeriod.filter(o => o.paymentStatus === "completed").reduce((sum, o) => sum + o.total, 0);
        const newUsers = users.filter(u => isInPeriod(new Date(u.createdAt))).length;
        const newComments = comments.filter(c => isInPeriod(new Date(c.createdAt))).length;

        setStats({ orders: ordersInPeriod.length, newUsers, revenue, newComments });
        setChartData(calculateRevenue(orders, timePeriod));
        setRecentOrders(orders.slice(0, 3));
      } catch (err) {
        console.error(err);
        setError("Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod, today, router, calculateRevenue]);

  return (
    <div className={styles.mainContent}>
      <header className={styles.dashboardHeader}>
        <h2>Dashboard</h2>
        <p>Chào mừng bạn trở lại, Admin!</p>
      </header>

      <div className={styles.controls}>
        <div className={styles.buttonGroup}>
          {["week", "month", "year"].map((p) => (
            <button
              key={p}
              onClick={() => setTimePeriod(p as "week" | "month" | "year")}
              className={`${styles.timePeriodButton} ${timePeriod === p ? styles.active : ""}`}
            >
              {p === "week" ? "Tuần" : p === "month" ? "Tháng" : "Năm"}
            </button>
          ))}
        </div>
      </div>

      <section className={styles.statsContainer}>
        <div className={styles.statBox}><h3>{stats.orders}</h3><p>Đơn hàng</p></div>
        <div className={styles.statBox}><h3>{stats.newUsers}</h3><p>Người dùng mới</p></div>
        <div className={styles.statBox}><h3>{stats.revenue.toLocaleString("vi-VN")}</h3><p>Doanh thu (VNĐ)</p></div>
        <div className={styles.statBox}><h3>{stats.newComments}</h3><p>Bình luận mới</p></div>
      </section>

      <section className={styles.chartContainer}>
        {loading ? <p>Đang tải biểu đồ...</p> : error ? <p>{error}</p> : (
          <Chart chartType="LineChart" data={chartData} width="100%" height="400px" options={chartOptions} />
        )}
      </section>

      <section className={styles.recentOrders}>
        <h3>Đơn hàng gần đây</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Khách hàng</th><th>Sản phẩm</th><th>Tổng</th><th>Trạng thái</th><th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.username || "Ẩn"}</td>
                <td>{order.items.map(i => `${i.product?.name ?? "?"} x${i.quantity}`).join(", ")}</td>
                <td>{order.total.toLocaleString("vi-VN")} VNĐ</td>
                <td>{order.paymentStatus}</td>
                <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
