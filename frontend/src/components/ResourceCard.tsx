import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import type { LearningResource } from '../types';

interface ResourceCardProps {
  resource: LearningResource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Advanced':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'Intermediate':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Beginner':
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="border border-border bg-white p-5 rounded flex flex-col justify-between h-full">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(resource.difficulty)}`}>
            {resource.difficulty}
          </span>
          <span className="text-xs text-text">
            {resource.duration}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-primary mb-4 flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <span>{resource.name}</span>
        </h4>
      </div>

      {/* Footer Link Button */}
      <a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-1 py-2 border border-border hover:bg-surface rounded text-xs font-semibold text-primary transition-all"
      >
        <span>Open Resource</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
export default ResourceCard;
