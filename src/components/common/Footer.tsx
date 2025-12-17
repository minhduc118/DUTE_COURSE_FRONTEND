import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/Footer.css';

export const Footer: React.FC = () => {
    const [email, setEmail] = useState('');

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement newsletter subscription
        console.log('Newsletter email:', email);
        setEmail('');
    };

    return (
        <footer className="footer-dark">
            {/* Decorative Background Gradients */}
            <div className="footer-decorations">
                <div className="footer-gradient footer-gradient-1"></div>
                <div className="footer-gradient footer-gradient-2"></div>
            </div>

            <div className="footer-content">
                {/* Main Footer Grid */}
                <div className="footer-grid">

                    {/* Column 1: Brand & Newsletter */}
                    <div className="footer-column">
                        <div className="footer-brand">
                            <div className="footer-logo-box">
                                <i className="bi bi-code-slash"></i>
                            </div>
                            <span className="footer-brand-text">LAB211</span>
                        </div>

                        <p className="footer-desc">
                            Nền tảng học lập trình thực hành, giúp bạn sẵn sàng đi làm với các dự án thực tế và lộ trình bài bản.
                        </p>

                        {/* Newsletter Form */}
                        <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
                            <label htmlFor="footer-email" className="visually-hidden">Đăng ký nhận tin</label>
                            <div className="newsletter-group">
                                <input
                                    type="email"
                                    id="footer-email"
                                    className="newsletter-input-field"
                                    placeholder="Email của bạn..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="newsletter-submit-btn" aria-label="Đăng ký">
                                    <i className="bi bi-arrow-right"></i>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="footer-column footer-column-links">
                        <h3 className="footer-heading">Liên kết nhanh</h3>
                        <ul className="footer-list">
                            <li>
                                <Link to="/" className="footer-list-link">
                                    <span className="footer-list-dot"></span>
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-courses" className="footer-list-link">
                                    <span className="footer-list-dot"></span>
                                    Khóa học
                                </Link>
                            </li>
                            <li>
                                <Link to="/roadmap" className="footer-list-link">
                                    <span className="footer-list-dot"></span>
                                    Lộ trình
                                </Link>
                            </li>
                            <li>
                                <Link to="/articles" className="footer-list-link">
                                    <span className="footer-list-dot"></span>
                                    Bài viết
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Hỗ trợ</h3>
                        <ul className="footer-list">
                            <li>
                                <a href="mailto:support@lab211.com" className="footer-list-link footer-email-link">
                                    <i className="bi bi-envelope"></i>
                                    support@lab211.com
                                </a>
                            </li>
                            <li>
                                <Link to="/privacy" className="footer-list-link">Chính sách bảo mật</Link>
                            </li>
                            <li>
                                <Link to="/terms" className="footer-list-link">Điều khoản sử dụng</Link>
                            </li>
                            <li>
                                <Link to="/faq" className="footer-list-link">Câu hỏi thường gặp</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Social Media */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Kết nối</h3>
                        <p className="footer-social-desc">
                            Theo dõi chúng tôi trên mạng xã hội để cập nhật tin tức mới nhất.
                        </p>
                        <div className="footer-social-grid">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-btn footer-social-facebook"
                                aria-label="Facebook"
                            >
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-btn footer-social-youtube"
                                aria-label="YouTube"
                            >
                                <i className="bi bi-youtube"></i>
                            </a>
                            <a
                                href="https://tiktok.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-btn footer-social-tiktok"
                                aria-label="TikTok"
                            >
                                <i className="bi bi-tiktok"></i>
                            </a>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="footer-bar">
                    <p className="footer-copy">
                        © 2018 – 2025 <span className="footer-highlight">LAB211</span>. Nền tảng học lập trình hàng đầu Việt Nam.
                    </p>
                    <div className="footer-credit-text">
                        <span>Design by</span>
                        <span className="footer-credit-team">LAB211 Team</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
