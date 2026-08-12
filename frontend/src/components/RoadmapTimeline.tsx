import React from 'react';
import { Calendar, Square, CheckCircle2 } from 'lucide-react';
import type { RoadmapItem, RoadmapTopic } from '../types';

interface RoadmapTimelineProps {
  roadmap: RoadmapItem[];
  completedTopics: string[];
  onToggleTopic: (month: string, topic: string) => void;
}

export interface ParsedTopic {
  title: string;
  description?: string;
  category?: string;
  rawString: string;
}

export function parseTopicItem(topicItem: string | RoadmapTopic): ParsedTopic[] {
  let title = '';
  let description = '';
  let category: string | undefined = undefined;
  let rawString = '';

  if (typeof topicItem === 'object' && topicItem !== null) {
    title = topicItem.title;
    description = topicItem.description || '';
    category = topicItem.category && !topicItem.category.toLowerCase().startsWith('line') ? topicItem.category : undefined;
    rawString = description ? `${title}: ${description}` : title;
  } else {
    rawString = String(topicItem);
    if (rawString.includes(':')) {
      const parts = rawString.split(':');
      title = parts[0].trim();
      description = parts.slice(1).join(':').trim();
    } else {
      title = rawString;
    }
  }

  // If description has multiple distinct sentences, split them into separate line cards
  if (description) {
    const sentences = description
      .split(/(?<=\.)\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 5);

    if (sentences.length > 1) {
      return sentences.map((sentence, idx) => {
        let subTitle = title;
        if (sentence.toLowerCase().includes('implement') || sentence.toLowerCase().includes('build')) {
          subTitle = `${title} • Implementation`;
        } else if (sentence.toLowerCase().includes('study') || sentence.toLowerCase().includes('learn') || sentence.toLowerCase().includes('core')) {
          subTitle = `${title} • Core Concepts`;
        } else if (sentence.toLowerCase().includes('use') || sentence.toLowerCase().includes('apply')) {
          subTitle = `${title} • Practical Application`;
        } else {
          subTitle = `${title} (Part ${idx + 1})`;
        }

        return {
          title: subTitle,
          description: sentence,
          category,
          rawString: `${rawString} [Part ${idx + 1}]`,
        };
      });
    }
  }

  return [{
    title,
    description: description || undefined,
    category,
    rawString,
  }];
}

const TRACK_COLORS = [
  {
    border: 'border-l-blue-500',
    nodeBg: 'bg-blue-500',
    ring: 'ring-blue-100',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    hover: 'hover:border-blue-400',
  },
  {
    border: 'border-l-indigo-500',
    nodeBg: 'bg-indigo-500',
    ring: 'ring-indigo-100',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    hover: 'hover:border-indigo-400',
  },
  {
    border: 'border-l-purple-500',
    nodeBg: 'bg-purple-500',
    ring: 'ring-purple-100',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    hover: 'hover:border-purple-400',
  },
  {
    border: 'border-l-teal-500',
    nodeBg: 'bg-teal-500',
    ring: 'ring-teal-100',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    hover: 'hover:border-teal-400',
  },
];

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  roadmap,
  completedTopics,
  onToggleTopic,
}) => {
  return (
    <div className="space-y-8 py-2">
      {roadmap.map((item, monthIdx) => {
        const parsedTopics = item.topics.flatMap(t => parseTopicItem(t));
        const totalTopics = parsedTopics.length;

        const completedInMonth = parsedTopics.filter(pt => {
          return completedTopics.some(
            ct => ct === `${item.month} - ${pt.rawString}` || ct === `${item.month} - ${pt.title}`
          );
        }).length;

        const isMonthCompleted = totalTopics > 0 && completedInMonth === totalTopics;

        return (
          <div key={monthIdx} className="space-y-4">
            {/* Month Milestone Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-white p-3.5 rounded-xl shadow-sm border border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white/10 text-white">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight text-white">
                    {item.month}
                  </h4>
                  <span className="text-[11px] text-slate-300">
                    {totalTopics} Parallel Learning Lines
                  </span>
                </div>
              </div>

              {totalTopics > 0 && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      isMonthCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {completedInMonth}/{totalTopics} Completed
                  </span>
                </div>
              )}
            </div>

            {/* Visual Multi-Line Track Container */}
            <div className="relative pl-6 ml-3 space-y-3.5 border-l-2 border-slate-200">
              {parsedTopics.map((topic, topicIdx) => {
                const isCompleted = completedTopics.some(
                  ct => ct === `${item.month} - ${topic.rawString}` || ct === `${item.month} - ${topic.title}`
                );

                const color = TRACK_COLORS[topicIdx % TRACK_COLORS.length];

                return (
                  <div
                    key={topicIdx}
                    onClick={() => onToggleTopic(item.month, topic.rawString)}
                    className={`relative group flex items-start gap-3.5 p-4 rounded-xl border border-l-4 transition-all duration-200 cursor-pointer select-none ${
                      color.border
                    } ${
                      isCompleted
                        ? 'bg-emerald-50/50 border-emerald-200 shadow-xs'
                        : `bg-white border-slate-200 ${color.hover} shadow-xs hover:shadow-md`
                    }`}
                  >
                    {/* Visual Line Stem Node Indicator */}
                    <div
                      className={`absolute -left-[31px] top-5 w-3.5 h-3.5 rounded-full border-2 border-white transition-all duration-200 ${
                        isCompleted ? 'bg-emerald-600 ring-2 ring-emerald-100 scale-110' : `${color.nodeBg} ring-2 ${color.ring}`
                      }`}
                    />

                    {/* Toggle Checkbox Button */}
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 transition-transform duration-150 active:scale-95 focus:outline-none"
                      aria-label={isCompleted ? `Mark ${topic.title} incomplete` : `Mark ${topic.title} complete`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 group-hover:text-slate-500 shrink-0" />
                      )}
                    </button>

                    {/* Module Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h5
                          className={`text-xs font-bold leading-snug transition-colors ${
                            isCompleted ? 'line-through text-slate-400 font-normal' : 'text-slate-900'
                          }`}
                        >
                          {topic.title}
                        </h5>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {topic.category && (
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${color.badge}`}>
                              {topic.category}
                            </span>
                          )}
                          {isCompleted && (
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Done
                            </span>
                          )}
                        </div>
                      </div>

                      {topic.description && (
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            isCompleted ? 'text-slate-400 line-through' : 'text-slate-600 font-normal'
                          }`}
                        >
                          {topic.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoadmapTimeline;
