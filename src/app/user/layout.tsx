import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Category } from "../components/category_interface";
import { AuthProvider } from "./context/AuthContext";
import CategoryList from "../components/category_list";
import UserMenu from "../components/Usermenu";
import { CartProvider } from "./context/CartContext";
import SearchBar from "../components/Searchbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pure Botanica",
  description: "Website mỹ phẩm thiên nhiên",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const category: Category[] = await getCategories("https://api-zeal.onrender.com/api/categories");

  // Hàm lấy hình ảnh từ API (favicon hoặc logo)
  const fetchImage = async (type: "favicon" | "logo-shop") => {
    console.log(`Fetching ${type}...`);
    const res = await fetch(`https://api-zeal.onrender.com/api/interfaces/${type}`, { cache: "no-store" });
    if (!res.ok) {
      console.error(`Fetch ${type} failed:`, res.status, res.statusText);
      return null;
    }
    const data = await res.json();
    console.log(`${type} data:`, data);
    return data.paths[0] || null;
  };

  const faviconPath = await fetchImage("favicon");
  const logoPath = await fetchImage("logo-shop");

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;300;400;700&display=swap"
          rel="stylesheet"
        />
        {faviconPath && (
          <link rel="icon" href={`https://api-zeal.onrender.com/${faviconPath}?v=${Date.now()}`} type="image/x-icon" />
        )}
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            {/* Header */}
            <header>
              <div className="container header-container">
                <div className="logo">
                  <Link href="/user">
                    <img
                      src={logoPath ? `https://api-zeal.onrender.com/${logoPath}?v=${Date.now()}` : "/images/logo_web.png"}
                      alt="Pure Botanica"
                    />
                  </Link>
                </div>
                <nav>
                  <div className="menu-wrapper">
                    <Link href="/user/product" className="dropdown">
                      Sản phẩm
                    </Link>
                    <CategoryList categories={category} />
                  </div>
                  <Link href="/user/about">Về chúng tôi</Link>
                  <Link href="/user/contact">Liên hệ</Link>
                  <Link href="/user/new">Tin tức</Link>
                </nav>
                <div className="icons">
                  <div className="search-bar">
                    <SearchBar />
                  </div>
                  <Link href="/user/wishlist" title="Danh sách yêu thích">
                    <i className="fa-solid fa-heart"></i>
                  </Link>
                  <Link href="/user/cart" title="Giỏ hàng">
                    <i className="fa-solid fa-cart-shopping"></i>
                  </Link>
                  <UserMenu />
                </div>
              </div>
            </header>

            {/* Main content */}
            <main>{children}</main>
    
            {/* Footer */}
            <footer className="footer">
              <div className="footer-container">
                <div className="footer-logo">
                  <img
                    src={logoPath ? `https://api-zeal.onrender.com/${logoPath}?v=${Date.now()}` : "/images/logo_web.png"}
                    alt="Pure Botanica Logo"
                  />
                  <p className="footer-slogan">
                    "Nurtured by Nature <br /> Perfected for You"
                  </p>
                </div>
                <div className="footer-links">
                  <div className="footer-column">
                    <h4>SẢN PHẨM</h4>
                    <ul>
                      <li><Link href="#">Chăm sóc da</Link></li>
                      <li><Link href="#">Chăm sóc tóc</Link></li>
                      <li><Link href="#">Chăm sóc cơ thể</Link></li>
                      <li><Link href="#">Bộ trang điểm</Link></li>
                      <li><Link href="#">Hương thơm</Link></li>
                      <li><Link href="#">Mẹ và bé</Link></li>
                    </ul>
                  </div>
                  <div className="footer-column">
                    <h4>CHÍNH SÁCH</h4>
                    <ul>
                      <li><Link href="#">Chính sách bảo mật</Link></li>
                      <li><Link href="#">Chính sách đổi trả</Link></li>
                      <li><Link href="#">Chính sách giao hàng</Link></li>
                      <li><Link href="#">Chính sách bảo mật thông tin</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="footer-newsletter">
                  <h4>Đăng ký email để nhận thông tin</h4>
                  <p>Hãy là người đầu tiên biết về sự kiện mới, sản phẩm mới</p>
                  <form>
                    <input type="email" placeholder="Nhập email của bạn..." />
                    <button type="submit">Đăng Ký</button>
                  </form>
                  <div className="footer-address">
                    <p>
                      <i className="fa-solid fa-location-dot"></i> Tòa nhà QTSC9 (tòa T), đường Tô Ký, phường Tân Chánh Hiệp, Quận 12, TP Hồ Chí Minh
                    </p>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  border: "none",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginTop: "50px",
                  marginBottom: "0",
                }}
              />
              <div className="footer-bottom">
                <p>© 2025 Pure Botanica LLC</p>
                <div className="footer-payment">
                  <img src="/images/creditcart.png" alt="Creditcard" />
                  <img src="/images/Logo-ZaloPay.png" alt="ZaloPay" />
                  <img src="/images/Logo-MoMo.png" alt="Momo" />
                  <img src="/images/Apple-Pay.png" alt="Apple Pay" />
                  <img src="/images/Visa.png" alt="Visa" />
                </div>
              </div>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

// Hàm lấy danh mục
async function getCategories(url: string): Promise<Category[]> {
  let res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];

  let data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.map((category: any) => ({
    _id: category._id,
    name: category.name,
    isHidden: category.isHidden || false,
    status: category.status,
    createdAt: category.createdAt,
  }));
}