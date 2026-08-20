/**
 * jobApi.js
 * Centralized API client service communicating with the FastAPI backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

async function fetchJson(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.detail || data.message || `HTTP error! status: ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to backend server. Ensure FastAPI is running on http://127.0.0.1:8000');
    }
    throw err;
  }
}

export const jobApi = {
  // Check backend connection health
  async checkHealth() {
    try {
      const res = await fetch('http://127.0.0.1:8000/');
      if (!res.ok) return false;
      const data = await res.json();
      return data.status === 'online';
    } catch {
      return false;
    }
  },

  // Get all jobs with optional deadline sorting and category filtering
  async getAllJobs(sortedByDeadline = false, category = '') {
    const params = new URLSearchParams();
    if (sortedByDeadline) params.append('sorted_by_deadline', 'true');
    if (category) params.append('category', category);

    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJson(`${API_BASE_URL}/jobs${query}`);
  },

  // Search jobs using Trie prefix search endpoint
  async searchJobs(queryText) {
    if (!queryText || !queryText.trim()) {
      return this.getAllJobs();
    }
    const params = new URLSearchParams({ q: queryText.trim() });
    return fetchJson(`${API_BASE_URL}/jobs/search?${params.toString()}`);
  },

  // Get jobs closing within N days using Binary Search endpoint
  async getJobsClosingSoon(days = 7) {
    return fetchJson(`${API_BASE_URL}/jobs/closing-soon?days=${days}`);
  },

  // Get deadline alerts using non-destructive Min-Heap preview
  async getAlerts(days = 7) {
    return fetchJson(`${API_BASE_URL}/alerts?days=${days}`);
  },

  // Trigger email alert summary
  async sendEmailAlert(toEmail, withinDays = 7) {
    return fetchJson(`${API_BASE_URL}/alerts/email`, {
      method: 'POST',
      body: JSON.stringify({
        to_email: toEmail,
        within_days: Number(withinDays),
      }),
    });
  },

  // Add new job posting with duplicate detection
  async createJob(jobPayload) {
    return fetchJson(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      body: JSON.stringify(jobPayload),
    });
  },

  // Get tracker stats
  async getStats() {
    return fetchJson(`${API_BASE_URL}/stats`);
  },
};
