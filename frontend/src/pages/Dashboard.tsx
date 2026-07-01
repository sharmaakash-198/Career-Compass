import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, RotateCcw, Target, ShieldCheck, Trophy, Sparkles, CheckCircle2, X } from 'lucide-react';
import { SkillGapCard } from '../components/SkillGapCard';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import { ProjectCard } from '../components/ProjectCard';
import { ResourceCard } from '../components/ResourceCard';
import type { AnalysisResult, AssessmentData } from '../types';
import { CAREER_ROLES } from '../data/roles';

interface Recommendation {
  id: string;
  roleId: string;
  type: 'roadmap' | 'resource';
  title: string;
  description: string;
  month?: string;
  skillName?: string;
  resource?: {
    name: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    link: string;
  };
  rationale: string;
}

const WEEKLY_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-fe-roadmap',
    roleId: 'frontend',
    type: 'roadmap',
    title: 'Add Model Context Protocol (MCP) to Month 2',
    description: 'Add "Model Context Protocol (MCP) Integrations" to your Month 2 study roadmap.',
    month: 'Month 2',
    skillName: 'Model Context Protocol (MCP) Integrations',
    rationale: 'Hiring requirements at Anthropic and Google Cloud are demanding MCP orchestration capabilities for UI developer tooling.'
  },
  {
    id: 'rec-fe-resource',
    roleId: 'frontend',
    type: 'resource',
    title: 'Add Anthropic MCP Developer Guide',
    description: 'Add "Anthropic MCP Developer Guide" to your curated resources list.',
    resource: {
      name: 'Anthropic MCP Developer Guide',
      difficulty: 'Advanced',
      duration: '3 hours',
      link: 'https://modelcontextprotocol.org'
    },
    rationale: 'Anthropic\'s official guide is the industry standard for learning client-side protocol orchestration.'
  },
  {
    id: 'rec-be-roadmap',
    roleId: 'backend',
    type: 'roadmap',
    title: 'Add Rust Axum Routing to Month 3',
    description: 'Add "Rust Axum Microservice Routing" to your Month 3 study roadmap.',
    month: 'Month 3',
    skillName: 'Rust Axum Microservice Routing',
    rationale: 'Infrastructure teams at Stripe and Meta are migrating critical API components to Axum for micro-latency processing.'
  },
  {
    id: 'rec-be-resource',
    roleId: 'backend',
    type: 'resource',
    title: 'Add Rust Axum Web Framework Docs',
    description: 'Add "Rust Axum Web Framework Docs" to your curated resources list.',
    resource: {
      name: 'Rust Axum Web Framework Docs',
      difficulty: 'Advanced',
      duration: '5 hours',
      link: 'https://github.com/tokio-rs/axum'
    },
    rationale: 'Axum documentation is vital for understanding concurrent connection pooling and handlers in Rust.'
  },
  {
    id: 'rec-ai-roadmap',
    roleId: 'ai-ml',
    type: 'roadmap',
    title: 'Add LangGraph Networks to Month 1',
    description: 'Add "LangGraph Multi-Agent Coordination Networks" to your Month 1 study roadmap.',
    month: 'Month 1',
    skillName: 'LangGraph Multi-Agent Coordination Networks',
    rationale: 'OpenAI Swarm protocols and stateful agent topologies are becoming standard requirements for enterprise AI orchestrations.'
  },
  {
    id: 'rec-ai-resource',
    roleId: 'ai-ml',
    type: 'resource',
    title: 'Add LangGraph Stateful Agents Guide',
    description: 'Add "LangGraph Stateful Agents Guide" to your curated resources list.',
    resource: {
      name: 'LangGraph Stateful Agents Guide',
      difficulty: 'Advanced',
      duration: '4 hours',
      link: 'https://langchain-ai.github.io/langgraph/'
    },
    rationale: 'LangGraph documentation outlines the core multi-agent state coordination pattern used in production.'
  },
  {
    id: 'rec-default-roadmap',
    roleId: 'all',
    type: 'roadmap',
    title: 'Add Docker Distroless to Month 2',
    description: 'Add "Docker Multi-stage Builds & Distroless Images" to your Month 2 study roadmap.',
    month: 'Month 2',
    skillName: 'Docker Multi-stage Builds & Distroless Images',
    rationale: 'Hiring signals show engineering teams prioritizing minimized container attack vectors and build footprints.'
  },
  {
    id: 'rec-default-resource',
    roleId: 'all',
    type: 'resource',
    title: 'Add Google Distroless Containers Guide',
    description: 'Add "Google Distroless Containers Guide" to your curated resources list.',
    resource: {
      name: 'Google Distroless Containers Guide',
      difficulty: 'Intermediate',
      duration: '2 hours',
      link: 'https://github.com/GoogleContainerTools/distroless'
    },
    rationale: 'Google\'s distroless repository is the foundational reference for compiling minimal container runtime environments.'
  }
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [assessmentInput, setAssessmentInput] = useState<AssessmentData | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [completedProjects, setCompletedProjects] = useState<string[]>([]);
  const [completedResources, setCompletedResources] = useState<string[]>([]);
  const [appliedRecommendations, setAppliedRecommendations] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRecommendationsFlyout, setShowRecommendationsFlyout] = useState(false);

  useEffect(() => {
    const rawInput = localStorage.getItem('cc_assessment_input');
    const rawResult = localStorage.getItem('cc_assessment_result');
    const rawCompleted = localStorage.getItem('cc_completed_topics');
    const rawProjects = localStorage.getItem('cc_completed_projects');
    const rawResources = localStorage.getItem('cc_completed_resources');
    const rawApplied = localStorage.getItem('cc_applied_recommendations');

    if (rawInput && rawResult) {
      setAssessmentInput(JSON.parse(rawInput));
      setResult(JSON.parse(rawResult));
    }
    if (rawCompleted) {
      setCompletedTopics(JSON.parse(rawCompleted));
    }
    if (rawProjects) {
      setCompletedProjects(JSON.parse(rawProjects));
    }
    if (rawResources) {
      setCompletedResources(JSON.parse(rawResources));
    }
    if (rawApplied) {
      setAppliedRecommendations(JSON.parse(rawApplied));
    }
  }, []);

  const handleRetake = () => {
    localStorage.removeItem('cc_assessment_input');
    localStorage.removeItem('cc_assessment_result');
    localStorage.removeItem('cc_completed_topics');
    localStorage.removeItem('cc_completed_projects');
    localStorage.removeItem('cc_completed_resources');
    localStorage.removeItem('cc_applied_recommendations');
    navigate('/assess');
    window.location.reload();
  };

  const handleToggleTopic = (month: string, topic: string) => {
    const topicKey = `${month} - ${topic}`;
    let updated: string[];

    if (completedTopics.includes(topicKey)) {
      updated = completedTopics.filter(t => t !== topicKey);
    } else {
      updated = [...completedTopics, topicKey];
    }

    setCompletedTopics(updated);
    localStorage.setItem('cc_completed_topics', JSON.stringify(updated));
  };

  const handleToggleProject = (projectName: string) => {
    let updated: string[];
    if (completedProjects.includes(projectName)) {
      updated = completedProjects.filter(p => p !== projectName);
    } else {
      updated = [...completedProjects, projectName];
    }
    setCompletedProjects(updated);
    localStorage.setItem('cc_completed_projects', JSON.stringify(updated));
  };

  const handleToggleResource = (resourceName: string) => {
    let updated: string[];
    if (completedResources.includes(resourceName)) {
      updated = completedResources.filter(r => r !== resourceName);
    } else {
      updated = [...completedResources, resourceName];
    }
    setCompletedResources(updated);
    localStorage.setItem('cc_completed_resources', JSON.stringify(updated));
  };

  const handleApplyRecommendation = (rec: Recommendation) => {
    if (!result) return;

    let updatedResult: AnalysisResult = { ...result };

    if (rec.type === 'roadmap' && rec.month && rec.skillName) {
      const updatedRoadmap = result.roadmap.map(item => {
        if (item.month.toLowerCase().includes(rec.month!.toLowerCase())) {
          if (!item.topics.includes(rec.skillName!)) {
            return { ...item, topics: [...item.topics, rec.skillName!] };
          }
        }
        return item;
      });
      updatedResult.roadmap = updatedRoadmap;
    } else if (rec.type === 'resource' && rec.resource) {
      if (!result.resources.some(r => r.name === rec.resource!.name)) {
        updatedResult.resources = [...result.resources, rec.resource!];
      }
    }

    localStorage.setItem('cc_assessment_result', JSON.stringify(updatedResult));
    setResult(updatedResult);

    const updatedApplied = [...appliedRecommendations, rec.id];
    setAppliedRecommendations(updatedApplied);
    localStorage.setItem('cc_applied_recommendations', JSON.stringify(updatedApplied));

    setToastMessage(`Applied Suggestion: ${rec.title}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUndoRecommendation = (rec: Recommendation) => {
    if (!result) return;

    let updatedResult: AnalysisResult = { ...result };

    if (rec.type === 'roadmap' && rec.month && rec.skillName) {
      const updatedRoadmap = result.roadmap.map(item => {
        if (item.month.toLowerCase().includes(rec.month!.toLowerCase())) {
          return {
            ...item,
            topics: item.topics.filter(t => t !== rec.skillName)
          };
        }
        return item;
      });
      updatedResult.roadmap = updatedRoadmap;

      // Reset checked status for this topic if the user had checked it
      const rawCompleted = localStorage.getItem('cc_completed_topics');
      if (rawCompleted) {
        const completedList: string[] = JSON.parse(rawCompleted);
        const updatedCompleted = completedList.filter(t => {
          const lower = t.toLowerCase();
          return !(lower.includes(rec.month!.toLowerCase()) && lower.includes(rec.skillName!.toLowerCase()));
        });
        setCompletedTopics(updatedCompleted);
        localStorage.setItem('cc_completed_topics', JSON.stringify(updatedCompleted));
      }
    } else if (rec.type === 'resource' && rec.resource) {
      updatedResult.resources = result.resources.filter(r => r.name !== rec.resource!.name);

      // Reset checked status for this resource if the user had completed it
      const rawCompletedRes = localStorage.getItem('cc_completed_resources');
      if (rawCompletedRes) {
        const completedResList: string[] = JSON.parse(rawCompletedRes);
        if (completedResList.includes(rec.resource.name)) {
          const updatedCompletedRes = completedResList.filter(r => r !== rec.resource!.name);
          setCompletedResources(updatedCompletedRes);
          localStorage.setItem('cc_completed_resources', JSON.stringify(updatedCompletedRes));
        }
      }
    }

    localStorage.setItem('cc_assessment_result', JSON.stringify(updatedResult));
    setResult(updatedResult);

    const updatedApplied = appliedRecommendations.filter(id => id !== rec.id);
    setAppliedRecommendations(updatedApplied);
    localStorage.setItem('cc_applied_recommendations', JSON.stringify(updatedApplied));

    setToastMessage(`Reverted Suggestion: ${rec.title}`);
    setTimeout(() => setToastMessage(null), 3000);
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

  // Filter recommendations matching the target role or default suggestions
  const activeRecommendations = WEEKLY_RECOMMENDATIONS.filter(
    rec => rec.roleId === assessmentInput.targetRole || rec.roleId === 'all'
  );

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

  // Progress metrics calculation
  const totalRoadmapTopics = result.roadmap.reduce((acc, curr) => acc + curr.topics.length, 0);
  const totalCompletedTopics = completedTopics.filter(topicKey => {
    return result.roadmap.some(item =>
      item.topics.some(topic => `${item.month} - ${topic}` === topicKey)
    );
  }).length;

  const roadmapProgressPercentage = totalRoadmapTopics > 0
    ? Math.round((totalCompletedTopics / totalRoadmapTopics) * 100)
    : 0;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 p-3.5 bg-primary text-white border border-slate-700 rounded-lg shadow-xl text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Slide-out Flyout Panel */}
      {showRecommendationsFlyout && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setShowRecommendationsFlyout(false)}
          />

          {/* Flyout Container */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-border flex flex-col justify-between z-10 animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-primary">AI Recommendation Agent</h3>
                  <p className="text-[10px] text-text">Weekly upskilling curriculum suggestions</p>
                </div>
              </div>
              <button
                onClick={() => setShowRecommendationsFlyout(false)}
                className="p-1 rounded hover:bg-surface text-slate-400 hover:text-primary transition-colors"
                aria-label="Close recommendations panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <p className="text-xs text-text leading-relaxed">
                Our background analyzer scans weekly job requirements. Apply these suggested updates to your roadmap or resources:
              </p>

              <div className="space-y-4">
                {activeRecommendations.map(rec => {
                  const isApplied = appliedRecommendations.includes(rec.id);
                  return (
                    <div key={rec.id} className={`border p-4 rounded flex flex-col justify-between transition-all ${
                      isApplied ? 'border-emerald-500 bg-emerald-50/10' : 'border-border bg-white'
                    }`}>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            rec.type === 'roadmap' ? 'text-blue-700 bg-blue-50 border border-blue-200' : 'text-purple-700 bg-purple-50 border border-purple-200'
                          }`}>
                            {rec.type === 'roadmap' ? 'Roadmap Topic' : 'Reference Resource'}
                          </span>
                          {isApplied && (
                            <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-black">
                              Applied
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-primary mb-1">{rec.title}</h4>
                        <p className="text-[11px] text-text leading-relaxed mb-2">{rec.description}</p>
                        <p className="text-[10px] text-slate-500 italic mb-3">Rationale: {rec.rationale}</p>
                      </div>

                      <div>
                        {isApplied ? (
                          <button
                            onClick={() => handleUndoRecommendation(rec)}
                            className="w-full inline-flex items-center justify-center gap-1 py-1.5 border border-red-200 hover:bg-red-50 text-[10px] font-bold text-red-700 rounded transition-all"
                          >
                            Undo / Revert Suggestion
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApplyRecommendation(rec)}
                            className="w-full inline-flex items-center justify-center gap-1 py-1.5 bg-primary text-white text-[10px] font-bold rounded hover:bg-slate-800 transition-colors"
                          >
                            Add Suggestion
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-surface text-center">
              <button
                onClick={() => setShowRecommendationsFlyout(false)}
                className="px-4 py-2 border border-border bg-white hover:bg-surface text-xs font-bold text-primary rounded transition-all w-full"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

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

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowRecommendationsFlyout(true)}
            id="toggle-recommendations-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-slate-800 text-xs font-bold rounded transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Weekly AI Suggestions</span>
            {activeRecommendations.length > 0 && (
              <span className="ml-1 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {activeRecommendations.length}
              </span>
            )}
          </button>

          <button
            onClick={handleRetake}
            id="dashboard-retake-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border hover:bg-surface text-xs font-bold text-primary rounded transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Assessment
          </button>
        </div>
      </div>

      {/* Main Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
        <div className="border border-border bg-white p-6 rounded flex flex-col justify-between min-h-[360px] lg:col-span-2">
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

      {/* Roadmap & Projects Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-8">
        {/* Timeline (left 2 cols) */}
        <div className="lg:col-span-2 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 mb-4 gap-2">
            <div>
              <h3 className="text-lg font-bold text-primary">Personalized Study Roadmap</h3>
              <p className="text-xs text-text mt-0.5">Month-by-month study curriculum designed to cover target capabilities.</p>
            </div>
            {totalRoadmapTopics > 0 && (
              <div className="flex items-center gap-3 bg-surface border border-border px-3 py-1.5 rounded-lg shrink-0">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-primary uppercase block">Track Progress</span>
                  <span className="text-[11px] font-medium text-text">{totalCompletedTopics} of {totalRoadmapTopics} completed</span>
                </div>
                <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${roadmapProgressPercentage}%` }}
                  />
                </div>
                <span className="text-xs font-black text-primary">{roadmapProgressPercentage}%</span>
              </div>
            )}
          </div>

          <div className="overflow-y-auto max-h-[480px] pr-1">
            <RoadmapTimeline
              roadmap={result.roadmap}
              completedTopics={completedTopics}
              onToggleTopic={handleToggleTopic}
            />
          </div>
        </div>

        {/* Recommended Projects (right 1 col) */}
        <div className="w-full space-y-3">
          <div className="border-b border-border pb-2">
            <h4 className="text-sm font-bold text-primary">Recommended Projects</h4>
            <p className="text-[10px] text-text">Practice exercises to construct a verified portfolio.</p>
          </div>
          <div className="grid w-full grid-cols-1 gap-3">
            {result.projects.map((proj, idx) => (
              <ProjectCard
                key={idx}
                project={proj}
                isCompleted={completedProjects.includes(proj.name)}
                onToggle={() => handleToggleProject(proj.name)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Curated Education Section (Full Width) */}
      <div className="w-full space-y-4 border-t border-border pt-8">
        <div className="border-b border-border pb-2">
          <h4 className="text-lg font-bold text-primary">Curated Education</h4>
          <p className="text-xs text-text">Handpicked reference guides to cover technical fundamentals.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.resources.map((res, idx) => (
            <ResourceCard
              key={idx}
              resource={res}
              isCompleted={completedResources.includes(res.name)}
              onToggle={() => handleToggleResource(res.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
