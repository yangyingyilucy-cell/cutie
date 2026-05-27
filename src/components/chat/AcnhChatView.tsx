import { useState, useRef, useEffect } from 'react';
import { Card, Button, Input, Cursor, Select, Modal } from 'animal-island-ui';
import { useCharacterStore } from '../../stores/characterStore';
import { useChatStore } from '../../stores/chatStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { usePetStore } from '../../stores/petStore';
import { useDiaryStore } from '../../stores/diaryStore';
import { streamChat } from '../../services/api';

function formatContent(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export function AcnhChatView() {
  const [inputValue, setInputValue] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);

  const characters = useCharacterStore((s) => s.characters);
  const settings = useSettingsStore();
  const chatStore = useChatStore();
  const { tick, grantExp } = usePetStore();
  const diaryStore = useDiaryStore();

  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = chatStore.getActiveConversation();
  const activeChar = characters.find((c) => c.id === chatStore.activeCharacterId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, chatStore.streamContent]);

  useEffect(() => {
    if (characters.length > 0 && !chatStore.activeCharacterId) {
      handleSwitchPersonality(characters[0].id);
    }
  }, []);

  const handleSwitchPersonality = (characterId: string) => {
    chatStore.setActiveCharacter(characterId);
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || chatStore.isStreaming) return;
    if (!settings.isConfigured()) {
      setShowApiModal(true);
      return;
    }

    const conv = chatStore.getActiveConversation();
    if (!conv) return;

    const isFirst = conv.messages.length === 0;
    chatStore.addMessage('user', trimmed);
    setInputValue('');
    tick();
    grantExp(5);

    const char = characters.find((c) => c.id === chatStore.activeCharacterId);
    const systemMsg = char?.systemPrompt.replace(/\{\{user\}\}/g, '用户') || '';

    const updatedConv = chatStore.getActiveConversation();
    const messages: { role: string; content: string }[] = [
      { role: 'system', content: systemMsg },
    ];

    const memoryCtx = diaryStore.buildMemoryContext(trimmed);
    if (memoryCtx) {
      messages.push({ role: 'system', content: memoryCtx });
    }

    if (isFirst) {
      messages.push({
        role: 'user',
        content: '以上是我希望你扮演的角色设定。以下是我对你说的第一句话，请严格按照角色设定回应我。',
      });
    }

    messages.push(...(updatedConv?.messages || []));

    chatStore.setStreaming(true);
    chatStore.setStreamContent('');

    abortRef.current = streamChat(
      settings.apiBaseUrl,
      settings.apiKey,
      settings.model,
      messages as any,
      (chunk) => chatStore.appendStreamContent(chunk),
      () => chatStore.finishStream(),
      (err) => {
        chatStore.addMessage('assistant', `错误: ${err.message}`);
        chatStore.setStreaming(false);
        chatStore.setStreamContent('');
      },
    );
  };

  const handleStop = () => {
    abortRef.current?.abort();
    chatStore.finishStream();
  };

  const charOptions = characters.map((c) => ({ key: c.id, label: `${c.avatar} ${c.name}` }));

  return (
    <Cursor>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f8f0' }}>
        {/* Header */}
        <div
          style={{
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '2px solid #d4c9b4',
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: '#794f27' }}>💬 聊天</span>
          <div style={{ width: 200, marginBottom: 0 }}>
            <Select
              value={chatStore.activeCharacterId || characters[0]?.id || ''}
              onChange={handleSwitchPersonality}
              options={charOptions}
            />
          </div>
          <div style={{ flex: 1 }} />
          <Button
            size="small"
            onClick={() => setShowClearModal(true)}
            disabled={!activeConv || activeConv.messages.length === 0}
          >
            清除
          </Button>
          <Button
            size="small"
            onClick={() => chatStore.createNewConversation(chatStore.activeCharacterId || '')}
          >
            新对话
          </Button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {activeChar && (
            <div style={{ textAlign: 'center', marginBottom: 12, color: '#9f927d', fontSize: 13 }}>
              正在与 {activeChar.name} 对话
            </div>
          )}
          {activeConv?.messages
            .filter((m) => m.role !== 'system')
            .map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 12,
                }}
              >
                <Card
                  color={msg.role === 'user' ? 'app-pink' : 'default'}
                  style={{ maxWidth: '75%' }}
                >
                  <div
                    style={{ fontSize: 14, color: '#725d42' }}
                    dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                  />
                </Card>
              </div>
            ))}
          {chatStore.isStreaming && chatStore.streamContent && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
              <Card color="default" style={{ maxWidth: '75%' }}>
                <div style={{ fontSize: 14, color: '#725d42' }}>
                  <span dangerouslySetInnerHTML={{ __html: formatContent(chatStore.streamContent) }} />
                  <span
                    style={{
                      display: 'inline-block',
                      width: 2,
                      height: 16,
                      background: '#19c8b9',
                      marginLeft: 2,
                    }}
                  />
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '2px solid #d4c9b4',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1 }}>
            <Input
              placeholder="输入消息... (Enter 发送)"
              value={inputValue}
              onChange={(e: any) => setInputValue(e.target.value)}
              onKeyDown={(e: any) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={!settings.isConfigured()}
            />
          </div>
          {chatStore.isStreaming ? (
            <Button type="primary" danger onClick={handleStop}>
              停止
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleSend}
              disabled={!inputValue.trim()}
              style={{ background: '#82d5bb', borderColor: '#6fbda3', color: '#fff', fontWeight: 700 }}
            >
              发送
            </Button>
          )}
        </div>
      </div>

      <Modal
        open={showClearModal}
        title="清除对话"
        onClose={() => setShowClearModal(false)}
        onOk={() => { chatStore.clearCurrentConversation(); setShowClearModal(false); }}
        typewriter={false}
      >
        确定要清除当前对话的所有消息吗？此操作不可撤销。
      </Modal>

      <Modal
        open={showApiModal}
        title="未配置 API"
        onClose={() => setShowApiModal(false)}
        typewriter={false}
        footer={null}
      >
        请先在设置中配置 API Key 和模型，才能开始聊天。
      </Modal>
    </Cursor>
  );
}
