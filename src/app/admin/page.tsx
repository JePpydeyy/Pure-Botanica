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
  orders: number;
  newUsers: number;
  revenue: number;
  newComments: number;
}

export default function AD_Home() {
  const [timePeriod, setTimePeriod] = useState<"day" | "month" | "year">("day");
  const [chartData, setChartData] = useState([["", "Doanh thu (VNĐ)"], ["", 0]]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    orders: 0,
    newUsers: 0,
    revenue: 0,
    newComments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized date for reference
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Memoized revenue calculation
  const calculateRevenue = useMemo(() => (orders: Order[], period: string) => {
    if (period === "day") {
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
    } else if (period === "month") {
      const revenueByMonth = Array(12).fill(0);
      orders.forEach((order) => {
        if (order.paymentStatus === "completed") {
          const month = new Date(order.createdAt).getMonth();
          revenueByMonth[month] += order.total;
        }
      });

      return [
        ["Tháng", "Doanh thu (VNĐ)"],
        ...Array.from({ length: 12 }, (_, i) => [`Tháng ${i + 1}`, revenueByMonth[i]]),
      ];
    } else {
      const currentYear = today.getFullYear();
      const revenueByYear = Array(5).fill(0); // Last 5 years
      orders.forEach((order) => {
        if (order.paymentStatus === "completed") {
          const year = new Date(order.createdAt).getFullYear();
          const index = currentYear - year;
          if (index >= 0 && index < 5) {
            revenueByYear[index] += order.total;
          }
        }
      });

      return [
        ["Năm", "Doanh thu (VNĐ)"],
        ...Array.from({ length: 5 }, (_, i) => [String(currentYear - i), revenueByYear[i]]),
      ];
    }
  }, [today]);

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

        // Process data based on time period
        const isInPeriod = (date: Date) => {
          if (timePeriod === "day") {
            return (
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            );
          } else if (timePeriod === "month") {
            return (
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            );
          } else {
            return date.getFullYear() === today.getFullYear();
          }
        };

        // Calculate stats
        const ordersInPeriod = orders.filter((order: Order) =>
          isInPeriod(new Date(order.createdAt))
        );
        const revenueInPeriod = ordersInPeriod
          .filter((order: Order) => order.paymentStatus === "completed")
          .reduce((sum: number, order: Order) => sum + order.total, 0);
        const newUsers = users.filter((user: User) => isInPeriod(new Date(user.createdAt)));
        const newComments = comments.filter((comment: { createdAt: string }) =>
          isInPeriod(new Date(comment.createdAt))
        );

        // Update states
        setChartData(calculateRevenue(orders, timePeriod));
        setStats({
          orders: ordersInPeriod.length,
          newUsers: newUsers.length,
          revenue: revenueInPeriod,
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
  }, [timePeriod, today, calculateRevenue]);

  const chartOptions = useMemo(
    () => ({
      title: `Doanh thu theo ${timePeriod === "day" ? "ngày" : timePeriod === "month" ? "tháng" : "năm"}`,
      hAxis: { title: timePeriod === "day" ? "Ngày" : timePeriod === "month" ? "Tháng" : "Năm" },
      vAxis: { title: "Doanh thu (VNĐ)" },
      legend: "none",
    }),
    [timePeriod]
  );

  return (
    <div className={styles.mainContent}>
      <header className={styles.dashboardHeader}>
        <h2>Dashboard</h2>
        <p>Chào mừng bạn trở lại, Admin!</p>
      </header>

      <div className={styles.controls}>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.timePeriodButton} ${timePeriod === "day" ? styles.active : ""}`}
            onClick={() => setTimePeriod("day")}
          >
            Ngày
          </button>
          <button
            className={`${styles.timePeriodButton} ${timePeriod === "month" ? styles.active : ""}`}
            onClick={() => setTimePeriod("month")}
          >
            Tháng
          </button>
          <button
            className={`${styles.timePeriodButton} ${timePeriod === "year" ? styles.active : ""}`}
            onClick={() => setTimePeriod("year")}
          >
            Năm
          </button>
        </div>
      </div>

      <section className={styles.statsContainer}>
        <div className={styles.statBox}>
          <h3>{stats.orders.toLocaleString("vi-VN")}</h3>
          <p>Đơn hàng {timePeriod === "day" ? "hôm nay" : timePeriod === "month" ? "tháng này" : "năm nay"}</p>
        </div>
        <div className={styles.statBox}>
          <h3>{stats.newUsers.toLocaleString("vi-VN")}</h3>
          <p>Người dùng mới</p>
        </div>
        <div className={styles.statBox}>
          <h3>{stats.revenue.toLocaleString("vi-VN")}</h3>
          <p>Doanh thu {timePeriod === "day" ? "hôm nay" : timePeriod === "month" ? "tháng này" : "năm nay"} (VNĐ)</p>
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

      <section className={styles.recentOrders}>
        <h3>Đơn hàng gần đây</h3>
        <table>
          <caption className={styles.tableCaption}>Danh sách các đơn hàng mới nhất</caption>
          <thead>
            <tr>
              <th>Đơn hàng</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền (VNĐ)</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.noDataMessage}>
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user.username}</td>
                  <td>
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.product.name} (x{item.quantity})
                      </div>
                    ))}
                  </td>
                  <td>{order.total.toLocaleString("vi-VN")}</td>
                  <td>
                    <span
                      className={
                        order.paymentStatus === "pending"
                          ? styles.statusPending
                          : order.paymentStatus === "completed"
                          ? styles.statusCompleted
                          : styles.statusDelivering
                      }
                    >
                      {order.paymentStatus === "pending"
                        ? "Chờ xử lý"
                        : order.paymentStatus === "completed"
                        ? "Hoàn thành"
                        : "Đang giao"}
                    </span>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleString("vi-VN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}