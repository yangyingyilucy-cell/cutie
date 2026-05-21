import type { Story } from '../../types';

export function Timeline({ story }: { story: Story }) {
  return (
    <div>
      <h4 className="text-xs font-semibold opacity-50 mb-2 uppercase">章节</h4>
      {story.chapters.length === 0 && (
        <p className="text-xs opacity-30">暂无章节</p>
      )}
      <div className="flex flex-col gap-1">
        {story.chapters.map((ch) => (
          <div key={ch.number} className="text-xs px-2 py-1.5 rounded-[8px] hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)] cursor-pointer">
            第 {ch.number} 章
            <span className="opacity-40 ml-1">
              {ch.content.slice(0, 20)}...
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
