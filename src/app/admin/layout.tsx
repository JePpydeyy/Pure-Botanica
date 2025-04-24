import "./layout.css";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="sidebar">
          <div className="logo">
            <a href="/admin">
            <img style={{ width: "200px" }} src="/images/logo.png" alt="Logo" />
            </a>
          </div>

          <div className="menu">
            <a href="/admin" className="menu-item">
              <span>Dashboard</span>
            </a>
            <a href="/admin/category" className="menu-item">
              <span>Danh mục</span>
            </a>
            <a href="/admin/product" className="menu-item">
              <span>Sản phẩm</span>
            </a>
            <a href="/admin/order" className="menu-item">
              <span>Danh sách oder</span>
            </a>
            <a href="/admin/comment" className="menu-item">
              <span>Bình Luận</span>
            </a>
            <a href="/admin/khuyenmai" className="menu-item">
              <span>Khuyến mãi</span>
            </a>
            <a href="/admin/customer" className="menu-item">
              <span>Khách hàng</span>
            </a>
            <a href="/admin/admin" className="menu-item active">
              <span>Admin</span>
            </a>
            <a href="/user" className="menu-item">
              <span>Đăng xuất</span>
            </a>
          </div>
        </div>

        <div className="header">
          <div className="search-box">
            <img style={{ width: "20px", height: "20px" }} src="/images/search.png" alt="Search Icon" />
            <input type="text" placeholder="Search..." />
          </div>

          <div className="user-menu">
            <div className="notification">
              <img style={{ width: "40px", height: "40px" }} src="/images/notification.png" alt="Notification Icon" />
              <span className="notification-badge">2</span>
            </div>
            <div className="language-selector">
              <img style={{ width: "60px", height: "40px" }} src="/images/vietnam.png" alt="Vietnamese flag" />
              <span>Việt Nam</span>
            </div>

            <div className="user-profile">
              <div className="user-info">
                <div className="user-name">The Nhan</div>
                <div className="user-role">Admin</div>
              </div>
              <div className="user-avatar">👤</div>
            </div>
          </div>
        </div>

        {/* Hiển thị nội dung con */}
        {children}
      </body>
    </html>
  );
}