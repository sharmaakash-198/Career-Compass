import type { AssessmentData, AnalysisResult, SkillGap } from '../types';
import { CAREER_ROLES } from '../data/roles';
import { ROLE_ROADMAPS } from '../data/roadmaps';
import { TECH_TRENDS } from '../data/trends';

export function performAssessment(data: AssessmentData): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    // Simulate API loading network delay of 1.5 seconds for premium UX
    setTimeout(() => {
      const targetRoleConfig = CAREER_ROLES.find(r => r.id === data.targetRole) || CAREER_ROLES[0];
      const targetSkills = targetRoleConfig.requiredSkills;
      
      // Clean and normalize skills for comparison
      const normalizedCurrentSkills = data.currentSkills.map(s => s.trim().toLowerCase());
      
      const matchedSkills = targetSkills.filter(skill => 
        normalizedCurrentSkills.includes(skill.toLowerCase())
      );
      
      // Calculate Market Fit Score: minimum of 25 (transferable skills), maximum 100
      let score = Math.round((matchedSkills.length / targetSkills.length) * 100);
      if (score < 25) score = 25;
      if (score > 100) score = 100;
      
      // Calculate Missing Skills with Priority badges
      const missingSkills: SkillGap[] = targetSkills
        .filter(skill => !normalizedCurrentSkills.includes(skill.toLowerCase()))
        .map((skill, index) => {
          // Assign priority based on core-ness (earlier in required list = higher priority)
          let priority: 'High' | 'Medium' | 'Low' = 'Low';
          if (index < 3) {
            priority = 'High';
          } else if (index < 7) {
            priority = 'Medium';
          }
          return { name: skill, priority };
        });

      // Get preconfigured roadmap data for this role
      const roadmapData = ROLE_ROADMAPS[targetRoleConfig.id] || ROLE_ROADMAPS['backend'];

      // Recommend relevant trending skills based on target role category
      const relevantTrends = TECH_TRENDS.filter(t => {
        if (targetRoleConfig.category === 'Data & AI' && t.category === 'AI & Data') return true;
        if (targetRoleConfig.category === 'Engineering' && (t.category === 'Frameworks' || t.category === 'Languages' || t.category === 'Tools')) return true;
        return t.category === 'Tools';
      }).slice(0, 3).map(t => `${t.name} (+${t.growth}%)`);

      const result: AnalysisResult = {
        marketFitScore: score,
        missingSkills: missingSkills.length > 0 ? missingSkills : [{ name: 'None! You are fully aligned.', priority: 'Low' }],
        trendingSkills: relevantTrends.length > 0 ? relevantTrends : ['Docker (+22%)', 'TypeScript (+15%)'],
        roadmap: roadmapData.roadmap,
        projects: roadmapData.projects,
        resources: roadmapData.resources
      };

      resolve(result);
    }, 1500);
  });
}
