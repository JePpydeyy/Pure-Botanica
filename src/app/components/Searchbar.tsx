"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  // Lấy tất cả sản phẩm khi component mount
  useEffect(() => {
    fetch("https://api-zeal.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAllProducts(data);
        else if (Array.isArray(data.products)) setAllProducts(data.products);
        else setAllProducts([]);
      });
  }, []);

  // Lọc sản phẩm theo query
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const filtered = allProducts.filter(product =>
      product.name?.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  }, [query, allProducts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (query.trim()) {
      router.push(`/user/product?query=${encodeURIComponent(query)}`);
    }
  };

  const handleSelect = (productId: string) => {
    setShowSuggestions(false);
    setQuery("");
    router.push(`/user/detail/${productId}`);
  };

  return (
    <div style={{ position: "relative" }}>
      <form
        className="formtimkiem"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
         <input
          type="text"
          name="query"
          placeholder="Tìm kiếm sản phẩm..."
          className="search-input"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Thêm dòng này
        />
        <button type="submit" className="search-button">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
      {showSuggestions && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #e0e0e0",
            zIndex: 9999,
            maxHeight: 320,
            overflowY: "auto",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            borderRadius: 8,
            marginTop: 4,
            padding: "4px 0",
            minWidth: 320,
          }}
        >
          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <div
                key={item.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f5f5f5",
                  transition: "background 0.2s",
                }}
                onMouseDown={() => handleSelect(item.slug)}
                onMouseOver={e => (e.currentTarget.style.background = "#f6f8fa")}
                onMouseOut={e => (e.currentTarget.style.background = "transparent")}
              >
                <img
                  src={
                    item.images && item.images.length > 0
                      ? `https://api-zeal.onrender.com/images/${item.images[0].replace(/^images\//, "")}`
                      : "https://via.placeholder.com/40x40?text=No+Image"
                  }
                  alt={item.name}
                  width={44}
                  height={44}
                  style={{ objectFit: "cover", borderRadius: 6, border: "1px solid #eee" }}
                />
                <div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#222" }}>{item.name}</span>
                  <br />
                  <span style={{ fontSize: 14, color: "#c00", fontWeight: 500 }}>
                    {item.option && item.option.length > 0
                      ? item.option[0].discount_price
                        ? item.option[0].discount_price.toLocaleString("vi-VN") + "₫"
                        : item.option[0].price.toLocaleString("vi-VN") + "₫"
                      : ""}
                  </span>
                </div>
              </div>
            ))
          ) : (
            query && (
              <div style={{ padding: "12px 16px", color: "#888", textAlign: "center" }}>
                Không tìm thấy sản phẩm
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}