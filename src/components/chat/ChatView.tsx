import { useState, useRef, useEffect } from 'react';
import { useCharacterStore } from '../../stores/characterStore';
import { useChatStore } from '../../stores/chatStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { usePetStore } from '../../stores/petStore';
import { streamChat } from '../../services/api';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { PersonalitySelector } from './PersonalitySelector';
import { Sidebar } from 'lucide-react';

export function ChatView({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [inputValue, setInputValue] = useState('');

  const characters = useCharacterStore((s) => s.characters);
  const settings = useSettingsStore();
  const chatStore = useChatStore();
  const { tick, grantExp } = usePetStore();

  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = chatStore.getActiveConversation();
  const activeChar = characters.find((c) => c.id === chatStore.activeCharacterId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, chatStore.streamContent]);

  useEffect(() => {
    if (characters.length > 0 && !chatStore.activeCharacterId) {
      handleSwitchPersonality(characters[0].id, 'keep');
    }
  }, []);

  const handleSwitchPersonality = (characterId: string, contextChoice: 'keep' | 'clear') => {
    if (contextChoice === 'clear') {
      chatStore.clearConversation(characterId);
    }
    chatStore.setActiveCharacter(characterId);
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || chatStore.isStreaming) return;
    if (!settings.isConfigured()) {
      alert('请先在设置中配置 API Key 和模型');
      return;
    }

    const conv = chatStore.getActiveConversation();
    if (!conv) return;

    chatStore.addMessage('user', trimmed);
    setInputValue('');

    tick();
    grantExp(5);

    const char = characters.find((c) => c.id === chatStore.activeCharacterId);
    const systemMsg = char?.systemPrompt.replace(/\{\{user\}\}/g, '用户') || '';

    const messages = [
      { role: 'system' as const, content: systemMsg, id: 'system', timestamp: 0 },
      ...conv.messages,
    ];

    chatStore.setStreaming(true);
    chatStore.setStreamContent('');

    abortRef.current = streamChat(
      settings.apiBaseUrl,
      settings.apiKey,
      settings.model,
      messages,
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-3 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
        <button
          onClick={onToggleSidebar}
          className="opacity-50 hover:opacity-80 cursor-pointer"
        >
          <Sidebar size={20} />
        </button>
        <PersonalitySelector
          selectedId={chatStore.activeCharacterId || ''}
          onSelectWithContext={handleSwitchPersonality}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeChar && (
          <div className="text-center mb-4 opacity-50 text-sm">
            正在与 <span className="font-medium">{activeChar.name}</span> 对话
          </div>
        )}
        <MessageList
          messages={activeConv?.messages || []}
          streamContent={chatStore.streamContent}
          isStreaming={chatStore.isStreaming}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          onStop={handleStop}
          isStreaming={chatStore.isStreaming}
          disabled={!settings.isConfigured()}
          placeholder={
            settings.isConfigured() ? '输入消息... (Enter 发送)' : '请先在设置中配置 API Key'
          }
        />
      </div>
    </div>
  );
}
