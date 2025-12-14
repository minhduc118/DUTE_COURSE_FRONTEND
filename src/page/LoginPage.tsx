import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../style/LoginPage.css";
import { useAuth } from "../context/AuthContext";
import { getGoogleOAuthURL } from "../config/googleOAuth";

export default function LoginPage() {
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { login, loginWithGoogle, loading } = useAuth();
    const navigate = useNavigate();

    // Tự động điền email và password từ RegisterPage
    useEffect(() => {
        const state = location.state as { email?: string; password?: string; message?: string };
        if (state?.email) {
            setEmail(state.email);
        }
        if (state?.password) {
            setPassword(state.password);
        }
        if (state?.message) {
            setSuccessMessage(state.message);
        }
        // Clear state sau khi đã sử dụng
        window.history.replaceState({}, document.title);
    }, [location]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        try {
            await login({ email, password });
            navigate("/");
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        }
    };

    const handleGoogleLogin = () => {
        // Redirect to Google OAuth URL
        window.location.href = getGoogleOAuthURL();
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <Link to="/" className="logo-link">
                            <img src="/logo.jpg" alt="Logo" className="logo-square" />
                            <span className="logo-text">Học Lập Trình Để Đi Làm</span>
                        </Link>
                        <h1 className="login-title">Đăng nhập</h1>
                        <p className="login-subtitle">Chào mừng bạn trở lại!</p>
                    </div>

                    {successMessage && (
                        <div
                            className="alert alert-success text-center mb-4"
                            style={{
                                color: 'green',
                                marginBottom: '1rem',
                                backgroundColor: '#d4edda',
                                padding: '0.75rem',
                                borderRadius: '4px',
                                border: '1px solid #c3e6cb'
                            }}
                        >
                            {successMessage}
                        </div>
                    )}
                    {error && (
                        <div
                            className="alert alert-danger text-center mb-4"
                            style={{ color: 'red', marginBottom: '1rem' }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                placeholder="Nhập mật khẩu của bạn"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-10px' }}>
                            <Link to="/forgot-password" className="forgot-link">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn-login"
                            disabled={loading}
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </form>

                    <div className="divider">
                        <span>HOẶC</span>
                    </div>

                    <button
                        type="button"
                        className="btn-google"
                        onClick={handleGoogleLogin}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4" />
                            <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853" />
                            <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05" />
                            <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335" />
                        </svg>
                        Đăng nhập với Google
                    </button>

                    <p className="register-link">
                        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
