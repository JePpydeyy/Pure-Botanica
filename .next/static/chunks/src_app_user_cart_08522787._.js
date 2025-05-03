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
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function CartPage() {
    _s();
    const [cart, setCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
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
        try {
            const response = await fetch(`https://api-zeal.onrender.com/api/carts?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                throw new Error("Không thể lấy dữ liệu giỏ hàng");
            }
            const data = await response.json();
            setCart(data);
            setLoading(false);
        } catch (err) {
<<<<<<< HEAD
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Đã xảy ra lỗi không xác định");
            }
            setLoading(false);
        }
    };
=======
            setError(err.message);
            setLoading(false);
        }
    };
<<<<<<< HEAD
=======
    // Gọi API để lấy giỏ hàng
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartPage.useEffect": ()=>{
            if (userId) {
                fetchCart();
            }
        }
    }["CartPage.useEffect"], [
        userId
    ]);
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
    // Hàm tăng số lượng
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
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
<<<<<<< HEAD
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Đã xảy ra lỗi không xác định");
            }
        }
    };
=======
            setError(err.message);
        }
    };
<<<<<<< HEAD
=======
    // Hàm giảm số lượng
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
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
<<<<<<< HEAD
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Đã xảy ra lỗi không xác định");
            }
        }
    };
    const removeItem = async (productId)=>{
        try {
            const response = await fetch(`https://api-zeal.onrender.com/api/carts/remove`, {
=======
            setError(err.message);
        }
    };
    const removeItem = async (productId)=>{
        try {
            const response = await fetch(`https://api-zeal.onrender.com/api/carts/remove/${productId}`, {
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
<<<<<<< HEAD
                    userId,
                    productId
=======
                    userId
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Không thể xóa sản phẩm: ${errorData.message || response.statusText}`);
            }
<<<<<<< HEAD
            const updatedItems = cart?.items.filter((item)=>item.product._id !== productId) || [];
=======
<<<<<<< HEAD
            await fetchCart();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Đã xảy ra lỗi không xác định");
            }
        }
    };
=======
            // Cập nhật state cục bộ trước khi gọi fetchCart
            const updatedItems = cart.items.filter((item)=>item.product._id !== productId);
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
            setCart({
                ...cart,
                items: updatedItems
            });
            await fetchCart();
        } catch (err) {
            setError(err.message);
        }
    };
<<<<<<< HEAD
=======
    // Tính tổng cộng
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
    const calculateTotal = ()=>{
        if (!cart?.items || cart.items.length === 0) return 0;
        return cart.items.reduce((total, item)=>{
            const price = Number(item.product.price) || 0;
            return total + price * item.quantity;
        }, 0);
    };
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
    // Định dạng giá tiền
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
    const formatPrice = (price)=>{
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(price);
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
<<<<<<< HEAD
                        lineNumber: 171,
=======
<<<<<<< HEAD
                        lineNumber: 196,
=======
                        lineNumber: 194,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["progress-label"],
                        children: "Giỏ hàng"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                        lineNumber: 172,
=======
<<<<<<< HEAD
                        lineNumber: 197,
=======
                        lineNumber: 195,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fa-solid fa-chevron-right"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                        lineNumber: 173,
=======
<<<<<<< HEAD
                        lineNumber: 198,
=======
                        lineNumber: 196,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].step,
                        children: "2"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                        lineNumber: 174,
=======
<<<<<<< HEAD
                        lineNumber: 200,
=======
                        lineNumber: 198,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["progress-label"],
                        children: "Chi tiết đơn hàng"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                        lineNumber: 175,
=======
<<<<<<< HEAD
                        lineNumber: 201,
=======
                        lineNumber: 199,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fa-solid fa-chevron-right"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                        lineNumber: 176,
=======
<<<<<<< HEAD
                        lineNumber: 202,
=======
                        lineNumber: 200,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].step,
                        children: "3"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                        lineNumber: 177,
=======
<<<<<<< HEAD
                        lineNumber: 204,
=======
                        lineNumber: 202,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["progress-label"],
                        children: "Đơn hàng hoàn tất"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                        lineNumber: 178,
=======
<<<<<<< HEAD
                        lineNumber: 205,
=======
                        lineNumber: 203,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                lineNumber: 170,
=======
<<<<<<< HEAD
                lineNumber: 195,
=======
                lineNumber: 193,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
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
<<<<<<< HEAD
                                lineNumber: 184,
=======
<<<<<<< HEAD
                                lineNumber: 210,
=======
                                lineNumber: 208,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                columnNumber: 13
                            }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].error,
                                children: [
                                    "Lỗi: ",
                                    error
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                lineNumber: 186,
=======
<<<<<<< HEAD
                                lineNumber: 212,
=======
                                lineNumber: 210,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                columnNumber: 13
                            }, this) : !cart || cart.items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Giỏ hàng trống"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                lineNumber: 188,
=======
<<<<<<< HEAD
                                lineNumber: 214,
=======
                                lineNumber: 212,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
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
<<<<<<< HEAD
                                                    lineNumber: 193,
=======
<<<<<<< HEAD
                                                    lineNumber: 219,
=======
                                                    lineNumber: 217,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-header"],
                                                    children: "Giá"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                    lineNumber: 194,
=======
<<<<<<< HEAD
                                                    lineNumber: 220,
=======
                                                    lineNumber: 218,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-header"],
                                                    children: "Số lượng"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                    lineNumber: 195,
=======
<<<<<<< HEAD
                                                    lineNumber: 221,
=======
                                                    lineNumber: 219,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-header"],
                                                    children: "Tổng"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                    lineNumber: 196,
=======
<<<<<<< HEAD
                                                    lineNumber: 222,
=======
                                                    lineNumber: 220,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-header"]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                    lineNumber: 197,
=======
<<<<<<< HEAD
                                                    lineNumber: 223,
=======
                                                    lineNumber: 221,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                            lineNumber: 192,
=======
<<<<<<< HEAD
                                            lineNumber: 218,
=======
                                            lineNumber: 216,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                        lineNumber: 191,
=======
<<<<<<< HEAD
                                        lineNumber: 217,
=======
                                        lineNumber: 215,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
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
                                                                src: item.product.images?.[0] ? `https://api-zeal.onrender.com/images/${item.product.images[0]}` : "https://via.placeholder.com/100x100?text=No+Image",
                                                                alt: item.product.name,
                                                                width: 100,
                                                                height: 100,
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-image"]
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                                lineNumber: 207,
=======
<<<<<<< HEAD
                                                                lineNumber: 233,
=======
                                                                lineNumber: 231,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: item.product.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                                lineNumber: 218,
=======
<<<<<<< HEAD
                                                                lineNumber: 244,
=======
                                                                lineNumber: 242,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                        lineNumber: 206,
=======
<<<<<<< HEAD
                                                        lineNumber: 232,
=======
                                                        lineNumber: 230,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-cell"],
                                                        children: formatPrice(item.product.price)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                        lineNumber: 220,
=======
<<<<<<< HEAD
                                                        lineNumber: 246,
=======
                                                        lineNumber: 244,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
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
<<<<<<< HEAD
                                                                lineNumber: 222,
=======
<<<<<<< HEAD
                                                                lineNumber: 248,
=======
                                                                lineNumber: 246,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].quantity,
                                                                children: item.quantity
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                                lineNumber: 228,
=======
<<<<<<< HEAD
                                                                lineNumber: 254,
=======
                                                                lineNumber: 252,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["quantity-btn"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].plus}`,
                                                                onClick: ()=>increaseQuantity(item.product._id, item.quantity),
                                                                children: "+"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                                lineNumber: 229,
=======
<<<<<<< HEAD
                                                                lineNumber: 255,
=======
                                                                lineNumber: 253,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                        lineNumber: 221,
=======
<<<<<<< HEAD
                                                        lineNumber: 247,
=======
                                                        lineNumber: 245,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-cell"],
                                                        children: formatPrice(item.product.price * item.quantity)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                        lineNumber: 236,
=======
<<<<<<< HEAD
                                                        lineNumber: 262,
=======
                                                        lineNumber: 260,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
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
<<<<<<< HEAD
                                                            lineNumber: 240,
=======
<<<<<<< HEAD
                                                            lineNumber: 266,
=======
                                                            lineNumber: 264,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                        lineNumber: 239,
=======
<<<<<<< HEAD
                                                        lineNumber: 265,
=======
                                                        lineNumber: 263,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, item._id || `${item.product._id}-${index}`, true, {
                                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                lineNumber: 202,
=======
<<<<<<< HEAD
                                                lineNumber: 228,
=======
                                                lineNumber: 226,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                        lineNumber: 200,
=======
<<<<<<< HEAD
                                        lineNumber: 226,
=======
                                        lineNumber: 224,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                lineNumber: 190,
=======
<<<<<<< HEAD
                                lineNumber: 216,
=======
                                lineNumber: 214,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["continue-shopping"],
                                children: "← Tiếp tục mua sắm"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                lineNumber: 251,
=======
<<<<<<< HEAD
                                lineNumber: 278,
=======
                                lineNumber: 276,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                        lineNumber: 182,
=======
<<<<<<< HEAD
                        lineNumber: 208,
=======
                        lineNumber: 206,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
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
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["discount-input"]
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                        lineNumber: 256,
=======
<<<<<<< HEAD
                                        lineNumber: 283,
=======
                                        lineNumber: 281,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["discount-btn"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].apply}`,
                                        children: "Sử dụng"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                        lineNumber: 257,
=======
<<<<<<< HEAD
                                        lineNumber: 288,
=======
                                        lineNumber: 286,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                lineNumber: 255,
=======
<<<<<<< HEAD
                                lineNumber: 282,
=======
                                lineNumber: 280,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].summary,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["summary-item"],
                                        children: [
                                            "Tổng: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: formatPrice(calculateTotal())
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                lineNumber: 261,
=======
<<<<<<< HEAD
                                                lineNumber: 294,
=======
                                                lineNumber: 292,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                        lineNumber: 260,
=======
<<<<<<< HEAD
                                        lineNumber: 293,
=======
                                        lineNumber: 291,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["summary-item"],
                                        children: [
                                            "Mã giảm: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "-0đ"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                lineNumber: 263,
                                                columnNumber: 60
=======
<<<<<<< HEAD
                                                lineNumber: 297,
=======
                                                lineNumber: 295,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
                                                columnNumber: 24
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                        lineNumber: 263,
=======
<<<<<<< HEAD
                                        lineNumber: 296,
=======
                                        lineNumber: 294,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].total} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["summary-total"]}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].total2,
                                            children: [
                                                "Tổng cộng: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: formatPrice(calculateTotal())
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                                    lineNumber: 266,
=======
<<<<<<< HEAD
                                                    lineNumber: 301,
=======
                                                    lineNumber: 299,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                                    columnNumber: 28
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                            lineNumber: 265,
=======
<<<<<<< HEAD
                                            lineNumber: 300,
=======
                                            lineNumber: 298,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                        lineNumber: 264,
=======
<<<<<<< HEAD
                                        lineNumber: 299,
=======
                                        lineNumber: 297,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                lineNumber: 259,
=======
<<<<<<< HEAD
                                lineNumber: 292,
=======
                                lineNumber: 290,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$cart$2f$Cart$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].checkout,
                                children: "Thanh toán"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                                lineNumber: 270,
=======
<<<<<<< HEAD
                                lineNumber: 305,
=======
                                lineNumber: 303,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                        lineNumber: 254,
=======
<<<<<<< HEAD
                        lineNumber: 281,
=======
                        lineNumber: 279,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
                lineNumber: 181,
=======
<<<<<<< HEAD
                lineNumber: 207,
=======
                lineNumber: 205,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/user/cart/page.tsx",
<<<<<<< HEAD
        lineNumber: 168,
=======
<<<<<<< HEAD
        lineNumber: 194,
=======
        lineNumber: 192,
>>>>>>> 37338bcc210a364497f6fb6b2ac1294e0de20174
>>>>>>> 4261d9e36523872a9a52b6d1b98306fa8fb2c489
        columnNumber: 5
    }, this);
}
_s(CartPage, "Q36SgeQ0HjO7QtbPu64I3ldrwPg=");
_c = CartPage;
var _c;
__turbopack_context__.k.register(_c, "CartPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_user_cart_08522787._.js.map