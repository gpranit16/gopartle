import { SubmissionResponse } from '../types/requirement';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function submitRequirement(payload: any): Promise<SubmissionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/requirements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Request failed with status ${response.status}`,
        errors: data.errors,
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message:
        error.message === 'Failed to fetch'
          ? 'Unable to connect to the backend server. Please ensure the backend is running.'
          : error.message || 'An unexpected network error occurred.',
    };
  }
}

export async function fetchRequirement(id: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/requirements/${id}`);
  return response.json();
}

export async function checkBackendHealth(): Promise<{ healthy: boolean; details?: any }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      return { healthy: true, details: data };
    }
    return { healthy: false };
  } catch {
    return { healthy: false };
  }
}
