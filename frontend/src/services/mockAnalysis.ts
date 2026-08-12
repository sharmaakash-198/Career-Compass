import type { AssessmentData, AnalysisResult } from '../types';

const BASE_URL = 'http://localhost:8080/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('jwt_token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
}

export async function getUserSkills(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/skills`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }

  return response.json();
}

export async function syncUserSkills(skills: string[]): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/skills`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ skills })
  });

  if (!response.ok) {
    throw new Error('Failed to save skills');
  }

  return response.json();
}

export async function uploadResumeFile(file: File): Promise<string[]> {
  const token = localStorage.getItem('jwt_token');
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/resume/upload`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to upload and scan resume');
  }

  return response.json();
}

export async function performAssessment(data: AssessmentData): Promise<AnalysisResult> {
  const response = await fetch(`${BASE_URL}/assessment`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      currentRole: data.currentRole,
      targetRole: data.targetRole
    })
  });

  if (!response.ok) {
    throw new Error('Failed to perform AI assessment');
  }

  const result: AnalysisResult = await response.json();
  localStorage.setItem('cc_assessment_result', JSON.stringify(result));
  return result;
}

export async function getLatestAssessment(): Promise<AnalysisResult | null> {
  try {
    const response = await fetch(`${BASE_URL}/assessment/latest`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to retrieve latest assessment');
    }

    const result: AnalysisResult = await response.json();
    localStorage.setItem('cc_assessment_result', JSON.stringify(result));
    return result;
  } catch (error) {
    console.error('Error fetching latest assessment from backend:', error);
    // Fallback to local storage if API fails or offline
    const cached = localStorage.getItem('cc_assessment_result');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  }
}
