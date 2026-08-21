import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Domain endpoints ────────────────────────────────────────────────────
export const getDomains = async () => {
  const { data } = await api.get('domains/');
  return data;
};

export const getDomain = async (name) => {
  const { data } = await api.get(`domains/${name}/`);
  return data;
};

// ── Level endpoints ─────────────────────────────────────────────────────
export const getLevels = async (domainName) => {
  const params = domainName ? { domain: domainName } : {};
  const { data } = await api.get('levels/', { params });
  return data;
};

export const getLevel = async (id) => {
  const { data } = await api.get(`levels/${id}/`);
  return data;
};

// ── Lesson endpoints ────────────────────────────────────────────────────
export const getLessons = async (levelId) => {
  const params = levelId ? { level: levelId } : {};
  const { data } = await api.get('lessons/', { params });
  return data;
};

export const getLesson = async (id) => {
  const { data } = await api.get(`lessons/${id}/`);
  return data;
};
// ── User endpoints ──────────────────────────────────────────────────────
export const getUserStats = async () => {
  const { data } = await api.get('users/me/');
  return data;
};

export const completeLesson = async (lessonId) => {
  const { data } = await api.post(`lessons/${lessonId}/complete/`);
  return data;
};

// ── AI endpoints ────────────────────────────────────────────────────────
export const generateBlueprint = async (prompt) => {
  const { data } = await api.post('ai/architect/', { prompt });
  return data;
};

export default api;
