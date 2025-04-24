module.exports = {

"[project]/src/app/user/detail/[id]/Detail.module.css [app-ssr] (css module)": ((__turbopack_context__) => {

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
"[project]/src/app/user/detail/[id]/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>DetailPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/user/detail/[id]/Detail.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
const formatPrice = (price)=>{
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};
const getImageUrl = (image)=>{
    if (!image) return "/images/placeholder.png"; // Hình ảnh dự phòng
    return `https://api-zeal.onrender.com/images/${image}`;
};
function DetailPage() {
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const [product, setProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [currentImageIndex, setCurrentImageIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchProduct = async ()=>{
            try {
                const res = await fetch(`https://api-zeal.onrender.com/api/products/${id}`);
                const data = await res.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [
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
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-center py-10",
        children: "Đang tải chi tiết sản phẩm..."
    }, void 0, false, {
        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
        lineNumber: 64,
        columnNumber: 23
    }, this);
    if (!product) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-center py-10",
        children: "Không tìm thấy sản phẩm."
    }, void 0, false, {
        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
        lineNumber: 65,
        columnNumber: 24
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["product-section"],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["product-thumbnails"],
                                children: product.images?.map((image, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].thumbnail} ${index === currentImageIndex ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].active : ""}`,
                                        onClick: ()=>setCurrentImageIndex(index),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: getImageUrl(image),
                                            alt: `${product.name} thumbnail ${index + 1}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                            lineNumber: 80,
                                            columnNumber: 17
                                        }, this)
                                    }, index, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 72,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["product-image-container"],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["product-main-image"],
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: getImageUrl(product.images?.[currentImageIndex] || ""),
                                            alt: product.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                            lineNumber: 100,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["product-dots"],
                                        children: product.images?.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dot} ${index === currentImageIndex ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].active : ""}`,
                                                onClick: ()=>setCurrentImageIndex(index)
                                            }, index, false, {
                                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                lineNumber: 116,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 114,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["product-info"],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["product-title"],
                                        children: product.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 127,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["product-price"],
                                        children: product.discountPrice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["discount-price"],
                                                    children: formatPrice(product.discountPrice)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["original-price"],
                                                    children: formatPrice(product.price)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["discount-percent"],
                                                    children: `-${Math.round((product.price - product.discountPrice) / product.price * 100)}%`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: formatPrice(product.price)
                                        }, void 0, false)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 128,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["product-description"],
                                        children: product.description || "Chưa có mô tả cho sản phẩm này."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 143,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["product-features"],
                                        children: product.special?.map((feature, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].feature,
                                                children: feature
                                            }, index, false, {
                                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                lineNumber: 149,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 147,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["quantity-controls"],
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["quantity-wrapper"],
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["quantity-btn"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].decrease}`,
                                                        onClick: decreaseQty,
                                                        children: "−"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                        lineNumber: 157,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["quantity-input"],
                                                        value: quantity,
                                                        readOnly: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                        lineNumber: 160,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["quantity-btn"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].increase}`,
                                                        onClick: increaseQty,
                                                        children: "+"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                        lineNumber: 166,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                lineNumber: 156,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["add-to-cart"],
                                                onClick: addToCart,
                                                children: "Thêm vào giỏ hàng"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                lineNumber: 170,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["product-info"],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["product-info-title"],
                                children: "Thông tin sản phẩm:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["ingredients-title"],
                                children: "Thành phần:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: product.ingredients?.join(", ") || "Không có thông tin thành phần."
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["usage-title"],
                                children: "Hướng dẫn sử dụng:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["usage-list"],
                                children: product.usage_instructions?.map((instruction, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["usage-item"],
                                        children: instruction
                                    }, index, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 186,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 184,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].cr,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["customer-review"],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["review-main-title"],
                            children: "Đánh giá từ khách hàng"
                        }, void 0, false, {
                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                            lineNumber: 197,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["rating-summary"],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["average-rating"],
                                    children: "5.0"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 199,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].stars,
                                    children: "★★★★★"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 200,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["review-count"],
                                    children: "Theo 2 đánh giá"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].review,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["review-title"],
                                    children: "Huy Bảo"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 205,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].stars,
                                    children: "★★★★★"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["review-date"],
                                    children: "Ngày: 20/03/2025"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 207,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].comment,
                                    children: "ok"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 208,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                            lineNumber: 204,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].review,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["review-title"],
                                    children: "Huy Bảo"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 212,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].stars,
                                    children: "★★★★☆"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 213,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["review-date"],
                                    children: "Ngày: 22/03/2025"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].comment,
                                    children: "Mùi hương: thơm. Kết cấu: nhẹ nhàng cho da, giá này là khá đắt. Hơn 300k cho 300g, nếu có sale thì mình cũng sẽ cân nhắc."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 215,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                            lineNumber: 211,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["write-review"],
                            children: "Viết đánh giá"
                        }, void 0, false, {
                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                            lineNumber: 220,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                    lineNumber: 196,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["product-contact-section"],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["contact-section-title"],
                        children: [
                            "Không tìm thấy được dòng sản phẩm mà bạn cần",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 227,
                                columnNumber: 55
                            }, this),
                            "hoặc thích hợp với da của bạn?"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["contact-button"],
                        children: "Liên hệ với chúng tôi"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                lineNumber: 225,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}}),
"[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-ssr] (ecmascript)");
}}),

};

//# sourceMappingURL=_f36f6ddb._.js.map