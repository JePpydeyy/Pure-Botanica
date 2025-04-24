(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/user/detail/[id]/Detail.module.css [app-client] (css module)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v({
  "active": "Detail-module__si58nq__active",
  "add-to-cart": "Detail-module__si58nq__add-to-cart",
  "average-rating": "Detail-module__si58nq__average-rating",
  "comment": "Detail-module__si58nq__comment",
  "contact-button": "Detail-module__si58nq__contact-button",
  "contact-section-title": "Detail-module__si58nq__contact-section-title",
  "container": "Detail-module__si58nq__container",
  "cr": "Detail-module__si58nq__cr",
  "customer-review": "Detail-module__si58nq__customer-review",
  "discount-percent": "Detail-module__si58nq__discount-percent",
  "discount-price": "Detail-module__si58nq__discount-price",
  "dot": "Detail-module__si58nq__dot",
  "feature": "Detail-module__si58nq__feature",
  "ingredients-title": "Detail-module__si58nq__ingredients-title",
  "original-price": "Detail-module__si58nq__original-price",
  "product-contact-section": "Detail-module__si58nq__product-contact-section",
  "product-description": "Detail-module__si58nq__product-description",
  "product-dots": "Detail-module__si58nq__product-dots",
  "product-features": "Detail-module__si58nq__product-features",
  "product-image-container": "Detail-module__si58nq__product-image-container",
  "product-info": "Detail-module__si58nq__product-info",
  "product-info-title": "Detail-module__si58nq__product-info-title",
  "product-main-image": "Detail-module__si58nq__product-main-image",
  "product-price": "Detail-module__si58nq__product-price",
  "product-section": "Detail-module__si58nq__product-section",
  "product-thumbnails": "Detail-module__si58nq__product-thumbnails",
  "product-title": "Detail-module__si58nq__product-title",
  "quantity-btn": "Detail-module__si58nq__quantity-btn",
  "quantity-controls": "Detail-module__si58nq__quantity-controls",
  "quantity-input": "Detail-module__si58nq__quantity-input",
  "quantity-wrapper": "Detail-module__si58nq__quantity-wrapper",
  "rating-summary": "Detail-module__si58nq__rating-summary",
  "review": "Detail-module__si58nq__review",
  "review-count": "Detail-module__si58nq__review-count",
  "review-date": "Detail-module__si58nq__review-date",
  "review-main-title": "Detail-module__si58nq__review-main-title",
  "review-title": "Detail-module__si58nq__review-title",
  "stars": "Detail-module__si58nq__stars",
  "thumbnail": "Detail-module__si58nq__thumbnail",
  "usage-item": "Detail-module__si58nq__usage-item",
  "usage-list": "Detail-module__si58nq__usage-list",
  "usage-title": "Detail-module__si58nq__usage-title",
  "write-review": "Detail-module__si58nq__write-review",
});
}}),
"[project]/src/app/user/detail/[id]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>DetailPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/user/detail/[id]/Detail.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const formatPrice = (price)=>{
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};
const getImageUrl = (image)=>{
    if (image.startsWith("/")) return image;
    return `/images/${image}`;
};
function DetailPage() {
    _s();
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const [product, setProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [currentImageIndex, setCurrentImageIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DetailPage.useEffect": ()=>{
            const fetchProduct = {
                "DetailPage.useEffect.fetchProduct": async ()=>{
                    try {
                        const res = await fetch(`https://api-zeal.onrender.com/api/products/${id}`);
                        const data = await res.json();
                        setProduct(data);
                        setLoading(false);
                    } catch (error) {
                        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
                        setLoading(false);
                    }
                }
            }["DetailPage.useEffect.fetchProduct"];
            if (id) fetchProduct();
        }
    }["DetailPage.useEffect"], [
        id
    ]);
    const increaseQty = ()=>setQuantity((prev)=>prev + 1);
    const decreaseQty = ()=>setQuantity((prev)=>prev > 1 ? prev - 1 : 1);
    const addToCart = ()=>{
        if (!product) return;
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItemIndex = cartItems.findIndex((item)=>item.id === product.id);
        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            cartItems.push({
                id: product.id,
                name: product.name,
                price: product.discountPrice || product.price,
                image: product.images?.[0] || "",
                quantity
            });
        }
        localStorage.setItem("cart", JSON.stringify(cartItems));
        alert("Đã thêm vào giỏ hàng!");
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-center py-10",
        children: "Đang tải chi tiết sản phẩm..."
    }, void 0, false, {
        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
        lineNumber: 63,
        columnNumber: 23
    }, this);
    if (!product) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-center py-10",
        children: "Không tìm thấy sản phẩm."
    }, void 0, false, {
        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
        lineNumber: 64,
        columnNumber: 24
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-section"],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-thumbnails"],
                                children: product.images?.map((image, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].thumbnail} ${index === currentImageIndex ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ""}`,
                                        onClick: ()=>setCurrentImageIndex(index),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: getImageUrl(image),
                                            alt: `${product.name} thumbnail ${index + 1}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                            lineNumber: 78,
                                            columnNumber: 17
                                        }, this)
                                    }, index, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-image-container"],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-main-image"],
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: getImageUrl(product.images?.[currentImageIndex] || ""),
                                            alt: product.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                            lineNumber: 86,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 85,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-dots"],
                                        children: product.images?.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dot} ${index === currentImageIndex ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ""}`,
                                                onClick: ()=>setCurrentImageIndex(index)
                                            }, index, false, {
                                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                lineNumber: 93,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-info"],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-title"],
                                        children: product.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-price"],
                                        children: product.discountPrice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["discount-price"],
                                                    children: formatPrice(product.discountPrice)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                    lineNumber: 108,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["original-price"],
                                                    children: formatPrice(product.price)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                    lineNumber: 109,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["discount-percent"],
                                                    children: `-${Math.round((product.price - product.discountPrice) / product.price * 100)}%`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                    lineNumber: 110,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: formatPrice(product.price)
                                        }, void 0, false)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-description"],
                                        children: product.description || "Chưa có mô tả cho sản phẩm này."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-features"],
                                        children: product.special?.map((feature, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].feature,
                                                children: feature
                                            }, index, false, {
                                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                lineNumber: 126,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 124,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["quantity-controls"],
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["quantity-wrapper"],
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["quantity-btn"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].decrease}`,
                                                        onClick: decreaseQty,
                                                        children: "−"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                        lineNumber: 134,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["quantity-input"],
                                                        value: quantity,
                                                        readOnly: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                        lineNumber: 137,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["quantity-btn"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].increase}`,
                                                        onClick: increaseQty,
                                                        children: "+"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                        lineNumber: 143,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                lineNumber: 133,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["add-to-cart"],
                                                onClick: addToCart,
                                                children: "Thêm vào giỏ hàng"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                lineNumber: 147,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 132,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-info"],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-info-title"],
                                children: "Thông tin sản phẩm:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["ingredients-title"],
                                children: "Thành phần:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: product.ingredients?.join(", ") || "Không có thông tin thành phần."
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["usage-title"],
                                children: "Hướng dẫn sử dụng:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["usage-list"],
                                children: product.usage_instructions?.map((instruction, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["usage-item"],
                                        children: instruction
                                    }, index, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 163,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cr,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["customer-review"],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["review-main-title"],
                            children: "Đánh giá từ khách hàng"
                        }, void 0, false, {
                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                            lineNumber: 174,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["rating-summary"],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["average-rating"],
                                    children: "5.0"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 176,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].stars,
                                    children: "★★★★★"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["review-count"],
                                    children: "Theo 2 đánh giá"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].review,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["review-title"],
                                    children: "Huy Bảo"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 182,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].stars,
                                    children: "★★★★★"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 183,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["review-date"],
                                    children: "Ngày: 20/03/2025"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].comment,
                                    children: "ok"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                            lineNumber: 181,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].review,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["review-title"],
                                    children: "Huy Bảo"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 189,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].stars,
                                    children: "★★★★☆"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["review-date"],
                                    children: "Ngày: 22/03/2025"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 191,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].comment,
                                    children: "Mùi hương: thơm. Kết cấu: nhẹ nhàng cho da, giá này là khá đắt. Hơn 300k cho 300g, nếu có sale thì mình cũng sẽ cân nhắc."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 192,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                            lineNumber: 188,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["write-review"],
                            children: "Viết đánh giá"
                        }, void 0, false, {
                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                            lineNumber: 197,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                    lineNumber: 173,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-contact-section"],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["contact-section-title"],
                        children: [
                            "Không tìm thấy được dòng sản phẩm mà bạn cần",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 204,
                                columnNumber: 55
                            }, this),
                            "hoặc thích hợp với da của bạn?"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["contact-button"],
                        children: "Liên hệ với chúng tôi"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(DetailPage, "tZi4Z3nubGrG6cn0v50Y00WXRDI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = DetailPage;
var _c;
__turbopack_context__.k.register(_c, "DetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return (type.displayName || "Context") + ".Provider";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, self, source, owner, props, debugStack, debugTask) {
        self = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== self ? self : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, self, source, getOwner(), maybeKey, debugStack, debugTask);
    }
    function validateChildKeys(node) {
        "object" === typeof node && null !== node && node.$$typeof === REACT_ELEMENT_TYPE && node._store && (node._store.validated = 1);
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler");
    Symbol.for("react.provider");
    var REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        "react-stack-bottom-frame": function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React["react-stack-bottom-frame"].bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren, source, self) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=_4f99c674._.js.map