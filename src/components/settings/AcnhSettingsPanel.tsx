import { useState } from 'react';
import { Card, Button, Input, Select, Modal } from 'animal-island-ui';
import { useSettingsStore } from '../../stores/settingsStore';
import { useChatStore } from '../../stores/chatStore';
import { useStoryStore } from '../../stores/storyStore';
import { usePetStore } from '../../stores/petStore';

export function AcnhSettingsPanel() {
  const {
    apiKey, apiBaseUrl, model, theme, models,
    fetchingModels, modelError,
    setApiKey, setApiBaseUrl, setModel, setTheme,
    refreshModels,
  } = useSettingsStore();

  const [showClearModal, setShowClearModal] = useState(false);
  const [customUrl, setCustomUrl] = useState(apiBaseUrl);
  const [customKey, setCustomKey] = useState(apiKey);

  const modelOptions = models.length > 0
    ? models.map((m) => ({ key: m.id, label: m.id }))
    : [{ key: model, label: model || '请先配置 API Key 后刷新' }];

  const handleClearAll = () => {
    const cs = useChatStore.getState(); cs.conversations.forEach((c) => cs.deleteConversation(c.id));
    const ss = useStoryStore.getState(); ss.stories.forEach((s) => ss.deleteStory(s.id));
    const ps = usePetStore.getState(); ps.setPanelOpen(false);
    localStorage.removeItem('cutie-pet-state');
    setShowClearModal(false);
    window.location.reload();
  };

  return (
    <div style={{
      maxWidth: 720, margin: '0 auto', padding: 32,
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      {/* API 设置 */}
      <Card color="default">
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#794f27', marginBottom: 20 }}>API 设置</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input placeholder="https://api.openai.com/v1" value={customUrl} onChange={(e: any) => setCustomUrl(e.target.value)} onBlur={() => setApiBaseUrl(customUrl)} />
          <Input placeholder="sk-..." value={customKey} onChange={(e: any) => setCustomKey(e.target.value)} onBlur={() => setApiKey(customKey)} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Select value={model} onChange={setModel} options={modelOptions} />
            </div>
            <Button onClick={refreshModels} disabled={fetchingModels || !apiKey}>
              {fetchingModels ? '...' : '🔄 刷新模型列表'}
            </Button>
          </div>
          {modelError && <p style={{ color: '#e05a5a', fontSize: 12, marginTop: 4 }}>{modelError}</p>}
        </div>
      </Card>

      {/* 主题 */}
      <Card color="default">
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#794f27', marginBottom: 20 }}>主题</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {([
            { key: 'light' as const, label: '☀️ 浅色', desc: '粉紫磨砂玻璃' },
            { key: 'dark' as const, label: '🌙 深色', desc: '暗紫磨砂玻璃' },
            { key: 'acnh' as const, label: '🍃 动物森友会', desc: '暖色羊皮纸' },
          ]).map((t) => (
            <div
              key={t.key}
              onClick={() => setTheme(t.key)}
              style={{
                padding: '14px 28px', borderRadius: 50, cursor: 'pointer', fontSize: 14,
                background: theme === t.key ? '#19c8b9' : 'rgb(247,243,223)',
                color: theme === t.key ? '#fff' : '#725d42',
                border: theme === t.key ? '2.5px solid #11a89b' : '2.5px solid #c4b89e',
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
            >
              <div style={{ fontWeight: 700 }}>{t.label}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 数据管理 */}
      <Card color="app-red">
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>数据管理</h3>
        <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 12 }}>清除所有本地存储的数据，包括聊天记录、故事、日志和宠物状态。此操作不可撤销。</p>
          <Button type="dashed" danger block onClick={() => setShowClearModal(true)}>🗑 清除所有本地数据</Button>
      </Card>

      <Modal
        open={showClearModal}
        title="清除所有数据"
        onClose={() => setShowClearModal(false)}
        onOk={handleClearAll}
        typewriter={false}
      >
        确定要清除所有本地数据吗？包括聊天记录、故事、日志和宠物状态。此操作不可撤销。
      </Modal>
    </div>
  );
}
