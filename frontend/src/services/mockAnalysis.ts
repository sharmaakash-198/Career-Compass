import type {
  AnalysisResult,
  AssessmentData,
  AssessmentDetails,
  AssessmentJobStatus,
  AssessmentSummary,
} from '../types';
import { mergeAssessment } from '../types';
import {
  setAssessmentDetails,
  setAssessmentResult,
  setAssessmentSummary,
} from '../utils/assessmentStorage';
import { fetchWithAuth } from '../utils/auth';

const BASE_URL = 'http://localhost:8080/api';

function jsonHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}

function mapSummaryResponse(data: Record<string, unknown>): AssessmentSummary {
  return {
    assessmentId: data.assessmentId != null ? Number(data.assessmentId) : undefined,
    currentRole: String(data.currentRole ?? 'Your Profile'),
    targetRole: String(data.targetRole ?? 'backend'),
    marketFitScore: Number(data.marketFitScore ?? 0),
    missingSkills: (data.missingSkills as AssessmentSummary['missingSkills']) ?? [],
    strengths: (data.strengths as string[]) ?? [],
    weaknesses: (data.weaknesses as string[]) ?? [],
    summary: data.summary != null ? String(data.summary) : undefined,
    careerAdvice: data.careerAdvice != null ? String(data.careerAdvice) : undefined,
  };
}

function mapDetailsResponse(data: Record<string, unknown>): AssessmentDetails {
  return {
    roadmap: (data.roadmap as AssessmentDetails['roadmap']) ?? [],
    projects: (data.projects as AssessmentDetails['projects']) ?? [],
    resources: (data.resources as AssessmentDetails['resources']) ?? [],
  };
}

function mapAssessmentResponse(data: Record<string, unknown>): AnalysisResult {
  const summary = mapSummaryResponse(data);
  const details = mapDetailsResponse(data);
  return mergeAssessment(summary, details);
}

export function persistAssessmentParts(summary: AssessmentSummary, details: AssessmentDetails): AnalysisResult {
  const merged = mergeAssessment(summary, details);
  setAssessmentSummary(JSON.stringify(summary));
  setAssessmentDetails(JSON.stringify(details));
  setAssessmentResult(JSON.stringify(merged));
  return merged;
}

export async function getUserSkills(): Promise<string[]> {
  const response = await fetchWithAuth(`${BASE_URL}/skills`, {
    method: 'GET',
    headers: jsonHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }

  return response.json();
}

export async function syncUserSkills(skills: string[]): Promise<string[]> {
  const response = await fetchWithAuth(`${BASE_URL}/skills`, {
    method: 'PUT',
    headers: jsonHeaders(),
    body: JSON.stringify({ skills })
  });

  if (!response.ok) {
    throw new Error('Failed to save skills');
  }

  return response.json();
}

export async function uploadResumeFile(file: File): Promise<string[]> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetchWithAuth(`${BASE_URL}/resume/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to upload and scan resume');
  }

  return response.json();
}

export async function startAssessmentJob(data: AssessmentData): Promise<{ jobId: number }> {
  const response = await fetchWithAuth(`${BASE_URL}/assessment/jobs`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({
      currentRole: data.currentRole,
      targetRole: data.targetRole
    })
  });

  if (!response.ok) {
    throw new Error('Failed to start assessment');
  }

  return response.json();
}

export async function getAssessmentJob(jobId: number): Promise<AssessmentJobStatus> {
  const response = await fetchWithAuth(`${BASE_URL}/assessment/jobs/${jobId}`, {
    method: 'GET',
    headers: jsonHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch assessment job status');
  }

  const payload = await response.json();
  return {
    jobId: payload.jobId,
    status: payload.status,
    step: payload.step,
    stepMessage: payload.stepMessage,
    errorMessage: payload.errorMessage,
    result: payload.result ? mapAssessmentResponse(payload.result) : undefined,
  };
}

export async function performAssessment(data: AssessmentData): Promise<AnalysisResult> {
  const response = await fetchWithAuth(`${BASE_URL}/assessment`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({
      currentRole: data.currentRole,
      targetRole: data.targetRole
    })
  });

  if (!response.ok) {
    throw new Error('Failed to perform AI assessment');
  }

  const payload = await response.json();
  const summary = mapSummaryResponse(payload);
  const details = mapDetailsResponse(payload);
  return persistAssessmentParts(summary, details);
}

export async function getAssessmentSummary(): Promise<AssessmentSummary | null> {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/assessment/latest/summary`, {
      method: 'GET',
      headers: jsonHeaders()
    });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to retrieve assessment summary');
    }

    const summary = mapSummaryResponse(await response.json());
    setAssessmentSummary(JSON.stringify(summary));
    return summary;
  } catch (error) {
    console.error('Error fetching assessment summary:', error);
    return null;
  }
}

export async function getAssessmentDetails(): Promise<AssessmentDetails | null> {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/assessment/latest/details`, {
      method: 'GET',
      headers: jsonHeaders()
    });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to retrieve assessment details');
    }

    const details = mapDetailsResponse(await response.json());
    setAssessmentDetails(JSON.stringify(details));
    return details;
  } catch (error) {
    console.error('Error fetching assessment details:', error);
    return null;
  }
}

export async function getLatestAssessment(): Promise<AnalysisResult | null> {
  const summary = await getAssessmentSummary();
  if (!summary) {
    return null;
  }
  const details = await getAssessmentDetails();
  if (!details) {
    return mergeAssessment(summary, { roadmap: [], projects: [], resources: [] });
  }
  return persistAssessmentParts(summary, details);
}
