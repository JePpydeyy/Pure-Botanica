(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/user/cart/Cart.module.css [app-client] (css module)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v({
  "active": "Cart-module__YIknGG__active",
  "cart-cell": "Cart-module__YIknGG__cart-cell",
  "cart-container": "Cart-module__YIknGG__cart-container",
  "cart-content": "Cart-module__YIknGG__cart-content",
  "cart-header": "Cart-module__YIknGG__cart-header",
  "cart-left": "Cart-module__YIknGG__cart-left",
  "cart-right": "Cart-module__YIknGG__cart-right",
  "cart-row": "Cart-module__YIknGG__cart-row",
  "cart-table": "Cart-module__YIknGG__cart-table",
  "checkout": "Cart-module__YIknGG__checkout",
  "continue-shopping": "Cart-module__YIknGG__continue-shopping",
  "discount": "Cart-module__YIknGG__discount",
  "discount-btn": "Cart-module__YIknGG__discount-btn",
  "discount-input": "Cart-module__YIknGG__discount-input",
  "product": "Cart-module__YIknGG__product",
  "progress-container": "Cart-module__YIknGG__progress-container",
  "progress-label": "Cart-module__YIknGG__progress-label",
  "quantity-btn": "Cart-module__YIknGG__quantity-btn",
  "quantity-controls": "Cart-module__YIknGG__quantity-controls",
  "step": "Cart-module__YIknGG__step",
  "summary": "Cart-module__YIknGG__summary",
  "summary-item": "Cart-module__YIknGG__summary-item",
  "summary-total": "Cart-module__YIknGG__summary-total",
  "total2": "Cart-module__YIknGG__total2",
});
}}),
"[project]/src/app/user/cart/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CartPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/user/cart/Cart.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/user/context/CartContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function CartPage() {
    _s();
    const [cart, setCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [couponError, setCouponError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [couponCode, setCouponCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [discount, setDiscount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [total, setTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { setCheckoutData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartPage.useEffect": ()=>{
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const base64Url = token.split(".")[1];
                    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                    const jsonPayload = decodeURIComponent(atob(base64).split("").map({
                        "CartPage.useEffect.jsonPayload": (c)=>"%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    }["CartPage.useEffect.jsonPayload"]).join(""));
                    const decoded = JSON.parse(jsonPayload);
                    const userIdFromToken = decoded.id || decoded._id;
                    if (userIdFromToken) {
                        setUserId(userIdFromToken);
                    } else {
                        setError("Không tìm thấy userId trong token");
                        setLoading(false);
                    }
                } catch (err) {
                    setError("Lỗi khi giải mã token");
                    setLoading(false);
                }
            } else {
                setError("Vui lòng đăng nhập để xem giỏ hàng");
                setLoading(false);
            }
        }
    }["CartPage.useEffect"], []);
    const fetchCart = async ()=>{
        if (!userId) return;
        try {
            const cartResponse = await fetch(`https://api-zeal.onrender.com/api/carts?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!cartResponse.ok) {
                throw new Error("Không thể lấy dữ liệu giỏ hàng");
            }
            const cartData = await cartResponse.json();
            setCart(cartData);
            setLoading(false);
            updatePrice();
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartPage.useEffect": ()=>{
            if (!userId) return;
            fetchCart();
        }
    }["CartPage.useEffect"], [
        userId
    ]);
    const increaseQuantity = async (productId, currentQuantity)=>{
        const newQuantity = currentQuantity + 1;
        try {
            const response = await fetch(`https://api-zeal.onrender.com/api/carts/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    userId,
                    productId,
                    quantity: newQuantity
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Không thể cập nhật số lượng: ${errorData.message || response.statusText}`);
            }
            await fetchCart();
        } catch (err) {
            setError(err.message);
        }
    };
    const decreaseQuantity = async (productId, currentQuantity)=>{
        if (currentQuantity <= 1) {
            await removeItem(productId);
            return;
        }
        const newQuantity = currentQuantity - 1;
        try {
            const response = await fetch(`https://api-zeal.onrender.com/api/carts/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    userId,
                    productId,
                    quantity: newQuantity
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Không thể cập nhật số lượng: ${errorData.message || response.statusText}`);
            }
            await fetchCart();
        } catch (err) {
            setError(err.message);
        }
    };
    const removeItem = async (productId)=>{
        try {
            const response = await fetch(`https://api-zeal.onrender.com/api/carts/remove/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    userId
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Không thể xóa sản phẩm: ${errorData.message || response.statusText}`);
            }
            const updatedItems = cart?.items.filter((item)=>item.product._id !== productId) || [];
            setCart({
                ...cart,
                items: updatedItems
            });
            await fetchCart();
        } catch (err) {
            setError(err.message);
        }
    };
    const calculateSubtotal = ()=>{
        if (!cart || !cart.items || cart.items.length === 0) return 0;
        return cart.items.reduce((total, item)=>{
            const price = Number(item.product.price) || 0;
            return total + price * item.quantity;
        }, 0);
    };
    const formatPrice = (price)=>{
        const numericPrice = Number(price) || 0;
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(numericPrice);
    };
    const updatePrice = async ()=>{
        if (!userId) return;
        try {
            const response = await fetch(`https://api-zeal.onrender.com/api/carts/update-price`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    userId,
                    couponCode
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Không thể cập nhật giá");
            }
            const data = await response.json();
            setDiscount(data.discount || 0);
            setTotal(data.total || calculateSubtotal());
            setCouponError(null);
        } catch (err) {
            setCouponError(err.message);
            setDiscount(0);
            setTotal(calculateSubtotal());
        }
    };
    const handleApplyCoupon = ()=>{
        updatePrice();
    };
    const handleCheckout = ()=>{
        if (!cart || !cart.items || cart.items.length === 0) {
            setError("Giỏ hàng trống, không thể thanh toán");
            return;
        }
        const checkoutData = {
            cart,
            userId,
            couponCode,
            subtotal: calculateSubtotal(),
            discount,
            total
        };
        setCheckoutData(checkoutData);
        console.log("Checkout data saved to Context:", checkoutData);
        router.push("/user/checkout");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-container"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["progress-container"],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].step} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active}`,
                        children: "1"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["progress-label"],
                        children: "Giỏ hàng"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fa-solid fa-chevron-right"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
                        lineNumber: 253,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].step,
                        children: "2"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
                        lineNumber: 255,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["progress-label"],
                        children: "Chi tiết đơn hàng"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fa-solid fa-chevron-right"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].step,
                        children: "3"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["progress-label"],
                        children: "Đơn hàng hoàn tất"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
                        lineNumber: 260,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/cart/page.tsx",
                lineNumber: 250,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-content"],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-left"],
                        children: [
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Đang tải giỏ hàng..."
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
                                lineNumber: 265,
                                columnNumber: 13
                            }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].error,
                                children: [
                                    "Lỗi: ",
                                    error
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
                                lineNumber: 267,
                                columnNumber: 13
                            }, this) : !cart || !cart.items || cart.items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Giỏ hàng trống"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
                                lineNumber: 269,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-table"],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-thead"],
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-row"],
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-header"],
                                                    children: "Sản phẩm"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/cart/page.tsx",
                                                    lineNumber: 274,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-header"],
                                                    children: "Giá"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/cart/page.tsx",
                                                    lineNumber: 275,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-header"],
                                                    children: "Số lượng"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/cart/page.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-header"],
                                                    children: "Tổng"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/cart/page.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-header"]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/cart/page.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/user/cart/page.tsx",
                                            lineNumber: 273,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
                                        lineNumber: 272,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-tbody"],
                                        children: cart.items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-row"],
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-cell"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].product}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                src: item.product.images && item.product.images.length > 0 ? `https://api-zeal.onrender.com/images/${item.product.images[0]}` : "https://via.placeholder.com/100x100?text=No+Image",
                                                                alt: item.product.name || "Sản phẩm",
                                                                width: 100,
                                                                height: 100,
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-image"]
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/user/cart/page.tsx",
                                                                lineNumber: 288,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: item.product.name || "Sản phẩm không xác định"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/user/cart/page.tsx",
                                                                lineNumber: 299,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/user/cart/page.tsx",
                                                        lineNumber: 287,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-cell"],
                                                        children: formatPrice(item.product.price)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/cart/page.tsx",
                                                        lineNumber: 301,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-cell"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["quantity-controls"]}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["quantity-btn"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].minus}`,
                                                                onClick: ()=>decreaseQuantity(item.product._id, item.quantity),
                                                                children: "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/user/cart/page.tsx",
                                                                lineNumber: 303,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].quantity,
                                                                children: item.quantity
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/user/cart/page.tsx",
                                                                lineNumber: 309,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["quantity-btn"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].plus}`,
                                                                onClick: ()=>increaseQuantity(item.product._id, item.quantity),
                                                                children: "+"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/user/cart/page.tsx",
                                                                lineNumber: 310,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/user/cart/page.tsx",
                                                        lineNumber: 302,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-cell"],
                                                        children: formatPrice(item.product.price * item.quantity)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/cart/page.tsx",
                                                        lineNumber: 317,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-cell"],
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fa-solid fa-trash",
                                                            onClick: ()=>removeItem(item.product._id),
                                                            style: {
                                                                cursor: "pointer"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/user/cart/page.tsx",
                                                            lineNumber: 321,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/cart/page.tsx",
                                                        lineNumber: 320,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, item._id || `${item.product._id}-${index}`, true, {
                                                fileName: "[project]/src/app/user/cart/page.tsx",
                                                lineNumber: 283,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
                                        lineNumber: 281,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
                                lineNumber: 271,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/user",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["continue-shopping"],
                                children: "← Tiếp tục mua sắm"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
                                lineNumber: 333,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-right"],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].discount,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Nhập mã giảm giá",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["discount-input"],
                                        value: couponCode,
                                        onChange: (e)=>setCouponCode(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
                                        lineNumber: 340,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["discount-btn"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].apply}`,
                                        onClick: handleApplyCoupon,
                                        children: "Sử dụng"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
                                        lineNumber: 347,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
                                lineNumber: 339,
                                columnNumber: 11
                            }, this),
                            couponError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].error,
                                style: {
                                    color: "red",
                                    fontSize: "14px",
                                    marginTop: "5px"
                                },
                                children: couponError
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].summary,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["summary-item"],
                                        children: [
                                            "Tổng: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: formatPrice(calculateSubtotal())
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/user/cart/page.tsx",
                                                lineNumber: 361,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
                                        lineNumber: 360,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["summary-item"],
                                        children: [
                                            "Mã giảm: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "-",
                                                    formatPrice(discount)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/user/cart/page.tsx",
                                                lineNumber: 364,
                                                columnNumber: 24
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
                                        lineNumber: 363,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].total} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["summary-total"]}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].total2,
                                            children: [
                                                "Tổng cộng: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: formatPrice(total)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/cart/page.tsx",
                                                    lineNumber: 368,
                                                    columnNumber: 28
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/user/cart/page.tsx",
                                            lineNumber: 367,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
                                        lineNumber: 366,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
                                lineNumber: 359,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].checkout,
                                onClick: handleCheckout,
                                children: "Thanh toán"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
                                lineNumber: 372,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
                        lineNumber: 338,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/cart/page.tsx",
                lineNumber: 262,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/user/cart/page.tsx",
        lineNumber: 249,
        columnNumber: 5
    }, this);
}
_s(CartPage, "ByynOZUw246/RrKM5+QfpdxS5R8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"]
    ];
});
_c = CartPage;
var _c;
__turbopack_context__.k.register(_c, "CartPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_user_cart_08522787._.js.map