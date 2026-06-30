import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendCard } from '../components/TrendCard';
import { TECH_TRENDS } from '../data/trends';
import { BarChart3, Layers } from 'lucide-react';

type CategoryType = 'All' | 'Languages' | 'Frameworks' | 'Tools' | 'AI & Data';

export const Trends: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');

  const categories: CategoryType[] = ['All', 'Languages', 'Frameworks', 'Tools', 'AI & Data'];

  // Filter trends based on selected category
  const filteredTrends = selectedCategory === 'All'
    ? TECH_TRENDS
    : TECH_TRENDS.filter(t => t.category === selectedCategory);

  // Format historical data points for the main chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const chartData = months.map(month => {
    const dataPoint: Record<string, any> = { name: month };
    filteredTrends.forEach(trend => {
      const historyPoint = trend.history.find(h => h.name === month);
      dataPoint[trend.name] = historyPoint ? historyPoint.growth : 0;
    });
    return dataPoint;
  });

  // Solid, clean colors for lines on the chart
  const lineColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="border-b border-border pb-6 mb-8">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface border border-border text-xs font-semibold text-primary mb-3 w-fit">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Market Analytics</span>
        </div>
        <h2 className="text-2xl font-bold text-primary">Technology Trends Explorer</h2>
        <p className="text-xs text-text mt-1">
          Compare growth rates and adoption curves across programming languages, tools, frameworks, and artificial intelligence models.
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-surface p-1 rounded border border-border w-fit">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${selectedCategory === cat
                ? 'bg-primary text-white'
                : 'text-text hover:text-primary hover:bg-white'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Aggregated Area Chart Widget */}
      <div className="border border-border bg-white p-5 rounded mb-8">
        <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-1.5">
          <Layers className="w-4.5 h-4.5 text-primary" />
          Cumulative Growth Trajectory (H1 2026)
        </h3>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {filteredTrends.map((trend, idx) => (
                  <linearGradient key={trend.name} id={`color_${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={lineColors[idx % lineColors.length]} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={lineColors[idx % lineColors.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(val) => `+${val}%`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  borderRadius: '4px',
                  boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
                  color: '#0f172a'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="square"
                iconSize={8}
                wrapperStyle={{ fontSize: '10px', color: '#64748b', paddingTop: '10px' }}
              />
              {filteredTrends.slice(0, 6).map((trend, idx) => (
                <Area
                  key={trend.name}
                  type="monotone"
                  dataKey={trend.name}
                  stroke={lineColors[idx % lineColors.length]}
                  fillOpacity={1}
                  fill={`url(#color_${idx})`}
                  strokeWidth={1.5}
                  name={trend.name}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid List of TrendCards */}
      <div>
        <h3 className="text-base font-bold text-primary mb-4">Technology Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrends.map(trend => (
            <TrendCard key={trend.name} trend={trend} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Trends;
