import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Domain endpoints ────────────────────────────────────────────────────
export const domainCache = {};
const domainPromises = {};

export const getCachedDomain = (name) => {
  return domainCache[name] || null;
};

export const getDomains = async () => {
  const { data } = await api.get('domains/');
  return data;
};

export const getDomain = (name) => {
  if (domainCache[name]) return Promise.resolve(domainCache[name]);
  
  if (!domainPromises[name]) {
    domainPromises[name] = api.get(`domains/${name}/`).then(({ data }) => {
      domainCache[name] = data;
      return data;
    });
  }
  
  return domainPromises[name];
};

export const prefetchDomain = (name) => {
  if (!domainCache[name]) {
    getDomain(name).catch(() => {}); // silent fail
  }
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

export const reviewCode = async (code, language = 'python') => {
  const { data } = await api.post('ai/reviewer/', { code, language });
  return data;
};

export const extractVideoKnowledge = async (videoUrl) => {
  const { data } = await api.post('ai/synapse/', { video_url: videoUrl });
  return data;
};

export const askOracle = async (message, history) => {
  const { data } = await api.post('ai/oracle/', { message, history });
  return data.reply;
};

export default api;
