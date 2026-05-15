import React from 'react';
import "./KPICard.css"

interface KPICardProps {
    label: string;
    value: string | number;
    featured?: boolean;
    isNegative?: boolean;
    isLoading?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({ label, value, featured, isNegative, isLoading }) => {
    if (isLoading) {
        return <div className="kpi-card skeleton" style={{ height: '118px', border: 'none' }}></div>;
    }

    return (
        <div className={`kpi-card ${featured ? 'featured' : ''}`}>
        <span className="kpi-label">{label}</span>
        <span className={`kpi-value ${isNegative ? 'text-error' : ''}`}>
            {value}
        </span>
        </div>
    );
};