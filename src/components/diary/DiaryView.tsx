import { useState } from 'react';
import { useDiaryStore } from '../../stores/diaryStore';
import { DiaryEditor } from './DiaryEditor';
import { Plus, ChevronLeft, ChevronRight, Edit3, Trash2, Menu } from 'lucide-react';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function DiaryView({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const diaryStore = useDiaryStore();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthEntries = diaryStore.getEntriesByMonth(year, month + 1);
  const selectedEntry = diaryStore.getEntryByDate(selectedDate);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const todayStr = formatDate(new Date());

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

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

  const calendarSection = (
    <div className="flex flex-col h-full md:border-r border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] overflow-hidden">
      {/* Month nav */}
      <div className="flex items-center justify-between px-2 py-2 shrink-0">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1))}
          className="p-1 rounded-full opacity-50 hover:opacity-80 cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="font-semibold text-base" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
          {year}年 {month + 1}月
        </span>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1))}
          className="p-1 rounded-full opacity-50 hover:opacity-80 cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 px-1 shrink-0">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`text-center text-xs py-1.5 font-medium ${
              i === 0 || i === 6 ? 'opacity-40' : 'opacity-50'
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1 px-1 pb-1">
        {days.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const entry = monthEntries.find((e) => e.date === dateStr);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex flex-col items-center justify-center rounded-[12px] text-base md:text-lg transition-all cursor-pointer
                ${isSelected
                  ? 'bg-[var(--color-accent)] text-white shadow-md'
                  : 'bg-[#fdf6fa] dark:bg-[#2f2633] hover:bg-[#f8edf5] dark:hover:bg-[#3a3040]'
                }
                ${isToday && !isSelected ? 'ring-1 ring-[var(--color-accent)]/40' : ''}
              `}
              style={{ fontFamily: "'ZCOOL KuaiLe', cursive", aspectRatio: '1' }}
            >
              <span className={`text-sm md:text-base leading-none ${isToday && !isSelected ? 'text-[var(--color-accent)] font-bold' : ''}`}>
                {d}
              </span>
              {entry && (
                <span className="text-sm md:text-lg leading-none mt-0.5">{entry.mood}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const detailSection = (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] shrink-0">
        <div>
          <span className="text-sm font-medium opacity-70">📅 {selectedDate}</span>
        </div>
        <button
          onClick={() => { setSelectedDate(selectedDate); setShowEditor(true); }}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-[12px] bg-[var(--color-accent)] text-white cursor-pointer hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus size={14} />
          {selectedEntry ? '编辑' : '写日志'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {selectedEntry ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{selectedEntry.mood}</span>
              <span className="font-medium text-base" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                {selectedEntry.title}
              </span>
              {selectedEntry.isImportant && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-500 dark:bg-red-900/30">
                  重要
                </span>
              )}
            </div>

            <p
              className="text-sm opacity-75 leading-relaxed whitespace-pre-wrap mb-4"
              style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
            >
              {selectedEntry.content}
            </p>

            {selectedEntry.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {selectedEntry.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] opacity-60"
                  >
                    🏷 {kw}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-auto">
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-[8px] opacity-50 hover:opacity-80 cursor-pointer hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)]"
              >
                <Edit3 size={13} /> 编辑
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-[8px] opacity-50 hover:opacity-80 cursor-pointer hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)]"
              >
                <Trash2 size={13} /> 删除
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <span className="text-3xl mb-2">📝</span>
            <p className="text-sm" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              今天还没有记录哦~
            </p>
            <button
              onClick={() => setShowEditor(true)}
              className="mt-2 text-sm text-[var(--color-accent)] cursor-pointer hover:underline"
            >
              写点什么吗？
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] shrink-0">
        <button onClick={onToggleSidebar} className="opacity-50 hover:opacity-80 cursor-pointer md:hidden">
          <Menu size={20} />
        </button>
        <span className="font-medium text-sm">记忆</span>
        <div className="w-5 md:hidden" />
      </div>

      {/* Main content: desktop = left/right, mobile = top/bottom */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop: side by side */}
        <div className="hidden md:flex h-full">
          <div className="w-[55%]">{calendarSection}</div>
          <div className="w-[45%]">{detailSection}</div>
        </div>

        {/* Mobile: top/bottom, calendar half + detail half */}
        <div className="flex flex-col md:hidden h-full">
          <div className="h-[55%]">{calendarSection}</div>
          <div className="h-[45%]">{detailSection}</div>
        </div>
      </div>
    </div>
  );
}
