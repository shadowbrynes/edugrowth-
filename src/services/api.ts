/**
 * ExcelMind Academic Companion - API Client
 * Connects to the Express & MySQL Backend with fallback capability
 */

const API_BASE_URL = 'http://localhost:5000/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('excelmind_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('excelmind_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('excelmind_token');
  localStorage.removeItem('excelmind_user');
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (err: any) {
    console.warn(`[ExcelMind API Notice]: Backend request to ${endpoint} failed (${err.message}). Using local state.`);
    return { success: false, error: err.message, isOffline: true };
  }
};

// Check backend status
export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return await res.json();
  } catch {
    return null;
  }
};
