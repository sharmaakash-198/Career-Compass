import React from 'react';
import { Building2, TrendingUp, Briefcase } from 'lucide-react';
import type { TrendingSkillInsight } from '../types';

interface TrendingSkillInsightCardProps {
  insight: TrendingSkillInsight;
}

export const TrendingSkillInsightCard: React.FC<TrendingSkillInsightCardProps> = ({ insight }) => {
  return (
    <div className="flat-card flex flex-col h-full bg-surface border border-border p-5 rounded">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-border text-text">
          <Briefcase className="w-3 h-3" />
          {insight.roleName}
        </span>
        <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+{insight.growth}%</span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-primary mb-4">{insight.skill}</h3>

      <div className="mt-auto">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-text mb-2">
          <Building2 className="w-3.5 h-3.5" />
          Top companies hiring
        </div>
        <div className="flex flex-wrap gap-1.5">
          {insight.topCompanies.map((company) => (
            <span
              key={company}
              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-border text-primary"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSkillInsightCard;
