import React from 'react';
import { FolderGit2, Clock, CheckSquare, Square } from 'lucide-react';
import type { RecommendedProject } from '../types';

interface ProjectCardProps {
  project: RecommendedProject;
  isCompleted: boolean;
  onToggle: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isCompleted, onToggle }) => {
  return (
    <div className={`w-full border p-5 rounded flex flex-col justify-between h-full transition-all ${
      isCompleted ? 'border-emerald-500 bg-emerald-50/10' : 'border-border bg-white'
    }`}>
      <div>
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded border border-border flex items-center justify-center text-primary">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <button
            onClick={onToggle}
            className="flex items-center gap-1.5 text-xs text-text hover:text-primary transition-colors focus:outline-none select-none"
            aria-label={isCompleted ? "Mark project incomplete" : "Mark project complete"}
          >
            {isCompleted ? (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Completed</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400 font-medium">
                <Square className="w-4 h-4 text-slate-300" />
                <span>Mark Done</span>
              </span>
            )}
          </button>
        </div>

        {/* Title */}
        <h4 className={`text-sm font-bold text-primary mb-2 ${isCompleted ? 'line-through text-slate-400 font-normal' : ''}`}>
          {project.name}
        </h4>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.skillsLearned.map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface border border-border text-text"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Duration Footer */}
      <div className="flex items-center gap-1.5 text-xs text-text border-t border-border pt-3 mt-2">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span>Duration: {project.duration}</span>
      </div>
    </div>
  );
};
export default ProjectCard;
