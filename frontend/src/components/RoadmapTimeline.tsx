import React from 'react';
import { Calendar, CheckSquare, Square } from 'lucide-react';
import type { RoadmapItem } from '../types';

interface RoadmapTimelineProps {
  roadmap: RoadmapItem[];
  completedTopics: string[];
  onToggleTopic: (month: string, topic: string) => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  roadmap,
  completedTopics,
  onToggleTopic,
}) => {
  return (
    <div className="relative border-l border-border pl-6 ml-3 space-y-4 pb-1">
      {roadmap.map((item, index) => {
        // Calculate completion percentage for this month
        const totalTopics = item.topics.length;
        const completedInMonth = item.topics.filter(topic =>
          completedTopics.includes(`${item.month} - ${topic}`)
        ).length;
        const isMonthCompleted = totalTopics > 0 && completedInMonth === totalTopics;

        return (
          <div key={index} className="relative last:mb-0">
            {/* Node Icon Indicator */}
            <div
              className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white transition-colors duration-200 ${
                isMonthCompleted ? 'bg-emerald-600' : 'bg-primary'
              }`}
            />

            {/* Card Body */}
            <div className="flat-card bg-surface border border-border p-4 rounded-lg">
              <div className="flex items-center justify-between gap-1.5 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-text" />
                  <h4 className="text-sm font-bold text-primary leading-tight">
                    {item.month}
                  </h4>
                </div>
                {totalTopics > 0 && (
                  <span className="text-[10px] font-bold text-text uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                    {completedInMonth}/{totalTopics} Done
                  </span>
                )}
              </div>

              {/* Topics list */}
              <ul className="space-y-1.5">
                {item.topics.map((topic, tIdx) => {
                  const topicKey = `${item.month} - ${topic}`;
                  const isCompleted = completedTopics.includes(topicKey);

                  return (
                    <li
                      key={tIdx}
                      onClick={() => onToggleTopic(item.month, topic)}
                      className="flex items-center gap-2 text-xs text-text leading-snug cursor-pointer group select-none"
                    >
                      <button
                        type="button"
                        className="shrink-0 text-text group-hover:text-primary transition-colors focus:outline-none"
                        aria-label={isCompleted ? `Mark ${topic} incomplete` : `Mark ${topic} complete`}
                      >
                        {isCompleted ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                        )}
                      </button>
                      <span
                        className={`transition-all duration-200 ${
                          isCompleted
                            ? 'line-through text-slate-400 font-normal'
                            : 'text-text font-medium group-hover:text-primary'
                        }`}
                      >
                        {topic}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default RoadmapTimeline;
