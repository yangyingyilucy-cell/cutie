import type { ModelInfo } from '../types';

const STORAGE_KEYS = {
  settings: 'cutie-settings',
  characters: 'cutie-characters',
  conversations: 'cutie-conversations',
  stories: 'cutie-stories',
  petState: 'cutie-pet-state',
  theme: 'cutie-theme',
};

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

export function exportData(key: string, filename: string): void {
  const raw = localStorage.getItem(key);
  if (!raw) return;
  const blob = new Blob([raw], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(key: string, file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        JSON.parse(reader.result as string);
        localStorage.setItem(key, reader.result as string);
        resolve(true);
      } catch {
        resolve(false);
      }
    };
    reader.onerror = () => resolve(false);
    reader.readAsText(file);
  });
}

export function fetchModels(apiBaseUrl: string, apiKey: string): Promise<ModelInfo[]> {
  const base = apiBaseUrl.replace(/\/+$/, '');
  const url = `${base}/models`;

  return fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (!data?.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format');
      }
      return data.data.map((m: { id: string; owned_by: string }) => ({
        id: m.id,
        owned_by: m.owned_by || 'unknown',
      }));
    });
}

export { STORAGE_KEYS };
