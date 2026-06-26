import React from 'react';
import { Calendar } from 'lucide-react';
import type { RoadmapItem } from '../types';

interface RoadmapTimelineProps {
  roadmap: RoadmapItem[];
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ roadmap }) => {
  return (
    <div className="relative border-l border-border pl-6 ml-2 space-y-6">
      {roadmap.map((item, index) => (
        <div key={index} className="relative">
          {/* Node Icon Indicator */}
          <div className="absolute -left-[31px] top-1.5 w-[11px] h-[11px] rounded-full bg-primary border-2 border-white" />

          {/* Card Body */}
          <div className="flat-card bg-surface border border-border p-5 rounded">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-text" />
              <h4 className="text-sm font-bold text-primary">
                {item.month}
              </h4>
            </div>

            {/* Topics list */}
            <ul className="space-y-2">
              {item.topics.map((topic, tIdx) => (
                <li key={tIdx} className="flex items-center gap-2 text-xs text-text">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
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
