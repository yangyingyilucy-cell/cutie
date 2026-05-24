import { useState } from 'react';
import type { Story } from '../../types';
import { Plus } from 'lucide-react';

export function Timeline({
  stories,
  activeStory,
  onSelectStory,
  onCreateStory,
}: {
  stories: Story[];
  activeStory: Story | undefined;
  onSelectStory: (id: string) => void;
  onCreateStory: () => void;
}) {
  const [showChapters, setShowChapters] = useState(true);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold opacity-50 uppercase">故事列表</h4>
        <button
          onClick={onCreateStory}
          className="text-xs opacity-40 hover:opacity-80 cursor-pointer flex items-center gap-0.5"
        >
          <Plus size={12} />
          新建
        </button>
      </div>

      <div className="flex flex-col gap-1 mb-4">
        {stories.length === 0 && (
          <p className="text-xs opacity-30 px-2">暂无故事</p>
        )}
        {stories.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectStory(s.id)}
            className={`text-left px-2 py-1.5 rounded-[8px] text-xs cursor-pointer transition-colors ${
              activeStory?.id === s.id
                ? 'bg-[var(--color-accent)] text-white'
                : 'hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)] opacity-60'
            }`}
          >
            <div className="truncate font-medium">{s.title}</div>
            <div className="opacity-50 text-[10px]">
              {s.chapters.length} 章 · {new Date(s.updatedAt).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>

      {activeStory && (
        <>
          <button
            onClick={() => setShowChapters(!showChapters)}
            className="flex items-center gap-1 text-xs font-semibold opacity-50 uppercase mb-2 cursor-pointer hover:opacity-80"
          >
            <span className={`transition-transform ${showChapters ? 'rotate-90' : ''}`}>▶</span>
            章节
          </button>
          {showChapters && (
            <div className="flex flex-col gap-1">
              {activeStory.chapters.length === 0 && (
                <p className="text-xs opacity-30 px-2">暂无章节</p>
              )}
              {activeStory.chapters.map((ch) => (
                <div
                  key={ch.number}
                  className="text-xs px-2 py-1.5 rounded-[8px] opacity-40 hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)] cursor-pointer"
                >
                  第 {ch.number} 章
                  <span className="ml-1 opacity-40">{ch.content.slice(0, 16)}...</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
