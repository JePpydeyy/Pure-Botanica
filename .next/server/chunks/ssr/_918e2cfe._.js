module.exports = {

"[project]/src/app/user/register/Register.module.css [app-ssr] (css module)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v({
  "container": "Register-module__U-8c3a__container",
  "divider": "Register-module__U-8c3a__divider",
  "dividerLine": "Register-module__U-8c3a__dividerLine",
  "dividerText": "Register-module__U-8c3a__dividerText",
  "errorMessage": "Register-module__U-8c3a__errorMessage",
  "fadeIn": "Register-module__U-8c3a__fadeIn",
  "forgotPassword": "Register-module__U-8c3a__forgotPassword",
  "forgotPasswordLink": "Register-module__U-8c3a__forgotPasswordLink",
  "formBox": "Register-module__U-8c3a__formBox",
  "googleBtn": "Register-module__U-8c3a__googleBtn",
  "input": "Register-module__U-8c3a__input",
  "mainContent": "Register-module__U-8c3a__mainContent",
  "policy": "Register-module__U-8c3a__policy",
  "policyCheckbox": "Register-module__U-8c3a__policyCheckbox",
  "policyLabel": "Register-module__U-8c3a__policyLabel",
  "policyLink": "Register-module__U-8c3a__policyLink",
  "small": "Register-module__U-8c3a__small",
  "submitBtn": "Register-module__U-8c3a__submitBtn",
  "switchForm": "Register-module__U-8c3a__switchForm",
  "switchFormLink": "Register-module__U-8c3a__switchFormLink",
  "title": "Register-module__U-8c3a__title",
});
}}),
"[project]/src/app/user/register/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>RegisterPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/user/register/Register.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
function RegisterPage() {
    const [username, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp");
            return;
        }
        try {
            const res = await fetch("https://api-zeal.onrender.com/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    phone,
                    password
                })
            });
            const data = await res.json();
            console.log("Register API Response:", data);
            if (!res.ok) {
                setError(data.message || "Đăng ký thất bại");
                return;
            }
            // Lưu thông tin người dùng
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("email", data.user.email);
            // Điều hướng theo role
            if (data.user.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/user");
            }
        } catch (err) {
            console.error("Lỗi đăng ký:", err);
            setError(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mainContent,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formBox,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].title,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: "ĐĂNG KÝ"
                        }, void 0, false, {
                            fileName: "[project]/src/app/user/register/page.tsx",
                            lineNumber: 62,
                            columnNumber: 50
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/user/register/page.tsx",
                        lineNumber: 62,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].googleBtn,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/icons8-google-48.png",
                                alt: "Google Logo"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 65,
                                columnNumber: 25
                            }, this),
                            " Đăng ký với Google"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/register/page.tsx",
                        lineNumber: 64,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].divider,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dividerLine
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 69,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dividerText,
                                children: "Hoặc đăng ký bằng tài khoản"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 70,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dividerLine
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 71,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/register/page.tsx",
                        lineNumber: 68,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Họ và tên",
                                value: username,
                                onChange: (e)=>setName(e.target.value),
                                required: true,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 75,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].small,
                                children: "Vui lòng nhập họ và tên đầy đủ"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 83,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "email",
                                placeholder: "Email",
                                value: email,
                                onChange: (e)=>setEmail(e.target.value),
                                required: true,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 84,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].small,
                                children: "Ví dụ: example@domain.com"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 92,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "tel",
                                placeholder: "Số điện thoại",
                                value: phone,
                                onChange: (e)=>setPhone(e.target.value),
                                required: true,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 93,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].small,
                                children: "Ví dụ: 0123456789"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 101,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                placeholder: "Mật khẩu",
                                value: password,
                                onChange: (e)=>setPassword(e.target.value),
                                required: true,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 102,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].small,
                                children: "Mật khẩu phải có ít nhất 6 ký tự"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 110,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                placeholder: "Nhập lại mật khẩu",
                                value: confirmPassword,
                                onChange: (e)=>setConfirmPassword(e.target.value),
                                required: true,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 111,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].small,
                                children: "Vui lòng nhập lại mật khẩu giống trên"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 119,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].policy,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].policyLabel,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            required: true,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].policyCheckbox
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/user/register/page.tsx",
                                            lineNumber: 123,
                                            columnNumber: 33
                                        }, this),
                                        "Tôi đồng ý với ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "/policy",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].policyLink,
                                            children: "chính sách"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/user/register/page.tsx",
                                            lineNumber: 124,
                                            columnNumber: 48
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/user/register/page.tsx",
                                    lineNumber: 122,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 121,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].submitBtn,
                                children: "ĐĂNG KÝ"
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 128,
                                columnNumber: 25
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].errorMessage,
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 129,
                                columnNumber: 35
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].forgotPassword,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/forgot-password",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].forgotPasswordLink,
                                    children: "Quên mật khẩu?"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/user/register/page.tsx",
                                    lineNumber: 132,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 131,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].switchForm,
                                children: [
                                    "Đã có tài khoản? ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/user/login",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2f$register$2f$Register$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].switchFormLink,
                                        children: "Đăng nhập"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/user/register/page.tsx",
                                        lineNumber: 136,
                                        columnNumber: 46
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/user/register/page.tsx",
                                lineNumber: 135,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/user/register/page.tsx",
                        lineNumber: 74,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/user/register/page.tsx",
                lineNumber: 61,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/user/register/page.tsx",
            lineNumber: 60,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/user/register/page.tsx",
        lineNumber: 59,
        columnNumber: 9
    }, this);
}
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}}),
"[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-ssr] (ecmascript)");
}}),

};

//# sourceMappingURL=_918e2cfe._.js.map