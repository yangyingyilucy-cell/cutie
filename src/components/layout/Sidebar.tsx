import { useState } from 'react';
import { MessageCircle, BookOpen, Settings, LogOut, MessageSquare, Cloud } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useCharacterStore } from '../../stores/characterStore';
import { useSettingsStore } from '../../stores/settingsStore';

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
  const theme = useSettingsStore((s) => s.theme);
  const isAcnh = theme === 'acnh';

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

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const sidebarContent = (
    <div className="h-full flex flex-col gap-2 w-16">
      <div className="py-4 flex flex-col items-center gap-2">
        {items.map(({ key, icon: Icon, label }) => {
          const isActive = active === key;
          const isHovered = hoveredKey === key;
          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              onMouseEnter={() => setHoveredKey(key)}
              onMouseLeave={() => setHoveredKey(null)}
              className={`flex flex-col items-center gap-0.5 w-12 py-2 rounded-[12px] text-xs transition-all duration-150 cursor-pointer`}
              style={{
                backgroundColor: isAcnh
                  ? isActive
                    ? '#B7C6E5'
                    : isHovered
                      ? '#d6dff0'
                      : 'transparent'
                  : isActive
                    ? 'var(--color-accent)'
                    : isHovered
                      ? 'var(--color-bg-light)'
                      : 'transparent',
                color: isAcnh
                  ? isActive
                    ? '#fff'
                    : '#8a7b66'
                  : isActive
                    ? '#fff'
                    : undefined,
                opacity: !isAcnh && !isActive ? 0.5 : undefined,
              }}
              title={label}
            >
              <Icon size={20} />
              <span className="text-[10px]">{label}</span>
            </button>
          );
        })}
      </div>

      {active === 'chat' && (
        <div
          className="flex-1 overflow-y-auto pt-2"
          style={isAcnh ? { borderTop: '2px solid #d4c9b4' } : { borderTop: '1px solid var(--color-border-light)' }}
        >
          <button
            onClick={() => setShowConversations(!showConversations)}
            className="w-full flex flex-col items-center gap-0.5 py-2 rounded-[12px] text-xs cursor-pointer"
            style={{ opacity: 0.5 }}
          >
            <MessageSquare size={16} />
            <span className="text-[9px]">对话</span>
          </button>
          {showConversations && conversations.length > 0 && (
            <div className="flex flex-col gap-1 px-1">
              {conversations.map((conv) => {
                const char = characters.find((c) => c.id === conv.characterId);
                const preview = conv.messages.find((m) => m.role === 'user')?.content.slice(0, 15) || '新对话';
                const isActive = conv.id === chatStore.activeConversationId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSwitchConversation(conv.id)}
                    className={`text-left p-1 rounded-[8px] text-[10px] cursor-pointer transition-colors`}
                    style={{
                      backgroundColor: isActive
                        ? isAcnh ? '#B7C6E5' : 'var(--color-accent)'
                        : 'transparent',
                      color: isActive ? '#fff' : isAcnh ? '#8a7b66' : undefined,
                    }}
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
        <div
          className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
          style={
            isAcnh
              ? {
                  background: '#f8f8f0',
                  borderRight: '2px solid #d4c9b4',
                }
              : {
                  background: 'var(--color-glass-bg-light)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--color-glass-border-light)',
                  borderRight: '1px solid var(--color-border-light)',
                }
          }
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <div
      className="w-16 h-full"
      style={
        isAcnh
          ? {
              background: '#f8f8f0',
              borderRight: '2px solid #d4c9b4',
            }
          : {
              borderRight: '1px solid var(--color-border-light)',
              background: 'var(--color-card-light)',
            }
      }
    >
      {sidebarContent}
    </div>
  );
}
