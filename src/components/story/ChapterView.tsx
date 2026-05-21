import type { Story, StoryOption } from '../../types';

function formatContent(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export function ChapterView({
  story,
  isGenerating,
  streamContent,
  options,
  onSelectOption,
  onCustomInput,
  onStart,
  userInput,
  setUserInput,
}: {
  story: Story;
  isGenerating: boolean;
  streamContent: string;
  options: StoryOption[];
  onSelectOption: (text: string) => void;
  onCustomInput: (input: string) => void;
  onStart: () => void;
  userInput: string;
  setUserInput: (v: string) => void;
}) {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      {story.chapters.length === 0 && !isGenerating && (
        <div className="text-center mt-12">
          <p className="text-sm opacity-50 mb-4">故事已创建，点击下方按钮生成第一章</p>
          <button
            onClick={onStart}
            className="px-6 py-3 rounded-[16px] bg-[var(--color-accent)] text-white cursor-pointer hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            生成第一章
          </button>
        </div>
      )}

      {story.chapters.map((ch) => (
        <div key={ch.number} className="mb-8">
          <h3 className="text-sm font-semibold opacity-50 mb-3">第 {ch.number} 章</h3>
          <div
            className="text-sm leading-relaxed glass-card p-5"
            dangerouslySetInnerHTML={{ __html: formatContent(ch.content) }}
          />
          {ch.choice && (
            <div className="mt-2 text-xs opacity-40 pl-2 border-l-2 border-[var(--color-accent)]">
              选择: {ch.choice}
            </div>
          )}
        </div>
      ))}

      {isGenerating && streamContent && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold opacity-50 mb-3">
            第 {story.chapters.length + 1} 章 (生成中...)
          </h3>
          <div
            className="text-sm leading-relaxed glass-card p-5"
            dangerouslySetInnerHTML={{ __html: formatContent(streamContent) }}
          />
          <span className="inline-block w-1.5 h-4 bg-[var(--color-accent)] ml-1 animate-pulse align-text-bottom rounded-sm" />
        </div>
      )}

      {options.length >= 2 && !isGenerating && (
        <div className="glass-card p-4 mb-4">
          <h4 className="text-sm font-semibold mb-3 opacity-70">选择下一步</h4>
          <div className="flex flex-col gap-2">
            {options.map((opt) => (
              <button
                key={opt.index}
                onClick={() => onSelectOption(opt.text)}
                className="text-left text-sm px-4 py-2.5 rounded-[12px] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)] transition-all cursor-pointer"
              >
                <span className="opacity-40 mr-2">
                  {String.fromCharCode(65 + opt.index)}.
                </span>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isGenerating && story.chapters.length > 0 && options.length === 0 && (
        <div className="glass-card p-4 mb-4">
          <h4 className="text-sm font-semibold mb-3 opacity-70">继续故事</h4>
          <div className="flex gap-2">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="输入接下来的发展方向..."
              className="flex-1 bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[12px] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userInput.trim()) {
                  onCustomInput(userInput);
                }
              }}
            />
            <button
              onClick={() => userInput.trim() && onCustomInput(userInput)}
              disabled={!userInput.trim()}
              className="px-4 py-2 rounded-[12px] bg-[var(--color-accent)] text-white text-sm disabled:opacity-40 cursor-pointer hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              续写
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
