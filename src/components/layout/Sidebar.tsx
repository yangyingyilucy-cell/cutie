import { MessageCircle, BookOpen, Settings, LogOut } from 'lucide-react';

export type PanelView = 'chat' | 'story' | 'settings';

export function Sidebar({
  active,
  onSelect,
  onHome,
}: {
  active: PanelView;
  onSelect: (v: PanelView) => void;
  onHome: () => void;
}) {
  const items: { key: PanelView; icon: typeof MessageCircle; label: string }[] = [
    { key: 'chat', icon: MessageCircle, label: '聊天' },
    { key: 'story', icon: BookOpen, label: '故事' },
    { key: 'settings', icon: Settings, label: '设置' },
  ];

  return (
    <div className="w-16 h-full flex flex-col items-center py-4 gap-2 border-r border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] glass">
      {items.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
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
      <div className="mt-auto">
        <button
          onClick={onHome}
          className="flex flex-col items-center gap-0.5 w-12 py-2 rounded-[12px] text-xs opacity-40 hover:opacity-70 cursor-pointer transition-all"
          title="返回首页"
        >
          <LogOut size={20} />
          <span className="text-[10px]">首页</span>
        </button>
      </div>
    </div>
  );
}
