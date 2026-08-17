import React from 'react';
import { CheckCircle2, Loader2, Sparkles, Target, Cpu, Map, FolderGit2 } from 'lucide-react';

interface ProgressiveTrackerProps {
  currentStep?: number;
  stepMessage?: string;
  status: 'QUEUED' | 'RUNNING' | 'DONE' | 'FAILED';
  targetRoleName: string;
}

interface StepInfo {
  number: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PIPELINE_STEPS: StepInfo[] = [
  {
    number: 1,
    title: 'Profile Skill Extraction',
    subtitle: 'Indexing extracted resume skills and user tags',
    icon: Cpu,
  },
  {
    number: 2,
    title: 'Market Gap & Alignment Analysis',
    subtitle: 'Matching current skillset against industry standards',
    icon: Target,
  },
  {
    number: 3,
    title: 'Multi-Track Roadmap Synthesis',
    subtitle: 'Building granular monthly milestones and topic lines',
    icon: Map,
  },
  {
    number: 4,
    title: 'Resource & Project Curation',
    subtitle: 'Pairing high-impact portfolio projects & curated guides',
    icon: FolderGit2,
  },
];

export const ProgressiveTracker: React.FC<ProgressiveTrackerProps> = ({
  currentStep = 1,
  stepMessage,
  status,
  targetRoleName,
}) => {
  const activeStepNum = Math.min(Math.max(currentStep, 1), 4);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header Banner */}
      <div className="border border-border bg-gradient-to-br from-surface to-white rounded-lg p-6 mb-8 text-center shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>AI Pipeline Active</span>
        </div>
        <h2 className="text-2xl font-bold text-primary mb-1">
          Generating Career Intelligence Plan
        </h2>
        <p className="text-xs text-muted max-w-md mx-auto">
          Tailoring market alignment metrics, learning roadmaps, and projects for <span className="font-semibold text-primary">{targetRoleName}</span>.
        </p>

        {stepMessage && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded border border-border bg-white text-xs font-medium text-primary shadow-2xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
            <span>{stepMessage}</span>
          </div>
        )}
      </div>

      {/* Step Pipeline */}
      <div className="space-y-4">
        {PIPELINE_STEPS.map((step) => {
          const Icon = step.icon;
          const isDone = step.number < activeStepNum || status === 'DONE';
          const isCurrent = step.number === activeStepNum && status !== 'DONE';

          return (
            <div
              key={step.number}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                  : isCurrent
                  ? 'bg-white border-primary shadow-md scale-[1.01]'
                  : 'bg-surface/50 border-border opacity-60'
              }`}
            >
              {/* Step Status Badge */}
              <div className="shrink-0">
                {isDone ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md animate-pulse">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full border border-border bg-surface text-muted flex items-center justify-center font-bold text-xs">
                    {step.number}
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon
                    className={`w-4 h-4 ${
                      isDone
                        ? 'text-emerald-600'
                        : isCurrent
                        ? 'text-primary'
                        : 'text-muted'
                    }`}
                  />
                  <h3 className="text-sm font-bold text-primary truncate">
                    {step.title}
                  </h3>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-primary border border-border">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-0.5 truncate">{step.subtitle}</p>
              </div>

              {/* Progress Line */}
              <div className="hidden sm:block text-right">
                <span
                  className={`text-[11px] font-semibold ${
                    isDone
                      ? 'text-emerald-700'
                      : isCurrent
                      ? 'text-primary'
                      : 'text-muted'
                  }`}
                >
                  {isDone ? 'Completed' : isCurrent ? 'Processing...' : 'Queued'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ProgressiveTracker;
