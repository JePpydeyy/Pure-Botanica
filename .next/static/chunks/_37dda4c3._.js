(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/admin/edit_product/[id]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>EditProductPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function EditProductPage() {
    _s();
    const [product, setProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [notification, setNotification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        show: false,
        message: "",
        type: ""
    });
    const [newImagePreviews, setNewImagePreviews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // Xem trước ảnh mới
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const productId = params.id;
    // Kiểm tra quyền admin
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditProductPage.useEffect": ()=>{
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");
            if (!token || role !== "admin") {
                router.push("/login");
            }
        }
    }["EditProductPage.useEffect"], [
        router
    ]);
    // Lấy dữ liệu sản phẩm và danh mục
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditProductPage.useEffect": ()=>{
            const fetchProduct = {
                "EditProductPage.useEffect.fetchProduct": async ()=>{
                    try {
                        setLoading(true);
                        setError(null);
                        const token = localStorage.getItem("token");
                        const res = await fetch(`https://api-zeal.onrender.com/api/products/${productId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            cache: "no-store"
                        });
                        if (res.status === 401 || res.status === 403) {
                            alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            localStorage.removeItem("email");
                            router.push("/login");
                            return;
                        }
                        if (!res.ok) throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
                        const data = await res.json();
                        setProduct({
                            ...data,
                            newImages: []
                        });
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
                        console.error("Lỗi khi tải sản phẩm:", errorMessage);
                        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
                        showNotification("Không thể tải thông tin sản phẩm", "error");
                    } finally{
                        setLoading(false);
                    }
                }
            }["EditProductPage.useEffect.fetchProduct"];
            const fetchCategories = {
                "EditProductPage.useEffect.fetchCategories": async ()=>{
                    try {
                        const token = localStorage.getItem("token");
                        const res = await fetch("https://api-zeal.onrender.com/api/categories", {
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            cache: "no-store"
                        });
                        if (res.status === 401 || res.status === 403) {
                            alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            localStorage.removeItem("email");
                            router.push("/login");
                            return;
                        }
                        if (!res.ok) throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
                        const data = await res.json();
                        if (!Array.isArray(data)) throw new Error("Dữ liệu danh mục không hợp lệ");
                        setCategories(data);
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
                        console.error("Lỗi khi tải danh mục:", errorMessage);
                        showNotification("Không thể tải danh mục", "error");
                    }
                }
            }["EditProductPage.useEffect.fetchCategories"];
            fetchProduct();
            fetchCategories();
        }
    }["EditProductPage.useEffect"], [
        productId,
        router
    ]);
    const showNotification = (message, type)=>{
        setNotification({
            show: true,
            message,
            type
        });
        setTimeout(()=>setNotification({
                show: false,
                message: "",
                type: ""
            }), 3000);
    };
    const validateForm = ()=>{
        if (product?.discountPrice != null && product.discountPrice < 0) return "Giá khuyến mãi không hợp lệ";
        if (!product?.name?.trim()) return "Tên sản phẩm không được để trống";
        if (product?.price == null || product.price < 0) return "Giá sản phẩm không hợp lệ";
        if (product?.stock == null || product.stock < 0) return "Số lượng không hợp lệ";
        if (!product?.category || !product.category._id) return "Vui lòng chọn danh mục";
        if (product?.newImages && product.newImages.length > 4) return "Chỉ được chọn tối đa 4 ảnh";
        if ((product?.images?.length || 0) + (product?.newImages?.length || 0) > 4) return "Tổng số ảnh không được vượt quá 4";
        return null;
    };
    // Xử lý chọn ảnh mới và xem trước
    const handleImageChange = (e)=>{
        const files = e.target.files ? Array.from(e.target.files) : [];
        const validFiles = files.filter((file)=>{
            if (file.size > 5 * 1024 * 1024) {
                showNotification(`Ảnh ${file.name} vượt quá giới hạn 5MB`, "error");
                return false;
            }
            if (!file.type.match(/image\/(jpg|jpeg|png|gif|webp)/)) {
                showNotification(`Ảnh ${file.name} không đúng định dạng (jpg, jpeg, png, gif, webp)`, "error");
                return false;
            }
            return true;
        });
        // Tạo URL xem trước cho ảnh mới
        const previews = validFiles.map((file)=>URL.createObjectURL(file));
        setNewImagePreviews(previews);
        setProduct({
            ...product,
            newImages: validFiles
        });
    };
    // Xóa ảnh hiện tại
    const removeCurrentImage = (index)=>{
        setProduct({
            ...product,
            images: product.images?.filter((_, i)=>i !== index)
        });
    };
    // Xóa ảnh mới
    const removeNewImage = (index)=>{
        setProduct({
            ...product,
            newImages: product.newImages?.filter((_, i)=>i !== index)
        });
        setNewImagePreviews((prev)=>prev.filter((_, i)=>i !== index));
    };
    const handleUpdate = async (e)=>{
        e.preventDefault();
        if (!product || !product._id) {
            showNotification("Không tìm thấy sản phẩm để cập nhật", "error");
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const validationError = validateForm();
            if (validationError) throw new Error(validationError);
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vui lòng đăng nhập lại!");
                router.push("/login");
                return;
            }
            const formData = new FormData();
            formData.append("name", product.name || "");
            formData.append("price", product.price?.toString() || "0");
            formData.append("stock", product.stock?.toString() || "0");
            if (product.category?._id) formData.append("category_id", product.category._id);
            if (product.description) formData.append("description", product.description);
            if (product.ingredients && product.ingredients.length > 0) formData.append("ingredients", JSON.stringify(product.ingredients));
            if (product.usage_instructions && product.usage_instructions.length > 0) formData.append("usage_instructions", JSON.stringify(product.usage_instructions));
            if (product.special && product.special.length > 0) formData.append("special", JSON.stringify(product.special));
            if (product.discountPrice != null && product.discountPrice !== 0) formData.append("discountPrice", product.discountPrice.toString());
            // Gửi danh sách ảnh hiện tại
            if (product.images && product.images.length > 0) {
                formData.append("images", JSON.stringify(product.images));
            }
            // Gửi ảnh mới
            if (product.newImages && product.newImages.length > 0) {
                product.newImages.forEach((file)=>{
                    formData.append("newImages", file);
                });
            }
            const response = await fetch(`https://api-zeal.onrender.com/api/products/${product._id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            if (response.status === 401 || response.status === 403) {
                alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("email");
                router.push("/login");
                return;
            }
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Lỗi API:", errorText);
                throw new Error(`Lỗi HTTP: ${response.status} - ${errorText}`);
            }
            await response.json();
            showNotification("Cập nhật sản phẩm thành công", "success");
            router.push("/admin/products");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật sản phẩm.";
            console.error("Lỗi cập nhật sản phẩm:", error);
            setError(errorMessage);
            showNotification(errorMessage, "error");
        } finally{
            setLoading(false);
            // Dọn dẹp URL xem trước
            newImagePreviews.forEach((url)=>URL.revokeObjectURL(url));
            setNewImagePreviews([]);
        }
    };
    if (loading && !product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-center py-10",
            children: "Đang tải thông tin sản phẩm..."
        }, void 0, false, {
            fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
            lineNumber: 254,
            columnNumber: 12
        }, this);
    }
    if (error && !product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "error-container text-center py-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "error-message",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                    lineNumber: 260,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "retry-button mt-4 px-4 py-2 bg-blue-500 text-white rounded",
                    onClick: ()=>window.location.reload(),
                    children: "Thử lại"
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                    lineNumber: 261,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
            lineNumber: 259,
            columnNumber: 7
        }, this);
    }
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-center py-10",
            children: "Không tìm thấy sản phẩm."
        }, void 0, false, {
            fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
            lineNumber: 272,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "product-management-container",
        children: [
            notification.show && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `notification ${notification.type}`,
                children: notification.message
            }, void 0, false, {
                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                lineNumber: 277,
                columnNumber: 29
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "processing-indicator",
                children: "Đang xử lý..."
            }, void 0, false, {
                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                lineNumber: 278,
                columnNumber: 19
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "title_container",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    children: "CHỈNH SỬA SẢN PHẨM"
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                    lineNumber: 280,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                lineNumber: 279,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "form-container",
                children: [
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "error-message",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                        lineNumber: 283,
                        columnNumber: 19
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleUpdate,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "Tên sản phẩm"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 285,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: product.name || "",
                                onChange: (e)=>setProduct({
                                        ...product,
                                        name: e.target.value
                                    }),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 286,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "Giá"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 292,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                value: product.price || 0,
                                onChange: (e)=>setProduct({
                                        ...product,
                                        price: Number(e.target.value)
                                    }),
                                required: true,
                                min: "0"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 293,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "Giá khuyến mãi (nếu có)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 300,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                value: product.discountPrice ?? "",
                                onChange: (e)=>setProduct({
                                        ...product,
                                        discountPrice: Number(e.target.value) || undefined
                                    }),
                                min: "0"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 301,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "Số lượng"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 309,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                value: product.stock || 0,
                                onChange: (e)=>setProduct({
                                        ...product,
                                        stock: Number(e.target.value)
                                    }),
                                required: true,
                                min: "0"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 310,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "Danh mục"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 317,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: product.category?._id || "",
                                onChange: (e)=>setProduct({
                                        ...product,
                                        category: categories.find((cat)=>cat._id === e.target.value) || undefined
                                    }),
                                required: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "-- Chọn danh mục --"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                        lineNumber: 328,
                                        columnNumber: 13
                                    }, this),
                                    categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: cat._id,
                                            children: cat.name
                                        }, cat._id, false, {
                                            fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                            lineNumber: 330,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 318,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "Mô tả"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: product.description || "",
                                onChange: (e)=>setProduct({
                                        ...product,
                                        description: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "Thành phần (phân cách bằng dấu phẩy)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 340,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: product.ingredients?.join(", ") || "",
                                onChange: (e)=>setProduct({
                                        ...product,
                                        ingredients: e.target.value.split(",").map((item)=>item.trim()).filter(Boolean)
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 341,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "Hướng dẫn sử dụng (phân cách bằng dấu phẩy)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 351,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: product.usage_instructions?.join(", ") || "",
                                onChange: (e)=>setProduct({
                                        ...product,
                                        usage_instructions: e.target.value.split(",").map((item)=>item.trim()).filter(Boolean)
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 352,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "Điểm đặc biệt (phân cách bằng dấu phẩy)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 362,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: product.special?.join(", ") || "",
                                onChange: (e)=>setProduct({
                                        ...product,
                                        special: e.target.value.split(",").map((item)=>item.trim()).filter(Boolean)
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 363,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "Ảnh hiện tại"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 373,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "image-preview",
                                children: product.images && product.images.length > 0 ? product.images.map((img, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "image-container",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: `https://api-zeal.onrender.com/images/${img}`,
                                                alt: `Ảnh hiện tại ${index + 1}`,
                                                width: "100",
                                                onError: (e)=>{
                                                    e.target.src = "/images/placeholder.png";
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                                lineNumber: 378,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "remove-image-btn",
                                                onClick: ()=>removeCurrentImage(index),
                                                children: "Xóa"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                                lineNumber: 386,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, index, true, {
                                        fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                        lineNumber: 377,
                                        columnNumber: 17
                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Không có ảnh hiện tại"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                    lineNumber: 396,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 374,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "Ảnh mới (tối đa 4 ảnh)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 399,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                accept: "image/*",
                                multiple: true,
                                onChange: handleImageChange
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this),
                            newImagePreviews.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "image-preview",
                                children: newImagePreviews.map((preview, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "image-container",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: preview,
                                                alt: `Ảnh mới ${index + 1}`,
                                                width: "100"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                                lineNumber: 410,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "remove-image-btn",
                                                onClick: ()=>removeNewImage(index),
                                                children: "Xóa"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                                lineNumber: 411,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, index, true, {
                                        fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                        lineNumber: 409,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 407,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "confirm-btn",
                                        type: "submit",
                                        disabled: loading,
                                        children: "Cập nhật"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                        lineNumber: 423,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "cancel-btn",
                                        type: "button",
                                        onClick: ()=>router.push("/admin/products"),
                                        disabled: loading,
                                        children: "Hủy"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                        lineNumber: 426,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                                lineNumber: 422,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
                lineNumber: 282,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/edit_product/[id]/page.tsx",
        lineNumber: 276,
        columnNumber: 5
    }, this);
}
_s(EditProductPage, "9zcHXOcaWryBW+QAWtNtKeT7Epw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = EditProductPage;
var _c;
__turbopack_context__.k.register(_c, "EditProductPage");
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

//# sourceMappingURL=_37dda4c3._.js.map