import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';
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
        <p className="text-xs text-text leading-relaxed mb-4">
          {trend.description}
        </p>
      </div>

      {/* Sparkline Visualisation */}
      <div className="h-10 w-full opacity-80 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend.history}>
            <YAxis domain={['dataMin', 'dataMax']} hide />
            <Line
              type="monotone"
              dataKey="growth"
              stroke="#0f172a"
              strokeWidth={1.5}
              dot={false}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default TrendCard;
