import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/LoginPage.css";

export default function GoogleCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithGoogle } = useAuth();
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(true);
    const hasCalledApi = useRef(false); // Flag to prevent multiple calls

    useEffect(() => {
        const handleGoogleCallback = async () => {
            // Prevent multiple calls
            if (hasCalledApi.current) return;
            hasCalledApi.current = true;

            // Get authorization code from URL
            const code = searchParams.get("code");
            console.log("Authorization code:", code);
            const errorParam = searchParams.get("error");

            // Handle error from Google
            if (errorParam) {
                setError("Đăng nhập Google bị hủy hoặc thất bại");
                // setProcessing(false);
                setTimeout(() => navigate("/login"), 3000);
                return;
            }

            // Check if code exists
            if (!code) {
                setError("Không tìm thấy mã xác thực từ Google");
                // setProcessing(false);
                setTimeout(() => navigate("/login"), 3000);
                return;
            }

            try {
                // Call loginWithGoogle with authorization code
                console.log("Calling loginWithGoogle with code:", code);
                await loginWithGoogle(code);

                // Redirect to home page on success
                navigate("/");
            } catch (err: any) {
                console.error("Google login error:", err);
                setError(err.message || "Đăng nhập Google thất bại. Vui lòng thử lại.");
                // setProcessing(false);
                setTimeout(() => navigate("/login"), 3000);
            }
        };

        handleGoogleCallback();
    }, [searchParams, navigate, loginWithGoogle]); // Include all dependencies

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="logo-square">F8</div>
                        <h1 className="login-title">
                            {processing ? "Đang xử lý..." : "Đăng nhập Google"}
                        </h1>
                    </div>

                    {processing && (
                        <div className="text-center" style={{ padding: "20px" }}>
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p style={{ marginTop: "15px", color: "#666" }}>
                                Đang xác thực với Google...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger text-center">
                            {error}
                            <p style={{ marginTop: "10px", fontSize: "14px" }}>
                                Đang chuyển hướng về trang đăng nhập...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 