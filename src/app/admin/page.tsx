"use client";

import styles from "./page.module.css";
import { Chart } from "react-google-charts";
import { useState, useEffect, useMemo } from "react";

// Define TypeScript types with stricter definitions
interface Product {
  name: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface User {
  username: string;
  createdAt: string;
}

interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  total: number;
  paymentStatus: "pending" | "completed" | "delivering";
  createdAt: string;
}

interface Stats {
  ordersToday: number;
  newUsers: number;
  revenueToday: number;
  newComments: number;
}

export default function AD_Home() {
  const [chartData, setChartData] = useState([
    ["Ngày", "Doanh thu (VNĐ)"],
    ["Thứ 2", 0],
    ["Thứ 3", 0],
    ["Thứ 4", 0],
    ["Thứ 5", 0],
    ["Thứ 6", 0],
    ["Thứ 7", 0],
    ["Chủ nhật", 0],
  ]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    ordersToday: 0,
    newUsers: 0,
    revenueToday: 0,
    newComments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized date for today
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Memoized revenue calculation
  const calculateRevenueByDay = useMemo(() => (orders: Order[]) => {
    const revenueByDay = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    orders.forEach((order) => {
      if (order.paymentStatus === "completed") {
        const day = new Date(order.createdAt).toLocaleString("en-US", { weekday: "long" });
        revenueByDay[day as keyof typeof revenueByDay] += order.total;
      }
    });

    return [
      ["Ngày", "Doanh thu (VNĐ)"],
      ["Thứ 2", revenueByDay.Monday],
      ["Thứ 3", revenueByDay.Tuesday],
      ["Thứ 4", revenueByDay.Wednesday],
      ["Thứ 5", revenueByDay.Thursday],
      ["Thứ 6", revenueByDay.Friday],
      ["Thứ 7", revenueByDay.Saturday],
      ["Chủ nhật", revenueByDay.Sunday],
    ];
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel API calls
        const [ordersRes, usersRes, commentsRes] = await Promise.all([
          fetch("https://api-zeal.onrender.com/api/orders/all"),
          fetch("https://api-zeal.onrender.com/api/users"),
          fetch("https://api-zeal.onrender.com/api/comments/"),
        ]);

        if (!ordersRes.ok || !usersRes.ok || !commentsRes.ok) {
          throw new Error("API request failed");
        }

        const [orders, users, comments] = await Promise.all([
          ordersRes.json(),
          usersRes.json(),
          commentsRes.json(),
        ]);

        // Process data
        const isSameDay = (date: Date) =>
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear();

        // Calculate stats
        const ordersToday = orders.filter((order: Order) => isSameDay(new Date(order.createdAt)));
        const revenueToday = ordersToday
          .filter((order: Order) => order.paymentStatus === "completed")
          .reduce((sum: number, order: Order) => sum + order.total, 0);
        const newUsers = users.filter((user: User) => isSameDay(new Date(user.createdAt)));
        const newComments = comments.filter((comment: { createdAt: string }) =>
          isSameDay(new Date(comment.createdAt))
        );

        // Update states
        setChartData(calculateRevenueByDay(orders));
        setStats({
          ordersToday: ordersToday.length,
          newUsers: newUsers.length,
          revenueToday,
          newComments: newComments.length,
        });
        setRecentOrders(
          orders
            .sort((a: Order, b: Order) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 3)
        );
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [today, calculateRevenueByDay]);

  const chartOptions = useMemo(
    () => ({
      title: "Doanh thu theo ngày",
      hAxis: { title: "Ngày" },
      vAxis: { title: "Doanh thu (VNĐ)" },
      legend: "none",
    }),
    []
  );

  return (
    <div className={styles.mainContent}>
      <header className={styles.dashboardHeader}>
        <h2>Dashboard</h2>
        <p>Chào mừng bạn trở lại, Admin!</p>
      </header>

      <section className={styles.statsContainer}>
        <div className={styles.statBox}>
          <h3>{stats.ordersToday.toLocaleString("vi-VN")}</h3>
          <p>Đơn hàng hôm nay</p>
        </div>
        <div className={styles.statBox}>
          <h3>{stats.newUsers.toLocaleString("vi-VN")}</h3>
          <p>Người dùng mới</p>
        </div>
        <div className={styles.statBox}>
          <h3>{stats.revenueToday.toLocaleString("vi-VN")}</h3>
          <p>Doanh thu hôm nay (VNĐ)</p>
        </div>
        <div className={styles.statBox}>
          <h3>{stats.newComments.toLocaleString("vi-VN")}</h3>
          <p>Bình luận mới</p>
        </div>
      </section>

      <section className={styles.chartContainer}>
        {loading ? (
          <p className={styles.loadingMessage}>Loading chart...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={chartData}
            options={chartOptions}
          />
        )}
      </section>
    </div>
  );
}