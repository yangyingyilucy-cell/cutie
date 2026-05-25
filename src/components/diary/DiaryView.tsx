import { useState } from 'react';
import { useDiaryStore } from '../../stores/diaryStore';
import { DiaryEditor } from './DiaryEditor';
import { Plus, ChevronLeft, ChevronRight, Edit3, Trash2 } from 'lucide-react';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const MOOD_COLORS: Record<string, string> = {
  '😊': '#ffb6c1',
  '😢': '#a5d8ff',
  '🎉': '#ffd700',
  '😤': '#ffa07a',
  '😐': '#d4c5e8',
};

export function DiaryView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const diaryStore = useDiaryStore();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthEntries = diaryStore.getEntriesByMonth(year, month + 1);
  const entryDates = new Set(monthEntries.map((e) => e.date));
  const selectedEntry = diaryStore.getEntryByDate(selectedDate);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const isToday = (dateStr: string) => dateStr === formatDate(new Date());

  const handleEdit = () => {
    if (selectedEntry) {
      setEditingEntryId(selectedEntry.id);
      setShowEditor(true);
    }
  };

  const handleDelete = () => {
    if (selectedEntry && confirm('确定要删除这篇日志吗？')) {
      diaryStore.deleteEntry(selectedEntry.id);
      setEditingEntryId(null);
    }
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setEditingEntryId(null);
  };

  if (showEditor) {
    return (
      <DiaryEditor
        date={selectedDate}
        editEntry={editingEntryId ? diaryStore.entries.find((e) => e.id === editingEntryId) : undefined}
        onClose={handleEditorClose}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
        <span className="font-medium text-sm">记忆日志</span>
        <button
          onClick={() => setShowEditor(true)}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-[12px] bg-[var(--color-accent)] text-white cursor-pointer hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus size={14} />
          写日志
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Calendar */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1))}
              className="p-1 rounded-full opacity-50 hover:opacity-80 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-sm" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              {year}年 {month + 1}月
            </span>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1))}
              className="p-1 rounded-full opacity-50 hover:opacity-80 cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-center text-[10px] opacity-40 py-1">{w}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              if (d === null) return <div key={`empty-${i}`} />;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const hasEntry = entryDates.has(dateStr);
              const entry = monthEntries.find((e) => e.date === dateStr);
              const isSelected = dateStr === selectedDate;
              const today = isToday(dateStr);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative flex flex-col items-center justify-center aspect-square rounded-[12px] text-sm transition-all cursor-pointer
                    ${isSelected ? 'ring-2 ring-[var(--color-accent)] ring-offset-1 ring-offset-[var(--color-bg-light)] dark:ring-offset-[var(--color-bg-dark)]' : ''}
                    ${today && !isSelected ? 'bg-[var(--color-accent)]/10' : ''}
                    hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)]
                  `}
                  style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
                >
                  <span className={`${today ? 'text-[var(--color-accent)] font-bold' : ''}`}>{d}</span>
                  {hasEntry && entry && (
                    <span
                      className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: MOOD_COLORS[entry.mood] || '#d4c5e8' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom 1/3 preview */}
        <div className="h-1/3 border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] glass-card rounded-none p-4 overflow-y-auto">
          <div className="text-xs opacity-50 mb-2" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
            📅 {selectedDate}
          </div>
          {selectedEntry ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{selectedEntry.mood}</span>
                <span
                  className="font-medium text-sm"
                  style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
                >
                  {selectedEntry.title}
                </span>
                {selectedEntry.isImportant && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-500 dark:bg-red-900/30">
                    重要
                  </span>
                )}
              </div>
              <p
                className="text-xs opacity-60 line-clamp-3 mb-2"
                style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
              >
                {selectedEntry.content.replace(/<[^>]+>/g, '')}
              </p>
              {selectedEntry.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedEntry.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] opacity-60"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-[8px] opacity-50 hover:opacity-80 cursor-pointer hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)]"
                >
                  <Edit3 size={12} /> 编辑
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-[8px] opacity-50 hover:opacity-80 cursor-pointer hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)]"
                >
                  <Trash2 size={12} /> 删除
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
              <span className="text-2xl mb-1">📝</span>
              <p className="text-xs" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                今天还没有记录哦~
              </p>
              <button
                onClick={() => setShowEditor(true)}
                className="mt-2 text-xs text-[var(--color-accent)] cursor-pointer hover:underline"
              >
                写点什么吗？
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
