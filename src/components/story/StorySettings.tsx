import type { Story } from '../../types';
import { GlassButton } from '../ui/GlassCard';

export function StorySettingsPanel({
  story,
  onSave,
  onClose,
}: {
  story: Story;
  onSave: (settings: { userCharacter: string; viewpoint: 'first' | 'third'; wordCount: number; outputFormat: string }) => void;
  onClose: () => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    onSave({
      userCharacter: (fd.get('userCharacter') as string) || '',
      viewpoint: (fd.get('viewpoint') as string) as 'first' | 'third',
      wordCount: Number(fd.get('wordCount')) || 800,
      outputFormat: (fd.get('outputFormat') as string) || '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative glass-card p-5 w-full max-w-sm max-h-[80vh] overflow-y-auto flex flex-col gap-3 z-10"
      >
        <h3 className="text-sm font-semibold opacity-70">故事设定</h3>

        <div>
          <label className="text-xs opacity-60 mb-1 block">你的角色</label>
          <input
            name="userCharacter"
            defaultValue={story.userCharacter}
            placeholder="你在故事中的身份（如旁观者、邻家少年）"
            className="w-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[12px] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>

        <div>
          <label className="text-xs opacity-60 mb-1 block">叙事视角</label>
          <div className="flex gap-2">
            <label className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-[12px] text-sm cursor-pointer transition-all ${
              story.viewpoint === 'first'
                ? 'bg-[var(--color-accent)] text-white'
                : 'glass-card hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)]'
            }`}>
              <input
                type="radio"
                name="viewpoint"
                value="first"
                defaultChecked={story.viewpoint === 'first'}
                className="sr-only"
              />
              第一人称
            </label>
            <label className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-[12px] text-sm cursor-pointer transition-all ${
              story.viewpoint === 'third'
                ? 'bg-[var(--color-accent)] text-white'
                : 'glass-card hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)]'
            }`}>
              <input
                type="radio"
                name="viewpoint"
                value="third"
                defaultChecked={story.viewpoint === 'third'}
                className="sr-only"
              />
              第三人称
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs opacity-60 mb-1 block">每章目标字数</label>
          <input
            type="number"
            name="wordCount"
            defaultValue={story.wordCount}
            min={200}
            max={10000}
            step={100}
            className="w-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[12px] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>

        <div>
          <label className="text-xs opacity-60 mb-1 block">输出格式</label>
          <input
            name="outputFormat"
            defaultValue={story.outputFormat}
            placeholder="如：纯叙述、对话为主、散文风格"
            className="w-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[12px] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>

        <div className="flex gap-2">
          <GlassButton type="submit">保存</GlassButton>
          <GlassButton variant="ghost" onClick={onClose}>取消</GlassButton>
        </div>
      </form>
    </div>
  );
}
