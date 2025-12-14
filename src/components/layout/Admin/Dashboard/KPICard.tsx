import React from 'react';
import '../../../../style/Dashboard.css';

interface KPICardProps {
    title: string;
    value: string | number;
    change: number;
    icon: string;
    color: 'primary' | 'success' | 'warning' | 'info';
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, color }) => {
    const isPositive = change >= 0;

    return (
        <div className={`kpi-card kpi-card-${color}`}>
            <div className="kpi-icon">
                <i className={`bi ${icon}`}></i>
            </div>
            <div className="kpi-content">
                <h6 className="kpi-title">{title}</h6>
                <h3 className="kpi-value">{value}</h3>
                <div className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
                    <i className={`bi ${isPositive ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
                    <span>{Math.abs(change)}% so với tháng trước</span>
                </div>
            </div>
        </div>
    );
};
