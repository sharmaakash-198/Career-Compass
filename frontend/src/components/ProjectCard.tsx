import React from 'react';
import { FolderGit2, Clock } from 'lucide-react';
import type { RecommendedProject } from '../types';

interface ProjectCardProps {
  project: RecommendedProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="border border-border bg-white p-5 rounded flex flex-col justify-between h-full">
      <div>
        {/* Header Icon */}
        <div className="w-8 h-8 rounded border border-border flex items-center justify-center text-primary mb-3">
          <FolderGit2 className="w-4 h-4" />
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-primary mb-2">{project.name}</h4>

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
