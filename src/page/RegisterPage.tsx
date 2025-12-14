import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/LoginPage.css";
import { useAuth } from "../context/AuthContext";
import { sendOtp } from "../api/AuthAPI";
import { getGoogleOAuthURL } from "../config/googleOAuth";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [otpCodeError, setOtpCodeError] = useState("");

    // OTP related states
    const [otpSent, setOtpSent] = useState(false);
    const [otpCountdown, setOtpCountdown] = useState(0);
    const [sendingOTP, setSendingOTP] = useState(false);

    const { register, loginWithGoogle, loading } = useAuth();
    const navigate = useNavigate();

    const validatePassword = (password: string) => {
        if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
        if (!/[A-Z]/.test(password)) return "Mật khẩu phải chứa ít nhất 1 chữ hoa";
        if (!/[a-z]/.test(password)) return "Mật khẩu phải chứa ít nhất 1 chữ thường";
        if (!/[0-9]/.test(password)) return "Mật khẩu phải chứa ít nhất 1 số";
        if (!/[!@#$%^&*]/.test(password)) return "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*)";
        return null;
    };

    // TODO: Implement OTP sending logic
    const handleSendOTP = async () => {
        if (!email) {
            setEmailError("Vui lòng nhập email để nhận mã OTP");
            return;
        }

        setSendingOTP(true);
        setError("");
        setEmailError("");
        setSuccessMessage("");

        try {
            await sendOtp(email);
            setOtpSent(true);
            setOtpCountdown(60);
            setSuccessMessage("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.");

            // Start countdown
            const timer = setInterval(() => {
                setOtpCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (err: any) {
            console.error("Send OTP error:", err);
            setError(err.message || "Gửi mã OTP thất bại. Vui lòng thử lại.");
        } finally {
            setSendingOTP(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setPasswordError("");
        setEmailError("");

        if (!email) {
            setEmailError("Vui lòng nhập email");
            return;
        }

        const validationError = validatePassword(password);
        if (validationError) {
            setPasswordError(validationError);
            return;
        }

        console.log("Register with OTP:", { fullName, email, password, otpCode });

        try {
            await register({ fullName, email, password, otpCode });
            navigate("/login", {
                state: {
                    email,
                    password,
                    message: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục."
                }
            });
        } catch (err: any) {
            console.error("Register error:", err);
            if (err.fieldErrors?.email) {
                setEmailError(err.fieldErrors.email);
            } else if (err.fieldErrors?.otpCode) {
                setOtpCodeError(err.fieldErrors.otpCode);
            } else {
                setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
            }
        }
    };

    const handleGoogleRegister = () => {
        // Redirect to Google OAuth URL
        window.location.href = getGoogleOAuthURL();
    };
    return (
        <div className="login-page" >
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <Link to="/" className="logo-link">
                            <img src="/logo.jpg" alt="Logo" className="logo-square" />
                            <span className="logo-text">Học Lập Trình Để Đi Làm</span>
                        </Link>
                        <h1 className="login-title">Đăng ký tài khoản F8</h1>
                        <p className="login-subtitle">Học tập và kết nối với hàng vạn thành viên khác.</p>
                    </div>

                    {successMessage && (
                        <div className="alert alert-success text-center">
                            {successMessage}
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="login-form">
                        <div className="form-group">
                            <label htmlFor="fullName">Họ và tên</label>
                            <input
                                type="text"
                                id="fullName"
                                className="form-input"
                                placeholder="Họ và tên của bạn"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                placeholder="Địa chỉ email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {emailError && (
                                <small className="text-danger" style={{ color: 'red', marginTop: '5px', display: 'block' }}>
                                    {emailError}
                                </small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            {passwordError && (
                                <small className="text-danger" style={{ color: 'red', marginTop: '5px', display: 'block' }}>
                                    {passwordError}
                                </small>
                            )}
                        </div>

                        {/* OTP Section */}
                        <div className="form-group">
                            <label htmlFor="otpCode">Mã OTP</label>
                            <div className="otp-input-group">
                                <input
                                    type="text"
                                    id="otpCode"
                                    className="form-input"
                                    placeholder="Nhập mã OTP"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn-send-otp"
                                    onClick={handleSendOTP}
                                    disabled={sendingOTP || otpCountdown > 0 || !email}
                                >
                                    {sendingOTP ? "Đang gửi..." :
                                        otpCountdown > 0 ? `Gửi lại (${otpCountdown}s)` :
                                            "Gửi mã OTP"}
                                </button>
                            </div>
                            {otpSent && (
                                <small className="text-success">
                                    ✓ Mã OTP đã được gửi đến email của bạn
                                </small>
                            )}
                            {otpCodeError && (
                                <small className="text-danger">
                                    {otpCodeError}
                                </small>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn-login"
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Đăng ký"}
                        </button>
                    </form>

                    <div className="divider">
                        <span>Hoặc tiếp tục với</span>
                    </div>

                    <button
                        type="button"
                        className="btn-google"
                        onClick={handleGoogleRegister}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4" />
                            <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853" />
                            <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05" />
                            <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335" />
                        </svg>
                        Đăng ký với Google
                    </button>

                    <p className="register-link">
                        Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div >
    );
}
