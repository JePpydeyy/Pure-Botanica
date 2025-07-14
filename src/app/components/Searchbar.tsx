"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const getImageUrl = (image: string): string => {
  if (!image || typeof image !== "string") return "https://via.placeholder.com/40x40?text=No+Image";
  const cleanImage = image.startsWith("/") ? image.substring(1) : image;
  return `https://api-zeal.onrender.com/${cleanImage}`;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const res = await fetch("https://api-zeal.onrender.com/api/products/active");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllProducts(data);
        } else if (Array.isArray(data.products)) {
          setAllProducts(data.products);
        } else {
          setAllProducts([]);
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("allProducts:", allProducts);
    if (!query) {
      setSuggestions([]);
      return;
    }
    const filtered = allProducts.filter(product => {
      if (!product.name || typeof product.name !== "string") {
        console.warn("Invalid product name:", product);
        return false;
      }
      return product.name.toLowerCase().includes(query.toLowerCase());
    });
    console.log("suggestions:", filtered);
    setSuggestions(filtered);
  }, [query, allProducts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (query.trim()) {
      router.push(`/user/product?query=${encodeURIComponent(query)}`);
    }
  };

  const handleSelect = (productId) => {
    setShowSuggestions(false);
    setQuery("");
    router.push(`/user/detail/${productId}`);
  };

  return (
    <div style={{ position: "relative" }}>
      <form className="formtimkiem" onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          name="query"
          placeholder="Tìm kiếm sản phẩm..."
          className="search-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        <button type="submit" className="search-button">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
      {isLoading ? (
        <div style={{ padding: "12px 16px", color: "#888", textAlign: "center" }}>
          Đang tải sản phẩm...
        </div>
      ) : showSuggestions && suggestions.length > 0 ? (
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
          {suggestions.map((item) => {
            console.log("SearchBar product image:", item.images);
            return (
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
                onMouseOver={(e) => (e.currentTarget.style.background = "#f6f8fa")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Image
                  src={
                    item.images && item.images.length > 0 && typeof item.images[0] === "string"
                      ? getImageUrl(item.images[0])
                      : "https://via.placeholder.com/40x40?text=No+Image"
                  }
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/40x40?text=No+Image";
                  }}
                  alt={item.name || "Sản phẩm"}
                  width={44}
                  height={44}
                  quality={100}
                  style={{ objectFit: "cover", borderRadius: 6, border: "1px solid #eee" }}
                />
                <div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#222" }}>
                    {item.name || "Unknown Product"}
                  </span>
                  <br />
                  <span style={{ fontSize: 14, color: "#c00", fontWeight: 500 }}>
                    {item.option && item.option.length > 0
                      ? item.option[0].discount_price
                        ? item.option[0].discount_price.toLocaleString("vi-VN") + "₫"
                        : item.option[0].price.toLocaleString("vi-VN") + "₫"
                      : "N/A"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        query && (
          <div style={{ padding: "12px 16px", color: "#888", textAlign: "center" }}>
            Không tìm thấy sản phẩm
          </div>
        )
      )}
    </div>
  );
}