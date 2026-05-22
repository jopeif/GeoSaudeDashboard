import React from 'react';

import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';

import "./KPICard.css";

interface KPICardProps {
  label: string;
  value: string | number;
  featured?: boolean;
  isNegative?: boolean;
  isLoading?: boolean;
  tooltip?: string;
  tooltipSide?: 'left' | 'right';
}

export const KPICard:
React.FC<KPICardProps> = ({
  label,
  value,
  featured,
  isNegative,
  isLoading,
  tooltip,
  tooltipSide = 'right'
}) => {

  if (isLoading) {
    return (
      <div
        className="kpi-card skeleton"
        style={{
          height: '118px',
          border: 'none'
        }}
      />
    );
  }

  return (
    <div
      className={`kpi-card ${
        featured
          ? 'featured'
          : ''
      }`}
    >

      {tooltip && (
        <div
          className={`kpi-tooltip-wrapper ${tooltipSide}`}
        >
          <InfoTooltip
            text={tooltip}
          />
        </div>
      )}

      <div className="kpi-card-header">

        <span className="kpi-label">
          {label}
        </span>

      </div>

      <span
        className={`kpi-value ${
          isNegative
            ? 'text-error'
            : ''
        }`}
      >
        {value}
      </span>

    </div>
  );
};