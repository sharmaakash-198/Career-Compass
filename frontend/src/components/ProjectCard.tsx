import React, { useState } from 'react';
import { FolderGit2, Clock, CheckSquare, Square, Info, Sparkles } from 'lucide-react';
import type { RecommendedProject } from '../types';

interface ProjectCardProps {
  project: RecommendedProject;
  isCompleted: boolean;
  onToggle: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isCompleted, onToggle }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const defaultDescription = project.description || 
    `Build an end-to-end ${project.name} to demonstrate practical capabilities in ${project.skillsLearned.join(', ')}. Perfect for adding to your technical portfolio.`;

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`group relative w-full border p-4.5 rounded-xl flex flex-col justify-between transition-all duration-300 ${
        isCompleted
          ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
          : 'border-slate-200 bg-white hover:border-primary/40 hover:shadow-md'
      }`}
    >
      <div>
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
              isCompleted ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-primary'
            }`}>
              <FolderGit2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Portfolio Project
            </span>
          </div>

          <button
            onClick={onToggle}
            className="flex items-center gap-1.5 text-xs transition-transform active:scale-95 focus:outline-none select-none"
            aria-label={isCompleted ? "Mark project incomplete" : "Mark project complete"}
          >
            {isCompleted ? (
              <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-100/60 px-2 py-0.5 rounded-md">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Done</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400 group-hover:text-primary font-medium px-2 py-0.5 rounded-md hover:bg-slate-50">
                <Square className="w-4 h-4 text-slate-300 group-hover:text-primary" />
                <span>Mark Done</span>
              </span>
            )}
          </button>
        </div>

        {/* Project Title */}
        <h4 className={`text-sm font-extrabold text-slate-900 mb-2 leading-snug ${
          isCompleted ? 'line-through text-slate-400 font-normal' : ''
        }`}>
          {project.name}
        </h4>

        {/* Skills Learned Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.skillsLearned.map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Hover Hint */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3 mt-1">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Duration: {project.duration}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Info className="w-3 h-3" />
          <span>Hover for details</span>
        </div>
      </div>

      {/* Hover Description Tooltip Overlay */}
      {showTooltip && (
        <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-slate-800 animate-in fade-in duration-150 pointer-events-none">
          <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Project Objective</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {defaultDescription}
          </p>
          <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-800 pt-1.5 flex items-center justify-between">
            <span>Target Duration: {project.duration}</span>
            <span className="text-emerald-400 font-semibold">Portfolio Ready</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
