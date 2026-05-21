import { useState } from 'react';
import { GlassCard, GlassButton } from '../ui/GlassCard';
import { WRITING_STYLES } from '../../utils/writingStyles';

export function StoryCreator({
  onCreate,
}: {
  onCreate: (title: string, background: string, protagonist: string, conflict: string, style: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('');
  const [protagonist, setProtagonist] = useState('');
  const [conflict, setConflict] = useState('');
  const [writingStyle, setWritingStyle] = useState(WRITING_STYLES[0].id);

  const canCreate = title.trim() && background.trim() && protagonist.trim() && conflict.trim();

  return (
    <GlassCard>
      <h3 className="text-sm font-semibold mb-4 opacity-70">创建新故事</h3>
      <div className="flex flex-col gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="故事标题"
          className="w-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[12px] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
        />
        <textarea
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          placeholder="背景设定（世界是什么样子？）"
          rows={2}
          className="w-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[12px] px-3 py-2 text-sm resize-none outline-none focus:border-[var(--color-accent)] transition-colors"
        />
        <input
          value={protagonist}
          onChange={(e) => setProtagonist(e.target.value)}
          placeholder="主角特征（性别、年龄、性格等）"
          className="w-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[12px] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
        />
        <textarea
          value={conflict}
          onChange={(e) => setConflict(e.target.value)}
          placeholder="核心冲突（故事的主要矛盾是什么？）"
          rows={2}
          className="w-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[12px] px-3 py-2 text-sm resize-none outline-none focus:border-[var(--color-accent)] transition-colors"
        />
        <div>
          <label className="text-xs opacity-60 mb-1 block">写作风格</label>
          <div className="grid grid-cols-2 gap-2">
            {WRITING_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setWritingStyle(s.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-[12px] text-sm transition-all cursor-pointer ${
                  writingStyle === s.id
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'glass-card hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)]'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
        <GlassButton onClick={() => onCreate(title, background, protagonist, conflict, writingStyle)} disabled={!canCreate}>
          一键开局，生成第一章
        </GlassButton>
      </div>
    </GlassCard>
  );
}
