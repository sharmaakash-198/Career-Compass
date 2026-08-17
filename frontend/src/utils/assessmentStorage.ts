const STORAGE_PREFIXES = ['cc_assessment_', 'cc_completed_', 'cc_applied_'];

function getCurrentUserId(): string | null {
  const raw = localStorage.getItem('user_session');
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as { id?: number | string };
    return session.id != null ? String(session.id) : null;
  } catch {
    return null;
  }
}

function scopedKey(base: string): string {
  const userId = getCurrentUserId();
  return userId ? `${base}_u${userId}` : base;
}

export function clearUserAssessmentCache(): void {
  for (let i = localStorage.length - 1; i >= 0; i -= 1) {
    const key = localStorage.key(i);
    if (key && STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
      localStorage.removeItem(key);
    }
  }
}

export function getAssessmentResult(): string | null {
  return localStorage.getItem(scopedKey('cc_assessment_result'));
}

export function setAssessmentResult(value: string): void {
  localStorage.setItem(scopedKey('cc_assessment_result'), value);
}

export function getAssessmentSummary(): string | null {
  return localStorage.getItem(scopedKey('cc_assessment_summary'));
}

export function setAssessmentSummary(value: string): void {
  localStorage.setItem(scopedKey('cc_assessment_summary'), value);
}

export function getAssessmentDetails(): string | null {
  return localStorage.getItem(scopedKey('cc_assessment_details'));
}

export function setAssessmentDetails(value: string): void {
  localStorage.setItem(scopedKey('cc_assessment_details'), value);
}

export function getAssessmentInput(): string | null {
  return localStorage.getItem(scopedKey('cc_assessment_input'));
}

export function setAssessmentInput(value: string): void {
  localStorage.setItem(scopedKey('cc_assessment_input'), value);
}

export function getCompletedTopics(): string | null {
  return localStorage.getItem(scopedKey('cc_completed_topics'));
}

export function setCompletedTopics(value: string): void {
  localStorage.setItem(scopedKey('cc_completed_topics'), value);
}

export function getCompletedProjects(): string | null {
  return localStorage.getItem(scopedKey('cc_completed_projects'));
}

export function setCompletedProjects(value: string): void {
  localStorage.setItem(scopedKey('cc_completed_projects'), value);
}

export function getCompletedResources(): string | null {
  return localStorage.getItem(scopedKey('cc_completed_resources'));
}

export function setCompletedResources(value: string): void {
  localStorage.setItem(scopedKey('cc_completed_resources'), value);
}

export function getAppliedRecommendations(): string | null {
  return localStorage.getItem(scopedKey('cc_applied_recommendations'));
}

export function setAppliedRecommendations(value: string): void {
  localStorage.setItem(scopedKey('cc_applied_recommendations'), value);
}

export function hasCachedAssessmentResult(): boolean {
  return !!getAssessmentSummary() || !!getAssessmentResult();
}

/** ponytail: one-time split of legacy cc_assessment_result into summary/details keys */
export function migrateLegacyAssessmentCacheIfNeeded(): void {
  if (getAssessmentSummary() && getAssessmentDetails()) {
    return;
  }
  const legacy = getAssessmentResult();
  if (!legacy) {
    return;
  }
  try {
    const result = JSON.parse(legacy) as {
      marketFitScore?: number;
      missingSkills?: unknown[];
      roadmap?: unknown[];
      projects?: unknown[];
      resources?: unknown[];
    };
    let currentRole = 'Your Profile';
    let targetRole = 'backend';
    const rawInput = getAssessmentInput();
    if (rawInput) {
      const input = JSON.parse(rawInput) as { currentRole?: string; targetRole?: string };
      if (input.currentRole) currentRole = input.currentRole;
      if (input.targetRole) targetRole = input.targetRole;
    }
    if (!getAssessmentSummary()) {
      setAssessmentSummary(JSON.stringify({
        currentRole,
        targetRole,
        marketFitScore: Number(result.marketFitScore ?? 0),
        missingSkills: result.missingSkills ?? [],
      }));
    }
    if (!getAssessmentDetails()) {
      setAssessmentDetails(JSON.stringify({
        roadmap: result.roadmap ?? [],
        projects: result.projects ?? [],
        resources: result.resources ?? [],
      }));
    }
  } catch {
    // ignore corrupt legacy cache
  }
}
