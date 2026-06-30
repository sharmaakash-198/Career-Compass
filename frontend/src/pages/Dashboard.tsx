import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, RotateCcw, Target, ShieldCheck, Trophy } from 'lucide-react';
import { SkillGapCard } from '../components/SkillGapCard';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import { ProjectCard } from '../components/ProjectCard';
import { ResourceCard } from '../components/ResourceCard';
import type { AnalysisResult, AssessmentData } from '../types';
import { CAREER_ROLES } from '../data/roles';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [assessmentInput, setAssessmentInput] = useState<AssessmentData | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const rawInput = localStorage.getItem('cc_assessment_input');
    const rawResult = localStorage.getItem('cc_assessment_result');

    if (rawInput && rawResult) {
      setAssessmentInput(JSON.parse(rawInput));
      setResult(JSON.parse(rawResult));
    }
  }, []);

  const handleRetake = () => {
    localStorage.removeItem('cc_assessment_input');
    localStorage.removeItem('cc_assessment_result');
    navigate('/assess');
    window.location.reload();
  };

  if (!assessmentInput || !result) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="w-12 h-12 rounded border border-border bg-surface flex items-center justify-center mx-auto mb-4 text-primary">
          <Target className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-primary mb-2">No Assessment Found</h2>
        <p className="text-xs text-text mb-6">Run a skills assessment before accessing the dashboard analytics.</p>
        <Link
          to="/assess"
          className="inline-flex items-center px-4 py-2 bg-primary text-white text-xs font-semibold rounded hover:bg-slate-800 transition-colors"
        >
          Take Assessment
        </Link>
      </div>
    );
  }

  const targetRoleName = CAREER_ROLES.find(r => r.id === assessmentInput.targetRole)?.name || 'Custom Role';

  // Circular Match Progress calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.marketFitScore / 100) * circumference;

  const getScoreClassification = (score: number) => {
    if (score >= 80) return { label: 'High Alignment', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 50) return { label: 'Moderate Fit', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Gaps Identified', color: 'text-red-700 bg-red-50 border-red-200' };
  };

  const classification = getScoreClassification(result.marketFitScore);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Profile Dashboard */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-1 text-[10px] text-text uppercase tracking-wider font-semibold mb-1">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-primary font-bold">Analysis Profile</span>
          </div>
          <h2 className="text-2xl font-bold text-primary">
            Path to {targetRoleName}
          </h2>
          <p className="text-xs text-text mt-0.5">
            Upskilling requirements from <span className="font-semibold">{assessmentInput.currentRole}</span>
          </p>
        </div>

        <button
          onClick={handleRetake}
          id="dashboard-retake-btn"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border hover:bg-surface text-xs font-bold text-primary rounded transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retake Assessment
        </button>
      </div>

      {/* Main Widgets */}
      <div className="flex flex-col gap-6 mb-8">
        {/* Market Fit Score Circular widget */}
        <div className="border border-border bg-white p-6 rounded flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-1.5">
            <Trophy className="w-4.5 h-4.5 text-amber-500" />
            Market Fit Score
          </h3>

          {/* SVG Circular Progress bar */}
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-border fill-transparent"
                strokeWidth="8"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-primary fill-transparent"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="square"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">
                {result.marketFitScore}%
              </span>
              <span className="text-[9px] text-text font-bold uppercase tracking-wider">Match</span>
            </div>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${classification.color}`}>
            {classification.label}
          </span>
        </div>

        {/* Missing Skills Widget */}
        <div className="border border-border bg-white p-6 rounded flex flex-col justify-between min-h-[360px]">
          <div>
            <h3 className="text-sm font-bold text-primary mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-primary" />
              Skill Gap Breakdown
            </h3>
            <p className="text-[11px] text-text mb-4">Core skills missing from your profile, marked by prioritization index.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-h-[280px] max-h-[320px] overflow-y-auto pr-1">
            {result.missingSkills.map((skill, index) => (
              <SkillGapCard key={index} skill={skill} />
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap & Suggestions splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Timeline (left 2 cols) */}
        <div className="lg:col-span-2 w-full">
          <div className="border-b border-border pb-2 mb-2">
            <h3 className="text-lg font-bold text-primary">Personalized Study Roadmap</h3>
            <p className="text-xs text-text mt-0.5">Month-by-month study curriculum designed to cover target capabilities.</p>
          </div>

          <div className="overflow-y-auto max-h-[420px] pr-1">
            <RoadmapTimeline roadmap={result.roadmap} />
          </div>
        </div>

        {/* Project & Resource Sidebar (right 1 col) */}
        <div className="w-full min-w-0 space-y-8">
          {/* Projects suggestions */}
          <div className="w-full space-y-3">
            <div className="border-b border-border pb-2">
              <h4 className="text-sm font-bold text-primary">Recommended Projects</h4>
              <p className="text-[10px] text-text">Practice exercises to construct a verified portfolio.</p>
            </div>
            <div className="grid w-full grid-cols-1 gap-3">
              {result.projects.map((proj, idx) => (
                <ProjectCard key={idx} project={proj} />
              ))}
            </div>
          </div>

          {/* Resources links */}
          <div className="w-full space-y-3">
            <div className="border-b border-border pb-2">
              <h4 className="text-sm font-bold text-primary">Curated Education</h4>
              <p className="text-[10px] text-text">Handpicked reference guides to cover technical fundamentals.</p>
            </div>
            <div className="grid w-full grid-cols-1 gap-3">
              {result.resources.map((res, idx) => (
                <ResourceCard key={idx} resource={res} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
