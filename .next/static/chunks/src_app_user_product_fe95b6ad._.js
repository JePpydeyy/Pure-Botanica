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
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const formatPrice = (price)=>{
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};
const getImageUrl = (image)=>{
    if (!image) return "/images/placeholder.png"; // Fallback image if none provided
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
    const productsPerPage = 9;
    // Fetch products
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductPage.useEffect": ()=>{
            const fetchProducts = {
                "ProductPage.useEffect.fetchProducts": async ()=>{
                    setIsLoading(true);
                    try {
                        const response = await fetch("https://api-zeal.onrender.com/api/products");
                        const data = await response.json();
                        setProducts(data);
                        setFilteredProducts(data);
                    } catch (error) {
                        console.error("Error fetching products:", error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["ProductPage.useEffect.fetchProducts"];
            fetchProducts();
        }
    }["ProductPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductPage.useEffect": ()=>{
            const fetchCategories = {
                "ProductPage.useEffect.fetchCategories": async ()=>{
                    try {
                        const res = await fetch("https://api-zeal.onrender.com/api/categories");
                        const data = await res.json();
                        const categoryNames = data.map({
                            "ProductPage.useEffect.fetchCategories.categoryNames": (cat)=>cat.name
                        }["ProductPage.useEffect.fetchCategories.categoryNames"]);
                        setCategories([
                            "Tất cả",
                            ...categoryNames
                        ]);
                    } catch (err) {
                        console.error("Error fetching categories:", err);
                    }
                }
            }["ProductPage.useEffect.fetchCategories"];
            fetchCategories();
        }
    }["ProductPage.useEffect"], []);
    const filterProducts = (category)=>{
        if (category === "Tất cả" || activeCategory === category) {
            setFilteredProducts(products);
            setActiveCategory(null);
        } else {
            const filtered = products.filter((product)=>{
                return product.category && product.category === category;
            });
            setFilteredProducts(filtered.length > 0 ? filtered : []);
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
    const getRandomProducts = (products, count)=>{
        const shuffled = [
            ...products
        ].sort(()=>0.5 - Math.random());
        return shuffled.slice(0, count);
    };
    const bestSellingProducts = getRandomProducts(products, 4);
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
                    lineNumber: 93,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/user/product/page.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-main-title"],
                children: "Danh sách sản phẩm"
            }, void 0, false, {
                fileName: "[project]/src/app/user/product/page.tsx",
                lineNumber: 95,
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
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["menu-list"],
                                children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["menu-list-item"],
                                        onClick: ()=>filterProducts(category),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["menu-title"],
                                            style: {
                                                color: activeCategory === category ? "#8D5524" : "#357E38",
                                                cursor: "pointer"
                                            },
                                            children: category
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/user/product/page.tsx",
                                            lineNumber: 106,
                                            columnNumber: 17
                                        }, this)
                                    }, category, false, {
                                        fileName: "[project]/src/app/user/product/page.tsx",
                                        lineNumber: 101,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/product/page.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/product/page.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].productContainer,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].productGrid,
                                children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["no-products"],
                                    children: "Đang tải sản phẩm..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/product/page.tsx",
                                    lineNumber: 122,
                                    columnNumber: 15
                                }, this) : currentProducts.length > 0 ? currentProducts.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/user/detail/${product._id}`,
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].productItem} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-link"]}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: getImageUrl(product.images?.[0] || ""),
                                                    alt: product.name,
                                                    width: 300,
                                                    height: 200,
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-image"]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/product/page.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-item-name"],
                                                            children: product.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/user/product/page.tsx",
                                                            lineNumber: 139,
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
                                                                    lineNumber: 141,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    title: "Thêm vào Giỏ Hàng",
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cartIcon,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fas fa-shopping-cart"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/user/product/page.tsx",
                                                                        lineNumber: 143,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/user/product/page.tsx",
                                                                    lineNumber: 142,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/user/product/page.tsx",
                                                            lineNumber: 140,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/user/product/page.tsx",
                                                    lineNumber: 138,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/user/product/page.tsx",
                                            lineNumber: 130,
                                            columnNumber: 19
                                        }, this)
                                    }, product._id, false, {
                                        fileName: "[project]/src/app/user/product/page.tsx",
                                        lineNumber: 125,
                                        columnNumber: 17
                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["no-products"],
                                    children: activeCategory ? `Không tìm thấy sản phẩm trong danh mục "${activeCategory}"` : "Không có sản phẩm nào."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/product/page.tsx",
                                    lineNumber: 151,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/product/page.tsx",
                                lineNumber: 120,
                                columnNumber: 11
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
                                            lineNumber: 165,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/product/page.tsx",
                                        lineNumber: 160,
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
                                                lineNumber: 176,
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
                                                lineNumber: 183,
                                                columnNumber: 21
                                            }, this));
                                        }
                                        if (end < totalPages) {
                                            paginationRange.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["ellipsis"],
                                                children: "..."
                                            }, "end-ellipsis", false, {
                                                fileName: "[project]/src/app/user/product/page.tsx",
                                                lineNumber: 194,
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
                                            lineNumber: 208,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/product/page.tsx",
                                        lineNumber: 201,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/product/page.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/product/page.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/product/page.tsx",
                lineNumber: 96,
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
                        lineNumber: 216,
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
                                            lineNumber: 226,
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
                                                lineNumber: 228,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/user/product/page.tsx",
                                            lineNumber: 227,
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
                                                    lineNumber: 237,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["best-selling-price"],
                                                    children: formatPrice(product.price)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/product/page.tsx",
                                                    lineNumber: 238,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/user/product/page.tsx",
                                            lineNumber: 236,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/user/product/page.tsx",
                                    lineNumber: 225,
                                    columnNumber: 17
                                }, this)
                            }, product._id, false, {
                                fileName: "[project]/src/app/user/product/page.tsx",
                                lineNumber: 220,
                                columnNumber: 15
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$product$2f$Product$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["no-products"],
                            children: "Đang tải sản phẩm..."
                        }, void 0, false, {
                            fileName: "[project]/src/app/user/product/page.tsx",
                            lineNumber: 244,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/product/page.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/product/page.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/user/product/page.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_s(ProductPage, "5F9KlBzNpUOvzBEGQqDyBsRUf0U=");
_c = ProductPage;
var _c;
__turbopack_context__.k.register(_c, "ProductPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_user_product_fe95b6ad._.js.map