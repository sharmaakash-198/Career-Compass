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

export interface RoadmapItem {
  month: string;
  topics: string[];
}

export interface RecommendedProject {
  name: string;
  skillsLearned: string[];
  duration: string;
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

export interface TrendingSkillInsight {
  skill: string;
  roleId: string;
  roleName: string;
  growth: number;
  topCompanies: string[];
}
