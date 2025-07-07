"use client";

import styles from "./page.module.css";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// Interfaces
interface Product {
  _id: string;
  name: string;
}

interface OrderItem {
  product: Product | null;
  quantity: number;
  _id: string;
  option?: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  createdAt: string;
}

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

// Utility function to format currency in VND
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

export default function AD_Home() {
  const router = useRouter();
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">("week");
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: "Doanh thu",
        data: [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
      },
    ],
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({ orders: 0, newUsers: 0, revenue: 0, newComments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false, // Allow chart to fill container
      plugins: {
        legend: { position: "bottom" as const },
        title: {
          display: true,
          text: `Báo cáo doanh thu theo ${
            timePeriod === "week" ? "ngày trong tuần" : timePeriod === "month" ? "ngày trong tháng" : "tháng trong năm"
          }`,
          font: { size: 16 },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "VND" },
          ticks: {
            callback: function (value: number) {
              return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
            },
          },
        },
        x: {
          title: {
            display: true,
            text: timePeriod === "week" ? "Ngày trong tuần" : timePeriod === "month" ? "Ngày" : "Tháng",
          },
          ticks: {
            maxTicksLimit: timePeriod === "month" ? 15 : 12,
          },
        },
      },
    }),
    [timePeriod]
  );

  const calculateRevenue = useMemo(
    () => {
      return (orders: Order[], period: string) => {
        const validOrders = orders.filter((o) => o.paymentStatus === "completed" && o.total >= 0);
        const labels: string[] = [];
        const revenueData: number[] = [];

        if (period === "week") {
          const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
          const currentDayOfWeek = today.getDay();
          const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
          const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysSinceMonday);

          for (let i = 0; i < 7; i++) {
            const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
            const dayIndex = day.getDay();
            labels.push(daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1]);
            const dayRevenue = validOrders
              .filter((order) => {
                const orderDate = new Date(order.createdAt);
                return (
                  orderDate.getFullYear() === day.getFullYear() &&
                  orderDate.getMonth() === day.getMonth() &&
                  orderDate.getDate() === day.getDate()
                );
              })
              .reduce((sum, order) => sum + order.total, 0);
            revenueData.push(dayRevenue);
          }
        } else if (period === "month") {
          const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
          for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(today.getFullYear(), today.getMonth(), i);
            labels.push(`${i}/${day.getMonth() + 1}`);
            const dayRevenue = validOrders
              .filter((order) => {
                const orderDate = new Date(order.createdAt);
                return (
                  orderDate.getFullYear() === day.getFullYear() &&
                  orderDate.getMonth() === day.getMonth() &&
                  orderDate.getDate() === i
                );
              })
              .reduce((sum, order) => sum + order.total, 0);
            revenueData.push(dayRevenue);
          }
        } else if (period === "year") {
          const monthsOfYear = [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ];
          for (let i = 0; i < 12; i++) {
            const monthStart = new Date(today.getFullYear(), i, 1);
            labels.push(monthsOfYear[i]);
            const monthRevenue = validOrders
              .filter((order) => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getFullYear() === today.getFullYear() && orderDate.getMonth() === i;
              })
              .reduce((sum, order) => sum + order.total, 0);
            revenueData.push(monthRevenue);
          }
        }

        // Ensure chartData is always valid
        return {
          labels: labels.length ? labels : ["Không có dữ liệu"],
          datasets: [
            {
              label: "Doanh thu",
              data: revenueData.length ? revenueData : [0],
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.3,
            },
          ],
        };
      };
    },
    [today]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/user/login");
      return;
    }

    try {
      const decoded = jwtDecode<{ role: string }>(token);
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

        const ordersInPeriod = orders.filter((o) => isInPeriod(new Date(o.createdAt)));
        const revenue = ordersInPeriod.filter((o) => o.paymentStatus === "completed").reduce((sum, o) => sum + o.total, 0);
        const newUsers = users.filter((u) => isInPeriod(new Date(u.createdAt))).length;
        const newComments = comments.filter((c) => isInPeriod(new Date(c.createdAt))).length;

        setStats({ orders: ordersInPeriod.length, newUsers, revenue, newComments });
        setChartData(calculateRevenue(orders, timePeriod));
        setRecentOrders(
          orders
            .filter((o) => o.paymentStatus === "completed")
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
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
          {(["week", "month", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setTimePeriod(p)}
              className={`${styles.timePeriodButton} ${timePeriod === p ? styles.active : ""}`}
            >
              {p === "week" ? "Tuần" : p === "month" ? "Tháng" : "Năm"}
            </button>
          ))}
        </div>
      </div>

      <section className={styles.statsContainer}>
        <div className={styles.statBox}>
          <h3>{stats.orders}</h3>
          <p>Đơn hàng</p>
        </div>
        <div className={styles.statBox}>
          <h3>{stats.newUsers}</h3>
          <p>Người dùng mới</p>
        </div>
        <div className={styles.statBox}>
          <h3>{formatCurrency(stats.revenue)}</h3>
          <p>Doanh thu</p>
        </div>
        <div className={styles.statBox}>
          <h3>{stats.newComments}</h3>
          <p>Bình luận mới</p>
        </div>
      </section>

      <section className={styles.chartContainer}>
        {loading ? (
          <p className={styles.loadingMessage}>Đang tải biểu đồ...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <>
            <div className={styles.chartHeader}></div>
            <Line data={chartData} options={chartOptions} />
          </>
        )}
      </section>

      <section className={styles.recentOrders}>
        <div className={styles.sectionHeader}>
          <h3>Đơn hàng đã giao gần đây</h3>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table} aria-label="Đơn hàng đã giao gần đây">
            <thead>
              <tr className={styles.tableHeader}>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id} className={styles.tableRow}>
                    <td>{order._id.slice(-6)}</td>
                    <td>{order.user?.username || "Ẩn"}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>
                      <span className={`${styles.status} ${styles.completed}`}>Đã giao</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    Không có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}