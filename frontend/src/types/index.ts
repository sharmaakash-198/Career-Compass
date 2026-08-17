export interface TrendChartPoint {
  name: string; // e.g. "Jan", "Feb"
  growth: number; // percentage
}

export interface TechTrend {
  name: string;
  growth: number; // overall growth percentage
  category: 'Languages' | 'Frameworks' | 'Tools' | 'AI & Data';
  description: string;
  history: TrendChartPoint[];
}

export interface CareerRole {
  id: string;
  name: string;
  category: 'Engineering' | 'Design' | 'Product' | 'Data & AI';
  requiredSkills: string[];
}

export interface RoadmapTopic {
  title: string;
  description?: string;
  category?: 'Core' | 'Tooling' | 'Practice' | 'Architecture' | 'General';
}

export interface RoadmapItem {
  month: string;
  topics: (string | RoadmapTopic)[];
}

export interface RecommendedProject {
  name: string;
  skillsLearned: string[];
  duration: string;
  description?: string;
}

export interface LearningResource {
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  link: string;
}

export interface SkillGap {
  name: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface AssessmentData {
  currentRole: string;
  currentSkills: string[];
  targetRole: string;
}

export interface AnalysisResult {
  marketFitScore: number;
  missingSkills: SkillGap[];
  trendingSkills: string[];
  roadmap: RoadmapItem[];
  projects: RecommendedProject[];
  resources: LearningResource[];
}

export interface AssessmentSummary {
  assessmentId?: number;
  currentRole: string;
  targetRole: string;
  marketFitScore: number;
  missingSkills: SkillGap[];
  strengths?: string[];
  weaknesses?: string[];
  summary?: string;
  careerAdvice?: string;
}

export interface AssessmentDetails {
  roadmap: RoadmapItem[];
  projects: RecommendedProject[];
  resources: LearningResource[];
}

export function mergeAssessment(summary: AssessmentSummary, details: AssessmentDetails): AnalysisResult {
  return {
    marketFitScore: summary.marketFitScore,
    missingSkills: summary.missingSkills,
    trendingSkills: [],
    roadmap: details.roadmap,
    projects: details.projects,
    resources: details.resources,
  };
}

export type AssessmentJobStatusValue = 'QUEUED' | 'RUNNING' | 'DONE' | 'FAILED';

export interface AssessmentJobStatus {
  jobId: number;
  status: AssessmentJobStatusValue;
  step?: number;
  stepMessage?: string;
  errorMessage?: string;
  result?: AnalysisResult;
}

export interface TrendingSkillInsight {
  skill: string;
  roleId: string;
  roleName: string;
  growth: number;
  topCompanies: string[];
}
