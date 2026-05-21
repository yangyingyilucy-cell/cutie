import { useState, useRef, useEffect } from 'react';
import { useCharacterStore } from '../../stores/characterStore';

export function PersonalitySelector({
  selectedId,
  onSelectWithContext,
}: {
  selectedId: string;
  onSelectWithContext: (id: string, contextChoice: 'keep' | 'clear') => void;
}) {
  const characters = useCharacterStore((s) => s.characters);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowContextMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative flex items-center gap-2">
      <select
        value={selectedId}
        onChange={(e) => {
          const newId = e.target.value;
          if (newId === selectedId) return;
          setPendingId(newId);
          setShowContextMenu(true);
        }}
        className="bg-transparent text-sm font-medium outline-none cursor-pointer"
      >
        {characters.map((c) => (
          <option key={c.id} value={c.id} className="bg-[var(--color-card-light)] dark:bg-[var(--color-card-dark)]">
            {c.avatar} {c.name}
          </option>
        ))}
      </select>

      {showContextMenu && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 mt-1 glass-card p-1 z-50 shadow-lg min-w-[160px]"
        >
          <button
            onClick={() => {
              if (pendingId) onSelectWithContext(pendingId, 'keep');
              setShowContextMenu(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm rounded-[8px] hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)] cursor-pointer"
          >
            继承当前上下文
          </button>
          <button
            onClick={() => {
              if (pendingId) onSelectWithContext(pendingId, 'clear');
              setShowContextMenu(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm rounded-[8px] hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)] cursor-pointer"
          >
            清空开启新对话
          </button>
        </div>
      )}
    </div>
  );
}
