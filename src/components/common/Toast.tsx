import React, { useEffect, useState } from 'react';
import '../../style/Toast.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type,
    duration = 3000,
    onClose
}) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300); // Wait for animation
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return 'bi-check-circle-fill';
            case 'error': return 'bi-x-circle-fill';
            case 'info': return 'bi-info-circle-fill';
            case 'warning': return 'bi-exclamation-triangle-fill';
            default: return 'bi-info-circle-fill';
        }
    };

    return (
        <div className={`toast-item ${type} ${isClosing ? 'closing' : ''}`}>
            <i className={`bi ${getIcon()} toast-icon`}></i>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={handleClose}>
                <i className="bi bi-x"></i>
            </button>
        </div>
    );
};

export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="toast-container">
            {children}
        </div>
    );
};
