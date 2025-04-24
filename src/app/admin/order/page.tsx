"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./order.css";

export default function OrderPage() {
  interface Product {
    name: string;
    price: number;
    discountPrice: number | null;
    images?: string[]; // Trường hình ảnh
  }

  interface Order {
    _id: string;
    user: {
      _id: string;
      username: string;
    };
    createdAt: string;
    status: string;
    address: string;
    items: { product: Product; quantity: number }[];
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Đối chiếu trạng thái tiếng Anh sang tiếng Việt
  const statusMapping = {
    pending: "Chờ xử lý",
    shipped: "Đang giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy"
  };

  // Đối chiếu ngược lại từ tiếng Việt sang tiếng Anh
  const reverseStatusMapping = {
    "Chờ xử lý": "pending",
    "Đang giao hàng": "shipped",
    "Đã giao hàng": "delivered",
    "Đã hủy": "cancelled"
  };

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<Order[]>("https://api-zeal.onrender.com/api/orders/all");
        setOrders(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
        setError("Không thể tải danh sách đơn hàng");
      }
    };
    fetchOrders();
  }, []);

  // Format date
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  // Hiển thị trạng thái bằng tiếng Việt
  const getVietnameseStatus = (status: string) => {
    return statusMapping[status as keyof typeof statusMapping] || status;
  };

  // Update order status
  const handleStatusChange = async (orderId: string, userId: string, newStatus: string, currentStatus: string) => {
    // Kiểm tra nếu đơn hàng đã giao hàng thì không cho phép thay đổi
    if (currentStatus === "delivered") {
      toast.error("Không thể thay đổi trạng thái đơn hàng đã giao thành công");
      return;
    }

    try {
      // Chuyển đổi trạng thái tiếng Việt sang tiếng Anh để gửi lên API
      const englishStatus = reverseStatusMapping[newStatus as keyof typeof reverseStatusMapping] || newStatus;
      
      await axios.put(
        `https://api-zeal.onrender.com/api/orders/status/${orderId}?userId=${userId}`,
        { status: englishStatus }
      );
      
      toast.success("Cập nhật trạng thái thành công");
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: englishStatus } : order
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Handle click on an order to show the detail popup
  const handleOrderClick = (order: Order, e: React.MouseEvent) => {
    // Don't open popup if clicking on the status select element
    if ((e.target as HTMLElement).tagName === 'SELECT') {
      return;
    }
    setSelectedOrder(order);
    setShowPopup(true);
  };

  // Close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Calculate product total
  const calculateProductTotal = (product: Product, quantity: number) => {
    const price = product.discountPrice || product.price;
    return price * quantity;
  };

  // Calculate order total
  const calculateOrderTotal = (items: { product: Product; quantity: number }[]) => {
    return items.reduce((total, item) => total + calculateProductTotal(item.product, item.quantity), 0);
  };

  // Get product image URL from API
  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return `https://api-zeal.onrender.com/images/${product.images[0]}`;
    }
    // Trả về hình ảnh placeholder nếu không có hình ảnh
    return "https://via.placeholder.com/60x60?text=No+Image";
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!orders.length) return <div className="loading-message">Đang tải...</div>;

  return (
    <div className="order-container">
      <div className="title">
        <h1>Danh Sách Đơn Hàng</h1>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Địa Chỉ</th>
              <th>Ngày</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} onClick={(e) => handleOrderClick(order, e)}>
                <td>{index + 1}</td>
                <td>{order.user.username}</td>
                <td>{order.address || "Chưa có địa chỉ"}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <select
                    value={getVietnameseStatus(order.status)}
                    onChange={(e) => 
                      handleStatusChange(order._id, order.user._id, e.target.value, order.status)
                    }
                    className={`status-select ${order.status}`}
                    onClick={(e) => e.stopPropagation()}
                    disabled={order.status === "delivered"} // Vô hiệu hóa nếu đã giao hàng
                  >
                    <option value="Chờ xử lý">Chờ xử lý</option>
                    <option value="Đang giao hàng">Đang giao hàng</option>
                    <option value="Đã giao hàng">Đã giao hàng</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && selectedOrder && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="order-detail" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePopup}>&times;</button>
            <h2>Chi Tiết Đơn Hàng</h2>
            <p>
              <strong>Khách hàng:</strong> {selectedOrder.user.username}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {selectedOrder.address || "Chưa có địa chỉ"}
            </p>
            <p>
              <strong>Ngày:</strong> {formatDate(selectedOrder.createdAt)}
            </p>
            <p>
              <strong>Trạng thái:</strong> {getVietnameseStatus(selectedOrder.status)}
            </p>
            <h3>Sản phẩm trong đơn hàng:</h3>
            <ul>
              {selectedOrder.items.map((item, idx) => (
                <li key={idx}>
                  <img 
                    src={getProductImage(item.product)} 
                    alt={item.product.name} 
                    className="product-image" 
                    onError={(e) => {
                      // Xử lý khi hình ảnh không tải được
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/60x60?text=Error";
                    }}
                  />
                  <div className="product-info">
                    <div className="product-name">{item.product.name}</div>
                    <div className="product-price">
                      {item.quantity} x {(item.product.discountPrice || item.product.price).toLocaleString()} VND = {" "}
                      {calculateProductTotal(item.product, item.quantity).toLocaleString()} VND
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="total">
              Tổng tiền đơn hàng: {calculateOrderTotal(selectedOrder.items).toLocaleString()} VND
            </div>
          </div>
        </div>
      )}
    </div>
  );
}