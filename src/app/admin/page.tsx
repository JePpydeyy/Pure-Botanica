"use client";

import styles from "./page.module.css";
import { Chart } from "react-google-charts";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
}

interface OrderItem {
  product: Product | null;
  quantity: number;
  _id: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface ProductDetail {
  productId: string;
}

interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  productDetails: ProductDetail[];
  subtotal: number;
  discount: number;
  total: number;
  coupon: string | null;
  sdt: string;
  paymentMethod: string;
  note: string;
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
  const router = useRouter();
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">("week");
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

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Check token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/user/login");
    }
  }, [router]);

  const calculateRevenue = useMemo(() => (orders: Order[], period: string) => {
    const completedOrders = orders.filter(order => order.paymentStatus === "completed");

    if (period === "week") {
      const revenueByDay = Array(7).fill(0);
      const now = new Date();
      for (let i = 0; i < 7; i++) {
        const day = new Date(now);
        day.setDate(now.getDate() - (6 - i));
        const dayStr = day.toISOString().slice(0, 10);
        completedOrders.forEach((order) => {
          const orderDayStr = new Date(order.createdAt).toISOString().slice(0, 10);
          if (orderDayStr === dayStr) {
            revenueByDay[i] += Math.max(0, order.total); // Ensure non-negative
          }
        });
      }
      const labels = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(now);
        day.setDate(now.getDate() - (6 - i));
        return `${day.getDate()}/${day.getMonth() + 1}`;
      });
      return [
        ["Ngày", "Doanh thu (VNĐ)"],
        ...labels.map((label, i) => [label, revenueByDay[i]]),
      ];
    } else if (period === "month") {
      const revenueByDay = Array(31).fill(0);
      completedOrders.forEach((order) => {
        const day = new Date(order.createdAt).getDate() - 1;
        revenueByDay[day] += Math.max(0, order.total); // Ensure non-negative
      });

      return [
        ["Ngày", "Doanh thu (VNĐ)"],
        ...Array.from({ length: 31 }, (_, i) => [`Ngày ${i + 1}`, revenueByDay[i]]),
      ];
    } else {
      const currentYear = today.getFullYear();
      const revenueByMonth = Array(12).fill(0);
      completedOrders.forEach((order) => {
        const date = new Date(order.createdAt);
        if (date.getFullYear() === currentYear) {
          const month = date.getMonth();
          revenueByMonth[month] += Math.max(0, order.total); // Ensure non-negative
        }
      });

      return [
        ["Tháng", "Doanh thu (VNĐ)"],
        ...Array.from({ length: 12 }, (_, i) => [`Tháng ${i + 1}`, revenueByMonth[i]]),
      ];
    }
  }, [today]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/user/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [ordersRes, usersRes, commentsRes] = await Promise.all([
          fetch("https://api-zeal.onrender.com/api/orders/admin/all", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("https://api-zeal.onrender.com/api/users", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("https://api-zeal.onrender.com/api/comments/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include" // Include cookies for additional auth if needed
          }),
        ]);

        const errors: string[] = [];
        let comments = [];

        if (!ordersRes.ok) {
          const text = await ordersRes.text();
          errors.push(`Lỗi API đơn hàng: ${ordersRes.status} - ${text || "Không có thông tin chi tiết"}`);
        }
        if (!usersRes.ok) {
          const text = await usersRes.text();
          errors.push(`Lỗi API người dùng: ${usersRes.status} - ${text || "Không có thông tin chi tiết"}`);
        }
        if (!commentsRes.ok) {
          const text = await commentsRes.text();
          if (commentsRes.status === 401) {
            // Token invalid or expired
            setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            localStorage.removeItem("token");
            router.push("/user/login");
            return;
          } else if (commentsRes.status === 403) {
            // Insufficient permissions
            console.warn("Không có quyền xem bình luận. Vui lòng kiểm tra quyền truy cập.");
            setStats((prev) => ({ ...prev, newComments: 0 })); // Set comments to 0
            comments = []; // Proceed with empty comments
          } else {
            errors.push(`Lỗi API bình luận: ${commentsRes.status} - ${text || "Không có thông tin chi tiết"}`);
          }
        }

        if (errors.length > 0) {
          throw new Error(errors.join("; "));
        }

        const contentTypeOrders = ordersRes.headers.get("content-type");
        if (!contentTypeOrders?.includes("application/json")) {
          throw new Error("API đơn hàng không trả về JSON");
        }
        const contentTypeUsers = usersRes.headers.get("content-type");
        if (!contentTypeUsers?.includes("application/json")) {
          throw new Error("API người dùng không trả về JSON");
        }
        const contentTypeComments = commentsRes.headers.get("content-type");
        if (contentTypeComments?.includes("application/json") && commentsRes.ok) {
          comments = await commentsRes.json();
        }

        const [orders, users] = await Promise.all([ordersRes.json(), usersRes.json()]);

        const isInPeriod = (date: Date) => {
          if (timePeriod === "month") {
            return (
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            );
          } else if (timePeriod === "week") {
            // Check if the date is within the last 7 days (including today)
            const startOfToday = new Date(today);
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - 6);
            startOfWeek.setHours(0, 0, 0, 0);
            return date >= startOfWeek && date <= startOfToday;
          } else {
            // "year"
            return date.getFullYear() === today.getFullYear();
          }
        };

        const ordersInPeriod = orders.filter((order: Order) =>
          isInPeriod(new Date(order.createdAt))
        );
        const revenueInPeriod = ordersInPeriod
          .filter((order: Order) => order.paymentStatus === "completed")
          .reduce((sum: number, order: Order) => sum + Math.max(0, order.total), 0); // Ensure non-negative
        const newUsers = users.filter((user: User) => isInPeriod(new Date(user.createdAt)));
        const newComments = comments.filter((comment: { createdAt: string }) =>
          isInPeriod(new Date(comment.createdAt))
        );

        setChartData(calculateRevenue(orders, timePeriod));
        setStats({
          orders: ordersInPeriod.length,
          newUsers: newUsers.length,
          revenue: revenueInPeriod,
          newComments: newComments.length,
        });
        setRecentOrders(
          orders
            .filter(
              (order: Order) =>
                Array.isArray(order.items) &&
                Array.isArray(order.productDetails) &&
                order.items.length === order.productDetails.length
            )
            .sort(
              (a: Order, b: Order) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 3)
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định";
        setError(`Không thể tải dữ liệu: ${errorMessage}. Vui lòng thử lại sau.`);
        console.error("Lỗi khi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod, today, calculateRevenue, router]);

  const chartOptions = useMemo(
    () => ({
      title: `Doanh thu theo ${
        timePeriod === "week"
          ? "tuần"
          : timePeriod === "month"
          ? "ngày"
          : "tháng"
      }`,
      hAxis: {
        title:
          timePeriod === "week"
            ? "Ngày"
            : timePeriod === "month"
            ? "Ngày"
            : "Tháng",
      },
      vAxis: {
        title: "Doanh thu (VNĐ)",
        minValue: 0, // Prevent negative values on y-axis
        format: "currency", // Use currency format
        currency: "VND", // Specify VND currency
        gridlines: { count: 5 },
      },
      legend: "none",
      curveType: "function",
      pointSize: 5,
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
            className={`${styles.timePeriodButton} ${timePeriod === "week" ? styles.active : ""}`}
            onClick={() => setTimePeriod("week")}
          >
            Tuần
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
          <p>Đơn hàng</p>
        </div>
        <div className={styles.statBox}>
          <h3>{stats.newUsers.toLocaleString("vi-VN")}</h3>
          <p>Người dùng mới</p>
        </div>
        <div className={styles.statBox}>
          <h3>{stats.revenue.toLocaleString("vi-VN")}</h3>
          <p>Doanh thu (VNĐ)</p>
        </div>
        <div className={styles.statBox}>
          <h3>{stats.newComments.toLocaleString("vi-VN")}</h3>
          <p>Bình luận mới</p>
        </div>
      </section>

      <section className={styles.chartContainer}>
        {loading ? (
          <p className={styles.loadingMessage}>Đang tải biểu đồ...</p>
        ) : error ? (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Thử lại</button>
          </div>
        ) : (
          <Chart
            chartType="LineChart"
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
                  <td>{order.user?.username ?? "Không xác định"}</td>
                  <td>
                    {order.items.map((item) => (
                      <div key={item._id}>
                        {item.product?.name ?? "Sản phẩm không xác định"} (x{item.quantity})
                      </div>
                    ))}
                  </td>
                  <td>{order.total.toLocaleString("vi-VN")} VNĐ</td>
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