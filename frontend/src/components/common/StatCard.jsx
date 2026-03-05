import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const colorMap = {
  primary: { card: 'stat-teal', icon: 'stat-icon-teal' },
  success: { card: 'stat-success', icon: 'stat-icon-success' },
  warning: { card: 'stat-warning', icon: 'stat-icon-warning' },
  danger: { card: 'stat-danger', icon: 'stat-icon-danger' },
  info: { card: 'stat-blue', icon: 'stat-icon-blue' },
};

const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => {
  const scheme = colorMap[color] || colorMap.primary;
  return (
    <div className={`stat-card ${scheme.card} h-100`}>
      <div className="card-body d-flex align-items-center p-3">
        <div className={`stat-icon ${scheme.icon} me-3`}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="flex-grow-1 min-w-0">
          <div className="stat-title">{title}</div>
          <div className="stat-value">{value}</div>
          {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
