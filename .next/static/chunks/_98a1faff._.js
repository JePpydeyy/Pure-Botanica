(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/user/detail/[id]/Detail.module.css [app-client] (css module)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v({
  "active": "Detail-module__si58nq__active",
  "add-to-cart": "Detail-module__si58nq__add-to-cart",
  "average-rating": "Detail-module__si58nq__average-rating",
  "comment": "Detail-module__si58nq__comment",
  "comment-error": "Detail-module__si58nq__comment-error",
  "comment-input": "Detail-module__si58nq__comment-input",
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
  "submit-comment": "Detail-module__si58nq__submit-comment",
  "thumbnail": "Detail-module__si58nq__thumbnail",
  "usage-item": "Detail-module__si58nq__usage-item",
  "usage-list": "Detail-module__si58nq__usage-list",
  "usage-title": "Detail-module__si58nq__usage-title",
  "write-review": "Detail-module__si58nq__write-review",
  "write-review-section": "Detail-module__si58nq__write-review-section",
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
    if (!image) return "/images/placeholder.png"; // Hình ảnh dự phòng
    return `https://api-zeal.onrender.com/images/${image}`;
};
function DetailPage() {
    _s();
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const [product, setProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [currentImageIndex, setCurrentImageIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Người dùng"); // Lưu username từ token
    const [addingToCart, setAddingToCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [cartMessage, setCartMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // Danh sách bình luận
    const [newComment, setNewComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(""); // Nội dung bình luận mới
    const [commentError, setCommentError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Lỗi khi gửi bình luận
    const [submittingComment, setSubmittingComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Trạng thái gửi bình luận
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DetailPage.useEffect": ()=>{
            // Lấy userId và username từ token JWT
            const getUserInfoFromToken = {
                "DetailPage.useEffect.getUserInfoFromToken": ()=>{
                    const token = localStorage.getItem("token");
                    if (token) {
                        try {
                            const base64Url = token.split(".")[1];
                            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                            const jsonPayload = decodeURIComponent(atob(base64).split("").map({
                                "DetailPage.useEffect.getUserInfoFromToken.jsonPayload": (c)=>"%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                            }["DetailPage.useEffect.getUserInfoFromToken.jsonPayload"]).join(""));
                            const decoded = JSON.parse(jsonPayload);
                            const userIdFromToken = decoded.id || decoded._id;
                            const usernameFromToken = decoded.username || "Người dùng";
                            if (userIdFromToken) {
                                setUserId(userIdFromToken);
                                setUsername(usernameFromToken);
                            }
                        } catch (err) {
                            console.error("Lỗi khi giải mã token:", err);
                        }
                    }
                }
            }["DetailPage.useEffect.getUserInfoFromToken"];
            getUserInfoFromToken();
        }
    }["DetailPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DetailPage.useEffect": ()=>{
            const fetchProduct = {
                "DetailPage.useEffect.fetchProduct": async ()=>{
                    try {
                        const res = await fetch(`https://api-zeal.onrender.com/api/products/${id}`);
                        if (!res.ok) throw new Error("Không thể tải sản phẩm");
                        const data = await res.json();
                        setProduct(data);
                        setLoading(false);
                    } catch (error) {
                        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
                        setLoading(false);
                    }
                }
            }["DetailPage.useEffect.fetchProduct"];
            const fetchComments = {
                "DetailPage.useEffect.fetchComments": async ()=>{
                    try {
                        const res = await fetch(`https://api-zeal.onrender.com/api/comments/product/${id}`);
                        if (!res.ok) throw new Error("Không thể tải bình luận");
                        const data = await res.json();
                        console.log("Comments data:", data); // Debug dữ liệu bình luận
                        setComments(Array.isArray(data) ? data : []);
                    } catch (error) {
                        console.error("Lỗi khi lấy bình luận:", error);
                        setComments([]);
                    }
                }
            }["DetailPage.useEffect.fetchComments"];
            if (id) {
                fetchProduct();
                fetchComments();
            }
        }
    }["DetailPage.useEffect"], [
        id
    ]);
    const increaseQty = ()=>setQuantity((prev)=>prev + 1);
    const decreaseQty = ()=>setQuantity((prev)=>prev > 1 ? prev - 1 : 1);
    const addToCart = async ()=>{
        if (!product) return;
        if (!userId) {
            setCartMessage({
                type: 'error',
                text: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng'
            });
            const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
            const existingItemIndex = cartItems.findIndex((item)=>item.id === product._id);
            if (existingItemIndex !== -1) {
                cartItems[existingItemIndex].quantity += quantity;
            } else {
                cartItems.push({
                    id: product._id,
                    name: product.name,
                    price: product.discountPrice || product.price,
                    image: product.images?.[0] || "",
                    quantity
                });
            }
            localStorage.setItem("cart", JSON.stringify(cartItems));
            alert("Đã thêm vào giỏ hàng (localStorage)!");
            return;
        }
        setAddingToCart(true);
        try {
            const productId = product._id;
            if (!productId) throw new Error("ID sản phẩm không hợp lệ");
            const response = await fetch(`https://api-zeal.onrender.com/api/carts/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userId,
                    productId: productId,
                    quantity: quantity
                })
            });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message || "Không thể thêm sản phẩm vào giỏ hàng");
            setCartMessage({
                type: 'success',
                text: 'Đã thêm sản phẩm vào giỏ hàng!'
            });
            setTimeout(()=>setCartMessage(null), 3000);
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            setCartMessage({
                type: 'error',
                text: `Lỗi: ${error.message}`
            });
        } finally{
            setAddingToCart(false);
        }
    };
    const submitComment = async ()=>{
        if (!userId) {
            setCommentError("Vui lòng đăng nhập để viết bình luận.");
            return;
        }
        if (!newComment.trim()) {
            setCommentError("Bình luận không được để trống.");
            return;
        }
        setSubmittingComment(true);
        setCommentError(null);
        try {
            const response = await fetch(`https://api-zeal.onrender.com/api/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userId,
                    productId: id,
                    content: newComment
                })
            });
            const responseData = await response.json();
            console.log("New comment response:", responseData); // Debug dữ liệu trả về
            if (!response.ok) throw new Error(responseData.message || "Không thể gửi bình luận.");
            // Thêm bình luận mới với thông tin từ token
            setComments((prev)=>[
                    {
                        _id: responseData._id,
                        user: {
                            username: username
                        },
                        content: newComment,
                        createdAt: new Date().toISOString()
                    },
                    ...prev
                ]);
            setNewComment("");
            // Gọi lại API để đồng bộ danh sách bình luận
            const res = await fetch(`https://api-zeal.onrender.com/api/comments/product/${id}`);
            if (res.ok) {
                const updatedComments = await res.json();
                setComments(Array.isArray(updatedComments) ? updatedComments : []);
            }
        } catch (error) {
            setCommentError(`Lỗi: ${error.message}`);
        } finally{
            setSubmittingComment(false);
        }
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-center py-10",
        children: "Đang tải chi tiết sản phẩm..."
    }, void 0, false, {
        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
        lineNumber: 231,
        columnNumber: 23
    }, this);
    if (!product) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-center py-10",
        children: "Không tìm thấy sản phẩm."
    }, void 0, false, {
        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
        lineNumber: 232,
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
                                            lineNumber: 245,
                                            columnNumber: 17
                                        }, this)
                                    }, `thumbnail-${index}`, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 240,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 238,
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
                                            lineNumber: 255,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 254,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-dots"],
                                        children: product.images?.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dot} ${index === currentImageIndex ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ""}`,
                                                onClick: ()=>setCurrentImageIndex(index)
                                            }, `dot-${index}`, false, {
                                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                lineNumber: 262,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 260,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 253,
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
                                        lineNumber: 272,
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
                                                    lineNumber: 276,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["original-price"],
                                                    children: formatPrice(product.price)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["discount-percent"],
                                                    children: `-${Math.round((product.price - product.discountPrice) / product.price * 100)}%`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: formatPrice(product.price)
                                        }, void 0, false)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 273,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-description"],
                                        children: product.description || "Chưa có mô tả cho sản phẩm này."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 288,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["product-features"],
                                        children: product.special?.map((feature, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].feature,
                                                children: feature
                                            }, `feature-${index}`, false, {
                                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                lineNumber: 294,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 292,
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
                                                        lineNumber: 302,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["quantity-input"],
                                                        value: quantity,
                                                        readOnly: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                        lineNumber: 305,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["quantity-btn"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].increase}`,
                                                        onClick: increaseQty,
                                                        children: "+"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                        lineNumber: 311,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                lineNumber: 301,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["add-to-cart"],
                                                onClick: addToCart,
                                                disabled: addingToCart,
                                                children: addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                                lineNumber: 315,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 300,
                                        columnNumber: 13
                                    }, this),
                                    cartMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["cart-message"]} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"][cartMessage.type]}`,
                                        children: cartMessage.text
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 325,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                        lineNumber: 237,
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
                                lineNumber: 333,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["ingredients-title"],
                                children: "Thành phần:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 334,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: product.ingredients?.join(", ") || "Không có thông tin thành phần."
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["usage-title"],
                                children: "Hướng dẫn sử dụng:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 337,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["usage-list"],
                                children: product.usage_instructions?.map((instruction, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["usage-item"],
                                        children: instruction
                                    }, `instruction-${index}`, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 340,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 338,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                lineNumber: 236,
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
                            lineNumber: 350,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["write-review-section"],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["review-title"],
                                    children: "Viết bình luận của bạn"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 353,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["comment-input"],
                                    value: newComment,
                                    onChange: (e)=>setNewComment(e.target.value),
                                    placeholder: "Nhập bình luận của bạn...",
                                    rows: 4
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 354,
                                    columnNumber: 13
                                }, this),
                                commentError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["comment-error"],
                                    children: commentError
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 362,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["submit-comment"],
                                    onClick: submitComment,
                                    disabled: submittingComment,
                                    children: submittingComment ? "Đang gửi..." : "Gửi bình luận"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                    lineNumber: 364,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                            lineNumber: 352,
                            columnNumber: 11
                        }, this),
                        comments.length > 0 ? comments.map((comment, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].review,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["review-title"],
                                        children: comment.user?.username || "Ẩn danh"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 376,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["review-date"],
                                        children: [
                                            "Ngày: ",
                                            new Date(comment.createdAt).toLocaleDateString("vi-VN")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 377,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].comment,
                                        children: comment.content
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                        lineNumber: 380,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, comment._id || `comment-${index}`, true, {
                                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                                lineNumber: 375,
                                columnNumber: 15
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Chưa có bình luận nào cho sản phẩm này."
                        }, void 0, false, {
                            fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                            lineNumber: 384,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                    lineNumber: 349,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                lineNumber: 348,
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
                                lineNumber: 391,
                                columnNumber: 55
                            }, this),
                            "hoặc thích hợp với da của bạn?"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                        lineNumber: 390,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$detail$2f5b$id$5d2f$Detail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["contact-button"],
                        children: "Liên hệ với chúng tôi"
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                        lineNumber: 393,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/detail/[id]/page.tsx",
                lineNumber: 389,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(DetailPage, "En1O4Gh3ncF9zVpm3Hw77UzsnEM=", false, function() {
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
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=_98a1faff._.js.map