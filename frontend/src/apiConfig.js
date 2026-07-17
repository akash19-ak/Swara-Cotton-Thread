const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function getApiUrl(path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const normalizedBase = API_BASE_URL.replace(/\/$/, '');
  return `${normalizedBase}${normalizedPath}`;
}

export function getImageUrl(path) {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/images/')) return path;
  return getApiUrl(path);
}

export const API_BASE = API_BASE_URL;
