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

// Helpers to safely read/write localStorage
const readLocal = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};
const writeLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

export const getCachedDomainsList = () => {
  return readLocal('flybeta_tracks_list');
};

export const getCachedDomain = (name) => {
  if (domainCache[name]) return domainCache[name];
  const local = readLocal(`flybeta_track_${name}`);
  if (local) {
    domainCache[name] = local;
    return local;
  }
  return null;
};

export const getDomains = async () => {
  const { data } = await api.get('domains/');
  const results = data.results || data;
  const finalResults = Array.isArray(results) ? results : [];
  writeLocal('flybeta_tracks_list', finalResults);
  return data;
};

export const getDomain = (name) => {
  // Return the active promise if a fetch is already in flight
  if (domainPromises[name]) return domainPromises[name];
  
  // Otherwise, trigger a new network fetch (Stale-While-Revalidate)
  const fetchPromise = api.get(`domains/${name}/`).then(({ data }) => {
    domainCache[name] = data;
    writeLocal(`flybeta_track_${name}`, data);
    // Clear promise so subsequent calls will re-fetch if needed
    delete domainPromises[name];
    return data;
  }).catch((err) => {
    delete domainPromises[name];
    throw err;
  });
  
  domainPromises[name] = fetchPromise;
  return fetchPromise;
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
