"use client";

import styles from "./page.module.css";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

export default function AD_Home() {
  const router = useRouter();
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">("week");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
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

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - i);
  }, []);

  const months = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
  ];

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" as const },
        title: {
          display: true,
          text: `Báo cáo doanh thu theo ${
            timePeriod === "week" ? `tuần (${months[selectedMonth]} ${selectedYear})` :
            timePeriod === "month" ? `tháng (${months[selectedMonth]} ${selectedYear})` :
            `năm ${selectedYear}`
          }`,
          font: { size: 16 },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `Doanh thu: ${formatCurrency(context.raw)}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "VND" },
          ticks: {
            callback: (tickValue: string | number) =>
              typeof tickValue === "number" ? formatCurrency(tickValue) : tickValue,
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
    [timePeriod, selectedMonth, selectedYear]
  );

  const calculateRevenue = useMemo(
    () => {
      return (orders: Order[], period: string, month: number, year: number) => {
        const validOrders = orders.filter((o) => o.paymentStatus === "completed" && o.total >= 0);
        const labels: string[] = [];
        const revenueData: number[] = [];

        if (period === "week") {
          const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
          const firstDayOfMonth = new Date(year, month, 1);
          const firstMonday = new Date(year, month, 1 + ((8 - firstDayOfMonth.getDay()) % 7));
          if (firstDayOfMonth.getDay() === 0) firstMonday.setDate(firstMonday.getDate() - 7);

          for (let i = 0; i < 7; i++) {
            const day = new Date(firstMonday.getFullYear(), firstMonday.getMonth(), firstMonday.getDate() + i);
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
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          for (let i = 1; i <= daysInMonth; i++) {
            labels.push(`${i}/${month + 1}`);
            const dayRevenue = validOrders
              .filter((order) => {
                const orderDate = new Date(order.createdAt);
                return (
                  orderDate.getFullYear() === year &&
                  orderDate.getMonth() === month &&
                  orderDate.getDate() === i
                );
              })
              .reduce((sum, order) => sum + order.total, 0);
            revenueData.push(dayRevenue);
          }
        } else if (period === "year") {
          for (let i = 0; i < 12; i++) {
            labels.push(months[i]);
            const monthRevenue = validOrders
              .filter((order) => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getFullYear() === year && orderDate.getMonth() === i;
              })
              .reduce((sum, order) => sum + order.total, 0);
            revenueData.push(monthRevenue);
          }
        }

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
    []
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
      setError(null);
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

        if (!ordersRes.ok || !usersRes.ok) {
          throw new Error("Lỗi khi tải dữ liệu từ API.");
        }

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
            const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
            const firstMonday = new Date(selectedYear, selectedMonth, 1 + ((8 - firstDayOfMonth.getDay()) % 7));
            if (firstDayOfMonth.getDay() === 0) firstMonday.setDate(firstMonday.getDate() - 7);
            const weekEnd = new Date(firstMonday.getFullYear(), firstMonday.getMonth(), firstMonday.getDate() + 6);
            return date >= firstMonday && date <= weekEnd;
          }
          if (timePeriod === "month") {
            const firstDay = new Date(selectedYear, selectedMonth, 1);
            const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
            return date >= firstDay && date <= lastDay;
          }
          const firstDayYear = new Date(selectedYear, 0, 1);
          const lastDayYear = new Date(selectedYear, 11, 31);
          return date >= firstDayYear && date <= lastDayYear;
        };

        const ordersInPeriod = orders.filter((o) => isInPeriod(new Date(o.createdAt)));
        const revenue = ordersInPeriod
          .filter((o) => o.paymentStatus === "completed")
          .reduce((sum, o) => sum + o.total, 0);
        const newUsers = users.filter((u) => isInPeriod(new Date(u.createdAt))).length;
        const newComments = comments.filter((c) => isInPeriod(new Date(c.createdAt))).length;

        setStats({ orders: ordersInPeriod.length, newUsers, revenue, newComments });
        setChartData(calculateRevenue(orders, timePeriod, selectedMonth, selectedYear));
        setRecentOrders(
          orders
            .filter((o) => o.paymentStatus === "completed")
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod, selectedMonth, selectedYear, router, calculateRevenue]);

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
              disabled={loading}
            >
              {p === "week" ? "Tuần" : p === "month" ? "Tháng" : "Năm"}
            </button>
          ))}
        </div>
        <div className={styles.dateSelectors}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className={styles.select}
            disabled={loading}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className={styles.select}
            disabled={loading}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className={styles.statsContainer}>
        <div className={styles.statBox}>
          <h3>{loading ? "..." : stats.orders}</h3>
          <p>Đơn hàng</p>
        </div>
        <div className={styles.statBox}>
          <h3>{loading ? "..." : stats.newUsers}</h3>
          <p>Người dùng mới</p>
        </div>
        <div className={styles.statBox}>
          <h3>{loading ? "..." : formatCurrency(stats.revenue)}</h3>
          <p>Doanh thu</p>
        </div>
        <div className={styles.statBox}>
          <h3>{loading ? "..." : stats.newComments}</h3>
          <p>Bình luận mới</p>
        </div>
      </section>

      <section className={styles.chartContainer}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Đang tải biểu đồ...</p>
          </div>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <Line data={chartData} options={chartOptions} />
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
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    Đang tải...
                  </td>
                </tr>
              ) : recentOrders.length > 0 ? (
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