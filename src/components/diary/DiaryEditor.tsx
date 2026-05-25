import { useState, useRef, useCallback } from 'react';
import { useDiaryStore } from '../../stores/diaryStore';
import type { DiaryEntry, HighlightedRange } from '../../types';
import { GlassButton } from '../ui/GlassCard';
import { ArrowLeft, Underline } from 'lucide-react';

const MOODS = ['😊', '😢', '🎉', '😤', '😐', '🥰', '😰', '🤔', '😴', '🤩'];

export function DiaryEditor({
  date,
  editEntry,
  onClose,
}: {
  date: string;
  editEntry?: DiaryEntry;
  onClose: () => void;
}) {
  const diaryStore = useDiaryStore();
  const [mood, setMood] = useState(editEntry?.mood || '😐');
  const [title, setTitle] = useState(editEntry?.title || '');
  const [content, setContent] = useState(editEntry?.content || '');
  const [isImportant, setIsImportant] = useState(editEntry?.isImportant || false);
  const [highlights, setHighlights] = useState<HighlightedRange[]>(
    editEntry?.highlightedRanges || [],
  );
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleHighlight = useCallback(() => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) return;

    const text = content.slice(start, end);

    // check if already highlighted
    const exists = highlights.find((h) => h.start === start && h.end === end);
    if (exists) {
      setHighlights(highlights.filter((h) => h !== exists));
    } else {
      setHighlights([...highlights, { start, end, text }]);
    }
  }, [content, highlights]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const entryData = {
      date,
      title: title.trim(),
      content: content.trim(),
      mood,
      isImportant,
      highlightedRanges: highlights,
      keywords: highlights.map((h) => h.text),
    };

    if (editEntry) {
      diaryStore.updateEntry(editEntry.id, entryData);
    } else {
      diaryStore.addEntry(entryData);
    }
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-3 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
        <button onClick={onClose} className="opacity-50 hover:opacity-80 cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <span className="font-medium text-sm" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
          {editEntry ? '编辑日志' : '写日志'}
        </span>
        <span className="text-xs opacity-40 ml-2">{date}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Mood selector */}
        <div>
          <label className="text-xs opacity-50 mb-1.5 block">今天的心情</label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`text-xl p-1.5 rounded-[12px] transition-all cursor-pointer ${
                  m === mood
                    ? 'bg-[var(--color-accent)]/20 ring-1 ring-[var(--color-accent)]'
                    : 'hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs opacity-50 mb-1 block">标题</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给今天起个名字吧~"
            className="w-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[12px] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs opacity-50">正文</label>
            <button
              onClick={handleHighlight}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-[8px] opacity-50 hover:opacity-80 cursor-pointer hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)]"
            >
              <Underline size={12} />
              选中文字划重点
            </button>
          </div>
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="记录今天发生的事吧..."
            rows={8}
            className="flex-1 bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[12px] px-3 py-2 text-sm resize-none outline-none focus:border-[var(--color-accent)] transition-colors"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          />
          {/* Highlight preview */}
          {highlights.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] cursor-pointer"
                  onClick={() => setHighlights(highlights.filter((_, j) => j !== i))}
                >
                  ✕ {h.text.slice(0, 15)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Important toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isImportant}
            onChange={(e) => setIsImportant(e.target.checked)}
            className="accent-[var(--color-accent)]"
          />
          <span className="text-sm opacity-70" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
            重要日志（勾选后，AI聊天每次都会读取此日志）
          </span>
        </label>

        {/* Privacy notice */}
        <div className="glass-card p-3 rounded-[12px] text-xs opacity-50 leading-relaxed">
          <p className="font-medium mb-1">🔒 隐私提醒</p>
          <p>你在聊天时，AI 会读取与本日志相关的记忆。</p>
          <p>重要日志会被全部读取，普通日志通过关键词匹配读取。</p>
          <p>请勿记录敏感个人信息（密码、身份证、银行卡等）。</p>
        </div>

        <div className="flex gap-2 pb-4">
          <GlassButton onClick={handleSave} disabled={!title.trim() || !content.trim()}>
            保存
          </GlassButton>
          <GlassButton variant="ghost" onClick={onClose}>
            取消
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
