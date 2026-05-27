import { useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useChatStore } from '../../stores/chatStore';
import { useStoryStore } from '../../stores/storyStore';
import { usePetStore } from '../../stores/petStore';
import { GlassCard, GlassButton } from '../ui/GlassCard';
import { Eye, EyeOff, RefreshCw, Sun, Moon, Trash2, Loader2, Upload, X, Leaf } from 'lucide-react';

export function SettingsPanel() {
  const {
    apiKey,
    apiBaseUrl,
    model,
    theme,
    models,
    fetchingModels,
    modelError,
    backgroundImage,
    setApiKey,
    setApiBaseUrl,
    setModel,
    setTheme,
    setBackgroundImage,
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

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setBackgroundImage(reader.result as string);
    };
    reader.readAsDataURL(file);
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
          <button
            onClick={() => setTheme('acnh')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-sm transition-all ${
              theme === 'acnh'
                ? 'bg-[#19c8b9] text-white'
                : 'glass-card hover:bg-[var(--color-border-light)]'
            }`}
          >
            <Leaf size={16} /> 动物森友会
          </button>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-sm font-semibold mb-3 opacity-70">聊天背景</h3>
        <div className="flex flex-col gap-2">
          {backgroundImage && (
            <div className="relative rounded-[12px] overflow-hidden">
              <img
                src={backgroundImage}
                alt="聊天背景"
                className="w-full h-32 object-cover rounded-[12px] opacity-60"
              />
              <button
                onClick={() => setBackgroundImage(null)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-red-500"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] cursor-pointer opacity-60 hover:opacity-100 transition-all border border-dashed border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
            <Upload size={14} />
            <span className="text-xs">
              {backgroundImage ? '更换背景图片' : '上传背景图片'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="hidden"
            />
          </label>
          <p className="text-[10px] opacity-30">支持 JPG/PNG，文件不超过 2MB。聊天界面将显示为磨砂玻璃效果。</p>
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
