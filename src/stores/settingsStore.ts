import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings, ModelInfo } from '../types';
import { fetchModels } from '../utils/storage';

interface SettingsStore extends Settings {
  setApiKey: (key: string) => void;
  setApiBaseUrl: (url: string) => void;
  setModel: (model: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'acnh') => void;
  setModels: (models: ModelInfo[]) => void;
  setBackgroundImage: (img: string | null) => void;
  refreshModels: () => Promise<void>;
  isConfigured: () => boolean;
  fetchingModels: boolean;
  modelError: string;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      apiKey: '',
      apiBaseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      theme: 'light',
      models: [],
      backgroundImage: null,
      fetchingModels: false,
      modelError: '',

      setApiKey: (apiKey) => set({ apiKey, modelError: '' }),
      setApiBaseUrl: (apiBaseUrl) => set({ apiBaseUrl, modelError: '' }),
      setModel: (model) => set({ model }),
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      setModels: (models) => set({ models }),
      setBackgroundImage: (backgroundImage) => set({ backgroundImage }),
      refreshModels: async () => {
        const { apiBaseUrl, apiKey } = get();
        if (!apiKey) return;
        set({ fetchingModels: true, modelError: '' });
        try {
          const models = await fetchModels(apiBaseUrl, apiKey);
          set({
            models,
            fetchingModels: false,
            model: models.length > 0 && !get().models.find((m) => m.id === get().model)
              ? models[0].id
              : get().model,
          });
        } catch (e) {
          set({ fetchingModels: false, modelError: (e as Error).message });
        }
      },
      isConfigured: () => {
        const { apiKey, apiBaseUrl, model } = get();
        return !!(apiKey && apiBaseUrl && model);
      },
    }),
    {
      name: 'cutie-settings',
      partialize: (state) => ({
        apiKey: state.apiKey,
        apiBaseUrl: state.apiBaseUrl,
        model: state.model,
        theme: state.theme,
        models: state.models,
        backgroundImage: state.backgroundImage,
      }),
    },
  ),
);
