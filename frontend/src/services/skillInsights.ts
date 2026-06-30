import type { TrendingSkillInsight } from '../types';
import { TRENDING_SKILL_INSIGHTS } from '../data/skillInsights';

/** Swap this for a real API call when the AI agent backend is ready. */
export function fetchTrendingSkillInsights(roleId?: string): Promise<TrendingSkillInsight[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const insights = roleId
        ? TRENDING_SKILL_INSIGHTS.filter((item) => item.roleId === roleId)
        : TRENDING_SKILL_INSIGHTS;
      resolve(insights);
    }, 200);
  });
}
