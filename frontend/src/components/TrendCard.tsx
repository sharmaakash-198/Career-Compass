import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { TechTrend } from '../types';

interface TrendCardProps {
  trend: TechTrend;
}

export const TrendCard: React.FC<TrendCardProps> = ({ trend }) => {
  return (
    <div className="flat-card flex flex-col h-full justify-between bg-surface border border-border p-5 rounded">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white border border-border text-text">
            {trend.category}
          </span>
          <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{trend.growth}%</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-primary mb-2">
          {trend.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-text leading-relaxed">
          {trend.description}
        </p>
      </div>
    </div>
  );
};
export default TrendCard;
