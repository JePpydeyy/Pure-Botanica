"use client";

import "./page.css";
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";

// Define TypeScript types
interface Product {
  name: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface User {
  username: string;
}

interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  total: number;
  paymentStatus: string;
  createdAt: string;
}

export default function AD_Home() {
  // State for chart data
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

  // State for recent orders
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    ordersToday: 0,
    newUsers: 0,
    revenueToday: 0,
    newComments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await fetch("https://api-zeal.onrender.com/api/orders/all");
        const orders = await ordersResponse.json();

        // Fetch users
        const usersResponse = await fetch("https://api-zeal.onrender.com/api/users");
        const users = await usersResponse.json();

        // Fetch comments
        const commentsResponse = await fetch("https://api-zeal.onrender.com/api/comments/");
        const comments = await commentsResponse.json();

        // Calculate revenue by day
        const calculateRevenueByDay = (orders: Order[]) => {
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
              const date = new Date(order.createdAt);
              const day = date.toLocaleString("en-US", { weekday: "long" });
              const total = order.total || 0;

              if (revenueByDay[day as keyof typeof revenueByDay] !== undefined) {
                revenueByDay[day as keyof typeof revenueByDay] += total;
              }
            }
          });

          return revenueByDay;
        };

        const revenueByDay = calculateRevenueByDay(orders);
        setChartData([
          ["Ngày", "Doanh thu (VNĐ)"],
          ["Thứ 2", revenueByDay["Monday"] || 0],
          ["Thứ 3", revenueByDay["Tuesday"] || 0],
          ["Thứ 4", revenueByDay["Wednesday"] || 0],
          ["Thứ 5", revenueByDay["Thursday"] || 0],
          ["Thứ 6", revenueByDay["Friday"] || 0],
          ["Thứ 7", revenueByDay["Saturday"] || 0],
          ["Chủ nhật", revenueByDay["Sunday"] || 0],
        ]);

        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Orders today
        const ordersToday = orders.filter((order: { createdAt: string | number | Date; }) => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear()
          );
        });

        // Revenue today (only completed orders)
        const revenueToday = ordersToday
          .filter((order: { paymentStatus: string; }) => order.paymentStatus === "completed")
          .reduce((sum: any, order: { total: any; }) => sum + (order.total || 0), 0);

        // New users today
        const newUsers = users.filter((user: { createdAt: string | number | Date; }) => {
          const userDate = new Date(user.createdAt);
          return (
            userDate.getDate() === today.getDate() &&
            userDate.getMonth() === today.getMonth() &&
            userDate.getFullYear() === today.getFullYear()
          );
        });

        // New comments today
        const newComments = comments.filter((comment: { createdAt: string | number | Date; }) => {
          const commentDate = new Date(comment.createdAt);
          return (
            commentDate.getDate() === today.getDate() &&
            commentDate.getMonth() === today.getMonth() &&
            commentDate.getFullYear() === today.getFullYear()
          );
        });

        // Update stats
        setStats({
          ordersToday: ordersToday.length,
          newUsers: newUsers.length,
          revenueToday,
          newComments: newComments.length,
        });

        // Get recent orders
        const sortedOrders = orders
          .sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    title: "Doanh thu theo ngày",
    hAxis: { title: "Ngày" },
    vAxis: { title: "Doanh thu (VNĐ)" },
    legend: "none",
  };

  return (
    <div className="main-content">
      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Chào mừng bạn trở lại, Admin!</p>
      </header>

      <section className="stats-container">
        <div className="stat-box">
          <h3>{stats.ordersToday.toLocaleString("vi-VN")}</h3>
          <p>Đơn hàng hôm nay</p>
        </div>
        <div className="stat-box">
          <h3>{stats.newUsers.toLocaleString("vi-VN")}</h3>
          <p>Người dùng mới</p>
        </div>
        <div className="stat-box">
          <h3>{stats.revenueToday.toLocaleString("vi-VN")}</h3>
          <p>Doanh thu hôm nay (VNĐ)</p>
        </div>
        <div className="stat-box">
          <h3>{stats.newComments.toLocaleString("vi-VN")}</h3>
          <p>Bình luận mới</p>
        </div>
      </section>

      <section className="chart-container">
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={chartData}
          options={options}
        />
      </section>

      <section className="recent-orders">
        <h3>Đơn hàng gần đây</h3>
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table>
            <caption>Danh sách các đơn hàng gần đây</caption>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.user.username}</td>
                    <td>
                      {order.items
                        .map((item) => `${item.product.name} (${item.quantity})`)
                        .join(", ")}
                    </td>
                    <td>{order.total.toLocaleString("vi-VN")} VNĐ</td>
                    <td>
                      {order.paymentStatus === "pending"
                        ? "Đang xử lý"
                        : order.paymentStatus === "completed"
                        ? "Hoàn thành"
                        : "Đang giao"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>Không có đơn hàng nào</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}