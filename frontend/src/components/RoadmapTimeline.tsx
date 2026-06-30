import React from 'react';
import { Calendar } from 'lucide-react';
import type { RoadmapItem } from '../types';

interface RoadmapTimelineProps {
  roadmap: RoadmapItem[];
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ roadmap }) => {
  return (
    <div className="relative border-l border-border pl-4 ml-1 space-y-2 pb-0">
      {roadmap.map((item, index) => (
        <div key={index} className="relative last:mb-0">
          {/* Node Icon Indicator */}
          <div className="absolute -left-[23px] top-1 w-[9px] h-[9px] rounded-full bg-primary border-2 border-white" />

          {/* Card Body */}
          <div className="flat-card bg-surface border border-border p-3 rounded">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-text" />
              <h4 className="text-sm font-bold text-primary leading-tight">
                {item.month}
              </h4>
            </div>

            {/* Topics list */}
            <ul className="space-y-0.5">
              {item.topics.map((topic, tIdx) => (
                <li key={tIdx} className="flex items-center gap-1.5 text-xs text-text leading-snug">
                  <div className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
export default RoadmapTimeline;
