import React from 'react';
import { BookOpen, ExternalLink, CheckSquare, Square } from 'lucide-react';
import type { LearningResource } from '../types';

interface ResourceCardProps {
  resource: LearningResource;
  isCompleted: boolean;
  onToggle: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, isCompleted, onToggle }) => {
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
    <div className={`w-full border p-5 rounded flex flex-col justify-between h-full transition-all ${
      isCompleted ? 'border-emerald-500 bg-emerald-50/10' : 'border-border bg-white'
    }`}>
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(resource.difficulty)}`}>
            {resource.difficulty}
          </span>
          <button
            onClick={onToggle}
            className="flex items-center gap-1.5 text-xs text-text hover:text-primary transition-colors focus:outline-none select-none"
            aria-label={isCompleted ? "Mark resource unread" : "Mark resource read"}
          >
            {isCompleted ? (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckSquare className="w-4.5 h-4.5 text-emerald-600" />
                <span>Read</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400 font-medium">
                <Square className="w-4.5 h-4.5 text-slate-300" />
                <span>Mark Read</span>
              </span>
            )}
          </button>
        </div>

        {/* Title */}
        <h4 className={`text-sm font-bold text-primary mb-4 flex items-start gap-2 ${
          isCompleted ? 'line-through text-slate-400 font-normal' : ''
        }`}>
          <BookOpen className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <span>{resource.name}</span>
        </h4>
      </div>

      {/* Footer Link Button */}
      <div className="flex items-center justify-between gap-2 border-t border-border pt-3 mt-2">
        <span className="text-xs text-text">{resource.duration}</span>
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-border hover:bg-surface rounded text-xs font-semibold text-primary transition-all"
        >
          <span>Open Resource</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
export default ResourceCard;
