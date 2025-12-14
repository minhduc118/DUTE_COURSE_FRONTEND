import React from 'react';
import '../../style/Footer.css';

export const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-bottom">
                <div className="social-icons">
                    <a href="#" className="social-icon"><i className="bi bi-facebook"></i></a>
                    <a href="#" className="social-icon"><i className="bi bi-youtube"></i></a>
                    <a href="#" className="social-icon"><i className="bi bi-tiktok"></i></a>
                </div>
                <p className="copyright">© 2018 - 2025 F8. Nền tảng học lập trình hàng đầu Việt Nam</p>
            </div>
        </footer>
    );
};
