import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { SkillGap } from '../types';

interface SkillGapCardProps {
  skill: SkillGap;
}

export const SkillGapCard: React.FC<SkillGapCardProps> = ({ skill }) => {
  const getPriorityStyles = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return {
          border: 'border-red-200 bg-red-50 text-red-700',
          badge: 'bg-red-100 text-red-800',
          icon: AlertCircle
        };
      case 'Medium':
        return {
          border: 'border-amber-200 bg-amber-50 text-amber-700',
          badge: 'bg-amber-100 text-amber-800',
          icon: AlertTriangle
        };
      case 'Low':
      default:
        return {
          border: 'border-emerald-200 bg-emerald-50 text-emerald-700',
          badge: 'bg-emerald-100 text-emerald-800',
          icon: Info
        };
    }
  };

  const styles = getPriorityStyles(skill.priority);
  const Icon = styles.icon;

  return (
    <div className={`flex items-center justify-between p-4 rounded border ${styles.border}`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="font-semibold text-sm">{skill.name}</span>
      </div>
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${styles.badge}`}>
        {skill.priority}
      </span>
    </div>
  );
};
export default SkillGapCard;
