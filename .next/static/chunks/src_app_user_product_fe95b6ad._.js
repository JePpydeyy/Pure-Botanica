(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/user/product/Product.module.css [app-client] (css module)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v({
  "active": "Product-module__5lVGwa__active",
  "banner-image": "Product-module__5lVGwa__banner-image",
  "best-selling-badge": "Product-module__5lVGwa__best-selling-badge",
  "best-selling-card": "Product-module__5lVGwa__best-selling-card",
  "best-selling-details": "Product-module__5lVGwa__best-selling-details",
  "best-selling-grid": "Product-module__5lVGwa__best-selling-grid",
  "best-selling-image": "Product-module__5lVGwa__best-selling-image",
  "best-selling-link": "Product-module__5lVGwa__best-selling-link",
  "best-selling-price": "Product-module__5lVGwa__best-selling-price",
  "best-selling-product-image": "Product-module__5lVGwa__best-selling-product-image",
  "best-selling-product-name": "Product-module__5lVGwa__best-selling-product-name",
  "best-selling-products": "Product-module__5lVGwa__best-selling-products",
  "cartIcon": "Product-module__5lVGwa__cartIcon",
  "containerBox": "Product-module__5lVGwa__containerBox",
  "disabled": "Product-module__5lVGwa__disabled",
  "menu-list": "Product-module__5lVGwa__menu-list",
  "menu-list-item": "Product-module__5lVGwa__menu-list-item",
  "menu-title": "Product-module__5lVGwa__menu-title",
  "no-products": "Product-module__5lVGwa__no-products",
  "page-btn": "Product-module__5lVGwa__page-btn",
  "price": "Product-module__5lVGwa__price",
  "product-card": "Product-module__5lVGwa__product-card",
  "product-details": "Product-module__5lVGwa__product-details",
  "product-image": "Product-module__5lVGwa__product-image",
  "product-item-name": "Product-module__5lVGwa__product-item-name",
  "product-link": "Product-module__5lVGwa__product-link",
  "product-main-title": "Product-module__5lVGwa__product-main-title",
  "productBanner": "Product-module__5lVGwa__productBanner",
  "productContainer": "Product-module__5lVGwa__productContainer",
  "productGrid": "Product-module__5lVGwa__productGrid",
  "productItem": "Product-module__5lVGwa__productItem",
  "productPagination": "Product-module__5lVGwa__productPagination",
  "productSidebar": "Product-module__5lVGwa__productSidebar",
  "sidebar-title": "Product-module__5lVGwa__sidebar-title",
  "slider-title": "Product-module__5lVGwa__slider-title",
});
}}),
"[project]/src/app/user/product/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ProductPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/user/product/Product.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const formatPrice = (price)=>{
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};
const getImageUrl = (image)=>{
    if (!image) return "/images/placeholder.png";
    return `https://api-zeal.onrender.com/images/${image}`;
};
function ProductPage() {
    _s();
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filteredProducts, setFilteredProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const productsPerPage = 9;
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    // Fetch products
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductPage.useEffect": ()=>{
            const fetchProducts = {
                "ProductPage.useEffect.fetchProducts": async ()=>{
                    setIsLoading(true);
                    setError(null);
                    try {
                        const response = await fetch("https://api-zeal.onrender.com/api/products");
                        if (!response.ok) {
                            throw new Error(`Lỗi tải sản phẩm: ${response.status}`);
                        }
                        const data = await response.json();
                        console.log("Products:", data);
                        console.log("Categories in products:", [
                            ...new Set(data.map({
                                "ProductPage.useEffect.fetchProducts": (p)=>p.category?.name
                            }["ProductPage.useEffect.fetchProducts"]))
                        ].filter(Boolean));
                        setProducts(data);
                        setFilteredProducts(data);
                    } catch (error) {
                        console.error("Error fetching products:", error);
                        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["ProductPage.useEffect.fetchProducts"];
            fetchProducts();
        }
    }["ProductPage.useEffect"], []);
    // Fetch categories
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductPage.useEffect": ()=>{
            const fetchCategories = {
                "ProductPage.useEffect.fetchCategories": async ()=>{
                    try {
                        const res = await fetch("https://api-zeal.onrender.com/api/categories");
                        if (!res.ok) {
                            throw new Error(`Lỗi tải danh mục: ${res.status}`);
                        }
                        const data = await res.json();
                        console.log("Categories from API:", data.map({
                            "ProductPage.useEffect.fetchCategories": (cat)=>cat.name
                        }["ProductPage.useEffect.fetchCategories"]));
                        const categoryNames = data.map({
                            "ProductPage.useEffect.fetchCategories.categoryNames": (cat)=>cat.name
                        }["ProductPage.useEffect.fetchCategories.categoryNames"]);
                        setCategories([
                            "Tất cả",
                            ...categoryNames
                        ]);
                    } catch (err) {
                        console.error("Error fetching categories:", err);
                        setError("Không thể tải danh mục. Vui lòng thử lại sau.");
                    }
                }
            }["ProductPage.useEffect.fetchCategories"];
            fetchCategories();
        }
    }["ProductPage.useEffect"], []);
    // Apply filter based on URL query parameter
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductPage.useEffect": ()=>{
            const categoryFromUrl = searchParams.get("category");
            console.log("Raw category from URL:", categoryFromUrl);
            // Reset to all products if no category in URL
            if (!categoryFromUrl) {
                console.log("No category in URL, resetting to all products");
                setActiveCategory(null);
                setFilteredProducts(products);
                setCurrentPage(1);
                return;
            }
            // Wait for products and categories to be loaded
            if (products.length === 0 || categories.length === 0) {
                console.log("Waiting for products/categories to load...");
                return;
            }
            // Decode the category from URL
            const decodedCategory = decodeURIComponent(categoryFromUrl);
            console.log("Decoded category from URL:", decodedCategory);
            // Check if the decoded category exists in the fetched categories
            if (categories.includes(decodedCategory)) {
                console.log("Category exists in API categories:", decodedCategory);
                if (decodedCategory === "Tất cả") {
                    console.log("Category is 'Tất cả', showing all products");
                    setActiveCategory(null);
                    setFilteredProducts(products);
                } else {
                    console.log("Applying filter for category:", decodedCategory);
                    const filtered = products.filter({
                        "ProductPage.useEffect.filtered": (product)=>product.category?.name === decodedCategory
                    }["ProductPage.useEffect.filtered"]);
                    console.log("Filtered products count:", filtered.length);
                    console.log("Filtered products:", filtered);
                    setActiveCategory(decodedCategory);
                    setFilteredProducts(filtered);
                }
            } else {
                console.log("Category not found in API categories, resetting to all products:", decodedCategory);
                setActiveCategory(null);
                setFilteredProducts(products);
            }
            setCurrentPage(1);
        }
    }["ProductPage.useEffect"], [
        searchParams,
        products,
        categories
    ]);
    // Filter products by category (for sidebar clicks)
    const filterProducts = (category)=>{
        console.log("Filtering category (sidebar):", category);
        if (category === "Tất cả") {
            setFilteredProducts(products);
            setActiveCategory(null);
        } else {
            const filtered = products.filter((product)=>product.category?.name === category);
            console.log("Filtered products (sidebar) count:", filtered.length);
            setFilteredProducts(filtered);
            setActiveCategory(category);
        }
        setCurrentPage(1);
    };
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductPage.useEffect": ()=>{
            if (currentPage > totalPages && totalPages > 0) {
                setCurrentPage(totalPages);
            }
        }
    }["ProductPage.useEffect"], [
        filteredProducts,
        currentPage,
        totalPages
    ]);
    // Hàm lấy sản phẩm theo stock cao nhất
    const getTopStockProducts = (products, count)=>{
        const sortedProducts = [
            ...products
        ].sort((a, b)=>b.stock - a.stock);
        return sortedProducts.slice(0, count);
    };
    const bestSellingProducts = getTopStockProducts(products, 5);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].productBanner,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: "/images/productBanner.png",
                    alt: "Banner",
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["banner-image"]
                }, void 0, false, {
                    fileName: "[project]/src/app/user/product/page.tsx",
                    lineNumber: 168,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/user/product/page.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-main-title"],
                children: "Danh sách sản phẩm"
            }, void 0, false, {
                fileName: "[project]/src/app/user/product/page.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].containerBox,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].productSidebar,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["sidebar-title"],
                                children: "DANH MỤC SẢN PHẨM"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/product/page.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["menu-list"],
                                children: categories.length > 0 ? categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["menu-list-item"],
                                        onClick: ()=>{
                                            console.log("Clicked category:", category);
                                            filterProducts(category);
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["menu-title"],
                                            style: {
                                                color: activeCategory === category ? "#8D5524" : "#357E38",
                                                cursor: "pointer"
                                            },
                                            children: category
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/user/product/page.tsx",
                                            lineNumber: 185,
                                            columnNumber: 19
                                        }, this)
                                    }, category, false, {
                                        fileName: "[project]/src/app/user/product/page.tsx",
                                        lineNumber: 177,
                                        columnNumber: 17
                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["no-products"],
                                    children: "Không có danh mục nào."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/product/page.tsx",
                                    lineNumber: 197,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/product/page.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/product/page.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].productContainer,
                        children: [
                            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["no-products"],
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/product/page.tsx",
                                lineNumber: 203,
                                columnNumber: 13
                            }, this) : isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["no-products"],
                                children: "Đang tải sản phẩm..."
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/product/page.tsx",
                                lineNumber: 205,
                                columnNumber: 13
                            }, this) : currentProducts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].productGrid,
                                children: currentProducts.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/user/detail/${product._id}`,
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].productItem} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-link"]}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: product.images && product.images.length > 0 ? `https://api-zeal.onrender.com/images/${product.images[0]}` : "https://via.placeholder.com/300x200?text=No+Image",
                                                    alt: product.name,
                                                    width: 300,
                                                    height: 200,
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-image"]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                                    lineNumber: 215,
                                                    columnNumber: 21
=======
<<<<<<< HEAD
                                                    lineNumber: 131,
                                                    columnNumber: 19
=======
<<<<<<< HEAD
                                                    lineNumber: 162,
                                                    columnNumber: 21
=======
                                                    lineNumber: 131,
                                                    columnNumber: 19
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-item-name"],
                                                            children: product.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                                            lineNumber: 227,
=======
<<<<<<< HEAD
                                                            lineNumber: 143,
=======
<<<<<<< HEAD
                                                            lineNumber: 174,
=======
                                                            lineNumber: 143,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-card"],
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].price,
                                                                    children: formatPrice(product.price)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                                                    lineNumber: 229,
=======
<<<<<<< HEAD
                                                                    lineNumber: 145,
=======
<<<<<<< HEAD
                                                                    lineNumber: 176,
=======
                                                                    lineNumber: 145,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    title: "Thêm vào Giỏ Hàng",
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cartIcon,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fas fa-shopping-cart"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                                                        lineNumber: 231,
=======
<<<<<<< HEAD
                                                                        lineNumber: 147,
=======
<<<<<<< HEAD
                                                                        lineNumber: 178,
=======
                                                                        lineNumber: 147,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                                                    lineNumber: 230,
=======
<<<<<<< HEAD
                                                                    lineNumber: 146,
=======
<<<<<<< HEAD
                                                                    lineNumber: 177,
=======
                                                                    lineNumber: 146,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                                            lineNumber: 228,
=======
<<<<<<< HEAD
                                                            lineNumber: 144,
=======
<<<<<<< HEAD
                                                            lineNumber: 175,
=======
                                                            lineNumber: 144,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                                    lineNumber: 226,
=======
<<<<<<< HEAD
                                                    lineNumber: 142,
=======
<<<<<<< HEAD
                                                    lineNumber: 173,
=======
                                                    lineNumber: 142,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/user/product/page.tsx",
                                            lineNumber: 214,
                                            columnNumber: 19
                                        }, this)
                                    }, product._id, false, {
                                        fileName: "[project]/src/app/user/product/page.tsx",
                                        lineNumber: 209,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/product/page.tsx",
                                lineNumber: 207,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["no-products"],
                                children: activeCategory ? `Không tìm thấy sản phẩm trong danh mục "${activeCategory}"` : "Không có sản phẩm nào."
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/product/page.tsx",
                                lineNumber: 240,
                                columnNumber: 13
                            }, this),
                            totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].productPagination,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["page-btn"]} ${currentPage === 1 ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].disabled : ""}`,
                                        disabled: currentPage === 1,
                                        onClick: ()=>setCurrentPage(currentPage - 1),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fa-solid fa-chevron-left"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                            lineNumber: 253,
=======
<<<<<<< HEAD
                                            lineNumber: 169,
=======
<<<<<<< HEAD
                                            lineNumber: 200,
=======
                                            lineNumber: 169,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                        lineNumber: 248,
=======
<<<<<<< HEAD
                                        lineNumber: 164,
=======
<<<<<<< HEAD
                                        lineNumber: 195,
=======
                                        lineNumber: 164,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                        columnNumber: 15
                                    }, this),
                                    (()=>{
                                        const paginationRange = [];
                                        let start = Math.max(1, currentPage - 1);
                                        let end = Math.min(totalPages, start + 2);
                                        if (end - start < 2) {
                                            start = Math.max(1, end - 2);
                                        }
                                        if (start > 1) {
                                            paginationRange.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["ellipsis"],
                                                children: "..."
                                            }, "start-ellipsis", false, {
                                                fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                                lineNumber: 264,
=======
<<<<<<< HEAD
                                                lineNumber: 180,
=======
<<<<<<< HEAD
                                                lineNumber: 211,
=======
                                                lineNumber: 180,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                columnNumber: 21
                                            }, this));
                                        }
                                        for(let i = start; i <= end; i++){
                                            paginationRange.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["page-btn"]} ${currentPage === i ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ""}`,
                                                onClick: ()=>setCurrentPage(i),
                                                children: i
                                            }, `page-${i}`, false, {
                                                fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                                lineNumber: 271,
=======
<<<<<<< HEAD
                                                lineNumber: 187,
=======
<<<<<<< HEAD
                                                lineNumber: 218,
=======
                                                lineNumber: 187,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                columnNumber: 21
                                            }, this));
                                        }
                                        if (end < totalPages) {
                                            paginationRange.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["ellipsis"],
                                                children: "..."
                                            }, "end-ellipsis", false, {
                                                fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                                lineNumber: 282,
=======
<<<<<<< HEAD
                                                lineNumber: 198,
=======
<<<<<<< HEAD
                                                lineNumber: 229,
=======
                                                lineNumber: 198,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                columnNumber: 21
                                            }, this));
                                        }
                                        return paginationRange;
                                    })(),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["page-btn"]} ${currentPage === totalPages ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].disabled : ""}`,
                                        disabled: currentPage === totalPages,
                                        onClick: ()=>setCurrentPage(currentPage + 1),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fa-solid fa-chevron-right"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                            lineNumber: 296,
=======
<<<<<<< HEAD
                                            lineNumber: 212,
=======
<<<<<<< HEAD
                                            lineNumber: 243,
=======
                                            lineNumber: 212,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                        lineNumber: 289,
=======
<<<<<<< HEAD
                                        lineNumber: 205,
=======
<<<<<<< HEAD
                                        lineNumber: 236,
=======
                                        lineNumber: 205,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                lineNumber: 247,
=======
<<<<<<< HEAD
                                lineNumber: 163,
=======
<<<<<<< HEAD
                                lineNumber: 194,
=======
                                lineNumber: 163,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/product/page.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/product/page.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["best-selling-products"],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["slider-title"],
                        children: "Có thể bạn sẽ thích"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                        lineNumber: 303,
=======
<<<<<<< HEAD
                        lineNumber: 220,
=======
<<<<<<< HEAD
                        lineNumber: 251,
=======
                        lineNumber: 220,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["best-selling-grid"],
                        children: bestSellingProducts.length > 0 ? bestSellingProducts.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/user/detail/${product._id}`,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["best-selling-link"],
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["best-selling-card"],
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["best-selling-badge"],
                                            children: "Sale"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                            lineNumber: 313,
=======
<<<<<<< HEAD
                                            lineNumber: 230,
=======
<<<<<<< HEAD
                                            lineNumber: 261,
=======
                                            lineNumber: 230,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["best-selling-image"],
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: getImageUrl(product.images?.[0] || ""),
                                                alt: product.name,
                                                width: 200,
                                                height: 200,
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["best-selling-product-image"]
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                                lineNumber: 315,
=======
<<<<<<< HEAD
                                                lineNumber: 232,
=======
<<<<<<< HEAD
                                                lineNumber: 263,
=======
                                                lineNumber: 232,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                            lineNumber: 314,
=======
<<<<<<< HEAD
                                            lineNumber: 231,
=======
<<<<<<< HEAD
                                            lineNumber: 262,
=======
                                            lineNumber: 231,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["best-selling-details"],
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["best-selling-product-name"],
                                                    children: product.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                                    lineNumber: 324,
=======
<<<<<<< HEAD
                                                    lineNumber: 241,
=======
<<<<<<< HEAD
                                                    lineNumber: 272,
=======
                                                    lineNumber: 241,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["best-selling-price"],
                                                    children: formatPrice(product.price)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                                    lineNumber: 325,
=======
<<<<<<< HEAD
                                                    lineNumber: 242,
=======
<<<<<<< HEAD
                                                    lineNumber: 273,
=======
                                                    lineNumber: 242,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                            lineNumber: 323,
=======
<<<<<<< HEAD
                                            lineNumber: 240,
=======
<<<<<<< HEAD
                                            lineNumber: 271,
=======
                                            lineNumber: 240,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                    lineNumber: 312,
=======
<<<<<<< HEAD
                                    lineNumber: 229,
=======
<<<<<<< HEAD
                                    lineNumber: 260,
=======
                                    lineNumber: 229,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                    columnNumber: 17
                                }, this)
                            }, product._id, false, {
                                fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                                lineNumber: 307,
=======
<<<<<<< HEAD
                                lineNumber: 224,
=======
<<<<<<< HEAD
                                lineNumber: 255,
=======
                                lineNumber: 224,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                columnNumber: 15
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["no-products"],
                            children: "Đang tải sản phẩm..."
                        }, void 0, false, {
                            fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                            lineNumber: 331,
=======
<<<<<<< HEAD
                            lineNumber: 248,
=======
<<<<<<< HEAD
                            lineNumber: 279,
=======
                            lineNumber: 248,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                        lineNumber: 304,
=======
<<<<<<< HEAD
                        lineNumber: 221,
=======
<<<<<<< HEAD
                        lineNumber: 252,
=======
                        lineNumber: 221,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/product/page.tsx",
<<<<<<< HEAD
                lineNumber: 302,
=======
<<<<<<< HEAD
                lineNumber: 219,
=======
<<<<<<< HEAD
                lineNumber: 250,
=======
                lineNumber: 219,
>>>>>>> c9215392f51e2486d4f2e69aee35a053e36b5441
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/user/product/page.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, this);
}
_s(ProductPage, "yfglZPRQ96+wwUhAaXPF1+DBRd8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = ProductPage;
var _c;
__turbopack_context__.k.register(_c, "ProductPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_user_product_fe95b6ad._.js.map