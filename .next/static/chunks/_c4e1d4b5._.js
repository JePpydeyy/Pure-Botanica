(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/admin/product/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ProductPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ProductPage() {
    _s();
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [isDeleting, setIsDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deleteId, setDeleteId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [notification, setNotification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        show: false,
        message: "",
        type: ""
    });
    const productsPerPage = 9;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Kiểm tra quyền admin
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductPage.useEffect": ()=>{
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");
            if (!token || role !== "admin") {
                router.push("/login");
            }
        }
    }["ProductPage.useEffect"], [
        router
    ]);
    // Lấy danh sách sản phẩm và danh mục
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductPage.useEffect": ()=>{
            fetchProducts();
            fetchCategories();
        }
    }["ProductPage.useEffect"], []);
    const showNotification = (message, type)=>{
        setNotification({
            show: true,
            message,
            type
        });
        setTimeout(()=>{
            setNotification({
                show: false,
                message: "",
                type: ""
            });
        }, 3000);
    };
    const fetchProducts = async ()=>{
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            const res = await fetch("https://api-zeal.onrender.com/api/products", {
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
            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            if (!Array.isArray(data)) {
                throw new Error("Dữ liệu sản phẩm không hợp lệ");
            }
            setProducts(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
            console.error("Lỗi khi tải danh sách sản phẩm:", errorMessage);
            setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
            showNotification("Không thể tải danh sách sản phẩm", "error");
        } finally{
            setLoading(false);
        }
    };
    const fetchCategories = async ()=>{
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
            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            if (!Array.isArray(data)) {
                throw new Error("Dữ liệu danh mục không hợp lệ");
            }
            setCategories(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
            console.error("Lỗi khi tải danh mục:", errorMessage);
            showNotification("Không thể tải danh mục", "error");
        }
    };
    const confirmDelete = (id)=>{
        setDeleteId(id);
        setIsDeleting(true);
    };
    const handleDelete = async ()=>{
        if (!deleteId) return;
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`https://api-zeal.onrender.com/api/products/${deleteId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
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
                throw new Error(`Lỗi HTTP: ${response.status} - ${errorText}`);
            }
            setProducts(products.filter((product)=>product._id !== deleteId));
            setIsDeleting(false);
            setDeleteId(null);
            showNotification("Xóa sản phẩm thành công", "success");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
            console.error("Lỗi khi xóa sản phẩm:", errorMessage);
            showNotification("Đã xảy ra lỗi khi xóa sản phẩm", "error");
        } finally{
            setLoading(false);
        }
    };
    const totalPages = Math.ceil(products.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
}
_s(ProductPage, "sWglhXN55JAl7qHxG5w640GhEUc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ProductPage;
var _c;
__turbopack_context__.k.register(_c, "ProductPage");
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

//# sourceMappingURL=_c4e1d4b5._.js.map