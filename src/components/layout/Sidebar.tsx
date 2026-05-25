import { useState } from 'react';
import { MessageCircle, BookOpen, Settings, LogOut, MessageSquare, Cloud } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useCharacterStore } from '../../stores/characterStore';

export type PanelView = 'chat' | 'story' | 'diary' | 'settings';

export function Sidebar({
  active,
  onSelect,
  onHome,
  isMobile,
  onClose,
}: {
  active: PanelView;
  onSelect: (v: PanelView) => void;
  onHome: () => void;
  isMobile: boolean;
  onClose: () => void;
}) {
  const [showConversations, setShowConversations] = useState(false);
  const chatStore = useChatStore();
  const characters = useCharacterStore((s) => s.characters);

  const activeCharId = chatStore.activeCharacterId;

  const conversations = activeCharId
    ? chatStore.getConversationsByCharacter(activeCharId)
    : [];

  const items: { key: PanelView; icon: typeof MessageCircle; label: string }[] = [
    { key: 'chat', icon: MessageCircle, label: '聊天' },
    { key: 'story', icon: BookOpen, label: '故事' },
    { key: 'diary', icon: Cloud, label: '记忆' },
    { key: 'settings', icon: Settings, label: '设置' },
  ];

  const handleSelect = (v: PanelView) => {
    onSelect(v);
    if (isMobile) onClose();
  };

  const handleSwitchConversation = (convId: string) => {
    chatStore.setActiveConversation(convId);
    if (isMobile) onClose();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col gap-2 w-16">
      <div className="py-4 flex flex-col items-center gap-2">
        {items.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={`flex flex-col items-center gap-0.5 w-12 py-2 rounded-[12px] text-xs transition-all cursor-pointer ${
              active === key
                ? 'bg-[var(--color-accent)] text-white'
                : 'opacity-50 hover:opacity-80 hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)]'
            }`}
            title={label}
          >
            <Icon size={20} />
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
      </div>

      {active === 'chat' && (
        <div className="flex-1 overflow-y-auto border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] pt-2">
          <button
            onClick={() => setShowConversations(!showConversations)}
            className="w-full flex flex-col items-center gap-0.5 py-2 rounded-[12px] text-xs opacity-50 hover:opacity-80 cursor-pointer"
          >
            <MessageSquare size={16} />
            <span className="text-[9px]">对话</span>
          </button>
          {showConversations && conversations.length > 0 && (
            <div className="flex flex-col gap-1 px-1">
              {conversations.map((conv) => {
                const char = characters.find((c) => c.id === conv.characterId);
                const preview = conv.messages.find((m) => m.role === 'user')?.content.slice(0, 15) || '新对话';
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSwitchConversation(conv.id)}
                    className={`text-left p-1 rounded-[8px] text-[10px] cursor-pointer transition-colors ${
                      conv.id === chatStore.activeConversationId
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)] opacity-60'
                    }`}
                    title={preview}
                  >
                    <div className="truncate">{char?.avatar} {preview}</div>
                    <div className="opacity-50 text-[8px]">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="mt-auto pb-4">
        <button
          onClick={() => { onHome(); if (isMobile) onClose(); }}
          className="flex flex-col items-center gap-0.5 w-12 py-2 rounded-[12px] text-xs opacity-40 hover:opacity-70 cursor-pointer transition-all"
          title="返回首页"
        >
          <LogOut size={20} />
          <span className="text-[10px]">首页</span>
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
        <div className="fixed left-0 top-0 bottom-0 z-50 glass border-r border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] md:hidden">
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <div className="w-16 h-full border-r border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-[var(--color-card-light)] dark:bg-[var(--color-card-dark)]">
      {sidebarContent}
    </div>
  );
}
