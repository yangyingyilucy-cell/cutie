import { useState, useRef, useEffect } from 'react';
import { useCharacterStore } from '../../stores/characterStore';
import { useChatStore } from '../../stores/chatStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { usePetStore } from '../../stores/petStore';
import { useDiaryStore } from '../../stores/diaryStore';
import { streamChat } from '../../services/api';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { PersonalitySelector } from './PersonalitySelector';
import type { ChatMessage } from '../../types';
import { Sidebar, Plus, Trash2 } from 'lucide-react';

export function ChatView({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [inputValue, setInputValue] = useState('');

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

    const isFirst = conv.messages.length === 0;

    chatStore.addMessage('user', trimmed);
    setInputValue('');

    tick();
    grantExp(5);

    const char = characters.find((c) => c.id === chatStore.activeCharacterId);
    const systemMsg = char?.systemPrompt.replace(/\{\{user\}\}/g, '用户') || '';

    const updatedConv = chatStore.getActiveConversation();
    const messages: ChatMessage[] = [
      { role: 'system' as const, content: systemMsg, id: 'system', timestamp: 0 },
    ];

    // inject memory context
    const memoryCtx = diaryStore.buildMemoryContext(trimmed);
    if (memoryCtx) {
      messages.push({
        role: 'system' as const,
        content: memoryCtx,
        id: 'memory',
        timestamp: 0,
      });
    }

    if (isFirst) {
      messages.push({
        role: 'user' as const,
        content: '以上是我希望你扮演的角色设定。以下是我对你说的第一句话，请严格按照角色设定回应我。',
        id: 'separator',
        timestamp: 0,
      });
    }

    messages.push(...(updatedConv?.messages || []));

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

  const handleDeleteMessage = (msgId: string) => {
    chatStore.deleteMessage(msgId);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] flex-wrap">
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
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => chatStore.clearCurrentConversation()}
            disabled={!activeConv || activeConv.messages.length === 0}
            className="text-xs px-2 py-1 rounded-[8px] opacity-50 hover:opacity-80 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)]"
            title="清除当前对话"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() =>
              chatStore.createNewConversation(chatStore.activeCharacterId || '')
            }
            className="text-xs px-2 py-1 rounded-[8px] opacity-50 hover:opacity-80 cursor-pointer hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)]"
            title="开启新对话"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-3 md:p-4 relative"
        style={
          settings.backgroundImage
            ? {
                backgroundImage: `url(${settings.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }
            : undefined
        }
      >
        {settings.backgroundImage && (
          <div className="absolute inset-0 bg-[var(--color-bg-light)]/70 dark:bg-[var(--color-bg-dark)]/70 backdrop-blur-sm" />
        )}
        <div className="relative z-10">
        {activeChar && (
          <div className="text-center mb-3 md:mb-4 opacity-50 text-xs md:text-sm">
            正在与 <span className="font-medium">{activeChar.name}</span> 对话
          </div>
        )}
        <MessageList
          messages={activeConv?.messages || []}
          streamContent={chatStore.streamContent}
          isStreaming={chatStore.isStreaming}
          onDeleteMessage={handleDeleteMessage}
        />
        <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-2 md:p-3 border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
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
