import { useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useChatStore } from '../../stores/chatStore';
import { useStoryStore } from '../../stores/storyStore';
import { usePetStore } from '../../stores/petStore';
import { GlassCard, GlassButton } from '../ui/GlassCard';
import { Eye, EyeOff, RefreshCw, Sun, Moon, Trash2, Loader2 } from 'lucide-react';

export function SettingsPanel() {
  const {
    apiKey,
    apiBaseUrl,
    model,
    theme,
    models,
    fetchingModels,
    modelError,
    setApiKey,
    setApiBaseUrl,
    setModel,
    setTheme,
    refreshModels,
    setModels,
  } = useSettingsStore();

  const [showKey, setShowKey] = useState(false);
  const [customUrl, setCustomUrl] = useState(apiBaseUrl);
  const [customKey, setCustomKey] = useState(apiKey);

  const handleKeyBlur = () => {
    if (customKey !== apiKey) {
      setApiKey(customKey);
    }
  };

  const handleUrlBlur = () => {
    if (customUrl !== apiBaseUrl) {
      setApiBaseUrl(customUrl);
    }
  };

  const handleRefreshModels = async () => {
    if (!apiKey) return;
    setModels([]);
    await refreshModels();
  };

  const handleClearAll = () => {
    if (confirm('确定要清除所有本地数据吗？（聊天记录、故事、宠物状态）')) {
      const chatStore = useChatStore.getState();
      chatStore.conversations.forEach((c) => chatStore.deleteConversation(c.id));
      const storyStore = useStoryStore.getState();
      storyStore.stories.forEach((s) => storyStore.deleteStory(s.id));
      const petStore = usePetStore.getState();
      petStore.setPanelOpen(false);
      localStorage.removeItem('cutie-pet-state');
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <GlassCard>
        <h3 className="text-sm font-semibold mb-3 opacity-70">API 设置</h3>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs opacity-60 mb-1 block">API Base URL</label>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="https://api.openai.com/v1"
              className="w-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[12px] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs opacity-60 mb-1 block">API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                onBlur={handleKeyBlur}
                placeholder="sk-..."
                className="w-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[12px] px-3 py-2 pr-10 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs opacity-60">模型</label>
              <button
                onClick={handleRefreshModels}
                disabled={fetchingModels || !apiKey}
                className="text-xs flex items-center gap-1 opacity-60 hover:opacity-100 disabled:opacity-30"
              >
                {fetchingModels ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RefreshCw size={12} />
                )}
                刷新
              </button>
            </div>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[12px] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
            >
              {models.length === 0 && (
                <option value={model}>{model || '请先配置 API Key 后刷新'}</option>
              )}
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id}
                </option>
              ))}
            </select>
            {modelError && (
              <p className="text-xs text-red-400 mt-1">{modelError}</p>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-sm font-semibold mb-3 opacity-70">主题</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-sm transition-all ${
              theme === 'light'
                ? 'bg-[var(--color-accent)] text-white'
                : 'glass-card hover:bg-[var(--color-border-light)]'
            }`}
          >
            <Sun size={16} /> 浅色
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-sm transition-all ${
              theme === 'dark'
                ? 'bg-[var(--color-accent-dark)] text-white'
                : 'glass-card hover:bg-[var(--color-border-light)]'
            }`}
          >
            <Moon size={16} /> 深色
          </button>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-sm font-semibold mb-3 opacity-70">数据管理</h3>
        <GlassButton variant="danger" onClick={handleClearAll}>
          <Trash2 size={14} className="inline mr-1" />
          清除所有本地数据
        </GlassButton>
      </GlassCard>
    </div>
  );
}
